# Parse_url漏洞


&gt; 参考文章：[parse_url函数的解释和绕过](https://blog.csdn.net/q1352483315/article/details/89672426)

## 前置知识
**parse_url函数**
作用：parse_url — 解析 URL，返回其组成部分
```mixed parse_url ( string $url [, int $component = -1 ] )```
本函数解析一个 URL 并返回一个关联数组，包含在 URL 中出现的各种组成部分。

参数：
（1）url：要解析的 URL。无效字符将使用 _ 来替换。

（2）component：
指定 PHP_URL_SCHEME、 PHP_URL_HOST、 PHP_URL_PORT、 PHP_URL_USER、 PHP_URL_PASS、 PHP_URL_PATH、PHP_URL_QUERY 或 PHP_URL_FRAGMENT 的其中一个来获取 URL 中指定的部分的 string。 （除了指定为PHP_URL_PORT 后，将返回一个 integer 的值）。

*注：对严重不合格的 URL，parse_url() 可能会返回 FALSE （CTF常用 返回值False 用于逃逸判断）*

## DEMO
```
&lt;?php
$url = &#39;http://username:password@hostname/path?arg=value#anchor&#39;;
print_r(parse_url($url));
echo parse_url($url, PHP_URL_PATH);
?&gt;
结果----------------------------------------------------------------------------------------------------
Array
(
    [scheme] =&gt; http
    [host] =&gt; hostname
    [user] =&gt; username
    [pass] =&gt; password
    [path] =&gt; /path
    [query] =&gt; arg=value
    [fragment] =&gt; anchor
)
	/path 	// 如果把$url中的/path去掉，发现输出的则为 NULL
```
ps：parse_url()会把//认为是相对路径

```
&lt;?php
$url = &#39;//www.example.com/path?googleguy=googley&#39;;
 
// 在 5.4.7 之前这会输出路径 &#34;//www.example.com/path&#34;
var_dump(parse_url($url));
?&gt;


输出：path=//www.example.com/path
```

## 小结
对于高版本的php的来说一般直接/// 三个斜杠就可以直接解决。

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-parse_url%E6%BC%8F%E6%B4%9E/  

