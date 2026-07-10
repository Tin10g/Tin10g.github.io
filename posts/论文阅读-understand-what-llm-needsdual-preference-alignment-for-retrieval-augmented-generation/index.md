# 论文 · Understand What LLM Needs：Dual Preference Alignment for Retrieval-Augmented Generation


## 基础信息

- 论文标题：Understand What LLM Needs: Dual Preference Alignment for Retrieval-Augmented Generation
- 作者：Guanting Dong, Yutao Zhu, Chenghao Zhang, Zechen Wang, Ji-Rong Wen, Zhicheng Dou
- 会议：WWW 2025

**核心贡献**：本文提出 DPA-RAG，通过构造 LLM 偏好知识、训练偏好对齐 reranker，并在 SFT 前加入 LLM 自对齐阶段，同时缓解检索器与 LLM 之间的外部偏好错位和 LLM 利用知识时的内部偏好错位，从而在四个知识密集型 QA 数据集上稳定优于传统 RAG、reranker RAG 和已有偏好对齐方法。

## Q1. 研究动机

RAG 的目标是用外部文档增强 LLM，但检索器通常按向量相似度返回文档，LLM 的推理需求却不一定等同于“语义相似”。

作者在 Figure 1 中观察到：低相似度文档有时能帮助 LLM 答对，高相似度文档反而可能误导 LLM。因此，可靠 RAG 不只需要“检索相关文档”，还要检索和使用符合 LLM 知识偏好的文档。

也就是

- 排在 第 100 位 的低相似度文档有时能帮助 LLM 答对（Aligned Knowledge）
- 排在 第 1 位 的高相似度文档反而可能误导 LLM（Unaligned Knowledge）

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260707160933448.png)

## Q2. 核心问题

提出两个核心概念：

1. 外部偏好错位：检索器排序 ≠ LLM 知识偏好
2. 内部偏好错位：LLM 自身不会识别哪些知识对自己有用

技术上，论文把问题拆成两层偏好对齐：

一是让外部 RAG 组件，尤其是 retriever/reranker，排序出符合 LLM 偏好的文档；

二是让 LLM 在训练中学会识别并利用这些偏好对齐知识。

## Q3. 现有不足 &amp; 本文改进

现有方法的不足：

- 传统 RAG 把检索器和 LLM 当作松散拼接的两个模块，默认“相似文档”就是“有用文档”。
- reranker 方法多关注 query-document 相关性，没有显式建模不同 LLM 的知识偏好。
- REPLUG、RA-Judgement 等偏好对齐方法更多依赖 logits 或直接反馈，缺少多粒度地对齐文档判断、文档排序和语义表示。
- 训练数据中缺少足够多样的偏好样本，难以覆盖复杂查询形态。

本文改进点：

- 提出偏好知识构造流程，把文档标成 `Aligned Knowledge`、`Unaligned Knowledge`、`Both Correct`、`Both Incorrect` 四类，并只保留对 LLM 推理有明确正负影响的样本。
- 设计五类 query augmentation：Rephrasing、Complexity、Decomposition、Constraint、SPARQL，并用 NLI 过滤语义冲突样本。
- 在 reranker 侧联合 point-wise、pair-wise 和 contrastive preference alignment，实现外部偏好对齐。
- 在 LLM 侧加入 pre-aligned stage，让模型先学习识别正负偏好知识，再进行普通 QA SFT，实现内部自对齐。

## Q4. 方法流程

DPA-RAG 首先用训练集 query 检索 top-k 文档，并从第 1、25、50、100 位采样文档。

LLM 分别直接回答和参考这些文档回答，再根据答案是否正确把文档影响分成四类。

| LLM 不用文档时 | LLM 用文档后 | 文档标签                    |
| -------------- | ------------ | --------------------------- |
| ✅ 答对         | ❌ 答错       | Unaligned Knowledge（有害） |
| ❌ 答错         | ✅ 答对       | Aligned Knowledge（有益）   |
| ✅ 答对         | ✅ 答对       | Both Correct（丢弃）        |
| ❌ 答错         | ❌ 答错       | Both Incorrect（丢弃）      |

只有能让错误答案变正确的 `Aligned Knowledge`，或让正确答案变错误的 `Unaligned Knowledge` 被保留下来作为偏好知识。

随后，作者用五种策略扩增 query，并用 NLI 模型删除与原 query 矛盾的扩增样本。

- Rephrasing：改写
- Complexity：增加复杂度
- Decomposition：分解为子问题
- Constraint：添加约束条件
- SPARQL：转为结构化查询

基于这些偏好数据，DPA-RAG 训练一个 preference-aligned reranker：

point-wise 任务判断单篇文档是否对齐，

pair-wise 任务学习文档偏好排序，

contrastive 任务把 query 表示拉近偏好文档并远离负样本。

最后，开放源 LLM 先在 pre-aligned 任务中学习判断文档是 positive 还是 negative knowledge，再用经偏好 reranker 重排后的文档进行 QA SFT。

推理时，retriever 先取回候选文档，偏好 reranker 重排过滤，LLM 再基于重排文档生成答案。

### 整体结构

``````
原始 Query → Retriever(Top-K) → PA-Reranker(重排过滤) → LLM(生成答案)
                                   ↑                       ↑
                            外部偏好对齐              内部自对齐
``````

### 推理流程

```
Query → DPR Retriever (Top-100)
     → PA-Reranker 对每篇文档打分（二分类器的 aligned 概率）
     → 按分数重排，保留 Top-K
     → Pre-aligned LLM 基于重排文档生成答案
```

### 训练数据格式（PA-Reranker 训练）

```
{
  &#34;query&#34;: &#34;问题文本&#34;,
  &#34;classification&#34;: {
    &#34;text&#34;: &#34;文档文本&#34;,
    &#34;label&#34;: 1          // 1=Aligned Knowledge, 2=Unaligned Knowledge
  },
  &#34;rank_list&#34;: [&#34;doc1&#34;, &#34;doc2&#34;, &#34;doc3&#34;, &#34;doc4&#34;],  // 4篇需排序的文档
  &#34;positive&#34;: [&#34;pos_doc1&#34;, &#34;pos_doc2&#34;],            // 偏好对齐的正样本
  &#34;negative&#34;: [&#34;neg_doc1&#34;, &#34;neg_doc2&#34;]             // 偏好对齐的负样本
}
```

### 模型结构（PA-Reranker 训练）

```
class BgeJoinedModel(nn.Module):
    def __init__(self, pretrained_model_path, loss_types):
        self.bge = AutoModel.from_pretrained(pretrained_model_path)  # BGE 基座
        self.classifier = nn.Linear(1024, 2)  # 二分类头
        self.scl_loss_func = SupConLoss()      # 对比学习 loss
```

### 三种损失函数（PA-Reranker 训练）

| 损失                    | 粒度                   | 实现函数         | 作用                                                         |
| ----------------------- | ---------------------- | ---------------- | ------------------------------------------------------------ |
| **Classification Loss** | 文档级别的偏好判断     | calc_cls_loss()  | 判断单篇文档是 Aligned 还是 Unaligned（二分类交叉熵）        |
| **Rank Loss**           | 排序级别的偏好学习     | calc_rank_loss() | 学习文档偏好排序，让 aligned 文档排在 unaligned 前面（logsigmoid 排序损失，C(4,2)=6 对） |
| **Contrastive Loss**    | 语义表示级别的偏好对齐 | calc_scl_loss()  | 把 query 的表示拉近 positive 文档、远离 negative 文档（SupCon 监督对比学习） |

### 多任务权重自动学习 — MGDA-UB（PA-Reranker 训练）

```
class WeightsCalculator:
    def calc_weights(self, submodels, losses):
        # 使用多梯度下降算法 (MGDA-UB)
        # 自动计算每个 loss 的最优权重 alpha
        # 在帕累托最优方向上优化
```

### LLM 自对齐（LLM Self-Alignment）

1. Pre-aligned Stage：先让 LLM 学习判断文档是 &#34;positive knowledge&#34; 还是 &#34;negative knowledge&#34;（二分类任务）
2. QA SFT Stage：再用偏好 reranker 重排后的文档进行标准 QA 微调

## Q5. 实验设计与结论

| 实验/分析 | 目的 | 关键设置与结论 |
| --- | --- | --- |
| 主实验：四个 QA 数据集 | 验证 DPA-RAG 是否优于 RAG、reranker RAG 和偏好对齐基线 | 数据集为 NQ、TriviaQA、HotpotQA、WebQSP。&lt;br /&gt;Table 1 中 DPA-RAG LLaMA2-7B 在 NQ F1 60.19、TQA F1 70.29、HQA F1 43.34、WebQSP F1 71.80，均高于对应传统 RAG 的 54.76、63.80、38.90、64.22。 |
| 跨 reader 泛化 | 验证方法是否只适用于某个 LLM | Table 1 中 GPT-3.5、GPT-4、LLaMA2-7B/13B、LLaMA3-8B、Qwen2-7B 均有提升，例如 GPT-4 在 TQA Hit@1 从 79.98 提到 84.41，WebQSP F1 从 67.20 提到 74.83。 |
| 消融实验 | 验证 PA-reranker、pre-align、query augmentation 的作用 | Table 2 中完整 DPA-RAG 在 NQ/TQA F1 为 60.19/70.29；去掉 Pre-Align 后降为 58.95/61.35；去掉 Query Augmentation 后降为 57.45/60.93。 |
| 细粒度消融 | 验证 point-wise、pair-wise、CPA 和 MGDA-UB 的作用 | Table 6 显示去掉 point-wise 在 NQ/TQA F1 分别下降 2.12/2.43，影响最大；去掉 pair-wise 分别下降 0.92/1.74；去掉 CPA 分别下降 1.12/2.13。 |
| 参数规模分析 | 研究 reader 参数量与 RAG 能力关系 | Figure 3 显示基础 RAG 在 500M 到 7B 参数区间提升明显，超过 7B 后趋于稳定；DPA-RAG 在不同参数规模下保持更平滑、稳定的增益。 |
| 偏好对齐效果分析 | 检验 DPA-RAG 是否减少 unaligned knowledge | Figure 4 显示 DPA-RAG 在 `Aligned Knowledge` 类别最高，并显著降低 `Unaligned Knowledge`，说明它确实在过滤会误导 LLM 的文档。 |
| Query augmentation 分析 | 研究扩增数据复杂度、多样性与性能关系 | Table 3 中 Origin 的 NQ F1 为 51.78，Complexity 扩增后达到 54.81；Decomposition 为 54.16，说明复杂度和多样性越高，偏好对齐训练越有效。 |
| 训练策略分析 | 比较 sequential training 与 mixed training | Figure 6 显示直接混合偏好任务和 QA 任务会导致性能下降和波动；先 pre-align 再 SFT 的顺序训练更稳定。 |

## Q6. 局限性

作者明确提到或实验显示：

- 论文没有单独的 Limitations 章节。
- Figure 1 和后续分析表明，即使文档包含 grounding 信息，也可能不符合 LLM 偏好，因此偏好对齐依赖于对“有益/有害文档”的准确识别。
- Section 4.3.4 显示混合训练会出现性能下降和波动，说明不同训练目标之间存在优化冲突。
- Table 4 中 DPA-RAG 仍需要训练 reranker 和 reader，虽然作者报告其推理流程仍较高效，但训练阶段比普通 RAG 更复杂。

以下为分析归纳，非原文明确说明：

- 偏好标签来自 LLM 的回答变化，可能把数据噪声、评测误差或 LLM 偶然答对/答错误认为文档偏好。
- DPA-RAG 的偏好是 reader-specific 的。一个 reader 偏好的文档不一定适合另一个 reader，因此跨模型迁移仍可能受限。
- 方法主要在知识密集型 QA 上验证，对开放式生成、长文档综合、代码或专业高风险场景的有效性仍需进一步测试。
- 增强查询和 NLI 过滤引入额外模型依赖，完整复现成本高于普通 RAG。

## Q7. 学术价值

- 理论价值：明确提出 RAG 中存在“知识偏好错位”，把 RAG 失败原因从相关性不足推进到“检索知识是否符合 LLM 推理需求”的层面。
- 方法价值：给出一套可复用的偏好知识构造、query augmentation、多粒度 reranker 对齐和 LLM 自对齐流程。
- 应用价值：适用于需要提升 QA 准确性、降低误导性检索文档影响的 RAG 系统，尤其适合已有 retriever 召回质量不错但 reader 容易被部分文档带偏的场景。

## Q8. 延伸研究方向

1. 研究不同 reader 之间的偏好迁移：一个 LLM 上构造的 aligned knowledge 是否能泛化到另一个 LLM。
2. 将偏好对齐扩展到多跳检索和 agentic RAG，让系统不仅重排文档，还能决定何时重写 query、何时停止检索。
3. 用人工标注或外部 verifier 校准 `Aligned/Unaligned Knowledge` 标签，降低 LLM 自举标注带来的偏差。
4. 在长文档总结、开放式问答、医学法律等专业领域测试 DPA-RAG，观察偏好对齐是否仍然稳定。
5. 研究偏好对齐 reranker 的可解释性，让用户能看到某篇文档被认为“对齐”或“不对齐”的原因。

## Q9. 反直觉发现与方法失效分析

- 发现一：高相似度文档不一定更有帮助。Figure 1 中作者指出，在 `Aligned Knowledge` 场景下，第 100 位这类低向量相似度文档仍可能帮助 GPT-3.5 推出正确答案；在 `Unaligned Knowledge` 场景下，高相似度文档反而更可能误导 LLM。作者已讨论该现象，并据此提出偏好知识对齐。
- 发现二：去掉 PA-Rerank 后，NQ F1 没有下降。Table 2 中完整 DPA-RAG 的 NQ F1 为 60.19，`w/o PA-Rerank` 的 NQ F1 也是 60.19，但 Hits@1 从 56.03 降到 52.80。作者总体解释为移除任一模块都会降低性能；这里更细地看，PA-Rerank 对首答命中更敏感，对 NQ F1 的边际影响不明显，作者未单独解释这个异常。
- 发现三：去掉双对齐后可能比标准 RAG 更差。Table 2 中 TQA 上 `w/o Pre-Align &#43; PA-Rerank` 的 Hits@1/F1 为 58.24/59.30，低于 Standard RAG 的 63.90/63.80。作者将其作为双对齐互补性的证据；我的理解是，若只保留部分数据处理或训练流程而缺少核心对齐模块，可能引入训练分布变化却没有带来有效偏好筛选。
- 发现四：复杂扩增比简单改写更有效。Table 3 中 Rephrasing 的 NQ F1 为 52.27，而 Complexity 为 54.81、Decomposition 为 54.16。作者解释为复杂度和多样性提升会增强偏好对齐数据质量。
- 整体评价：DPA-RAG 的实验结论较稳健，主实验、消融和偏好类别分析相互支撑。但它的有效性依赖于偏好数据构造是否可靠，并且主要证明了 QA 场景下的偏好对齐收益，不应被理解为通用消除幻觉方案。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-understand-what-llm-needsdual-preference-alignment-for-retrieval-augmented-generation/  

