# SSTI-Flask模板注入


# fenjing 常用指令

&gt; 常用于ssti注入

### 直接图形化界面

&gt; 感觉这个比命令行便捷很多

```
python -m fenjing webui
```

###   扫描指定的网站

##### Usage: python -m fenjing scan [OPTIONS]

**Options:**
  -u, --url TEXT       需要扫描的URL
  -e, --exec-cmd TEXT  成功后执行的shell指令，不填则进入交互模式
  --interval FLOAT     每次请求的间隔
  --detect-mode TEXT   检测模式，可为accurate或fast
  --user-agent TEXT    请求时使用的User Agent
  --header TEXT        请求时使用的Headers
  --cookies TEXT       请求时使用的Cookie
  --help               Show this message and exit.



### 攻击指定的表单

##### Usage: python -m fenjing crack [OPTIONS]

**Options:**
  -u, --url TEXT       form所在的URL
  -a, --action TEXT    form的action，默认为当前路径
  -m, --method TEXT    form的提交方式，默认为POST
  -i, --inputs TEXT    form的参数，以逗号分隔
  -e, --exec-cmd TEXT  成功后执行的shell指令，不填则成功后进入交互模式
  --interval FLOAT     每次请求的间隔
  --detect-mode TEXT   分析模式，可为accurate或fast
  --user-agent TEXT    请求时使用的User Agent
  --header TEXT        请求时使用的Headers
  --cookies TEXT       请求时使用的Cookie
  --help               Show this message and exit.

###   攻击指定的表单，并获得目标服务器的flask config

##### Usage: python -m fenjing get-config [OPTIONS]

**Options:**
  -u, --url TEXT      form所在的URL
  -a, --action TEXT   form的action，默认为当前路径
  -m, --method TEXT   form的提交方式，默认为POST
  -i, --inputs TEXT   form的参数，以逗号分隔
  --interval FLOAT    每次请求的间隔
  --detect-mode TEXT  分析模式，可为accurate或fast
  --user-agent TEXT   请求时使用的User Agent
  --header TEXT       请求时使用的Headers
  --cookies TEXT      请求时使用的Cookie
  --help              Show this message and exit.


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-fenjing%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4/  

