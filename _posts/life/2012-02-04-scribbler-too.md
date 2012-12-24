---
layout: post
title: "用 ScribblerToo 涂鸦"
category: life
tags: []
---



这两天一直在用 [ScribblerToo](http://www.zefrank.com/scribbler/scribblertoo/) 这个涂鸦工具画画 。轻量级，五分钟上手，绝妙的创意，随便涂几下都显得很专业。 


### 王靖雯

![](http://ww4.sinaimg.cn/mw690/534218fftw1dut2ur7o15j.jpg)



### La Tour Effel

用这个画建筑物特别有感觉。还可以把原图垫在画布底下画。 


![](http://ww2.sinaimg.cn/mw690/534218fftw1dut2upz9msj.jpg)


### 阴影数

Brush 的属性可调，“阴影数”调高以后有种错综复杂的感觉。 

![](http://ww2.sinaimg.cn/mw690/534218fftw1dut2us4sndj.jpg)


![](http://ww4.sinaimg.cn/mw690/534218fftw1dut2urdq96j.jpg)



### 几个属性的含义

* **Stroke Size** 决定了刷子的粗细，Stroke 则是刷子在涂抹过程中的连续程度：用相同的速度按住鼠标左键划过屏幕，Stroke 的值越大，墨迹的数量越多，越密集。
* **Connections** 表示了两条线之间连接的数量，Radius = x 代表在画笔经过某个点时，会和周围 x 范围内的线条进行连接，形成阴影的效果。
* **Fussyness** 是绒毛效果，Curviness 是正弦波的效果。
* **Density** 影响了连接的密集程度， Intensity 决定了刷子的强度，这个值越大仿佛在用刷子时使用了更大的力气。 



### 原理

以点阵保存图像，每次下笔就是在 (x, y) 这个点上绘制刷子的图案，然后寻找在 Radius 的范围内的其它点，然后每过一个微小的时间间隔连接一条线条，因为滑动速度可以影响影线数量。 


### 网友大作

<a href="http://www.douban.com/online/11025315/">http://www.douban.com/online/11025315/</a>
