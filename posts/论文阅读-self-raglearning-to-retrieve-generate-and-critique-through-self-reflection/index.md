# 论文 · Self-RAG：Learning to Retrieve, Generate, and Critique Through Self-Reflection


## 基础信息

- 论文标题：Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection
- 作者：Akari Asai, Zeqiu Wu, Yizhong Wang, Avirup Sil, Hannaneh Hajishirzi
- 机构：University of Washington, Allen Institute for AI, IBM Research AI

**核心贡献**：Self-RAG 训练语言模型在生成过程中按需检索、评估检索证据、判断生成内容是否被证据支持，并用 reflection tokens 控制推理过程，从而提升知识密集型任务中的 factuality、citation accuracy 和整体生成质量。

## Q1. 研究动机

LLM 只依赖参数知识时容易产生事实错误；传统 RAG 虽然能引入外部知识，但通常固定检索若干文档，不判断当前任务是否真的需要检索，也不保证检索内容相关或生成内容被证据支持。作者观察到，这种“无差别检索”会降低模型通用性，甚至把无关段落引入上下文，导致低质量或不忠实的回答。

## Q2. 核心问题

本文要解决的问题不是“如何再训练一个更大的模型”，而是：如何让语言模型在生成时自己决定是否需要外部知识，并在使用检索结果后自我评估证据相关性、答案支持度和回答有用性。

技术上，Self-RAG 试图把 RAG 的检索决策、证据筛选和生成质量判断都变成模型可学习、可解码、可控制的 token-level 行为。

## Q3. 现有不足 &amp; 本文改进

现有 RAG 的主要不足：

- 固定检索：无论任务是否需要事实 grounding，都检索固定数量文档。
- 证据不筛选：检索器返回的 top passages 可能无关，但普通 RAG 仍会把它们塞进 prompt。
- 生成不受约束：即使 passage 相关，模型输出也不一定被 passage 支持。
- 推理不可控：普通 RAG 很难在 citation precision、completeness、fluency 等目标之间灵活调节。

本文改进点：

- 引入 reflection tokens，把检索和自我批判变成模型生成的一部分。
- 用 `Retrieve` token 判断是否需要检索，而不是每次固定检索。
- 用 `ISREL` 判断检索 passage 是否相关。
- 用 `ISSUP` 判断生成片段是否被 passage 支持。
- 用 `ISUSE` 判断整体回答是否有用。
- 推理时通过 segment-level beam search 和 reflection token 概率选择更相关、更被支持、更有用的输出片段。

## Q4. 方法流程

Self-RAG 的输入是用户问题或任务指令。模型先根据当前输入和已经生成的内容预测是否需要检索：如果不需要，就像普通 LM 一样继续生成；如果需要，就调用 retriever 取回若干 passages。

对每个 passage，模型先判断它是否相关；随后基于该 passage 生成下一个回答片段；生成后再判断该片段是否被 passage 完全支持、部分支持或不支持。最后，模型还会评估回答片段对原始任务是否有用。推理阶段，系统会并行处理多个 retrieved passages，并利用这些 reflection tokens 的概率作为软约束，选择更优的片段继续生成。

训练分两步。第一步，作者用 GPT-4 为不同类型的 reflection tokens 生成监督数据，再蒸馏出一个 critic model。第二步，critic model 和 retriever 被用来把普通 instruction-output 数据增强成带 passage 和 reflection tokens 的训练数据，最终训练 generator 同时预测普通文本和 reflection tokens。

## Q5. 实验设计与结论

| 实验/分析 | 目的 | 关键设置与结论 |
| --- | --- | --- |
| 主实验：六类任务综合评估 | 验证 Self-RAG 是否优于普通 LLM 与普通 RAG | 任务包括 PopQA、TriviaQA、PubHealth、ARC-Challenge、Biography、ASQA。Table 2 中 Self-RAG 13B 在 PopQA 55.8、PubHealth 74.5、ARC 73.1、ASQA citation precision 70.3、citation recall 71.3，整体达到非专有模型最佳。 |
| 与无检索模型比较 | 验证 retrieval/self-reflection 是否带来增益 | Self-RAG 在所有任务上显著优于 Llama2、Alpaca 等无检索模型，并在 PopQA、PubHealth、Biography、ASQA 的部分指标上超过 ChatGPT。 |
| 与普通 RAG 比较 | 验证是否优于简单“检索后拼接上下文” | 普通 retrieval-augmented Llama2/Alpaca 在 PopQA、Biography 等可从文档抽取事实的任务上有收益，但在 PubHealth、ARC 等不能简单复制 evidence 的任务上收益有限；ASQA 中普通 RAG 的 citation precision/recall 很低，而 Self-RAG 明显更高。 |
| Ablation：No Retriever / No Critic | 验证检索器和 critic 的必要性 | Figure 3(a) 中，50k 训练设置下 Self-RAG 在 PopQA/PubHealth/ASQA 为 45.5/73.5/32.1；No Retriever 降到 43.6/67.8/31.0；No Critic 在 ASQA 降到 18.1，说明 critic 对长答案与引用任务尤其关键。 |
| Ablation：测试时策略 | 验证按需检索和支持度约束是否重要 | No retrieval 在 PopQA 只有 24.7；Retrieve top1 为 41.8；Remove `ISSUP` 后 ASQA 为 30.6，低于 Self-RAG 的 32.1。说明不加区分地使用 top1 passage 或移除支持度判断都会伤害性能。 |
| Inference-time customization | 验证 reflection tokens 能否用于控制生成 | Figure 3(b) 显示，提高 `ISSUP` 权重会提升 ASQA citation precision，但会降低 MAUVE，说明更强证据约束和流畅/完整生成之间存在权衡。 |
| Retrieval threshold 分析 | 验证模型能否调节检索频率 | Figure 3(c) 显示，随着 retrieval threshold 增大，检索频率明显下降；PopQA 对检索减少更敏感，PubHealth 的性能下降较小。 |
| Training scale 分析 | 验证数据规模影响 | Figure 4 显示，训练数据从 5k/10k/20k/50k 扩大到 150k 后，PopQA 和 ASQA citation precision 有明显上升趋势。 |
| Human evaluation | 验证 reflection token 与人类判断是否一致 | Figure 4(d) 中，PopQA 的 S&amp;P 为 92.5，Biography 为 70.0；`ISREL` 人类一致性为 95.0/90.0，`ISSUP` 为 90.0/85.0，说明相关性和支持度 token 大体可信。 |

## Q6. 局限性

作者明确提到：

- 在 Ethical Concerns 中，作者承认 Self-RAG 虽然提升 factuality 和 citation accuracy，但仍可能生成没有被 citation 完全支持的内容。
- Figure 3(b) 显示 citation precision 与 MAUVE 存在取舍，提高支持度权重可能让输出更保守、更不流畅。
- 作者指出 150k 训练数据并非上限，进一步扩大训练数据可能继续提升效果。

以下为分析归纳，非原文明确说明：

- Reflection tokens 是模型自我评估，不等于外部事实验证；如果 critic 学错，生成器也会继承这种判断偏差。
- 方法依赖 retriever 的召回质量。若关键证据没有被检索到，`ISSUP` 只能在错误或不完整证据池里做判断。
- 训练流程依赖 GPT-4 产生初始 reflection token 标注，存在成本、可复现性和标注风格迁移问题。
- 推理阶段比普通 LM 更复杂，需要检索、并行 passage 处理和 segment-level 选择，实际部署成本更高。

## Q7. 学术价值

- 理论价值：把 RAG 从“外部工具拼接上下文”推进到“模型内部可学习的检索-生成-批判循环”，强调生成过程中的自反式控制。
- 方法价值：提出了可复用的 reflection token 设计，包括检索需求、证据相关性、证据支持度和回答有用性。
- 应用价值：适合开放域问答、长答案生成、带引用回答、事实核查和需要控制 citation precision 的知识密集型应用。

## Q8. 延伸研究方向

1. 将 Self-RAG 的 reflection tokens 与更强外部 verifier 结合，区分“模型认为被支持”和“证据逻辑上确实支持”。
2. 研究更细粒度的 retrieval action，例如检索源选择、查询重写、多跳检索和停止检索策略。
3. 探索 Self-RAG 在多模态 RAG、代码 RAG、医学/法律等高风险领域中的可靠性。
4. 降低训练和推理成本，例如用更小 critic、更少 passage、更高效的 segment selection。
5. 研究 reflection token 的可解释性：用户是否能根据这些 token 更有效地审查答案来源与风险。

## Q9. 反直觉发现与方法失效分析

- 发现一：普通 RAG 不总是提升性能。Table 2 中，Llama2-chat 13B 的 PubHealth 为 49.4，而 Ret-Llama2-chat 13B 为 52.1，提升有限；ARC 上 Llama2-chat 13B 为 38.4，Ret-Llama2-chat 13B 反而为 37.9。作者解释为：对不能简单从 passage 复制答案的任务，普通检索增强帮助有限。
- 发现二：7B Self-RAG 在部分指标上超过 13B。Table 2 中 Self-RAG 7B 的 Biography FactScore 为 81.2，高于 13B 的 80.2；ASQA MAUVE 为 74.3，高于 13B 的 71.6。作者指出 7B 有时会生成更短、更精确 grounded 的输出，因此在 factual precision 相关指标上可能反而更好。
- 发现三：提高证据支持度会牺牲流畅性。Figure 3(b) 显示，提高 `ISSUP` 权重会提升 citation precision，但 MAUVE 下降。作者对此有讨论：更长、更流畅的回答往往包含更多未被 citation 完全支持的 claim。
- 发现四：No Critic 对 ASQA 伤害极大。Figure 3(a) 中 No Critic 的 ASQA 为 18.1，而 Self-RAG 为 32.1。作者将其作为 critic 重要性的证据；我的理解是，长答案引用任务并不只需要“检索”，更需要持续判断每个生成片段是否被 evidence 支撑。
- 整体评价：Self-RAG 的实验结论比较稳健，主实验、消融和人工评估互相支持。但它不是幻觉问题的彻底解决方案，而是一种显著更可控的 RAG 生成框架；其效果仍受检索器、critic 标注质量和任务类型影响。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-self-raglearning-to-retrieve-generate-and-critique-through-self-reflection/  

