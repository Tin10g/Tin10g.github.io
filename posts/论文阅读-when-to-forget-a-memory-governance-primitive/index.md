# 论文 · When to Forget: A Memory Governance Primitive


## 基础信息

* 会议/期刊：arXiv preprint, 2026
* 关键词：memory governance, selective forgetting, retrieval, conditional success probability, Bayesian update

核心贡献：本文提出 Memory Worth (MW)，用每条记忆被检索后的成功/失败共现次数构造一个轻量、可在线更新的治理信号，并证明它在明确假设下收敛到条件成功概率 p&#43;(m)，可用于陈旧性检测、抑制检索与弃用决策。

## Q1. 研究动机

现有记忆系统通常依赖写入时的重要性分数、LLM 判断或结构启发式来管理记忆，但这些信号往往是静态的，无法根据后续任务结果动态修正。作者认为，agent 实际上已经在不断“做实验”却没有把 outcome 反馈用到 memory governance 中，因此需要一个可在线更新、可解释、成本极低的 per-memory 信号。

## Q2. 核心问题

论文要解决的问题是：当 agent 的记忆不断累积、任务分布持续变化时，应该如何判断某条记忆是否仍值得保留、压低优先级或直接遗忘，而且这个判断要基于检索后的结果反馈，而不是仅凭写入时的先验分数。

## Q3. 现有不足 &amp; 本文改进

现有动态记忆管理方法要么是写入前评分，要么依赖 LLM 生成判断，要么只做结构组织，缺少一个从检索结果出发、带收敛保证的 per-memory 在线质量估计。

本文的改进点有三：

一是定义 MW 为成功和失败的加权计数比；

二是在 stationarity、minimum exploration、conditional independence 等条件下给出几乎处处收敛证明；

三是用五个实验系统分析了该指标在理想条件、任务混杂、反馈闭环和共检索混杂下的表现。

## Q4. 方法流程

&gt; episode：从任务开始，到任务结束的一整段轨迹。

输入是每个 episode 的检索集合 Mt、每条被检索记忆的权重 wt(m) 和 outcome yt。

算法为每条记忆维护两个计数：hits&#43; 和 hits-。当该记忆被检索且 episode 成功时，累计到 hits&#43;；失败时累计到 hits-。Memory Worth 定义为 `hits&#43; / (hits&#43; &#43; hits-)`，若没有证据则初始化为 0.5。输出是一个 0 到 1 之间的 per-memory score，可直接用于优先级调整、压制、复核或弃用。

## Q5. 实验设计与结论

| 实验 | 目的 | 结论 |
| --- | --- | --- |
| Experiment 1：synthetic controlled setting | 验证 MW 在假设成立时是否能收敛到真值排序 | 100 memories、8 条检索、10,000 episodes 后，Spearman 相关从约 0.66 上升到 0.89-0.90；无更新 baseline 一直为 0。 |
| Experiment 2：task-difficulty confound | 检验任务难度与记忆质量混杂时 MW 的表现 | Global MW 与真实 utility 变成负相关，约 `ρ=-0.33`；仅在 hard-task 子集上条件化后回升到 `ρ≈&#43;0.14±0.07`，但仍离无混杂基线 0.89 有差距。 |
| Experiment 3：retrieval policy feedback loop | 检验 MW 参与检索是否会自我崩塌 | 在 softmax-biased retrieval 下，MW 仍收敛到 `ρ≈0.895-0.899`，没有出现退化。 |
| Experiment 4：co-retrieval confound | 检验总是一起被检索的记忆能否区分 | 0% independent retrieval 时 anchor 和 hitchhiker 都收敛到 `MW≈0.49`，几乎不可区分；约 30% 独立检索后才开始有效分离。 |
| Experiment 5：text-based retrieval agent | 检验现代 embedding retrieval 下是否仍有效 | all-MiniLM-L6-v2 检索、3,000 episodes 后，stale memory 从约 0.97 降到 0.17，specialist 稳在 0.77，说明 MW 能识别过时记忆。 |

## Q6. 局限性

作者明确指出：

MW 衡量的是 retrieval-outcome co-occurrence，不是因果贡献；

理论收敛依赖 stationarity、minimum exploration、conditional independence 等假设；

在任务分布漂移、低证据记忆和共检索混杂下会失真；

rarely retrieved memories 还需要 evidence threshold `Vm` 来避免误判。

以下为分析归纳，非原文明确说明：这更像记忆治理的底层原语，而不是完整的遗忘系统；它尤其依赖日志记录、检索多样性和上下文分区能力。

## Q7. 学术价值

* 理论价值：给出一个带 almost-sure convergence 的 per-memory post-retrieval estimator。
* 方法价值：只需两个标量计数，就能把“该不该忘”转成可在线计算的信号。
* 应用价值：适合 LLM agent memory、RAG 记忆池和 selective forgetting 场景。

## Q8. 延伸研究方向

1. 构造 contextual Memory Worth，把 MW 条件化到任务簇或 query cluster。
2. 用 Bayesian Beta-Bernoulli 替代纯 ratio，做 uncertainty-aware ranking。
3. 用 exponential moving average 处理非平稳任务分布。
4. 把 retrieval diversity 作为治理约束，而不是训练后修补。
5. 在真实 live agent 上验证 MW 是否能驱动实际 deprecation 和 re-verification。

## Q9. 反直觉发现与方法失效分析

* Experiment 2：global MW 在 task-difficulty confound 下变成 `ρ≈-0.33`，说明“经常一起成功/失败”不等于“有用/没用”。
* Experiment 3：MW 参与 softmax retrieval 后没有崩掉，反而保持 `ρ≈0.895-0.899`，说明反馈回路在该设定下是自纠正的。
* Experiment 4：anchor 和 hitchhiker 在 0% 独立检索时都收敛到 `MW≈0.49`，完全失去区分能力，说明共检索混杂非常严重。
* Experiment 5：stale memory 从约 0.97 掉到 0.17，而 specialist/hitchhiker/control 都停留在 0.73-0.77 附近，说明 embedding retrieval 会自然制造语义邻近的混杂。
* 整体评价：这篇最有价值的地方不是复杂模型，而是把“该不该继续信任某条记忆”变成了一个简单、可证明、可在线更新的治理原语。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:8533/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-when-to-forget-a-memory-governance-primitive/  

