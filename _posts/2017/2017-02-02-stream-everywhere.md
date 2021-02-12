---
layout: post
title: "所有业务逻辑都是流计算"
category: quotes
tags: []
---

在 DDIA 作者[看来](https://www.youtube.com/watch?v=fU9hR3kiOK0)，传统的 Web 应用架构（通常指基于 HTTP 协议的后端），都试图实现服务层的无状态，所谓的无状态并不是指应用程序本身可以无状态，而是把繁琐的状态维护工作交给 DB 来完成。状态的维护的工作包含：

1. Replication：主数据库需要通知从数据库一些变量的值发生了变化，一系列命令式的状态变化（mutation）通知拆开看其实是一个个的不可变的事件或者实时（event/fact），参考 MySql 的 binlog。
2. 索引：在数据更新时，更新相应的索引。
3. 缓存：通过把数据保存在内存中加速对数据的访问，存在失效、竞争冲突/一致性、重启以后数据就没了的问题。
4. Materialized view：某种应用层面基于 query 的 cache，也是为了提高获取数据的速度。

以上四类操作的共同特点是它们都是派生出来的数据。在传统的数据库中, replication 流只是 DB 这层抽象的实现细节。而在未来的数据系统中，事件流应该是一等公民，参考 Kafka (分布式日志系统)。这样的系统优势在于：

* 数据源：便于分析，写一次，在不同的 view 中进行读取，恢复起来很方便。
* 完全预计算的 cache：没有复杂的失效逻辑，自己控制的 materialized view。每个 view 都是串行处理，因此没有数据冲突。
* 一切都是流（Stream everywhere）: 请求/响应模型可以被订阅/通知模型取代。**不再只是在请求到来时 query 向 DB 查询这个时刻系统的某个局部状态，而是不断地通知到 client 最新的状态变更。**


一个比较有趣的观点：在整个 web 栈上，从 DB 到 cache，到 HTML dom ，再到每个像素点的渲染，后者都可以看成是前者的一个 materialized view。