/* S22 · Name 10 jobs in 10 seconds (motion v2)
 *
 *  0.00  Hook, legible from the first frame: the headline, the mark, ten empty boxes.
 *  1.55  The camera dives into the "10" of "10 seconds" and the world turns orange.
 *  2.00  GO! That 10 is now the timer: rolling digits, a stepped ring, and pace boxes that
 *        fill on the off-beats, one job a second.
 * 12.00  TIME. on ink. How many did you get?
 * 14.00  Ladder wipe. Now, how many of those have you actually watched someone do, UP CLOSE?
 * 17.58  Whip pan down to your ten boxes, then a pull-back: a wall of jobs you've never seen up close.
 * 22.00  Make it bigger: orange floods out from your ten until it fills the frame.
 * 23.25  Comment your number. The ident.
 * 25.62  Ladder wipe back to the hook, so the Short loops without a seam.
 *
 * Music: 120 BPM, 13 bars. Every hit sits on the same grid as the picture.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 26, bg: C.paper, chip: 'Quick test', theme: 'light', grain: 0.06 });

  // ---------------------------------------------------------------- hook
  function hook(parent, live) {
    const h = {};
    h.head = K.lines(parent, { lines: ['NAME', '10 JOBS'], x: 72, y: 500, size: 188, lh: 0.9 });
    const box = K.el('div', 'mbox display', parent);
    K.css(box, { left: '72px', top: '900px', fontSize: '96px', letterSpacing: '-0.02em' });
    const m = K.el('div', 'mark', box);
    h.sh = K.el('div', 'msh', m); h.sh.style.background = C.ink;
    h.bg = K.el('div', 'mbg', m); h.bg.style.background = C.orange; h.bg.style.boxShadow = `inset 0 0 0 6px ${C.ink}`;
    const tx = K.el('div', 'mtext', K.el('div', 'mmask', m));
    h.a = K.el('span', 'hw', tx, 'IN'); tx.appendChild(document.createTextNode(' '));
    h.ten = K.el('span', 'hw', tx, '10'); tx.appendChild(document.createTextNode(' '));
    h.b = K.el('span', 'hw', tx, 'SECONDS.');
    gsap.set(h.sh, { x: 12, y: 12, autoAlpha: 1 });
    h.boxes = Array.from({ length: 10 }, (_, k) => {
      const b = K.el('div', 'hbox', parent);
      K.css(b, { left: 72 + k * 80 + 'px', top: '1096px' });
      return { b, f: K.el('i', '', b) };
    });
    return h;
  }

  const hookScene = K.scene(0, 2.0);
  const H = hook(hookScene, true);
  K.check(H.head.box, 0.2, 'hook headline');
  K.check(H.boxes[9].b, 0.2, 'hook boxes');

  // A light runs along the empty boxes on the beat: the game board, waiting.
  H.boxes.forEach((o, k) => {
    tl.fromTo(o.f, { scale: 0 }, { scale: 1, duration: 0.14, ease: 'power3.out' }, 0.5 + k * 0.05);
    tl.to(o.f, { scale: 0, duration: 0.26, ease: 'power2.in' }, 0.64 + k * 0.05);
  });

  // The dive: everything else leaves, the camera accelerates into the 10, the world turns orange.
  const CX = 540, CY = 820, DIG = 520;
  const ten = K.box(H.ten);
  K.drift(0, 1.55, { from: 1, to: 1.025 });
  K.unreveal(H.head, 1.46, { stagger: 0.03, dur: 0.3 });
  tl.to([H.a, H.b], { yPercent: -125, duration: 0.3, ease: 'expo.in', stagger: 0.05 }, 1.5);
  tl.to(H.boxes.map(o => o.b), { y: 160, autoAlpha: 0, duration: 0.3, ease: 'expo.in', stagger: 0.012 }, 1.46);
  tl.to(H.sh, { x: 0, y: 0, autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, 1.55);
  tl.fromTo(H.bg, { boxShadow: `inset 0 0 0 6px ${C.ink}` }, { boxShadow: `inset 0 0 0 0px ${C.ink}`, duration: 0.22, immediateRender: false }, 1.55);
  tl.to(K.cam, { ...K.frameOn(ten.cx, ten.cy, DIG / 96, CX, CY), duration: 0.45, ease: 'expo.in' }, 1.55);
  // The mark's orange box opens up and swallows the frame.
  tl.to(H.bg, { scaleY: 34, scaleX: 1.6, transformOrigin: '50% 50%', duration: 0.3, ease: 'expo.in' }, 1.68);
  tl.set(K.bgl, { backgroundColor: C.orange }, 1.985);
  K.theme('orange', 1.94);
  K.sfx('whoosh', 1.42, 1.1, { dur: 0.62, up: true });

  // ---------------------------------------------------------------- countdown
  const cd = K.scene(2.0, 12.0);
  K.camSet(2.0, { scale: 1, x: 0, y: 0 });
  const R = 330;
  const svg = K.svg(cd);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2, major = i % 6 === 0;
    const r0 = R + 40, r1 = R + (major ? 74 : 56);
    const p = K.path(svg, `M${CX + r0 * Math.cos(a)},${CY + r0 * Math.sin(a)} L${CX + r1 * Math.cos(a)},${CY + r1 * Math.sin(a)}`, { stroke: C.ink, width: major ? 8 : 4, cap: 'butt' });
    p.style.opacity = major ? 1 : 0.4;
  }
  const circle = `M${CX},${CY - R} A${R},${R} 0 0 1 ${CX},${CY + R} A${R},${R} 0 0 1 ${CX},${CY - R}`;
  K.path(svg, circle, { stroke: C.ink, width: 26, cap: 'butt' }).style.opacity = 0.14;
  const arc = K.path(svg, circle, { stroke: C.ink, width: 26, cap: 'butt' });
  const knob = document.createElementNS(K.NS, 'circle');
  knob.setAttribute('r', 22); knob.setAttribute('fill', C.paper2); knob.setAttribute('stroke', C.ink); knob.setAttribute('stroke-width', 8);
  svg.appendChild(knob);
  const L = 2 * Math.PI * R;
  const ring = { p: 0, drawn: 0 };
  tl.fromTo(ring, { drawn: 0 }, { drawn: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 2.0);
  for (let s = 3; s <= 11; s++) tl.to(ring, { p: (s - 2) / 10, duration: 0.42, ease: 'expo.out' }, s);
  K.frame(() => {
    const vis = Math.max(0, ring.drawn - ring.p);
    arc.setAttribute('stroke-dasharray', `${vis * L} ${L * 2}`);
    arc.setAttribute('stroke-dashoffset', `${-ring.p * L}`);
    const a = -Math.PI / 2 + 2 * Math.PI * (ring.drawn < 1 ? ring.drawn : ring.p);
    knob.setAttribute('transform', `translate(${CX + R * Math.cos(a)},${CY + R * Math.sin(a)})`);
  });

  const digits = K.roller(cd, { x: CX - 400, y: CY - DIG / 2, w: 800, h: DIG, size: DIG, values: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'] });
  digits.win.style.letterSpacing = '-0.02em';
  // The ring is a porthole: digits roll through its inner edge, not through a hidden box.
  K.css(digits.win, { overflow: 'visible', clipPath: `circle(${R - 13}px at 400px ${DIG / 2}px)` });
  digits.spans.slice(7).forEach(s => { s.style.color = C.paper2; s.style.textShadow = `16px 16px 0 ${C.ink}`; });
  for (let s = 1; s <= 9; s++) K.rollAt(digits, s, 2 + s, { dur: 0.32, sfx: 'tick', gain: s >= 7 ? 1.2 : 1 });

  // One box a second, on the off-beat: the pace you'd need.
  const pace = Array.from({ length: 10 }, (_, k) => {
    const b = K.el('div', 'pbox', cd);
    K.css(b, { left: 266 + (k % 5) * 114 + 'px', top: 1290 + ((k / 5) | 0) * 114 + 'px' });
    return { b, f: K.el('div', 'pfill', b), n: K.el('div', 'pnum', b, String(k + 1)) };
  });
  K.check(pace[9].b, 11.9, 'pace boxes');
  tl.fromTo(pace.map(p => p.b), { scale: 0, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.022 }, 2.04);
  pace.forEach((p, k) => {
    const t = 2.5 + k;
    tl.fromTo(p.f, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, t);
    tl.set(p.n, { color: C.orange, opacity: 1 }, t + 0.04);
    K.sfx('pop', t, 0.9, { note: k });
  });

  // Every second the frame punches in; the last three hit harder.
  for (let s = 3; s <= 11; s++) {
    const hard = s >= 9;
    tl.fromTo(K.cam, { scale: hard ? 1.065 : 1.028 }, { scale: 1, duration: 0.55, ease: 'expo.out', immediateRender: false }, s);
    if (hard) { K.shake(s, { amp: 10, dur: 0.32, rot: 0.35 }); K.flash(s, { color: C.ink, a: 0.1, dur: 0.22 }); }
  }

  // The instruction sticker changes as the pressure builds.
  const goScene = K.scene(1.8, 12.0);
  const labels = [['GO!', 2.0, 2.86], ['OUT LOUD!', 3.0, 8.86], ['FASTER!', 9.0, 99]].map(([text, t, out]) => {
    const s = K.stamp(goScene, { text, x: 540, y: 330, size: t === 2.0 ? 124 : 88, color: C.ink, bg: C.paper2, rot: -4, shadow: C.ink });
    if (t === 2.0) K.slam(s, t, { from: 2.4, shake: 30, flash: 0.3, dust: C.ink, gain: 1.15, seed: 3 });
    else K.slam(s, t, { from: 1.7, shake: 10, flash: 0, dust: null, sfx: 'thud', gain: 0.55 });
    if (out < 99) tl.to(s, { scale: 0.5, autoAlpha: 0, rotation: '-=16', duration: 0.14, ease: 'expo.in' }, out);
    K.check(s, t + 0.5, text);
    return s;
  });

  // ---------------------------------------------------------------- time
  const ts = K.scene(11.8, 14.0);
  K.bg(C.ink, 12.0); K.theme('dark', 12.0);
  const time = K.stamp(ts, { text: 'TIME.', x: 540, y: 850, size: 230, color: C.orange, rot: -7 });
  K.slam(time, 12.0, { from: 2.8, shake: 38, flash: 0.45, dust: C.orange, seed: 12, gain: 1.1 });
  K.sfx('boom', 12.0, 0.9);
  const got = K.lines(ts, { lines: ['How many did you get?'], font: 'serif', size: 84, color: C.paper, x: 72, y: 1100, w: 936, align: 'center' });
  K.reveal(got, 12.5, { stagger: 0.05, dur: 0.7 });
  K.check(time, 12.6, 'TIME.');
  K.check(got.box, 13.3, 'how many did you get');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.06, duration: 1.9, ease: 'none', immediateRender: false }, 12.0);

  // ---------------------------------------------------------------- question
  K.ladder(14.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 14.0); K.theme('light', 14.0); K.camSet(14.0, { scale: 1, x: 0, y: 0 });
  const qs = K.scene(14.0, 18.2);
  const q = K.lines(qs, { lines: ['Now, how many', 'of those have you', 'actually watched', 'someone do,'], font: 'serif', size: 138, lh: 1.0, x: 72, y: 360 });
  K.reveal(q, 14.08, { stagger: 0.034, dur: 0.72 });
  const up = K.marks(qs, { lines: ['UP CLOSE?'], x: 72, y: 1000, size: 118 });
  K.markIn(up, 16.0);
  K.sfx('thud', 16.0, 0.6);
  K.check(q.box, 15.6, 'question');
  K.check(up.box, 16.8, 'UP CLOSE?');
  // Rack focus: the question drops back, the camera leans into the mark.
  const mb = K.box(up.rows[0].m);
  tl.fromTo(q.box, { filter: 'blur(0px)', opacity: 1 }, { filter: 'blur(6px)', opacity: 0.5, duration: 0.7, ease: 'power2.out', immediateRender: false }, 16.1);
  tl.to(K.cam, { ...K.frameOn(mb.cx, mb.cy, 1.12, 520, 1040), duration: 1.5, ease: 'power3.out' }, 16.0);

  // ---------------------------------------------------------------- the wall of jobs
  // Whip pan straight down to the next scene, which sits below this one in the world.
  const Y0 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y0 + 960, 1), duration: 0.42, ease: 'whip' }, 17.58);
  K.sfx('whoosh', 17.48, 1, { dur: 0.6, up: false });
  const gs = K.scene(17.5, 23.8);
  gs.style.top = Y0 + 'px';
  const cv = K.el('canvas', 'layer', gs); cv.width = 1080; cv.height = 1920;
  const g = cv.getContext('2d');
  const P = 114, S = 92, ZEND = 0.1, AX = 660, AY = 1180;
  const hash = (c, r) => { const x = Math.sin(c * 127.1 + r * 311.7) * 43758.5453; return x - Math.floor(x); };
  const backOut = p => { const s = 1.9; p = K.clamp(p) - 1; return 1 + (s + 1) * p * p * p + s * p * p; };
  const zoomAt = t => Math.exp(Math.log(ZEND) * K.easeInOut((t - 19.0) / 1.8));
  const anchorAt = t => { const p = K.easeInOut((t - 19.0) / 1.8); return [540 + (AX - 540) * p, 960 + (AY - 960) * p]; };
  const born = (c, r) => 18.45 + Math.hypot(c, r - 0.5) * 0.019 + hash(c, r) * 0.12;
  const flooded = (c, r) => 22.0 + Math.hypot(c, r - 0.5) * (ZEND * P) / 1150 + hash(r, c) * 0.06;
  const inBlock = (c, r) => r >= 0 && r <= 1 && c >= -2 && c <= 2;
  K.frame(t => {
    if (t < 17.4 || t > 23.85) return;
    g.clearRect(0, 0, 1080, 1920);
    const z = zoomAt(t), [ax, ay] = anchorAt(t), pz = P * z;
    const grow = K.easeInOut((t - 23.12) / 0.36);
    const c0 = Math.floor(-ax / pz) - 1, c1 = Math.ceil((1080 - ax) / pz) + 1;
    const r0 = Math.floor((-ay) / pz + 0.5) - 1, r1 = Math.ceil((1920 - ay) / pz + 0.5) + 1;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const mine = inBlock(c, r);
        let k = 1, col = mine ? C.ink : '#DCD7CD';
        if (!mine) { const b = born(c, r); if (t < b) continue; k = backOut((t - b) / 0.3); }
        const tf = mine ? 22.0 : flooded(c, r);
        let side = S + (P - S) * grow;
        // Flooded tiles pop past the pitch and settle there, so the flood is solid behind its edge.
        if (t >= tf) { col = C.orange; side = S + (P + 1.5 / z - S) * backOut((t - tf) / 0.34); }
        const size = side * z * k;
        const x = ax + c * pz, y = ay + (r - 0.5) * pz;
        g.fillStyle = col;
        g.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  });
  K.sfx('thud', 18.0, 0.5);
  K.sfx('shimmer', 18.45, 0.55, { dur: 1.7 });
  K.sfx('whoosh', 18.95, 0.45, { dur: 1.9, up: false });

  const y10 = K.lines(gs, { lines: ['YOUR 10'], x: 72, y: 745, size: 64, align: 'center', w: 936 });
  K.reveal(y10, 18.05, { stagger: 0.06 });
  K.unreveal(y10, 18.85);
  K.check(y10.box, 18.6, 'YOUR 10');

  const l1 = K.lines(gs, { lines: ['THAT’S THE LIST'], x: 72, y: 372, size: 92 });
  const l2 = K.lines(gs, { lines: ['you’re choosing your', 'future from.'], font: 'serif', size: 104, lh: 1.0, x: 72, y: 474 });
  K.reveal(l1, 19.5, { sfx: 'pop', gain: 0.5 });
  K.reveal(l2, 19.86, { stagger: 0.04, dur: 0.7 });
  K.check(l1.box, 21.0, 'that’s the list');
  K.check(l2.box, 21.0, 'choosing your future from');
  const gsv = K.svg(gs);
  const A = K.arrow(gsv, [[575, 690], [760, 780], [560, 1010], [642, 1122]], { stroke: C.orange, width: 12, head: 40 });
  K.drawArrow(A, 20.45, 0.5);
  const halo = K.path(gsv, `M${AX},${AY - 62} A62,62 0 1 1 ${AX - 0.1},${AY - 62}`, { stroke: C.orange, width: 8 });
  K.draw(halo, 20.8, 0.45, 'power2.inOut', 'scribble');
  K.unreveal(l1, 21.7); K.unreveal(l2, 21.74, { stagger: 0.02 });
  tl.to(gsv, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 21.72);

  // ---------------------------------------------------------------- make it bigger
  K.sfx('impact', 22.0, 0.45, { big: 0.6 });
  K.sfx('shimmer', 22.0, 0.7, { dur: 1.3 });
  K.theme('orange', 23.04);
  tl.set(K.bgl, { backgroundColor: C.orange }, 23.5);
  const es = K.scene(21.9, 25.62);
  es.style.top = Y0 + 'px';
  const m1 = K.lines(es, { lines: ['MAKE IT BIGGER'], x: 72, y: 400, size: 96 });
  K.reveal(m1, 22.08);
  const m2 = K.marks(es, { lines: ['BEFORE YOU', 'CHOOSE.'], x: 72, y: 530, size: 104, bg: C.ink, color: C.orange, shadow: C.paper2, border: C.ink });
  K.markIn(m2, 22.45);
  K.check(m1.box, 24.5, 'make it bigger');
  K.check(m2.box, 24.5, 'before you choose');
  tl.fromTo(K.cam, { ...K.frameOn(540, Y0 + 960, 1) }, { ...K.frameOn(540, Y0 + 960, 1.04), duration: 3.6, ease: 'none', immediateRender: false }, 22.0);

  const cta = K.lines(es, { lines: ['Comment your number.'], font: 'serif', size: 84, x: 72, y: 925 });
  K.reveal(cta, 23.25, { stagger: 0.05, dur: 0.7 });
  const esv = K.svg(es);
  const A2 = K.arrow(esv, [[815, 1015], [925, 1010], [985, 1100], [968, 1236]], { stroke: C.ink, width: 11, head: 36 });
  K.drawArrow(A2, 23.62, 0.45);
  const I = K.ident(es, { x: 72, y: 1128, size: 118, color: C.ink });
  K.identIn(I, 23.72);
  const dom = K.lines(es, { lines: ['offladder.com'], x: 214, y: 1192, size: 46, track: -0.01 });
  dom.box.style.textTransform = 'none';
  dom.words[0].innerHTML = `off<span style="color:${C.paper}">ladder</span>.com`;
  K.reveal(dom, 24.0, { stagger: 0.02 });
  K.check(cta.box, 24.8, 'comment your number');
  K.check(dom.box, 24.8, 'offladder.com');

  // ---------------------------------------------------------------- loop
  K.ladder(25.62, { colors: [C.ink, C.paper2], bars: 8, dur: 0.22, stagger: 0.018 });
  K.bg(C.paper, 25.62); K.theme('light', 25.62); K.camSet(25.62, { scale: 1, x: 0, y: 0 });
  hook(K.scene(25.62, 99), false);

  // ---------------------------------------------------------------- score
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Am', drums: 'intro', pad: 0.8, arp: 'up', arpgain: 0.7, lp: [0.32, 0.62] }, //  0 hook
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         //  2 GO
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'E', drums: 'build', bass: 1, pad: 1, arp: 'up' },                         // 10 last three
      { chord: 'Am', drums: 'none', pad: 0.45, lp: 0.22 },                               // 12 TIME
      { chord: 'F', drums: 'half', bass: 0.7, pad: 0.9, lp: 0.72 },                      // 14 question
      { chord: 'G', drums: 'half', bass: 0.7, pad: 0.9, arp: 'up', arpgain: 0.5, lp: [0.72, 0.92] },
      { chord: 'Am', drums: 'four', bass: 1, pad: 1, arp: 'down' },                       // 18 the wall
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'down' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          // 22 bigger
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up', lp: [1, 0.36] },           // 24 end, closing into the loop
    ],
    risers: [[0.4, 2.0, 0.8], [10.0, 12.0, 1.0], [21.0, 22.0, 0.6]],
    rolls: [[10.0, 12.0]],
  };
};
