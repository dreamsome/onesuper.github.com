---
layout: post
title: "WeakPoint v1.0"
category: idea
tags: [Markdown, WeakPoint]
---

[v1.0](http://blog.chengyichao.info/weakpoint/) 在 demo 的基础上做了两个加法和两个减法：


1\. 添加了幻灯片间的切换效果


没有选择那些花哨的实现，而用了 [bxslider](http://bxslider.com) 这个简单的库。人们使用幻灯片的目的是为了辅助自己把问题讲清楚，而不是告诉别人自己的幻灯有多么酷。演讲者应该把观众的注意力集中到自己身上而不是大屏幕上。


我研究了一些 TED 的幻灯片，它们的共同点是**切换速度快**，因为一场演讲可能要使用很多图片（这也是优秀演讲的共有特点），如果不快点切换可能会跟不上演讲者的思路。


WeakPoint 目前支持三种切换效果（水平，垂直和淡出），你可以在 config.yaml 文件中配置。


2\. 添加了对 LaTeX 的支持


没有选择 latexmath2png ，而是用了 MathJax，因为它对排版更加友好（前者是把数学公式当作 text 处理，后者则是图片）。



3\. 取消了鼠标左键翻页


去掉了鼠标左键翻页这个鸡肋的功能，目前支持的键盘操作如下：


下一页： j / n / pageDown / right


上一页：k / p / pageUp / left


首页：home


4\. 去掉了幻灯片页面内的逐条显示效果


这个功能有利有弊，在还尚未考虑周全的情况下，暂时拿掉也许是个不坏的选择。



