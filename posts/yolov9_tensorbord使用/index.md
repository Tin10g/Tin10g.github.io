# Tensorbord 使用


# tensorbord
## 服务器启动
```
tensorboard --logdir=./runs
```

## 本地使用
ssh连接，把服务器6006端口映射到本地的16006端口
```
ssh -L 16006:127.0.0.1:6006 用户名@IP地址
```
可以直接从 [ http://localhost:16006 ] 进去

## 仪表盘
1. Tensorbord Scalars
可以可视化这些指标并更轻松地调试模型。第一个示例，在 MNIST 数据集上绘制模型的损失和准确性，使用的就是Scalars

## 注
如果是租的服务器这个应该不管用，可能会被deny，权限不够

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/yolov9_tensorbord%E4%BD%BF%E7%94%A8/  

