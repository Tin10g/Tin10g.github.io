# AI Agent· 第三讲 Transformer架构


## Transformer架构

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629100943402.png&#34; style=&#34;zoom:50%;&#34; /&gt;

## Self-Attention vs RNN

### RNN（类比Memory的过程）

* Ht：memory
* f(A,t)：Reflection
* f(B,t)：Read
* f(C,t)：Write

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629101556239.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### Self-Attention

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629102258078.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 二者区别

* Self-Attention

  * 平行的输出结果：对于一个完整的输入，能够平行的输出对应的下一个的token。
  * memory占用更多：每一个输入都依赖于前面所有的输出
  * GPU友好：矩阵运算

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629103210665.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* RNN

  * 线性的输出

## Linear Attention

&gt; RNN从数学公式层面平行输出

公式上去掉了f(A,t)，结构上和self-attention只差一个softmax

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629105223169.png)

* Training：类似self-attention
* inference：类似RNN
* 缺点：记忆永远不改变（不会遗忘所有的内容）

* 基于Linear attention的改进模型

  * Retention Network

    加入gama来控制过去的记忆逐渐遗忘

    ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629110047410.png)

  * Gated Retention

    利用sigmod来对gama值训练，对不同的记忆有不同程度的遗忘

    ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629110431361.png)

  * Gradient Descent

    把即将存入的memory的信息中包含过去信息的部分减去

    ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629111110222.png)



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AF%BE%E7%A8%8B-ai-agent3%E6%9D%8E%E5%AE%8F%E6%AF%85/  

