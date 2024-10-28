# 机器学习 · 特征工程


# 特征工程
## 为什么需要
数据和特征决定了机器学习的上限，模型和算法知识逼近这个上限。

## 是什么
用专业背景知识和技巧处理数据，使特征能在机器学习算法上发挥更好的作用。

## 特征工程的位置与数据比较
* sklearn: 对于特征的处理提供强大的接口
* pandas: 一个数据读取非常方便以及基本的处理格式的工具

## 特征工程基本类型
### 特征抽取（提取）
1. 讲任意数据转换为可用于机器学习的数字特征
&gt; 特征值化为例计算机理解数据
* 字典特征提取：特征离散化
* 文本特征提取
* 图像特征提取

2. 使用
```
sklean.feature_extraction
```
   1. 字典特征提取
   &gt; 类别 -&gt; one-hot编码  
   &gt; sparse矩阵--稀疏矩阵
   * ```DictVectorizer.inverse_transform(X)```：array数组或者sparse矩阵，返回转换之前的数据格式
   * ```DictVectorizer.fit_transform(X)```：字典或者包含字典的迭代器放回置，返回sparse矩阵
   * ```DictVectorizer.get_feature_names()```：返回类名
```
def dict_demo():
    &#34;&#34;&#34;
    字典特征提取
    :return:
    &#34;&#34;&#34;
    data = [{&#39;city&#39;: &#39;北京&#39;, &#39;temperrature&#39;:100}, {&#39;city&#39;: &#39;上海&#39;, &#39;temperrature&#39;: 60}, {&#39;city&#39;: &#39;深圳&#39;, &#39;temperrature&#39;:30}]
    # 实例化一个转换类器
    # Ture返回sparse矩阵
    transfer = DictVectorizer(sparse=False)
    # 调用fit_transform()
    data_new = transfer.fit_transform(data)
    print(&#34;data_new:\n&#34;, data_new)
    print(&#34;feature_name:\n&#34;, transfer.get_feature_names_out())

    return None
```

### 文本特征提取
1. 单词作为特征
2. ```sklearn.feature_extraction.text.CountVertorizer(stop_words=[])```
&gt; 返回词频矩阵
&gt; 中文会把一个句子、短语作为一个特征，需要划分短语【工具】
```
def text_demo():
    &#34;&#34;&#34;
    文本特征提取
    :return:
    &#34;&#34;&#34;
    data = [&#34;life is short, i like like python&#34;, &#34;life is long, i like like python&#34;]

    # 实例化一个转换器
    transfer = CountVectorizer()
    # 调用函数
    data_new = transfer.fit_transform(data)
    data_new1 = data_new.toarray()
    print(&#34;data_new:\n&#34;, data_new)
    print(&#34;data_new:\n&#34;, data_new1)
    print(&#34;特征:\n&#34;, transfer.get_feature_names_out())

    return None
```
3. 中文文本特征提取
   &gt; 自动划分中文工具--jieba.cut
```
def text_Chinese_demo():
    &#34;&#34;&#34;
    中文文本特征提取（加入自动划分短语）
    :return:
    &#34;&#34;&#34;
    data = [&#34;努力了，就没有后悔。谋事在人，成事在天。只要自己努力了，没有错过你面前的每一个机会，你就对得起自己。&#34;, &#34;即使失败也无怨无悔。&#34;, &#34;人生重在态度，重在过程，结果都是次要的&#34;]
    # 实例化一个转换器
    transfer = CountVectorizer()
    # 自动分词
    data_1 = []
    for sentence in data:
        data_1.append(cut_word(sentence))
    # 调用函数
    data_new = transfer.fit_transform(data_1)
    print(&#34;data_new:\n&#34;, data_new)
    print(&#34;特征:\n&#34;, transfer.get_feature_names_out())

    return None

def cut_word(text):
    &#34;&#34;&#34;
    中文分词
    :param text:
    :return:
    &#34;&#34;&#34;
    text_new = jieba.cut(text)
    # print(text_new)
    # 强转
    text_new = &#34; &#34;.join(list(text_new))
    # print(text_new)
    return text
```
3. Tf-idf文本特征提取
   * TF-IDF -- 重要程度 -- 某个词或短语在一篇文章中出现的概率高而且在其他文章中出现少
   * TF -- 词频 -- 以总文件数目除以保护该词语的文件数目  
   找某类文章中出现最多的词语，同时在别的文章中出现少（关键词）
   ```
    def tfidf_demo():
    &#34;&#34;&#34;
    TF-IDF进行关键词提取
    :return:
    &#34;&#34;&#34;
    data = [&#34;努力了，就没有后悔，努力了。&#34;, &#34;谋事在人，成事在天。&#34;, &#34;只要自己努力了，没有错过你面前的每一个机会，&#34;, &#34;你就对得起自己。&#34;,
            &#34;即使失败也无怨无悔。&#34;, &#34;人生重在态度，重在过程，结果都是次要的&#34;]
    # 实例化一个转换器
    transfer = TfidfVectorizer()
    # 自动分词
    data_1 = []
    for sentence in data:
        data_1.append(cut_word(sentence))
    # 调用函数
    data_new = transfer.fit_transform(data_1)
    print(&#34;data_new:\n&#34;, data_new)
    print(&#34;data_new:\n&#34;, data_new.toarray())
    print(&#34;特征:\n&#34;, transfer.get_feature_names_out())
   
    return None
   
   ```

## 特征工程预处理
通过一些转换函数，将特征数据转换成更加适合算法模型的特征数据过程

### 方法
数值型数据的无量纲化
&gt; 量纲不统一会导致计算中某一特征数据影响过大
* 归一化
* 标准化
&gt; 一般使用标准化，由于异常值对总体影响较小

### 为什么
特征单位或者大小相差较大或者某特征的方差相比其它的特征要打出几个数量级，容易影响目标结果，使算法无法学习到其它特征

### 归一化
1. 通过对原始数据进行变换把数据映射到某一段数据之间（默认[0,1]）
2. 原理  
$$X&#39; = \frac{x - \text{min}}{\text{max} - \text{min}}$$  
$$X&#39;&#39; = X&#39; * (\text{mx} - \text{mi}) &#43; \text{mi}$$  
3. 使用
   ```
   sklearn.preprocessing.MinMaxScaler(feature_rang=(0,1)...)
   MinMaxScalar.fit_transform(X)
   # X格式numpy_array格式的数据
   # 返回array
   ```
   ```
   def minmax_demo():
    &#34;&#34;&#34;
    归一化处理
    :return:
    &#34;&#34;&#34;
    # 获取数据
    data = pd.read_csv(&#34;data1.txt&#34;)
    data = data.iloc[:, :3]
    # print(data)
    # 实例化转换器类
    transfer = MinMaxScaler(feature_range=(2,3))
    #  使用
    data_new = transfer.fit_transform(data)
    print(&#34;data_new:\n&#34;, data_new)
   
    return None
   ```
4. 缺点  
   如果异常值为最大值和最小值，会影响结构。  
   &gt; 归一化鲁棒性较差，知识和传统精确小数据场景

### 标准化
1. 定义  
   通过对原始数据进行变换把数据变换到均值为0，标准差为1范围内。
2. 公式
   $$X&#39; = \frac{x - \text{mean}}{\delta}$$
   &gt; mean为平均值，$\delta$为标准差
3. 对标准化来说，少量的异常点对整体影响小
4. 使用
   ```
   sklearn.processiong.StamdardSclaer
   ```
   ```
   def stand_demo():
    &#34;&#34;&#34;
    标准化处理
    :return:
    &#34;&#34;&#34;
    # 获取数据
    data = pd.read_csv(&#34;data1.txt&#34;)
    data = data.iloc[:, :3]
    # 实例化转换器
    transfer = StandardScaler()
    # 使用
    data_new = transfer.fit_transform(data)
    print(&#34;data_new:\n&#34;, data_new)
    return None
   ```

## 特征降维
|  维数   | 嵌套层数  |
|  ----  | ----  |
| 0维  | 标量 |
| 1维  | 向量 |
| 2维  | 矩阵 |
| n维  |  |

1. 定义
   * 对象：二维数组  
   * 要求：降低特征（变量）的个数  
   * 结果：特征和特征不相关
&gt; 为了减少冗余信息

2. 方法
   * 特征选择
   * 主成分分析 

### 特征选择
1. 定义  
   从数据中包含的冗余的相关变量中找出主要特征。
2. 方法
   * Filter过滤式
     * 方差选择法：低方差特征过滤
     * 相关系数：特征与特征的相关程度
   * Embedded嵌入式
     * 决策树：信息熵、信息增益
     * 正则化：L1、L2
     * 深度学习：卷积
3. 模块
   ```
   sklearn.feature_selection
   ```
4. 低方差特征过滤
   * 特征方差小：某个特征大多样本的值比较相近
   * 特征方差大：某个特征大多样本的值有差别
   1. API
   ```
   sklearn.feature_selection.VaroamceThreshold(threshold=0.0)
   ```
5. 相关系数  
   皮尔森相关系数r
   &gt; 当-1&lt;= r &lt;=1，有以下规律
   * 当 r&gt;0 两变量正相关，反之 r&lt;0 负相关
   * 当 |r|=1 两变量完全相关；当r=0，两 变量无相关关系
   * 当 0&lt;|r|&lt;1 表示两变量存在一定程度的相关，而且 |r| 越接近0，相关越弱
   * 一般三级划分：|r|&lt;0.4低度相关，0.4&lt;=|r|&lt;0.7显著性相关，0.7&lt;=|r|&lt;1为高度相关
   
   1. API
   ```
   from scipy.stats import pearsonr
   ```
   
### 主成分分析
1. 定义
   将高维数据转换为低维数据过程，可能会舍弃原有的数据，创造新的变量
2. 作用
   数据维数压缩，尽可能降低原数据的维数（复杂度），损失少量信息。
3. 应用
   回归分析或者聚类分析

&gt; 三维物体只选择最明显体现物体特征的拍为的二维图片

4. 模块
   ```
   sklearn.decomposition.PCA(n_components=None)
   ```
   * 将数据分解为低维空间
   * n_components=None：小数-保留百分之多少信息；整数-减少多少特征
   * ```PCA.fit_transform(X) X: numpy array格式的数据```
5. 代码
```
def pca_demo():
    &#34;&#34;&#34;
    PCA降维
    :return:
    &#34;&#34;&#34;
    data = [[2,8,4,5], [6,3,0,8], [5,4,9,1]]

    # 调用转换器类
    transformers = PCA(n_components=0.95)

    # 调用fit_transform
    data_new = transformers.fit_transform(data)

    print(data_new)

    return None
```
## 案例：探究用户对武平类别的喜好分类降维
* 对象：物品类别和用户的关系 =&gt; user_id和aisle的关系
&gt; 需要将user_id和aisle放到同一个表中 - 合并   
&gt; 找二者的关系 - 交叉表和透视表  
&gt; 特征冗余过多 - PCA降维
* 数据信息
  * order_products_prior.csv 订单与商品信息
    * order_id
    * product_id
    * add_to_cart_order
    * departmentt_id
  * products.csv 商品信息
    * product_id
    * product_name
    * aisle_id
    * department_id
  * orders.csv 用户订单信息
    * product_id
    * product_name
    * aisle_id
    * department_id
  * aisles.csv 商品所属具体物品的类别
    * aisles_id
    * aisle

```
# 获取数据
# 合并表
# 找到user_id和aisel的关系
# PCA降维

import pandas as pd
from sklearn import PCA

# 获取数据
order_products = pd.read_csv(&#34;/order_product_prior.csv&#34;)
products = pd.read_csv(&#34;/products.csv&#34;)
orders = pd.read_csv(&#34;/orders.csv&#34;)
aisles = pd.read_csv(&#34;/aisles.csv&#34;)

# 合并表
# 按索引合并
# order_products_prior.csv 订单与商品信息
    # 字段 order_id,product_id,add_to_cart_order,department_id
# products.csv 商品信息
    # 字段 product_id,product_name,aisle_id,department_id
# orders.csv 用户订单信息
    # 字段 product_id,product_name,aisle_id,department_id
# aisles.csv 商品所属具体物品的类别
    # 字段 aisles_id,aisle
# 合并ailses和products
tab1 = pd.merge(aisles, products, on=[&#34;aisle_id&#34;, &#34;aisle_id&#34;])
# 合并tab1和order_products_prior
tab2 = pd.merge(tab1, order_products, on=[&#34;product_id&#34;, &#34;product_id&#34;])
# 合并tab2和orders
tab3 = pd.merge(tab2, orders, on=[&#34;order_id&#34;, &#34;order_id&#34;])

# 找到user_id和aisel的关系
# 交叉表和透视表
table = pd.crostab(tab3[&#34;user-id&#34;], tab3[&#34;aisle&#34;])

# PCA降维
# 实例化
transfer = PCA(n_components = 0.95)
# 调用fit_transfer
data= transfer.fit_transform(table)
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0_3/  

