# 论文 · Just-in-Time Reinforcement Learning: Continual Learning in LLM Agents Without Gradient Updates


## 基础信息

- 论文标题：Just-In-Time Reinforcement Learning: Continual Learning in LLM Agents Without Gradient Updates
- 发表信息：ICML 2026, PMLR 306
- 代码：https://github.com/liushiliushi/JitRL
- 关键词：LLM Agent, continual learning, test-time learning, reinforcement learning, non-parametric memory, logit update
- 核心贡献：论文提出 JitRL，一个无需梯度更新的测试时强化学习框架，通过存储历史轨迹、检索相似经验、估计动作优势并直接调整 LLM 输出 logits，使冻结权重的 LLM agent 能在部署过程中持续学习；作者证明该加性 logit 更新是 KL 约束策略优化目标的闭式解，并在 WebArena 与 Jericho 上取得训练免费方法中的最好结果，且相较 WebRL 将成本降低 30 倍以上。
- 主要结论：在 WebArena 主实验中，JitRL 的平均 / 最终成功率为 46.98% / 51.35%，高于所有训练免费基线；在 WebArena-Lite 上，JitRL 最终成功率 60.00%，高于 WebRL 的 46.06%；在 Jericho 中，JitRL 在 Library、Zork1、Zork3 的平均分分别为 25.9、53.0、3.1，均高于训练免费与 GRPO 基线。

## Q1. 研究动机

部署后的 LLM agent 权重通常被冻结，面对新环境或动态任务时会重复犯错，缺少类似人类的“边做边学”能力。传统 RL 可更新策略，但成本高、样本需求大且有灾难性遗忘风险；纯 ICL / 反思 / 记忆方法又受上下文长度和文本提示能力限制。因此作者希望让 agent 在不训练参数的情况下，从交互经验中持续改进。

## Q2. 核心问题

论文要解决的问题是：如何让冻结权重的 LLM agent 在测试时从历史交互轨迹中学习，并改进当前动作选择，而不进行梯度更新或模型微调。

这不是单纯“把过去经验放进 prompt”的问题，而是如何把历史奖励信号转化为类似 RL 中优势函数的策略改进信号，并以低成本方式作用到 LLM 的输出分布上。

## Q3. 现有不足 &amp; 本文改进

- 传统 RL / PPO / GRPO / WebRL：需要大量环境交互和 GPU 训练，在线更新成本高；在低样本持续适应场景下不稳定；还可能引发灾难性遗忘。论文在成本分析中指出 WebRL 的 70B 训练约需 154 小时、16 张 H200，总成本约 9,856 美元，而 JitRL 主成本约 290 美元。
- SFT / 离线训练：依赖人工标注或离线训练集，训练后仍是静态模型，无法自然处理部署后的任务分布变化。
- ICL / Memory / Reflexion / AWM：主要把经验写成文本再放入上下文，容易受上下文长度、注意力分散和“反思噪声”影响；它们并没有直接优化策略分布。
- 本文改进：JitRL 将记忆视为非参数策略分布，而不是提示文本库；它把每一步经验存成“状态、动作、回报”三元组，检索相似状态来估计状态值、动作值和优势，再把优势作为加性修正直接作用于 logits。作者还引入候选动作扩展、未知动作探索奖励、优势归一化和动作规范化，使历史高回报动作能在当前状态中重新进入候选集。

## Q4. 方法流程

JitRL 的输入是当前环境观测、冻结 LLM 给出的候选动作及其 logits，以及历史交互记忆。每个 episode 结束后，LLM evaluator 为完整轨迹分配 step-wise rewards，系统再计算每一步的折扣回报，并把压缩后的状态、实际动作和回报存入动态记忆。推理时，当前原始观测会先被压缩成结构化状态：WebArena 使用正则化 URL 加局部动作历史，Jericho 使用实体、动作、进度和位置摘要。随后系统检索相似历史状态，估计当前状态的平均回报，并对每个候选动作估计其历史回报；若动作没有历史证据，则按一定概率给予乐观探索值。系统用动作值相对状态平均值的差来得到优势，并归一化。最后，它把 LLM 原始候选动作与记忆中出现过的动作合并，直接提高高优势动作的 logits、降低低优势动作的 logits，再采样执行。论文理论部分证明，这种加性 logit 更新正是 KL 正则化策略优化目标的闭式最优解。

## Q5. 实验设计与结论

- 主实验 - WebArena 训练免费方法比较（Table 1）
  - 目的：验证 JitRL 相比 Static、Memory、Reflexion、AWM、EvoTest 等测试时方法是否能持续提高网页任务成功率。
  - 结论：JitRL 在五个网站域的微平均 Avg / Final 为 46.98% / 51.35%，明显高于 Static 的 35.63% / 36.30% 和最强训练免费基线 Memory / EvoTest 的约 41% / 43%。Shopping 上提升尤其明显，JitRL Final 45.83%，Static 25.00%。

- 主实验 - WebArena-Lite 与权重更新方法比较（Table 2）
  - 目的：检验 JitRL 是否能与 SFT、WebRL 等训练方法竞争。
  - 结论：JitRL 的平均 Final 成功率为 60.00%，高于 WebRL 的 46.06% 和 SFT 的 23.00%。作者据此认为 JitRL 可作为昂贵训练式 RL 的高效替代。

- 主实验 - Jericho 长程文本游戏（Table 3, Figure 3）
  - 目的：验证 JitRL 在长时序、稀疏奖励、纯文本交互环境中的持续学习能力。
  - 结论：JitRL 在 Library / Zork1 / Zork3 上的 Avg 分数为 25.9 / 53.0 / 3.1，Final 分数为 30 / 69 / 5，均高于 Static、Memory、Reflexion、AWM、EvoTest 和 GRPO。Figure 3 显示 JitRL 随 episode 增多持续上升，后期方差更低。

- 泛化实验 - 不同 backbone（Table 4）
  - 目的：检验 JitRL 是否依赖特定 LLM。
  - 结论：作者在 Gemini-2.5-flash、GPT-5-mini、DeepSeek-V3.2 上测试，称 JitRL 在多数情况下达到最佳，说明 logit 更新机制具有一定模型无关性。

- 泛化实验 - 未见任务 / 跨任务记忆（Table 5, Table 6）
  - 目的：检验没有同任务历史时，JitRL 是否能利用其他任务的抽象过程经验。
  - 结论：在只能检索 disjoint tasks 记忆时，JitRL 在 Admin / GitLab / Map / Reddit / Shopping 上分别得到 48.37 / 38.73 / 35.78 / 55.04 / 36.98，均超过对应基线；Table 6 显示跨任务记忆约占检索上下文的近一半，说明方法并非只记住同一任务的答案。

- 定性分析 - 修正语义先验（Table 7, Table 17）
  - 目的：展示 JitRL 如何改变动作偏好。
  - 结论：WebArena 中，查找 customer reviews 时，JitRL 将错误的 click(CATALOG) logit 从 0.90 降到 0.40，将正确的 click(MARKETING) 从 0.70 提到 1.40；Jericho 中，JitRL 学到 give ID to attendant、echo、tie rope to railing 等反直觉但高回报动作。

- 消融实验 - logit update vs prompt update（Table 8）
  - 目的：区分收益来自“检索到信息”还是“直接改 logits”。
  - 结论：同样使用检索记忆时，Logit Update 在 Admin / Reddit 上为 52.31 / 57.64，高于 Prompt Update 的 49.46 / 53.02，说明直接调输出分布比把经验塞进 prompt 更有效。

- 消融实验 - 检索邻居数、探索率、UCB 奖励、状态表示（Figure 4, Figure 5, Tables 19-23）
  - 目的：分析关键超参数与表示方式。
  - 结论：检索邻居数 k 在 8 到 14 较稳定；Jericho 更需要高探索率，WebArena 更适合低探索率；UCB bonus 取 5 时整体平衡较好；文本化状态表示优于 embedding 状态表示；随着记忆从 0-500 增到 2000-2500 条，Library 平均分从 18.1 提升到 30.0，检索延迟仅从 15-22ms 增至 47ms。

- 成本比较（Table 9, Appendix R）
  - 目的：比较持续学习的经济成本。
  - 结论：JitRL 成本约 290 美元，与其他训练免费方法同量级；WebRL 约 9,900 美元。作者据此声称 JitRL 在达到更高或相近性能时，将成本降低 30 倍以上。

## Q6. 局限性

作者明确提到：

1. 依赖冻结 base model：JitRL 本质上重排候选动作，无法发现 base model 从未生成过、记忆中也从未出现过的动作。
2. 依赖 LLM evaluator 的 step-wise reward：如果 evaluator 信用分配错误，优势估计会被污染，进而降低策略质量。
3. 不适合关键信息难以文本表示的任务：如棋盘空间关系、时间序列模式等，文本检索可能无法捕捉真正相似的状态。
4. 记忆隐私风险：Impact Statement 指出，memory bank 存储真实交互轨迹，实际部署中可能包含敏感用户信息。

（以下为分析归纳，非原文明确说明）

1. 实验仍集中在 WebArena 和 Jericho，尚未证明在更开放、长期、多人协作或真实用户环境中的稳定性。
2. 方法依赖历史记忆质量，若环境规则变化，旧记忆可能过期并误导策略；论文没有系统讨论记忆淘汰、冲突解决和数据清洗机制。
3. 理论收敛结果依赖相似状态检索和价值估计的一系列假设，真实 LLM agent 的非平稳行为、近似检索和噪声奖励可能使假设难以完全满足。
4. 与训练式方法的比较有多种设定：JitRL 在在线低样本场景很强，但在离线大训练集、同 backbone、无测试时适应的设定中，WebRL 仍有更高平均成功率，因此“替代 RL”应理解为特定持续学习场景下的高效替代。

## Q7. 学术价值

- 理论价值：把测试时经验检索与 KL 正则策略优化联系起来，证明“优势加到 logits 上”不是启发式技巧，而是一个约束优化问题的闭式解。
- 方法价值：提供了一种无梯度、非参数、可插拔的 agent 持续学习框架；它兼容开源模型的 token-level logits，也可通过 verbalized confidence 适配不暴露 logits 的黑盒模型。
- 应用价值：适合网页操作、工具调用、客服流程、企业内重复任务、文本游戏等需要从历史交互中快速改进但不方便频繁训练模型的场景。

## Q8. 延伸研究方向

1. 如何设计多模态状态表示，让 JitRL 能处理棋盘、地图、UI 截图、视频流等难以纯文本描述的状态？
2. 如何提升 evaluator 的信用分配可靠性，例如结合环境自动奖励、人类反馈、校准模型或不确定性估计？
3. 如何管理长期记忆，包括隐私保护、记忆压缩、过期记忆清理、冲突记忆仲裁和用户数据删除？
4. 如何让 JitRL 发现 base model 和历史记忆都未覆盖的新动作，而不只是重排已有候选？
5. 如何在真实在线部署中评估 JitRL 的长期稳定性，尤其是环境规则变化、用户目标变化和对抗性记忆污染下的表现？

## Q9. 反直觉发现与方法失效分析

- 发现一（Table 1）：部分记忆/反思基线会劣化而不是改进。Reflexion 在 Map 上 Final 为 27.34，低于 Static 的 31.25；AWM 在 Shopping 上 Avg / Final 为 23.12 / 22.40，低于 Static 的 24.06 / 25.00。
  - 作者解释：作者明确提到 Reflexion 在 Map 中会出现“reflection noise”，误导反馈会降低表现；对 AWM 在 Shopping 的低于 Static 现象没有逐项解释，只在 Jericho 分析中笼统指出 Memory / AWM 容易过早 plateau、过度依赖既有记忆模式。

- 发现二（Table 5）：跨任务泛化虽然一致超过基线，但部分提升很边际。GitLab 上 JitRL 为 38.73，最接近的 Memory 为 37.75，只高 0.98；Map 上 JitRL 为 35.78，AWM / EvoTest 均为 34.86，只高 0.92。
  - 作者解释：作者认为这说明 JitRL 能迁移抽象过程知识，但没有报告方差或显著性检验；这些接近 1 个百分点的提升是否稳定，还需要更多统计证据。

- 发现三（Table 12）：同 base model、同训练数据、on-the-fly 对比中，JitRL 平均 Final 32.97 高于 WebRL 27.27，但 Admin 域 JitRL 只有 28.57，低于 WebRL 的 38.89。
  - 作者解释：作者只总结 JitRL 在多数域和平均值上更强，并将 WebRL 劣势归因于低样本在线 RL 不稳定；没有解释 Admin 上 JitRL 反而显著落后的原因。可能原因是 Admin 域需要更精细的规则或权限流程，历史检索相似性不足时会误导动作优势估计。

- 发现四（Table 13）：在同 Llama-3.1-70B backbone、离线训练任务充足、评估时不做测试集适应的设定中，WebRL 平均成功率 46.06，高于 JitRL 的 40.88；WebRL 在 Admin / GitLab / Map / Reddit 上分别为 58.33 / 47.06 / 32.26 / 62.50，均高于 JitRL 的 47.22 / 38.24 / 25.81 / 58.33，只有 Shopping 上 JitRL 34.78 高于 WebRL 30.43。
  - 作者解释：作者明确指出该设定对权重更新方法更有利，JitRL 主要面向没有大规模离线数据的持续学习场景；这说明 JitRL 的优势不是在所有训练制度下碾压 WebRL，而是在测试时、低成本、少样本适应场景中更有吸引力。

- 发现五（Tables 19-22）：默认超参数不是每个域/任务都最优。Table 20 中 WebArena 的 λ=0.25 在 Admin / GitLab / Reddit 上为 52.75 / 41.18 / 57.89，高于默认 λ=0.05 的 52.31 / 40.78 / 57.64；Table 21 中 Jericho 的 α=7 在 Zork1 上为 54.2，高于 α=5 的 53.0；Table 22 中 α=3 在 Admin / Reddit 上为 53.48 / 58.45，高于 α=5 的 52.31 / 57.64。
  - 作者解释：作者解释为不同环境对探索的需求不同，α=5 是整体平衡；但这些结果也说明 JitRL 对任务类型和域结构仍有条件性敏感，部署时可能需要自动调参。

- 发现六（Table 24）：经过大量超参搜索后，GRPO 在 Zork1 的最佳配置达到 Val Mean 40.7、Val Max 55，已经接近但仍低于 JitRL 的同 backbone 平均分 53.0；不过 GRPO 需要 3,200 个训练 episodes，而 JitRL 只需 50 条轨迹。
  - 作者解释：作者明确强调 GRPO 可以通过大样本和调参接近 JitRL，但样本成本高 64 倍，支持 JitRL 的样本效率优势。

- 整体评价：论文的主结论在“训练免费、测试时持续适应、低样本在线学习”场景下较稳健，尤其 WebArena 主表、Jericho 曲线、成本分析和同场景 GRPO 对比相互支撑。但它不是所有条件下的绝对碾压：离线大训练数据设定中 WebRL 仍更强，跨任务泛化的部分提升较小，超参数也存在域依赖。因此更准确的评价是：JitRL 是条件性有效且成本/样本效率突出的持续学习方法，而非完全替代权重更新 RL 的通用方案。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-just-in-time-reinforcement-learning-continual-learning-in-llm-agents-without-gradient-updates/  

