# YOLOv9环境配置心路


# YOLOv9 &amp; BUGs
## loss_tal.py报错
cfg使用的glane-c.yaml
```
# ./utiles/loss_tal.py
# 167行 
feats = p[1] if isinstance(p, tuple) else p     # p不能加参数
```
cfg使用的yolov9-c.yaml
```
# loss_tal
# 167行 
feats = p[1] if isinstance(p, tuple) else p     # 原本
feats = p[1] if isinstance(p, tuple) else p[0]     # 修改
```

## plots.py报错
```
# ./utiles/plots.py
# 86行
w, h = self.font.getsize(label)  # text width, height
w, h = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 1, 1)[0]
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/yolov9_bug%E8%AE%B0%E5%BD%95/  

