# 论文 · Bayesian Inference of Contextual Bandit Policies via Empirical Likelihood


## 基础信息

* 会议/期刊：Journal of Machine Learning Research 27 (2026), 1-28
* 关键词：empirical likelihood, contextual bandit, off-policy evaluation, Bayesian inference, policy comparison

**核心贡献**：本文用 Bayesian empirical likelihood 构造 contextual bandit policy value 的联合后验和差值后验，使小样本 off-policy policy evaluation 与 policy comparison 能获得更稳健的不确定性量化。

## Q1. 研究动机

contextual bandit 中常常需要评估尚未上线的候选策略，但数据来自另一个 behavior policy，且只观察到被选择动作的 reward。

&gt; contextual bandit（上下文赌博机）：一类强化学习/在线学习问题：系统每一轮先看到当前用户或环境的“上下文”，然后从多个动作中选一个，最后只观察到被选动作的奖励，而看不到其他动作如果被选会怎样。

已有 empirical likelihood 置信区间依赖渐近 chi-square 校准，小样本或中等样本下覆盖率可能偏离 nominal level，并且多集中于单策略评估，难以比较相关策略。

&gt; Empirical likelihood（经验似然）置信区间：一种不用提前假设总体分布形式的置信区间构造方法。它用样本本身给每个观测点分配概率权重，然后看哪些参数值能让这些权重&#34;合理地解释数据&#34;。

## Q2. 核心问题

论文要解决的是：如何在有限样本 contextual bandit 数据中，对一个或多个目标策略的价值进行可靠贝叶斯推断，并对候选策略之间的改进概率进行完整不确定性量化。

## Q3. 现有不足 &amp; 本文改进

* Direct method 

依赖 reward model，importance sampling 可能方差很大，doubly robust 需要模型或 propensity 条件良好。

* 频率学派 

empirical likelihood 虽可用 estimating equations 做非参数推断，但 Wilks 区间在小样本中 chi-square 校准差。

本文把 empirical likelihood 放入 Bayesian paradigm，构造 HPD credible interval，并进一步构造多策略联合 empirical likelihood 与 policy value difference 的低维版本，支持灵活的策略比较。

## Q4. 方法流程

输入是 behavior policy 收集的 context、action、reward，以及一组 target policies。

方法先用目标策略与 behavior policy 的概率比形成 importance weights，并建立满足 policy value moment constraints 的 empirical likelihood。

对多个策略，构造 policy value vector 的 joint empirical likelihood；

若只关心两策略差异，则对 value difference 构造低维 empirical likelihood。然后结合 prior 得到后验，用 adaptive grid 计算 HPD 区间和改进概率。

输出包括 policy value 的后验分布、HPD 区间，以及如 P(v_new &gt; v_baseline &#43; delta) 的比较概率。

## Q5. 实验设计与结论

&gt; Monte Carlo 是用大量随机样本来近似一个难以直接计算的数学量。

| 实验 | 目的 | 结论 |
| --- | --- | --- |
| 单策略 Monte Carlo 推断 | 比较 Wilks interval 与 Bayesian HPD interval 的覆盖率和宽度 | Figure 1 显示小样本下 Wilks 区间覆盖率偏离 nominal level；Wilks 区间平均约比 HPD 宽 10%，但仍会出现 undercoverage，HPD 在有限样本更稳健。 |
| 策略比较 Monte Carlo | 验证 joint posterior 和 difference posterior 能否表达改进概率 | Figure 2 说明 v_baseline 与 v_new 不是独立的，因此需要 joint inference；方法能计算绝对改进和相对改进概率，并给出 95% confidence bands。 |
| 青少年 BMI 数据应用 | 展示方法在临床治疗策略比较中的使用方式 | 新策略 value 点估计为 0.64，95% HPD interval 为 (0.55, 0.72)；P(v_new &gt; 1.20 v_baseline)=0.92，P(v_new &gt; v_baseline &#43; 0.10)=0.92。 |

## Q6. 局限性

作者明确提到：方法不直接做 policy optimization，只用于候选策略推断；adaptive grid 在高维 policy value vector 上仍可能低效；可用降维比较或 variational inference 缓解，但 variational approximation 会带来精度损失，需要进一步研究。

以下为分析归纳，非原文明确说明：BMI 应用中的新策略是简单 logistic regression heuristic，论文重点是推断而非策略学习，因此不能把结果解读为最优临床策略发现。

## Q7. 学术价值

* 理论价值：把 empirical likelihood 的非参数约束优势与 Bayesian credible interval 结合，绕开小样本 Wilks 校准问题。
* 方法价值：joint posterior 支持任意相关策略比较，difference posterior 提供更低计算成本的直接比较。
* 应用价值：适合医疗、推荐、广告等需要离线评估候选策略且必须量化风险的 contextual bandit 场景。

## Q8. 延伸研究方向

1. 为高维多策略比较设计更高效的 posterior computation。
2. 研究 variational Bayesian empirical likelihood 的误差控制。
3. 将该推断模块嵌入 policy learning 流程，用于选择或停止候选策略。
4. 扩展到连续动作、延迟反馈或非平稳 contextual bandit。
5. 在真实 A/B 测试日志中比较 HPD 与 bootstrap、DR inference 等方法。

## Q9. 反直觉发现与方法失效分析

* Figure 1：Wilks 区间在小样本下不仅覆盖率差，而且在 undercoverage 案例中宽度分布更分散；论文明确说 Wilks 区间小样本平均约比 HPD 区间宽 10%，但仍可能有相当比例区间过窄。这说明“更宽”并不必然意味着“覆盖率更好”。
* Figure 2：v_baseline 与 v_new 的联合后验显示二者相关，若把两个策略价值独立处理会丢失比较信息。作者未把这称为异常，但这是策略比较中容易被忽视的现象。
* BMI 应用：新策略 95% HPD interval 为 (0.55, 0.72)，且两种比较口径的改进概率均为 0.92；结论较强，但样本来自模拟两阶段临床试验数据，外推到真实临床部署仍需谨慎。
* 整体评价：方法在有限样本不确定性量化上有说服力；主要风险在计算维度与候选策略本身质量，而非 posterior 比较框架。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-bayesian-inference-of-contextual-bandit-policies-via-empirical-likelihood/  

