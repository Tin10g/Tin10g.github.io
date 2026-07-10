# 论文 · GraphRAG：From Local to Global


## 基础信息

- 论文标题：From Local to Global: A GraphRAG Approach to Query-Focused Summarization
- 作者：Darren Edge, Ha Trinh, Newman Cheng, Joshua Bradley, Alex Chao, Apurva Mody, Steven Truitt, Dasha Metropolitansky, Robert Osazuwa Ness, Jonathan Larson

**核心贡献**：GraphRAG 将文档集合预处理成 LLM 抽取的实体-关系图，并基于图社区生成层级 community summaries，使系统能够回答面向整个语料库的全局 sensemaking 问题，而不是只回答局部事实检索问题。

## Q1. 研究动机

传统 RAG 擅长回答可以定位到少量片段的问题，但面对“这个数据集的主要主题是什么”“有哪些跨文档趋势”这类全局问题时，向量检索只能取回局部样本，容易把局部事实误当整体总结。作者认为，这类问题本质上更接近 query-focused summarization，但传统 QFS 又难以扩展到 RAG 系统常见的大规模私有语料。

## Q2. 核心问题

本文试图解决的问题是：如何让 RAG 系统在百万 token 级别的私有语料上回答需要全局理解的问题。

它要处理的不是“找出最相关 chunk”，而是“如何把整个语料组织成可分层汇总、可按查询聚合的知识结构”。

## Q3. 现有不足 &amp; 本文改进

现有方法的不足：

- Vector RAG 偏局部：适合显式事实检索，不适合需要整体理解的 sensemaking query。
- 直接全文 summarization 成本高：对整个 source text 做 map-reduce summarization 会消耗大量 token。
- 普通知识图谱 RAG 多用于增强局部检索或图遍历，较少利用图的 modularity 来做全局 summarization。

本文改进点：

- 用 LLM 从文本块中抽取 entities、relationships 和 claims，构建图索引。
- 用 Leiden community detection 将图划分为层级社区。
- 为每个社区预生成 community summary，作为可复用的全局语义索引。
- 查询时先让每个 community summary 生成 partial answer 和 helpfulness score，再将高分 partial answers 汇总成最终答案。
- 通过 C0-C3 不同社区层级，探索 summary 粒度、回答质量和 token 成本之间的权衡。

## Q4. 方法流程

GraphRAG 的流程分为 indexing time 和 query time。

Indexing time 阶段，系统先将源文档切成 text chunks；然后用 LLM 抽取实体、关系和可选的 claims，并为这些元素生成简短描述；接着把重复出现的实体和关系聚合成 knowledge graph，其中边权可以反映关系重复出现次数。之后，系统用 Leiden 算法递归地检测图社区，形成层级 community structure。最后，LLM 为每个社区生成 report-like community summary：叶子社区直接汇总节点、边和 claims；高层社区则在上下文过长时用低层社区 summaries 替代原始元素描述。

Query time 阶段，系统选择某一层级的 community summaries，将它们打乱并按 token 窗口分块；每个块并行生成 community answer，同时给出 0-100 的 helpfulness score；得分为 0 的答案被过滤，剩余答案按 helpfulness 排序后放入最终上下文，由 LLM 生成 global answer。

## Q5. 实验设计与结论

| 实验/分析 | 目的 | 关键设置与结论 |
| --- | --- | --- |
| 全局 sensemaking 问题生成 | 构造没有 gold answer 的全局评测问题 | 对每个数据集生成潜在用户、任务和问题；设置 K=N=M=5，因此每个数据集有 125 个测试问题。 |
| Experiment 1：LLM-as-a-judge 成对比较 | 比较 GraphRAG、全文 map-reduce 和 vector RAG 的回答质量 | 数据集为 Podcast transcripts（约 1M tokens）和 News articles（约 1.7M tokens）。条件包括 C0-C3 四个 GraphRAG 社区层级、TS source text summarization、SS semantic search。 |
| 评价指标设计 | 评价全局回答的不同质量 | 主要指标为 comprehensiveness、diversity、empowerment；directness 作为控制指标。作者预期 directness 与 comprehensiveness/diversity 存在冲突。 |
| GraphRAG vs vector RAG | 验证全局方法是否优于局部检索 | Figure 2 显示，所有 GraphRAG 条件在 comprehensiveness 和 diversity 上均优于 SS。Podcast 中 comprehensiveness win rate 为 72-83%，diversity 为 75-82%；News 中 comprehensiveness 为 72-80%，diversity 为 62-71%。 |
| GraphRAG vs source text summarization | 验证图社区摘要是否优于直接全文 map-reduce | C1-C3 相比 TS 在 comprehensiveness 和 diversity 上有小幅、稳定优势；root-level C0 因过度压缩，在部分比较中不如更细层级。 |
| Token 成本分析 | 衡量图索引的可扩展性 | Table 2 中 Podcast 的 C0 只有 34 个 units、26,657 tokens，为 TS 的 2.6%；News 的 C0 为 55 个 units、39,770 tokens，为 TS 的 2.3%。C0 相比全文 TS 节省超过 97% query-time context tokens。 |
| Experiment 2：claim-based validation | 验证 LLM judge 结果是否有独立支持 | Table 3 中 SS 的平均 claims 数为 News 25.23、Podcast 26.50，所有 C0-C3 和 TS 都更高。Table 4 中 GraphRAG 在多数 cluster 数指标上高于 SS，说明 comprehensiveness/diversity 结论有一定外部验证。 |
| 附录：entity extraction self-reflection | 分析构图时的抽取质量 | Appendix A.2/Figure 3 显示，较大 chunk size 成本更低但容易漏抽实体；加入 self-reflection/gleaning 后可缓解实体漏抽问题。 |
| 附录：context window selection | 选择最终实验上下文窗口 | Appendix C 显示，在 8k、16k、32k、64k 中，8k 在 comprehensiveness 比较上平均 win rate 为 58.1%，因此最终统一使用 8k。 |

## Q6. 局限性

作者明确提到：

- 评估只覆盖两个约百万 token 的语料，并且问题集中在 sensemaking 类型，尚不清楚能否推广到更多领域、规模和用例。
- 当前分析还需要比较 fabrication rates，例如用 SelfCheckGPT 等方法检查答案是否虚构。
- 评估依赖 LLM-as-a-judge；虽然作者用 claim-based metrics 做了验证，但 LLM 评价仍可能有偏。
- 构建图索引存在成本，是否值得取决于数据集生命周期、预期查询次数和图索引的额外价值。

以下为分析归纳，非原文明确说明：

- GraphRAG 的效果很大程度依赖 LLM 抽取实体/关系的质量；抽取错误会进入图结构并被后续 community summaries 放大。
- 本文 entity matching 使用 exact string matching，虽然作者说 GraphRAG 对重复实体有一定韧性，但复杂领域里的同名/别名/跨语言实体仍可能影响图质量。
- GraphRAG 更适合全局问题；对精确局部事实问题，semantic search 可能更直接、更便宜。
- Community summaries 是预生成摘要，可能丢失细节；C0 这类 root-level summaries 成本极低，但也更容易过度压缩。

## Q7. 学术价值

- 理论价值：把 RAG 的问题从“局部检索”扩展到“语料级 sensemaking”，指出全局问题本质上更接近 query-focused summarization。
- 方法价值：提出基于 LLM 抽取图、图社区发现、层级社区摘要和 map-reduce global answering 的完整 pipeline。
- 应用价值：适合企业文档、新闻库、会议/访谈记录、情报分析、科研趋势分析等需要跨文档总结的大规模私有语料场景。

## Q8. 延伸研究方向

1. 设计 hybrid RAG：结合 embedding-based local retrieval 与 GraphRAG 的 community summaries，兼顾局部事实和全局结构。
2. 改进 entity resolution：从 exact string matching 扩展到别名识别、跨文档实体合并和领域本体约束。
3. 评估 hallucination/fabrication：比较 GraphRAG、TS、SS 在事实错误率上的差异，而不仅是 comprehensiveness/diversity。
4. 研究动态更新：当文档集合持续变化时，如何增量更新图索引和 community summaries。
5. 让用户可交互地 drill down：从高层社区摘要进入低层社区、原始实体、关系和来源文本。

## Q9. 反直觉发现与方法失效分析

- 发现一：GraphRAG 并不追求 directness 全赢。Figure 2 中 SS 在 directness 上通常更强，例如 Podcast directness 中 SS 对 C0/C1/C2/C3 的 win rate 分别为 65/60/60/60；News directness 中 SS 对 C0/C1/C2/C3 为 59/55/55/54。作者把 directness 作为控制指标，并认为它与 comprehensiveness/diversity 存在天然冲突。
- 发现二：最便宜的 C0 仍能显著优于 vector RAG。Table 2 中 C0 只占 TS token 的 2.6%（Podcast）和 2.3%（News），但 Figure 2 中 C0 对 SS 的 comprehensiveness win rate 仍为 72/72，diversity win rate 为 77/62。这说明对多轮全局查询，粗粒度社区摘要有很高性价比。
- 发现三：更细的社区层级并非总是更好。Figure 2 中 Podcast comprehensiveness 的 TS 对 C0 为 50、对 C1 为 48、对 C2 为 43、对 C3 为 44，说明中低层级社区摘要相对 TS 有优势；但 C0 因压缩过强不一定胜过 TS。作者讨论为 root-level summaries 有 modest drop，但成本极低。
- 发现四：claim-based diversity 对 News 数据集的支持弱于 LLM judge。Table 4 中 News 的 C0-C3 cluster 数都高于 SS，但正文指出只有 C0 在所有距离阈值上显著优于 SS，C1-C3 只在部分阈值显著；而 Experiment 1 中所有 GraphRAG 条件都显著优于 SS。作者认为方向一致，但差异幅度较小。
- 发现五：8k context 反而优于更大窗口。Appendix C 中，8k 在 comprehensiveness 上平均 win rate 为 58.1%，作者据此选择 8k。作者未把它作为核心贡献，但这提示“更长上下文”不必然带来更好的全局回答，可能与 lost-in-the-middle 或上下文噪声有关。
- 整体评价：GraphRAG 的优势非常明确地集中在全局 sensemaking；如果任务是短事实问答、需要精确引用原文，或查询次数很少，构图和社区摘要的前期成本未必划算。它更像是为“长期使用的大语料库”建立可复用的语义地图，而不是普通 RAG 的通用替代品。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-graphragfrom-local-to-global/  

