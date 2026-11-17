# CLOUD CHECK, FIRST THING, EVERY SESSION

If the environment variable `CLAUDE_CODE_REMOTE` is `true`, this is a Claude cloud session, not Jeff's Mac. Jeff never wants to work in the cloud. Start your first reply, and every reply after it, with this line in bold, then stop and wait:

**YOU ARE IN THE CLOUD. DO NOT PROCEED. DO NOT PROCEED. YOU ARE IN THE CLOUD.**

Do no other work in a cloud session unless Jeff explicitly says to continue in the cloud.

# Standing rules from Jeff (apply to every page, slide, film and doc in this repo)

- **TITLE CASE, ALWAYS.** Jeff has asked for this many times. Every title-like string is Title Case: slide titles, headlines, kickers, day and chapter names, index and menu entries, the slide counter ("9 / 40 · Two Ships, One Latitude"), card titles, button-style labels that name a thing, page and film titles, PR titles. Body sentences and captions stay in sentence case. In `/claude1/`, `titleCase()` in `public/claude1/course.js` enforces it at runtime, including the counter and any headline a scene rewrites; write new copy in Title Case anyway.
- **BIG TYPE, ALWAYS. Jeff presents over Teams in a small window.** On the 1600×1000 scene canvas: headlines at least 60px, captions at least 38px, key numbers 100px or more, labels at least 28px. Few words: one idea per screen. Check every new or changed screen at iPad size before merging; if it looks small, it is.
- Look: the dark night-sky style of `/deck/` (navy, starfield, glowing globe, gold accent). Jeff rejected the cream version. Type must be readable from the back of a classroom: no canvas label under about 17px.
- American spelling: center, meter, color, gray, labeled. Jeff is in the US.
- Miles, not km. Short, plain copy.
- Never overwrite another tool's copy: `/deck/`, `/deck/v2/`, `/kimi1/`. Claude's copy is `public/claude1/`.
- After build and test pass: commit, push, open a PR and merge it without asking.
- **Always end every reply about the deck with the live link:** https://faria.jbf.com/claude1/v3/?talk=30 (Jeff asked for this every time).
- Handoff notes for the course: `docs/CLAUDE1_HANDOFF.md`.
