# 【SWPUCTF 2022 新生赛】funny_php


# [SWPUCTF 2022 新生赛]funny_php

## 思路
* 登录：是他们新生赛的一个没啥意义

  用户名：NSS
  
  密码：2122693401
  
* 源码

  ```
   &lt;?php
  error_reporting(0);
  header(&#34;Content-Type: text/html;charset=utf-8&#34;);
  highlight_file(__FILE__);
  include(&#39;flag.php&#39;);
  if (isset($_GET[&#39;num&#39;])) {
      $num = $_GET[&#39;num&#39;];
      if ($num != &#39;12345&#39;) {
          if (intval($num) == &#39;12345&#39;) {
              echo $FLAG;
          }
      } else {
          echo &#34;这为何相等又不相等&#34;;
      }
  }
  ```

* 三个点

  * `$num != &#39;12345&#39;`这里是弱比较
  * `intval()`截断。当向intval()传入的参数，不是`int`时，会返回`1`


## Payload

末尾随便放个非int

```
?num=12345/
?num=12345a
```

## 总结

* 弱比较
* 数组绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2022-%E6%96%B0%E7%94%9F%E8%B5%9Bfunny_php/  

