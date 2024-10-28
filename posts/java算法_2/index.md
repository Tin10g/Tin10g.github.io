# JAVA算法 · 时间复杂度计算


# 时间复杂度
&gt; 以二分查找为例
```
// 线性查找
public static int lineSearch(int[] a, int target) {
    for(int i = 0; i &lt; a.length; i&#43;&#43;){
        if (a[i] == target) {
            return i;
        }
        return -1;
    }
}
```
```
// 二分法查找基础版
    public static int binarySearchBasic(int[] a, int target) {
        int i = 0, j = a.length - 1; //指针和初值
        while (i &lt;= j) { //范围内还有数据
            // 利用右移，进行除以2操作，并防止把超出int位数的部分作为符号位
            int m = (i &#43; j) &gt;&gt;&gt; 1; //注意：JAVA里面自动取整，就不用再调用取整函数floor()
            if(target &lt; a[m]) {
                j = m - 1;
            } else if (a[m] &lt; target) {
                i = m &#43; 1;
            }else {
                return m;
            }
        }
        return -1;
    }
```
## 计算步骤
1. 找到最坏执行情况  
   代码行数执行最多
2. 假设每个语句执行时间一样，计算每个语句执行次数

## 线性查找
1. 最坏情况 —— 没找到target数字
2. 计算每个语句执行次数（假设数组有n个数字
   
| 代码段 | 执行次数 |
| :----: | :----: |
| int i = 0 | 1次 |
| i &lt; a.length | n&#43;1次 |
| i&#43;&#43; | n次 |
| a[i] == target | n次 |
| return -1; | 1次 |
| 合计 | 3n&#43;3次 |

## 二分查找
1. 最坏情况 —— 没找到target数字  
&gt; 以右侧没找到为准，右侧没找到更差
2. 

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/java%E7%AE%97%E6%B3%95_2/  

