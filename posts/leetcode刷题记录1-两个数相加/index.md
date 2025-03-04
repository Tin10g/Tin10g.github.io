# Leetcode刷题记录1-两数相加


## 原题

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 和为目标值target的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

## mine思路

### 代码 

```c&#43;&#43;
class Solution {
public:
    vector&lt;int&gt; twoSum(vector&lt;int&gt;&amp; nums, int target) {
        std::vector&lt;int&gt; res={0,0};
        for(int i=0; i&lt;nums.size(); i&#43;&#43;){
            int num1 = nums[i];
            for(int j=i&#43;1; j&lt;nums.size();j&#43;&#43;){
                if(num1 &#43; nums[j] == target){
                    res[0] = i;
                    res[1] = j;
                    break;
                }
            }
        }
        return res;
    }
};
```

### 算法复杂度

时间复杂度O(n)

### 知识点

* **Vector 动态数组**
  * 动态调整大小
  * 支持随机访问（类似顺序表）
  * 容量不足动态扩展，时间复杂度为O(1)

## 进阶

&gt; 算法时间复杂度小于O(n^2)

### 思路——使用哈希表

1. 哈希表可以通过值得到索引
2. 通过求取差值，即得到对于第i个数所需要的值，去寻找索引

### 知识点

- **map 有序哈希表** `std::map&lt;std::string, std::string&gt; map;`

  - 有序性：便于简化一些操作
  - 红黑树：内部实现红黑树使得map的很多操作在lgn的时间复杂度实现，效率高

- **unordered_map 无序哈希表** `std::unordered_map&lt;std::string, std::string&gt; map;`

  - 查找速度极快
  - 哈希表建立耗时
  - 一般用于查找问题
  - 遍历时和存入数据时顺序不一定相同
  - 执行效率比map高
  - 内存占有率unordered_map比map高（Hash表 VS 红黑树）

- 迭代遍历哈希表

  ` auto it = hashtable.find(target - nums[i]);`

  - auto &amp; iterator
    auto不用显示写出迭代器的变量类型，省略声明

    iterator需要显示写出迭代器变量类型，`vector&lt;int&gt;::iterator it = ……`

- 迭代器的begin和end

  begin()指向第一位，end()指向**最后一位的后一位**（空的）

### 代码

```c&#43;&#43;
class Solution {
public:
    vector&lt;int&gt; twoSum(vector&lt;int&gt;&amp; nums, int target) {
        unordered_map&lt;int, int&gt; hashTable;
        for (int i=0; i&lt;nums.size(); i&#43;&#43;){
            auto it = hashTable.find(target-nums[i]);
            if (it != hashTable.end()){
                return {it-&gt;second, i};
            }
            hashTable[nums[i]] = i;
        }
        return {};
    }
};
```



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/leetcode%E5%88%B7%E9%A2%98%E8%AE%B0%E5%BD%951-%E4%B8%A4%E4%B8%AA%E6%95%B0%E7%9B%B8%E5%8A%A0/  

