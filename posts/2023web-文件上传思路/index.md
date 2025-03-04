# 文件上传思路


* 直接传php
如果不行，说明有黑名单or白名单验证
* 验证是黑名单还是白名单
文件名修成```.pppp```之类，如果不行说明是黑名单，并且如果能够验出文件类型是php，则有文件类型校验
* 验证是否内容校验
文件名和文件类型都修改后，依旧验出php则有
* 如果内容有校验，修改内容
例：
```
&lt;script language=&#39;php&#39;&gt; @eval($_GET[&#39;cmd&#39;]);&lt;/script&gt;
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%80%9D%E8%B7%AF/  

