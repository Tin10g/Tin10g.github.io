# 论文 · Tug-of-War Between Knowledge: Exploring and Resolving Knowledge Conflicts in Retrieval-Augmented Language Models


## 基础信息
* 作者：Zhuoran Jin; Pengfei Cao; Yubo Chen; Kang Liu; Xiaojian Jiang; Jiexin Xu; Qiuxia Li; Jun Zhao
* 期刊/日期：arXiv:2402.14409v1，2024-02-22

## Q1. 研究动机

**RAG/RALM 通过检索外部证据来补充或纠正模型内部知识，但外部证据并不总是干净可信。**

模型内部参数记忆可能过时或错误，外部来源也可能包含真实、无关、误导甚至相互冲突的证据。

两类知识互相拉扯时，模型可能既不完全听检索证据，也不完全相信自己，而是表现出复杂偏好。

本文的动机就是系统研究这种“tug-of-war between knowledge”：

**当内部记忆与外部来源冲突，或者外部证据内部互相冲突时，RALM 会相信谁、为什么错、如何校准。**

## Q2. 核心问题

本文关注两个冲突层面：

1. Internal memory vs external sources：模型闭卷答案与检索证据矛盾时，模型会坚持内部记忆还是改信外部证据？这种行为是否随模型规模、知识流行度、内部记忆正确性而变化？
2. Truthful / irrelevant / misleading evidence：检索结果中同时出现真实证据、无关证据和误导证据时，模型如何选择证据？证据数量、与内部记忆一致性、多跳冲突数量会怎样影响答案？

最终目标是提出一种冲突解析方法，使模型在冲突条件下更好地校准置信度。

## Q3. 现有不足 &amp; 本文改进

已有知识冲突研究常用 entity substitution 或单一冲突设定，较少区分“模型内部记忆本来正确”和“模型内部记忆本来错误”两种情况，也较少同时考察证据频率、实体流行度、confirmation bias、多跳冲突等因素。

本文的改进是构建多维评估框架：在 NQ、TriviaQA、PopQA、MuSiQue 四个 QA 数据集上，使用 FLAN-T5、FLAN-UL2、Baichuan2、LLaMA2、ChatGPT 等八个模型，从 correctness、faithfulness、memorization 三类指标观察冲突行为。方法上提出 CD2（Conflict-Disentangle Contrastive Decoding），用 logits 层面的 contrastive decoding 来削弱错误内部记忆或误导证据影响。

## Q4. 方法流程

评估框架分为几步：

1. 通过 closed-book QA 诱导模型内部记忆，贪心解码得到模型自己的答案。
2. 判断内部记忆是否正确，并生成支持内部记忆的证据。
3. 用 ChatGPT 生成 coherent counterfactual answer 和 conflicting evidence，构造更自然的误导证据。
4. 在 open-book QA 中提供不同数量、不同类型的外部证据，观察模型输出。
5. 使用 EM、F1、Recall 衡量 correctness；用 K-Precision 衡量答案依赖哪类证据；用 memorization ratio 衡量模型坚持内部记忆的比例。

CD2 有两种形式：

* 内部记忆 vs 外部来源：比较有外部证据的 expert logits `se` 与无外部证据的 internal logits `si`，解码目标为 `se - alpha * si`，从而降低错误内部记忆的影响。
* 真实/误导证据冲突：通过 fact-aware instruction tuning 训练 expert LM 生成真实答案、amateur LM 生成误导答案，解码目标为 `se - beta * sa`，从而压低误导证据相关 logits。

## Q5. 实验设计与结论

内部记忆与外部来源冲突实验中，作者先把问题分为内部记忆正确/错误两类，再提供与其相反的外部证据。结果显示，整体上 RALM 倾向相信外部证据，Con R 通常高于 Mem R；但模型越强，对内部记忆越自信。

几个重要现象：

* Dunning-Kruger effect：强模型会更顽固地坚持错误内部记忆。以 ChatGPT 为例，在 NQ 上即使给出正确外部证据，错误内部记忆条件下的 memorization ratio 仍超过 50%。
* Availability bias：在 PopQA 中，长尾知识更依赖外部证据；知识越流行，模型越倾向相信可轻易回忆的内部记忆。
* Truthful/misleading evidence 冲突会显著降低正确率。例如 NQ 上 LLaMA2 7B 的 Recall 从 61.94 降到 42.59，ChatGPT 从 72.00 降到 61.05。
* Majority rule：同类证据出现越多，模型越容易相信那一类；但更多证据不一定更好，长上下文会使模型失焦。
* Confirmation bias：如果外部证据中有一部分与模型内部记忆一致，模型更愿意选择这些证据，无论内部记忆正确与否。
* 多跳 MuSiQue 中，冲突 hop 数量越多，模型推理正确率越低。

CD2 结果：

* 无额外训练的内部记忆冲突场景中，LLaMA2 7B 在 NQ-Inco 的 Recall 从 43.63 提升到 45.68，TriviaQA-Inco 从 56.61 提升到 59.31。
* 真实/误导证据冲突场景中，CD2 提升明显：NQ-Conf 的 Recall 从 in-context 42.59 提升到 72.42；TriviaQA-Conf 从 60.87 提升到 83.93，同时 Mis KP 明显下降。

## Q6. 局限性

CD2 需要访问模型 logits，因此主要适用于开源或白盒模型；如何处理 ChatGPT 这类黑盒模型仍未解决。第二种 CD2 还需要 fact-aware instruction tuning 和 expert/amateur 区分，训练与数据构造成本更高。

评测任务集中在 QA，冲突证据虽然更 coherent，但仍由 LLM 生成，可能带有数据构造偏差。指标上，Recall 和 K-Precision 是 token overlap 类指标，能反映倾向但不能完全等价于真实证据归因。作者也承认未来需要从神经机制层面分析冲突是否改变特定 neuron activation，而本文主要停留在行为和置信分数层面。

## Q7. 学术价值

这篇论文的价值在于把 RAG 冲突问题从“检索到了没有”推进到“检索结果与内部记忆如何竞争”。它说明：即使检索器返回了正确证据，模型也可能因为内部先验、证据频率、流行度和确认偏误而答错。

对长期记忆研究而言，这篇提供了一个重要补充视角：记忆更新不是简单把新信息放进上下文，系统还必须控制旧内部知识和新外部证据之间的优先级。

CD2 则代表一种白盒校准方向：不只改 prompt，而是直接在解码时对冲突来源做 logit-level disentanglement。

## Q8. 延伸研究方向

1. 黑盒 LLM 的冲突解析：在无法访问 logits 时，用 self-consistency、evidence reranking、tool verification 或多提示投票近似 CD2。
2. 把证据可信度、时间戳、新鲜度、来源权威性作为显式 metadata，和模型内部记忆做可解释仲裁。
3. 结合多跳 decomposition，在每个 hop 做证据冲突检测和局部校准，避免错误证据沿推理链级联。
4. 构建更真实的动态知识库冲突数据，而不是只依赖 QA 和 LLM counterfactual。
5. 做机制分析，观察冲突证据是否激活/抑制与参数知识相关的内部表示。

## Q9. 反直觉发现与方法失效分析

最反直觉的是“模型越强越不一定更听证据”。强模型有更强内部记忆，也可能更自信地坚持错误内部答案，表现出类似 Dunning-Kruger 的过度自信。另一个反直觉点是，给更多证据不一定提升准确率；如果误导证据更多，模型会按多数规则偏向错误。

方法失效主要来自三类拉扯：

- 内部记忆太强，正确证据被压制
- 误导证据数量或表面相关性更强，模型按频率选错
- 多跳任务中某一跳冲突未解决，错误会沿链条传递。

CD2 能缓解白盒模型的置信校准问题，但不能解决检索器返回低质证据、黑盒模型不可控、以及真实开放环境中证据可信度难标注的问题。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-tug-of-war-between-knowledgeexploring-and-resolving-knowledge-conflicts-in-retrieval-augmented-language-models/  

