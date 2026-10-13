# Paper Tracker for Industry

New AI papers come out every day, and some of them will change your industry long before it shows up in the products you use or the market you work in. But unless you do research for a living, you can't read them all, and most of them don't matter for your work.

This project has AI do the reading. It keeps a library of the papers the AI community is paying attention to, and does two things with it:

* **Tells you what's new.** It checks new papers against the views you're tracking, tells you which ones support or challenge them and why, and flags papers outside your list that could matter a lot.

* **Researches what you care about.** Ask about a trend, a view, or a paper, and it answers from the library, with sources. For each view you hold, it keeps one research file that says whether the view still stands, with the evidence underneath, and updates it as new papers come in.

It also learns as you use it: how you like things explained, and what you keep coming back to. It writes down what you ask it to directly, and checks with you before acting on anything it only inferred.

## Getting started

Open this project in StashBase and tell the Agent:

1. **"Set me up."** It asks you a few questions, one at a time: what you do, what you want to keep up with, which views you're tracking and what would change your mind, and how you want papers explained. Then it brings the library up to date.
2. **"Build research for each of my views."** For each view, it goes through the library, works out what supports and what challenges it, and saves one research file per view to `output/research/`.
3. **"What's new?"** Say it every day or so. It pulls recent papers from [Hugging Face Daily Papers](https://huggingface.co/papers), picks the few worth knowing, and saves a digest to `output/digests/`.
4. **"Weekly summary."** Say it once a week. It reads the week's digests, explains which views were supported or challenged, saves a summary to `output/weekly/`, and adds the new evidence to your research files.
5. **Ask anything.** For example, "What's new in KV cache compression, and what does it mean for memory demand?" or "Tell me more about the TRACE item."

The template comes with an example setup: a public-market analyst covering AI software and hardware, with a sample digest and a sample research file. You can try it as is before running setup. Running setup replaces the example with yours. The library starts empty. "What's new?" only pulls the last week; setup or the first question fills in the last 90 days, which takes about a minute.

## Make it yours

Setup covers most of it. You can also change things anytime:

* **Your background and how you want papers explained** are in `context/profile.md`.

* **The areas, views, and questions you're tracking** are in `context/watchlist.md`. When a paper gives a reason to change a view, the Agent tells you and updates it after you agree.

* **The Agent's persona and rules** are in `AGENTS.md`.

## Requirements

[Node.js](https://nodejs.org) 18+ and an Agent that can run local commands. Hugging Face Daily Papers is public, so no API key is needed.

## Files

* `AGENTS.md`: the Agent's persona, how it judges papers and learns about you, and the task index.

* `CLAUDE.md`: points Claude Code to `AGENTS.md`.

* `context/profile.md`: your background and how to explain papers to you.

* `context/watchlist.md`: the areas, views, and open questions you're tracking.

* `context/observations.md`: things the Agent has noticed about you but hasn't confirmed yet.

* `workflows/setup.md`: the setup Q\&A.

* `workflows/scan.md`: how to pull and screen new papers, and the digest format.

* `workflows/weekly.md`: how to sum up a week and update research.

* `workflows/research.md`: how to answer questions and keep a research file per view.

* `workflows/scripts/hf-papers.mjs`: saves Hugging Face Daily Papers to the library and lists them.

* `library/`: the papers, one folder per source and one file per day.

* `output/digests/`: one digest per scan.

* `output/weekly/`: one summary per week.

* `output/research/`: one research file per view.
