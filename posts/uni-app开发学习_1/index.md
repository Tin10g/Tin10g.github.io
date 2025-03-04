# Vue3&#43;ts开发学习 · 基础准备

&gt; 黑马的视频学习

# VSCode配置一个uni-app &#43; TS项目
* uni-app插件
  * uni-create-view
  * uni-helper
  * uniapp小程序扩展
* ts类型校验
  * 声明类文件
  ```
  pnpm i -D miniprogram-api-typings @uni-helper/uni-app-types
  ```
  * 配置tsconfig.json
  ```
    &#34;types&#34;: [
      &#34;@dcloudio/types&#34;,
      &#34;miniprogram-api-typings&#34;,
      &#34;@uni-helper/uni-app-types&#34;
    ]
  ```
  ```
  &#34;vueCompilerOptions&#34;: {
    // experimentalRuntimeMode 已废弃，现调整为 nativeTags，请升级 Volar 插件至最新版本
    &#34;nativeTags&#34;: [&#34;block&#34;, &#34;component&#34;, &#34;template&#34;, &#34;slot&#34;]
  },
  ```
* json注释问题

# 内部配置
1. mainifest.json中添加微信小程序的appid
&gt; 一定是小程序相关的appid配置
2. 配置相关内容
  ```
  pnpm i -D miniprogram-api-typings @uni-helper/uni-app-types
  ```
  ```
  // 配置微信小程序编译环境
  pnmp dev:mp-weixin
  ```
  &gt; 编译完成的结果是在dist目录下
  导入微信开发者工具

# 统一代码风格
&gt; 安装eslit &#43; prettier
1. 安装
  ```
  pnpm i -D eslint prettier-plugin-vue @vue/eslint-config-prettier @vue/eslint-config-typescript @rushstack/eslint-patch @vue/tsconfig
  ```
2. 添加eslint配置，新建.eslintrc.cjs文件
```
/* eslint-env node */
require(&#39;@rushstack/eslint-patch/modern-module-resolution&#39;)

module.exports = {
  root: true,
  extends: [
    &#39;plugin:vue/vue3-essential&#39;,
    &#39;eslint:recommended&#39;,
    &#39;@vue/eslint-config-typescript&#39;,
    &#39;@vue/eslint-config-prettier&#39;,
  ],
  // 小程序全局变量
  globals: {
    uni: true,
    wx: true,
    WechatMiniprogram: true,
    getCurrentPages: true,
    getApp: true,
    UniApp: true,
    UniHelper: true,
    App: true,
    Page: true,
    Component: true,
    AnyObject: true,
  },
  parserOptions: {
    ecmaVersion: &#39;latest&#39;,
  },
  rules: {
    &#39;prettier/prettier&#39;: [
      &#39;warn&#39;,
      {
        singleQuote: true,
        semi: false,
        printWidth: 100,
        trailingComma: &#39;all&#39;,
        endOfLine: &#39;auto&#39;,
      },
    ],
    &#39;vue/multi-word-component-names&#39;: [&#39;off&#39;],
    &#39;vue/no-setup-props-destructure&#39;: [&#39;off&#39;],
    &#39;vue/no-deprecated-html-element-is&#39;: [&#39;off&#39;],
    &#39;@typescript-eslint/no-unused-vars&#39;: [&#39;off&#39;],
  },
}
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/uni-app%E5%BC%80%E5%8F%91%E5%AD%A6%E4%B9%A0_1/  

