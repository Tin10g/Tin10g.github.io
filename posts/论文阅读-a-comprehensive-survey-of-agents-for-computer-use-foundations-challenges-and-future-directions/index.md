# 论文 · a Comprehensive Survey of Agents for Computer Use Foundations, Challenges, and Future Directions


## 基础信息

- 核心贡献：综述 87 篇 computer-use agent 论文和 33 个数据集，从 domain、interaction、agent 三个视角建立 ACU taxonomy，并总结通向真实可用通用计算机代理的关键研究缺口。

  &gt;  ACU taxonomy：研究者用来描述和比较 AI 如何像人一样使用电脑完成任务的分类体系

- 期刊/日期：JAIR, 2026

## Q1. 研究动机

Agents for Computer Use 能用自然语言指令控制电脑、手机和网页完成复杂任务，但研究仍分散在 Web、Android、PC、RL、foundation model agent 等方向。作者希望系统整理该领域的基础、趋势、数据集和未解决挑战。

## Q2. 核心问题

论文关注的是：如何定义和组织 ACU 研究，使不同环境、交互模态和 agent 设计能够在统一框架下比较，并据此识别当前系统距离真实通用计算机使用的差距。

## Q3. 现有不足 &amp; 本文改进

已有工作常按具体平台或方法孤立讨论，例如 Web agent、mobile agent、RL-based GUI agent 或 foundation model agent，缺少跨平台统一视角。

本文改进是建立三维 taxonomy：

- domain perspective：描述 Web/Android/PC 等状态空间；

- interaction perspective：描述观察和动作模态；

- agent perspective：描述策略、预训练/适配、记忆和学习机制。


## Q4. 方法流程

* 界定 ACU：agent 根据自然语言目标，通过鼠标、键盘、触屏手势或代码执行等低层动作控制数字设备。

* 作者收集并分析 87 篇 ACU papers 和 33 个 datasets，从 domain、interaction、agent 三个视角归类。

  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716101905809.png)

* 根据文献趋势和 benchmark 状态，总结 foundation model 时代 ACU 的转变、评测问题和未来方向。

## Q5. 实验设计与结论

- 领域分类：**domain perspective** 将 ACU 环境按 Web、Android、PC 和状态空间差异组织。说明不同平台的可观测性、动作空间和环境可重置性不同。

- 交互分类：**interaction perspective** 覆盖 screenshot、HTML、accessibility tree 等 observation modalities，以及 mouse、keyboard、touch gesture、code execution 等 action modalities。

- agent 分类：**agent perspective** 讨论 policy、pre-training/adaptation、memory/learning 等机制，解释从早期专用/RL 系统到 foundation-model agents 的转变。

- 趋势分析：Figure 2 显示 ChatGPT 后研究重心从 specialized/RL-focused agents 明显转向 foundation-model-based agents。

  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260716102659485.png)

- 研究缺口：论文总结 generalization 不足、learning 效率低、planning 能力有限、benchmark 任务复杂度偏低、评测不标准、研究假设与真实条件脱节等六类问题。

## Q6. 局限性

- 作为 survey，论文主要综合已有研究，没有直接给出统一实证 benchmark 的新评测结果。
- ACU 领域快速发展，taxonomy 只能代表收集时点的研究格局。

- 87 篇论文和 33 个数据集覆盖面较广，但不同平台 benchmark 差异大，横向可比性仍有限。

## Q7. 学术价值

- 理论价值：把 computer-use agent 明确为跨 Web、移动和桌面环境的统一研究对象。
- 方法价值：domain-interaction-agent 三维 taxonomy 可用于分析新 ACU 系统的覆盖范围和短板。
- 应用价值：为个人电脑助手、移动助手、浏览器代理和企业桌面自动化评测提供研究地图。

## Q8. 延伸研究方向

1. 建立跨 Web、Android 和 PC 的统一任务与评测协议。
2. 设计能衡量长期 planning、错误恢复和安全边界的 ACU benchmark。
3. 研究 foundation model agent 在真实动态环境中的持续学习和记忆更新。
4. 缩小研究假设与真实用户环境之间的差距，例如登录、权限、隐私、广告和不可逆动作。
5. 制定标准化指标，覆盖成功率、过程质量、成本、安全和用户价值对齐。

## Q9. 反直觉发现与方法失效分析

- Figure 2 显示 ChatGPT 后 foundation model agents 快速成为主流，但论文同时指出 planning、generalization 和 real-world assumptions 仍是核心缺口；这说明模型能力提升没有自动解决 ACU 的环境复杂性。
- 六类 gap 中包括 benchmark 任务复杂度偏低和评测不标准，这意味着当前高分 ACU 系统可能在真实电脑使用中退化。
- interaction taxonomy 暗示不同 observation/action 模态不可直接比较，例如 HTML-rich Web agent 和 screenshot-only mobile agent 的信息可得性差异很大；作者没有把所有 agent 放到单一排行榜中。
- 整体评价：该 survey 的价值在高层框架和问题地图；由于没有新实验，结论可信度来自文献覆盖和分类一致性，而不是数值优势。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-a-comprehensive-survey-of-agents-for-computer-use-foundations-challenges-and-future-directions/  

