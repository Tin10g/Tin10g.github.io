# 论文 · Memory综述


## 基础信息

* 会议/期刊：arXiv preprint, 2026
* 关键词：memory governance, selective forgetting, retrieval, conditional success probability, Bayesian update

核心贡献：本文首次系统综述 LLM-based agents 的 memory mechanism，给出狭义/广义 memory 定义，并从 memory sources、memory forms、memory operations、evaluation 和 applications 已有研究。

### Q1. 研究动机

LLM-based agents 要在环境中长期交互、自我演化并处理复杂任务，必须积累经验、保留上下文、利用外部知识。已有研究提出了很多 memory module，但散落在不同论文中，缺乏统一定义、分类和评估框架。作者希望抽象出可复用的设计模式。

### Q2. 核心问题

本文围绕三个问题展开：

- What is memory in LLM-based agents?
- Why do agents need memory?
- How should memory be designed and evaluated?

核心是给 agent memory 建立概念边界、设计空间和评估框架。

### Q3. 现有方法不足与本文改进

作者指出，已有 LLM 或 agent 综述通常关注模型训练、对齐、规划、工具使用、多智能体、应用等，但 memory mechanism 作为 agent 自我演化的基础组件仍缺乏系统梳理。

本文改进点：

- 正式区分狭义 memory 和广义 memory。
- 把 memory **设计**拆成 source、form、operation 三个维度。
- 把 memory **评估**拆成 direct evaluation 和 indirect evaluation。
- 将 memory-enhanced agents 的**应用**分成角色扮演/社会模拟、个人助理、开放世界游戏、代码生成、推荐、医疗、金融、科学等场景。

### Q4. 方法/框架流程

作者认为 agent-environment interaction 中有三个阶段：

1. agent 感知环境，并把信息写入 memory；
2. agent 处理已有 memory，使其更可用；
3. agent 读取 memory，支持下一步行动。

对应到 memory operations：

- Memory writing：把原始观察、动作、反馈投影为可存储内容。可以存原始信息，也可以存摘要、关系、代码、轨迹或结构化条目。
- Memory management：处理 memory，包括 merging、reflection、forgetting。目标是减少冗余、抽象高层经验、遗忘无关或过时信息。
- Memory reading：从 memory 中取出与当前上下文相关的信息。常见实现是向量检索、SQL、树/图结构检索、相似轨迹召回，也可以是参数化 memory 的隐式读取。

作者还区分两种 memory 定义：

- 狭义 memory：只来自同一个 trial 的历史信息，可理解为任务内部短期上下文。
- 广义 memory：包括同 trial 历史、跨 trial 经验和外部知识，可支持长期经验积累与自我演化。

### Q5. 证据组织与结论支撑

- Figure 4：trial/step 与 memory 操作示意
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706091700430.png)

  - 目的：说明 agent 通过多步 trial 与环境交互，memory writing/management/reading 如何贯穿其中。
  - 结论：memory 不是简单聊天历史，而是驱动下一步行动的中间状态。
  
- Table 1：Memory Sources
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706092006124.png)

  - 目的：比较各模型是否使用 inside-trial information、cross-trial information、external knowledge。
  - 结论：inside-trial information 最常见；cross-trial information 和 external knowledge 是把 agent 从短期上下文推进到长期学习/工具增强的关键。
  
- Table 2：Memory Forms
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706092053013.png)

  - 目的：比较 textual form 和 parametric form 的实现方式。
  - 结论：文本 memory 是主流，常见形式包括 complete、recent、retrieved、external；parametric memory 包括 fine-tuning 和 editing，但目前覆盖较少。
  
- Table 3：Memory Operations
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706092227769.png)

  - 目的：比较模型是否有 writing、management、reading，以及 management 中的 merging、reflection、forgetting。
  - 结论：writing/reading 基本是 memory 系统核心；management 尤其 forgetting 和 reflection 的设计还不均衡。
  
- Figure 6：Memory Evaluation
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706092324372.png)

  - 目的：把 memory 评估分为直接评估和间接评估。
  
  - 结论：memory 既可作为独立模块评估，也可通过 agent 任务成功率间接验证。
  
    &gt;Coherence（一致性/连贯性）：记忆是否前后一致？有没有自相矛盾？
    &gt;
    &gt;Rationality（合理性）：记忆是否符合常识、任务逻辑、用户意图？是不是该记的东西？
  
- Table 4：Memory-enhanced Agent Applications
  
  ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260706092614436.png)
  
  - 目的：列举 memory 在角色扮演、社会模拟、个人助理、开放世界游戏、代码生成、推荐、医疗、金融、科学等领域的代表系统。
  - 结论：不同应用需要不同 memory：个人助理偏用户事实和偏好，游戏偏经验和技能，专家系统偏领域知识，社会模拟偏角色一致性和人类记忆机制。

### Q6. 局限性

作者在 Section 8 明确提出未来方向，也可视为当前局限：

- Parametric memory 不成熟：文本 memory 可解释、易编辑，但效率低；参数化 memory 信息密度高、读取效率好，但写入成本、可信性、可解释性仍是挑战。
- Multi-agent memory 问题不足：多智能体中需要 memory synchronization、communication memory、shared/private memory 权衡，尤其 federated setting 下涉及隐私与实时同步。
- Lifelong learning 仍困难：长期 memory 会带来时间性、记忆重叠、海量存储、检索和遗忘问题。
- Humanoid agent memory 需要更贴近人类认知：包括遗忘、记忆扭曲、知识边界等。
- Structured memory 仍处早期：图、树、代码结构各有优势，但如何动态选择、更新和归纳规则仍未解决。

分析归纳：

- 文章更擅长建立 taxonomy（分类框架），对各 memory 方法的统一量化比较仍不足。
- 对隐私、安全、数据治理虽然有所提及，但还没有深入展开 memory 泄露、错误记忆固化、恶意 memory injection 等问题。
- Memory 和 RAG 的边界在外部知识、检索式 memory 处高度重叠，文章没有专门把两者统一到一个 agent architecture 里讨论。

### Q7. 学术价值

- 理论价值：把 agent memory 从“聊天历史/向量库”提升为 agent-environment interaction 中的核心机制。
- 方法价值：source-form-operation 是很好的设计 checklist。构建 agent memory 前，应先问：记什么、怎么表示、如何写入/管理/读取。
- 应用价值：对个人助理、长期对话、游戏 agent、代码 agent、推荐 agent、医疗/金融/科学专家 agent 都有直接设计指导。

### Q8. 延伸研究方向

1. 如何设计可解释、可快速更新的 parametric memory？
2. 多智能体系统中，哪些 memory 应共享，哪些应保持私有？
3. lifelong agent 如何在多年交互中管理时间性、过时信息和遗忘机制？
4. humanoid agent 是否应模拟人类的遗忘、偏差和知识边界，而不是追求全知？
5. memory structure 能否从线性文本库发展为可动态更新的图、树、代码或混合结构？

### Q9. 反直觉发现与方法失效分析

- Table 2：文本 memory 主流，但不一定最高效
  - 现象：多数模型采用 textual form，尤其 retrieved memory；parametric form 使用明显较少。
  - 作者解释：文本 memory 可解释、易写入、易扩展；但每次推理都要把 memory 放进 prompt，带来额外 token 成本。
  - 评价：工程上最容易落地的方案，未必是长期最优方案。

- Section 6.4：complete interaction 表现可强，但依赖长上下文能力
  - 现象：作者提到在 MemDaily 中，包含完整交互信息的方法在一些简单问题上可超过 80% accuracy；但其效果高度依赖 foundation model 的长上下文支持，还会受 lost in the middle 影响。
  - 作者解释：完整上下文保留信息多，但推理成本、位置偏置和截断问题明显。
  - 评价：简单任务中“全塞进去”可能很好用，但长期 agent 场景不能只靠上下文窗口。

- Section 6.4：retrieval-based memory 长期有效但成本随规模增长
  - 现象：作者提到 retrieval-based methods 在 LongMemEval 多数 QA 任务中可达到超过 50% accuracy；但需要建立索引，推理时还要计算匹配分数，额外时间成本会随 memory 数量增长。
  - 作者解释：检索能从大量历史中找相关内容，但索引和召回本身不是免费的。
  - 评价：长期 memory 的默认方案应是 retrieval，但必须配合压缩、分层索引或结构化管理。

- Section 5.2/8.1：parametric memory 读起来高效，写起来困难
  - 现象：parametric memory 不占 prompt 长度，适合大量稳定知识；但 SFT/编辑需要额外训练或参数修改，可能过拟合、灾难性遗忘，也缺乏可解释性。
  - 作者解释：参数化记忆的信息密度高，但文本到参数的高效可靠转化仍是开放问题。
  - 评价：parametric memory 更适合稳定领域知识，不适合频繁变化的用户日常记忆，除非编辑机制足够轻量且可审计。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-memory%E7%BB%BC%E8%BF%B0/  

