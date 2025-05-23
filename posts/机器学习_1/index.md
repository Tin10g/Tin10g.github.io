# 机器学习 · 人工智能与机器学习概述


# 概述与基础知识
## 人工智能、机器学习、深度学习
&gt; 机器学习是人工智能实现的一个途径  
&gt; 深度学习是机器学习的一个方法发展  
人工智能 &gt; 机器学习 &gt; 深度学习
* **人工智能**  
一开始被用于下棋，简单的对后续步骤判断

* **机器学习**  
  统计学习，统计的一些方法实现人工智能。  
  eg. 垃圾邮件过滤

* **深度学习**  
  人工神经网络，进一步的统计与分析

## 机器学习应用场景
* 传统预测
  &gt; 量化投资、广告推荐、SQL语句安全检测分类
* 图像识别
  &gt; 人脸识别、交通标志识别
* 自然语言处理
  &gt; 文本分类、情感分析、自动聊天、文本检测

## 机器学习概述
### 定义  
从**数据**中自动分析**获得模型**，并用模型对未知数据进行**预测**。

### 数据集的构成
* 结构：特征值 &#43; 目标值
&gt; 以房价估计为例

|  | 房子面积 | 房子位置 | 房子楼层 | 房子朝向 | 目标值 |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 数据1 | 80 | 9 | 3 | 0 | 80 |
| 数据2 | 100 | 9 | 5 | 1 | 120 |
| 数据3 | 10 | 3 | 3 | 0 | 100 |

&gt; 每一行数据称为样本  
&gt; 有些数据集可以没有目标值

### 机器学习算法分类
* **监督学习**
  * **有目标值**
  * 分类问题
    * 目标值是一个类属
    &gt; k-临近算法、贝叶斯分类、决策树与随机森林、逻辑回归
  * 回归问题
    * 目标值是连续型数据
    &gt; 线性回归、岭回归
* **无监督学习**
  * **没有目标值**
  &gt; K-means

## 机器学习开发流程
1. 获取数据
2. 数据处理
3. 特征工程
4. 机器学习算法训练 =&gt; 模型
5. 模型评估
6. 应用

## 机器学习库与框架
* 传统框架  
  
* 深度学习框架
  * Pytorch
  * Tensorflow
  * Caffe

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0_1/  

