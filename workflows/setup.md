# Set Me Up

Make this project mine through a short Q&A. Ask these one at a time, and wait for each answer before asking the next. Keep each question to a sentence or two, with a quick example if it helps.

1. **What do you do?** Your role, your industry, and what you cover or work on.
2. **What do you want to keep up with in AI research?** The areas that touch your work.
3. **What views are you tracking, and what would change your mind?** The calls or assumptions your work depends on, and the open questions you want answered. For example, an investor might hold "Agents multiply tokens per user; I'd change my mind if agent frameworks cut token use sharply," and a product manager "Small models will be good enough for our on-device feature next year; I'd change my mind if quality on long inputs stays far behind." This matters most: papers are judged against it. If I'm not sure, suggest three or four from what I do and let me pick. If I skip the "change my mind" part, draft it yourself and show me.
4. **How should papers be explained to you?** How technical you are, and what terms you think in (cost, demand, competition, and so on).

If my setup message already answers some of these, skip them.

Then, in one go:

* Rewrite [profile.md](../context/profile.md) and [watchlist.md](../context/watchlist.md) from my answers, in my own words, under their headings. Drop the example content. Keep it short and specific. Write each view as one clear claim, a sentence on why, and what would change my mind, so a paper can clearly support or challenge it.
* Delete the example outputs: the files starting with `example` in [digests/](../output/digests/) and [research/](../output/research/). They were written for the example setup.
* Bring the library up to date. On a new project this fills it with the last 90 days; otherwise it only adds the newest days:

  ```bash
  node workflows/scripts/hf-papers.mjs sync 90
  ```

* Tell me it's done in a sentence or two, and that I can add views or questions anytime. Then offer three ways to start: scan the last week, ask a question, or build a research file for each of my views (see [research.md](research.md)).
