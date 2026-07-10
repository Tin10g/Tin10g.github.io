# 论文 · RAG综述


## 基础信息

* 会议/期刊：arXiv preprint, 2026
* 关键词：memory governance, selective forgetting, retrieval, conditional success probability, Bayesian update

核心贡献：本文从信息检索视角把文本 RAG 统一拆解为 pre-retrieval、retrieval、post-retrieval、generation 四个阶段，并系统梳理每一阶段的典型技术、评估框架、系统挑战与未来方向。

### Q1. 研究动机

LLM 训练后知识静态、领域知识不足且容易幻觉；RAG 通过检索外部信息让模型获得更新、更可靠的上下文。但 RAG 研究发展很快，术语分散，同一方法常影响多个流程环节，导致研究贡献难以定位。作者因此希望从 IR 视角建立统一框架。

### Q2. 核心问题

这篇文章试图回答：

* 文本 RAG 系统可以被拆成哪些关键环节？

* 已有研究分别改进了哪些环节？

* 这些改进在检索质量、生成可靠性、系统效率和长上下文场景中面临哪些挑战？

### Q3. 现有综述不足与本文改进

作者认为已有 RAG 综述各有侧重，但存在三个不足：

- Gao et al. 的 Naive / Advanced / Modular RAG 分类能展示复杂度演进，但没有细拆 IR 流程中的具体阶段。
- Zhao et al. 覆盖文本、图像、视频等多模态应用，范围很广，但对文本生成中的 RAG 技术分析不够深入。
- Hu et al. 关注 retriever 与 LM 的交互模式，覆盖生成和理解任务，但不是按检索处理阶段展开。

本文改进点是：把 RAG 研究放进一个四阶段流程中，从“系统在哪一步被增强”来组织文献。这让读者能更容易判断一个方法是在改进**索引、查询、检索、重排、过滤、生成增强还是个性化**。

### Q4. 方法/框架流程

RAG 的基础流程是：先对外部语料建立索引；用户问题进入系统后，检索器从索引中找相关文档；生成器把问题和检索结果合并为输入，生成最终回答。

作者进一步把这个流程拆成四个阶段：

- Pre-retrieval：准备数据，包括索引和数据修改。

  - 索引：倒排索引、dense vector index、图索引、量化索引等。

    &gt; Dense vector index（稠密向量索引）：一种用来快速检索“语义相似内容”的数据结构

  - 数据修改：清洗、补充 metadata、内部知识显式化、外部知识增强。

    &gt; a.  清洗：把原始资料整理干净，让它更准确、统一、可用。
    &gt;
    &gt; ​	eg：去重、纠错、统一格式、删除无关内容、拆分过长文本、修正乱码、补齐标题层级等。
    &gt;
    &gt; b.  补充 metadata：给资料加上“描述它自己的信息”，方便检索、筛选、排序和追踪来源。
    &gt;
    &gt; ​	eg：标题、作者、时间、来源、主题标签、部门、文档类型、版本、权限级别、关键词、摘要、关联项目等
    &gt;
    &gt; c.  内部知识显式化：原本藏在个人经验、口头沟通、团队习惯、隐性规则里的知识，整理成可以被别人读懂、被系统检索、被 AI 使用的形式。

- Retrieval：处理查询并搜索排序

  - 包括 query expansion、query reformulation、prompt-based rewriting、search and ranking，不同检索策略。

    &gt; query expansion：加更多相关词，扩大能搜到的范围
    &gt;
    &gt; query reformulation：改写问题，让它更清楚、更适合搜索
    &gt;
    &gt; prompt-based rewriting：用 LLM 按 prompt 自动改写查询
    &gt;
    &gt; search and ranking：检索候选内容，并按相关性排序

- Post-retrieval：对初检结果再加工。 

  - 包括 re-ranking 和 filtering。
  - 目标是减少噪声、压缩上下文、保留对生成真正有帮助的证据。

- Generation：把检索到的信息真正转化为回答，包括 enhancing 和 customization。

  - Enhancing：关注证据融合、ensemble、feedback/self-correction

    &gt; 证据融合：多个证据怎么合成一个可信答案
    &gt;
    &gt; ensemble：多个模型/方法怎么一起降低错误
    &gt;
    &gt; feedback/self-correction：生成后怎么检查并修正错误

  - Customization：关注用户画像、历史偏好和个性化生成。


### Q5. 证据组织与结论支撑

- Figure 2：基础工作流
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706090442278.png)

  - 目的：说明 RAG 最小闭环是 index -&gt; retrieve -&gt; generate。
  - 结论：RAG 的核心不是单个模型，而是检索系统和生成模型的组合流程。
  
- Figure 3：RAG 核心技术分类树
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706090322903.png)

  - 目的：把 RAG 方法映射到四阶段流程。
  - 结论：现有方法主要集中在检索相关环节，generation customization 相对稀少。
  
- Table 1：五种检索策略比较
  - 目的：比较 Basic、Iterative、Recursive、Conditional、Adaptive retrieval 的机制、场景、复杂度、成本和优势。
  
    | 策略        | 核心                  |
    | ----------- | --------------------- |
    | Basic       | 一次检索              |
    | Iterative   | 多轮检索，逐步补证据  |
    | Recursive   | 按层级/图结构逐层深入 |
    | Conditional | 满足条件才检索        |
    | Adaptive    | 动态决定怎么检索      |
  
  - 结论：检索策略没有绝对最优；Basic 低复杂度低成本，Adaptive 高灵活但高复杂度高成本，Conditional 通过判断是否检索降低延迟和成本。
  
- Table 2：RAG 评估框架比较
  - 目的：整理 RAGAS、ARES、RECALL、RGB、MIRAGE、eRAG、UDCG、BERGEN 等评估框架。
  
    | 框架       | 简介                                  | 主要看什么                                          |
    | ---------- | ------------------------------------- | --------------------------------------------------- |
    | **RAGAS**  | 常用的 RAG 自动评估框架               | Context relevance、Answer relevance、Faithfulness   |
    | **ARES**   | 对 RAGAS 的改进型评估框架             | 用更可靠的评估器和置信区间评估答案相关性、忠实性    |
    | **RECALL** | 面向反事实鲁棒性的评估框架            | RAG 遇到误导信息时是否会被带偏                      |
    | **RGB**    | 评估 RAG 对 LLM 的整体影响            | 噪声鲁棒性、拒答能力、信息整合、反事实鲁棒性        |
    | **MIRAGE** | 医疗问答场景的 RAG 评测框架           | 医疗 QA 中 RAG 是否真正提升准确率                   |
    | **eRAG**   | 更关注检索质量对生成结果影响          | 检索 precision、recall、hit rate、MAP、MRR、NDCG 等 |
    | **UDCG**   | 评估检索内容的“有用性”和“干扰性”      | 好文档是否帮助回答，干扰文档是否损害回答            |
    | **BERGEN** | 标准化 RAG 实验的 benchmark/framework | 用统一设置比较不同 RAG 系统                         |
  
  - 结论：RAG 评估需要同时评估 retrieval 和 generation。仅看传统检索相关性不足，因为 LLM 会整体处理上下文，容易被语义相关但无答案的 distractor 影响。
  
- Table 3：RAG 研究总表
  
  - 目的：按 retrieval source、multi-hop、training、pre-retrieval、retrieval、post-retrieval、generation 等维度标注代表工作。
  - 结论：大多数方法使用外部数据；多跳/迭代检索越来越常见；研究重心偏向 retrieval，而 generation customization 仍是空白较大的方向。
  
- Table 4：Retriever 与 Generator 总表
  - 目的：列出代表系统使用的检索器和生成器。
  - 结论：BM25、DPR、Contriever、Bing、BGE、知识图谱/向量库等仍并存；RAG 系统设计需要在语义质量、效率、可部署性之间权衡。

### Q6. 局限性

作者明确讨论的挑战主要集中在 Section 8：

- 检索模型选择：BM25 效率高，在术语标准化的垂直语料中仍可能很强；神经检索语义能力更强，但成本和部署复杂度更高。
- 检索质量：噪声、无关文档、碎片化信息、hard distractor 都会损害生成质量。
- 系统效率：精确最近邻检索在某些系统中可占到总推理时间的 97%；近似检索虽快但可能返回更多低质候选，反过来增加生成端负担。
- 长上下文 RAG：更多检索文本不一定更好。作者提到长上下文模型会出现 inverted U-shaped 曲线，即检索段落增加后性能先升后降。

### Q7. 学术价值

- 理论价值：将 RAG 从“模型加检索”的宽泛说法，转化为可分析的 IR 流程框架。
- 方法价值：提供一个诊断模板：如果 RAG 效果差，可以分别检查索引、数据、查询、检索器、重排、过滤、生成融合和个性化环节。
- 应用价值：对问答、聊天机器人、科学文献生成、医疗 QA、个性化生成、企业知识库等文本生成场景有直接参考意义。

### Q8. 延伸研究方向

1. 如何设计专门面向 RAG 的检索器，而不是直接复用通用 IR 检索模型？
2. 如何在低延迟约束下做高质量 re-ranking 和 filtering？
3. 如何衡量检索结果对生成答案的“真实贡献”，而不只是文本相关性？
4. 如何处理 hard distractor、噪声文档和互相冲突的证据？
5. 长上下文 LLM 与 RAG 应如何动态协作，例如先 RAG，必要时再切换 full-context？

### Q9. 反直觉发现与方法失效分析

- Table 1：Adaptive retrieval 并非总是更好
  - 现象：Adaptive 的主要优势是灵活，可在生成中动态决定何时检索、检索什么，但表中标注复杂度 High、成本 High。
  - 作者解释：复杂开放任务需要 on-demand information，但高灵活度带来高复杂度和高成本。
  - 评价：Adaptive 更像高难任务方案，不适合作为默认工程方案。

- Section 8.2：无关文档有时可能提升准确率
  - 现象：作者提到 Cuconasu et al. 指出在某些条件下，加入 irrelevant documents 反而能提高整体准确率。
  - 作者解释：这挑战了“检索结果越干净越好”的直觉，提示噪声可能在特定设置下有特殊作用。
  - 评价：这是重要的反直觉点，但文章没有给出统一机制解释，仍需专门实验验证。

- Section 8.3：检索加速可能带来端到端变慢
  - 现象：精确最近邻检索可占总推理时间最高 97%；近似检索虽然更快，但低质量候选可能迫使系统检索更多文档，增加生成端负担。
  - 作者解释：速度、检索质量、上下文长度之间存在端到端 tradeoff。
  - 评价：RAG 优化不能只看 retriever latency，要看 retrieve &#43; rerank &#43; generation 的整体延迟。

- Section 8.4：长上下文中“更多检索段落”不一定更好
  - 现象：作者总结长上下文 LLM 中检索段落数量增加后，性能可能先升后降；OpenScholar 相关测试中，给标准 Llama 3.1-8B 超过 10 个 passages 会降低事实准确性和引用质量。
  - 作者解释：hard negatives 与 lost in the middle 会干扰模型。
  - 评价：RAG 的关键不是塞更多证据，而是控制证据质量、顺序和结构。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-rag%E7%BB%BC%E8%BF%B0/  

