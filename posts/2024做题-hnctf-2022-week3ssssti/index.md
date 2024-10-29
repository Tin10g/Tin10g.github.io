# 【HNCTF 2022 WEEK3】ssssti


# [HNCTF 2022 WEEK3]ssssti

## 思路
* fenjing一把梭

[以下是看大佬博客知道的]

* 黑名单

  ```
  blacklist = [&#39;\&#39;&#39;, &#39;&#34;&#39;, &#39;args&#39;, &#39;os&#39;, &#39;_&#39;]，不能用post方法
  ```
  
* 可以用request.cookies，通过cookies传入参数

## EXP

其实就是fenjing命令解析

直接图形化界面来破解

```
python3 fenjing -m fenjing webui
```




## 总结
* fenjing一把梭

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-hnctf-2022-week3ssssti/  

