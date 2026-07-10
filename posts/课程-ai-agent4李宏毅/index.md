# AI Agent· 第四讲 大型语言模型训练方法


## 训练流程

* alignment：模型微调，偏好回答设置
  * 内容可以少，但质量很重要

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629115215400.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### Pretrain

&gt; 不能直接使用

* 怎么让pretrain有效？

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701093230484.png&#34; style=&#34;zoom:50%;&#34; /&gt;

  同一个东西要有多样化的版本，pre-train结果会好

* 用于pre-train的数据大多要清洗

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701094150978.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* 有限算算力、固定模型下要尽可能给模型看更多不同的资料

* Pre-train的后遗症：

  * 只要看到不应该看的东西后难真正清除

### Alignment

* Knowledge Distillation

  利用已有的模型作为老师，能够用很少的data的得到很好的结果。

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260629120814380.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* 问老师的问题：不重要

* 在alignment前后模型差异评测：（假设在alignment后fine这个token几率是最高，则对比alignment前）

  * Unshift：fine的这个token依旧几率最高
  * Marginal：fine的几率前三
  * Shifted：fine的几率在前三之外（连接词）

* self-alignment

* alignment可以影响什么

  开始学unknown得到东西会使模型能力下降，MaybeKnown最有效

  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701094651897.png&#34; style=&#34;zoom:50%;&#34; /&gt;

* RL （强化学习）：提高正确答案的几率

  * RLHF（人类反馈强化学习）


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AF%BE%E7%A8%8B-ai-agent4%E6%9D%8E%E5%AE%8F%E6%AF%85/  

