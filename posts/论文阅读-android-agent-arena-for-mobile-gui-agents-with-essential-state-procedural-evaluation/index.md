# 论文 · Android Agent Arena for Mobile GUI Agents With Essential-State Procedural Evaluation


## 基础信息

- 标题：Android Agent Arena for Mobile GUI Agents with Essential-State Procedural Evaluation
- 类型：Benchmark / evaluation system
- 核心贡献：提出 A3，一个面向动态在线 Android app 的 GUI agent 评测系统，包含 20 个主流在线 app、100 个任务、essential-state 程序化评测方法和 A3RM reward model。

## Q1. 研究动机

移动 GUI agent 的评测长期依赖静态截图、离线 app 或可插桩的开源应用，难以反映真实在线 app 中内容变化、路径多样和错误累积。作者希望构建一个更接近真实用户环境、但仍能复现和自动评测的动态 benchmark。

## Q2. 核心问题

论文解决的是动态在线移动应用中的 agent 评测问题：在不能访问闭源 app 内部状态、UI 内容会变化、正确轨迹不唯一时，如何判断 agent 是否完成任务以及完成了哪些关键过程状态。

## Q3. 现有不足 &amp; 本文改进

AndroidControl、AITW 等静态 benchmark 只能测下一步动作；AndroidWorld 虽是动态环境，但依赖开源/离线 app；SPA-Bench 有在线 app 但存在环境 reset 不稳定问题。A3 的改进是选择可程序化重置的主流在线 app，并用 essential state 描述高层语义里程碑，而不是用精确 view id 或固定轨迹评判。

## Q4. 方法流程

A3 首先从 Google Play 热门类别中筛选 20 个 app，并设计 100 个日常任务。每个任务由人工标注 essential states，例如“搜索完成”“第一个结果被打开”“答案被返回”。agent 执行后，系统保存屏幕轨迹，再用滑动窗口将连续屏幕送入 MLLM evaluator 判断每个 essential state 是否达成。作者还基于 Qwen3-VL-8B 训练 A3RM，用人类轨迹正负样本和 agent 负样本进行 reward model 学习，降低商业 MLLM 评测成本。

## Q5. 实验设计与结论

- A3RM 评测质量：Table 2 显示 A3RM 在 essential-state level 上 Precision=95.7、F1=95.3、Accuracy=96.6，超过 Gemini-2.5-pro 的 Precision=87.3、F1=91.5、Accuracy=89.5；task level Accuracy 为 98.0。
- Agent benchmark：Table 3 显示 T3A&#43;Gemini-2.5-pro Overall SR=53.0、ESAR=66.4，是最高结果；开源单模型中 InfiGUI-R1 SR=27.0，说明 A3 对当前 agent 很难。
- 滑动窗口：Table 5 显示窗口大小 3 或 4 精度最高，过大窗口会因图像压缩损失 UI 细节。
- 泛化：Table 7 中 A3RM 在 25 个新任务上仍优于 Gemini-2.5-pro；A3RM-Continued 在 task level Precision=100.0、F1=97.0、Accuracy=96.0。

## Q6. 局限性

作者明确提出：

- Benchmark 限于 Android；iOS 因系统限制难以虚拟化和程序化控制。
- 排除了即时通信等高频类别，因为登录、隐私和重置机制复杂。
- A3RM 虽高精度，但仍是概率模型，可能 hallucinate。
- 在线 app 中 agent 错误操作可能造成内容异常或账户风险。

以下为分析归纳，非原文明确说明：

- essential-state 标注虽然一次性，但仍依赖人工判断，任务扩展成本不低。
- 使用 MLLM 作为 judge 可能把评测偏差带入 benchmark 排名。

## Q7. 学术价值

- 理论价值：把 GUI agent 评测从终态二值成功扩展到过程里程碑。
- 方法价值：essential-state 提供了适合闭源动态 app 的语义评测单位。
- 应用价值：可用于评估移动 assistant 在真实在线 app 中的长程鲁棒性。

## Q8. 延伸研究方向

1. 将 essential-state 自动生成和校验结合，降低人工标注成本。
2. 建立多 judge 交叉验证，减少单一 MLLM evaluator 偏差。
3. 引入隐私、越权和误操作成本评测。
4. 扩展到需要登录和社交交互的高风险 app。
5. 研究 essential-state 与 agent 训练奖励之间的闭环优化。

## Q9. 反直觉发现与方法失效分析

- Table 2 中 A3RM 小模型精度高于 Gemini-2.5-pro，作者解释为 Gemini 高召回低精度，容易把模糊状态判为成功；这说明通用强模型不一定是更严格的 evaluator。
- Table 3 中最高系统 T3A&#43;Gemini 也只有 SR=53.0，但 ESAR=66.4，说明 agent 往往能到达部分关键状态，却缺乏长程稳定性完成最终目标。
- Appendix A.4 显示 Gemini evaluator 对 agent 成功率整体更乐观，例如 T3A&#43;Gemini 从 A3RM 的 53.0% 到 Gemini 评测的 58.0%，提示评测模型选择会改变绝对分数。
- 整体评价：A3 的价值在评测框架和生态有效性，结论对现有 agent 能力的判断较强，但仍受 essential-state 标注和 judge 模型可靠性约束。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-android-agent-arena-for-mobile-gui-agents-with-essential-state-procedural-evaluation/  

