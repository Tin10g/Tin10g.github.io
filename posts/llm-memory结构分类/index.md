# LLM · Memory结构分类


## Raw trajectory memory

### &lt;state, action, reward&gt; 轨迹

&gt; 参考论文：[Li Y, Lin Z, Deng A, et al. Just-In-Time Reinforcement Learning: Continual Learning in LLM Agents Without Gradient Updates[J]. arXiv preprint arXiv:2601.18510, 2026.](https://tin10g.github.io/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-when-to-forget-a-memory-governance-primitive/)

最接近强化学习的 memory。

下一次遇到类似 state 时，agent 可以参考过去哪些 action 成功、哪些失败。

* state: 当时看到什么
* action: 当时做了什么
* reward: 结果好不好

适合：Web agent、游戏 agent、工具调用 agent、需要明确 success/failure signal 的任务。

## Verbal reflection memory

### 自然语言 reflection

&gt; 参考论文：Shinn N, Cassano F, Gopinath A, et al. Reflexion: Language agents with verbal reinforcement learning[J]. Advances in neural information processing systems, 2023, 36: 8634-8652.

不直接存原始轨迹，而是存 agent 对经验的总结。

像“经验教训”，会影响 agent 后续 reasoning 和 planning。

适合：没有明确 reward、但可以从失败中总结规则的任务，比如代码生成、问答、多步推理。

### 经验抽象 / lessons learned

&gt; 参考论文：Zhao A, Huang D, Xu Q, et al. Expel: Llm agents are experiential learners[C]//Proceedings of the AAAI Conference on Artificial Intelligence. 2024, 38(17): 19632-19642.

## Executable skill memory

### skill library

&gt; 参考论文：Wang G, Xie Y, Jiang Y, et al. Voyager: An open-ended embodied agent with large language models[J]. arXiv preprint arXiv:2305.16291, 2023.

memory 存的是可复用技能。agent 不需要每次从零规划，可以直接调用已有 skill。

内容可能是：

- 函数
- 工具调用模板
- 代码片段
- 操作流程
- 子任务策略

适合：Minecraft、机器人、网页自动化、复杂工具链任务。

## Failure/debug memory

### 失败案例 / debugging memory

这种 memory 专门存失败，不只是存“失败了”，而是存失败原因。

这可以帮助 agent 避免重复犯同类错误。

相比reflection memory，debugging memory更强调 error taxonomy 和 root cause。

例如：

- 错误类型: tool misuse
- 失败原因: 调用了 search_flights 但参数 date 为空
- 修复建议: 工具调用前必须检查必填参数

适合：tool-use agent、代码 agent、long-horizon planning agent

## Preference/persona memory

### 用户偏好 memory

&gt; 参考论文：[Packer C, Fang V, Patil S G, et al. MemGPT: towards LLMs as operating systems[J]. 2023.](https://tin10g.github.io/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-memgpttowards-llms-as-operating-systems/)

这种 memory 存的是用户长期偏好，而不是任务环境经验。

可以让 agent 的行为更个性化。

它影响的 policy 是“怎样按这个用户偏好的方式完成任务”。

适合：个人助理、长期对话系统、推荐系统、陪伴型 agent。

## 分层可控 memory / virtual context memory

&gt; 参考论文：Zhong W, Guo L, Gao Q, et al. Memorybank: Enhancing large language models with long-term memory[C]//Proceedings of the AAAI conference on artificial intelligence. 2024, 38(17): 19724-19731.

这种 memory 关注的是“怎么管理大量 memory”。

为了解决 context window 有限的问题：什么该放进 prompt，什么该存在外部，什么时候调回来。

通常分层为：

- 短期 memory: 当前上下文窗口里的内容
- 长期 memory: 外部数据库/向量库
- 核心 memory: 用户身份、长期目标
- 归档 memory: 不常用但可找回的信息

适合：长对话、长文档、多 session agent、复杂项目助理。

## 隐式用户偏好 / agentic memory

&gt; 参考论文：Jiang B, Yuan Y, Shen M, et al. Personamem-v2: Towards personalized intelligence via learning implicit user personas and agentic memory[J]. arXiv preprint arXiv:2512.06688, 2025.

## Memory stream / episodic memory

这类memory存储完整经历流。保留 agent 的长期上下文，之后可以检索、反思、归纳。

适合：长期交互 agent、模拟人类行为的 agent、personal assistant。

相比&lt;state, action, reward&gt;，这类记忆不一定有 reward，也不一定结构化，更接近日记。

## policy-level reflection

&gt; 参考论文：Zhang W, Tang K, Wu H, et al. Agent-pro: Learning to evolve via policy-level reflection and optimization[C]//Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers). 2024: 5348-5375.

## 混合类的memory（Hybrid memory）

实际 agent 往往不是只用一种 memory，而是混合结构。

不同 memory 服务不同决策层次。

### 完整经验流 &#43; reflection &#43; planning

&gt; 参考论文：[Park J S, O&#39;Brien J, Cai C J, et al. Generative agents: Interactive simulacra of human behavior[C]//Proceedings of the 36th annual acm symposium on user interface software and technology. 2023: 1-22.](https://tin10g.github.io/posts/%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB-generative-agentsinteractive-simulacra-of-human-behavior/)

### 用户偏好向量 &#43; retrieval bias

&gt; 参考论文：Hao Y, Mehri S, Zhai C X, et al. User preference modeling for conversational llm agents: Weak rewards from retrieval-augmented interaction[J]. arXiv preprint arXiv:2603.20939, 2026.


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/llm-memory%E7%BB%93%E6%9E%84%E5%88%86%E7%B1%BB/  

