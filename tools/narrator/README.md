# Narrator's Deck

A PDF for the 30-minute talk. Each page has the slide thumbnail at the top, the lines to say (one per → press), and details and facts for questions.

Lines to say come from `TALK30` in `public/claude1/v3/course.js`. Facts live in `facts.mjs`.

```
node build.mjs && npx -y serve dist -l 8791
PW=/opt/node-tools/node_modules/playwright/index.mjs node tools/narrator/build.mjs /tmp/narrator
```
