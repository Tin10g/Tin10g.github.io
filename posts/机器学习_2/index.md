# 机器学习 · 数据集

# 数据集
## 可用数据集
学习阶段使用的数据集
* [sklearn](https://scikit-learn.org/stable/)
  * 数据量小
  * 便于学习
* [Kaggle](https://www.kaggle.com/)
  * 大数据竞赛平台
  * 数据量巨大
  * 真实数据
* [UCI](https://uci.edu/)
  * 收录360个数据集
  * 覆盖科学、生活、经济等

## sklearn
1. 安装  
   在自己的环境里面pip数据集
```
pip install -U scikit-learn
```

2. 包含
   1. 分类、聚类、回归
   2. 特征工程
   3. 模型选择、调优

3. 数据集获取
   * ```sklearn.datasets```
     * 获取小规模数据集 ```load_*```
     &gt; 鸢尾花数据集
     &gt; ```sklearn.datasets.load_iris()```  
     * 获取大规模数据集 ```fetch_*```
     &gt; ```sklearn.datasets.fetch_20newgroups(data_home=None, subset=&#39;train&#39;)```
     &gt; **data_home**：数据集下载存放位置
     &gt; **subset**：加载的数据集，&#39;train&#39;\、&#39;test&#39;、&#39;all&#39;

4. 数据集的返回值
   datasets.base.Baunch(继承自字典)
   * data：特征数据数组
   * target：标签数据组
   * DESCF：数据描述
   * feature_names：特征名（有部分没有）
   * target_names：标签名

5. ```sklearn.model_selection.train_test_split(arrays, *option)```
   * 划分数据集
   * 参数
     * x：数据集的特征值
     * y：数据集的标签值
     * test_size：测试集大小，一般是float
     * random_state:随机数种子
     * return：训练集特征值，测试集特征值，训练集目标值，测试集目标值

    | 训练集特征值 | 测试集特征值 | 训练集目标值 | 测试集目标值 |
    | :----: | :----: | :----: | :----: |
    |x_train|x_test|y_train|y_test|
6. 实际应用
```
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# 获取数据集
def datasets_demo():
    &#34;&#34;&#34;
    sklearn数据集使用
    :return:
    &#34;&#34;&#34;
    # 获取数据集
    iris = load_iris()
    print(&#34;鸢尾花数据集\n&#34;, iris)
    print(&#34;查看数据描述\n&#34;, iris.DESCR)
    print(&#34;查看特征值名字\n&#34;, iris.feature_names)
    print(&#34;查看特征值\n&#34;, iris.data)

    # 数据集划分
    x_train,x_test,y_train,y_test = train_test_split(iris.data, iris.target, test_size=0.2, random_state=10)
    print(&#34;训练集的特征值\n&#34;, x_train, x_train.shape)

    return None

if __name__ == &#34;__main__&#34;:
    # 代码1 sklearn数据集使用
    datasets_demo()
```
## 数据集划分
* train：用于训练的数据集，构建墨香
* test：测试数据集，评估模型是否有效
* 划分比例

|划分比例|||
| :----: | :----: | :----: |
| 训练集 | 7 | 8 | 7.5 |
| 测试集 | 3 | 2 | 2.5 |


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0_2/  

