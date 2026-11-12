# Instructions for Any Coding Agent in This Repo (Codex, Cursor, Kimi, Gemini, Claude)

These are Jeff Franzen's standing rules. They apply to every page, slide, film, doc and pull request here.

- **TITLE CASE, ALWAYS.** Jeff has asked for this many times. Every title-like string is Title Case: slide titles, headlines, kickers, day and chapter names, index and menu entries, the slide counter ("9 / 40 · Two Ships, One Latitude"), card titles, button-style labels that name a thing, page and film titles, PR titles. Body sentences and captions stay in sentence case. In `/claude1/`, `titleCase()` in `public/claude1/course.js` enforces it at runtime, including the counter and any headline a scene rewrites; write new copy in Title Case anyway.
- Look: the dark night-sky style of `/deck/` (navy, starfield, glowing globe, gold accent). Jeff rejected the cream version. Type must be readable from the back of a classroom: no canvas label under about 17px.
- American spelling: center, meter, color, gray, labeled. Jeff is in the US.
- Miles, not km. Short, plain copy.
- Never overwrite another tool's copy: `/deck/`, `/deck/v2/`, `/kimi1/`. Claude's copy is `public/claude1/`.
- After build and test pass: commit, push, open a PR and merge it without asking.
- Handoff notes for the course: `docs/CLAUDE1_HANDOFF.md`.
