# 论文 · Agent-SAMA State-Aware Mobile Assistant


## 基础信息

- 标题：Agent-SAMA: State-Aware Mobile Assistant
- 类型：方法论文；移动 GUI agent
- 核心贡献：提出用有限状态机（FSM）建模移动 app 执行过程，把屏幕视为状态、用户动作视为转移，并通过规划、执行、状态建模、反思恢复和知识保留模块提升跨 app 任务成功率与错误恢复能力。

## Q1. 研究动机

现有移动 GUI agent 多根据当前屏幕反应式地决定下一步动作，缺少对 app 导航结构和执行上下文的显式表示。这样在跨 app、长程任务和错误恢复场景中，agent 很难判断当前是否偏离预期，也难以回到稳定状态重试。

## Q2. 核心问题

论文试图解决移动 GUI agent 的状态感知和错误恢复问题：如何让 agent 不只看当前屏幕，而是理解屏幕之间的转移关系、预测动作结果，并在异常时利用执行历史恢复。

## Q3. 现有不足 &amp; 本文改进

* 现有 Mobile-Agent、AppAgent 等方法能执行屏幕操作，但通常缺乏结构化导航记忆

* Mobile-Agent-E&#43;Evo 有长期经验，但没有显式 FSM

Agent-SAMA 的改进是把实时执行轨迹组织为 FSM，并给每个状态/转移附加前置和后置条件，使 Reflection Agent 能比较预期转移与实际屏幕，Mentor Agent 能把 FSM 和 action sequence 存入长期记忆供后续任务使用。

## Q4. 方法流程

输入是用户的高层移动任务和当前屏幕。

- Planner 先生成带子目标的执行计划
- Actor/Screen Parser 感知屏幕并执行点击、输入、滑动等动作
- State Agent 把每个屏幕抽象为 FSM 状态，把动作抽象为状态转移，并记录条件
- Reflection Agent 在执行失败或异常状态时检查 FSM 预测与当前屏幕差异，生成回滚或重试计划
- Mentor 在任务结束后总结可复用知识、动作序列和 FSM，写入长期记忆。输出是完成任务的动作轨迹及可复用状态知识

## Q5. 实验设计与结论

- 主实验：在 Mobile-Eval-E 和 SPA-Bench 上与 AppAgent、Mobile-Agent 系列和 Mobile-Agent-E&#43;Evo 对比。Table 2 显示 Agent-SAMA 在 Mobile-Eval-E 上 SS=86.15%、AA=83.24%、SR=84.00%、RS=71.88%；在 SPA-Bench 上 SS=88.64%、AA=84.35%、SR=80.00%、RS=66.67%。
- AndroidWorld：Table 3 中 Agent-SAMA 成功率为 63.7%，高于 V-Droid 的 59.5% 和 AgentS2 的 54.3%。
- Backbone 敏感性：Table 4 显示 GPT-4o 最强，Claude 3.5 次之，Gemini 1.5 Pro 较弱；说明框架有效但仍受底层 MLLM 限制。
- 消融实验：Table 5 显示完整模型在 Mobile-Eval-E / SPA-Bench 上 SR 分别为 84.00% / 80.00%；移除规划、多计划选择、前后置条件或 Mentor 都会降低性能，说明 FSM、恢复和知识保留共同贡献性能。

## Q6. 局限性

作者明确提出：

- Benchmark coverage 有限，主要是 Mobile-Eval-E、SPA-Bench 和 AndroidWorld，不能覆盖动态内容、第三方广告、外部中断等全部移动交互。

分析归纳：   

- FSM 状态抽象依赖 MLLM 对屏幕的描述质量，屏幕语义相似但业务状态不同的场景可能合并错误。
- 长期记忆可能带来过时知识，尤其是 app UI 更新后，旧 FSM 可能误导规划。

## Q7. 学术价值

- 理论价值：把 GUI agent 从“当前屏幕反应式控制”推进到“显式状态转移建模”。
- 方法价值：FSM 提供可解释的执行记忆，可服务于规划、验证、恢复和跨任务复用。
- 应用价值：适合跨 app、长程流程、需要错误恢复的移动自动化任务。

## Q8. 延伸研究方向

1. 研究 UI 更新后 FSM 记忆的失效检测和自动修正。
2. 将 FSM 与更细粒度的业务状态、账户状态、网络状态结合。
3. 在含弹窗、广告、异步加载的真实手机环境中评估鲁棒性。
4. 设计跨 app 共享的状态图 schema，提升知识迁移能力。
5. 将用户偏好和隐私约束加入 FSM 转移验证。

## Q9. 反直觉发现与方法失效分析

- Table 4 中 backbone 差异明显：Mobile-Eval-E 的 SR 从 GPT-4o 的 84.00% 降到 Gemini 1.5 Pro 的 68.00%，说明状态建模不能完全弥补感知/推理模型能力差距。
- Table 5 显示去掉 Planner 时 Mobile-Eval-E SR 仅 52.00%，SPA-Bench SR 45.00%；这说明单靠 FSM 执行记忆不够，前期任务分解仍是核心瓶颈。
- 整体评价：实验支持 FSM 提升恢复和成功率，但性能是“框架&#43;强 MLLM”共同结果，泛化到更弱模型或动态 UI 仍需验证。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-agent-sama-state-aware-mobile-assistant/  

