# 【MoeCTF 2022】ezphp


# [MoeCTF 2022]ezphp

## 思路
* 源码

  ```
  &lt;?php
  
  highlight_file(&#39;source.txt&#39;);
  echo &#34;&lt;br&gt;&lt;br&gt;&#34;;
  
  $flag = &#39;xxxxxxxx&#39;;
  $giveme = &#39;can can need flag!&#39;;
  $getout = &#39;No! flag.Try again. Come on!&#39;;
  if(!isset($_GET[&#39;flag&#39;]) &amp;&amp; !isset($_POST[&#39;flag&#39;])){
      exit($giveme);
  }
  
  if($_POST[&#39;flag&#39;] === &#39;flag&#39; || $_GET[&#39;flag&#39;] === &#39;flag&#39;){
      exit($getout);
  }
  
  foreach ($_POST as $key =&gt; $value) {
      $$key = $value;
  }
  
  foreach ($_GET as $key =&gt; $value) {
      $$key = $$value;
  }
  
  echo &#39;the flag is : &#39; . $flag;
  
  ?&gt;
  ```
  
* 如果要echo，那么不能exit。但是那么必须传flag（get或者post），并且传入flag不能等于&#34;flag&#34;

* 如果要`$flag`的值不会被更改，那就得提前**“储存”**flag

## RCE

**超级二选一**：GET或POST传参都可

GET

```
?fff=flag&amp;flag=fff
```

POST

```
fff=flag&amp;flag=fff
```

## 总结

* 存储flag

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-moectf-2022ezphp/  

