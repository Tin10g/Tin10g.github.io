# Leetcode刷题记录3-罗马数字转整数


## 原题

- 罗马数字包含以下七种字符: `I`， `V`， `X`， `L`，`C`，`D` 和 `M`。

  ```
  字符          数值
  I             1
  V             5
  X             10
  L             50
  C             100
  D             500
  M             1000
  ```

  例如， 罗马数字 `2` 写做 `II` ，即为两个并列的 1 。`12` 写做 `XII` ，即为 `X` &#43; `II` 。 `27` 写做 `XXVII`, 即为 `XX` &#43; `V` &#43; `II` 。

  通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 `IIII`，而是 `IV`。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 `IX`。这个特殊的规则只适用于以下六种情况：

  - `I` 可以放在 `V` (5) 和 `X` (10) 的左边，来表示 4 和 9。
  - `X` 可以放在 `L` (50) 和 `C` (100) 的左边，来表示 40 和 90。 
  - `C` 可以放在 `D` (500) 和 `M` (1000) 的左边，来表示 400 和 900。

  给定一个罗马数字，将其转换成整数。

## mine思路

### 思路

1. 用unordered_map设计一个字典查找罗马数字对应的值
2. 遍历传入的string，从最后一位到第一位
3. 若前一位大于后一位就是特殊情况，比如IV表示4。在这种情况下num = num-now；否则num = num&#43;now

### 代码 

```c&#43;&#43;
class Solution {
public:
    int romanToInt(std::string s) {
        std::unordered_map&lt;char, int&gt; dict = {{&#39;I&#39;, 1}, {&#39;V&#39;, 5}, {&#39;X&#39;, 10}, {&#39;L&#39;, 50}, {&#39;C&#39;, 100}, {&#39;D&#39;, 500}, {&#39;M&#39;, 1000}};
        int num = 0;
        int before = 0;
        int now = 0;
        
        for(int i = s.size() - 1; i &gt;= 0; i--) {
            now = dict[s[i]];
            if(now &lt; before) {
                num -= now;
            } else {
                num &#43;= now;
            }
            before = now;
        }
        return num;     
    }
};
```

## 其他方法

&gt; 枚举

```cpp
class Solution {
public:
    int romanToInt(string s) {
        if (s.size() == 0) 
            return 0;
        switch (s[0]) {
            case &#39;I&#39;:
                if (s.size() &gt; 1) {
                    switch (s[1]) {
                        case &#39;V&#39;:
                            return 4 &#43; romanToInt(s.substr(2));
                        case &#39;X&#39;:
                            return 9 &#43; romanToInt(s.substr(2));
                        default:
                            return 1 &#43; romanToInt(s.substr(1));
                    }
                } else {
                    return 1;
                }
            case &#39;V&#39;:
                return 5 &#43; romanToInt(s.substr(1));
            case &#39;X&#39;:
                if (s.size() &gt; 1) {
                    switch (s[1]) {
                        case &#39;L&#39;:
                            return 40 &#43; romanToInt(s.substr(2));
                        case &#39;C&#39;:
                            return 90 &#43; romanToInt(s.substr(2));
                        default:
                            return 10 &#43; romanToInt(s.substr(1));
                    }
                } else {
                    return 10;
                }
            case &#39;L&#39;:
                return 50 &#43; romanToInt(s.substr(1));
            case &#39;C&#39;:
                if (s.size() &gt; 1) {
                    switch (s[1]) {
                        case &#39;D&#39;:
                            return 400 &#43; romanToInt(s.substr(2));
                        case &#39;M&#39;:
                            return 900 &#43; romanToInt(s.substr(2));
                        default:
                            return 100 &#43; romanToInt(s.substr(1));
                    }
                } else {
                    return 100;
                }
            case &#39;D&#39;:
                return 500 &#43; romanToInt(s.substr(1));
            case &#39;M&#39;:
                return 1000 &#43; romanToInt(s.substr(1));
            default:
                return -1;
        }
    }
};
```


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/leetcode%E5%88%B7%E9%A2%98%E8%AE%B0%E5%BD%953-%E7%BD%97%E9%A9%AC%E6%95%B0%E5%AD%97%E8%BD%AC%E6%95%B4%E6%95%B0/  

