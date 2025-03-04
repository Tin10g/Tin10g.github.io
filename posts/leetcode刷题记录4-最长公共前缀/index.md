# Leetcode刷题记录4-最长公共前缀


## 原题

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 `&#34;&#34;`。

## mine思路

### 思路

1. 利用第一个字符串遍历，从第一个字符串第一个开始和其他的对比，不一样就打断停止循环

### 代码 

```c&#43;&#43;
class Solution {
public:
    string longestCommonPrefix(vector&lt;string&gt;&amp; strs) {
        string res = &#34;&#34;;
        string tmp = &#34;&#34;;
        string s = strs[0];
        for(int i=0; i&lt;s.size(); i&#43;&#43;){
            tmp = s[i];
            for(int j=0; j&lt;strs.size(); j&#43;&#43;){
                string s1 = strs[j];
                if(s1[i] == &#39; &#39; || s1[i] != s[i]) return res;
            }
            res = res &#43; tmp;
        }
        return res;
    }
};
```

### 缺点

1. **字符串拼接效率低**：
   - `res = res &#43; tmp;` 每次都会创建一个新的字符串对象，并将 `res` 和 `tmp` 的内容复制到新对象中。这种操作的时间复杂度是 `O(n)`，其中 `n` 是 `res` 的长度。
   - 在循环中频繁拼接字符串会导致性能下降。
2. **不必要的变量**：
   - `tmp` 和 `s1` 是多余的变量，增加了内存开销。
3. **边界条件检查不完善**：
   - `if(s1[i] == &#39; &#39; || s1[i] != s[i])` 中的 `s1[i] == &#39; &#39;` 是一个不必要的检查，因为题目没有提到空格是特殊字符。
   - 如果 `strs[j]` 的长度小于 `i`，直接访问 `s1[i]` 会导致越界错误。
4. **提前返回**：
   - 一旦发现不匹配的字符，立即返回 `res`，这是正确的，但实现方式不够简洁。 

## 更好的实现方法

### 思路

1. 避免频繁拼接字符串，改用 `substr` 一次性提取结果。
2.  
3. 移除不必要的变量。

### 代码

```cpp
class Solution {
public:
    string longestCommonPrefix(vector&lt;string&gt;&amp; strs) {
        if (strs.empty()) return &#34;&#34;;
        string s = strs[0];
        int i;
        for (i = 0; i &lt; s.size(); i&#43;&#43;) {
            for (int j = 1; j &lt; strs.size(); j&#43;&#43;) {
                if (strs[j].size() &lt;= i || strs[j][i] != f[i]) {  
                    return f.substr(0, i);
                }
            }
        }
        return f.substr(0, i);
    }
};
```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/leetcode%E5%88%B7%E9%A2%98%E8%AE%B0%E5%BD%954-%E6%9C%80%E9%95%BF%E5%85%AC%E5%85%B1%E5%89%8D%E7%BC%80/  

