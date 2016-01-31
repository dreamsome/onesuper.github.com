---
layout: post
title: "Introducing Project Vivid"
category: technium
tags: []
---


两年前的项目，当时 Learnerable Programming 启发，写了这个[原型](http://vivid.chengyichao.info/)，嫌代码太粗糙一直没有开源，后来被推荐到 Hacker News 后也有人问我要过代码，苦于一直没有时间维护这段代码，而最近又有人问起。

花了两个周末的时间重新写了下。现在的内部实现换成了 S 表达式，可以显示树形的 S 表达式（类似 LLVM 的 AST），默认是显示成缩进后的列表，求值的过程也用堆栈来模拟，这样用一个生成器就可以方便地拿到求值的中间结果，也就是说用户随时可以停下来，查看整个 S-expression 在求值过程中二各个节点上值的变化，以及各个变量的 Lexical scope。

事实上这也是 demo 的问题所在：求值过程和源代码是分离的，使用的人无法将目前的执行上下文和代码进行关联，而更好地设计应该是 inline 的。

改版后的 The Vivid Schemer 目前还只有一个命令行版本：

 ![](https://raw.githubusercontent.com/onesuper/vivid/master/screenshot.gif)

如果你对可视化编程有兴趣，欢迎加入我：）

[项目地址](https://github.com/onesuper/vivid)
