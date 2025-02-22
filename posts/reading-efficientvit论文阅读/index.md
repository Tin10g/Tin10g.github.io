# EfficientViT-SAM Accelerated Segment Anything Model Without Accuracy Loss


# 🍓Abstratct

## 翻译

我们提出了 EfficientViT-SAM，这是一系列新的加速分割任何模型。

我们保留了 SAM 的轻量级快速编码器和掩码解码器，同时用 EfficientViT 替换了重度图像编码器。

对于训练，我们从 SAM-ViTH 图像编码器到 EfficientViT 的知识提炼开始。随后，我们对 SA-1B 数据集进行端到端训练。

得益于EfficientViT 的效率和容量，EfficientViT-SAM 在 A100 GPU 上实现了 48.9 倍的 TensorRT 加速，而性能却没有受到影响。

## 知识补充

* TensorRT 加速

  * 一种高性能深度学习推理库，用于加速深度学习模型在GPU上的推理速度。
  * 对于需要高性能推理的应用很有效

* SAM (Segment Anything Model)

  * 由 Meta（前身为 Facebook）推出的一种基于计算机视觉的图像分割模型。
  * 核心创新点是遇对任意物体分割：适应各种图像、图形、文本。能够在各种场景下进行高效的零-shot图像分割。

*  SAM-ViTH 图像编码器

  * ViT

    Vision Transformer 是一种用于计算机视觉任务的模型架构，它使用 Transformer 模型来处理图像。

    ViT 将图像拆分为多个固定大小的块（patches），然后使用 Transformer 进行处理。这使得 ViT 在处理大规模图像和复杂模式时能够更好地捕捉全局上下文信息。

  * SAM-ViTH 

    将 ViT 结构应用于图像分割任务，使得模型能够高效地对图像进行编码，捕捉图像的全局和局部特征，从而实现更准确的分割。

  * SAM-ViTH 图像编码器 · 特点

    * 能够捕捉到图像中的全局结构和细节信息。
    * ViT在处理大尺寸图像时能够更好的利用全局信息，**对于复杂场景和物体效果较好**。
    * 是一个类似SAM的zero-shot学习模型

  ## 精读

* 知识蒸馏

  使用 SAM-ViTH 图像编码器 对 EfficientViT 编码器进行知识蒸馏，从而将其高效特性引入到新的图像编码器中

* 端到端训练

  模型在 SA-1B 数据集 上进行端到端训练，以确保能够从零开始学习最优的表示

* 结果

  相比 SAM-ViT-H 提供了 48.9倍的速度提升，而不牺牲性能。

# 🍓 Introduction

## 翻译

任意分割模型 (SAM) 是一系列图像分割模型，在包含 11M 张图像和 1B 个掩码的高质量数据集上进行预训练。SAM 提供令人惊叹的零样本图像分割性能，并且具有许多应用，包括 AR/VR、数据注释、交互式图像编辑等。

尽管性能强大，但 SAM 计算量很大，限制了其在时间敏感场景中的适用性。特别是，SAM 的主要计算瓶颈是其图像编码器，在推理时每幅图像需要 2973 个 GMAC。为了加速 SAM，人们做出了许多努力，用轻量级模型取代 SAM 的图像编码器。例如，MobileSAM将 SAM 的 ViT-H 模型的知识提炼成一个微型视觉转换器。 EdgeSAM 训练纯 CNN 模型来模拟 ViT-H，采用细致的蒸馏策略，并在过程中引入了提示编码器和掩码解码器。EfficientSAM利用 MAE 预训练方法来提高性能。

虽然这些方法降低了计算成本，但它们都遭受了显著的性能下降（图 1）。本研究引入了 EfficientViT-SAM 来解决这一限制，利用 EfficientViT  替换 SAM 的图像编码器。同时，我们保留了 SAM 的轻量级提示编码器和掩码解码器架构。我们的训练过程包括两个阶段。首先，我们使用 SAM 的图像编码器作为老师来训练 EfficientViT-SAM 的图像编码器。其次，我们在整个 SA-1B 数据集 上端到端训练 EfficientViTSAM。

我们在一系列零样本基准上对 EfficientViT-SAM 进行了全面评估，包括点提示分割、框提示分割和野外分割。与所有以前的 SAM 模型相比，EfficientViT-SAM 提供了显着的性能/效率提升。特别是在 COCO 数据集上，与 SAM-ViT-H相比，EfficientViT-SAM 在 A100 GPU 上实现了 48.9 倍的吞吐量，且没有 mAP 下降。





---

> Author: [Ting](Tin10g.github.io)  
> URL: https://Tin10g.github.io/posts/reading-efficientvit%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB/  

