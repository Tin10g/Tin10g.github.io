# 论文 · RepairAgent_An_Autonomous_LLM-Based_Agent_for_Program_Repair


## 基础信息

- 标题：RepairAgent: An Autonomous LLM-Based Agent for Program Repair
- 类型：Automated Program Repair / LLM agent
- 核心贡献：提出 RepairAgent，一个基于 GPT-3.5、14 个工具、动态 prompt 和有限状态机控制的自治程序修复 agent，在 Defects4J 和 GitBug-Java 上验证其自动修复能力。

## Q1. 研究动机

传统自动程序修复方法通常依赖预定义模板、搜索策略或专门训练模型，而 LLM 具备理解代码和生成补丁的能力。作者希望探索 LLM 是否能作为自治 agent，通过读取代码、搜索、运行测试和编辑文件完成端到端修复。

## Q2. 核心问题

论文要解决的是：如何让 LLM 不只生成单个补丁，而是在真实项目中自主收集信息、定位缺陷、修改代码、运行测试并判断修复是否完成。

## Q3. 现有不足 &amp; 本文改进

已有 LLM APR 方法多是一次性或迭代式 patch generation，工具使用和状态控制有限。RepairAgent 的改进是提供 14 个可调用工具、动态 prompt memory 和有限状态机，引导 agent 在搜索、编辑、测试、提交之间转换，减少无效动作并支持多行、多文件修复。

## Q4. 方法流程

输入是待修复 bug、项目、测试信息和初始 fault localization。RepairAgent 在每一轮根据当前状态构造 prompt，让 GPT-3.5 选择工具，例如搜索符号、读取文件、编辑代码或运行测试。工具输出被写入交互历史，状态机控制下一步允许的行为。当测试通过或 agent 调用 goal accomplished 命令时停止，输出最终补丁。状态机和记忆机制的动机是限制 LLM 走偏，同时保留足够上下文完成复杂修复。

## Q5. 实验设计与结论

- Defects4J 主实验：Table III 中 RepairAgent 在 835 个 bug 上生成 186 个 plausible fixes，其中 164 个 correct fixes；对比 ChatRepair 162、ITER 57、SelfAPR 110，整体达到相近或更好水平。
- 修复复杂度：Table IV 显示 RepairAgent 修复 115 个 single-line、46 个 multi-line、3 个 multi-file bugs；其中 39 个 bug 未被三个 baseline 修复。
- GitBug-Java 泛化：Table V 中 100 个 bug 上 plausible=19、correct=13；single-line 为 9/19，multi-line 为 4/64，multi-file 为 0/17，说明更复杂新数据集上能力下降。
- 成本与时间：论文报告平均约 270k tokens、约 14 美分/bug，median time 920 秒；99% 时间花在工具执行，主要是测试。
- 消融实验：Table VI 在 100 个 Defects4J bug 上显示默认 RepairAgent correct=21；No search tools correct=11，No state machine=14，Single-cycle memory=6，Realistic localization=16，说明搜索、状态机和多轮记忆均重要。

## Q6. 局限性

作者明确提出：

- GPT-3.5 可能见过部分 Java 项目，存在数据泄漏风险。
- Defects4J 每个 bug 至少有 failing test，真实场景不一定有现成错误暴露测试。
- fault localization 不准确会影响后续修复。
- LLM 输出非确定性，重复运行可能得到不同结果。

以下为分析归纳，非原文明确说明：

- 多文件修复能力较弱，GitBug-Java 上 multi-file 为 0/17。
- 依赖测试作为停止和验证信号，面对 flaky tests 或弱测试套件时可能生成过拟合补丁。

## Q7. 学术价值

- 理论价值：展示 APR 可以从补丁生成问题转向“agentic repair process”问题。
- 方法价值：有限状态机 &#43; 工具集 &#43; 动态记忆为 LLM 代码修复 agent 提供了可复用架构。
- 应用价值：可用于 IDE 修复助手、CI 中自动修复失败测试、开源项目 bug triage 与补丁建议。

## Q8. 延伸研究方向

1. 在无 failing test 或弱测试条件下评估 RepairAgent。
2. 增强多文件、多模块和跨语言修复能力。
3. 把静态分析、动态切片和符号执行加入工具集。
4. 研究 LLM 输出不稳定时的多次运行聚合和补丁选择。
5. 将 fault localization 不确定性显式建模进 agent 策略。

## Q9. 反直觉发现与方法失效分析

- Table III 中 RepairAgent 总正确数 164 只略高于 ChatRepair 的 162，但 Table IV 中 multi-line 修复 46 高于 ChatRepair 的 29，说明优势主要来自复杂修复而不是整体碾压。
- Table V 中 GitBug-Java correct 只有 13/100，且 multi-file 0/17；作者将差距部分归因于 GitBug-Java 更复杂，也用它缓解 Defects4J 数据泄漏担忧。
- Table VI 中 Realistic localization correct=16，低于默认 21，说明理想化 fault localization 对结果有帮助；现实定位误差会显著削弱 agent。
- Table VI 中 No search tools correct=11 且成本 0.28，高于默认行的约 0.16，作者解释缺少搜索会让 agent 读更长代码、prompt 更快饱和。
- 整体评价：RepairAgent 证明自治修复可行，但优势依赖测试、定位和工具设计；在更复杂或缺测试场景中仍是条件性有效。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-repairagent_an_autonomous_llm-based_agent_for_program_repair/  

