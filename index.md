---
layout: page
title: Home
---
{% include JB/setup %}

### Published Posts <img src="http://7vzp4h.com1.z0.glb.clouddn.com/1072.png" style="float:right; width: 400px;" />

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

