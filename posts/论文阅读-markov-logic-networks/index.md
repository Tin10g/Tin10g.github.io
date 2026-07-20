# 论文阅读 · Markov Logic Networks


## 基础信息
* 作者：Matthew Richardson, Pedro Domingos
* 期刊/日期：Machine Learning 62:107-136, 2006；Published online: 27 January 2006；DOI: 10.1007/s10994-006-5833-1
* 核心贡献：提出 Markov Logic Networks (MLNs)，通过给一阶逻辑公式附加权重，把硬逻辑知识库变成 Markov network 模板，并给出基于 query-focused grounding、MCMC、pseudo-likelihood 和 ILP 的推理与学习流程。

## Q1. 研究动机

AI 长期希望把概率图模型处理不确定性的能力与一阶逻辑表达关系知识的能力结合起来。纯逻辑对错误和矛盾很脆弱，纯概率图模型又难以紧凑表达关系结构；作者希望用一个简单表示同时获得两者优势。

## Q2. 核心问题

论文要解决的问题是：如何在有限域中把一阶逻辑公式变成可学习、可推理的概率模型，使公式不再是绝对硬约束，而是带强弱程度的软约束。技术上，需要定义这种模型的语义、ground network 构造、近似推理和权重/结构学习方法。

## Q3. 现有不足 &amp; 本文改进

作者指出，传统一阶知识库可看作 possible worlds 上的硬约束：只要一个世界违反任一公式，就被赋予零概率，因此面对真实世界中常见的不完整、噪声和矛盾知识时很脆弱。已有概率逻辑或统计关系学习方法通常只支持 Horn clauses、frame-based systems 或数据库查询语言等受限逻辑片段，且模型较复杂。传统 Markov network 虽能处理不确定性，但缺少一阶模板能力，难以紧凑描述关系型大域。

MLN 的改进是把每条一阶公式配一个实数权重。给定有限常量集后，每个 ground atom 成为二值节点，每个 ground formula 成为一个特征，其权重继承自原公式。公式被违反不再使世界不可能，只是降低其概率；权重越大，满足与不满足之间的 log probability 差异越大。当所有权重趋于无穷时，MLN 又退化回普通一阶逻辑知识库，因此它在概率和逻辑之间提供了连续桥梁。

## Q4. 方法流程

输入是一个带权一阶公式集合、有限常量集、证据和查询。系统先在 unique names、domain closure、known functions 等假设下把公式转为 clausal form 并 grounding；每个 ground atom 形成 Markov network 中的二值节点，每个 ground clause/formula 形成带权特征。回答查询时，算法不构造完整 ground network，而是从查询 atoms 出发，沿 Markov blanket 扩展出回答该查询所需的最小子网，再固定证据节点，用 Gibbs sampling 估计查询概率；若有硬约束或多峰分布，先用 MaxWalkSat 找高权重满足区域作为采样初始点。学习时，论文把关系数据库视作 closed-world 数据，主要用 pseudo-likelihood 和 L-BFGS 学权重，并可用 CLAUDIEN 等 ILP 系统学习或修正 clauses。

## Q5. 实验设计与结论

- 表示能力示例：Table 1 用 Friends、Smokes、Cancer 展示普通一阶知识库如何转成带权 MLN；Figure 1 展示把表中公式应用到 Anna 和 Bob 两个常量后得到的 ground Markov network。目的在于说明 MLN 是一阶公式到 Markov network 的模板化转换。

- Query-focused inference：Table 3 给出 ConstructNetwork 算法，从查询和证据出发递归加入 Markov blanket，构造回答查询所需的子网，而不是完整 grounding。作者强调最坏情况下节点数仍可达到 O(|C|^a)，但实践中通常更小。

- MC-MLE 与 pseudo-likelihood 的训练对比：Section 7.2.1 中，作者最初尝试用 MC-MLE 训练，10 条 Gibbs chains 在 UW-CSE 域上运行 24 小时，约 2 million Gibbs steps per chain，平均 Gelman R 为 3.04，没有任何训练集达到 R &lt; 2；作者估计即使用 R = 2.0 的弱收敛阈值也要 20 到 400 天。Section 7.2.2 中，pseudo-likelihood 训练明显更快：初始计数平均 2.5 分钟，之后平均 255 次 L-BFGS 迭代，总训练时间 16 分钟。

- UW-CSE link prediction 主实验：实验域是华盛顿大学 CSE 数据库，含 12 个 predicates、2707 个 constants、10 个 types，可能 ground atoms 为 4,106,841 个，数据库中 true tuples 为 3380 个。作者从四位志愿者收集 96 条公式，按五个研究方向 leave-one-area-out，预测 AdvisedBy(x, y)，并设置 All Info 与 Partial Info 两种证据条件。Table 4 中，MLN(KB) 表现最好：All Info AUC 0.215 ± 0.0172、CLL -0.052 ± 0.004；Partial Info AUC 0.224 ± 0.0185、CLL -0.048 ± 0.004。纯逻辑、Naive Bayes、Bayesian network 和 CLAUDIEN 相关系统整体落后。作者据此认为 MLN 明显优于纯逻辑和纯概率方法。

- 推理时间：Section 7.2.3 报告 All Info 下推断所有 AdvisedBy(x, y) atoms 的时间分别为 AI 3.3 分钟、graphics 24.4 分钟、programming languages 1.8 分钟、systems 10.4 分钟、theory 1.6 分钟；Partial Info 平均 14.8 分钟，高于 All Info 的 8.3 分钟。结论是 query-focused grounding 和 Gibbs sampling 使实验规模可处理。

- SRL 任务归约：Section 8 说明 collective classification、link prediction、link-based clustering、social network modeling、object identification 都可用 MLN 表示。这里不是新的实验，而是展示 MLN 作为统计关系学习通用语言的适用范围。

## Q6. 局限性

作者明确提到：

- Section 4 的语义依赖有限域设置，并在主体部分采用 unique names、domain closure、known functions 三个假设；无限域扩展被作者留作 future work。
- Section 5 明确说明直接计算查询概率在除最小域外不可行，因为 MLN inference 同时包含 #P-complete 的概率推理和 NP-complete 的逻辑推理。
- Section 5 的实际算法只处理查询和证据都是 ground literals conjunctions 的常见场景；含变量的 lifted inference 被列为重要未来方向。
- Section 7.2.1 明确说明当前版本中 MC-MLE 不适合训练，Gibbs sampling 收敛过慢。
- Section 10 将更高效 MCMC、belief propagation、special cases、lifted inference、结构学习、判别式训练、不完整数据学习等都列为未来工作。

以下为分析归纳，非原文明确说明：

- 学习部分采用 closed-world assumption，即数据库中没有出现的 ground atom 都被视作 false；在真实不完整知识图谱中，这可能把未知事实误当负例。
- 主要实验证据集中在 UW-CSE 的 AdvisedBy 预测，一个领域和一个关系任务不足以完全证明泛化性。
- Best AUC 只有 0.215 左右，绝对预测质量不高；论文的意义更偏“表示和方法可行性”，不是已经给出强实用性能。
- 自动结构学习由 CLAUDIEN 提供，但 Table 4 表明它经常降低性能，说明结构学习仍很脆弱。

## Q7. 学术价值

- 理论价值：MLN 给出了概率图模型和一阶逻辑之间非常简洁的桥梁：权重有限时是软逻辑概率模型，权重趋于无穷时回到硬逻辑。
- 方法价值：提供了从一阶公式到 ground Markov network 的模板化机制，以及 query-focused grounding、MaxWalkSat 初始化 Gibbs sampling、pseudo-likelihood 权重学习和 ILP 结构学习的完整流程；后来 Alchemy 等系统也沿此方向发展。
- 应用价值：适合统计关系学习中的 link prediction、collective classification、object identification、social network modeling、信息抽取、知识库构建和实体消歧等任务。

## Q8. 延伸研究方向

1. 如何做真正高效的 lifted inference，避免对大域关系数据进行昂贵 grounding？
2. 如何在不完整数据库和 open-world assumption 下学习 MLN，避免把未知关系误当负例？
3. 如何直接优化任务指标或 conditional likelihood，发展更强的判别式 MLN 学习方法？
4. 如何可靠地学习和修正一阶公式结构，使自动发现的规则不会像 CLAUDIEN 结果那样破坏性能？
5. 如何把 MLN 的软逻辑约束与神经表示、知识图谱 embedding 或 LLM 产生的候选事实结合？

## Q9. 反直觉发现与方法失效分析

- Section 7.2.1 中，理论上自然的 MC-MLE 训练在实际 UW-CSE 域中失败。运行 24 小时、约 2 million Gibbs steps per chain 后，平均 R 仍为 3.04，没有训练集达到 R &lt; 2；作者估计即使用 R = 2.0 也要 20 到 400 天。
  - 作者解释 / 作者未讨论：作者明确解释这是 Gibbs sampling 在完整 ground network 上收敛过慢导致的，并指出在当前版本中 MC-MLE 不可行。这是论文中最清楚的方法失效案例。

- Table 4 中，加入 CLAUDIEN 结构不但没有提升 MLN，反而会严重破坏性能。MLN(KB) 在 All Info 下 AUC 为 0.215、CLL 为 -0.052；MLN(KB&#43;CLB) 的 AUC 降到 0.011、CLL 降到 -3.905；MLN(CLB) 的 AUC 甚至只有 0.003。
  - 作者解释 / 作者未讨论：作者指出 CLAUDIEN 单独表现差，加入 KB 后也没有改善 MLN。这个结果说明 MLN 的概率权重不能自动修复质量很差的规则结构，结构学习是瓶颈。

- Table 4 中，Partial Info 下 MLN(KB) 没有变差，反而略好：All Info AUC/CLL 为 0.215/-0.052，Partial Info 为 0.224/-0.048。直觉上证据更少应更难。
  - 作者解释 / 作者未讨论：作者总体说 MLN 在需要推断中间 predicates 时“largely unaffected”，但没有专门解释为什么 Partial Info 数值略高。合理推测是实验划分、缺失信息的噪声或 Student/Professor predicates 与 AdvisedBy 的不完全匹配，使额外证据不一定总是正收益。

- Table 4 中，Naive Bayes 的 AUC 不算最差，但 CLL 明显糟糕。All Info 下 NB AUC 为 0.054，接近 KB 的 0.059，但 CLL 为 -1.214，远差于 KB 的 -0.135 和 MLN(KB) 的 -0.052。
  - 作者解释 / 作者未讨论：作者明确说 Naive Bayes 在某些测试集 AUC 好，但 CLL uniformly poor。说明它可能能排出一部分正例，但概率校准很差。

- Figure 2 及 Section 7.2.4 中，precision 在约 50% recall 附近普遍下降，作者将其归因于数据库非常不完整；低 recall 处偶发小跌落则来自学生毕业或换导师后仍与旧导师合著很多论文。
  - 作者解释 / 作者未讨论：作者已经解释这些现象。它提醒我们，UW-CSE 评估不仅测试模型能力，也受数据库时间漂移和缺失标签影响。

- 整体评价：MLN 的概念贡献很强，实验也显示它优于当时的纯逻辑和纯概率基线；但绝对 AUC 较低、训练依赖 pseudo-likelihood、推理依赖近似采样，且结构学习不稳。因此应把论文看作概率逻辑统一框架的奠基工作，而不是已经解决大规模统计关系学习全部工程问题。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-markov-logic-networks/  

