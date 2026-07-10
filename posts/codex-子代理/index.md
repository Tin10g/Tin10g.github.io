# Codex · 子代理


## 子代理是什么

&gt; 适合需要同时处理多个文件或多个独立任务的场景。

 Codex 可以并行调用的辅助代理，用于处理复杂任务的不同部分。

个人觉得可以理解为：你根据大的项目任务建立一个项目组然后为每个人分配工作，只是每个被分配工作的人背后都是ai，你可以给每个人起名字和分配任务

### 作用

* 将大型任务分解为可管理的部分
* 并行处理多个独立任务
* 为不同类型的任务配置专门的代理
* 提高处理大型项目的效率

## 配置子代理

### 基础配置

```
# 启用多代理功能
[features]
multi_agent = true

# 配置代理参数
[agents]
# 最大并行线程数
max_threads = 6

# 最大嵌套深度
max_depth = 1

# 作业最大运行时间（秒）
job_max_runtime_seconds = 1800
```

### 自定义角色

```
# 定义一个代码审查代理
[agents.reviewer]
description = &#34;专注于代码审查和质量问题&#34;
nickname_candidates = [&#34;Reviewer&#34;, &#34;CodeChecker&#34;, &#34;QualityBot&#34;]

# 可以指向一个配置文件
# config_file = &#34;agents/reviewer.toml&#34;
```

### 使用子代理

&gt; 假设子代理叫reviewer

```
# 使用 @ 提及子代理
@reviewer 审查 src/auth.py 文件

# 使用 /agents 命令
/agents run reviewer --task &#34;审查所有测试文件&#34;
```

## 子代理工作原理

### 并行处理

```
任务：审查整个代码库
  ├─ 子代理 1：审查 src/auth/ 目录
  ├─ 子代理 2：审查 src/api/ 目录
  ├─ 子代理 3：审查 src/utils/ 目录
  └─ 主代理：汇总结果
```

### 顺序处理

```
任务：实现新功能
  └─ 子代理 1：创建数据模型
       └─ 子代理 2：创建 API 端点
            └─ 子代理 3：编写测试
```

### 嵌套

```
配置中的 max_depth 控制代理可以嵌套的层数：
深度 0：根会话
深度 1：直接子代理
深度 2：子代理的子代理
```

最大的深度最好是1或2

## 监控子代理

```
# 在 Codex 中查看
/agents status

# 查看详细信息
/agents list
```

Codex 会显示每个子代理的输出，并在主界面中汇总结果。

## 实践使用

### 任务分解

- 将大型任务分解为独立的子任务
- 确保子任务之间没有强依赖（可以并行时）
- 为每个子任务定义清晰的输入和输出

### 配置优化

- 根据任务复杂度调整 max_threads
- 为不同类型的任务配置专门的代理角色
- 设置合理的 job_max_runtime_seconds 避免长时间运行

### 监控和调试

- 定期检查子代理的输出
- 使用 /agents status 了解整体进度
- 必要时可以取消特定的子代理


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/codex-%E5%AD%90%E4%BB%A3%E7%90%86/  

