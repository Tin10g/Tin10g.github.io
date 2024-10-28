# Vue3&#43;ts开发学习 · 小兔鲜儿3

&gt; 黑马的视频学习

# 首页
## 组件封装
### 只有一个页面需要使用
&gt; 以首页导航栏示例
/index/index.vue
```
&lt;script setup lang=&#34;ts&#34;&gt;
import CustomNavbar from &#39;./componets/CustomNavbar.vue&#39;;
&lt;/script&gt;

&lt;template&gt;
  &lt;!-- 自定义导航栏 --&gt;
  &lt;CustomNavbar /&gt;
&lt;/template&gt;

&lt;style lang=&#34;scss&#34;&gt;
//
&lt;/style&gt;
```
/index/components/CustomNavbar.vue
```
&lt;script setup lang=&#34;ts&#34;&gt;
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
&lt;/script&gt;

&lt;template&gt;
  &lt;view class=&#34;navbar&#34; :style=&#34;{ paddingTop: safeAreaInsets?.top &#43; 10 &#43; &#39;px&#39; }&#34;&gt;
    &lt;!-- logo文字 --&gt;
    &lt;view class=&#34;logo&#34;&gt;
      &lt;image class=&#34;logo-image&#34; src=&#34;@/static/images/logo.png&#34;&gt;&lt;/image&gt;
      &lt;text class=&#34;logo-text&#34;&gt;新鲜 · 亲民 · 快捷&lt;/text&gt;
    &lt;/view&gt;
    &lt;!-- 搜索条 --&gt;
    &lt;view class=&#34;search&#34;&gt;
      &lt;text class=&#34;icon-search&#34;&gt;搜索商品&lt;/text&gt;
      &lt;text class=&#34;icon-scan&#34;&gt;&lt;/text&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;style lang=&#34;scss&#34;&gt;
/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }
    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .icon-search {
    &amp;::before {
      margin-right: 10rpx;
    }
  }
  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
&lt;/style&gt;
```

**关键代码**
```
&lt;script setup lang=&#34;ts&#34;&gt;
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
&lt;/script&gt;

&lt;template&gt;
  &lt;view class=&#34;navbar&#34; :style=&#34;{ paddingTop: safeAreaInsets?.top &#43; 10 &#43; &#39;px&#39; }&#34;&gt;
...
```

### 需要多个页面使用【全局组件】
&gt; 轮播图为例
/src/components/XtxSwiper.vue
```
&lt;script setup lang=&#34;ts&#34;&gt;
import { ref } from &#39;vue&#39;

const activeIndex = ref(0)
&lt;/script&gt;

&lt;template&gt;
  &lt;view class=&#34;carousel&#34;&gt;
    &lt;swiper :circular=&#34;true&#34; :autoplay=&#34;false&#34; :interval=&#34;3000&#34;&gt;
      &lt;swiper-item&gt;
        &lt;navigator url=&#34;/pages/index/index&#34; hover-class=&#34;none&#34; class=&#34;navigator&#34;&gt;
          &lt;image
            mode=&#34;aspectFill&#34;
            class=&#34;image&#34;
            src=&#34;https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/slider_1.jpg&#34;
          &gt;&lt;/image&gt;
        &lt;/navigator&gt;
      &lt;/swiper-item&gt;
      &lt;swiper-item&gt;
        &lt;navigator url=&#34;/pages/index/index&#34; hover-class=&#34;none&#34; class=&#34;navigator&#34;&gt;
          &lt;image
            mode=&#34;aspectFill&#34;
            class=&#34;image&#34;
            src=&#34;https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/slider_2.jpg&#34;
          &gt;&lt;/image&gt;
        &lt;/navigator&gt;
      &lt;/swiper-item&gt;
      &lt;swiper-item&gt;
        &lt;navigator url=&#34;/pages/index/index&#34; hover-class=&#34;none&#34; class=&#34;navigator&#34;&gt;
          &lt;image
            mode=&#34;aspectFill&#34;
            class=&#34;image&#34;
            src=&#34;https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/slider_3.jpg&#34;
          &gt;&lt;/image&gt;
        &lt;/navigator&gt;
      &lt;/swiper-item&gt;
    &lt;/swiper&gt;
    &lt;!-- 指示点 --&gt;
    &lt;view class=&#34;indicator&#34;&gt;
      &lt;text
        v-for=&#34;(item, index) in 3&#34;
        :key=&#34;item&#34;
        class=&#34;dot&#34;
        :class=&#34;{ active: index === activeIndex }&#34;
      &gt;&lt;/text&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;style lang=&#34;scss&#34;&gt;
:host {
  display: block;
  height: 280rpx;
}
/* 轮播图 */
.carousel {
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;
  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;
    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }
    .active {
      background-color: #fff;
    }
  }
  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
&lt;/style&gt;
```

1. **关键代码**  
自动导入设置【和uni-app自动导入设置类似】  
使用正则匹配方法  
pages.json
```
&#34;easycom&#34;: {
    &#34;autoscan&#34;: true,
    &#34;custom&#34;: {
      // uni-ui 规则如下配置
      &#34;^uni-(.*)&#34;: &#34;@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue&#34;,
      // 以Xtx 开头的组件，在components文件夹中查找引入
      &#34;^Xtx(.*)&#34;: &#34;@/components/Xtx$1.vue&#34;
    }
  },
  &#34;pages&#34;: 
  ...
```

2. 对全局组件进行类型声明
模板代码
```
declare module &#39;@vue/runtime-core&#39; {
    export interface GlobalComponents {

    }
}
```
代码使用
```
import XtxSwiper from &#34;./XtxSwiper.vue&#34;;

declare module &#39;@vue/runtime-core&#39; {
    export interface GlobalComponents {
        XtxSwiper: typeof XtxSwiper
    }
}
```

## 轮播图指示点高光跟随
原代码
```
&lt;script setup lang=&#34;ts&#34;&gt;
import { ref } from &#39;vue&#39;

const activeIndex = ref(0)
&lt;/script&gt;

&lt;template&gt;
  ...
    &lt;!-- 指示点 --&gt;
    &lt;view class=&#34;indicator&#34;&gt;
      &lt;text
        v-for=&#34;(item, index) in 3&#34;
        :key=&#34;item&#34;
        class=&#34;dot&#34;
        :class=&#34;{ active: index === activeIndex }&#34;
      &gt;&lt;/text&gt;
    &lt;/view&gt;
  ...
&lt;\template&gt;
```
1. 在swiper上绑定change事件
```
&lt;swiper :circular=&#34;true&#34; :autoplay=&#34;false&#34; :interval=&#34;3000&#34; @change=&#34;onChange&#34;&gt;
```
2. 获取事件数据，并发现detail里面的current随着变化滑动而变化数字。因此作为滑动指示点的高亮显示记号。
```
&lt;script setup lang=&#34;ts&#34;&gt;
import { ref } from &#39;vue&#39;

const activeIndex = ref(0)

// 当 swiper 下标发生变化时触发
const onChange: UniHelper.SwiperOnChange = (ev) =&gt; {
  //不用?用!，是非空断言，主观上排除空的情况
  activeIndex.value = ev.detail!.current
}
&lt;/script&gt;
```
&gt; ev的类型使用了UniHelper.SwiperOnChange

## 各模块加入到主页并渲染等步骤
1. 在 /index/components 中保存对应模块的封装文件(.vue)
2. 查看对应组件的AIP文档相关信息，在 /service/home.ts 中封装组件AIP
```
/**
 * 首页-热门推荐-小程序
 * GET
 * /home/hot/mutli
 */
export const getHomeHotAPI = () =&gt; {
    return http({
        method: &#39;GET&#39;,
        url: &#39;/home/hot/mutli&#39;
    })
}
```
3. 在 index.vue 中的 template 标签里调用组件。并获取数据以及载入页面。
```
// 获取热门推荐数据
const getHomeHotData = async () =&gt; {
  const res = await getHomeHotAPI()
}
...
onLoad(() =&gt; {
  getHomeBannerData()
  getHomeCategoryAPIData()
  getHomeHotData()
})
```
4. 在 /types/home.d.ts 中定义数据类型
```
/** 首页-热门推荐数据类型 */
export type HotItem = {
  /** 说明 */
  alt: string
  /** id */
  id: string
  /** 图片集合[ 图片路径 ] */
  pictures: string[]
  /** 跳转地址 */
  target: string
  /** 标题 */
  title: string
  /** 推荐类型 */
  type: string
}
```
5. 此数据类型即为封装API中http的类型，但是http的内容是数组
```
/**
 * 首页-热门推荐-小程序
 * GET
 * /home/hot/mutli
 */
export const getHomeHotAPI = () =&gt; {
    return http&lt;HotItem&gt;({
        method: &#39;GET&#39;,
        url: &#39;/home/hot/mutli&#39;
    })
}
```
6. 在 index.vue 中得到具体的数据并把数据传到组件中
```
&lt;script&gt;
// 获取热门推荐数据
const hotList = ref&lt;HotItem[]&gt;([])
const getHomeHotData = async () =&gt; {
  const res = await getHomeHotAPI()
  hotList = res.result
}
&lt;/script&gt;
...
&lt;template&gt;
  &lt;!-- 热门推荐 --&gt;
  &lt;HotPanel :list=&#34;hotList&#34; /&gt;
&lt;/template&gt;
```
7. 在组件的vue文件中定义props接收数据
```
&lt;script setup lang=&#34;ts&#34;&gt;
...
// 定义props接收数据,一般是列表
defineProps&lt;{
    list: HotItem[]
}&gt;()
&lt;/script&gt;
```
8. 把组件中静态数据换成当前调用的数据(一般通过v-for循环)
```
&lt;template&gt;
    &lt;!-- 推荐专区 --&gt;
    &lt;view class=&#34;panel hot&#34;&gt;
        &lt;view class=&#34;item&#34; v-for=&#34;item in list&#34; :key=&#34;item.id&#34;&gt;
            &lt;view class=&#34;title&#34;&gt;
                &lt;text class=&#34;title-text&#34;&gt;{{ item.title }}&lt;/text&gt;
                &lt;text class=&#34;title-desc&#34;&gt;{{ item.alt }}&lt;/text&gt;
            &lt;/view&gt;
            &lt;navigator hover-class=&#34;none&#34; url=&#34;/pages/hot/hot&#34; class=&#34;cards&#34;&gt;
                &lt;image v-for=&#34;src in item.pictures&#34; :key=&#34;src&#34; class=&#34;image&#34; mode=&#34;aspectFit&#34; :src=&#34;src&#34;&gt;
                &lt;/image&gt;
            &lt;/navigator&gt;
        &lt;/view&gt;
    &lt;/view&gt;
&lt;/template&gt;
```
## 自动导入公用组件
&gt; 可以不用import导入就能使用，但是需要定义类型在 /types/conponents.d.ts
```
import XtxSwiper from &#34;@/components/XtxSwiper.vue&#34;;
import XtxGuess from &#34;@/components/XtxGuess.vue&#34;;

declare module &#39;@vue/runtime-core&#39; {
    export interface GlobalComponents {
        XtxSwiper: typeof XtxSwiper
        XtxGuess: typeof XtxGuess
    }
}
```
&gt; 定义自动导入，在 /src/page.json
```
{
  &#34;easycom&#34;: {
    &#34;autoscan&#34;: true,
    &#34;custom&#34;: {
      // uni-ui 规则如下配置
      &#34;^uni-(.*)&#34;: &#34;@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue&#34;,
      // 以Xtx 开头的组件，在components文件夹中查找引入
      &#34;^Xtx(.*)&#34;: &#34;@/components/Xtx$1.vue&#34;
    }
  },
  &#34;pages&#34;: [...]
}
```


## 页面滚动设置
&gt; flexBox使用  
&gt; scoll-view使用
```
&lt;template&gt;
  &lt;!-- 自定义导航栏 --&gt;
  &lt;CustomNavbar /&gt;
  &lt;scroll-view class=&#34;scroll-view&#34; scroll-y&gt;
    &lt;!-- 自定义轮播图 --&gt;
    &lt;XtxSwiper :list=&#34;bannerList&#34; /&gt;
    &lt;!-- 分类面板 --&gt;
    &lt;CategoryPanel :list=&#34;categoryList&#34; /&gt;
    &lt;!-- 热门推荐 --&gt;
    &lt;HotPanel :list=&#34;hotList&#34; /&gt;
    &lt;!-- 猜你喜欢 --&gt;
    &lt;XtxGuess /&gt;
  &lt;/scroll-view&gt;
&lt;/template&gt;

&lt;style lang=&#34;scss&#34;&gt;
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
&lt;/style&gt;
```

## 调用组件对应后端API
单个页面内部使用组件采用页面内部调用API
```
//页面加载
onLoad(() =&gt; {
  getHomeBannerData()
  getHomeCategoryAPIData()
  getHomeHotData()
})
```
多个页面内部都会用到的组件采用组件内部调用API
```
// 组件挂载完毕
onMounted(() =&gt; {
    getHomeGoodsGuessLikeAPI()
})
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/uni-app%E5%BC%80%E5%8F%91%E5%AD%A6%E4%B9%A0_3/  

