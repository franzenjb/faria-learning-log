# Adding a session

Each day is one session file plus one file per topic. Nothing else needs editing: day pages, tag pages, related links, search and the Review page are all generated.

## 1. Add the day file
`content/sessions/2026-11-01.md` (the file name is the date):

```
---
title: Short title for the day
---
One or two sentences on what the session covered.
```

## 2. Add one file per topic
`content/topics/27-short-slug.md`. The number prefix just keeps files sorted; the slug becomes the URL (`/topics/27-short-slug/`).

```
---
title: The topic title
summary: One sentence shown on cards and search results.
session: 2026-11-01
order: 1
tags: [history-of-science, hurricanes]
---
## A subheading
Full lesson text. **bold**, *italic*, [links](../09-galveston-1900/), lists with "- ".

> Quotes go in lines starting with ">".

![Caption for the picture](../../img/Descriptive_Image_Name.png)

## Key facts
- One line per fact. Everything under "## Key facts" goes on the Review page.
```

- `session` is the day the lesson was first written. It stays that day. `order` sets the order among the new lessons of that day.
- To open an existing lesson again, add its slug to `revisits` on the later day file: `revisits: [18-eratosthenes-measures-the-earth, 53-captain-james-cook]`. Do not change the topic's `session`. The build rejects a missing slug, a repeated slug, and a slug that already belongs to that same day.
- A PDF is optional, and only after the page exists. Link it from the lesson and from `content/papers.md`. The binder is a compilation, not a lesson. An archival plate is named as a plate and still belongs to its lesson page. Do not leave a lesson PDF with no page.
- Tags are typed in frontmatter. The build does not invent them from the prose. Use a person, a place, a method, or a concept that the page actually teaches. Do not add a tag for a presentation deck, and do not add tags to hit a count.
- Nothing in a conversation becomes a page by itself. `print/emit_nov7_topics.py` was a one-shot writer for files already committed. `node build.mjs` only renders the markdown that is there.
- Reuse existing tags where possible (see `/tags/`): shakespeare, etymology, pronunciation, hurricanes, disasters, history-of-science, telegraph-cables, ships, verne, twain, dumas, geography, mathematics, astronomy, history. A new tag creates its own tag page automatically.
- Link to another topic with `../<slug>/`.

## 3. Add any graphics
Put PNG/JPG files in `public/img/` with descriptive names and reference them as `../../img/Name.png`.

## 4. Check and publish
```
node build.mjs          # prints the topic, session and tag counts
git add -A && git commit -m "Add session 2026-11-01" && git push
```
Vercel rebuilds and publishes on push to `main`.
