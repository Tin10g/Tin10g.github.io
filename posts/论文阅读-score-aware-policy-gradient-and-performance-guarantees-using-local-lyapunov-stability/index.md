# 论文 · Score-Aware Policy-Gradient and Performance Guarantees Using Local Lyapunov Stability


## 基础信息

* 会议/期刊：Journal of Machine Learning Research 26 (2025), 1-74
* 关键词：policy gradient, score-aware gradient estimator, average reward RL, exponential family, Lyapunov stability, queueing systems

**核心贡献**：本文提出 Score-Aware Gradient Estimators (SAGEs)，在 MDP stationary distribution 属于由 policy 参数化的 exponential family 时，利用 stationary score 直接估计 average-reward policy gradient，避免 value-function estimation，并用 local Lyapunov stability 证明含不稳定策略的可数状态空间中局部收敛与 regret 保证。

## Q1. 研究动机

传统 policy-gradient 方法通常依赖 value 或 action-value 估计，在大状态空间、可数状态空间、队列网络和统计物理系统中成本高且不稳定。许多随机网络具有已知 product-form 或 exponential-family stationary distribution，作者希望把这类模型结构直接用于 gradient estimation。

## Q2. 核心问题

论文要解决的是：当 MDP 的 stationary distribution 与 policy parameters 之间有已知指数族关系时，如何构造不依赖 value function 的 policy-gradient estimator，并在可能存在 unstable policies 的可数状态空间中证明局部收敛和性能保证。

## Q3. 现有不足 &amp; 本文改进

Actor-critic 需要估计 value function，状态空间大时会出现组合爆炸和估计偏差。现有全局收敛结果多面向有限状态或更强结构假设。本文提出 SAGE，将 stationary distribution 的 score 信息纳入 gradient estimator；理论上使用 local Lyapunov function 和 Hessian 非退化等局部条件，允许不稳定 policy 存在；实验上在 queue、load balancing、Ising/Glauber dynamics 中展示 SAGE 比 actor-critic 更快或更可扩展。

## Q4. 方法流程

输入是可参数化 policy、MDP reward，以及 stationary distribution 对 policy parameters 的指数族表示。算法利用 stationary log-density 对参数的导数，也就是 score，与 reward 样本构造 gradient estimator，不需要先学习 value function。随后用 stochastic gradient ascent 更新 policy parameters。理论分析通过局部邻域、batch size、step size 和 Lyapunov function 控制估计误差与进入不稳定区域的概率。输出是逐步改进的 policy 和 local convergence/regret 保证。

## Q5. 实验设计与结论

| 实验 | 目的 | 结论 |
| --- | --- | --- |
| 单服务器 admission control，稳定队列 λ=0.7 | 比较 SAGE 与 actor-critic 的收敛形态 | Figure 1/2 显示二者最终收敛，但 SAGE 的 long-run average reward 单调上升；actor-critic 在 10^3 到 10^5 steps 间会停滞或下降，并在 Figure 2b 出现 admission probability overshoot。 |
| 单服务器 admission control，可能不稳定 λ=1.4 | 检验有 unstable policy 区域时的表现 | Figure 3 显示 SAGE 仍收敛到接近最优且没有进入 unstable policy；actor-critic 在多种参数化下所有 runs 都会访问不稳定 policy 数千步，部分设置只有 7/10 runs 最终回到稳定 policy。 |
| load-balancing system | 检验大规模状态空间下可扩展性 | Figure 4 中 actor-critic 只报告 n=4，因为 n=20/100 时状态-动作空间组合爆炸；SAGE 可运行 n=20 和 n=100，n=4 下收敛约快 10 倍。 |
| Ising/Glauber dynamics | 检验统计物理模型中的 score-aware 更新 | Figure 5 显示 reward 从约 -4 阶段性升至 0，magnetization 按目标方向翻转；actor-critic 因状态空间 2^200 未运行。 |

## Q6. 局限性

作者明确提到：SAGE 需要能计算或获得 D log rho(theta)，在复杂模型中若该项依赖未知模型参数会更难；未来可结合 model selection 先估计这些参数。理论收敛是局部的，需要从足够接近 maximizer 的位置开始，并依赖 local Lyapunov function 与 Hessian 非退化。

以下为分析归纳，非原文明确说明：SAGE 的优势来自强模型结构知识，不是通用 model-free RL 方法；若 stationary distribution 不具备可用指数族或 product-form 结构，方法适用性会下降。

## Q7. 学术价值

* 理论价值：给出可数状态、可能不稳定 policy 下的局部 policy-gradient 收敛分析。
* 方法价值：提出绕过 value-function estimation 的 score-aware gradient estimator。
* 应用价值：适合 queueing networks、load balancing、statistical physics 等 stationary structure 明确的系统控制。

## Q8. 延伸研究方向

1. 将 SAGE 与模型参数估计结合，处理 D log rho(theta) 未知的场景。
2. 放宽局部初始条件，研究更全局的稳定化机制。
3. 与 function approximation actor-critic 在大规模随机网络中系统比较。
4. 扩展到非平稳、部分可观测或多智能体队列系统。
5. 研究 SAGE 与 natural policy gradient、entropy regularization 的结合。

## Q9. 反直觉发现与方法失效分析

* Figure 1/2：稳定队列中 actor-critic 初期可能比 SAGE 快，但 long-run average reward 会在 10^3 到 10^5 steps 停滞或下降；Figure 2b 显示原因是 actor-critic 对 admission probabilities overshoot。作者已解释为 value function estimate 的暂态偏差叠加。
* Figure 3：λ=1.4 的可能不稳定队列中，SAGE 反而比 λ=0.7 时更快接近最优；作者推测是高负载下高队列状态 admission probability 更快下降，显著改善 reward。这个现象不是通用结论，但说明不稳定区域不一定让 SAGE 更慢。
* Figure 3：actor-critic 在 π0、π2、π4 下所有 simulation runs 都访问 unstable policies 数千步，且某些设置只有 7/10 runs 最终回到稳定 policy。这直接暴露 value-based update 在不稳定区域附近的风险。
* Figure 4：actor-critic 未报告 n=20/100，因为状态空间规模不可承受；SAGE 内存随 server 数线性增长。该对比说明 SAGE 的主要优势是结构利用和可扩展性，而非纯采样效率。
* 整体评价：理论和实验对结构化随机系统很强；适用边界也很清楚，即必须拥有可用 stationary score 信息。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-score-aware-policy-gradient-and-performance-guarantees-using-local-lyapunov-stability/  

