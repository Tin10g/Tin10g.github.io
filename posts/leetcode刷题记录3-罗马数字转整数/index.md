# Leetcode刷题记录3-罗马数字转整数


## 原题

- 罗马数字包含以下七种字符: `I`， `V`， `X`， `L`，`C`，`D` 和 `M`。


例如，罗马数字 `2` 写作 `II`，即为两个并列的 1。`12` 写作 `XII`，即为 `X` &#43; `II`。 `27` 写作 `XXVII`，即为 `XX` &#43; `V` &#43; `II`。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写作 `IIII`，而是 `IV`。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4。同样地，数字 9 表示为 `IX`。这个特殊的规则只适用于以下六种情况：

- `I` 可以放在 `V` (5) 和 `X` (10) 的左边，来表示 4 和 9。
- `X` 可以放在 `L` (50) 和 `C` (100) 的左边，来表示 40 和 90。 
- `C` 可以放在 `D` (500) 和 `M` (1000) 的左边，来表示 400 和 900。

给定一个罗马数字，将其转换成整数。

### 思路

1. 用 `unordered_map` 设计一个字典查找罗马数字对应的值。
2. 从罗马数字字符串的最后一位开始遍历。
3. 如果当前字符的值小于之前的字符值（即出现了像 `IV`、`IX` 这样的情况），则减去当前字符的值；否则，直接加上当前字符的值。

### 改进后的代码

```cpp
#include &lt;iostream&gt;
#include &lt;unordered_map&gt;
#include &lt;string&gt;

class Solution {
public:
  int romanToInt(std::string s) {
      // 如果输入为空字符串，直接返回 0
      if (s.empty()) return 0;
      
      // 创建一个 unordered_map 映射罗马数字字符到对应的数值
      std::unordered_map&lt;char, int&gt; dict = {
          {&#39;I&#39;, 1}, {&#39;V&#39;, 5}, {&#39;X&#39;, 10}, {&#39;L&#39;, 50},
          {&#39;C&#39;, 100}, {&#39;D&#39;, 500}, {&#39;M&#39;, 1000}
      };

      int num = 0;       // 存储最终的整数值
      int before = 0;    // 用于记录当前数字之前的值
      int now = 0;       // 当前数字的值

      // 从右到左遍历字符串
      for (int i = s.size() - 1; i &gt;= 0; i--) {
          now = dict[s[i]];   // 获取当前字符对应的值

          // 如果当前数字小于之前的数字，说明是特殊情况（比如 IV, IX 等）
          if (now &lt; before) {
              num -= now;  // 减去当前数字
          } else {
              num &#43;= now;  // 否则加上当前数字
          }

          before = now;  // 更新之前的数字
      }

      return num;  // 返回计算出的整数
  }
};

int main() {
  Solution solution;
  std::string roman = &#34;IX&#34;;  // 测试输入
  int result = solution.romanToInt(roman);  // 调用函数
  std::cout &lt;&lt; &#34;The integer value of &#34; &lt;&lt; roman &lt;&lt; &#34; is: &#34; &lt;&lt; result &lt;&lt; std::endl;
  return 0;
}
```

### 主要修改点：
1. **去除重复实现**：只保留了一个实现，基于 `unordered_map`。
2. **输入检查**：增加了空字符串检查。
3. **清晰的结构**：代码结构更清晰简洁，避免了不必要的变量和条件判断。

你可以将这份完整的 Markdown 内容复制到你的文件中，这样可以在 GitHub Pages 上正常显示。如果还有任何问题，欢迎继续提问！


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/leetcode%E5%88%B7%E9%A2%98%E8%AE%B0%E5%BD%953-%E7%BD%97%E9%A9%AC%E6%95%B0%E5%AD%97%E8%BD%AC%E6%95%B4%E6%95%B0/  

