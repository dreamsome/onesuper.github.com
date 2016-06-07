---
layout: page
title: OSX
---
{% include JB/setup %}


这里是 onesuperX 的个人博客。

“半生都想逃脱樊笼，其结果不过是自己在理性和感性、情商和智商之间来回错位探戈。” -- Tango2010

### Published Posts <img src="http://7vzp4h.com1.z0.glb.clouddn.com/1072.png" style="float:right; width: 400px;" />

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

