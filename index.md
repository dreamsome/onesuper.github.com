---
layout: default
title: Cheng Yichao 
---
{% include JB/setup %}

<p>真理之路凌驾于任何琐碎的技能之上。这世上并没有所谓的“技术”，也没有所谓的“设计”，只有一个人应该成为什么样的人，以及在这个过程中保持一颗不屈的决心。其他的只是细节。 <a href="/2012/04/14/eeer-coder-designer">from here</a></p>

<h2>Posts</h2>
<div class="posts">
  {% for post in site.posts %}
    <div class="post"><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }} 
    </a> /{{post.date | date: '%Y' }}</div>
  {% endfor %}
</div>

