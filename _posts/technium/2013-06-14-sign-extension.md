---
layout: post
title: " Sign Extension And Its Meaning"
category: technium
tags: []
---

In C language, it's always safe to save a short value in an integer variable, whereas the other way around is not permitted. Why?

When dumping a 16-bit signed number to a 32-bit variable, the computer needs to do some extra work, making sure the **meaning** of the value remains the same. It needs to **sign extend** the value.


Briefly speaking, to extend a positive/negative number simply requires padding the old value with 0s/1s on the left side. But why? 


The essence of [2's complement](http://en.wikipedia.org/wiki/Two's_complement) is dividing the space of unsigned number into two parts - the lower part for non-negitive numbers, and the higher one for negative numbers, thus representing signed number.


![](http://ww2.sinaimg.cn/large/9c9ad557jw1e5o0ek0061j20kf09iaad.jpg)


One great thing about 2's complement is that the most-significant bit tells us whether the value is negative.


If we use one more bit, the number space doubles symmetrically, representing twice as many as the numbers.   


![](http://ww2.sinaimg.cn/large/9c9ad557jw1e5o0ezb6n7j21090adq3w.jpg)


All the orginal numbers survive in the new representation and still perserve their old meanings.


The smallest positive numbers and the greatest negative numbers appear on the two sides of the representation, the shape of which is similar with the *-tan(x)* function.


That's why we should pad consecutive 1 or 0 to the value, when casting it to a value with more bits. **Because** they are smaller/greater positive/negative numbers in the new reprsentation.


It also explains why it's unsafe to cast a value backwards. **Because** in that case, we may lose the numbers in the middle.

