# Misc


# Misc

&gt; [!NOTE]
&gt;
&gt; 只是一些赛前《临终幻想罢了》

## zsteg

&gt; 隐写工具

* 图片隐写

## base64表解密

得到一个表和加密字段，用base64解密

## ZIPBomb

脚本找到flag的位置

```
import os.path
import zipfile
import re

dir_path=&#39;./&#39;
files= os.listdir(dir_path)
newfiles = [&#34;1.zip&#34;]
print(newfiles)
setee = []
for file in newfiles: #遍历文件夹
    position = dir_path&#43;&#39;\\&#39;&#43; file #构造绝对路径，&#34;\\&#34;，其中一个&#39;\&#39;为转义符
    print (position)
    z = zipfile.ZipFile(position, &#39;r&#39;)
    for filename in z.namelist():
        bytes = z.read(filename)
        if b&#39;NSSCTF{&#39; in bytes:
            print(filename)

```

用010分离出找到的位置，重新变成一个文件

## 键盘密码

```
c = &#39;93 53 63 71 51 63 41 51 83 63 23 23 93 62 61 94 93 71 41 92 41 71 63 41 51 31 83 43 41 21 81 22 21 74 42&#39;
table = [&#39;ABC&#39;,&#39;DEF&#39;,&#39;GHI&#39;,&#39;JKL&#39;,&#39;MNO&#39;,&#39;PQRS&#39;,&#39;TUV&#39;,&#39;WXYZ&#39;]
c = c.split(&#39; &#39;)
for i in range(len(c)):
    print(table[int(c[i][0])-2][int(c[i][1])-1],end=&#39;&#39;)
```

## base64加密的png转png格式

cyber直接导入后转

## stegpy

支持格式

- PNG
- BMP
- GIF
- Webp
- WAV

## Stegsolve与zsteg

都可以提取基本的LSB隐写

1. PNG图片，png图片是一种无损压缩的图片，因为无损压缩所以可以实现LSB隐写。
2. JPG图片，jpg图片是一种有损压缩的图片，修改的数据会在压缩中损失，不可以实现LSB隐写。
3. BMP的图片，是没有经过压缩的。BMP图片文件大小一般较大，bmp图片也可以实现LSB隐写。

**Zsteg**此工具比Stegsolve更推荐，其更强大更全面

不光解决LSB隐写，其它数据的隐藏也很好用(配合binwalk)，适用于png与bmp文件

## binwalk

`binwalk xxxx -e`自动分离图片里面的内容

## foremost

`foremost xxx`


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-misc/  

