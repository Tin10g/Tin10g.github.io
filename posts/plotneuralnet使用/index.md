# 杂记 · PlotNeuralNet使用


# PlotNeuralNet使用
1. 在PlotNeuralNet源代码中新建my_project把自己的python程序放里面
2. 写Unet.py脚本，存储在my_project中
```
import sys
sys.path.append(&#39;../&#39;)
from pycore.tikzeng import *
from pycore.blocks  import *

arch = [ 
    # 开头
    to_head(&#39;..&#39;), 
    to_cor(),
    to_begin(),
    
    #　添加输入层
    to_input( &#39;../examples/fcn8s/cats.jpg&#39; ),

    #  添加block1包含一个二重卷积接relu
    to_ConvConvRelu( name=&#39;ccr_b1&#39;, s_filer=500, n_filer=(64,64), offset=&#34;(0,0,0)&#34;, to=&#34;(0,0,0)&#34;, width=(2,2), height=40, depth=40  ),
    to_Pool(name=&#34;pool_b1&#34;, offset=&#34;(0,0,0)&#34;, to=&#34;(ccr_b1-east)&#34;, width=1, height=32, depth=32, opacity=0.5),
    #  添加三个block，每个包含三个二卷积加一池化
    *block_2ConvPool( name=&#39;b2&#39;, botton=&#39;pool_b1&#39;, top=&#39;pool_b2&#39;, s_filer=256, n_filer=128, offset=&#34;(1,0,0)&#34;, size=(32,32,3.5), opacity=0.5 ),
    *block_2ConvPool( name=&#39;b3&#39;, botton=&#39;pool_b2&#39;, top=&#39;pool_b3&#39;, s_filer=128, n_filer=256, offset=&#34;(1,0,0)&#34;, size=(25,25,4.5), opacity=0.5 ),
    *block_2ConvPool( name=&#39;b4&#39;, botton=&#39;pool_b3&#39;, top=&#39;pool_b4&#39;, s_filer=64,  n_filer=512, offset=&#34;(1,0,0)&#34;, size=(16,16,5.5), opacity=0.5 ),

    #  瓶颈，为block5
    to_ConvConvRelu( name=&#39;ccr_b5&#39;, s_filer=32, n_filer=(1024,1024), offset=&#34;(2,0,0)&#34;, to=&#34;(pool_b4-east)&#34;, width=(8,8), height=8, depth=8, caption=&#34;Bottleneck&#34;  ),
    to_connection( &#34;pool_b4&#34;, &#34;ccr_b5&#34;),

    #　解码器
    #  多个block，每个为unconv
    *block_Unconv( name=&#34;b6&#34;, botton=&#34;ccr_b5&#34;, top=&#39;end_b6&#39;, s_filer=64,  n_filer=512, offset=&#34;(2.1,0,0)&#34;, size=(16,16,5.0), opacity=0.5 ),
    to_skip( of=&#39;ccr_b4&#39;, to=&#39;ccr_res_b6&#39;, pos=1.25),
    *block_Unconv( name=&#34;b7&#34;, botton=&#34;end_b6&#34;, top=&#39;end_b7&#39;, s_filer=128, n_filer=256, offset=&#34;(2.1,0,0)&#34;, size=(25,25,4.5), opacity=0.5 ),
    to_skip( of=&#39;ccr_b3&#39;, to=&#39;ccr_res_b7&#39;, pos=1.25),    
    *block_Unconv( name=&#34;b8&#34;, botton=&#34;end_b7&#34;, top=&#39;end_b8&#39;, s_filer=256, n_filer=128, offset=&#34;(2.1,0,0)&#34;, size=(32,32,3.5), opacity=0.5 ),
    to_skip( of=&#39;ccr_b2&#39;, to=&#39;ccr_res_b8&#39;, pos=1.25),    
    
    *block_Unconv( name=&#34;b9&#34;, botton=&#34;end_b8&#34;, top=&#39;end_b9&#39;, s_filer=512, n_filer=64,  offset=&#34;(2.1,0,0)&#34;, size=(40,40,2.5), opacity=0.5 ),
    to_skip( of=&#39;ccr_b1&#39;, to=&#39;ccr_res_b9&#39;, pos=1.25),
    
    to_ConvSoftMax( name=&#34;soft1&#34;, s_filer=512, offset=&#34;(0.75,0,0)&#34;, to=&#34;(end_b9-east)&#34;, width=1, height=40, depth=40, caption=&#34;SOFT&#34; ),
    to_connection( &#34;end_b9&#34;, &#34;soft1&#34;),
    #  结束
    to_end() 
    ]


def main():
    namefile = str(sys.argv[0]).split(&#39;.&#39;)[0]
    to_generate(arch, namefile &#43; &#39;.tex&#39; )

if __name__ == &#39;__main__&#39;:
    main() 
```
3. 执行后生成 Unet.tex，这个是latex代码
4. 用 git bash 进入my_project文件中，解析Unet得到模型图片的pdf
   ```
   bash ../tikzmake.sh Unet
   ```

## Bug记录
### ```../tikzmake.sh: line 13: xdg-open: command not found```报错
修改 tikzmake.sh 的代码
```
# !/bin/bash


python $1.py 
pdflatex $1.tex

rm *.aux *.log *.vscodeLog
rm *.tex

if [[ &#34;$OSTYPE&#34; == &#34;darwin&#34;* ]]; then
    open $1.pdf
elif [[ &#34;$OSTYPY&#34; == &#34;darwin&#34;* ]]; then
    xdg-open $1.pdf
else
    start $1.pdf
fi
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/plotneuralnet%E4%BD%BF%E7%94%A8/  

