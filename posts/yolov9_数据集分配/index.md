# 数据集分配一些小tip


# 数据集分配
&gt; 本实验使用的是```4.2k HRW yolo dataset```
&gt; [ https://github.com/Whiffe/SCB-dataset.git ]

## 目录结构
```
dataset/
|--- images/
|    |--- train/
|    |    |--- image1.jpg
|    |    |--- image2.jpg
|    |    |--- ...
|    |
|    |--- val/
|    |    |--- image3.jpg
|    |    |--- image4.jpg
|    |    |--- ...
|    |
|    |--- test/
|         |--- image5.jpg
|         |--- image6.jpg
|         |--- ...
|
|--- labels/
     |--- train/
     |    |--- label1.txt
     |    |--- label2.txt
     |    |--- ...
     |
     |--- val/
     |    |--- label3.txt
     |    |--- label4.txt
     |    |--- ...
     |
     |--- test/
          |--- label5.txt
          |--- label6.txt
          |--- ...
|--- train.txt
|--- val.txt
|--- test.txt          
```

## 随机分配数据集
数据集比例：train:val:test = 6:2:2\
\
split_dataset.py
```
import os
import shutil
import random

# 定义数据集路径
dataset_path = &#34;./dataset&#34;
images_path = os.path.join(dataset_path, &#34;images&#34;)
labels_path = os.path.join(dataset_path, &#34;labels&#34;)

# 创建train、val、test文件夹
train_path = os.path.join(images_path, &#34;train&#34;)
val_path = os.path.join(images_path, &#34;val&#34;)
test_path = os.path.join(images_path, &#34;test&#34;)

# 确保文件夹存在，如果不存在则创建
for path in [train_path, val_path, test_path]:
    if not os.path.exists(path):
        os.makedirs(path)

# 定义图片范围
start = 1
end = 4245
total_images = end - start &#43; 1

# 生成图片列表
image_list = [f&#34;{i:07}.png&#34; for i in range(start, end &#43; 1)]

# 随机打乱图片列表
random.shuffle(image_list)

# 计算划分数量
train_count = int(total_images * 0.6)
val_count = int(total_images * 0.2)
test_count = total_images - train_count - val_count

# 将图片分配到对应文件夹
for i, image_file in enumerate(image_list):
    source_image_path = os.path.join(images_path, image_file)
    source_label_path = os.path.join(labels_path, os.path.splitext(image_file)[0] &#43; &#34;.txt&#34;)

    if i &lt; train_count:
        folder = &#34;train&#34;
    elif i &lt; train_count &#43; val_count:
        folder = &#34;val&#34;
    else:
        folder = &#34;test&#34;

    destination_image_path = os.path.join(images_path, folder, image_file)
    destination_label_path = os.path.join(labels_path, folder, os.path.splitext(image_file)[0] &#43; &#34;.txt&#34;)

    # 添加调试信息
    print(f&#34;Copying {source_image_path} to {destination_image_path}&#34;)
    print(f&#34;Copying {source_label_path} to {destination_label_path}&#34;)

    # 确保目标文件夹存在
    os.makedirs(os.path.dirname(destination_image_path), exist_ok=True)
    os.makedirs(os.path.dirname(destination_label_path), exist_ok=True)

    # 复制图片文件
    shutil.copyfile(source_image_path, destination_image_path)

    # 复制对应的标签文件
    shutil.copyfile(source_label_path, destination_label_path)

```

## 写绝对路径到txt文件
createPathTxt.py
```
import os

# 输入文件夹和输出文件
dataset_folder = &#34;./dataset/images&#34;
train_folder = &#34;./dataset/images/train&#34;
val_folder = &#34;./dataset/images/val&#34;
test_folder = &#34;./dataset/images/test&#34;

# 输出文件路径
train_txt_path = &#34;./dataset/train.txt&#34;
val_txt_path = &#34;./dataset/val.txt&#34;
test_txt_path = &#34;./dataset/test.txt&#34;

# 获取文件夹中所有文件的路径
def get_file_paths(folder):
    file_paths = []
    for root, _, files in os.walk(folder):
        for file in files:
            file_path = os.path.join(root, file)
            file_paths.append(file_path)
    return file_paths

# 获取训练集、验证集、测试集文件路径
train_file_paths = get_file_paths(train_folder)
val_file_paths = get_file_paths(val_folder)
test_file_paths = get_file_paths(test_folder)

# 写入文件路径到对应的文本文件
def write_file_paths(file_paths, txt_path):
    with open(txt_path, &#39;w&#39;) as txt_file:
        for path in file_paths:
            txt_file.write(os.path.abspath(path) &#43; &#39;\n&#39;)  # 将相对路径转换为绝对路径并写入文本文件

# 写入训练集文件路径
write_file_paths(train_file_paths, train_txt_path)
print(f&#34;训练集文件路径已写入: {os.path.abspath(train_txt_path)}&#34;)

# 写入验证集文件路径
write_file_paths(val_file_paths, val_txt_path)
print(f&#34;验证集文件路径已写入: {os.path.abspath(val_txt_path)}&#34;)

# 写入测试集文件路径
write_file_paths(test_file_paths, test_txt_path)
print(f&#34;测试集文件路径已写入: {os.path.abspath(test_txt_path)}&#34;)
```



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/yolov9_%E6%95%B0%E6%8D%AE%E9%9B%86%E5%88%86%E9%85%8D/  

