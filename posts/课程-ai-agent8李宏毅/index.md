# AI Agent· 第八讲 大语言模型的推理过程


## 推理和正确率

* 推理长度越长不一定会让正确率提高

* 答案越长也不一定让正确率提高

## 怎么避免模型想太多

### 更强的思维链（Chain-of-Thought，CoT）

* chain of draft

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701185548714.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 给模型工作流程

让模型控制树的高度和广度

### 教模型推理过程

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701185703580.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* from explicit CoT to Implicit CoT

  前提是要用简单的问题

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701185829138.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 以结果为导向学习推理

用模型进行以正确结果为目标回答四次，选择reasoning更短的reward

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701190017306.png)


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AF%BE%E7%A8%8B-ai-agent8%E6%9D%8E%E5%AE%8F%E6%AF%85/  

