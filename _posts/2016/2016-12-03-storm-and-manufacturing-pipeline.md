---
layout: post
title: "优美也粗暴的算法"
category: technium
tags: [storm, data]
---


Nathan Marz 有一次在[博客](http://nathanmarz.com/blog/history-of-apache-storm-and-lessons-learned.html)中说他在 Storm 中实现的那个用来解决消息容错问题的算法是他开发过最好的算法，而且得益于自己在计算机科学教育（one of the few times in my career I can say I would not have come up with it without a good computer science education.）

这个算法最优美的地方在于，Storm 在追踪每一条消息（Tuple）是否被所有的下游 Bolt 都正常处理仅仅用 20个字节，正是利用了任意一个数字 XOR 两次都等于 0 的这个特性。

Spout 的每一条消息经过下游路径上的一个 bolt 就会 apply 一次变化，所以只需要在上游记下戳，过一段时间以后 如果发现消息在路上某个处理失败了或者弄丢了，Spout 重新再发一遍消息就好了（at least once 语义）。XOR 之所以可以用来简化算法（确切地说是简化了存储 track 消息的数据结构）的原因是 Spout 并不需要关心是哪个处理 apply 失败了。

后来有次看到这张图片，才发现这个算法在执行层面一点都不优美，相反还很粗暴：

![](http://ww3.sinaimg.cn/large/534218ffgw1fado8pks5gg20e0070ab6.gif)