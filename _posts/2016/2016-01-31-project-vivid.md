---
layout: post
title: "The Vivid Schemer"
category: technium
tags: []
---


受 [Learnerable Programming](http://chengyichao.info/learnable-programming/) 这篇文章的启发，写了 The Vivid Schemer 这个项目，嫌代码太粗糙一直没有开源，后来被推荐到 Hacker News 后也有人问我要过代码，苦于一直没有时间维护这段代码。


花了两个周末的时间重新写了下。现在的内部实现从 list 换成了正宗的 S 表达式，可以显示树形的 S 表达式（类似 LLVM 的 AST，默认显示缩进后的列表），求值的过程也用堆栈来模拟，这样用一个生成器就可以方便地拿到求值的中间结果，也就是说用户随时可以停下来，查看整个 S-expression 在求值过程中各个节点上值的变化，以及各个变量的 Lexical scope。


这也是最初那个 demo 的问题所在：求值过程和源代码是分离的，使用的人无法将目前的执行上下文和代码进行关联，而更好地设计应该是 inline 的。


改版后的 The Vivid Schemer 目前（非常不酷炫地）还只有一个命令行版本：


 ![](https://raw.githubusercontent.com/onesuper/vivid/master/screenshot.gif)


