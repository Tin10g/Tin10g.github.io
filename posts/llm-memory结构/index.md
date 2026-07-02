# 


## &lt;state, action, reward&gt; 轨迹

&gt; 参考论文：[Li Y, Lin Z, Deng A, et al. Just-In-Time Reinforcement Learning: Continual Learning in LLM Agents Without Gradient Updates[J]. arXiv preprint arXiv:2601.18510, 2026.]()

最接近强化学习的 memory。

下一次遇到类似 state 时，agent 可以参考过去哪些 action 成功、哪些失败。

* state: 当时看到什么
* action: 当时做了什么
* reward: 结果好不好

适合：Web agent、游戏 agent、工具调用 agent、需要明确 success/failure signal 的任务。

## 自然语言 reflection

&gt; 参考论文：Shinn N, Cassano F, Gopinath A, et al. Reflexion: Language agents with verbal reinforcement learning[J]. Advances in neural information processing systems, 2023, 36: 8634-8652.

不直接存原始轨迹，而是存 agent 对经验的总结。

像“经验教训”，会影响 agent 后续 reasoning 和 planning。

适合：没有明确 reward、但可以从失败中总结规则的任务，比如代码生成、问答、多步推理。

## skill library

&gt; 参考论文：Wang G, Xie Y, Jiang Y, et al. Voyager: An open-ended embodied agent with large language models[J]. arXiv preprint arXiv:2305.16291, 2023.

## 完整经验流 &#43; reflection &#43; planning

&gt; 参考论文：Park J S, O&#39;Brien J, Cai C J, et al. Generative agents: Interactive simulacra of human behavior[C]//Proceedings of the 36th annual acm symposium on user interface software and technology. 2023: 1-22.

## 经验抽象 / lessons learned

&gt; 参考论文：Zhao A, Huang D, Xu Q, et al. Expel: Llm agents are experiential learners[C]//Proceedings of the AAAI Conference on Artificial Intelligence. 2024, 38(17): 19632-19642.

## policy-level reflection

&gt; 参考论文：Zhang W, Tang K, Wu H, et al. Agent-pro: Learning to evolve via policy-level reflection and optimization[C]//Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers). 2024: 5348-5375.

## 失败案例 / debugging memory

&gt; 参考论文：Packer C, Fang V, Patil S G, et al. MemGPT: towards LLMs as operating systems[J]. 2023.

## 用户偏好 memory

&gt; 参考论文：Zhong W, Guo L, Gao Q, et al. Memorybank: Enhancing large language models with long-term memory[C]//Proceedings of the AAAI conference on artificial intelligence. 2024, 38(17): 19724-19731.

## 分层可控 memory

&gt; 参考论文：

## 隐式用户偏好 / agentic memory

&gt; 参考论文：

## 用户偏好向量 &#43; retrieval bias

&gt; 参考论文：


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/llm-memory%E7%BB%93%E6%9E%84/  

