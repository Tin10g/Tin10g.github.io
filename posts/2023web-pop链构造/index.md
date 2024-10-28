# POP链构造


## 关键步骤：理清pop链&amp;&amp;做标记
**第一步**： 找eval、flag这些危险函数和关键字样（一般这就是链尾）==&gt;看用到的参数
**第二步**： 找该参数所在位置，标注该参数，例如```// 1[序号] shell[上一步找到参数的类]```
**第三步**： 看目前所标记的这个参数所在函数的功能，通过了解功能找到能够触发这个函数的第二个参数。
……
以此类推，当找到链头【即：含有或者是能够结束整个序列化的过程的类】

## 写脚本
先将所有类复制下来放进```&lt;?php ?&gt;```
根据刚才标注的12345顺序来写，**用到哪个类时，必须先用```new```实例化一遍**
例：
对应
```
public $txw4ever; //1 shell【txw4ever所在类为NISA】
public $su; //2 NISA【su所在类为Ilovetxw】
```
```
$n = new NISA();
$n-&gt;txw4ever = &#39;System(&#34;cat /f*&#34;);&#39;;
$i = new Ilovetxw();
$i-&gt;su = $n; //等于的是*标注*里面所对应类的参数
```
*注：每一种类用一个参数即可*

最后加上显示语句：【一般直接反序列化，如果被限制可以用url再加密，如下】
```
echo urlencode(serialize($f));
```

&gt; 参考例题：[[NISACTF 2022]babyserialize](http://8.130.93.84:8090/archives/nisactf2022babyserialize)

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-pop%E9%93%BE%E6%9E%84%E9%80%A0/  

