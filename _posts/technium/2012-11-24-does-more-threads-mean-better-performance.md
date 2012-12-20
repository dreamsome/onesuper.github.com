---
layout: post
title: "线程越多越好吗？"
category: technium
tags: []
---


人们总是在说：“线程越多越好”，“为了隐藏访存延时，让我们用更多的线程吧！”，真的是这样吗？

<span class="sidenote">* Occupancy = Active Warps / Max Active Warps</span>
Vasily Volkov 告诉我们即使在 Occupancy \* 很低的情况下[也能够取得好性能](http://www.cs.berkeley.edu/~volkov/volkov10-GTC.pdf)。


结论也许重要，但更重要的是 Vasily Volkov 得出这个结论的方法：从问题的本质出发，而不是现有结论，教科书上写的不一定比你的直觉更可靠。


使用多线程的本质是什么？答案是利用**并行性**榨干计算单元的性能。操作主要分为两类，一种是计算，一种是访存。当**计算**操作要用到存储器中的数据时就必须等待**访存**操作把数据从存储器中取出来，这就造成了访存延时（memory latency）；如果一个计算操作要用到另一个计算操作的结果，也需要等待，这是计算延时（arithmetic latency）。


而使用多线程的目的是为了在一个线程出现等待（或计算或访存）时把它赶下台，接着做另一个线程的计算（前提是新线程上台以后马上能投入计算）。为了保证线程能够覆盖访存延迟，我们要让“足够多”的数据 in the flight，为此我们要开“足够多”的线程。


“足够多”到底是多少呢？用 [Little 公式](http://en.wikipedia.org/wiki/Little's_law)表示就是：需要的并行性 = 延时 * 吞吐量。


问题是多线程是隐藏访存延时的唯一方法吗？不是，我们真正需要的是并行性，而不是更多线程，增加线程是提高并行性的充分非必要条件。


增加**指令级并行性**同样能隐藏访存和计算延时。


<span class="sidenote">* "In fact, for all threads of a warp, accessing the shared memory is as fast as accessing a register as long as there are no bank conflicts between the threads.." - CUDA Programming Guide</span>

使用更少的线程有什么好处吗？在 GPU 中使用过更少的线程意味着可以用更多寄存器，寄存器的速度至少是 shared memory 的 6 倍，而不是像教科书上说的那样，在“某些条件下”两者一样快 \*。





