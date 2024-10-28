# JAVA测试用例书写


# 测试用例书写步骤
## 以Maven管理的项目为例
&gt; 使用JUnit框架内的相关工具进行测试
### 步骤
1. 使用maven管理项目在pox.xml中加入dependency
```
        &lt;dependency&gt;
            &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
            &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
            &lt;version&gt;5.8.1&lt;/version&gt;
            &lt;scope&gt;compile&lt;/scope&gt;
        &lt;/dependency&gt;
```
2. 在类中导入要用的相关内容
    ```
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.DisplayName;
    ```
3. 在测试函数之前加上```@Test```和```@DisplayName()```
* ```@DisplayName()```为测试类或测试方法提供自定义显示名称，便于得到良好可观的输出
* ```@Test```表示标注测试类或测试方法

### 相关函数
1. assertEquals
   - JUnit 框架中的一个静态方法，用于在测试中进行断言，**验证预期值与实际值是否相等**。如果它们不相等，测试将失败，并报告一个错误。
   - 例子
    ```
    assertEquals(0, binarySearch(a, 7));
    ```
    &gt; 解释：  
    &gt; 0为预期值  
    &gt; binarySearch(a, 7)为结果值  
    &gt; 如果结果一致不报错，不一致则报错

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/java%E7%AE%97%E6%B3%95_%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E4%B9%A6%E5%86%99/  

