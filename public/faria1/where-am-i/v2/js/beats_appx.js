/* beats_appx.js — Appendix (press A): Null Island, the date line, decimal places, the nautical mile. Not timed. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, AX = H.AX;
const { gOrb, gLook } = H;
const aP = { spin: 0, sunAz: -10, sunEl: 10, night: 1, clouds: .5, dim: 0, atmo: 1, det: 0, mwS: .4, expoS: 1, even: 0, slices: 0, unroll: 0, blur: 0, merAll: 0, eq: 0, mer0: 0, mer1: 0, mer2: 0, mer3: 0, merLon0: 0, hopT: 0, clkErr: 0, h4bg: 1, 'o.pbd': 0 };
const X = (o) => Object.assign({ act: AX, appendix: true, min: 0 }, o);
B(X({ id: 'nullisland', title: 'Null Island', sec: 'nullisland', seg: 0, env: 'space', dur: 6, xf: 2.2, cam: gLook(0, 0, .7, 16, 0, { fov: 34, shift: [.22, 0] }),
  p: Object.assign({}, aP, { eq: [1, 2], mer0: [1, 2], clouds: .18, sunAz: -55, sunEl: 25, night: 0, earth: 1 }), labels: [{ a: G.at(0, 0, 1.006), t: 'Null Island · 0°, 0°', cls: 'gold', side: 't', d: 2.4 }, { a: G.at(5.6, -.2, 1.006), t: 'Ghana', cls: 'dim nodot', side: 'r', d: 2.8 }],
  h: 'Null Island', hs: 1, l: '0°, 0°: open ocean in the Gulf of Guinea, more than 500 km off Ghana.', tpos: 'tl', tcls: 'scrim col', tdelay: 2, cue: '0°, 0° in the Gulf of Guinea.' }));
B(X({ id: 'nullpile', title: 'Failed geocodes pile up', sec: 'nullisland', seg: 1, dur: 4.5, cam: gLook(0, 0, .3, 12, 0, { fov: 34, shift: [.22, 0] }), p: { eq: .7, mer0: .7, clouds: .1 }, show: ['nullDots'],
  h: 'Bad records pile up here', hs: 1, l: 'When a geocoder fails, many tools quietly write zeros.', tpos: 'tl', tcls: 'scrim col', tdelay: 1.4, cue: 'Failed geocodes pile up at (0, 0).' }));
B(X({ id: 'nullfilter', title: 'Filter them out', sec: 'nullisland', seg: 2, dur: 4, cam: gLook(0, 0, .3, 12, 0, { fov: 34, shift: [.22, 0] }), p: { eq: .7, mer0: .7, clouds: .1 }, show: ['nullDots'],
  h: 'Filter exact (0, 0)', hs: 1, l: 'Before you map, drop exact zero pairs — and ask why they failed.<br><span style="font-family:Geist Mono;font-size:.85em;color:#F5D398">WHERE NOT (lat = 0 AND lon = 0)</span>', tpos: 'tl', tcls: 'scrim col', tdelay: 1, cue: 'Filter them out.' }));
B(X({ id: 'dateline', title: 'The date line', sec: 'dateline', seg: 0, dur: 6, cam: gOrb(10, 180, 4.6, 0, { fov: 34, shift: [.25, 0] }), p: { sunAz: 170, sunEl: 8, eq: 0, mer0: 0, clouds: .45, night: 1 }, show: ['idl', 'm180'],
  labels: [{ a: G.at(20, 180, 1.01), t: '180°', cls: 'dim nodot', side: 'l', d: 2 }, { a: G.at(-2, -150, 1.01), t: 'Date line (schematic)', cls: 'gold', side: 'l', d: 2.6 }],
  h: 'Halfway round: 180°', hs: 1, l: 'The International Date Line roughly follows it, bending so no country is split.', tpos: 'tl', tcls: 'col', tdelay: 2, cue: '180°, opposite Greenwich.' }));
B(X({ id: 'datejump', title: 'Cross it: a day jumps', sec: 'dateline', seg: 1, dur: 4, cam: gOrb(10, 180, 4.6, 0, { fov: 34, shift: [.25, 0] }), show: ['idl', 'm180'],
  labels: [{ a: G.at(30, 165, 1.01), t: '← westbound: +1 day', cls: 'gold nodot', side: 'l', d: 1 }, { a: G.at(30, -165, 1.01), t: 'eastbound: −1 day →', cls: 'nodot', side: 'r', d: 1.4 }],
  h: 'Cross it, and the calendar jumps', hs: 1, l: 'Heading west, a day ahead. Heading east, a day back.', tpos: 'tl', tcls: 'col', tdelay: 1, cue: 'Westbound: add a day.' }));
const dec = (() => { // Tufte table: decimal places → ground size (north–south), with a log-scale mark for each
  const rows = [[0, '111 km', 'a region', 111000], [1, '11 km', 'a town', 11100], [2, '1.1 km', 'a neighbourhood', 1110], [3, '111 m', 'a street', 111], [4, '11 m', 'a house', 11.1], [5, '1.1 m', 'a person', 1.11], [6, '11 cm', 'false precision', .111]];
  const lx = v => 560 + (Math.log10(v) + 1) / 6 * -300 + 300; let s = `<svg width="900" height="360" viewBox="0 0 900 360">`;
  s += `<text x="0" y="20" font-size="13" letter-spacing="1.6" fill="rgba(232,228,220,.55)">DECIMAL PLACES</text><text x="190" y="20" font-size="13" letter-spacing="1.6" fill="rgba(232,228,220,.55)">ABOUT</text><text x="330" y="20" font-size="13" letter-spacing="1.6" fill="rgba(232,228,220,.55)">ROUGHLY</text>`;
  rows.forEach(([d, sz, w, m], i) => { const y = 60 + i * 42, hl = d === 4 || d === 5, fp = d === 6; const c = fp ? 'rgba(229,138,110,.9)' : hl ? '#F5D398' : 'rgba(232,228,220,.85)';
    s += `<text x="0" y="${y}" font-family="Geist Mono" font-size="20" fill="${c}">${d === 0 ? '38' : '38.' + '8'.repeat(d)}</text><text x="190" y="${y}" font-size="19" fill="${c}">${sz}</text><text x="330" y="${y}" font-size="19" class="ser" fill="${c}">${w}</text>`;
    const x = 620 + (5 - Math.log10(m)) / 6 * 260; s += `<circle cx="${x}" cy="${y - 6}" r="4" fill="${c}"/>`; });
  s += `<line x1="620" y1="330" x2="880" y2="330" stroke="rgba(232,228,220,.35)"/><text x="620" y="352" font-size="12" fill="rgba(232,228,220,.5)">100 km</text><text x="880" y="352" font-size="12" text-anchor="end" fill="rgba(232,228,220,.5)">10 cm · log scale</text>`;
  return s + '</svg>'; })();
B(X({ id: 'decimals', title: 'How many decimal places?', sec: 'decimals', seg: 0, dur: 4.5, cam: gOrb(30, -60, 4.4, 0, { fov: 34 }), p: { blur: [.9, 2], expoS: [.4, 2], earth: [0, 1.2] }, show: [],
  fig: dec, figpos: 'fp-r', figd: 1, h: 'Each place: ten times finer', hs: 1, l: 'Four decimal places find a house. Five find a person.', tpos: 'tl', tdelay: 1, cue: 'Decimal places table.' }));
B(X({ id: 'falseprec', title: 'False precision', sec: 'decimals', seg: 1, dur: 4, p: { blur: .9, expoS: .4 }, fig: dec, figpos: 'fp-r', figd: 0,
  h: 'Six or more: false precision', hs: 1, l: 'A phone GPS is good to a few metres. (These sizes are north–south; east–west they shrink toward the poles.)', tpos: 'tl', tdelay: .6, cue: 'False precision warning.' }));
B(X({ id: 'nmile', title: 'The nautical mile', sec: 'nmile', seg: 0, dur: 5, cam: gLook(45, -30, .9, 10, 0, { fov: 34, shift: [.16, 0] }), p: { blur: [0, 1.5], expoS: [1, 2], merAll: [.6, 2], parAll: [.4, 2], earth: 1, sunAz: -35, sunEl: 35, night: 0, clouds: .3 }, show: [],
  h: '1° = 60 arcminutes', hs: 1, l: 'Each degree is split into sixty arcminutes.', tpos: 'tl', tcls: 'scrim', tdelay: 1.4, cue: '1° = 60 arcminutes.' }));
B(X({ id: 'nmile2', title: '1′ of latitude = 1 nautical mile', sec: 'nmile', seg: 1, dur: 4.5, cam: gLook(45, -30, .5, 10, 0, { fov: 34, shift: [.16, 0] }),
  h: '1′ of latitude = 1 nautical mile', hs: 1, l: 'On a chart, the latitude scale is a mileage scale.', tpos: 'tl', tcls: 'scrim', tdelay: 1, cue: '1 arcminute of latitude = 1 nautical mile.' }));
B(X({ id: 'nmile3', title: '1,852 metres exactly', sec: 'nmile', seg: 2, dur: 4, cam: gLook(45, -30, .5, 10, 0, { fov: 34, shift: [.16, 0] }),
  h: '1 nautical mile = 1,852 m', hs: 1, l: 'Exactly, by definition: about 6,076 feet.', tpos: 'tl', tcls: 'scrim', tdelay: 1, cue: '= 1,852 m exactly.' }));
})();
