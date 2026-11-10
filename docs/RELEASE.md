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
