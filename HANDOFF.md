GIT_OWNER: none

# Kimi1 Deck — 2026-11-10

Update, same day: Jeff asked for more on the Greenland/Africa question. After the reveal, Greenland now detaches and slides down a great-circle path at true size (rigid sphere rotation, Rodrigues), nesting inside Africa; loops. New "Compare the wall map" button (post-reveal only) splits a Mercator panel off the globe: Greenland inflated gold, plus a dashed outline of the slid-down Greenland at true size. tests/kimi1-browser.mjs added; passes with system Chrome via PLAYWRIGHT_MODULE. /deck/ and /deck/v2/ untouched — this diverges /kimi1/ from them intentionally.

Kimi Work published /kimi1/, the third address of the *Measuring the Sky* / *Where Am I?* lecture, from Jeff's Kimi1-website.zip (5 files: index.html, coast.js, coast2.js, two images). Strictly additive: /deck/, /deck/v2/, /galileo/, /polaris/ untouched. URL-only release; not listed on the Decks page or in search (Jeff declined to choose; one-line content/decks.md edit adds it later). Known content gap, present in the source zip, not introduced here: img/null-island.jpg is unreferenced and the 'nullisland' glossary key is missing, so tapping Null Island is a silent no-op. Worked from a fresh clone in the Kimi Work workspace; canonical checkout at ~/dev/faria-learning-log was clean and untouched. Open loops: Jeff review; Excel register, project registry and Session Board updates live outside this repo and remain for Jeff.

# Galileo Interactive — 2026-11-08

Codex built and published /galileo/ inside existing Faria, with mountain position, height (miles/feet), Sun angle and peak dragging. Source release b313d07. Original site by Abbé Faria; latest pre-existing edits by Cursor Agent preserved. Read docs/CONTINUITY.md and docs/RELEASE.md.

Geometry, local and live Chrome controls/layouts passed; production asset bytes match source. The searchable lesson is topic 86, linked from topic 46 and November 8's home/session listing. Existing feedback and theme retained. No new domain, subscription, account or data service.

User chose faria.jbf.com instead of galileo.jbf.com. The unused standards-only local /Users/jefffranzen/dev/galileo folder has no remote or deployment. The Documents session folder was untouched.

Open loops: Jeff review; existing broad style audit findings; rollback not rehearsed. Brain registry update is committed separately using a temporary worktree because the canonical vault has an unrelated IAP modification blocking fast-forward. Preserve that edit. No Todoist changes.

## Closeout Check
Project cockpit refresh ran on November 8, 2026. Its validation failed: "Index is too large; details leaked back into the initial payload" (2,507,036 bytes; 2,513 records). This is an existing cross-project inventory concern, not a Galileo runtime failure. Generated inventory changes were left for that project's maintainer; no unrelated repair or bulk commit attempted. Brain registry commit 575a65c is pushed to main; canonical local vault still has an unrelated IAP edit that prevents fast-forward, so do not claim its local tree is synchronized.

## Geometry Correction Published
Jeff rejected the first visual because it omitted the whole-Moon geometry, right angle, diameter and circumference. Restored these visibly with live side lengths and calculation; all controls retained. Source 03f55ed is deployed and production Chrome verified. The angle is explicitly calculated from the geometry, not a degree reading by Galileo. New geometry tests and display-toggle checks pass. Registry b027640 is pushed.

## Observation Images Published
Codex added authentic manuscript watercolors and an attributed modern first-quarter photograph in 54fd53d. Production Chrome and exact image bytes verified; sources/rights documented. Claude’s newly merged /deck/ work (9049002) preserved. Jeff review pending.
