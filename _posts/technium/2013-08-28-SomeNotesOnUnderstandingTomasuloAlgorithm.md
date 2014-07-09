---
layout: post
title: "Some Notes on \"Understanding Tomasulo Algorithm\""
---

I have made an interesting presentation for illustrating Tomasulo Algorithm, an important milestone in modern processors. I strongly recommend you to have a look at [it](http://www.slideshare.net/onesuper/understanding-tomasolu-algorithm). Here are some breif notes on this topic.


**Register renaming is not like what its name suggests.**

The common register renaming scheme is providing more physical registers than the ISA needs. In this case, before an instruction is fed to the instruction queue, the name of its architectual register(e.g r5) has been modified to a physical one(e.g. p19). However the Tomasulo algorithm uses another approach, where the register of an instruction is actually "renamed" to the No. of a *part* (a *part* can be a single slot/entry in [reservation station](https://en.wikipedia.org/wiki/Reservation_stations) or any register).

**Abstraction is a powerful weapon.**

The producer-consumer model simplifies the relationship between two instructions. With this model, the role of CDB is self-evident: the producers throw their outputs to *somewhere* where the consumers can collect their inputs distinguished by tags.


**Tomasulo Algorithm has nothing to do with the reorder buffer.**

,though they both play an important role in modern microprocessors. The purpose of Tomasulo Algorithms is to enable out-of-order execution while the motivation of reorder buffer is to implement [precise interrupt](http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=00004607).

**Textbook is just one of the references to knowledge, but not all of them.**


As Thomas S. Kuhn said in *[The Structure of Scientific Revolutions](http://www.amazon.com/Structure-Scientific-Revolutions-Thomas-Kuhn/dp/0226458083)*, textbooks are misleading for the lack of details. Textbook hides away many important things behind an idea for conciseness, like history, original intention and 'dead' competitors. Instead, it tells you the **outcome** directly. As a result, you get a whole picture of A, B, plus C, plus D... but don't know why they *have to* be there. 

Other sources which I think are also useful when understanding a thing:

* Original paper
* Thoughts from an experienced person(especially when they are making conclusions)
* Insightful webpages