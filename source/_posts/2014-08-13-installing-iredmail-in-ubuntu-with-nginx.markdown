---
layout: post
title: "Installing iRedmail in Ubuntu With Nginx"
date: 2014-08-13 00:04:10 +0700
comments: true
categories: server sysadmin ubuntu 
---

Roundcubemail

We just need to add a server block for nginx and make it work with PHP, create a file at /etc/nginx/sites-available/mail.yourdomain.com with the following configuration (you must change yourdomain.com for your actual domain):

{% codeblock ./dfPropaganda --installing iRedmail %}
server {  
    listen      80;
    server_name mail.yourdomain.com;

    location / {
            rewrite ^ https://$server_name$1 permanent;
    }

    location ~ \.php$ {
            fastcgi_pass   unix:/var/run/php5-fpm.sock;
            fastcgi_index  index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME /usr/share/apache2$fastcgi_script_name;
    }
}

server {  
    listen       443;
    server_name  mail.yourdomain.com;

    location / {
        root   /usr/share/apache2/roundcubemail;
        index  index.php index.html;
    }

    location ~ \.php$ {
        root            /usr/share/apache2/roundcubemail;
        include         fastcgi_params;
        fastcgi_pass    unix:/var/run/php5-fpm.sock;
        fastcgi_index   index.php;
        fastcgi_param   SCRIPT_FILENAME /usr/share/apache2/roundcubemail$fastcgi_script_name;
        fastcgi_param SERVER_NAME $http_host;
        fastcgi_ignore_client_abort on;
    }

    ssl                  on;
    ssl_certificate      /etc/ssl/certs/iRedMail_CA.pem;
    ssl_certificate_key  /etc/ssl/private/iRedMail.key;
    ssl_session_timeout  5m;
    ssl_protocols  SSLv2 SSLv3 TLSv1;
    ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers   on;
}
{% endcodeblock %}

This makes sure that the web mail will be only accessed through HTTPS and you can change the code to make what you want .

{% codeblock ./dfPropaganda --installing iRedmail %}
ln /etc/nginx/sites-availabled/mail.mydoimain.com /etc/nginx/sites-enabled/mail.mydoimain.com
{% endcodeblock %}

iRedAdmin

This was wasn't so easy, this admin panel was built with python, we would require a different configuration to make it work. We'll need to install USWGI and its plug-in for python.

{% codeblock ./dfPropaganda --installing iRedmail %}
apt-get update  
apt-get install nginx uwsgi uwsgi-plugin-python python-pip python-mysqldb  
pip install jinja2  
pip install web.py
{% endcodeblock %}

{% codeblock Then you will need to create the config file for our app at %}
Then you will need to create the config file for our app at : /etc/uwsgi/apps-available/iredadmin.ini

[uwsgi]
plugins=python  
vhost=true  
socket=/var/run/uwsgi/app/iredadmin/iredadmin.socket
{% endcodeblock %}

Create a hard link for it:

ln /etc/uwsgi/apps-available/iredadmin.ini /etc/uwsgi/apps-enabled/iredadmin.ini

Add permission to access the iredadmin files:

chown www-data:www-data /usr/share/apache2/iredadmin/* -R

With this we just need to add the configuration to nginx, create a config file at /etc/nginx/sites-available/iredadmin.yourdomain.com:

{% codeblock ./dfPropaganda --installing iRedmail %}
server {  
    listen          80;
    server_name iredadmin.yourdomain.com;

    location / {
        rewrite ^(.*) https://$server_name$1 permanent;
    }
}

server {  
    listen 443;
    server_name iredadmin.yourdomain.com;

    access_log  /var/log/nginx/iredadmin.access_log;
    error_log   /var/log/nginx/iredadmin.error_log;

    location / {
        root /usr/share/apache2/iredadmin;
        uwsgi_pass unix:///var/run/uwsgi/app/iredadmin/iredadmin.socket;
        uwsgi_param UWSGI_PYHOME /usr/share/apache2/iredadmin/python-home;
        uwsgi_param UWSGI_CHDIR /usr/share/apache2/iredadmin;
        uwsgi_param UWSGI_SCRIPT iredadmin;
        include uwsgi_params;
    }

    location /static {
        alias /usr/share/apache2/iredadmin/static/;
    }

    ssl                  on;
    ssl_certificate      /etc/ssl/certs/iRedMail_CA.pem;
    ssl_certificate_key  /etc/ssl/private/iRedMail.key;
    ssl_session_timeout  5m;
    ssl_protocols  SSLv2 SSLv3 TLSv1;
    ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers   on;
}
{% endcodeblock %}

To enable the site create a link to sites-enabled:

ln /etc/nginx/sites-availabled/iredadmin.yourdoimain.com /etc/nginx/sites-enabled/iredadmin.yourdoimain.com

{% blockquote eridlabs http://blog.eridlabs.com/using-iredmail-with-nginx-ubuntu-13-04-x64/ %}
How to install iredmail in ubuntu with nginx server, if you have some problem, you can comment in this post, and maybe i can help you .
thanks to :


    http://antlite.com/blog/2011/06/ubuntu-iredmail-nginx-settings/
    http://stackoverflow.com/questions/15974056/setup-iredmail-admin-site-in-nginx-on-ubuntu-12-04

{% endblockquote %}