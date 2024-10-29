# 【极客大挑战 2020】]welcome


# [极客大挑战 2020]welcome

## 思路
* 进入页面用edge浏览器显示405，火狐进入是空白页。尝试get或post参数，发现post能够看到源码

  ```
   &lt;?php
  error_reporting(0);
  if ($_SERVER[&#39;REQUEST_METHOD&#39;] !== &#39;POST&#39;) {
  header(&#34;HTTP/1.1 405 Method Not Allowed&#34;);
  exit();
  } else {
      
      if (!isset($_POST[&#39;roam1&#39;]) || !isset($_POST[&#39;roam2&#39;])){
          show_source(__FILE__);
      }
      else if ($_POST[&#39;roam1&#39;] !== $_POST[&#39;roam2&#39;] &amp;&amp; sha1($_POST[&#39;roam1&#39;]) === sha1($_POST[&#39;roam2&#39;])){
          phpinfo();  // collect information from phpinfo!
      }
  } 
  ```

* 根据提示我们需要在phpinfo中进行数组绕过：值不能相等，哈希值要相等

  使用POST：roam1[]=1eee&amp;roam2[]=2rrr

* 然后再phpinfo中找到flag页面：/var/www/html/f1444aagggg.php

* 进入后发现404，说明是一个假页面。但是这里应该就是flag页面，查找一下request头，发现在头里面。

## 总结

* 数组绕过
* 弱比较

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-%E6%9E%81%E5%AE%A2%E5%A4%A7%E6%8C%91%E6%88%98-2020welcome/  

