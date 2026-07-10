# LLM · RAG常见数据集


## 常见数据集

### 经典 Open-Domain QA / RAG 原始论文常用

| 数据集                    | 主要用途                                     | 简介与特点                                                   |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| **Natural Questions, NQ** | 开放域 QA、检索器训练、RAG 端到端评测        | Google 真实搜索问题 &#43; Wikipedia 页面标注，含 long answer / short answer。NQ 是 DPR、REALM、RAG 等论文的核心基准之一。原始数据约 307k train、7.8k dev、7.8k hidden test。适合测“能不能从大规模 Wikipedia 找到证据并回答”。来源：[Google NQ](https://github.com/google-research-datasets/natural-questions) |
| **TriviaQA**              | 开放域 QA、检索增强问答                      | 约 95k trivia 问答，超过 650k question-answer-evidence triples；问题更复杂，答案和证据句常有较大词面差异。常用于训练/评估 dense retriever 和 RAG。来源：[TriviaQA paper](https://arxiv.org/abs/1705.03551) |
| **WebQuestions**          | 短答案 factoid QA                            | 基于 Freebase 的自然语言问题，规模小但历史上很常用；RAG 原始论文用它评估 open-domain QA。缺点是 Freebase 过时、规模小，今天更多作为经典对照。 |
| **CuratedTREC / TREC QA** | 小规模事实问答                               | 常见于 DrQA、DPR、RAG 早期论文，问题多为简短 factoid。优点是历史可比性强；缺点是规模小、容易受模型记忆影响。 |
| **SQuAD / SQuAD-Open**    | 阅读理解转开放域检索 QA                      | SQuAD 原本是给定段落抽取答案，约 100k&#43; Wikipedia 问题；SQuAD-Open 会把上下文移除，要求系统先检索再回答。来源：[SQuAD](https://arxiv.org/abs/1606.05250) |
| **MS MARCO**              | passage retrieval、reranking、abstractive QA | 来自 Bing 查询日志，约 1M 问题、8.8M passage。RAG 论文常用它测“真实搜索式问题 &#43; 生成式答案”。也是训练检索器、reranker 的核心工业级数据。来源：[MS MARCO](https://arxiv.org/abs/1611.09268) |

### 多跳推理 / 信息整合类 RAG

| 数据集              | 主要用途                            | 简介与特点                                                   |
| ------------------- | ----------------------------------- | ------------------------------------------------------------ |
| **HotpotQA**        | multi-hop QA、supporting facts 检索 | 113k Wikipedia 多跳问答，要求跨多个文档推理，并标注 sentence-level supporting facts。RAG 里常用来测“检索多篇证据 &#43; 合成答案”。有 distractor 和 fullwiki 两种设定。来源：[HotpotQA](https://hotpotqa.github.io/) |
| **2WikiMultiHopQA** | 多跳推理、路径解释                  | 基于 Wikidata &#43; Wikipedia 构造，强调 reasoning path，常用于测 query decomposition、多跳检索、graph/RAG。来源：[2WikiMultiHopQA](https://arxiv.org/abs/2011.01060) |
| **MuSiQue**         | 更难的 2-4 hop QA                   | 25k 多跳问题，专门减少 shortcut，使单跳模型难以投机。适合测复杂 RAG pipeline 的分解、迭代检索、证据组合。来源：[MuSiQue](https://arxiv.org/abs/2108.00573) |
| **StrategyQA**      | 隐式多跳推理                        | 2,780 个 yes/no 问题，推理步骤不会直接写在问题中，并提供 decomposition 和 Wikipedia evidence。适合测 RAG 是否会规划检索策略。来源：[StrategyQA](https://arxiv.org/abs/2101.02235) |
| **QAMPARI**         | 多答案聚合 QA                       | 问题答案是实体列表，分散在多个段落中；适合测 RAG 的 broad retrieval、coverage、去重和答案聚合能力。来源：[QAMPARI](https://arxiv.org/abs/2205.12665) |
| **ASQA**            | 歧义问题 &#43; 长答案综合               | 面向 ambiguous questions，要求生成能覆盖多种解释的长答案。常被 citation/RAG 论文用来测综合能力和可验证性。来源：[ASQA](https://arxiv.org/abs/2204.06092) |
| **ELI5**            | 长答案生成                          | Reddit “Explain Like I’m Five” 约 270k threads，答案长、开放、解释型；RAG 论文用来测 long-form generation 与证据支持。来源：[ELI5](https://arxiv.org/abs/1907.09190) |

### 检索基准 / Retriever 评测

| 数据集 / Benchmark        | 主要用途                                  | 简介与特点                                                   |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| **BEIR**                  | zero-shot retrieval 统一评测              | RAG 论文常先测 retriever，再测 generator。BEIR 集成 MS MARCO、NQ、HotpotQA、FiQA、TREC-COVID、NFCorpus、ArguAna、Touché、CQADupStack、Quora、DBPedia、SCIDOCS、FEVER、Climate-FEVER、SciFact 等，覆盖新闻、科学、金融、医疗、论坛、事实核查。指标常用 nDCG@k、Recall@k、MRR、MAP。来源：[BEIR](https://github.com/beir-cellar/beir) |
| **KILT**                  | 统一 knowledge-intensive NLP &#43; provenance | 把 FEVER、AIDA、T-REx、zsRE、NQ、HotpotQA、TriviaQA、ELI5、Wizard of Wikipedia 等任务统一到同一个 Wikipedia knowledge source 和 evidence/provenance 格式。非常适合端到端 RAG、可溯源生成。来源：[KILT](https://github.com/facebookresearch/KILT) |
| **MIRACL / MIRAGE-Bench** | 多语言检索与多语言 RAG                    | MIRACL 常用于多语言 dense retrieval；MIRAGE-Bench 在此基础上做 multilingual RAG arena-style 评测。适合中文/多语言 RAG。来源：[MIRAGE-Bench](https://arxiv.org/abs/2410.13716) |

### 事实核查、可归因、幻觉检测

| 数据集            | 主要用途                               | 简介与特点                                                   |
| ----------------- | -------------------------------------- | ------------------------------------------------------------ |
| **FEVER**         | fact verification &#43; evidence retrieval | 185,445 条 Wikipedia claims，标签为 supported/refuted/not enough info，并标注证据句。RAG 原始论文也用 FEVER 测分类式 retrieval-augmented generation。来源：[FEVER](https://arxiv.org/abs/1803.05355) |
| **SciFact**       | 科学事实核查                           | 科学 claim &#43; paper abstract evidence，常在 BEIR/RAG 评测中用于 scientific RAG。规模小但证据要求高。 |
| **Climate-FEVER** | 气候事实核查                           | 气候相关 claims &#43; evidence，常用于检索鲁棒性、争议性事实、领域 RAG。 |
| **ALCE**          | 带引用生成评测                         | Automatic LLMs’ Citation Evaluation，要求系统检索证据并生成带 citation 的答案；常用 ASQA、QAMPARI、ELI5。评估 fluency、correctness、citation quality。来源：[ALCE](https://arxiv.org/abs/2305.14627) |
| **HAGRID**        | attributed generative search           | 面向生成式信息检索，要求生成解释并给出可归因引用；基于 MIRACL English 构建。来源：[HAGRID](https://arxiv.org/abs/2307.16883) |
| **RAGTruth**      | RAG 幻觉标注                           | 约 18k RAG 生成回答，带 case-level 和 word-level hallucination annotation；适合训练/评估 hallucination detector。来源：[RAGTruth](https://arxiv.org/abs/2401.00396) |

### 专门为 RAG 设计的新 benchmark

| 数据集       | 主要用途              | 简介与特点                                                   |
| ------------ | --------------------- | ------------------------------------------------------------ |
| **RGB**      | RAG 基础能力诊断      | 中英双语，测试 noise robustness、negative rejection、information integration、counterfactual robustness。很适合分析“检索到噪声/错误证据时 LLM 会不会被带偏”。来源：[RGB](https://github.com/chen700564/RGB) |
| **CRAG**     | 真实动态 QA &#43; API/RAG | Comprehensive RAG Benchmark，4,409 个 factual QA，含 mock web / KG APIs，覆盖 5 个领域、8 类问题、实体流行度和时间动态性。KDD Cup 2024 相关，适合测现代 agentic/web RAG。来源：[CRAG](https://github.com/facebookresearch/CRAG) |
| **RAGBench** | 工业 RAG 质量评测     | 100k examples，覆盖多个行业语料和 RAG 任务，带可解释标签，用于评估 retrieval relevance、answer faithfulness、context utilization 等。来源：[RAGBench](https://arxiv.org/abs/2407.11005) |

### 垂直领域常见数据集

| 领域         | 常见数据集                                        | 用法                                                         |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------ |
| 科学论文 RAG | **QASPER、SciFact、SCIDOCS、LitQA**               | QASPER 是 NLP paper full-text QA，约 5,049 questions / 1,585 papers；适合论文问答、证据定位、长文档 RAG。来源：[QASPER](https://arxiv.org/abs/2105.03011) |
| 医疗 / 生物  | **BioASQ、PubMedQA、TREC-COVID、NFCorpus**        | 用于 biomedical retrieval、medical QA、COVID 文献检索。BEIR 中也包含 BioASQ、TREC-COVID、NFCorpus。 |
| 金融         | **FiQA**                                          | 金融问答/意见检索，常用于 BEIR 检索泛化和金融 RAG。          |
| 对话式知识   | **Wizard of Wikipedia、Doc2Dial / MultiDoc2Dial** | 测知识型对话、对话状态下的检索与回答。KILT 收录 Wizard of Wikipedia。 |

## 数据集的选择

- 测 retriever：`BEIR &#43; MS MARCO &#43; NQ/HotpotQA`
- 测端到端 QA：`NQ &#43; TriviaQA &#43; HotpotQA &#43; WebQuestions/CuratedTREC`
- 测多跳/综合：`HotpotQA &#43; MuSiQue &#43; 2WikiMultiHopQA &#43; QAMPARI &#43; ASQA`
- 测引用/可验证性：`ALCE &#43; ASQA &#43; QAMPARI &#43; ELI5 &#43; HAGRID`
- 测幻觉/鲁棒性：`RGB &#43; CRAG &#43; RAGTruth &#43; FEVER/SciFact`
- 做中文或多语言 RAG：优先看 `RGB、MIRACL/MIRAGE-Bench`，再补中文问答/领域私有数据。


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:7828/posts/llm-rag%E6%96%B9%E5%90%91%E5%B8%B8%E8%A7%81%E6%95%B0%E6%8D%AE%E9%9B%86/  

