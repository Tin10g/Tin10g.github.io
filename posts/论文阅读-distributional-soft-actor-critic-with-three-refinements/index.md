# 论文 · Distributional Soft Actor-Critic With Three Refinements


## 基础信息

* 会议/期刊：IEEE Transactions on Pattern Analysis and Machine Intelligence, Vol. 47, No. 5, May 2025
* 关键词：reinforcement learning, soft actor-critic, distributional RL, value overestimation, continuous control

**核心贡献**：本文在 DSACv1 基础上提出 DSAC-T/DSACv2，通过 expected value substitution、twin value distribution learning 和 variance-based critic gradient adjustment 降低 critic 梯度随机性与 Q-value 估计偏差，在连续控制基准和真实移动机器人任务中提升稳定性与性能。

## Q1. 研究动机

model-free RL 常因 Q-value 过估计导致策略退化。DSACv1 用连续 Gaussian value distribution 改善估计，但仍存在训练不稳定、对 reward scaling 敏感等问题。作者希望在保留 DSAC 分布式价值建模优势的同时进一步稳定 critic 更新。

## Q2. 核心问题

核心问题是：如何在 continuous control 中更准确、稳定地学习 value distribution，减少随机 return 引起的 critic gradient 高方差和 Q-value overestimation，从而提升 SAC 类算法的最终性能与超参数鲁棒性。

## Q3. 现有不足 &amp; 本文改进

SAC、TD3、DDPG 等通常只学习 Q-value 点估计，容易受 Bellman maximization 下的 noisy estimate 影响。DSACv1 虽引入 value distribution，但均值相关梯度仍受随机 return 扰动，且固定 clipping boundary 对 reward scale 敏感。本文把 value distribution 梯度分解为均值相关和方差相关两部分，用 target Q-value 替代随机 target return 的一阶项；引入 twin value distribution 抑制过估计；再用基于方差的 critic gradient adjustment 自适应处理 reward scale。

## Q4. 方法流程

输入是连续状态、动作、reward 和 replay buffer 中的 transition。critic 输出 Gaussian value distribution 的均值与标准差，actor 仍按最大熵目标更新。DSAC-T 先在 critic 均值梯度中用更稳定的 expected value 代替随机 return；再训练两个 value distributions，并用类似 clipped double Q 的思想降低过估计；最后依据 return variance 调整 critic 梯度 clipping 与 scaling，使不同 reward magnitude 下的更新尺度更稳。输出是更新后的 actor、critic 和用于连续控制的 stochastic policy。

## Q5. 实验设计与结论

| 实验 | 目的 | 结论 |
| --- | --- | --- |
| OpenAI Gym 连续控制基准 | 比较 DSAC-T 与 DDPG、TRPO、PPO、TD3、SAC、DSACv1 | Figure 2/Table II 显示 DSAC-T 在所有测试任务中至少匹配或超过 baselines；Humanoid-v3 上相对 SAC、TD3、PPO、DDPG、TRPO 分别提升 16.0%、92.3%、57.7%、104.7%、1022.2%。 |
| Q-value bias 分析 | 检查 twin value distribution 是否改善估计偏差 | Table III 显示 DSAC-T 多数任务上估计更准，并倾向轻微低估；与 RAC-SAC 比较时，Humanoid bias 为 -42.29 vs 97.78，Ant 为 -10.55 vs -18.82。 |
| 消融实验 | 分别验证三个 refinement 的作用 | Figure 4 显示去掉 expected value substitution 或 twin distribution 会降低稳定性和性能；Figure 5 显示无 variance-based adjustment 时在 reward scale 0.01 和 0.1 下难以学到有效策略。 |
| 真实机器人应用 | 验证 sim-to-real 控制可行性 | Geekplus M200 移动机器人能完成路径跟踪和避障，Figure 7/Figure 8 展示其加速、绕障、回到目标速度的过程。 |

## Q6. 局限性

作者明确提到：未来仍需系统分析不同 value distribution learning 方法；当前 DSAC-T 仍通过最大化 Q-value 更新 policy，尚未充分利用分布方差做风险敏感学习或探索引导。

以下为分析归纳，非原文明确说明：论文主要在标准 Gym 与一个机器人平台验证，复杂真实环境、稀疏奖励、多模态 return 分布下的效果仍未充分展示；Gaussian distribution 假设可能限制对复杂 return distribution 的表达。

## Q7. 学术价值

* 理论价值：从 gradient 分解角度解释 DSACv1 不稳定来源，并给出更稳定的 critic 更新机制。
* 方法价值：三个 refinement 可作为 distributional actor-critic 的通用设计经验。
* 应用价值：对机器人连续控制很直接，尤其是 reward scale 难以精调的任务。

## Q8. 延伸研究方向

1. 比较 Gaussian、quantile、implicit distribution 等不同 value distribution 表示。
2. 把 value distribution variance 显式用于 risk-sensitive policy objective。
3. 用分布不确定性指导 exploration，而不只是 critic 稳定化。
4. 在离线 RL、稀疏奖励和安全约束控制中测试 DSAC-T。
5. 分析三个 refinement 对收敛性和 bias-variance tradeoff 的理论影响。

## Q9. 反直觉发现与方法失效分析

* Table II/Figure 2：DSAC-T 在 Humanoid-v3 相对 TRPO 提升 1022.2%，提升幅度极大；这更像是某些 baseline 在该设置下表现很弱，而不只是 DSAC-T 小幅改进。
* Table III：DSAC-T 有时产生轻微 underestimation；作者认为在偏差量级相近时低估优于高估。这说明方法不是消除偏差，而是把危险的过估计转向更保守的估计。
* Figure 5：去掉 variance-based critic gradient adjustment 后，在 reward scale 0.01 和 0.1 下难以学习有效策略；作者已讨论该现象，说明 DSAC-T 的 reward-scale 鲁棒性高度依赖这一 refinement。
* 计算代价：Humanoid-v3 每 1000 iterations 用时 DSAC-T 35.51s，DSACv1 29.00s，SAC 35.02s，TD3 31.41s，DDPG 25.20s。性能提升伴随一定额外成本，但没有明显超过 SAC。
* 整体评价：实验证据强，消融支持充分；主要风险是复杂分布假设和真实部署范围仍有限。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-distributional-soft-actor-critic-with-three-refinements/  

