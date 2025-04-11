# DEYOLO-Dual-Feature-Enhancement YOLO for Cross-Modality Object Detection


# 😼Abstract
### 翻译

在光照不足的环境下进行物体检测是一项具有挑战性的任务，因为物体通常在 RGB 图像中不清晰可见。由于红外图像提供了补充 RGB 图像的额外清晰边缘信息，因此融合 RGB 和红外图像有可能增强光照不足环境下的检测能力。然而，现有的涉及可见光和红外图像的研究只关注图像融合，而不是物体检测。此外，它们直接融合了两种图像模态，忽略了它们之间的相互干扰。为了融合这两种模态以最大限度地发挥跨模态的优势，我们设计了一个基于双增强的跨模态物体检测网络 DEYOLO，其中设计了语义空间跨模态和新颖的双向解耦焦点模块，以实现以检测为中心的 RGB-红外 (RGB-IR) 相互增强。具体来说，首先提出了双语义增强通道权重分配模块（DECA）和双空间增强像素权重分配模块（DEPA），以聚合特征空间中的跨模态信息，以提高特征表示能力，从而使特征融合可以针对目标检测任务。同时，在DECA和DEPA中都设计了一种双增强机制，包括双模态融合和单模态增强，以减少两种图像模态之间的干扰。然后，开发了一种新颖的双向解耦焦点，以扩大骨干网络在不同方向上的感受野，从而提高了DEYOLO的表示质量。在M3FD和LLVIP上进行的大量实验表明，我们的方法明显优于SOTA目标检测算法。

### 精读


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/reading-deyolo-dual-feature-enhancement-yolo-for-cross-modality-object-detection%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB/  

