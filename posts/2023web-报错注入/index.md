# 报错注入


## 1.核心
路径写入其它格式就会报错并且返回我们写入的非法格式内容，利用这个得到我们要点信息
一个select语句嵌套另一个select语句，里面的select语句先执行再执行外边的select语句。

## 2.常用函数
（1）**updatexml(文档类型，xpath路径，更新内容)**：更新xml文档函数，**当第二个参数包含特殊符号时会报错**，并将第二个参数的内容显示在报错信息中
（2）**extractvalue(文档类型，xpath路径)**：对xml文档查询，Xpath定位必须是有效的，否则则会发生错误；所以可以在这个位置植入表达式，做执行后报错	【若出现长度限制32位的解决方法：（1）截成多个32位；（2）先正序输出，再倒序输出，一半一半来】
（3）concat()：连接两个语句
（4）rand()：随机输出一个小于1的小数
（5）floor()：向下取整
（6）group by()：把结果分组输出
（7）count()：汇总数据函数

## 3.常用payload
如果updatexlm不行就用extractvalue
```
?id=1&#39; and updatexlm(1,concat(0x7e,(select database())),3) --&#43;
```
```
?id=1&#39; and extractvalue(1,concat(1,select database from information_schema.tables where table_schema=database()))
```
报错会把错误信息也一模一样报出来

注：0x7e等同于~

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E6%8A%A5%E9%94%99%E6%B3%A8%E5%85%A5/  

