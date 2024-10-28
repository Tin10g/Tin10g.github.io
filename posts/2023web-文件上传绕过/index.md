# 文件上传绕过


## 1.文件上传绕过类型
（1）客户端校验绕过
javascript校验，一般是校验后缀名
上传木马，蚁剑连接或者禁用javascript

（2）服务端校验绕过【content-type验证】    
抓包，对content-type进行修改

（3）文件扩展名校验【白名单、黑名单】
改后缀，如：**.php3**；
大小写绕过，如：**.pHp**；
注：但是使用的同时需要修改配置，要使这些改了之后的后缀当做php执行

（4）%00截断
php&lt;5.3.4 时使用shell.php%00.jpg，截断%00后的内容
配合解析漏洞绕过

（5）.htaccess绕过【apache】
```
.htaccess：
全称是Hypertext Access(超文本入口)。
提供了针对目录改变配置的方法， 即，在一个特定的文档目录中放置一个包含一个或多个指令的文件， 以作用于此目录及其所有子目录。
作为用户，所能使用的命令受到限制。
管理员可以通过Apache的AllowOverride指令来设置。
启用.htaccess，需要修改httpd.conf，启用AllowOverride，并可以用AllowOverride限制特定命令的使用。
如果需要使用.htaccess以外的其他文件名，可以用AccessFileName指令来改变。例如，需要使用.config ，则可以在服务器配置文件中按以下方法配置：AccessFileName .config 。
它里面有这样一段代码：AllowOverride None，如果我们把None改成All。
笼统地说，.htaccess可以帮我们实现包括：文件夹密码保护、用户自动重定向、自定义错误页面、改变你的文件扩展名、封禁特定IP地址的用户、只允许特定IP地址的用户、禁止目录列表，以及使用其他文件作为index文件等一些功能。
```
php网站在解析php文件时候先解析当前目录下的配置文件
&lt;FileMatch &#34;1.jpg&#34;&gt;     //匹配文件
Sethandler application/x-httpd-php  //用Sethandler方法将1.png当成php代
```
&lt;FilesMatch &#34;png&#34;&gt;
SetHandler application/x-httpd-php
&lt;/FileMatch&gt;
```

（6）文件内容有校验【GIF89a】
文件幻术检测

（7）文件内容检测
二次渲染配合文件包含

（8）.user.ini绕过【nginx】
**前提条件**：
服务器脚本语言为PHP  
服务器使用CGI／FastCGI模式  
上传目录下要有可执行的php文件
```
user.ini ：
自 PHP 5.3.0 起，PHP 支持基于每个目录的 .htaccess 风格的 INI 文件。
此类文件仅被CGI／FastCGI SAPI 处理。此功能使得 PECL 的 htscanner 扩展作废。如果使用 Apache，则用 .htaccess 文件有同样效果。
除了主 php.ini 之外，PHP 还会在每个目录下扫描 INI 文件，从被执行的 PHP 文件所在目录开始一直上升到 web根目录（$_SERVER[&#39;DOCUMENT_ROOT&#39;] 所指定的）。

如果被执行的 PHP 文件在 web 根目录之外，则只扫描该目录。
   
在 .user.ini 风格的 INI 文件中只有具有 PHP_INI_PERDIR 和 PHP_INI_USER 模式的 INI设置可被识别。
   
两个新的 INI 指令，user_ini.filename 和 user_ini.cache_ttl 控制着用户 INI 文件的使用。
   
user_ini.filename 设定了 PHP 会在每个目录下搜寻的文件名；如果设定为空字符串则 PHP 不会搜寻。默认值是 .user.ini。
user_ini.cache_ttl 控制着重新读取用户 INI 文件的间隔时间。默认是 300 秒（5 分钟）。
```
```
CGI
       CGI 的全称为“通用网关接口”（Common Gateway Interface），为 HTTP 服务器与其他机器上的程序服务通信交流的一种工具， CGI 程序须运行在网络服务器上。
   
       传统 CGI 接口方式的主要缺点是性能较差，因为每次 HTTP 服务器遇到动态程序时都需要重新启动解析器来执行解析，之后结果才会被返回给 HTTP服务器。这在处理高并发访问时几乎是不可用的，因此就诞生了 FastCGI。另外，传统的 CGI 接口方式安全性也很差，故而现在已经很少被使用了。
```
```
FastCGI
       FastCGI 是一个可伸缩地、高速地在 HTTP 服务器和动态服务脚本语言间通信的接口（在 Linux 下， FastCGI 接口即为 socket，这个socket 可以是文件 socket，也可以是IP socket），主要优点是把动态语言和 HTTP服务器分离开来。多数流行的 HTTP 服务器都支持 FastCGI，包括 Apache 、 Nginx 和 Lighttpd 等。
       同时，FastCGI也被许多脚本语言所支持，例如当前比较流行的脚本语言PHP。FastCGI 接口采用的是C/S架构，它可以将 HTTP 服务器和脚本服务器分开，同时还能在脚本解析服务器上启动一个或多个脚本来解析守护进程。当 HTTP服务器遇到动态程序时，可以将其直接交付给 FastCGI 进程来执行，然后将得到结果返回给浏览器。
      这种方式可以让 HTTP服务器专一地处理静态请求，或者将动态脚本服务器的结果返回给客户端，这在很大程度上提高整个应用系统的性能。
```
源码里把所有可以解析的后缀名都给写死了，包括大小写，转换，空格，还有点号，正常的php类文件上传不了了，并且拒绝上传 .htaccess 文件。
反复观察发现没有被限制的后缀名有 .php7 以及 .ini

（9）内容检测绕过
```php```或者```&lt;??&gt;```被查杀
可以使用木马的另一种表达形式
```
&lt;script language=php&gt;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E7%BB%95%E8%BF%87/  

