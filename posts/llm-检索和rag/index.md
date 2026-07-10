# LLM · 检索和RAG


## 检索

检索：模型在回答前，先去外部资料或记忆库里找相关信息，再把找到的内容交给 LLM 生成答案。

检索最常见的系统叫 RAG，也就是 Retrieval-Augmented Generation，检索增强生成。

### 检索流程

最常见流程：

```
用户问题
  ↓
把问题转成向量 embedding
  ↓
去向量数据库里找相似内容
  ↓
取出最相关的几个文本片段
  ↓
放进 LLM 的上下文
  ↓
LLM 生成答案
```

* 文档切块 Chunking

  大文档太长，不能整篇直接丢进去，所以会切成小段。每个 chunk 都可以被检索。

* Embedding 向量

  把文字变成一串数字。

* 向量数据库 Vector Database

  专门存这些 embedding 的地方。

  普通数据库按关键词找，向量数据库按语义找

  常见：FAISS，Chroma，Milvus，Pinecone，Weaviate，Qdrant

* Top-k 检索

  系统不会把所有资料都拿出来，只会取最相关的几个。

  比如 `top_k = 5` 表示：找出最相关的 5 个片段。

* Rerank 重排序

  第一次检索可能不够准，所以有时会再用一个模型重新排序，把真正最相关的内容排前面。

## RAG

RAG = 检索 Retrieval &#43; 生成 Generation

### RAG流程

1. 阶段一：构建知识库

```
原始文档
  ↓
文本提取
  ↓
切块 chunking
  ↓
生成 embedding 向量
  ↓
存入向量数据库
```

2. 阶段二：用户提问时检索并回答

```
用户问题
  ↓
把问题也变成 embedding
  ↓
在向量数据库中找相似 chunk
  ↓
取出最相关的资料
  ↓
放进 prompt
  ↓
LLM 根据资料生成答案
```

### RAG组成

| 部分           | 作用                   |
| -------------- | ---------------------- |
| 文档库         | 存放原始资料           |
| Chunking       | 把长文档切成小块       |
| Embedding 模型 | 把文字变成向量         |
| 向量数据库     | 存向量并支持相似度搜索 |
| Retriever      | 检索相关内容           |
| Reranker       | 对检索结果重新排序     |
| Prompt 模板    | 告诉 LLM 如何使用资料  |
| LLM            | 根据资料生成答案       |

### RAG分类

* Hybrid RAG

  结合关键词搜索和向量搜索。

* Rerank RAG

  先粗略检索 20 条，再用 reranker 精排，选最好的 5 条给 LLM。

* Multi-hop RAG

  需要多步检索。

* Agentic RAG

  让 agent 自己决定：要不要检索，检索几次，用什么关键词，是否需要查另一个数据库

* GraphRAG

  把资料组织成知识图谱，适合复杂关系推理。

### RAG评估

* 检索质量
  * 有没有找到真正相关的资料？
  * 相关资料排得够靠前吗？
  * 有没有漏掉关键资料？
* 生成之类
  * 答案是否忠实于资料？
  * 有没有编造？
  * 是否回答了问题？
  * 是否引用来源？

* 常见指标
  * Context Precision
  * Context Recall
  * Faithfulness
  * Answer Relevance
  * Citation Accuracy


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/llm-%E6%A3%80%E7%B4%A2%E5%92%8Crag/  

