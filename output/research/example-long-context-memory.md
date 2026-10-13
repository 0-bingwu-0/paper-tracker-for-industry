# Long context and memory

**View:** Long context makes memory, not compute, the bottleneck, and HBM is the surest winner. ([Watchlist](../../context/watchlist.md), view 2)

**Last updated:** 2026-10-12, first build. Covered the titles and abstracts of all Hugging Face Daily Papers from 2026-07-15 to 2026-10-12, picked about 25 relevant ones, and read two in full (DeepSeek-V4.1-Flash, OasisKV).

## Conclusion: first half holds, second half challenged

Memory is still the bottleneck. But "HBM is the surest winner" no longer holds: both conditions you set for changing your mind started happening in open models this quarter. First, compression went into mainstream models: Kimi K3, Qwen, DeepSeek, and Xiaomi's new models no longer keep a full cache (the model's working memory of the conversation, which grows with every token) in every layer, and DeepSeek cut the HBM each token takes to about a quarter in one generation. Second, the cache started moving to cheaper tiers: DeepSeek keeps its long-lived cache on SSD and host memory, with only a small part in HBM.

My inference: memory demand from long context is still growing, but more of the growth goes to server DRAM and SSD, and compression offsets a large part of what would have landed on HBM. HBM is still needed, just no longer the surest bet. What's unclear is the net effect: the papers report savings per token, not totals, and can't say whether usage growth outruns compression.

## At a glance

| What to test | Direction | For the view |
| --- | --- | --- |
| Is memory a tighter limit than compute? | Yes. Microsoft and DeepSeek both say inference is limited by memory | Supports |
| Is demand for long context still growing? | Yes. 1M-token context is standard in new models, and RL training reaches 1M tokens too | Supports |
| Has compression gone into mainstream models? (change-my-mind condition 1) | Yes. Kimi K3 in July, Qwen and DeepSeek in September; a second round of compression started in September–October | Challenges |
| Is the cache moving to DRAM and SSD? (change-my-mind condition 2) | Started. A research prototype in August; in a released DeepSeek model by September | Challenges |
| Do quality problems hold compression back? | There are problems, but they haven't stopped adoption, and many papers are fixing them | Doesn't change the direction |

## Point by point

### Memory is the bottleneck: holds

* [OasisKV](https://huggingface.co/papers/2608.08097) (Microsoft · August · full paper): says "HBM capacity has become a scarce and costly resource that heavily limits inference batch size." Its example: a 32B model at 32.7K context needs about 8.6 GB of KV cache per request, so about nine requests fit in 80 GB.
* [DeepSeek-V4.1-Flash](https://huggingface.co/papers/2609.19969) (DeepSeek · September · full paper): says large KV caches "strain HBM and SSD capacity and data-transfer bandwidth", and that compression is meant to cut deployment cost and allow deployment "at a larger scale".

### Demand for long context: still growing

* [Kimi K3](https://huggingface.co/papers/2607.24653) (Moonshot AI · July · abstract) and [DeepSeek-V4.1-Flash](https://huggingface.co/papers/2609.19969) (September) both support 1M-token context. [MiMo-V2.6](https://huggingface.co/papers/2610.11959) (Xiaomi MiMo · October · abstract) scales RL training to 1M-token context.
* [Fathom](https://huggingface.co/papers/2609.17652) (lab not listed · September · abstract) targets agent sessions that run to a million tokens.
* Pulling the other way, agents are learning to read less. [Stateless Language Agents](https://huggingface.co/papers/2610.07625) (Stanford University · October · abstract) matches the strongest kernel baseline's final result with over 84% fewer tokens by not replaying history. My inference: this slows the growth but doesn't reverse it.

### Compression in mainstream models: condition 1 is happening

There are two main approaches: hybrid designs, where most layers keep a fixed-size memory (linear attention or a sliding window) and only a few keep the full cache; and shrinking the cache itself.

* [Kimi K3](https://huggingface.co/papers/2607.24653) (Moonshot AI · July · abstract): a 2.8T-parameter MoE with 1M context, built on Kimi Delta Attention, a linear-attention variant.
* [Qwen3.8-Flash-Next](https://huggingface.co/papers/2608.30320) (Qwen · September · abstract): only one layer in four uses full attention; the rest use Gated DeltaNet, which keeps a fixed-size memory. The abstract gives no cache sizes.
* [DeepSeek-V4.1-Flash](https://huggingface.co/papers/2609.19969) (DeepSeek · September · full paper): the cache that always sits in HBM drops to 890 bytes per token, about 1/4 of DeepSeek-V4-Flash, by having later layers reuse earlier layers' cache and storing it in FP4. Quality held: the base model scores 45.2 on LongBench-V2 vs 44.7 for V4-Flash. The paper gives no serving throughput, concurrency, or hardware numbers.
* [Motif 3](https://huggingface.co/papers/2608.09119) (Motif Technologies · August · abstract): a compressed cache design in the same family as DeepSeek's MLA. Smaller lab.
* A second round of compression has started, mostly in research, not yet in released models: [STEPQuant](https://huggingface.co/papers/2609.38169) (Zhejiang University · October · abstract) compresses the fixed-size memory in hybrid models 5x or more and cuts total serving memory by up to 68.7% on Qwen3.8-27B and Kimi-Linear-48B; [WUSH-KV](https://huggingface.co/papers/2609.38121) (IST Austria · October · abstract) stores the cache in 2 bits inside SGLang; [Random Attention](https://huggingface.co/papers/2609.03430) (Salesforce · September · abstract) finds that dropping cached tokens at random matches the best selective methods on reasoning models, with 32–43% more throughput in vLLM.

My inference: the context one HBM stack can hold grows several times per generation, which breaks the straight line from "longer context" to "more HBM per chip".

### Cache moving out of HBM: condition 2 has started

* [OasisKV](https://huggingface.co/papers/2608.08097) (Microsoft · August · full paper): the full cache lives in host DRAM, only a 2,048-token working set per attention head stays in HBM, and the rest is prefetched. On 8x H100 with 2 TB of host memory, it reports 1.69x throughput over vLLM on reasoning with 0.1 points of accuracy loss. On the 235B MoE it is slower at small batch and pulls ahead only at batch 32. A research prototype.
* [DeepSeek-V4.1-Flash](https://huggingface.co/papers/2609.19969) (DeepSeek · September · full paper): the long-lived cache is kept on SSD for at least 72 hours and cut to about 1/8 of V4-Flash; short-lived pieces go to a memory pool built from 10% of each machine's host DRAM. A released model, so tiered storage is in a production design.
* [Real Long-Term Memory for AI](https://huggingface.co/papers/2610.10845) (Corbenic · October · abstract): keeps a 50-million-token cache on local NVMe and loads it back 2.8–4.3x faster than recomputing, with flat GPU memory. A small company testing its own package on one GPU.

My inference: the gains spread from HBM to server DRAM and enterprise SSD.

### Quality problems: real, but not stopping adoption

* [Periodic Weak Spots](https://huggingface.co/papers/2609.36322) (ByteDance Seed · September · abstract): in large open models that compress the cache in chunks, retrieval accuracy swings by up to 40 points depending on where a fact falls, and average scores hide it.
* [Sliding-window beats linear attention](https://huggingface.co/papers/2608.28444) (Microsoft · August · abstract): when retrofitting existing models, a simple sliding window does as well as or better than linear attention. This is about retrofits, not hybrid models trained from scratch.
* Fixes are coming: [HLA](https://huggingface.co/papers/2610.05842) (Monash University · October · abstract) improves Gated DeltaNet by up to 5.57 points on LongBench-V2 across Qwen3.5 models from 0.8B to 9B.

My inference: applications that need exact recall over long inputs may keep a full cache, but no model in these three months went back to a traditional design over quality.

## What to watch

* Whether closed frontier models compress the same way. The library shows almost nothing of OpenAI's, Anthropic's, or Google's architectures; this is the biggest blind spot.
* The cache per token in the next DeepSeek and Qwen models. If it keeps falling several times per generation, HBM per unit of context keeps falling.
* Any paper or report on total memory demand (HBM, DRAM, SSD), not just savings per token.

## How solid it is

* Two papers read in full (DeepSeek-V4.1-Flash, OasisKV); the rest from abstracts. About 25 papers, of which four are technical reports for released models (Kimi K3, DeepSeek-V4.1-Flash, Qwen3.8-Flash-Next, Motif 3); the rest are mostly method papers from universities and small labs, often testing models of 4B–27B.
* The evidence is concentrated in Chinese open-model labs; work from closed labs and cloud providers is mostly not in the library.
* No paper measures HBM purchases, pricing, or how much HBM goes to cache versus weights in real fleets. "The growth goes to DRAM and SSD" is my inference.

## Suggested rewording

**Long context makes memory, not compute, the bottleneck, but the demand is spreading from HBM to DRAM and SSD.** Compression and tiered storage are already in mainstream open models: the HBM each token takes falls several times per generation, and the long-lived cache moves to cheaper memory and disk. Would change my mind: compression hits a quality ceiling and mainstream models go back to a full cache, or usage grows fast enough that total HBM demand rises sharply anyway.
