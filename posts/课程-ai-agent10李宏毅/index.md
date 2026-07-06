# AI Agent· 第十讲 Model Editing


## Model Editing是什么

给模型植入一条新的信息。

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260702095152391.png&#34; style=&#34;zoom:50%;&#34; /&gt;

与Post Training的区别：Post training 是学习新的技能（语言、工具、推理...）

## Model Editing 评量方法

### Reliability

想要修改的目标和预期完全一致。

### Generalization

相似的问题还是可以输出正确答案。

* 改变说法
* 反过来问
* 问有关的

### Locality

改变后其他原本应该答对的知识应该答对。

## Model Editing 的方法

### 不动参数

&gt; In-context Knowledge Editing（IKE）

告诉模型怎么使用给他的新资讯。

### 动参数s

1. 人类决定怎么编辑

&gt; Rank-One Model Editing（ROME）

* 找出神经网络中给要编辑的知识最相同的部分。
* 修改部分参数。

利用找功能性神经元然后替换。

2. 人工智能学习怎么编辑

* 编辑其他模型的模型是HyperNetwork
* 训练HyperNetwork：MetaLearning

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260702101506599.png)

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260702101848170.png)


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:8533/posts/%E8%AF%BE%E7%A8%8B-ai-agent10%E6%9D%8E%E5%AE%8F%E6%AF%85/  

