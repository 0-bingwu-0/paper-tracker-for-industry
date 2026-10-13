# What's New

Scan regularly so nothing important slips by. The digest stays light: I should be able to read it in a minute. Working out what a week adds up to is the [weekly summary](weekly.md)'s job, so a scan doesn't touch the research files.

## Pull papers

The source is [Hugging Face Daily Papers](https://huggingface.co/papers), a daily list of AI papers picked and upvoted by the community. Most work from closed labs and industry systems isn't in it. If I name a time range, use it. Otherwise cover the days since the latest dated digest in [output/digests/](../output/digests/); with no digest yet, the last 7 days. Run these from the project root, with the number of days:

```bash
node workflows/scripts/hf-papers.mjs sync 7
node workflows/scripts/hf-papers.mjs list 7
```

`sync` saves the papers to `library/hugging-face/`, one file per day. `list` prints one line per paper: date, upvotes, lab, arXiv ID, and title.

## Screen

1. **Titles:** From the list, pick the papers that may touch a direction, view, or question in the watchlist. Also pick papers outside the watchlist that could have a major effect on my field. A week of several hundred papers usually leaves a dozen or so worth a closer look. Upvotes show what people in the field are paying attention to, and help most in spotting important work outside the watchlist, but they don't decide: a relevant paper with few upvotes still counts, and a popular one that changes nothing for my work doesn't. Upvotes build up over days, so compare papers from the same day.
2. **Abstracts:** Print the full entries of the picks and read them:

   ```bash
   node workflows/scripts/hf-papers.mjs show 2610.07767 2609.38169
   ```
3. **Judge:** For each paper that still matters, work out what it achieved, what it changes for my work, and which view or question it touches, if any.

## Digest

Save it to `output/digests/YYYY-MM-DD.md`, then tell me the top one or two items in a few sentences and link the digest.

If the library had no papers before this scan, end by offering to fill in the last 90 days, so I can ask questions about earlier work. It takes about a minute. If I agree, run `node workflows/scripts/hf-papers.mjs sync 90`.

```markdown
# Digest · YYYY-MM-DD

Papers from YYYY-MM-DD to YYYY-MM-DD · N papers listed · Based on abstracts

## Could change a view

### 1. Qwen: FP4 moves into RL post-training, with rollouts up to 5.4x faster

**Supports** View 4 (Lower precision raises effective compute per chip)

What it shows and what it changes for my work, in two to four sentences. Limits stated plainly.

Sources: [TRACE](https://huggingface.co/papers/ID) (Qwen · N upvotes), [TRIAGE](https://huggingface.co/papers/ID) (InfiX.ai · N upvotes)

## Worth watching

* **Headline:** one or two sentences on why. Sources: [Short title](https://huggingface.co/papers/ID) (Lab · N upvotes)

## Not sure

* **Headline:** what's unclear and what would settle it. Sources: [Short title](https://huggingface.co/papers/ID) (Lab · N upvotes)
```

* Order by importance, most important first.
* Each headline is one line: who did it, what they achieved, and the key number if there is one. Not the paper's title; that goes in the sources.
* The label says how the item relates to the watchlist: **Supports** or **Challenges** a view, **Bears on** an open question, or **Outside the watchlist**. When a view is challenged, say exactly which part.
* Write only the one or two effects that really matter. Say plainly when the gain is small or far from use.
* When several papers point the same way, make one entry and list each paper in the sources.
* If a view already has a research file in `output/research/`, link it from the entry rather than repeating the background.
* Keep it short: at most five entries under "Could change a view" and eight under "Worth watching". A longer scan range picks the most important items, not more of them. Leave out empty sections. If nothing matters this time, say so in one line instead of filling the digest.
* The dates are the first and last days that had papers.
