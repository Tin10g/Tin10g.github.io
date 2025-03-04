# YOLO系列环境配置心路


## 创建虚拟环境
### 法一：conda
* 创建
```
conda create -n your_env_name python=3.7
```
* 激活Linux
```
conda activate your_env_name
```
```
source activate your_env_name
```
### 法二：virturalenvs
* 创建\
直接用pycharm创建的环境就在这个.virturalenvs文件里面
* 激活(找bin下的activate)
```
source /home/lzh/.virtualenvs/t_yolov7Oral/bin/activate
```

## 配置package
一般项目会有requirements.txt\
进项目文件
```
pip install -r requirements.txt
```

## 服务器&#43;Pycharm
1. ssh建立\
在项目setting的interpreter里面新建一个ssh连接，可以参考finalshell的连接参数\
主要是ip、用户名、密码
&gt; 注意：必须是ip不能是子网掩码，pycharm不认
2. 配置一个新的虚拟环境\
见上述虚拟环境

## 测试Bug
1. git tag问题\
这个是项目中要从github下载东西，然后被墙掉了。
&gt; 解决方案\
&gt; 发现是服务器和那个文件没有同步，服务器weights里面没有yolov7.pt

2. 找不到train.cache的labels
&gt; 解决方案\
&gt; 在train_val的那几个路径txt里面要使用绝对路径

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/yolov9_%E9%85%8D%E7%BD%AE%E7%8E%AF%E5%A2%83/  

