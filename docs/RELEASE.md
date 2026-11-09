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
