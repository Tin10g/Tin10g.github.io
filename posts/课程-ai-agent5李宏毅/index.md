# AI Agent· 第五讲 多张GPU训练大语言模型


## 常规Pytorch训练

``````
for epoch in range(num_epochs):
    for batch in dataloader:
        inputs, targets = batch
        outputs = model(inputs)
        loss = loss_fn(outputs, targets)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
``````

## LLM训练

![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701102054226.png)

* activations：模型某一层对于input的输出

* batch size：通常1个batch要有4-60M

* gradiaent accumulation：

  把batch size分为若干个mini batch size（GPU一次可以装的下的forward backward的大小），然后每一次loss保留，要保留gradient accumulation轮，接着把这些一起拿到global model里面backward

  global batch size = mini batch size * gradient accumulation

### 需要的内存

随着context增长指数级增长

&lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701103912874.png&#34; style=&#34;zoom:50%;&#34; /&gt;

### 多GPU训练问题

* 多张gpu一起跑：按照每张GPU大小切片除了inputs以外的内容。

  * DeepSpeed - Zero Redundancy Optimizer（ZeRO）

    &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701104737956.png&#34; style=&#34;zoom:50%;&#34; /&gt;

    * ZeRO-1：切片最大的optimizer

      ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701104343076.png)

    * Zero-2：切片第二大的

      ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701104513410.png)

    * Zero-3：所有的部分都要切片

      ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701104648265.png)

    * Zero-offload：一部分工作转移到CPU上 

      optimizer offload &amp; optimizer offload&#43;model offload

  ### 长上下文（128K以上）问题

  1. Kernel（跑在GPU上面的方式）

     &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701105544675.png&#34; style=&#34;zoom:50%;&#34; /&gt;

     * 效果

       &lt;img src=&#34;C:\Users\Tin10g\AppData\Roaming\Typora\typora-user-images\image-20260701110256560.png&#34; alt=&#34;image-20260701110256560&#34; style=&#34;zoom:50%;&#34; /&gt;

  2. Flash Attention

     * 速度

       &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701110025264.png&#34; style=&#34;zoom:50%;&#34; /&gt;

     * Fused Kernel：把原来多个 GPU 计算步骤合并成一个 GPU kernel 一次性执行。

       &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701110116937.png&#34; style=&#34;zoom:50%;&#34; /&gt;

     * 记忆

       通过把大部分计算放到CPU上面，需要的时候调回的时候GPU来加快训练速度

       &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701110205476.png&#34; style=&#34;zoom:50%;&#34; /&gt;

  3. Liger Kernel

     * 用Triton code替换模型的一些部分来优化原本计算的所以对于

       &gt; Triton 是 OpenAI 开源的一个 GPU 编程工具。

     * 使用方法

       &lt;img src=&#34;https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701111513902.png&#34; style=&#34;zoom:50%;&#34; /&gt;

     * 结果

       ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701111538318.png)

  ### Quantization

  1. 压缩大小

     ![](https://raw.githubusercontent.com/Tin10g/PictureBed/main/20260701112332065.png)

     * GGML family
     * GPTQ
     * AWQ
     * BitsAndBytes


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:8533/posts/%E8%AF%BE%E7%A8%8B-ai-agent5%E6%9D%8E%E5%AE%8F%E6%AF%85/  

