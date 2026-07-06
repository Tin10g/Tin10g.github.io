# LLM · Policy


## policy是什么

给定当前上下文，模型下一步“会选择什么输出/动作”的概率分布。

数学写法：`π(a | s)`，即在状态 s 下，选择动作 a 的概率。

### 最底层：token-level policy

LLM 本质上是逐 token 生成文本的模型。

当输入一个问题，模型会去预测下一个token，给所有可能相关的token一个概率，这些概率组成的分布是token-level policy。

`πθ(token_t | prompt, previous_tokens)`

其中：

- `πθ` = 模型参数 `θ` 决定的 policy
- `token_t` = 当前要生成的下一个 token
- `prompt` = 输入上下文
- `previous_tokens` = 已经生成的内容

### 中间层：output-level policy

给定上下文，模型生成某种回答的概率。（输出倾向，什么风格）

但是这个输出倾向的表不是直接被列出的概率分布，而是由从 token 分布组合出来。

`π(response | context)`

### Agent 层：action-level policy

&gt; 这个是强化学习和 LLM agent 论文里常说的 policy。

agent 在当前状态下倾向于做什么动作。

agent在输入后“看到”的是：任务、页面、用户偏好。

依据这几个内容得到policy，也就是发生action的概率分布。

### RL 语境下的 policy

&gt; 类似Agent 层

在强化学习里，policy 是智能体的行为规则。

policy 决定每个动作的概率。

## policy的来源

一般来说LLM 的实际行为 policy是多层叠加的。

```
policy =
base model policy
&#43; instruction tuning
&#43; RLHF / preference training
&#43; system prompt
&#43; user prompt
&#43; memory
&#43; tool rules
&#43; safety constraints
&#43; decoding strategy
```

### base model policy

预训练模型从大量文本中学到的语言分布。

这是最原始的语言建模 policy。

例如：“巴黎是法国的...” 后面大概率是 “首都”

### instruction-tuned policy

指令微调后，模型学会的内容，即什么情况下应该怎么做。

比如：

用户提问 → 应该回答
用户要求步骤 → 应该分步骤
用户要求翻译 → 应该翻译

### RLHF / preference-trained policy

通过人类偏好训练，让模型更倾向于某种“性格”。

### system prompt policy

系统指令会在运行时改变模型行为。这些规则会改变输出分布。

比如：你是一个专业的写论文专家...

### memory-conditioned policy

如果系统把 memory 放进上下文，模型行为也会改变。

依据和这个窗口的问答习惯来改变输出的偏好。

### tool policy

agent 有工具时，policy 还包括是否调用工具。

### decoding policy

通过采样来影响输出。

采样即是：算出“下一个 token 的概率分布”之后，系统要从这些候选 token 里选一个真正输出。

影响采样的参数：

* temperature：控制随机性。低则保守，高则随机变化大发散，0就是总选最高概率的token。
* top-k：只从概率最高的 k 个 token 里采样。
* top-p / nucleus sampling：只从累计概率达到 `p` 的候选里采样。

## safety rules来源

safety rules属于 policy constraint

它们可能存在于不同层。

- 训练中学到的安全行为     → learned policy
- system prompt 中的规则   → runtime policy constraint
- 外部安全分类器           → policy filter
- 解码时屏蔽某些 token     → decoding constraint

## policy和prompt

prompt 是输入上下文。

policy 是模型在这个上下文下产生的行为分布。

关系是：prompt → LLM → policy → output/action

例如:

``````
Prompt A:
“请随便解释一下 RL。”

Prompt B:
“你是强化学习教授，请用数学形式严格解释 RL。”
``````

## policy 和模型参数

模型参数 `θ` 决定基础 policy：

```
πθ(a | s)
```

### fine-tune 模型

需要该参数，则改 `θ`：

```
θ → θ&#39;
πθ → πθ&#39;
```

### 用 memory、prompt、检索、工具控制

不改参数，则：

θ 不变，s 改变，πθ(a | s) 改变


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:8533/posts/llm-policy/  

