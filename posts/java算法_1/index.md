# JAVA算法 · 二分查找


# 二分查找
## 前提
1. 给定一个内涵n个元素的有序数组A，满足升序
2. 一个待查值target

## 算法步骤
1. 设置 i = 0， j = n - 1
2. 两种情况
   1. 如果 i &gt; j，未找到
   2. 设置 m = (i &#43; j) / 2，并且向下取整 =&gt; 舍
3. 若target &lt; Am设置j = m-1，进行2
4. 若Am &lt; target设置i = m-1，进行2
5. 若Am = target，则找到

## 代码实现
```
package com.ting.binarySearch;

public class BinarySearch {
    //    二分查找基础版
    //    Params:
    //        a-待查很早的升序数组
    //    Returns:
    //        找到则返回索引
    //        找不到返回-1
    public static int binarySearch(int[] a, int target) {
        int i = 0, j = a.length - 1; //指针和初值
        while (i &lt;= j) { //范围内还有数据
            int m = (i &#43; j) / 2; //注意：JAVA里面自动取整，就不用再调用取整函数floor()
            if(target &lt; a[m]) {
                j = m - 1;
            } else if (target &gt; a[m]) {
                i = m &#43; 1;
            }else {
                return m;
            }
        }
        return -1;
    }
}
```

## 测试用例
```
package com.ting.binarySearch;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static com.ting.binarySearch.BinarySearch.binarySearch;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestBinarySearch {
    @Test
    @DisplayName(&#34;binarySearchBasic 找到&#34;)
    public void test1() {
        int[] a = { 7, 13, 21, 30, 38, 44, 52, 53};
        assertEquals(0, binarySearch(a, 7));
        assertEquals(1, binarySearch(a, 13));
        assertEquals(2, binarySearch(a, 21));
        assertEquals(3, binarySearch(a, 30));
        assertEquals(4, binarySearch(a, 38));
        assertEquals(5, binarySearch(a, 44));
        assertEquals(6, binarySearch(a, 52));
        assertEquals(7, binarySearch(a, 53));
    }

    @Test
    @DisplayName(&#34;binarySearch 没找到&#34;)
    public void test2() {
        int[] a = { 7, 13, 21, 30, 38, 44, 52, 53};
        assertEquals(-1, binarySearch(a, 0));
        assertEquals(-1, binarySearch(a, 15));
        assertEquals(-1, binarySearch(a, 60));
    }
}
```

## 深入探讨
### 1. 为什么while判断条件是```i &lt;= j```，不是```i &lt; j```
* 测试  
  修改后```i &lt; j```，在找7组报错，返回-1
* 原因  
  少了一组情况，就是i，j，m相同的情况。  
  i，j 所指元素也参与比较。若没有=则缺少了i，j所指元素

### 2. ```m = (i&#43;j)/2```是否有问题
* **测试**  
  当 ```n = Interger.MAX_VALUE```时，```m = (i&#43;j)/2```在第一个循环中计算数值已经比较大（为```Interger.MAX_VALUE - 1```），第二次循环中，若缩小左边界 i ，计算结果为负数，无法得到正确结果
* **原因**  
  1. 在第二次循环中，若缩小左边界 i 则 m 的值超过了Interger的最大值，无法得到正确结果。
  2. 为负数的原因主要是JAVA中，**如果超过了正整数的最高位，则要考虑最高位作为符号位**，因此由于计算出的二进制数字最高位表示负数，结果为负数，实际把这个负数转化为二进制后不考虑最高位为符号位则为正确结果的二进制。

&gt; **最高位是否考虑符号位**  
&gt; 例： ```1111_1111```  8 bits 
&gt; * 最高位不考虑符号位： 表示255  
&gt; * 最高位考虑符号位：表示-1【JAVA中式这样】 

* 解决  
  利用向右移位，把最高位变为0，避免最高位被作为符号位导致的负数。并且可以除以2.&lt;u&gt;【最低位舍去则为除以2】&lt;/u&gt;
  ```
  m = (i&#43;j) &gt;&gt;&gt; 1;
  ```

### 为什么所有条件判断都是小于符号```&lt;```
* 原因  
  由于数组是升序排列

## 改动版二分查找
### 代码实现
```
    /*
    * 二分查找改动版
    *    Params:
    *        a-待查很早的升序数组
    *        target-待查找的目标
    *    Returns:
    *        找到则返回索引
    *        找不到返回-1
    */
    public static int binarySearchAlternative(int[] a, int target) {
        int i = 0, j = a.length;    //改动第一处
        while (i &lt; j) {     //改动第二处
            int m = (i &#43; j) &gt;&gt;&gt; 1;
            if(target &lt; a[m]) {
                j = m;  //改动第三处
            }
            else if(a[m] &gt; target) {
                i = m &#43; 1;
            } else {
                return m;
            }
        }
        return -1;
    }
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/java%E7%AE%97%E6%B3%95_1/  

