# AI Agent· 第六讲 生成式人工智能后训练


## 后训练简介 Post training(Continual Learning)

* alignment和post training的区别
  * 后训练使用的fundation model可以是instruct model（已经经历过alignment的model），也可以是pre-training之后的。而alignment的只是pre-training后的
  * alignment的偏好调整是让模型的行为更符合人类或产品希望的偏好（不一定要训练，训练是实现的一个方法），post-training的偏好调整是对模型本身的再训练

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701132724617.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* 后训练的例子（给某个模型训练另一种语言）

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701135148770.png&#34; style=&#34;zoom:50%;&#34; /&gt;

## 后训练方法

### Pre-train Style

类似于给一句话不足后面的内容。例如：今天天气很_    好

### SFT Style（监督微调）

依据我的期待给出答案。例如：（input）你的名字叫什么？（output）gpt5.5

### RL Style（强化学习）

对期望答案鼓励，对不期望的答案否认

## 后训练的遗忘问题

&gt; 这也是post-training最大的问题 ，即Catastrophic Forgetting

* 通过训练新的语言之后，模型可能安全防御这些性能下降。eg. 可能需要再做alignment

* 通过post-training教会模型一个特定技能，其它原有的基础能力会被遗忘

* 解决方法

  * 在训练输入新问题的时候混入一点过去材料（可以让agent自己生成过去的方法）或者不想让他遗忘的材料，能够有效防止一些记忆遗忘【self-output】

    &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701161811918.png&#34; style=&#34;zoom:50%;&#34; /&gt;



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AF%BE%E7%A8%8B-ai-agent6%E6%9D%8E%E5%AE%8F%E6%AF%85/  

