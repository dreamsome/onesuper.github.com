---
layout: page
title: OSX
---
{% include JB/setup %}


这里是 onesuperX 的个人博客，偶尔也用来更新漫画的幕后花絮

### Published Posts

<img src="http://7vzp4h.com1.z0.glb.clouddn.com/1072.png" style="float:right; width: 450px;" />

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

