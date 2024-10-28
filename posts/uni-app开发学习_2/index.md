# Vue3&#43;ts开发学习——小兔鲜儿2

&gt; 黑马的视频学习

# 基础架构
## 构建页面
1. 安装uni-ui  
&gt; [uniapp官网](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html)
  npm安装跟着开始说明走，直接安装就行。  
2. 跟着开始说明的自动导入模块功能设置怎么用直接使用。
3. uni-ui-helper
安装
```
npm i -D @uni-helper/uni-ui-types
```
配置tsconfig.json
```
    &#34;types&#34;: [
      &#34;@dcloudio/types&#34;,
      &#34;miniprogram-api-typings&#34;,
      &#34;@uni-helper/uni-app-types&#34;,
      &#34;@uni-helper/uni-ui-types&#34;
    ]
```

## 状态管理
&gt; 持久化  
&gt; pinia实现
1. API
  ```
  uni.setStorageSync()
  uni.getStorageSync()
  ```
2. 存放位置：/src/stores/index.ts
```
import { createPinia } from &#39;pinia&#39;
import persist from &#39;pinia-plugin-persistedstate&#39;

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from &#39;./modules/member&#39;
```
**例子** [会员信息]
```
import { defineStore } from &#39;pinia&#39;
import { ref } from &#39;vue&#39;

// 定义 Store
export const useMemberStore = defineStore(
  &#39;member&#39;,
  () =&gt; {
    // 会员信息
    const profile = ref&lt;any&gt;()

    // 保存会员信息，登录时使用
    const setProfile = (val: any) =&gt; {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () =&gt; {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    // 仅网页端
    // persist: true,
    // 小程序端
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      }
    }
  },
)
```
&gt; 主要是持久化的写法！！
## 数据交互
&gt; 请求工具
### 拦截器
* request请求
* upload上传文件
```
// 实例化拦截器
uni.addInterceptor(string, object)
```

### 代码示例
```
/**
* 添加拦截器:
    * 拦截request请求
    * 拦截uploadFile文件上传
* TODO:
    * 非http开头需要拼接地址
    * 请求超时
    * 添加小程序端请求头标识
    * 添加token请求头标识 
**/

import { useMemberStore } from &#34;@/stores&#34;

const baseURL = &#39;https://pcapi-xiaotuxian-front-devtest.itheima.net&#39;

//添加拦截器
const httpInterceptor = {
    // 拦截前触发
    invoke(options: UniApp.RequestOptions) {
        // 非http开头需要拼接地址
        if (!options.url.startsWith(&#39;http&#39;)) {
            options.url = baseURL &#43; options.url
        }
        // 请求超时
        options.timeout = 10000
        // 添加小程序端请求头标识
        options.header = {
            ...options.header,
            &#39;source-client&#39;: &#39;miniapp&#39;,
        }
        //添加token请求头标识
        const memberStore = useMemberStore()
        const token = memberStore.profile?.token
        if (token) {
            options.header.Authorization = token
        }
        // console.log(options)
    },
}
uni.addInterceptor(&#39;request&#39;, httpInterceptor)
uni.addInterceptor(&#39;uploadFile&#39;, httpInterceptor)


/**
 * 请求函数
 * @param UniApp.RequestOptions
 * @returns Promise
 * 1. 返回Promise对象
 * 2. 请求成功
 *  2.1 提取核心数据res.data
 *  2.2 添加类型，支持泛型
 * 3. 请求失败
 *  3.1 网络错误 -&gt; 提示用户换网络
 *  3.2 401错误 -&gt; 清理用户信息，体专登录页
 *  3.3 其它错误 -&gt; 根据后端错误信息轻提示
 */

interface Data&lt;T&gt; {
    code: string
    msg: string
    result: T
}

// 2.2 添加类型，支持泛型
export const http = &lt;T&gt;(options: UniApp.RequestOptions) =&gt; {
    //1. 返回Promise对象
    return new Promise((resolve, reject) =&gt; {
        uni.request({
            ...options,
            // 2. 请求成功
            success(res) {
                // 状态码 2xx
                if (res.statusCode &gt;= 200 &amp;&amp; res.statusCode &lt; 300) {
                    // 2.1 提取核心数据res.data
                    resolve(res.data as Data&lt;T&gt;)
                } else if (res.statusCode === 401) {
                    // 401错误 -&gt; 清理用户信息，体专登录页
                    const memberStore = useMemberStore()
                    memberStore.clearProfile()
                    uni.navigateTo({ url: &#39;/pages/login/login&#39; })
                    reject(res)
                } else {
                    // 其他错误
                    uni.showToast({
                        icon: &#39;none&#39;,
                        title: (res.data as Data&lt;T&gt;).msg || &#39;请求错误&#39;
                    })
                }
            },
            fail(err) {
                uni.showToast({
                    icon: &#39;none&#39;,
                    title: &#39;网络错误，换个网络试试&#39;
                })
                reject(err)
            }
        })
    })
}
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/uni-app%E5%BC%80%E5%8F%91%E5%AD%A6%E4%B9%A0_2/  

