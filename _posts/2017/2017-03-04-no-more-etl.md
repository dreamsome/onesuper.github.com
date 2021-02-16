---
layout: post
title: "不写ETL代码可能吗"
category: technium
tags: [reading, data]
---

[这篇美团点评技术团队的博客](https://zhuanlan.zhihu.com/p/24647817)介绍了一个特征抽取框架。使用这个框架开发人员只需要加几个配置文件，就可以把事务事实表中的原始数据加工成线上可以直接使用的特征数据，而不是写 ETL 代码。

因为大部分的特征都可以归结为：在某几个维度上的，对一些对象，针对某些度量，进行某类统计。


以一段 SQL 为例

```
SELECT 
   uuid,    // 对象，每一个用户
   price,   // 维度：下单金额
   percentile(order) AS price_order_dist // 度量：用户下单额，统计：分位点函数
FROM users
GROUP BY uuid, price
```

* **对象**就是统计对象类似关系数据库中的实体，例如由 uuid 唯一标识的用户
* **维度**是进行统计时所需要关注得变量，例如用户的年龄、使用平台、下单金额
* **度量**是有物理意义的量化值，例如下单金额、曝光次数
* **统计**则是针对度量值进一步的加工处理结果，例如求一个分布/占比，或者就是简单地累加一下


这个框架会把下面这个 [TOML](https://github.com/toml-lang/toml) 格式的配置文件转化为等价的 Spark 代码：


```
[Group]
   column = ["uuid"] 


[Decay]
   columm = "dt"
   end = 时间戳
   factor = 衰减因子

[[Distribution]]
   dimension = "price"
   [[Distribution.Volume]]
      column = "order"
      name = "price_order_dist"
      stat = "percentile"
```



如果考虑时间维度的衰减，计算应该分为两个阶段，得到每一天的度量值，然后根据时间进行衰减，之后再进行累加：

```
SELECT
  uuid,
  price,
  percentile(sum(decay_value))  // 对加权以后的度量值再进行统计计算
FROM
  (SELECT 
     uuid,   // 统计对象，每一个用户
     price,  // 统计维度：下单金额
     dt,     // 时间维度
     order * log(factor) * (dt - end) AS decay_value
  FROM users
  GROUP BY uuid, dt, price) t
GROUP BY uuid, price
```

每一次计算时，所有历史的值都会参与计算，更老的值会衰减得更严重，在加权之后的总和中影响因素更小。这里也可以考虑只计算最近一段时间的（例如七天）用户的下单数据，并求平均，不过这种方法有明显的缺点（引入了阈值）。

数据的同步也是整个框架很重要的一部分：因为数据落地在 HDFS 中，线上的应用无法直接（随机）访问，因此需要把特征推送到线上的 KV 存储中。同步方式就是应该就是起一个 MapReduce 任务把数据全量 Scan 出来，然后在 mapper 中迭代写入 KV 中。

而维度数据其实是一个 `Map<K, Map<K, V>>` 结构，在存储到 KV 时其实是一个复杂数据类型，这部分的逻辑要么借助于 KV 系统本身的类型系统 （如 Cassandra），要么就自己在 MapReduce 的代码中实现——例如 ORM POJO 库，把 Hive 中的数据类型映射为 Java 的基本类型，并序列化为某种通用格式（Protobuf/JSON）写到 KV 中。

这个库严格来讲算是这个 KV 服务的客户端，只是在 MapReduce 中引入。每当需要抽取一个新的特征时，就需要实现这个 Domain 类，并实现它的 key() 接口，在实际写入 KV 时真正的 key 则是这个 Domian 类的类名再拼上 key() 返回的结果。这种方法的好处是，Domain 类只需要被实现并维护一次，而 MapReduce 任务本身则是通用的。
