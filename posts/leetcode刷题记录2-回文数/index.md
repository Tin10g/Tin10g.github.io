# Leetcode刷题记录2-回文数


## 原题

给你一个整数 `x` ，如果 `x` 是一个回文整数，返回 `true` ；否则，返回 `false` 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

- 例如，`121` 是回文，而 `123` 不是。

## mine思路

### 思路

1. int转字符串
2. 用reverse反转 得到反转后字符串
3. 相等则正确，不相等则不正确

### 代码 

```c&#43;&#43;
class Solution {
public:
    bool isPalindrome(int x) {
        string s1 = std::to_string(x);
        string s2 = s1;
        reverse(s2.begin(), s2.end());
        if(s1 == s2) return true;
        else return false;
    }
};
```

### 算法复杂度

时间复杂度O(n)

### 知识点

* int 转 string

  `string s = std::to_string(x)`

* string反转

  `reverse(s.begin(), s.end())`

  此时s为反转后的字符串

### 缺点

这需要**额外的非常量空间**来创建问题描述中所不允许的字符串

## 进阶

&gt; 不用转为字符串解决

### 思路

1. 负数肯定不是回文数(特殊情况)

2. 最后一位是0则若为回文数第一位也是0，除了0之外所有以0结尾的数都不是回文数(特殊情况)

3. 将整个数x反转看是否相等（若反转后的数字大于int.MAX，可能遇到溢出问题）=&gt; 所以反转整数一半后比较前后两个部分

4. 比较一半需要判断位数奇偶，如何知道反转数字的位数已经达到原始数字位数的一半

   由于整个过程我们不断将原始数字除以`10`，然后给反转后的数字乘上`10`，所以，**当原始数字小于或等于反转后的数字时**，就意味着我们已经处理了一半位数的数字了

   |   x   | revertedNum |
   | :---: | :---------: |
   | 12321 |      0      |
   | 1232  |      1      |
   |  123  |     12      |
   |  12   |     123     |

   |   x    | revertedNum |
   | :----: | :---------: |
   | 123321 |      0      |
   | 12332  |      1      |
   |  1233  |     12      |
   |  123   |     123     |

### 代码

```c&#43;&#43;
class Solution {
public:
    bool isPalindrome(int x) {
        if (x&lt;0 || (x!=0 &amp;&amp; x%10 ==0)) return false;
        int revertNum = 0;
        while(revertNum &lt; x){
            revertNum = revertNum*10 &#43; x%10;
            x = x/10;
        }
        if(revertNum == x || revertNum/10 == x ) return true;
        return false;
    }
};
```



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/leetcode%E5%88%B7%E9%A2%98%E8%AE%B0%E5%BD%952-%E5%9B%9E%E6%96%87%E6%95%B0/  

