# 命令执行RCE


ping 127.0.0.1 网络检测

## 命令连接符
```
cmd1 | cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 ; cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 &amp; cmd2	//无论cmd1是否执行成功，cmd2一定执行
cmd1 || cmd2	//仅在cmd1执行失败时，cmd2被执行
cmd1 &amp;&amp; cmd2	//尽仅在cmd1执行成功时，cmd2被执行
```

## 常见cmd命令
whoami	查看当前用户名
ipconfig	查看网卡信息
shutdown -s -t 0	关机
net user [username][password] /add	win增加一个用户名为username密码为password的用户
type [filename]	查看filename文件的内容


## LOW RCE
直接在ip后面用```&amp;```或```；```或```|```连接我们想要的指令

## Medium RCE
把可用的符号过滤，即将这些符号替换成控，或判断用户输入这些符号就终止

## Hard RCE
所有的符号都在被禁，如果可以看源码可以看看有没有多敲一个空格的情况，通过无空格达到执行命令

## Impossible RCE
```
&lt;?php

if( isset( $_POST[ &#39;Submit&#39; ]  ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ &#39;user_token&#39; ], $_SESSION[ &#39;session_token&#39; ], &#39;index.php&#39; );

    // Get input
    $target = $_REQUEST[ &#39;ip&#39; ];
    $target = stripslashes( $target );	//【去除‘\’】

    // Split the IP into 4 octects【根据&#39;.&#39;，把输入语句分隔】
    $octet = explode( &#34;.&#34;, $target );

    // Check IF each octet is an integer【分别判断四个部分是否是数字】
    if( ( is_numeric( $octet[0] ) ) &amp;&amp; ( is_numeric( $octet[1] ) ) &amp;&amp; ( is_numeric( $octet[2] ) ) &amp;&amp; ( is_numeric( $octet[3] ) ) &amp;&amp; ( sizeof( $octet ) == 4 ) ) {
        // If all 4 octets are int&#39;s put the IP back together.【再用&#39;.&#39;去连接四个部分】
        $target = $octet[0] . &#39;.&#39; . $octet[1] . &#39;.&#39; . $octet[2] . &#39;.&#39; . $octet[3];

        // Determine OS and execute the ping command.
        if( stristr( php_uname( &#39;s&#39; ), &#39;Windows NT&#39; ) ) {
            // Windows
            $cmd = shell_exec( &#39;ping  &#39; . $target );
        }
        else {
            // *nix
            $cmd = shell_exec( &#39;ping  -c 4 &#39; . $target );
        }

        // Feedback for the end user
        echo &#34;&lt;pre&gt;{$cmd}&lt;/pre&gt;&#34;;
    }
    else {
        // Ops. Let the user name theres a mistake
        echo &#39;&lt;pre&gt;ERROR: You have entered an invalid IP.&lt;/pre&gt;&#39;;
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?&gt;
```

## 测试
白盒：看代码
黑盒：一个一个测

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8Crce/  

