# 【SWPUCTF 2022 新生赛】js_sign


# [SWPUCTF 2022 新生赛]js_sign

&gt; 小声bb[仅个人想法]：感觉这个不像web。

## 思路
* 看源码发现js

  ```
  document.getElementsByTagName(&#34;button&#34;)[0].addEventListener(&#34;click&#34;, ()=&gt;{
      flag=&#34;33 43 43 13 44 21 54 34 45 21 24 33 14 21 31 11 22 12 54 44 11 35 13 34 14 15&#34;
      if (btoa(flag.value) == &#39;dGFwY29kZQ==&#39;) {
          alert(&#34;you got hint!!!&#34;);
      } else {
          alert(&#34;fuck off !!&#34;);
      }    
  })
  
  ```

* 解码`dGFwY29kZQ==`得到是tapcode

* 发现tapcode是一种编码方法

* 把flag加密得到flag

附上网站：[Tap Code - 许愿星](https://www.wishingstarmoye.com/ctf/tapcode)


## 总结
* tapcode加密！！

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2022-%E6%96%B0%E7%94%9F%E8%B5%9Bjs_sign/  

