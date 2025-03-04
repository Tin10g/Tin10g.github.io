# 【NSSCTF 2022 Spring Recruit】babyphp


# [NSSCTF 2022 Spring Recruit]babyphp

## 思路
直接看源代码

```
 &lt;?php
highlight_file(__FILE__);
include_once(&#39;flag.php&#39;);
if(isset($_POST[&#39;a&#39;])&amp;&amp;!preg_match(&#39;/[0-9]/&#39;,$_POST[&#39;a&#39;])&amp;&amp;intval($_POST[&#39;a&#39;])){
    if(isset($_POST[&#39;b1&#39;])&amp;&amp;$_POST[&#39;b2&#39;]){
        if($_POST[&#39;b1&#39;]!=$_POST[&#39;b2&#39;]&amp;&amp;md5($_POST[&#39;b1&#39;])===md5($_POST[&#39;b2&#39;])){
            if($_POST[&#39;c1&#39;]!=$_POST[&#39;c2&#39;]&amp;&amp;is_string($_POST[&#39;c1&#39;])&amp;&amp;is_string($_POST[&#39;c2&#39;])&amp;&amp;md5($_POST[&#39;c1&#39;])==md5($_POST[&#39;c2&#39;])){
                echo $flag;
            }else{
                echo &#34;yee&#34;;
            }
        }else{
            echo &#34;nop&#34;;
        }
    }else{
        echo &#34;go on&#34;;
    }
}else{
    echo &#34;let&#39;s get some php&#34;;
}
?&gt; 
```

* 第一层：使用数组绕过
  * `preg_match(&#39;/[0-9]/&#39;,$_POST[&#39;a&#39;])`：传参`a`不能被识别为int数值
  * `intval($_POST[&#39;a&#39;])`：传参`a`中要可以转化为一个interger类型的数值

* 第二层：使用数组绕过

  * `$_POST[&#39;b1&#39;]!=$_POST[&#39;b2&#39;]&amp;&amp;md5($_POST[&#39;b1&#39;])===md5($_POST[&#39;b2&#39;])`明显的md5强等于绕过，很多题目都有。

* 第三层：使用md5弱等于绕过

  * `$_POST[&#39;c1&#39;]!=$_POST[&#39;c2&#39;]&amp;&amp;is_string($_POST[&#39;c1&#39;])&amp;&amp;is_string($_POST[&#39;c2&#39;])&amp;&amp;md5($_POST[&#39;c1&#39;])==md5($_POST[&#39;c2&#39;])`首先要String类型，其次要md5弱等于绕过。使用我常用的一组。

    &gt; 网上有很多可以自己查找

    ```
    s155964671a
    s878926199a
    ```

    

## EXP

POST传参

```
a[]=1&amp;b1[]=2&amp;b2[]=4&amp;c1=s878926199a&amp;c2=s155964671a
```

## 总结

* 数组绕过
* 弱比较

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nssctf-2022-spring-recruitbabyphp/  

