# Film Edits for Grok: Scilly Cold Open (2026-11-17)

**For:** Grok Bot, owner of the film deck `public/faria1/where-am-i/v3/`
**From:** Claude, at Jeff's request. Claude did not edit the film files.
**Why:** Claude's talk deck (`/claude1/v3/?talk=30`) plays this film in an iframe as its cold open. Jeff asked for the two changes below. They belong in the film itself, so Grok makes them.

Live deck: https://faria.jbf.com/claude1/v3/?talk=30
Film: https://faria.jbf.com/faria1/where-am-i/v3/

---

## Edit 1: The Map Becomes Two Clean Beats

Jeff: remove all the lines, dots and the big title from the map. Make it two beats:
first **"They Believed They Were Here"**, set lower on the screen, then **"But They Were Here."**

Today the `actual` beat shows the dashed ghost track, the gold real track, the gap line,
the dot clusters at both positions, and the headline "Where they really were".
All of those come from the overlays `ghost`, `real` and `gap` (`js/space.js` lines 50–55)
and the beat's `h` / `l`.

**File:** `js/beats_v3.js`. Replace the two `cine('believed', …)` and `cine('actual', …)` calls
(around lines 146–155) with:

```js
cine('believed', { act: A1, min: .5,
  show: [], dropO: true, h: '', l: '',                 // no tracks, no dots, no headline
  cam: OLD.actual.cam,                                  // same framing as the next beat, so only the words change
  labels: [
    { a: G.at(49.45, -4.2), t: 'They Believed They Were Here', cls: 'ser nodot', side: 'b', d: 2.4 },
    { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' },
    { a: G.at(48.25, -3.4), t: 'Brittany', cls: 'dim nodot', side: 'r' } ],
  say: 'On the twenty-second, the navigators compare their reckonings. They believed they were here: safely west of Brittany, heading into the Channel.',
  notes: 'Dead reckoning: speed × time × heading, from the last known position. After days of storm, small errors pile up.' });
cine('actual', { act: A1, min: .5,
  show: [], dropO: true, h: '', l: '',
  labels: [
    { a: G.at(49.45, -4.2), t: 'They Believed They Were Here', cls: 'ser nodot', side: 'b', d: 0 },
    { a: G.at(49.872, -6.43), t: 'But They Were Here', cls: 'ser gold nodot', side: 't', d: 1.2 },
    { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' },
    { a: G.at(48.25, -3.4), t: 'Brittany', cls: 'dim nodot', side: 'r' } ],
  say: 'But they were here: farther north and west, heading straight for the Isles of Scilly, off the tip of Cornwall.',
  notes: 'Historians also blame charts that put Scilly in the wrong place, and poor latitude after days without a sight. But the problem no one at sea could solve was longitude.' });
```

**File:** `css/world.css`. Make the serif map labels big enough for a small Teams window
(about 61px on a 1600px-wide screen) and push the believed label lower:

```css
.lab.ser{ font-size:calc(var(--u)*3.8); }
.lab.ser.side-b span{ top:2.4em; }
```

Notes:
- The label keeps its text across both beats, so it stays on screen when "But They Were Here" fades in.
- `dropO: true` already exists in `cine()`; with `show: []` the resolver tweens `o.ghost`, `o.real` and `o.gap` to 0.
- Check that "set lower" reads right at 1600×1000 and at iPad size (1024×768). Nudge `top:2.4em` if needed.
- If no map dots remain, labels mark the places by position alone. That is what Jeff asked for.

---

## Edit 2: Shipwreck Debris Drifting on the Swell (the `toll` Beat)

Jeff: add shipwreck debris drifting on the swell, such as planks, a broken spar and a barrel.
Show it on the `toll` beat ("Four ships… Almost 2,000 men lost").

**File:** `js/sea.js`. After the Western Rocks block (around line 232), add:

```js
/* ---------------- wreckage: planks, a broken spar, a barrel (toll beat only, o.debris) ---------------- */
const debrisM = new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: .9, metalness: 0 });
const debris = [];
{ const C0 = [2330, 460], DV = [.715, -.699], NV = [.699, .715];   // toll camera position and view direction, in (a, b)
  [['plank', 90, -14], ['plank', 120, 10], ['spar', 150, -4], ['barrel', 105, 22],
   ['plank', 170, -26], ['plank', 210, 18], ['barrel', 190, -10], ['plank', 140, 34]].forEach(([k, s, l], i) => {
    const g = k === 'spar' ? new THREE.CylinderGeometry(.35, .5, 13, 8).rotateZ(Math.PI / 2)   // a broken topmast
            : k === 'barrel' ? new THREE.CylinderGeometry(.6, .6, 1.5, 12).rotateZ(Math.PI / 2)
            : new THREE.BoxGeometry(5 + (i % 3), .25, .7);
    const m = new THREE.Mesh(g, debrisM), p = at(C0[0] + DV[0] * s + NV[0] * l, C0[1] + DV[1] * s + NV[1] * l);
    m.userData = { x: p[0], z: p[2], yaw: i * 1.7, ph: i * 2.3 }; m.visible = false; scene.add(m); debris.push(m); }); }
W.param('o.debris', 0);
```

In `sea.update`, right after the "ships ride the swell" loop, add:

```js
  // wreckage rides the swell and drifts a little
  const dv = P['o.debris'] || 0;
  debris.forEach(d => { d.visible = dv > .01; if (!d.visible) return;
    const u = d.userData, x = u.x + Math.sin(T * .07 + u.ph) * 3, z = u.z + Math.cos(T * .05 + u.ph) * 3, e = 1.2;
    const h0 = heightAt(x, z, T), hx = heightAt(x + e, z, T), hz = heightAt(x, z + e, T);
    d.position.set(x, h0 - .15, z);
    d.rotation.set(Math.atan2(hz - h0, e), u.yaw + T * .03, -Math.atan2(hx - h0, e), 'YXZ'); });
```

**File:** `js/beats_v3.js`. In `cine('toll', { … })`, add `show: ['debris'],`.

Notes:
- The positions sit 90–210 m in front of the `toll` camera (`look(at(2330, 460, 24), …)`), spread left and right, so they fall inside the 44° view. Check that they are in frame and readable, and move or scale them if not.
- The wood color is lighter than the hulls (`0x241b15`) so it reads in the night storm. Adjust if it looks wrong under the lantern light.
- Debris uses the same `heightAt` swell as the ships, so it rides the same waves.

---

## After Grok Merges: Claude's One Follow-Up

Claude's slide (`public/claude1/v3/course-slides-v3.js`, `NEW_SLIDES['Scilly, 1707']`) currently
plays the beats `storm → actual → toll` and rewrites the `actual` headline and labels at runtime.
Once these film edits are live, Claude changes that slide to play `storm → believed → actual → toll`
and stops overriding `believed` and `actual`, so the film's new labels show through.

Already done on Claude's side (no film change needed): the line
"They knew their latitude, not their longitude." on the `toll` beat is now about 62px
on a 1600px-wide screen, up from about 48px.
