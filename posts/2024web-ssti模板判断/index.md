# SSTI模版判断


# SSTI模版判断

* ${7*7}
  * a{* comment *}b
    * Smarty
    * ${&#34;z&#34;.join(&#34;ab&#34;)}
      * Mako
      * Unknown
  * {{7*7}}
    * {{7*‘7’}}
      * Jinja2
      * Twig
      * Unknown
    * Not vulnerable


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-ssti%E6%A8%A1%E6%9D%BF%E5%88%A4%E6%96%AD/  

