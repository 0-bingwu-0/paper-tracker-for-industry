# Research

Digests and weekly summaries are what you push to me; this is for when I want to go deeper. It can be building research for my views ("Build research for each of my views", "Build research for this view"), one item from a digest ("Tell me more about the TRACE item"), a trend ("What's new in KV cache compression?"), a view ("Is anything challenging view 5?"), or one paper ("Tell me more about the DeepSeek paper").

When building research for my views, first check which views already have a file in `output/research/`. For a view without one, build it from scratch. You need to see the direction of travel, so go through the titles and abstracts of every paper in the library, not just a few search hits. For a view that already has one, add only papers since its last update, and skip it if there's nothing new. When a new view is added to the watchlist and I agree to research it, use the same steps for that view only.

## Find papers

1. Make sure the library covers the question:
   * If `library/hugging-face/` has no papers, or not much more than the last week, fill in the last 90 days first with `node workflows/scripts/hf-papers.mjs sync 90`. It takes about a minute; tell me that's what you're doing.
   * Otherwise, if the newest file is older than today, sync the latest days with `node workflows/scripts/hf-papers.mjs sync 7`.
2. Search `library/` for the question. Use the project search if you have it; otherwise search the files for key terms. Try a few phrasings, including the technical names for the idea.
3. Keep only the matches that are really about the question; keyword hits pull in a lot of noise. Read their full entries with `node workflows/scripts/hf-papers.mjs show ID...`. Also check past [digests](../output/digests/), [weekly summaries](../output/weekly/), and [research](../output/research/) on the same topic.
4. Read in full the one or two papers the answer leans on most, such as work from a lab that ships models, or the source of numbers you'll quote. The arXiv ID is in each entry. Try `https://arxiv.org/html/ID` first, and fall back to `https://arxiv.org/pdf/ID`.

## Answer

In chat, give the answer in a few sentences. When it's worth saving as research, use the structure below. When I open a research file, I want to see fast whether the view still holds and why, then check the evidence as far as I need. So the call comes first and the evidence after, each piece of evidence under the point it supports:

* **Top:** the title; the view as written, linked to [watchlist.md](../context/watchlist.md); and a last-updated line with the date, which stretch of papers was covered, and what was added. Overwrite it on every update.
* **Conclusion:** the heading states the call, such as "Holds", "Challenged", or "First half holds, second half challenged". Below it, a few sentences on why and where you're unsure.
* **At a glance:** split the view into the things to test: the reasons behind the view, plus each condition under "Would change my mind". One row each, with the direction of travel (with dates, so the trend shows) and whether it supports or challenges the view.
* **Point by point:** one section per row of the table, headed with the thing being tested and its call. Evidence in date order, each with the paper link, lab, month, whether you read the full paper or the abstract, and one line on what it found. Put inferences right next to the evidence and label them "My inference".
* **What to watch:** the signals that would move the conclusion again, including blind spots the library can't see.
* **How solid it is:** how many papers read in full and how many from abstracts, what kinds of labs and model sizes the evidence comes from, and where evidence is missing.
* **Suggested rewording:** only when the research gives a reason to change the view. Update the watchlist only after I agree.

The library only has the sources in `library/`, from the day it was first filled. Hugging Face Daily Papers covers AI papers the community picked; most work from closed labs and industry systems isn't there. If it doesn't cover the question well, say so plainly rather than stretching thin evidence.

## Save

Often I'm just asking in passing; answer in chat and don't save a file. Save to `output/research/` only what's worth keeping: new evidence for a view, a change in a conclusion, or when I ask you to. While we're still going back and forth, don't write yet; once the discussion settles, fold the conclusion in. Research is organized by the views in the watchlist, one file per view, as that view's evidence base:

* Work out which view this research lands on. If `output/research/` has a file for it, update that file: fold new evidence into the matching rows and sections, and rewrite the direction and conclusion if they changed. Don't create a new file, and don't append at the end. Only create a file when there isn't one, named with a short form of the view, such as `long-context-memory.md`, so I can tell from the folder which view it belongs to.
* A question that doesn't belong to any view, such as a new direction outside the watchlist, can get a file of its own. Once it becomes one of my views, reorganize it around the view.
* Before saving, check every claim against its source: each one can be found in the paper cited, one paper isn't presented as "several labs do this", and a design in a paper isn't presented as "shipped". I check the originals; one overstatement and I can't trust the whole file.
* Link the file in your reply. If the conclusion changed since last time, say what changed in one line.
