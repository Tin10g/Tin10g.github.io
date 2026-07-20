# 论文阅读 · Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks


## 基础信息

- 研究对象：knowledge-intensive NLP tasks 中的检索增强生成，覆盖开放域问答、抽象式问答、Jeopardy 问题生成和事实验证

  &gt; * 检索增强生成：生成模型在回答前先去外部知识库检索相关资料，再基于检索结果生成答案。
  &gt;
  &gt; * 覆盖开放域问答：用户可以问任何领域的问题，系统不能只依赖某一篇给定文章，而要从一个很大的知识源里找信息并回答。
  &gt;
  &gt; * Jeopardy 问题生成：一个生成任务，用来测试模型能不能根据一个“答案实体”生成一条包含事实线索的问题。
  &gt; * 事实验证：给模型一个 claim，也就是“待验证陈述”，模型需要根据外部资料判断它属于哪一类（支持、反驳，信息不足）

- 核心贡献：本文提出 RAG，把预训练 seq2seq 生成器 BART 作为参数化记忆，把基于 DPR 的 Wikipedia 稠密向量索引作为非参数化记忆，通过对检索文档进行隐变量边缘化，让生成模型在多个知识密集任务上获得更强的事实性、可更新性和开放域 QA 表现。

  &gt; * BART：一种预训练的 seq2seq 生成模型，全名是 Bidirectional and Auto-Regressive Transformers。一个擅长把一段文本转换成另一段文本的生成模型。
  &gt; * DPR：稠密段落检索。从大量文档中找出和问题最相关的段落。
  &gt; * Wikipedia：维基百科 外部知识库。总共形成约 2100 万个 documents / passages。

- 关键结果

  RAG 在 NQ、WQ、CT 和 TQA-Wiki 等开放域 QA 设置中达到或超过当时强基线。

  在生成任务中比 BART 更事实、更具体、更多样。

  展示了通过替换 Wikipedia 索引来更新模型知识的能力。

## Q1. 研究动机

预训练语言模型能在参数中存储事实知识，但很难更新、解释来源，也容易幻觉；

已有检索增强模型主要用于抽取式 QA。

&gt; 抽取式 QA：答案必须从给定文章或检索到的文档里“原样截取”出来。

作者希望把外部显式知识库接入通用 seq2seq 生成模型，使模型既能生成自然语言，又能利用可检查、可替换的外部记忆。

&gt; seq2seq 生成模型：把一段文本转换/生成成另一段文本的模型。

## Q2. 核心问题

* 现象层面

  纯参数化语言模型在知识密集任务上受限，尤其**缺少可靠的知识访问**、来源解释和**知识更新机制**。

* 技术问题

  如何把预训练检索器、外部 Wikipedia 索引和预训练 seq2seq 生成器组合成一个可端到端微调的模型，并在没有显式检索监督的下游任务中学习选择有用文档。

## Q3. 现有不足 &amp; 本文改进

作者明确指出的现有不足：

- 纯参数化模型

  知识写在参数里，难以扩展或修订，预测依据不直观，并可能产生 hallucination。

  &gt; hallucination：模型幻觉

- 早期**混合记忆模型** REALM、ORQA

  已证明**可微检索**对开放域抽取式 QA 有帮助，但尚未扩展到通用 seq2seq 生成任务。

  &gt; * ORQA（Open-Retrieval Question Answering）：不给固定文章，，先从 Wikipedia 里检索相关文档，再从文档中抽取答案，用弱监督方式训练检索器和阅读器。
  &gt; * REALM（Retrieval-Augmented Language Model pre-training）：让语言模型在预训练阶段就学会检索外部知识。

- **任务专用**的 memory networks、stack-augmented networks、memory layers

  通常从头训练，且多为特定任务架构，不是统一的预训练生成框架。

  &gt; * memory networks：以memory slots来记忆，存放可访问的信息，用于问答/推理
  &gt; * stack-augmented networks：以stack 栈结构记忆，强化序列/算法式操作能力
  &gt; * memory layers：以大型可寻址参数层记忆，在模型内部增加可检索参数记忆

- 标准抽取式 QA：要求答案以可抽取片段出现在检索文档中；如果文档只提供线索而不直接包含答案，抽取模型无法利用这些线索生成答案。

本文改进点：

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716201243077.png)

&gt; RAG = Retriever 非参数记忆 &#43; Generator 参数记忆

- 将 BART-large 作为参数化记忆，将 DPR 检索到的 Wikipedia 文档块作为非参数化记忆，形成通用的 retrieval-augmented generation 框架。
- 把检索文档视为隐变量，在 top-K 文档上做边缘化，而不是只选一个文档或依赖人工证据标签。
- 提出两种形式：RAG-Sequence 假设整段输出由同一文档支持，RAG-Token 允许每个 token 依赖不同文档。
- 训练时固定文档编码器和索引，只微调 query encoder 与 BART 生成器，降低了反复重建大规模索引的成本。
- 外部记忆是原始文本而非不可读向量参数，因此更容易检查、替换和更新。

## Q4. 方法流程

输入是问题、claim、实体名等文本。

模型先用 DPR 的 query encoder 把输入编码成向量，在由 2018 年 12 月 Wikipedia 切成的约 2100 万个 100-word 文档块索引中，用 FAISS 做最大内积检索，取 top-K 文档。随后把每个检索文档与原始输入拼接，送入 BART-large 生成目标文本。

训练时不使用 gold retrieval evidence，而是把检索文档当作隐变量，通过目标 输出的负边缘 log-likelihood 联合优化 query encoder 和生成器。

RAG-Sequence 对整段输出共享同一文档并在候选文档上求和；RAG-Token 则在每个生成位置分别对文档求和，因此更适合需要组合多个文档信息的输出。

测试时，短答案 QA 主要用 greedy decoding；较长生成任务使用 beam search，RAG-Sequence 还区分 thorough decoding 和 fast decoding。

## Q5. 实验设计与结论

- 开放域问答主实验（Table 1）
  
  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716204107205.png&#34; style=&#34;zoom:67%;&#34; /&gt;

  - 目的：验证 RAG 在 Natural Questions、TriviaQA、WebQuestions、CuratedTrec 上是否优于 closed-book 生成模型和 open-book 抽取式系统。
  - 结论：RAG-Sequence 在 NQ 达到 44.5 EM，高于 DPR 的 41.5 和 T5-11B&#43;SSM 的 36.6；在 CT 达到 52.2，高于 DPR 的 50.6；RAG-Token 在 WQ 达到 45.5，高于 DPR 的 41.1 和 T5-11B&#43;SSM 的 44.7。TriviaQA 常规 open-domain split 上 DPR 为 57.9，RAG-Sequence 为 56.8，没有超过 DPR；但在 TQA-Wiki split 上 RAG-Sequence 为 68.0，高于 T5-11B&#43;SSM 的 60.5。
  
- 抽象式问答 MS-MARCO（Table 2, Table 3）
  
  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716204246603.png&#34; style=&#34;zoom:67%;&#34; /&gt;

  - 目的：验证 RAG 是否能在不使用官方给定 gold passages 的情况下生成长一些、事实性更强的答案。
  
  - 结论：RAG-Sequence 在 MS-MARCO 上达到 Rouge-L 40.8、Bleu-1 44.2，高于 BART 的 38.2 和 41.6。作者也用样例说明 BART 更容易生成事实错误或循环式表述，而 RAG 输出更具体。
  
    ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716204733411.png)
  
- Jeopardy 问题生成（Table 2, Table 4, Figure 2）
  - 目的：测试 RAG 在非 QA 的知识密集生成任务中能否生成精确、事实性的 clue-style question。
  - 结论：RAG-Token 的 Bleu-1/Q-BLEU-1 为 17.3/22.2，高于 BART 的 15.1/19.7，也高于 RAG-Sequence 的 14.7/21.4。452 对人工评估中，RAG 在 factuality 上被判优的比例为 42.7%，BART 仅 7.1%；specificity 上 RAG 为 37.4%，BART 为 16.8%。Figure 2 显示 RAG-Token 在生成 Hemingway 相关 clue 时，会在不同 token 位置依赖不同文档。

- FEVER 事实验证（Table 2）
  - 目的：检验 RAG 是否能处理分类式知识密集任务，而不只是生成任务。
  - 结论：RAG 在 FEVER-3 上得到 72.5 label accuracy，高于 BART 的 64.0，距离复杂 pipeline SOTA 76.8 仍有差距；FEVER-2 上 RAG 为 89.5，高于 BART 的 81.1，低于使用 gold evidence 的 92.2。作者还报告 top-1 检索文档标题与 gold evidence article 重合率为 71%，top-10 为 90%。

- 生成多样性实验（Table 5）
  
  &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260717143541747.png&#34; style=&#34;zoom:67%;&#34; /&gt;

  - 目的：评估 RAG 是否只是更准确，还是也能生成更多样的文本。
  - 结论：RAG 的 distinct trigram ratio 明显高于 BART。MS-MARCO 上 BART 为 70.7%，RAG-Token 为 77.8%，RAG-Sequence 为 83.5%；Jeopardy 上 BART 为 32.4%，RAG-Token 为 46.8%，RAG-Sequence 为 53.8%。
  
- 检索消融实验（Table 6）
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260717143608683.png)

  - 目的：验证学习到的 dense retriever 是否真的贡献性能，并比较 BM25/frozen retriever。
  - 结论：在开放域 QA 上，学习检索明显有用。例如 NQ dev 上 RAG-Sequence 为 44.0，Frozen 为 41.2，BM25 为 31.8；TQA 上 RAG-Sequence 为 55.8，Frozen 为 52.1，BM25 为 44.1。但 FEVER 是例外，BM25 在 FVR-3/FVR-2 上为 75.1/91.6，高于 learned RAG 的 74.5/90.6。
  
- 索引热替换实验（Section 4.5）
  - 目的：验证非参数化记忆是否能通过替换索引来更新世界知识。
  - 结论：使用 2016 索引回答 2016 年世界领导人问题正确率 70%，使用 2018 索引回答 2018 年问题正确率 68%；错配索引时正确率降到 12% 和 4%。这支持了“替换外部记忆即可更新模型知识”的论点。

- 检索文档数影响（Figure 3）
  - 目的：分析 test-time top-K 检索数量对性能的影响。
  - 结论：RAG-Sequence 在 NQ 上随检索文档数增加而单调提升；RAG-Token 在约 10 篇文档处达到峰值。MS-MARCO 上，增加文档数会提高 RAG-Token 的 Rouge-L，但 Bleu-1 下降，说明更多检索不总是无条件收益。

## Q6. 局限性

作者明确提到：

- Section 3.2：MS-MARCO 中有些问题需要官方 gold passages 或非 Wikipedia 信息才能回答，例如天气类问题；只用 Wikipedia 会天然受限。
- Section 4.1：RAG 的 retriever 初始化自 DPR，而 DPR 使用过 Natural Questions 和 TriviaQA 的检索监督；因此 RAG 并不是从完全无检索监督的空白检索器开始。
- Broader Impact：外部知识源如 Wikipedia 不可能完全无错或无偏；RAG 作为语言模型也可能被用于生成误导内容、冒充他人、自动化 spam/phishing，或带来工作自动化风险。
- Appendix C/G：系统资源成本较高。作者报告训练分布在 8 张 32GB V100 GPU 上；完整 Wikipedia 索引最初需要约 100GB CPU memory，压缩后仍需 36GB；模型含约 626M trainable parameters，另有 2100 万个 728 维文档向量。
- Appendix E：FEVER 的 evidence sentence extraction 没有直接处理，原因是所用 Wikipedia dump 与 FEVER 不同；作者将其列为未来工作。
- Appendix F：作者尝试过 null document 机制，但没有提升性能，因此省略。这说明模型在“没有有用检索结果”时仍缺少一个显式、稳定的拒检机制。
- Appendix H：作者在 story generation 等任务中观察到 retrieval collapse，即检索器学会对不同输入返回相同文档，生成器随后忽略文档，模型退化到接近 BART。

以下为分析归纳，非原文明确说明：

- 文档编码器和索引在微调期间固定，避免了索引重建成本，但也限制了文档表示随下游任务共同适配的能力。
- RAG 的“可解释性”主要来自可查看检索文档，但生成内容可能同时来自参数化记忆；因此检索文档可读不等于每个生成事实都有严格 provenance。
- 生成任务的人工评估主要集中在 Jeopardy，MS-MARCO 更多依赖自动指标和样例，长答案事实一致性的系统性评估仍偏弱。
- 方法依赖 Wikipedia 作为外部知识源，对非百科知识、强时效知识、私有领域知识的效果没有在本文中充分验证。

## Q7. 学术价值

- 理论价值：论文把参数化记忆和非参数化记忆的分工明确化：语言模型参数负责通用语言与部分事实知识，外部文本索引负责可更新、可检查的显式知识；并用隐变量边缘化把检索与生成放在统一概率框架中。
- 方法价值：RAG-Sequence 和 RAG-Token 提供了可复用的检索增强生成范式，证明预训练检索器与预训练 seq2seq 生成器可以在无 gold evidence 的下游任务中联合微调。
- 应用价值：开放域问答、事实验证、知识密集型摘要/问答、面向专业领域的问答系统都可复用该思路；索引热替换实验也说明它适合需要知识更新的应用。

## Q8. 延伸研究方向

1. 联合预训练 retriever 与 generator：作者在 Section 6 提到，可探索从头联合预训练两个组件，使用类似 BART 的 denoising objective 或其他检索感知目标。
2. 更可靠的证据归因：如何保证每个生成事实都能回溯到具体检索片段，而不是混合来自参数记忆和检索文档的未标注信息。
3. 抑制 retrieval collapse：针对长文本生成或事实需求不明显的任务，设计更稳定的检索训练信号，避免检索器退化为固定文档选择器。
4. 自适应检索与拒检机制：让模型判断何时需要检索、检索多少文档、何时应使用 null document 或直接依赖参数化知识。
5. 扩展外部记忆类型：把 Wikipedia 替换或扩展为多源、多时间版本、领域专业文档库，并研究外部知识错误和偏见如何影响生成。

## Q9. 反直觉发现与方法失效分析

- 发现一（Table 1）：RAG 并非在所有开放域 QA 指标上都压过检索式强基线。TriviaQA 常规 open-domain split 中，DPR 为 57.9 EM，RAG-Sequence 为 56.8，RAG-Token 为 55.2；但 TQA-Wiki split 中 RAG-Sequence 为 68.0，高于 T5-11B&#43;SSM 的 60.5。
  - 作者解释：Appendix D 说明 TriviaQA 存在不同 evaluation setups，官方 Wiki test set 更容易从 Wikipedia 回答，因此 RAG 在 TQA-Wiki 上更高。整体看，RAG 的 SOTA 结论依赖具体数据划分，不能简单概括为所有 TriviaQA 设置都优于 DPR。

- 发现二（Table 2）：两种 RAG 变体的优劣具有任务依赖性。Jeopardy 上 RAG-Token 的 Bleu-1/Q-BLEU-1 为 17.3/22.2，高于 RAG-Sequence 的 14.7/21.4；但 MS-MARCO 上 RAG-Sequence 的 Rouge-L/Bleu-1 为 40.8/44.2，高于 RAG-Token 的 40.1/41.5。
  - 作者解释：Section 4.3 解释 Jeopardy clue 往往包含多个事实片段，RAG-Token 可在不同 token 使用不同文档，因此更有优势。作者没有对 MS-MARCO 中 RAG-Sequence 更强给出同等详细解释；合理推测是 MS-MARCO 的答案通常需要围绕同一证据片段生成，整段共享文档更稳定。

- 发现三（Table 6）：BM25 在 FEVER dev 上反而优于 learned dense retriever。RAG-Token-BM25 的 FVR-3/FVR-2 为 75.1/91.6，而 learned RAG-Token 为 74.5/90.6；RAG-Sequence 与 RAG-Token 在分类任务中等价，表中未重复给 learned RAG-Sequence 的 FEVER 分数。
  - 作者解释：Section 4.5 指出 FEVER claims 很 entity-centric，适合词重叠检索，所以 BM25 更强。这说明 dense differentiable retrieval 并不是所有知识密集任务的默认最佳选择。

- 发现四（Figure 3）：检索更多文档不总是更好。NQ 上 RAG-Sequence 随 K 增加而提升，但 RAG-Token 在约 K=10 后达到峰值；MS-MARCO 上增加 K 会提高 RAG-Token Rouge-L，却降低 Bleu-1。
  - 作者解释：作者只说明检索数量影响性能和运行时间，未深入解释 Bleu-1 与 Rouge-L 的相反变化。合理推测是更多文档增加了可覆盖内容，提升 recall-style 指标，但也可能引入噪声或改变措辞，降低精确 n-gram 匹配。

- 发现五（Appendix H）：在 story generation 等任务中，检索器会 collapse 到几乎固定文档，生成器随后忽略文档，RAG 表现退化为 BART。
  - 作者解释：作者认为可能因为这些任务对事实知识的显式需求较弱，或目标序列更长导致 retriever 梯度信号不够明确。这是本文最直接的失效模式说明，意味着 RAG 更适合事实需求明确的任务，而不是所有生成任务。

- 整体评价：RAG 的优势不是碾压式的全任务统一优势，而是“在知识密集、可由 Wikipedia 支撑、检索证据有帮助的任务上条件性有效”。它在开放域 QA、事实性生成和知识更新方面贡献很大，但对检索器初始化、知识源质量、任务是否 entity-centric、检索文档数量都较敏感。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/  

