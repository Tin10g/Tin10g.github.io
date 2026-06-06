# Codex · AGENTS的入职说明书


&gt; AGENTS.md的作用
&gt;
&gt; 告诉他你的项目基本信息，不能动什么，数据怎么走，避免重复 交代信息。

## AGENT内容

```
# AGENTS.md

## 项目概述
这是一个基于 Next.js 14 &#43; Prisma &#43; PostgreSQL 的 SaaS 应用。
使用 App Router，不使用 Pages Router。

## 技术栈
- 前端：Next.js 14, React 18, TailwindCSS, shadcn/ui
- 后端：Next.js API Routes, Prisma ORM
- 数据库：PostgreSQL 15
- 认证：NextAuth.js

## 重要约定
- 所有数据库操作必须通过 lib/db.ts 中的 prisma 实例
- API 路由错误统一用 lib/api-error.ts 处理
- 环境变量在 .env.local 中，参考 .env.example

## 禁止事项
- 不要修改 prisma/schema.prisma，除非我明确要求
- 不要删除任何现有测试
- 生产环境的 .env 文件不要碰
```

* 配置层级
  * 全局层：~/.codex/AGENTS.md
  * 项目层： repo/AGENTS.md
  * 覆写层： repo/services/payments/AGENTS.override.md（子目录）


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/codex-agents%E5%85%A5%E8%81%8C%E8%AF%B4%E6%98%8E%E4%B9%A6/  

