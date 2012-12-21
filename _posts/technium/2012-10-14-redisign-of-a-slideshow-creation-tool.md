---
layout: post
title: "Redisign of a Slideshow Creation Tool"
category: technium 
tags: []
---




[Weakpoint](http://blog.chengyichao.info/2012/06/17/slideshow-in-markdown/) is a wrong design. And it is wrong since the very beginning. As its name imply, it is a weak tool, and even I am unwilling to use it. 


On several months' reflection, I have got a couple of hints for those who want to create such applications. 



### GUI or CLI?


<span class="sidenote">* Most applications behave like a markdown-to-html translator. </span>
When people create slideshows, actually they are imagining what they are going to present. A slideshow creation tool should not be a source-to-source translator \* which converts a text with some markups to a slideshow. It should be a tool to help people expressing.  


One way to practise the presentation is standing in front of a mirror and expressing yourself. Because you know where to improve only when you can see them. 


It's also the truth for a slideshow creation tool. Say you want to insert an image to a slide, then you want to tweak the size and position to make it look great. But you can do it only when you can see it. So a slideshow creation tool has to be a GUI application in all times.


Slideshow is not a program. And it should not be written or compiled like a program. 



### Highlight


Arrows, inline comments and boxes are powerful weapons to express thoughts. Any tools which are intended to help people express themselves should provide these features as key components. A presenter need different ways to highlight(or emphasize) their words. A slideshow generator without arrows, inline comments and boxes is just like a text processor without **bold**, <u>underline</u>, and _italic_. 



### Markdown is weak, too


Markdown is a lightweight markup languange which is supposed to ease the pain when people are writing HTML. But slideshows are not web pages, and they have "richer" contents. 


As a languange, Markdown is not expressive enough to represent a slideshow. If you have to use a syntax to write slideshow, the better way is to invent one.


Design a new syntax to support all the elements within a slideshow. 



### Redesign


Does it mean the whole idea is a bunch of crap? Not really.


In my opinion, texting in a brief and clean syntax(something like Markdown, but more specialized) is still better than writing in a text box with a series of mouse operations, like double clicking the text box, choosing the font styles or other options and so on. 


And the idea of separating the contents and styles will never be eliminated over time. So why could we just provide the user with both text mode and highlight mode? A text mode is used to write pure text in a markup languange as simple as Markdown. As the user types an "Enter", the program generates the slide instantly. The user can also switch bewteen the generated slides to see the effects or change the font styles in a drop down list. 


A highlight mode is just like a canvas floating over the slides. A user can insert arrows, inline comments and boxes by dragging them.  


### Conclusion

I wrote this essay just to prove I was wrong. But what I said just now might also be wrong.




