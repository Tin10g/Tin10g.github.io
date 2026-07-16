# 论文 · Memory Gym: Towards Endless Tasks to Benchmark Memory Capabilities of Agents


## 基础信息

* 会议/期刊：Journal of Machine Learning Research 26 (2025), 1-40
* 关键词：deep reinforcement learning, memory, benchmark, Transformer-XL, GRU, PPO

**核心贡献**：本文把 Memory Gym 的三个有限 POMDP 任务扩展为 endless cumulative memory tasks，并提供 CleanRL 中基于 PPO 的 Transformer-XL baseline，证明有限任务上的 sample efficiency 不足以衡量长期 memory effectiveness，且 GRU 在 endless 任务中显著优于 TrXL。

## Q1. 研究动机

很多 memory benchmark 关注有限任务的 sample efficiency，一旦 agent 能完成任务，就难以继续区分真正的长期记忆能力。作者借鉴“I packed my bag”这类累计记忆游戏，把任务设计为不断增长的记忆负担，以直接测量 agent 能记住多少、记多久。

## Q2. 核心问题

论文试图解决：如何设计一套能持续拉长记忆跨度的 DRL benchmark，并用它比较 recurrent memory 与 transformer episodic memory 在有限任务和 endless 任务中的真实有效性。

## Q3. 现有不足 &amp; 本文改进

传统 partially observable benchmark 往往只测 agent 在固定难度上的学习效率，无法区分“学得快”和“记得久”。Transformer memory baseline 公开实现不足，也影响可复现性。本文将 Mortar Mayhem、Mystery Path、Searing Spotlights 扩展为 endless 版本，并公开 CleanRL TrXL&#43;PPO 实现，同时与 GRU 做系统比较。

## Q4. 方法流程

输入是 2D partially observable visual/vector observation。有限环境被改造成 endless curriculum：Mortar Mayhem 持续追加命令序列；Mystery Path 生成无尽路径并要求 agent 记住可通行轨迹；Searing Spotlights 在长期存活和收集 coin 中测试记忆与避障。agent 使用 PPO actor-critic，分别搭配 GRU 或 Transformer-XL memory；TrXL 采用 sliding memory window，并可加入 observation reconstruction 或 ground-truth auxiliary heads。输出是任务进度、执行命令数、访问 tiles 数、收集 coins 数和归一化分数。

## Q5. 实验设计与结论

| 实验 | 目的 | 结论 |
| --- | --- | --- |
| 有限 Memory Gym 任务 | 比较 GRU 与 TrXL 在传统有限任务中的效率 | Figure 6 显示 TrXL 依赖 observation reconstruction 才能完成约 99% 任务；无 reconstruction 时平均 task progression 降至 56%，GRU 无 reconstruction 为 83%。 |
| Endless 任务主实验 | 测量长期 memory effectiveness | Figure 7 显示 GRU 在三项 endless 任务中均优于 TrXL：Mortar Mayhem 中 GRU 约 84-120 commands，TrXL 约 17；Mystery Path 最终 GRU 26 tiles，TrXL 20；Searing Spotlights 最终 GRU 23.9 coins，TrXL 6.7。 |
| TrXL 失败原因分析 | 排查容量、学习信号、初始 query、off-policy episodic memory、positional encoding 等因素 | 若干修改可改善 TrXL，例如 positional encoding 实验中某设置平均完成 56 commands，但仍未达到 GRU 水平。 |
| Searing Spotlights ablation | 验证 recurrence 是否容易受 spotlight perturbation 伤害 | Table 1 显示关键因素不是 observation reconstruction，而是关闭 advantage normalization；GRU 关闭 advantage normalization 后 success rate 1.00。 |

## Q6. 局限性

作者明确指出：TrXL 在 endless 任务中的低效果需要进一步研究，尤其 positional encoding 等设计。论文也承认 endless 不等于 open-ended，任务仍有明确目标和结构。

以下为分析归纳，非原文明确说明：结论主要围绕 PPO、GRU 和 TrXL 的特定实现，不应直接推广到所有 Transformer memory 架构；部分 ablation 来自训练过程数据，作者说明这偏离标准 evaluation protocol。

## Q7. 学术价值

* 理论价值：区分 memory efficiency 与 memory effectiveness，为 benchmark 评价维度提供清晰概念。
* 方法价值：提供可复现 endless memory benchmark 和 CleanRL TrXL baseline。
* 应用价值：适合评估需要长时记忆的 embodied agents、游戏 agents 和 POMDP 决策系统。

## Q8. 延伸研究方向

1. 设计更适合 endless POMDP 的 Transformer memory 与 positional encoding。
2. 比较 GTrXL、LSTM、state-space models 和 external memory architectures。
3. 研究 auxiliary losses 在有限任务与 endless 任务中的不同作用。
4. 分析 PPO advantage normalization 在低 reward scale memory tasks 中的优化影响。
5. 扩展到更多视觉复杂度和动作复杂度更高的 endless benchmark。

## Q9. 反直觉发现与方法失效分析

* Figure 6 vs Figure 7：TrXL 在有限任务中加 observation reconstruction 后可完成约 99%，但在 endless 任务中被 GRU 明显超过。这是论文最核心的反直觉发现：有限任务成功不能代表长期记忆有效。
* Figure 7(a)：Endless Mortar Mayhem 中 GRU 在约 300M steps 达到 84-120 commands，best mean point 为 115±15，而 TrXL 约 17 commands。作者已讨论为 TrXL 在长期累计记忆上效果不足。
* Figure 7(c)：Searing Spotlights 中 GRU final 23.9 coins，TrXL final 6.7 coins，GRU best 29.8，约为 TrXL maximum 7.5 的近 4 倍。
* Table 1：full observability Searing Spotlights 中，关闭 advantage normalization 的 GRU success rate 为 1.00；No Memory 也有 0.96。作者指出 normalized advantages 带来超过 12 倍 gradient norm，并可能造成过大优化步。这个结果反直觉地说明失败源可能是 PPO 实现细节，而非记忆结构本身。
* 整体评价：benchmark 贡献扎实，且实验揭示了“Transformer 不必然比 recurrence 更会记”的重要警示；但模型结论仍依赖具体实现与超参数。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-memory-gym-towards-endless-tasks-to-benchmark-memory-capabilities-of-agents/  

