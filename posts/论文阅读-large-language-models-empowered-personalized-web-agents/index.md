# 论文 · Large Language Models Empowered Personalized Web Agents


## 基础信息

- 标题：Large Language Models Empowered Personalized Web Agents
- 类型：Benchmark &#43; personalized Web agent framework
- 核心贡献：提出 PersonalWAB 个性化 Web agent benchmark 和 PUMA 框架，通过长期用户记忆、SFT 与 DPO 让 Web agent 更好地根据用户历史行为生成函数参数和执行个性化任务。

## Q1. 研究动机

现有 Web agent 多关注通用网页导航和工具调用，较少评测 agent 是否能利用用户长期偏好完成个性化任务。真实 Web 场景中的搜索、推荐和评论生成都依赖用户历史行为，因此需要专门 benchmark 和对齐方法。

## Q2. 核心问题

论文试图解决的是：在给定用户历史 Web 行为和自然语言指令时，agent 如何选择正确函数并生成符合用户偏好的参数或结果。

## Q3. 现有不足 &amp; 本文改进

通用 Web agent benchmark 主要考查页面操作和任务完成，不强调用户特定偏好；简单把全部记忆放进 prompt 会带来噪声和开销。本文构造 PersonalWAB，覆盖搜索、推荐、评论三类个性化任务，并提出 PUMA：用 memory retriever 选择相关记忆，再通过 SFT 学会参数生成，通过 DPO 进一步偏好对齐。

## Q4. 方法流程

PersonalWAB 先基于 Amazon reviews 构造用户历史行为、用户指令和 ground truth 个性化结果，并提供一组 Web functions 作为执行环境。PUMA 将用户长期行为存入 memory pool，运行时根据当前任务检索相关历史，再把用户指令与检索记忆输入模型，生成函数调用和参数。训练上，PUMA 先用 SFT 学习任务格式和参数生成，再用 DPO 让输出更贴合用户偏好，最终执行函数并评估 function accuracy 与 result accuracy。

## Q5. 实验设计与结论

- 单轮实验：Table 3 中 PUMA(LLaMA-7B) Overall Function Acc=0.994、Result Acc=0.406，高于 gpt-4o 记忆 baselines 的 Result Acc 0.350-0.359；PUMA(gpt-4o) 为 0.979/0.373。
- 多轮实验：Table 4 中 PUMA(gpt-4o) Overall Function Acc=0.994、Result Acc=0.399、Avg Steps=3.608，高于 Relevant Memory 的 0.899/0.383/3.609。
- 效率实验：Figure 7 显示 PUMA 平均约 2.8 秒，低于 GPT-based baselines 约 6.5-6.9 秒。
- 消融实验：Table 5 中完整 PUMA Overall Result Acc=0.406；去掉 task-specific memory 降到 0.373，去掉 SFT 降到 0.054，去掉 DPO 为 0.399，说明 SFT 是关键，DPO 提供边际提升。
- 记忆长度：Table 6 中 768 tokens 达到 Overall Result Acc=0.406，高于 256 的 0.391 和 512 的 0.395。

## Q6. 局限性

作者明确提出：

- 个性化 Web agent 涉及隐私、用户数据使用和伦理风险。
- 用户历史可能包含偏见，agent 可能放大流行度偏差或既有偏好。
- PersonalWAB 主要基于购物相关数据，任务和 Web 环境复杂度有限。

以下为分析归纳，非原文明确说明：

- Result accuracy 绝对值仍不高，最高 0.406，说明个性化结果生成仍很难。
- 函数式 Web 环境比真实浏览器 GUI 更受控，不能完全代表开放网页操作。

## Q7. 学术价值

- 理论价值：把 Web agent 评测从通用任务完成扩展到长期用户记忆驱动的个性化对齐。
- 方法价值：PersonalWAB 和 PUMA 提供了“记忆检索 &#43; SFT &#43; DPO”的个性化 agent 训练范式。
- 应用价值：适用于电商搜索、推荐、评论生成和个人助理类 Web automation。

## Q8. 延伸研究方向

1. 扩展 PersonalWAB 到旅行、新闻、医疗、金融等非购物领域。
2. 研究隐私保护记忆检索和用户可控记忆删除机制。
3. 区分短期会话偏好与长期稳定偏好对 agent 决策的影响。
4. 将函数式环境扩展到真实网页 GUI 操作和跨站任务。
5. 评测个性化 agent 是否会固化偏见或削弱用户探索新内容的能力。

## Q9. 反直觉发现与方法失效分析

- Table 3 中 PUMA(LLaMA-7B) 的 Overall Result Acc=0.406，高于 PUMA(gpt-4o) 的 0.373；说明经过专门训练的小模型在受控个性化任务上可以超过强通用模型。
- Table 5 中去掉 DPO 只从 0.406 降到 0.399，但去掉 SFT 降到 0.054；作者解释 DPO 有对齐作用，但数据表明格式和参数生成能力主要来自 SFT。
- Table 3/4 中 recommendation 子任务 result accuracy 很低，例如单轮 PUMA(LLaMA-7B) Recommendation Result Acc=0.054，多轮 PUMA(gpt-4o)=0.052，说明推荐偏好匹配是最困难部分。
- 整体评价：PUMA 对函数选择很稳，但结果准确率提升是有限且任务相关的；论文强在开辟个性化 Web agent 评测，而不是证明已解决个性化。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-large-language-models-empowered-personalized-web-agents/  

