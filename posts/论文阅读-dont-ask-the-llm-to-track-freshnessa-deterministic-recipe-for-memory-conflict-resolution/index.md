# 论文 · Don’t Ask the LLM to Track Freshness: A Deterministic Recipe for Memory Conflict Resolution


## 基础信息
* 作者：Vikas Reddy; Sumanth Challaram
* 期刊/日期：arXiv:2606.01435v1，2026-05-31

## Q1. 研究动机

长期记忆系统会持续接收会变化的事实：

* 用户偏好会更新，政策会被新版本替代，知识库事实会被纠正。

* 核心困难不是“有没有存下来”，而是当同一事实在记忆中出现多个互相矛盾的版本时，**系统到底应该返回哪一个**。

MemoryAgentBench的FactConsolidation任务把这个问题做成了一个**干净压力测试**：事实带有序号，且prompt明确说明“newer facts have larger serial numbers”。

但**已有系统仍普遍失败**：HippoRAG-v2在 FC-SH 上只有 54%，BM25 48%，Mem0/Contriever 18%，Zep/Graphiti 7%，多跳 FC-MH 对大多数系统几乎未解。

作者认为这说明瓶颈**不只是存储结构，而是检索后如何组装、排序和解决冲突**。

## Q2. 核心问题

本文要回答的问题是：

在有显式版本标记的记忆冲突中，是否应让 LLM 自己判断“哪个事实更新”，还是把 LLM 限定为候选抽取器，再由确定性代码做版本聚合？

作者检验三个子问题：

- candidate extraction &#43; max(serial) 是否比 LLM-judgment answer pipeline 更可靠
- 该思路是否能扩展到多跳冲突链
- 序号版本能否迁移到真实会话中的 timestamp 更新场景

## Q3. 现有不足 &amp; 本文改进

现有记忆框架大量投入在复杂存储结构上，例如知识图谱、层次化 RAG、agentic loop、typed memory、temporal KG 等。

很多系统仍把“冲突解析”交给 LLM prompt 完成。

这样会把检索、候选过滤、训练先验抑制、版本比较和答案生成**缠在同一个自由文本步骤里**。

本文的改进很朴素：

- 保留 BM25 检索和 LLM 语义理解能力，但把 freshness 比较移出 LLM。

  &gt;  freshness 比较：比较知识是否过期，以及更新后的知识库是否能带来更符合当前时间的答案。

- LLM 只负责抽取所有语义匹配的候选事实，最终由代码对 serial 做 max()。

  &gt; serial：串行的 / 序列式的 / 连续编号的

这个设计直接消除两类失效：

- LLM 被真实世界先验覆盖 prompt 中的新事实
- 在长上下文、多候选条件下比较序号漂移

## Q4. 方法流程

单跳 SH-conflict 流程如下：

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260720105649196.png)

1. 对编号事实做 BM25 检索，默认 TOP_K=10。

   &gt; BM25 ：一种经典的**关键词检索算法**，常用于搜索引擎和 RAG 系统里，用来从一堆文档中找出和查询最相关的文本片段。

2. 用 LLM 严格抽取与问题 subject/predicate 语义匹配的候选，输出结构化 JSON：`serial`、原始事实文本、抽取实体。

3. 若候选为空则返回 `no answer`；否则返回 serial 最大候选的实体。

多跳 CAR（Chain-Aware Resolution）流程是在此基础上加入 Self-Ask 风格分解：

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260720105740429.png&#34; style=&#34;zoom:150%;&#34; /&gt;

把问题拆成原子 hop，每一跳用前一跳答案替换 placeholder，再运行同一个 SH-conflict 管道；

任何依赖断裂都会导致链条停止。

它的关键是“每一跳都先做确定性 freshness resolution，再传给下一跳”。

跨基准实验中，作者把 `max(serial)` 换成 `max(timestamp)`，用于 LongMemEval 的 knowledge-update 子集，检验该机制是否能迁移到真实会话时间戳。

## Q5. 实验设计与结论

主实验使用 MemoryAgentBench FactConsolidation，包含 FC-SH 和 FC-MH，长度为 6K、32K、64K、262K，每个 cell 100 题，指标为 SubEM。

关键结果如下：

* gpt-4o-mini &#43; candidate extraction &#43; `max(serial)` 在 FC-SH 平均 78.0%，262K 为 82%；同设置 LLM-judgment baseline 平均 67.2%，262K 为 61%，平均提升 &#43;10.8pp，最长上下文提升 &#43;21pp。
* gpt-4o 作为 backbone 时，FC-SH 平均达到 94.8%，262K 为 93%，显著高于 GPT-4o long-context 在 MAB 中的 60%。
* CAR 在 FC-MH 上平均 30.2%，超过 MAB 已发布系统的最好多跳结果 7%；换成 gpt-4o 后 CAR 平均 51.5%，o4-mini &#43; CAR 为 43.2%。
* chunk-4096 条件下，确定性管道平均 80.8%，同 chunk 的 LLM-judgment 为 61.0%，说明优势不只来自 fact-level chunking。
* 两个管道并非严格支配：在 400 个 FC-SH 问题中，二者至少一个答对的 union accuracy 为 88.5%；Python-only 正确占 21.3%，LLM-only 正确占 10.5%。
* LongMemEval knowledge-update 上，`max(timestamp)` 没有超过 LLM baseline：57.8% vs 64.4%，置信区间重叠。作者分析认为失败主要来自 Yes/No、历史状态、聚合类问题，这些需要的不是“最新值”算子。

结论是：对于“当前值冲突解析 &#43; 显式版本标记”任务，确定性聚合是正确原语；对于更广泛的记忆 QA，它需要与问题类型路由组合。

## Q6. 局限性

本文主结果集中在 MAB FactConsolidation，这个任务来自 MQUAKE counterfactual，冲突形式比真实用户记忆更干净。真实生产记忆可能存在部分序、合并版本、模糊更新时间、事件时间与记录时间不一致等情况。

matched comparison 不是 resolver-only ablation：

两个管道同时改变了 prompt、输出格式、temperature、LLM 的任务定义和 resolver。

严格证明 `max()` 本身贡献多少，需要共享候选列表后让 LLM picker 与 Python picker 对比。

此外，确定性管道并非总赢。严格候选抽取会过度拒绝一部分有效事实，导致约 10.5% 的问题由 LLM-judgment 答对而本文管道错。多跳也远未解决，FC-MH 30.2% 说明主要错误会在第一跳候选抽取后级联。

## Q7. 学术价值

这篇论文的价值在于把“记忆冲突解析”从存储架构问题重新定位为检索后 assembly 问题。

它用一个非常小的确定性模块证明：如果元数据已经给出版本顺序，让 LLM 自己做比较既昂贵又不稳定。

对长期记忆系统设计的启发很直接：

- 保存事实级元数据
- 把时间戳、serial、version string 这类结构化比较交给代码
- 让 LLM 做语义识别，而不是做精确排序

这个结论也能解释为什么 temporal KG 这类复杂结构如果仍由 LLM 判断 supersession，仍可能在冲突任务上失败。

## Q8. 延伸研究方向

1. 做真正 resolver isolation：

   同一批候选同时喂给 Python `max()`、LLM picker、规则 &#43; LLM hybrid，拆出纯 resolver 贡献。

2. 构建问题类型路由器：

   current-value 用 `max(timestamp)`，历史问题用 second-newest/k-th-newest，Yes/No 用布尔包装，统计问题用过滤聚合。

3. 用真实用户偏好更新、政策版本、协作文档修订验证，而不只使用 MQUAKE counterfactual。

4. 改进候选抽取召回，例如 subject linking、predicate paraphrase、fallback LLM-judgment，以减少 over-rejection。

5. 研究部分序和因果依赖更新，例如“合并分支”“撤销更新”“事件发生时间晚于记录时间”等。

## Q9. 反直觉发现与方法失效分析

最反直觉的是：明明 prompt 已经写清楚“序号越大越新”，LLM 仍会在长上下文里选旧事实或真实世界先验；而更复杂的记忆结构并没有天然解决这个问题。Zep/Graphiti 这类 temporal KG 在 FC-SH 上只有 7%，**说明“有时间结构”不等于“解析动作是可靠的”**。

本文方法失效主要来自确定性模块之前：BM25 没召回 counterfactual、LLM 抽错 subject、predicate 同义表达没匹配、候选抽取过度保守，或者多跳第一跳抽错导致后续级联。LongMemEval 中的失败则提醒：`max()` 是强原语，但不是通用记忆 QA 算子。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-dont-ask-the-llm-to-track-freshnessa-deterministic-recipe-for-memory-conflict-resolution/  

