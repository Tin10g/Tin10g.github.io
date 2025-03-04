# SQL · Alter&amp;show&amp;SQL约束


&gt; 参考文章：
&gt; [BUUCTF[强网杯 2019]随便注 的三种解法](https://blog.csdn.net/qq_44657899/article/details/103239145?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169111767916800226518430%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&amp;request_id=169111767916800226518430&amp;biz_id=0&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-103239145-null-null.142^v92^koosearch_v1&amp;utm_term=%5B%E5%BC%BA%E7%BD%91%E6%9D%AF%202019%5D%E9%9A%8F%E4%BE%BF%E6%B3%A8&amp;spm=1018.2226.3001.4187)
&gt; 参考题目：
&gt; [[强网杯 2019]随便注](http://8.130.93.84:8090/archives/-qiang-wang-bei-2019-sui-bian-zhu)

# alter
1. 作用：修改已知表的列。
（ 添加：add | 修改：alter，change | 撤销：drop ）
2. 用法

（1）添加一个列
```
alter table &#34; table_name&#34; add &#34; column_name&#34;  type;
```
（2）删除一个列
```
alter table &#34; table_name&#34; drop &#34; column_name&#34;  type;
```
（3）改变列的数据类型
```
alter table &#34; table_name&#34; alter column &#34; column_name&#34; type;
```
（4）改列名
```
alter table &#34; table_name&#34; change &#34; column1&#34; &#34; column2&#34; type;
```
```
alter table &#34;table_name&#34; rename &#34;column1&#34; to &#34;column2&#34;;
```

# show
在过滤了 select 和 where 的情况下，还可以使用 show 来爆出数据库名，表名，和列名。
```show datebases;	 //数据库```
```show tables; 	//表名```
```show columns from table; 	//字段```

# SQL约束
1. ```not null-``` 指示某列不能存储 NULL 值。

```
alter table persons modify age int not null;//设置 not null 约束 
```
```
alter table person modify age int null;//取消 null 约束
```

2. ```primary key - NOT NULL``` 和 ```UNIQUE ```的结合：
指定主键，确保某列（或多个列的结合）有唯一标识，每个表有且只有一个主键。
```
alter table persons add age primary key (id)
```
3. ```unique -```：
保证某列的每行必须有唯一的值。
*注：可以有多个 UNIQUE 约束，只能有一个 PRIMARY KEY 约束。* 
```
alter table person add unique (id);//增加unique约束。
```
4. ```check-```限制列中值的范围。
```
alter table person add check (id&gt;0);
```
5. ```default-```规定没有给列赋值时的默认值。
```
alter table person alter city set default &#39;chengdu&#39; ;	//mysql
```
```
alter table person add constraint ab_c default &#39;chengdu&#39; for city;	//SQL Server / MS Access
```
6. ```auto_increment-```自动赋值，默认从1开始。

7. ```foreign key-```保证一个表中的数据匹配另一个表中的值的参照完整性。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-sql-altershowsql%E7%BA%A6%E6%9D%9F/  

