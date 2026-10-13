# Watchlist

What I'm tracking. Every paper is judged against this file. Below is an example for an analyst covering AI software and hardware; say "Set me up." in Chat to replace it with yours, or edit it directly.

## Directions

Papers in these areas are worth a look:

* Model architecture: attention variants, mixture of experts (MoE), state space models

* Long context and KV cache

* Quantization and low-precision training or inference (FP8, FP4)

* Inference efficiency: serving, speculative decoding, distillation, small models

* Reasoning and test-time compute

* Agents: long tasks, tool use, computer use, coding

* Open models catching up with frontier models

* Training efficiency and scaling

Labs whose papers tend to show what will ship: DeepSeek, Qwen, Google, Meta, NVIDIA, ByteDance Seed, Moonshot AI, Microsoft.

## Views I hold

Each view states my call, why I hold it, and what would change my mind.

### Hardware

1. **Inference will be most of AI compute demand, and its share keeps rising.** Training comes in big one-off runs; inference grows every day with users, and agents and long-thinking models make each request heavier. Would change my mind: training compute keeps climbing fast (for example, RL post-training scales up sharply), or inference gets efficient fast enough to offset growth in usage.

2. **Long context makes memory, not compute, the bottleneck, and HBM is the surest winner.** The longer the context, the bigger the KV cache, the fewer users each accelerator can serve, and the more HBM it needs. Would change my mind: KV cache compression or linear attention goes into mainstream models so memory stops growing with context, or the cache moves to DRAM and SSD at scale.

3. **MoE shifts pressure from compute to memory and interconnect.** MoE models have many parameters but use only a few at a time, so the limit is fitting and moving weights, not doing the math. Would change my mind: methods that compress or offload expert weights efficiently, or mainstream models moving back to dense designs.

4. **Lower precision (FP8 to FP4) is the main source of extra effective compute per chip in this generation.** Same chip, fewer bits, more work done; chips with native FP4 support gain an edge. Would change my mind: FP4 training keeps running into quality problems at scale and stays limited to inference.

### Software

5. **Open models stay within a few months of frontier models, which limits API pricing power for closed model companies.** DeepSeek and Qwen keep showing that frontier abilities reach open models within months, at a much lower price. Would change my mind: frontier labs open a lasting lead in reasoning or agents that open models can't close.

6. **Cheaper models move value to applications that own users and workflows.** Falling inference costs widen application margins, and the model becomes a swappable input. Would change my mind: frontier model companies build their own applications and take the users, or model abilities absorb what made applications different.

7. **Agents multiply tokens per user by an order of magnitude, the next driver of cloud and compute demand.** Multi-step tasks reread context, call tools, and check their own work, using far more tokens than chat. Would change my mind: agent frameworks cut token use sharply, or enterprises hold agents back from production over reliability.

### Across both

8. **Efficiency gains grow total demand instead of shrinking it.** Each drop in token price unlocks new uses, so usage grows faster than price falls. Would change my mind: after a big efficiency gain, usage growth slows clearly, a sign that demand is topping out.

## Open questions

* Does test-time compute (models that think longer) raise inference compute per query enough to matter?

* Will on-device models take a real share of inference away from data centers?

* When will agents be reliable enough for wide enterprise rollout?
