# 日志包含漏洞


&gt; 参考文章：[日志包含漏洞](https://blog.csdn.net/qq_51553814/article/details/121109276)
### 产生原因
日志包含漏洞属于是本地文件包含，同样服务器没有很好的过滤，或者是服务器配置不当导致用户进入了内网，本来常规用户是访问不了这些文件的，但由于发起访问请求的人是服务器本身，也就导致用户任意文件读取。

### 原理
* 条件：开启服务器记录日志功能

* 在不同的系统，存放日志文件地方和文件名不同。
apache一般是```/var/log/apache/access.log```
nginx的log在```/var/log/nginx/access.log```和```/var/log/nginx/error.log```

* 于访问URL时访问URL时，服务器会对其编码，所以得通过抓包的形式尝试注入

### 实际应用
* 先通过/etc/passwd判断是否存在ssrf漏洞
因为不管是什么系统，都会在etc目录下存放passwd文件
如果成功访问说明是可以访问内网文件, 那么就可以通过这种方式访问日志文件了
* 接着在User-Agent处注入就可

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%97%A5%E5%BF%97%E5%8C%85%E5%90%AB%E6%BC%8F%E6%B4%9E/  

