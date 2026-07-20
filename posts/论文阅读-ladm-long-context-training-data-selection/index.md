# 论文 · LADM: Long-Context Training Data Selection With Attention-Based Dependency Measurement for LLMs


## 基础信息

- 论文：LADM: Long-context Training Data Selection with Attention-based Dependency Measurement for LLMs

- 作者：Jianghao Chen, Junhong Wu, Yangyifan Xu, Jiajun Zhang

- 会议：ACL 2025 Long Papers

- 主题：long-context data selection, attention dependency, continual training, LongBench

- 核心贡献：本文提出 LADM，用一个轻量 Long Attention Calculator 根据长文本内部 span 之间的 attention dependency 计算 Contextual Dependency Score，从大规模多域语料中筛选高质量长上下文训练样本，使模型用 1B tokens 的 continued training 就能在多类长上下文任务上优于随机采样和 ProLong 式数据选择。

  &gt; span:  长文本里被切出来的连续文本块
  &gt;
  &gt; 长文本内部 span 依赖 :  不同文本块之间是否存在需要跨很远距离才能理解的关系

## Q1. 研究动机

长上下文模型通常靠长文本 continued training 获得能力，但并非所有长文本都有真实长程依赖。由短片段拼接而成、段落之间弱相关的样本可能让模型只学到局部模式，甚至更容易忽略远距离信息。

已有工作关注长度、领域平衡或基于 perplexity 的依赖强度，但对长文本内部结构和跨段依赖刻画不足。

## Q2. 核心问题

核心问题是：如何在大规模多域预训练语料中，高效找出真正包含长距离、多样化上下文依赖的高质量长文本样本，用于长上下文continual training。

判断文本内部是否有跨 span 的有效依赖关系。

## Q3. 现有不足 &amp; 本文改进

现有不足：

- 长文本长度不等于高质量长依赖。Table 1 的 preliminary experiment 显示，用 4K×8 拼成 32K 的训练数据，NIAH 平均仅 0.57；完整 32K 样本平均为 0.88。
- 基于相似度或 delta perplexity 的方法难以利用完整上下文结构，可能只看局部片段间关系。
- 随机采样需要更多 token 才能接近高质量筛选效果。

本文改进：

- 训练一个 TinyLlama-1.1B 级别的 Long Attention Calculator，用 attention 分布捕捉长程依赖。
- 定义 PFS、AFS、CDS 三层指标，从 span pair 到 span，再到 sample level 聚合。
- 在各数据域内按 CDS 排名选样，保持原始领域分布，同时优先选择强依赖样本。

## Q4. 方法流程

输入是大规模长上下文预训练语料。作者先训练一个具备基础长上下文能力的小模型作为 Long Attention Calculator。对每个长样本，将文本切成固定长度 spans，计算当前 span 对先前 spans 的 accumulated attention，得到 Pairwise Focus Score。然后排除开头和局部邻近 span，强调更远距离依赖，并把依赖强度和依赖多样性聚合成 Aggregated Focus Score。最后将所有 span 的 AFS 合成 sample-level Contextual Dependency Score。输出是按 CDS 排序筛出的高质量长文本子集，用于各类 LLM 的 continued training。

## Q5. 实验设计与结论

- Preliminary experiment：Table 1 比较不同拼接长度的数据。4K×8 的平均 NIAH 为 0.57，8K×4 为 0.69，完整 32K×1 为 0.88，说明上下文真实依赖比表面长度更重要。
- Long Attention Calculator 有效性：Figure 2 显示完整 32K 样本在远距离 span 上的 median attention scores 更高，说明该小模型能区分拼接样本和真实长依赖样本。
- PPL 评估：Table 2 中 LADM 在 Proof-Pile 各模型、各窗口下 PPL 均略优。例如 L-7B 在 32K 上 LADM 为 2.453，Random 为 2.458，ProLong 为 2.470。差距小，但方向一致。
- NIAH 评估：Figure 3 中 LADM 的平均 retrieval score 显著更高。OL-3B 从 Random 89.6%、ProLong 87.2% 提升到 LADM 95.2%；L-7B 提升到 99.4%；M-7B 提升到 100.0%；L-13B 提升到 99.4%。
- LongBench 主实验：Table 3 显示 LADM 在四类模型上总体优于 Random 和 ProLong。例如 Mistral-7B Overall 从 ProLong 33.18 提升到 LADM 37.00，Single-Doc QA 从 23.76 提升到 33.85。
- 训练效率：Table 4 显示 LADM 用 1B tokens 就能超过随机采样 2B tokens。例如 L-7B 上 LADM 1B avg 为 37.83，Random 2B 为 36.52。
- 选择效率：Table 5 中默认 d_AFS=4、d_CDS=4 时为 2.46 sec/sample；d_CDS 变小会让时间增至约 3.95-3.98 sec/sample，而相关性仍约 0.72。
- 消融实验：Table 6 中完整 LADM avg 为 37.83，去掉 standard deviation 权重降为 36.88，去掉 length 权重降为 36.49，说明依赖多样性和距离权重都有贡献。

## Q6. 局限性

作者明确提到：

- 需要用一个 tiny model 做数据选择，会引入额外计算开销。
- 没有在超过 13B 参数的 LLM 上实验，因为长上下文训练成本过高。
- 受长上下文数据资源限制，只在 32K context length 下实验，尚未验证更长上下文数据构造。

以下为分析归纳，非原文明确说明：

- LADM 假设 attention dependency 能代表训练样本质量，但 attention 分数不一定等价于语义因果依赖。
- CDS 高的语料类型偏向论文、法律、书籍等强结构文本，可能对开放域网页或对话类数据不公平。
- PPL 提升很小，主收益主要体现在下游任务，说明该方法需要昂贵评测才能充分验证。

## Q7. 学术价值

- 理论价值：把“长上下文数据质量”具体化为跨 span dependency，而不是仅用长度或领域标签定义。
- 方法价值：提供一个可插拔的数据筛选框架，可与 ProLong、RoPE 扩展、continued training 等方法结合。
- 应用价值：适合在预算有限时从大语料里挑选少量高质量长文本，降低长上下文训练 token 成本。

## Q8. 延伸研究方向

1. 将 CDS 与人工标注的长程依赖类型对齐，验证 attention-based score 的解释性。
2. 在 128K、512K 甚至更长文本上评估 LADM 是否仍能稳定筛选有效样本。
3. 把 LADM 和 ProLong 的 ShortMix/long data recipe 结合，研究长数据质量与短能力保持的关系。
4. 用更强或专门训练的 Long Attention Calculator 替代 TinyLlama，比较选择质量和成本。
5. 对不同任务定制 CDS，例如 QA、summarization、code repo reasoning 是否需要不同依赖模式。

## Q9. 反直觉发现与方法失效分析

- 发现一：完整 32K 样本远好于拼接成 32K 的样本。Table 1 中 4K×8 拼接平均 0.57，而 32K×1 为 0.88，说明“长度足够”不代表模型能学会长依赖。
- 发现二：LADM 并非在所有子任务都最好。Table 3 中 OL-3B 的 NarrativeQA，LADM 为 17.09，低于 Random 的 18.65；M-7B 的 Code AVG，LADM 为 60.58，低于 ProLong 的 61.82。作者未逐项解释这些退化，可能是 CDS 更偏向自然语言长依赖，对代码局部结构和特定 QA 数据不完全匹配。
- 发现三：PPL 差距很小但下游差距明显。Table 2 中 L-7B 32K PPL，LADM 2.453、Random 2.458、ProLong 2.470，差距很小；但 Table 3 中 L-7B Overall，LADM 37.83、Random 34.67、ProLong 35.51。说明 PPL 对长上下文能力的敏感性有限。
- 发现四：ProLong 数据选择在某些 NIAH 设置下低于 Random。Figure 3 中 OL-3B 的 ProLong score 为 87.2%，低于 Random 的 89.6%。这提示基于既有 recipe 的数据筛选并非无条件优于随机采样。
- 整体评价：LADM 的总体证据充分，尤其是跨模型平均提升明显；但它更像“优先选择强上下文依赖文本”的启发式，仍需按任务类型检查单项退化。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-ladm-long-context-training-data-selection/  

