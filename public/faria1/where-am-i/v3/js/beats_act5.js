/* beats_act5.js — V · Zero is a choice: no natural zero, Ptolemy, Paris, Greenwich, the 1884 vote, GPS zero. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, RAD = H.RAD, A5 = H.A5;
const { gOrb, gLook } = H;
const zP = { spin: 0, sunAz: -25, sunEl: 18, night: .8, clouds: .5, dim: 0, atmo: 1, det: 0, moonlit: 0, fr: 1, mwS: .3, starsS: 1, expoS: 1, even: 0, slices: 0, unroll: 0, blur: 0,
  merAll: 0, merAllGold: 0, eq: 0, mer0: 0, mer1: 0, mer2: 0, mer3: 0, merLon0: 0, merLon1: -18, merLon2: 2.337, merLon3: -30, parAll: 0, rowA: 0, colA: 0, bloomS: 0, h4bg: 1 };
const zCam = gOrb(24, -22, 4.9, 0, { fov: 34, shift: [.22, 0] });
B({ id: 'nozero', act: A5, title: 'No natural zero', sec: 'zero', seg: 0, min: .35, env: 'space', dur: 7, xf: 2.8,
  fromCam: gOrb(30, -60, 5.2, 0, { fov: 34, shift: [.18, 0] }), cam: zCam, p: Object.assign({}, zP, { merAll: [1, 3, 2], eq: [1, 2.4, 1.2] }), drift: { az: -.6 }, driftFor: 200,
  labels: [{ a: G.at(0, -50, 1.01), t: 'Equator · nature’s zero', cls: 'gold', side: 'r', d: 2.6 }],
  h: 'Longitude has<br>no natural zero', hs: 1, l: 'Latitude starts at the equator. Every meridian runs pole to pole; not one is special.', tpos: 'tl', tcls: 'col', tdelay: 2.8,
  cue: 'The equator is natural; the meridians are all equal.' });
B({ id: 'askzero', act: A5, title: 'Where would you put zero?', sec: 'zero', seg: 1, min: .35, dur: 5, cam: gOrb(24, -28, 5.6, 0, { fov: 34, shift: [.28, 0] }),
  p: { merAll: .75, eq: .6 }, drift: { az: -.6 }, driftFor: 200,
  h: 'Where would <em>you</em> put zero?', hs: 2, l: 'Your hometown? Your chapter headquarters?', tpos: 'tl', tdelay: 1.2,
  cue: 'Ask the room: where would you put zero?' });
const plateCap = (t) => t;
B({ id: 'ptolemy', act: A5, title: 'Ptolemy: the Fortunate Isles', sec: 'zero', seg: 2, min: .35, dur: 6, cam: gLook(26, -14, .62, 22, 0, { fov: 34, shift: [-.2, 0] }),
  p: { merAll: [.18, 2], eq: .3, mer1: [1, 2, 1.2] },
  plate: { src: 'img/ptolemy1482.jpg', side: 'r', cap: 'Ptolemy’s world, printed at Ulm in 1482, from his Geography of about AD 150. Public domain.', h: '52vh', d: 2.6 },
  labels: [{ a: G.at(28.3, -16.5, 1.006), t: 'Fortunate Isles · the Canaries', cls: 'gold', side: 'r', d: 2.6 }],
  h: 'Ptolemy, about AD 150', hs: 1, l: 'Zero at the Fortunate Isles: the western edge of his known world.', tpos: 'bl', tcls: 'scrim col', tdelay: 2.2,
  cue: 'Ptolemy’s zero: the Canary Islands.' });
B({ id: 'paris', act: A5, title: 'Paris', sec: 'zero', seg: 3, min: .3, dur: 5.5, cam: gLook(47.5, 1.5, .5, 22, 0, { fov: 34, shift: [-.2, 0] }),
  p: { mer1: [.25, 2], mer2: [1, 2, .8] },
  plate: { src: 'img/obs_paris.jpg', side: 'r', cap: 'The Paris Observatory, about 1680. Public domain.', h: '46vh', d: 2.2 },
  labels: [{ a: G.at(48.836, 2.336, 1.006), t: 'Paris Observatory', cls: 'gold', side: 'r', d: 2.4 }],
  h: 'France counted from Paris', hs: 1, l: '', tpos: 'tl', tcls: 'scrim', tdelay: 2, cue: 'Paris.' });
B({ id: 'greenwich', act: A5, title: 'Greenwich, 1675', sec: 'zero', seg: 4, min: 0.4, dur: 6, cam: gLook(51.0, -.6, .42, 22, 0, { fov: 34, shift: [-.2, 0] }),
  p: { mer2: [.25, 2], mer0: [1, 2, .8] },
  plate: { src: 'img/greenwich1696.jpg', side: 'r', cap: 'The Royal Observatory from Crooms Hill, about 1696. Public domain.', h: '42vh', d: 2.4 },
  labels: [{ a: G.at(51.4779, 0, 1.006), t: 'Royal Observatory, Greenwich', cls: 'gold', side: 'r', d: 2.6 }],
  kick: 'Greenwich · 1675', h: '“…the so much desired longitude of places”', hs: 1, l: 'Charles II founds the Royal Observatory. Every country had a candidate; someone had to choose.', tpos: 'bl', tcls: 'scrim col', tdelay: 2,
  cue: 'Greenwich, founded 1675 “for the finding out of the so much desired longitude of places.”' });

/* ---------------- Washington, October 1884 ---------------- */
const tally = (hl) => { // 25 votes as 25 marks: 22 for, 1 against, 2 abstentions (Tufte: the data are the marks)
  let s = `<svg width="560" height="150" viewBox="0 0 560 150">`; let x = 0;
  for (let i = 0; i < 25; i++){ const k = i < 22 ? 'y' : i < 23 ? 'n' : 'a'; const X = 10 + i * 21 + (i >= 22 ? 14 : 0) + (i >= 23 ? 14 : 0);
    if (k === 'y') s += `<rect x="${X}" y="40" width="14" height="40" fill="#F5D398" opacity="${hl && hl !== 'y' ? .35 : 1}"/>`;
    else if (k === 'n') s += `<rect x="${X}" y="40" width="14" height="40" fill="#E58A6E" opacity="${hl && hl !== 'n' ? .4 : 1}"/>`;
    else s += `<rect x="${X + .75}" y="40.75" width="12.5" height="38.5" fill="none" stroke="#E8E4DC" stroke-width="1.5" opacity="${hl && hl !== 'n' ? .45 : 1}"/>`; }
  s += `<text x="10" y="28" font-size="14" letter-spacing="1.6" fill="#F5D398">22 FOR GREENWICH</text>`;
  s += `<text x="${10 + 22 * 21 + 14}" y="108" font-size="13" letter-spacing="1.2" fill="#E58A6E" text-anchor="middle">1 AGAINST</text>`;
  s += `<text x="${10 + 23 * 21 + 28 + 18}" y="132" font-size="13" letter-spacing="1.2" fill="#E8E4DC" text-anchor="middle">2 ABSTAIN</text>`;
  return s + '</svg>'; };
const vCam = gOrb(28, -40, 4.6, 0, { fov: 34, shift: [.16, -.02] });
B({ id: 'conference', act: A5, title: 'Washington, October 1884', sec: 'vote1884', seg: 0, min: 0.45, dur: 6.5, cam: vCam,
  p: { mer0: .35, merAll: 0, eq: 0, clouds: .45, sunAz: -40, sunEl: 15 }, show: ['nations'], drift: { az: -.5 }, driftFor: 200,
  plate: { src: 'img/delegates1884.jpg', side: 'l', cap: 'Delegates of the International Meridian Conference, Washington, October 1884. Public domain.', h: '34vh', d: 3 },
  labels: [{ a: G.at(38.9, -77.04, 1.006), t: 'Washington', side: 'r', d: 3.4 }],
  h: 'One zero for the world', hs: 1, l: 'Twenty-five nations, from Hawaii to Japan, meet in Washington to choose.', tpos: 'bl', tcls: 'col', tdelay: 3,
  cue: 'October 1884, Washington: the 25 voting nations.' });
B({ id: 'gwins', act: A5, title: 'Greenwich wins: 22 votes', sec: 'vote1884', seg: 1, min: 0.45, dur: 6, cam: gOrb(36, -25, 4.9, 0, { fov: 34, shift: [-.14, -.02] }),
  p: { mer0: [1, 2.5, 1.5] }, show: ['nations', 'yes', 'yesLines'], drift: { az: -.4 }, driftFor: 200,
  fig: tally(), figpos: 'fp-tr', figd: 2.6,
  labels: [{ a: G.at(51.4779, 0, 1.006), t: 'Greenwich', cls: 'gold', side: 'r', d: 3.2 }],
  h: 'Greenwich: 22 votes', hs: 1, l: 'Most of the world’s shipping already used charts based on Greenwich.', tpos: 'br', tdelay: 2.4,
  cue: 'Gold arcs fly to Greenwich: 22 votes for.' });
B({ id: 'abstain', act: A5, title: 'One against, two abstain', sec: 'vote1884', seg: 2, min: .4, dur: 5, cam: gOrb(26, -30, 5.6, 0, { fov: 34, shift: [-.2, -.02] }),
  p: { mer0: 1 }, show: ['nations', 'yes'], fig: tally('n'), figpos: 'fp-tr', figd: .4,
  labels: [{ a: G.at(18.47, -69.9, 1.006), t: 'San Domingo · against', cls: 'coral', side: 'l', d: 1.6 }, { a: G.at(48.86, 2.35, 1.006), t: 'France · abstained', side: 'r', d: 2.2 }, { a: G.at(-22.9, -43.2, 1.006), t: 'Brazil · abstained', side: 'l', d: 2.6 }],
  h: 'One against. Two abstain.', hs: 1, l: 'San Domingo, today’s Dominican Republic, voted no. France and Brazil abstained.', tpos: 'br', tcls: 'col', tdelay: 1.4,
  cue: '1 against (San Domingo); France and Brazil abstain.' });
B({ id: 'grads', act: A5, title: 'Paris, in grads, until 1999', sec: 'vote1884', seg: 3, min: 0.45, dur: 6, cam: gLook(47.2, 2.2, .55, 20, 0, { fov: 34, shift: [.16, 0] }),
  p: { mer0: .5, mer2: [1, 2, .8] }, show: [],
  labels: [{ a: G.at(48.836, 2.336, 1.006), t: 'Paris meridian', cls: 'gold', side: 'r', d: 2 }, { a: G.at(51.4779, 0, 1.006), t: 'Greenwich', side: 'l', d: 2.4 }],
  h: 'France didn’t give up easily', hs: 1, l: 'Its survey kept Paris as zero, often in grads (400 to a circle), until 31 December 1999.', tpos: 'bl', tcls: 'scrim', tdelay: 2,
  cue: 'France counts from Paris, in grads, until 31 Dec 1999; RGF93 from 1 Jan 2000.' });

/* ---------------- GPS zero is 102 m east of the brass line ---------------- */
const field = (() => { const M = 6.2, x0 = 60, X = m => x0 + m * M; let s = `<svg width="1080" height="435" viewBox="0 0 820 330">`;
  s += `<line x1="${X(0)}" y1="30" x2="${X(0)}" y2="250" stroke="#E8E4DC" stroke-width="3"/><line x1="${X(102)}" y1="30" x2="${X(102)}" y2="250" stroke="#F5D398" stroke-width="3"/>`;
  s += `<text x="${X(0)}" y="20" font-size="14" letter-spacing="1.4" text-anchor="middle">BRASS LINE · AIRY, 1851</text><text x="${X(102)}" y="20" font-size="14" letter-spacing="1.4" text-anchor="middle" fill="#F5D398">GPS ZERO · WGS 84</text>`;
  s += `<path d="M${X(0)} 70 H${X(102)}" stroke="#F5D398" stroke-width="1.2"/><text x="${X(51)}" y="60" text-anchor="middle" class="ser" font-size="30" fill="#F5D398">102 m · 335 ft</text>`;
  const fy = 150, fh = 80, yd = .9144; s += `<rect x="${X(0)}" y="${fy}" width="${100 * yd * M}" height="${fh}" fill="rgba(110,150,95,.18)" stroke="rgba(232,228,220,.5)"/>`;
  for (let i = 1; i < 10; i++) s += `<line x1="${X(i * 10 * yd)}" y1="${fy}" x2="${X(i * 10 * yd)}" y2="${fy + fh}" stroke="rgba(232,228,220,.25)"/>`;
  s += `<text x="${X(0)}" y="${fy + fh + 26}" font-size="13" fill="rgba(232,228,220,.6)">a football field, 100 yards (91 m), to the same scale</text></svg>`; return s; })();
B({ id: 'brassline', act: A5, title: 'The brass line', sec: 'gpszero', seg: 0, min: .25, dur: 5, cam: gLook(51.4779, 0, .05, 14, 0, { fov: 34 }),
  p: { mer0: [0, 1.5], mer2: 0, blur: [.8, 2.5], clouds: .2, dim: [.85, 2.5], expoS: [.45, 2.5] },
  plate: { src: 'img/meridian_photo.jpg', side: 'r', cap: 'The prime meridian at the Royal Observatory, Greenwich, 2011. Photo: Perituss, CC0.', h: '58vh', d: 1.4 },
  h: 'Stand on the line…', hs: 1, l: '…with your phone, and it won’t say zero.', tpos: 'bl', tdelay: 1.6, cue: 'The brass line at Greenwich.' });
B({ id: 'wgs84', act: A5, title: 'GPS zero: 102 m east', sec: 'gpszero', seg: 1, min: .25, dur: 4.5, p: { blur: .9, expoS: .3, dim: .92, mer0: 0 },
  fig: field, figpos: 'fp-b', figd: .8,
  h: 'GPS zero is 102 m east', hs: 1, l: 'A little longer than a football field.', tpos: 'tl', tdelay: 1, cue: 'GPS (WGS 84) zero: 102 m east.' });
B({ id: 'twoanswers', act: A5, title: 'Two good answers', sec: 'gpszero', seg: 2, min: .25, dur: 4.5, p: { blur: .9, expoS: .3, dim: .92, mer0: 0 },
  fig: field, figpos: 'fp-b', figd: 0,
  h: 'Nobody moved anything', hs: 1, l: 'The old line followed local gravity, which tilts slightly at Greenwich. GPS measures from Earth’s centre.', tpos: 'tl', tdelay: .6,
  cue: 'Two good answers, 102 m apart: local gravity vs. Earth’s centre.' });
})();
