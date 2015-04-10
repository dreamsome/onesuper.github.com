---
layout: post
title: "63"
category: Comic
tags: [Comic]
---

[Dreamsome#63](http://dreamsome.org/1063)

原始数据：

    L1 cache reference = 0.5 ns
    Branch mispredict = 5 ns
    L2 cache reference = 7 ns
    Mutex lock/unlock = 25 ns
    Main memory reference = 100 ns        
    Compress 1K bytes with Zippy = 3 µs
    Send 2K bytes over 1 Gbps network = 20 µs
    SSD random read = 150 µs
    Read 1 MB sequentially from memory = 250 µs
    Round trip within same datacenter =  0.5 ms
    Read 1 MB sequentially from SSD* = 1 ms
    Disk seek = 10 ms
    Read 1 MB sequentially from disk = 20 ms
    Send packet CA->Netherlands->CA = 150 ms

最早的出处应该是 Peter Norvig 的[这篇文章](http://norvig.com/21-days.html#answers)。

这儿还有一个[交互式版本](http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html)。