---
layout: none
permalink: .htaccess
---
RewriteEngine On
RewriteCond %{http_host} ^blog.chengyichao.info [nc]
RewriteRule ^(.*)$ http://dreamsome.org/$1 [r=301,nc]
