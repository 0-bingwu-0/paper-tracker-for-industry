# Digest · 2026-10-12

Papers from 2026-10-06 to 2026-10-12 · 337 papers listed · Based on abstracts

## Could change a view

### 1. Qwen: FP4 moves into RL post-training, with rollouts up to 5.4x faster

**Supports** View 4 (Lower precision raises effective compute per chip)

Qwen runs the rollout stage of RL post-training (where the model generates practice answers) in FP4 on four large MoE models, weights, activations, and KV cache included, with results comparable to BF16. InfiX.ai reports the same direction on Qwen3-4B and Qwen3-30B-A3B in NVFP4, a format NVIDIA's newest chips support natively, matching full precision on math benchmarks with up to 2.3x rollout throughput. This widens the edge of chips with native FP4 support, and makes each round of post-training cheaper. The limit: this is post-training, not pretraining, so "training moves to FP4" isn't settled.

Sources: [TRACE](https://huggingface.co/papers/2610.07767) (Qwen · 92 upvotes), [TRIAGE](https://huggingface.co/papers/2610.07043) (InfiX.ai · 44 upvotes)

### 2. Zhejiang University: compressing hybrid models' fixed memory cuts serving memory by up to 68.7%

**Challenges** View 2 (Long context makes memory the bottleneck), the "HBM is the surest winner" half

Hybrid models with linear attention already keep a fixed-size memory instead of a cache that grows with context; this paper compresses that memory to about 6 bits with near full-precision accuracy, tested on Qwen3.8-27B and Kimi-Linear-48B-A3B in SGLang. In the same week, SparseEngine reports over 10x throughput with KV eviction for agents, and HLA (Monash University) and OpenMOSS make hybrid attention work better at long context. Another round of squeezing the memory each long-context user takes; it fits the trend in [the research on this view](../research/example-long-context-memory.md). The papers come from academic groups, not the labs that set serving stacks.

Sources: [STEPQuant](https://huggingface.co/papers/2609.38169) (Zhejiang University · 122 upvotes), [SparseEngine](https://huggingface.co/papers/2609.39068) (Lab not listed · 17 upvotes), [HLA](https://huggingface.co/papers/2610.05842) (Monash University · 13 upvotes), [Mechanics of Long-Context Hybrid Models](https://huggingface.co/papers/2610.10114) (OpenMOSS · 32 upvotes)

### 3. NVIDIA: agentic retrieval reads about 764K tokens and takes 107 seconds per query

**Supports** View 7 (Agents multiply tokens per user)

Letting an LLM agent search in a loop beats standard retrieval by 8.7 points on a ranking metric, but each query takes 107 seconds instead of 0.67 and reads about 764K input tokens. That's a concrete number for how much more compute the agent version of a common enterprise task burns. The counterweight: Stanford's agents match the strongest kernel baseline's result with over 84% fewer tokens by not replaying history. Harness design can cut tokens a lot, which fits View 8 rather than breaking View 7. The size of the gap comes from one pipeline.

Sources: [Beyond Semantic Similarity](https://huggingface.co/papers/2610.05750) (NVIDIA · 21 upvotes), [Stateless Language Agents](https://huggingface.co/papers/2610.07625) (Stanford University · 9 upvotes)

### 4. Enterprise agents complete 83.5% of workflows but recover from only 46.7% of faults

**Bears on** the question "When will agents be reliable enough for wide enterprise rollout?"

Naive retries create duplicate actions, such as repeated writes, in 53% of trials. NVIDIA grades computer-use agents step by step instead of only on the end result, and Claude Opus 5 drops from 83.4% to 75.7%; NUS finds agents often act before they have the evidence they need. What holds back enterprise rollout looks more like recovery from mistakes than raw ability. This also slows the case for agents replacing seat-based software soon.

Sources: [UndoBench](https://huggingface.co/papers/2610.05622) (Lab not listed · 22 upvotes), [OSWorld-Pro](https://huggingface.co/papers/2609.24890) (NVIDIA · 28 upvotes), [From Evidence to Action](https://huggingface.co/papers/2610.07753) (National University of Singapore · 46 upvotes)

### 5. NVIDIA: syncing a 1T-parameter model between clusters drops from 87.5 minutes to 150 seconds

**Outside the watchlist**

RL training keeps sending updated weights from trainers to the machines generating answers; sending only what changed makes it practical to spread RL across data centers in different regions and use spare capacity wherever it sits. A second NVIDIA paper cuts RL training memory by up to 45.7%, enough to train a 27B model on one 8-GPU node, so more teams can afford post-training. Worth considering whether "where training compute sits" belongs on the watchlist.

Sources: [NeMo-DCR](https://huggingface.co/papers/2610.08430) (NVIDIA · 27 upvotes), [LoGRA](https://huggingface.co/papers/2610.06647) (NVIDIA · 149 upvotes)

## Worth watching

* **Xiaomi scales RL to 1M-token context and open-sources its RL framework and environments:** lowers the bar for other teams to catch up (View 5), but the abstract gives no numbers against frontier models. Sources: [MiMo-V2.6](https://huggingface.co/papers/2610.11959) (Xiaomi MiMo · 75 upvotes)
* **Tsinghua: a serving system that mixes a cheap and an expensive model token by token, 2–64x the throughput of existing systems:** a path to lower cost per token if routing catches on (View 6). Speculative decoding (a small model drafts, the big model checks) also keeps getting faster, 5–41% on top of existing methods. Sources: [TokenRouter](https://huggingface.co/papers/2610.12242) (Tsinghua-NICS-EFC · 129 upvotes), [DLoop](https://huggingface.co/papers/2610.07659) (NAVER AI Lab · 13 upvotes)
* **Batched MoE decoding ends up reading almost all experts, so moving weights is the bottleneck:** the paper's starting point confirms View 3; its fix, dropping half the experts during decode, gives up to 1.81x throughput on Qwen3.6-35B-A3B but doesn't change the shape. Sources: [SlimWise](https://huggingface.co/papers/2609.34117) (Lab not listed · 25 upvotes)
* **Qualcomm and Apple: small steps for on-device AI:** an Android voice assistant cuts median time to first audio from 5.79 s to 4.60 s by calling tools while the user is still speaking, and one Apple model runs at 1–4B parameters depending on available memory. It works in engineering terms, but the gains are small and far from taking inference share from data centers. Sources: [Hiding Tool Latency](https://huggingface.co/papers/2610.07641) (Qualcomm AI Research · 15 upvotes), [Stepped MoE](https://huggingface.co/papers/2610.07348) (Apple · 4 upvotes)

## Not sure

* **A small company keeps a 50-million-token cache on NVMe and loads it 2.8–4.3x faster than recomputing:** would move some long-context memory from HBM to SSD, but it's a single-GPU test of the authors' own package; independent tests on production serving stacks would settle it. Sources: [Real Long-Term Memory for AI](https://huggingface.co/papers/2610.10845) (Corbenic · 11 upvotes)
* **KAUST: a 27B model reads 4.5M-token contexts on one 80GB GPU by probing chunks instead of reading everything:** only works when choosing among a fixed set of answers, so it's unclear how much real long-context traffic it covers. Sources: [Periscope](https://huggingface.co/papers/2610.04047) (King Abdullah University of Science and Technology · 9 upvotes)
