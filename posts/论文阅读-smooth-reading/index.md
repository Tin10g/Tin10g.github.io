# 论文 · Smooth Reading: Bridging the Gap of Recurrent LLM to Self-Attention LLM on Long-Context Understanding


## 基础信息

- 论文：Smooth Reading: Bridging the Gap of Recurrent LLM to Self-Attention LLM on Long-Context Understanding
- 作者：Kai Liu, Zhan Su, Peijie Dong, Fengran Mo, Jianfei Gao, Shaoting Zhang, Kai Chen
- 会议：ICLR 2026
- 主题：Recurrent LLM, long-context understanding, End-to-End Multi-Round inference, architecture-inference co-design
- 核心贡献：本文认为 Recurrent LLM 长上下文表现差并非只因架构记忆不足，而是 One-Round inference 与固定大小记忆不匹配；提出 Smooth Reading，将 Recurrent LLM 与 End-to-End Multi-Round inference 结合，通过 chunk reading、contextual summary、hidden memory preservation 和 early stopping，在保持线性复杂度的同时接近或超过 Self-Attention LLM 的长上下文表现。

## Q1. 研究动机

Self-Attention LLM 长上下文能力强，但计算复杂度随长度二次增长；Recurrent LLM 线性计算、常数内存，更适合超长上下文，却在 LongBench 等任务上落后。以往研究主要改架构、增大记忆容量，但仍未追平 Self-Attention。作者认为问题在于传统 One-Round inference 把整个长上下文一次性塞入固定记忆，导致 memory overwhelm。

## Q2. 核心问题

核心问题是：如何通过架构和推理方式协同设计，使 Recurrent LLM 在长上下文理解上弥合与 Self-Attention LLM 的性能差距，同时保留线性效率优势。

关键不是让 Recurrent LLM 单次记住所有内容，而是让它逐步阅读、压缩、更新记忆。

## Q3. 现有不足 &amp; 本文改进

现有不足：

- Self-Attention OR 推理表现强但成本高，context length 增大时训练和推理不经济。
- Self-Attention 的 multi-round 方法会重复处理上下文，复杂度更高；non-end-to-end multi-round 会丢弃 hidden states。
- Recurrent LLM 在 OR 下固定记忆被长输入压垮，导致长上下文理解差。

本文改进：

- 提出 EMR for Recurrent LLM：chunk-by-chunk 阅读，每轮生成 contextual summary 和动作。
- 保留并更新 recurrent hidden memory，不像 NMR 那样每轮丢弃隐藏状态。
- 通过 SFT 构造 48,856 条 Smooth Reading 数据，让模型学会 &lt;READ&gt;/&lt;STOP&gt; 行为。
- 提出窗口大小和 chunk size 共同优化的 co-design 观点。

## Q4. 方法流程

输入是 query 和长 context。Smooth Reading 先用分层规则 chunker 将 context 切成语义相对完整的小块。模型每轮读取当前 chunk，生成包含 Target、Clues、Reason 的 contextual summary，并更新 hidden memory。如果模型判断信息足够，就输出 &lt;STOP&gt; 和答案；否则输出 &lt;READ&gt; 继续读取下一块。训练时，作者用规则或 DeepSeek-V3 生成 stepwise summaries 和最终答案，构造 SFT 数据。输出是能在多轮阅读中保留 hidden memory 的 Recurrent LLM。

## Q5. 实验设计与结论

- LongBench 主实验：Table 2 中 Qwen-2.5-3B-OR 平均 47.38，Self-Attention NMR 为 48.37；Recurrent OR 较弱，RWKV-7-3B-OR 为 41.43，SWA-3B-4k-OR 为 41.70；Smooth Reading 后 RWKV-7-3B-EMR 达 48.03，SWA-3B-4k-EMR 达 50.99。
- NIAH 长度外推：Table 3 中 Qwen-2.5-3B-OR 在 8K-32K 平均 98.13，但 64K-256K 平均仅 41.33，256K 为 0.00；SWA-3B-4k-EMR 在 8K-32K 平均 99.93，64K-256K 平均 99.80，256K 仍为 99.60。
- 效率实验：Figure 4 显示在 64K 下，SWA-3B-4k-EMR 训练速度约为 Qwen-2.5-3B-OR 的 2.5 倍，推理约快 2 倍；启用 early stopping 后最多约快 4 倍。
- Window/chunk 消融：Table 4 显示 chunk size 不应超过窗口大小。W=512、C=2048 或 4096 时 accuracy 为 0.0；W=4096、C=2048 时 accuracy 为 100.0，C=4096 时降到 83.4。
- 7B 扩展：Table 6 中 SWA-7B-4k-EMR 平均 53.86，接近 Qwen-2.5-7B-OR 的 54.60，明显高于 SWA-7B-4k-OR 的 46.17。
- OOD 评估：Table 8 中 RULER Avg，SWA-3B-4k-EMR 为 28.10，高于 Qwen-2.5-3B-OR 的 26.25；Table 9 中 HELMET Avg，SWA-3B-4k-EMR 为 25.01，略低于 Qwen-2.5-3B-OR 的 25.64。
- 与 OPRM/RAG 类方法对比：Table 10 中 SWA-3B-4k-EMR LongBench Avg 为 50.99，显著高于 OPRM 变体 27.88、30.73、31.35。

## Q6. 局限性

作者明确提到：

- 没有提出全新架构或全新推理算法，而是系统研究已有组件的 co-design。
- 只研究 sliding-window LLM 和 RWKV，未覆盖 DeltaNet 等其他 recurrent architecture，主要受限于开源预训练模型和推理引擎。
- 方法需要额外 SFT 来适配 Smooth Reading 推理范式。
- 需要专门构造 multi-round training data，数据成本较高。
- 当前只支持 [QUERY] [CONTEXT] 顺序，不支持 [CONTEXT] [QUERY]。
- 评估主要集中在 long-context tasks，尚未扩展到 deep research、software development 等更广场景。

以下为分析归纳，非原文明确说明：

- Smooth Reading 的收益依赖模型能生成高质量 summary；一旦 summary 遗漏关键信息，后续 hidden memory 可能无法恢复。
- 多轮推理引入 action 和 stopping 决策，可能出现过早停止或过度阅读。
- 长上下文效果很强，但 HELMET 和 RULER 上仍存在任务不均衡表现。

## Q7. 学术价值

- 理论价值：强调 architecture-inference co-design，指出 Recurrent LLM 的性能瓶颈不是架构单点，而是与推理方式共同决定。
- 方法价值：提出可操作的 EMR pipeline，包括 chunking、summary、hidden memory preservation、early stopping 和窗口/chunk 调参原则。
- 应用价值：适合超长文档阅读、长对话历史、研究资料浏览等需要线性扩展和渐进式阅读的场景。

## Q8. 延伸研究方向

1. 将 Smooth Reading 扩展到 DeltaNet、Mamba、RetNet 等更多 recurrent 或 state-space 架构。
2. 用 RL 学习阅读顺序和停止策略，减少人工 summary 数据构造。
3. 支持 [CONTEXT] [QUERY] 和任意顺序 chunk selection，使模型能先扫全文再响应任务。
4. 研究 summary 错误如何累积，以及如何用 verification 或 retrieval 修复。
5. 在 LongBench v2、真实代码库、科研文献综述任务上评估其深层 reasoning 能力。

## Q9. 反直觉发现与方法失效分析

- 发现一：Self-Attention NMR 平均略升，但某些任务退化。Table 2 中 Qwen-2.5-3B-NMR Avg 48.37 高于 OR 的 47.38，但 Summary 从 30.22 降到 21.91，Code 从 66.00 降到 64.13。说明多轮压缩并不总是有益，丢 hidden state 会伤害部分任务。
- 发现二：Self-Attention OR 在训练长度内强，但长度外推崩溃。Table 3 中 Qwen-2.5-3B-OR 在 8K-32K 平均 98.13，但 256K 为 0.00；SWA-3B-4k-EMR 在 256K 仍为 99.60。
- 发现三：最快的 chunk 设置可能完全无效。Table 4 中 W=512、C=4096 推理时间为 100 秒，是表中最快之一，但 accuracy 为 0.0；说明效率不能脱离记忆窗口约束。
- 发现四：OOD HELMET 上 Smooth Reading 不全面领先。Table 9 中 SWA-3B-4k-EMR 的 Avg 为 25.01，略低于 Qwen-2.5-3B-OR 的 25.64；ICL 更是 16.68 vs. 34.80。作者指出 PRR 和 VT 等任务更 OOD，整体说明训练分布仍影响泛化。
- 整体评价：Smooth Reading 在 retrieval-like 和 NIAH 类超长任务上非常强，效率优势清楚；但在需要复杂 task adaptation 的 HELMET/ICL 上仍存在明显短板。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-smooth-reading/  

