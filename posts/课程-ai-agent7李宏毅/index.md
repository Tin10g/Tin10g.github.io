# AI Agent· 第七讲 深度思考的大语言模型


## 深度思考模型

* 特点

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701163457746.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* Test-Time Compute：深度越深 结果越好
* Test-Time Scale：思考越多 结果越好
* Reasoning vs Inference
  * Reasoning：模型为了解决问题进行多步思考、分析、推导
  * Inference：模型运行一次，输入 prompt，输出结果。

## 打造推理语言模型的方法

### 更强的思维链 CoT（Chain-of-Thought）【不微调】

先列出解题过程再给出答案。

* short CoT
  * Few-shot CoT
  * Zero-shot CoT
  * Supervised CoT
* 只适用于比较强的模型

### 给模型工作流程【不微调】

* Mojority Vote

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701165244285.png)

* Verification（Parallel）

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701165532970.png&#34; style=&#34;zoom: 40%;&#34; /&gt;

* Verification（Sequential）

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701165715277.png&#34; style=&#34;zoom: 50%;&#34; /&gt;

* Verification（Parallel&#43;Sequential）

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701165801712.png&#34; style=&#34;zoom:50%;&#34; /&gt;

  * 怎么验证？

    每一步后面有一个`&lt;/step&gt;`出现这个后就启动Process Verifier模块

    * Monte Carlo Tree Search 蒙特卡洛树搜索（用来做决策/搜索的算法）：先试很多可能路线，再把更有希望的路线重点探索

    &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701170637034.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 教模型推理过程 （Imitation Learning）【微调，后训练】

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701171046057.png&#34; style=&#34;zoom:50%;&#34; /&gt;

其中的reasoning process可以通过模型本身要求其使用CoT来产生训练材料。

Verifier可以是现成的语言模型。

如果要确认reasoning process是正确的，可以使用前面的process verifier来逐步确认正确性或用强化学习来给出正确几率最高的答案。

但是没必要每一步都要正确，因为模型需要有找自己问题的能力（反思）

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701171309705.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* Stream of search（SoS）

  广度遍历树，故意走错误路线，强化思索中知错能改的功能

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701172036214.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 以结果为导向学习推理 RL（Reinforcement Learning）【微调，后训练】

&gt; Deepseek R系列

只在意结果，不在意过程。因此R1的reasoning人难读懂。

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701172301786.png&#34; style=&#34;zoom:50%;&#34; /&gt;


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AF%BE%E7%A8%8B-ai-agent7%E6%9D%8E%E5%AE%8F%E6%AF%85/  

