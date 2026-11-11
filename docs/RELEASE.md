# Galileo Release — November 8, 2026

Prepared by Codex within Faria, after Jeff replaced the initial galileo.jbf.com destination with faria.jbf.com.

- Original source: c2b918d, Cursor Agent's thumb-and-Moon update; preserved.
- New route: /galileo/; searchable lesson: /topics/86-galileo-moon-mountains/.
- Build: 84 topics, 8 sessions, 76 tags.
- Geometry: 2 Node tests pass, including independent ray/sphere comparisons.
- Local Chrome: sliders, mouse drag, keyboard, reset, themes, 320/390px widths, 150% text, home and lesson links passed; no JavaScript errors.
- Desktop and mobile screenshots inspected. Existing feedback reused; no submission made.
- Style audit: whole-site font/color findings remain outside the Galileo scope.
- Published to https://faria.jbf.com/galileo/ through existing Vercel project. Deployment: dpl_55FfkUqQ4pcGzZnPzG6n3KQpTk3j, source b313d07.
- Live Chrome: the same full control/navigation/layout suite passed; no JavaScript errors. Desktop/mobile light/dark screenshots inspected.
- Served assets match local bytes: galileo.js cf91d25c35481b15908b81622f9426977712b5d02f251a6d8da0057f263f0dd2; model.js 1334dda11cf8fea5006aef2a786617c4528cdeca798600d7c56369e6bcdceb91; galileo.css f6baf1da945b69eeb5a524ed82deaa61dae4a2e977f8162e09435ab06ed5e5f0.
- All three assets return public, max-age=0, must-revalidate.
- Remaining: Jeff's acceptance; rollback procedure documented, not rehearsed. Existing site-wide style audit findings remain outside scope.

## Geometry Correction — November 8 Eastern / November 9 UTC
Jeff identified that the first release omitted the geometry. Codex added the full Moon, visible diameter and circumference, actual calculated center angle, perpendicular square-corner marker, enlarged triangle and live Pythagorean height calculation. Position, height, Sun angle and direct peak dragging remain. Visibility toggles cover lines, distances and calculated angle. The lesson now explains that Galileo estimated a gap relative to the Moon's width; he did not need a degree marker. Historical one-twentieth-width observations are distinguished from the modern four-mile example.

Three geometry tests pass, including independent sunlight checks and triangle length/perpendicularity across the input ranges. Local Chrome checks pass for all previous controls plus geometry labels, live calculations and visibility toggles. Desktop, phone, light and dark screenshots inspected. Production verification of this revision follows below.

The geometry revision is live: source 03f55ed, Vercel dpl_CGdnJcG4xRRQH1N6dXYN8pHE7JFY. Production Chrome passed controls, drag, keyboard, geometry labels/toggles, live calculation, mobile sizes, text enlargement and navigation. All four served JS/CSS assets match local bytes and require cache revalidation. Geometry module SHA-256: b2ddfc22be9a0b21853d28afd34a1e982d95078ad185c631699b25818b02e99a. Registry update b027640 is pushed. User acceptance remains pending.

## Observation Gallery — November 8 Eastern / November 9 UTC
Added authentic manuscript drawings, a modern first-quarter Moon photograph, full-size links, source and license captions, and an explanation of the half-lit phase. Corrected the existing printed-illustration caption. Local Chrome passed image decoding, disclosure, sliders, geometry, drag, keyboard, themes and phone layouts. Desktop and 320px gallery screenshots inspected. Production evidence follows after deployment.

Published source 54fd53d through Vercel EfuyA2g5a3q1S5o1dy2qtSKTqQX7. Live Chrome passed the complete interaction/layout suite and gallery image decoding. Both new served images exactly match source bytes and return max-age=0, must-revalidate. Existing /deck/ returns HTTP 200. Desktop and phone gallery inspected. Jeff review remains pending.

## Kimi1 Deck — November 10, 2026

Jeff supplied Kimi1-website.zip: the third address of the *Measuring the Sky* / *Where Am I?* lecture, 18 scenes across four acts, from mental-map quizzes through the shelter decision brief. Kimi Work deployed it URL-only to /kimi1/ from a fresh workspace clone; the canonical checkout was clean and untouched. Strictly additive: /deck/, /deck/v2/, /galileo/, /polaris/ and all other public assets unchanged. Not listed on the Decks page or in search; owner deferred that choice.

- Build: 92 topics, 9 sessions, 81 tags. Unit tests 6/6 pass (galileo, polaris).
- Zip audit: all asset references local except one deliberate link to /deck/v2/. Known gap present in the source zip: img/null-island.jpg is unreferenced and the 'nullisland' glossary key is missing, so tapping Null Island is a silent no-op. Not introduced or fixed here.
- Published source 469a05e through git-connected Vercel dpl_J2H5gsEgUSQc29itS9VkAvq9jZn4.
- Served bytes at https://faria.jbf.com/kimi1/ exactly match the zip for all five files. SHA-256: index.html 6fc051b1397b7ccc6db541082ca21814c57f747e2cce0aae86462a8a4029bcfb; coast.js f5cf28ba1bc43547bed50a940c2cead649ead7b4fddb3ab6e98ce486e0279ef3; coast2.js a3ee9e1e2da06f945eb417820a4cbb89d53fce1e096ab55fb5d3f41d8bba1d6c; img/moon-first-quarter.jpg b40d2ebb814e0808286722b1ac375cb840ddf54e7c4ae331f1490ed306283990; img/null-island.jpg 84ff504ebffbefffaf837b5af740501b41e27a69a88da4a54f6024032e4e377a.
- All return public, max-age=0, must-revalidate. Preserved routes verified live: /, /deck/, /deck/v2/, /galileo/, /polaris/, /decks/, /search/ all HTTP 200.
- Remaining: Jeff review; in-browser interaction pass not run (no Playwright in the deployment workspace); Excel register, project registry and Session Board updates live outside this repo and remain for Jeff.

## Kimi1 Greenland Reveal — November 10, 2026

Jeff asked for more on the Greenland/Africa mental-map question. After the reveal, Greenland now detaches and slides down a great-circle path at true size (rigid rotation on the sphere; Rodrigues), nests inside the Congo basin, and the cycle loops for the room. A new post-reveal "Compare the wall map" button splits a Mercator panel off the globe: Greenland inflated gold as on a wall map, with a dashed outline of the same Greenland at true size beside Africa. Reduced-motion users get the final nested state directly. Reveal copy updated to point at both visuals. /kimi1/ only; /deck/ and /deck/v2/ untouched.

- New tests/kimi1-browser.mjs: Q4 voting/reveal, wall-map button visibility rules (hidden pre-reveal, on question switch, on clear), toggle labels, navigator, reduced motion, 390px phone with panel open and no horizontal overflow. Passes locally in Chrome (PLAYWRIGHT_MODULE) and again against production.
- Build: 92 topics, 9 sessions, 81 tags. Unit tests 6/6 (galileo, polaris).
- Published source 8db648b via git-connected Vercel. Served /kimi1/index.html matches local build bytes exactly; /kimi1/ 200; /deck/, /deck/v2/, /galileo/, /polaris/ all 200 after the deployment.
- Live Chrome: full suite plus screenshot inspection of the nested state and the wall-map split at 1440×900; no JavaScript errors.
- Remaining: Jeff's acceptance of the new visuals; the null-island glossary gap from the source zip remains open.

## Kimi1 Mercator Conversion — November 10, 2026

Jeff: "can we show the mercator conversion to the globe." The side-by-side panel is replaced by the transformation itself. On the Greenland/Africa question, "Compare the wall map" now unrolls the whole stage: longitude unwraps (sin d → d), latitude stretches (sin φ → ln tan — the Mercator stretch), the ocean disc and rim fade, and Greenland rides along, inflating to wall-map size with a "roughly tenfold" note. "Back to the globe" wraps it shut and restarts the slide-down. Drag and zoom lock while flat, with the hint line saying so. All labels morph with their features. 2.4 s eased morph both ways.

- Local Chrome: six-frame morph sequence inspected (nested → early/late unroll → flat → mid-wrap → back); no JavaScript errors.
- tests/kimi1-browser.mjs passes locally and against production; unit tests 6/6; build clean (92/9/81).
- Published source 9c5b562 via git-connected Vercel. Served /kimi1/index.html matches local bytes; live morph screenshots inspected; no live JS errors.

## Polaris Layout Rework — November 10, 2026

Jeff rejected the left-column layout: "greatly increased the graphics, shrink the huge lat long numbers, slider and title horizontal top." On wide screens the page is now a horizontal band on top (title and lede in one baseline row; slider, endpoints and preset buttons in a single grid strip) with the two diagrams as the heroes below, sized to the viewport. Readout numbers shrink from 44/50px to 26–32px. CSS only; every element ID and behavior untouched. public/polaris/walk.css only.

- Build clean (92 topics, 9 sessions, 81 tags); unit tests 6/6; tests/polaris-browser.mjs passes in local Chrome (slider, presets, right-angle toggle, keyboard, play/pause, 320/390/768px no-overflow, deck links).
- Published source f6f9234 via git-connected Vercel. Served https://faria.jbf.com/polaris/walk.css matches local bytes exactly (cmp). Desktop 1440×900 and phone 390×844 screenshots inspected.
- Remaining: Jeff's acceptance of the new layout.

## Kimi1 Polish Trio — November 10, 2026

Three Jeff requests on /kimi1/. (1) The Latitude & Longitude globe now loads with the latitude and longitude line overlays OFF; the toggles still bring them back, and place markers including Null Island stay on. (2) The null-island glossary gap from the source zip is closed: tapping the Null Island marker opens a photo card with the "Welcome to Null Island" image (already shipped as img/null-island.jpg — Jeff's re-supplied photo is the same shot) plus the buoy-and-bad-data explanation. (3) On "Latitude = star height", the word Euclid is now a tappable term opening a card with a diagram of the actual proof: both sides of the angle turned 90°, measure unchanged, no triangles. public/kimi1/index.html only.

- Build clean (92/9/81); unit tests 6/6; tests/kimi1-browser.mjs passes in local Chrome.
- Published source ff226f2 via git-connected Vercel. Served https://faria.jbf.com/kimi1/ matches local bytes exactly (cmp). Local 1440×900 screenshots inspected: clean globe on load, Null Island card with photo, Euclid card with diagram.
- Remaining: Jeff's acceptance; live visual pass on his screen.

## Kimi1 Latitude Slide: Walker and Labels — November 10, 2026

Jeff on "Latitude = star height": labels need breathing room, the observer should walk when dragged, and be less of a stick figure. The horizon label moved from the north end of the horizon line (where it collided with the star-altitude tag) to the south end, outside the globe; the altitude tag sits further out along the angle bisector; the "you · drag me" hint shifted south of the figure and hides after the first canvas drag. The observer is now a solid little walker — thick torso, head, one arm raised to Polaris — with two-segment knees that stride as latitude changes and settle when the drag stops; the figure faces the direction of travel. public/kimi1/index.html only.

- Build clean (92/9/81); tests/kimi1-browser.mjs passes in local Chrome.
- Published source 862c361 via git-connected Vercel. Served https://faria.jbf.com/kimi1/ matches local bytes exactly (cmp). Local screenshots inspected at 8°, 60° (rest), and mid-stride at 78°.
- Remaining: Jeff's acceptance.

## Kimi1 Two Clocks on the Hours Slide — November 10, 2026

Jeff: "why not show two clocks on the ship and greenwich time and hands move as we spin wheel and solve for time gap and degrees longitude." The Hours are slices slide now draws two 24-hour clock faces top-right whenever the ship is placed: the ship's local sun time (gold) and Greenwich (green). Both hands sweep as the Earth spins; the gap between them is constant for a fixed ship and equals the longitude. Until the chronometer (or the Jupiter/almanac mode) is on, the Greenwich face is veiled with a red "?" — unseen at sea — and the equation under the clocks reads "? h × 15° = ? °"; with a time source it solves live: "0.8 h × 15° = 13° west". public/kimi1/index.html only.

- Build clean (92/9/81); tests/kimi1-browser.mjs passes in local Chrome; no page errors in veiled, chronometer, and spinning states.
- Published source 5f879d5 via git-connected Vercel. Served https://faria.jbf.com/kimi1/ matches local bytes exactly (cmp). Screenshots inspected: ship at 12:52 vs Greenwich 13:42 with the 0.8 h = 13° west solution while spinning.
- Remaining: Jeff's acceptance.

## Kimi1 Presenter Pass — November 11, 2026

Four Jeff requests in one pass. (1) Hours are slices now opens with the ship already placed at its local noon, a chronometer aboard, and Greenwich reading exactly 1 pm, so the two clocks show 12:00 against 13:00 and the solved equation 1.0 h × 15° = 15° west; paused until Resume. (2) The Syene "well" on the Eratosthenes slide is now a well: stone collar on the surface, tapered shaft into the Earth, the noon beam running down it to a lit pool of water; the misleading stick above ground is gone. (3) Presenter keys: L hides/shows the left text panel on every slide (stage goes full-bleed), M opens the mental-map question menu from any slide and jumps straight to the chosen quiz question. Both are listed in the navigator's help line. (4) The explainer box no longer covers the wheel: it is gone whenever the text panel is visible (the readout carries the same lines) and reappears, narrowed, only in L-mode where it is the only text. public/kimi1/index.html only.

- Build clean (92/9/81); tests/kimi1-browser.mjs passes in local Chrome; screenshots inspected: 1 pm clocks, well close-up, clean wheel, L-mode full stage, M menu and the Greenland-or-Africa jump landing on Mental maps with the question armed. No page errors.
- Published source dcecc50 via git-connected Vercel. Served https://faria.jbf.com/kimi1/ matches local bytes exactly (cmp).
- Remaining: Jeff's acceptance.
