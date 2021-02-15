---
layout: default
title: Dreamsome
---
{% include JB/setup %}
<h2>Newsletter</h2>

在 <a href="https://mindbicycle.hedwig.pub/">Hedwig </a>订阅我的 Newsletter

<h2>Recent</h2>

<div class='recent'>
  {% for post in site.posts limit:10 %}
    <div class='post'>
      {{post.date | date: '%Y/%m/%d' }}
      <br><br>
      <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
      <hr>
    </div>
  {% endfor %}
</div>

