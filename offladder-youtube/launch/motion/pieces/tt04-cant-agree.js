// @shared ai
/* The ladder is breaking #4 · The people building AI can't agree (TikTok cut)
 * The YouTube layout, scaled by K.refit into TikTok's box (10-viral-standard.md). Everything else matches ai04.
 *
 *  0.0  Split screen, legible from the first frame. Top: Anthropic CEO Dario Amodei warned AI could wipe
 *       out half of all entry-level white-collar jobs (Axios interview, May 2025, as reported by Fortune;
 *       shown as a report, not a quote). Bottom: Nvidia CEO Jensen Huang, VivaTech, June 2025, verbatim:
 *       "Some jobs will be obsolete, but many jobs are going to be created." A VS between them.
 *  2.0  The halves pull apart: the people building AI can't agree.
 *  4.0  Whip down. So who's right? Nobody knows yet. But one thing is already happening:
 *  8.0  Whip down. A job title breaks into its tasks; the ones getting cheap to produce turn orange.
 *       Tasks change before titles do (offladder.com's AI guide). Illustrative.
 * 12.0  Ladder wipe to paper. Audit one week. Then test one direction next to yours.
 * 16.0  Whip down. How OffLadder works: every try becomes evidence, and the evidence becomes your
 *       constellation, which shapes what to test next.
 * 24.0  End card. Which part of your week could AI do?
 * 29.6  Ladder wipe back to the split screen.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06, safe: 'social' });

  // ---------------------------------------------------------------- A: two predictions
  function hook(parent) {
    const bottom = K.el('div', 'half', parent);
    K.css(bottom, { top: '960px', height: '960px', background: C.paper });
    const lab1 = K.lines(parent, { lines: ['DARIO AMODEI · ANTHROPIC CEO · MAY 2025'], x: 72, y: 322, size: 30, color: C.orange, track: 0.06 });
    const q1 = K.lines(parent, { lines: ['warned AI could wipe out', 'half of all entry-level', 'white-collar jobs.'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 368, color: C.paper });
    K.fit(q1, 880);
    q1.lines[1].words.slice(0, 1).forEach(w => { w.style.color = C.orange; });
    const src1 = K.lines(parent, { lines: ['in an interview with Axios'], font: 'serif', size: 46, x: 72, y: 672, color: C.paper });
    src1.box.style.opacity = 0.6;
    const lab2 = K.lines(parent, { lines: ['JENSEN HUANG · NVIDIA CEO · JUNE 2025'], x: 72, y: 1062, size: 30, color: C.orange, track: 0.06 });
    const q2 = K.lines(parent, { lines: ['“Some jobs will be obsolete,', 'but many jobs are going', 'to be created.”'], font: 'serif', size: 86, lh: 1.0, x: 72, y: 1108, color: C.ink });
    K.fit(q2, 820);
    q2.lines[1].words.slice(1, 3).forEach(w => { w.style.color = C.orange; });
    const vs = K.el('div', 'vs', parent, 'VS');
    K.css(vs, { left: '690px', top: '885px' });
    gsap.set(vs, { rotation: -6 });
    return { bottom, lab1, q1, src1, lab2, q2, vs };
  }
  const sA = K.scene(0, 4.2);
  const A = hook(sA);
  K.check(A.q1.box, 0.5, 'Amodei'); K.check(A.q2.box, 0.5, 'Huang'); K.check(A.vs, 0.5, 'VS');
  K.drift(0, 2.0, { from: 1, to: 1.025 });
  [0.5, 1.0, 1.5].forEach(t => tl.fromTo(A.vs, { scale: 1.14 }, { scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, t));
  // At 2.0 the halves pull apart and the VS drops out.
  tl.to([A.lab1.box, A.q1.box, A.src1.box], { y: -170, autoAlpha: 0, duration: 0.5, ease: 'expo.in', stagger: 0.04 }, 1.9);
  tl.to([A.bottom, A.lab2.box, A.q2.box], { y: 1000, duration: 0.55, ease: 'expo.in' }, 1.9);
  tl.to(A.vs, { y: 900, rotation: 40, duration: 0.6, ease: 'power3.in' }, 1.95);
  tl.set([A.bottom, A.lab2.box, A.q2.box, A.vs], { autoAlpha: 0 }, 2.6);
  K.sfx('whoosh', 1.85, 0.8, { dur: 0.6, up: false });
  const cant = K.lines(sA, { lines: ['The people building AI', 'can’t agree.'], font: 'serif', size: 118, lh: 1.0, x: 72, y: 690, color: C.paper });
  K.fit(cant, 900);
  cant.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(cant, 2.3, { stagger: 0.05, dur: 0.65, from: 135 });
  K.sfx('impact', 2.45, 0.45, { big: 0.6 });
  K.check(cant.box, 3.4, 'cant agree');

  // ---------------------------------------------------------------- B: nobody knows
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 3.58);
  K.sfx('whoosh', 3.48, 1, { dur: 0.6, up: false });
  const sB = K.scene(3.5, 8.2);
  sB.style.top = Y1 + 'px';
  const who = K.lines(sB, { lines: ['So who’s', 'right?'], font: 'serif', size: 220, lh: 0.94, x: 72, y: 470, color: C.paper });
  K.fit(who, 900);
  K.reveal(who, 4.05, { stagger: 0.06, dur: 0.7, from: 135 });
  K.unreveal(who, 5.35, { stagger: 0.03 });
  const nob = K.marks(sB, { lines: ['NOBODY', 'KNOWS', 'YET.'], x: 72, y: 380, size: 140 });
  K.markIn(nob, 5.65, { stagger: 0.1 });
  K.sfx('thud', 5.65, 0.6);
  const but = K.lines(sB, { lines: ['But one thing is', 'already happening:'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 1020, color: C.paper });
  K.fit(but, 880);
  K.reveal(but, 6.45, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(nob.box, 7.5, 'nobody knows'); K.check(but.box, 7.5, 'but one thing');

  // ---------------------------------------------------------------- C: tasks before titles
  const Y2 = 3840;
  tl.to(K.cam, { ...K.frameOn(540, Y2 + 960, 1), duration: 0.42, ease: 'whip' }, 7.58);
  K.sfx('whoosh', 7.48, 1, { dur: 0.6, up: false });
  const sC = K.scene(7.5, 12.0);
  sC.style.top = Y2 + 'px';
  const ill = K.lines(sC, { lines: ['ILLUSTRATIVE EXAMPLE'], x: 72, y: 330, size: 22, color: C.paper, track: 0.1 });
  ill.box.style.opacity = 0.55;
  K.reveal(ill, 8.0, { stagger: 0.01 });
  const card = K.el('div', 'jobcard', sC, 'Marketing manager');
  card.style.top = '380px';
  tl.fromTo(card, { scale: 1.6, autoAlpha: 0, rotation: -4 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.24, ease: 'power4.in' }, 7.95);
  K.shake(8.19, { amp: 14, dur: 0.35 });
  K.sfx('thud', 8.19, 0.7);
  const TASKS = [['Write the brief', true], ['Summarise the results', true], ['Approve the budget', false], ['Calm an angry client', false], ['Decide what to cut', false]];
  const taskEls = TASKS.map(([name, cheap], k) => {
    const el = K.el('div', 'task', sC, name);
    const x = 72 + (k % 2) * 90, y = 590 + k * 104;
    gsap.set(el, { x: 300, y: 430, scale: 0.4, autoAlpha: 0, rotation: (k % 2 ? 8 : -8) });
    tl.to(el, { x, y, scale: 1, autoAlpha: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.4)' }, 8.75 + k * 0.08);
    K.sfx('pop', 8.8 + k * 0.08, 0.5, { note: k });
    if (cheap) { tl.set(el, { backgroundColor: C.orange }, 9.7 + k * 0.12); tl.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, 9.7 + k * 0.12); K.sfx('pop', 9.7 + k * 0.12, 0.7, { note: 7 + k }); }
    return el;
  });
  tl.to(card, { scale: 0.92, y: -10, duration: 0.4, ease: 'expo.out' }, 8.7);
  const leg = K.el('div', 'legend', sC, `<span><i style="background:${C.orange}"></i>Getting cheap to produce</span><br><span style="display:inline-block;margin-top:14px"><i style="background:${C.paper2}"></i>Hard to replace</span>`);
  K.css(leg, { left: '72px', top: '1128px' });
  tl.fromTo(leg, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 10.0);
  const tb = K.lines(sC, { lines: ['Tasks change before', 'titles do.'], font: 'serif', size: 112, lh: 1.0, x: 72, y: 1236, color: C.paper });
  K.fit(tb, 840);
  tb.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(tb, 10.35, { stagger: 0.05, dur: 0.65, from: 135 });
  K.check(tb.box, 11.5, 'tasks before titles'); K.check(taskEls[4], 11.5, 'last task');

  // ---------------------------------------------------------------- D: the approach
  K.ladder(12.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 12.0); K.theme('light', 12.0); K.camSet(12.0, { scale: 1, x: 0, y: 0 });
  const sD = K.scene(12.0, 16.3);
  const d1 = K.lines(sD, { lines: ['AUDIT', 'ONE WEEK.'], x: 72, y: 420, size: 170, lh: 0.9 });
  K.fit(d1, 900);
  K.reveal(d1, 12.08, { stagger: 0.06 });
  const d2 = K.lines(sD, { lines: ['Mark every block: cheap', 'to produce, or hard', 'to replace.'], font: 'serif', size: 90, lh: 1.0, x: 72, y: 760, color: C.orange });
  K.fit(d2, 860);
  K.reveal(d2, 12.9, { stagger: 0.035, dur: 0.6, from: 135 });
  K.check(d1.box, 13.7, 'audit'); K.check(d2.box, 13.7, 'mark every block');
  K.unreveal(d1, 13.9, { stagger: 0.02 }); K.unreveal(d2, 13.95, { stagger: 0.015 });
  const d3 = K.lines(sD, { lines: ['Then test one', 'direction next', 'to yours.'], x: 72, y: 480, size: 130, lh: 0.92 });
  K.fit(d3, 900);
  K.reveal(d3, 14.1, { stagger: 0.05 });
  const d4 = K.marks(sD, { lines: ['BEFORE YOU', 'NEED TO.'], x: 72, y: 930, size: 104 });
  K.markIn(d4, 14.9, { stagger: 0.1 });
  K.sfx('thud', 14.9, 0.6);
  K.check(d3.box, 15.6, 'test one direction'); K.check(d4.box, 15.6, 'before you need to');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.04, duration: 3.6, ease: 'none', immediateRender: false }, 12.0);

  // ---------------------------------------------------------------- E: evidence becomes a constellation
  const Y3 = 5760;
  tl.to(K.cam, { ...K.frameOn(540, Y3 + 960, 1), duration: 0.42, ease: 'whip' }, 15.58);
  K.sfx('whoosh', 15.48, 1, { dur: 0.6, up: false });
  const sE = K.scene(15.5, 24.1);
  sE.style.top = Y3 + 'px';
  const labE = K.lines(sE, { lines: ['HOW OFFLADDER WORKS'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  const hE = K.lines(sE, { lines: ['Every try becomes', 'evidence.'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 362 });
  K.fit(hE, 900);
  hE.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(labE, 16.0, { stagger: 0.02 });
  K.reveal(hE, 16.08, { stagger: 0.04, dur: 0.6, from: 135 });
  // Each try becomes a star; each star connects to the last. Labels are OffLadder's own experiments.
  const TRIED = [
    ['Planned a one-day festival', 150, 640, 'r'],
    ['Mapped one process for an AI model', 830, 760, 'l'],
    ['Traced a viral image to its source', 190, 880, 'r'],
    ['Listed where heat escapes at home', 790, 1000, 'l'],
  ];
  const ssv = K.svg(sE);
  const starEl = (x, y, fill, dashed) => {
    const s = document.createElementNS(K.NS, 'rect');
    s.setAttribute('x', -24); s.setAttribute('y', -24); s.setAttribute('width', 48); s.setAttribute('height', 48);
    s.setAttribute('fill', fill); s.setAttribute('stroke', C.ink); s.setAttribute('stroke-width', 6);
    if (dashed) s.setAttribute('stroke-dasharray', '9 7');
    ssv.appendChild(s);
    gsap.set(s, { x, y, rotation: 45, scale: 0, transformOrigin: '0 0' });
    return s;
  };
  TRIED.forEach(([txt, x, y, side], k) => {
    const t0 = 16.7 + k * 0.62;
    if (k > 0) {
      const [, px, py] = TRIED[k - 1];
      const ln = K.path(ssv, `M${px},${py} L${x},${y}`, { stroke: C.ink, width: 5, cap: 'round' });
      ln.parentNode.insertBefore(ln, ssv.firstChild);
      K.draw(ln, t0 - 0.3, 0.3, 'power2.inOut');
    }
    const st = starEl(x, y, C.orange);
    tl.to(st, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, t0);
    K.sfx('sparkle', t0, 0.4);
    const lab = K.el('div', 'ecard', sE, `<b>TRIED</b>${txt}`);
    K.css(lab, side === 'r' ? { left: x + 44 + 'px', top: y - 32 + 'px' } : { left: 'auto', right: 1080 - x + 44 + 'px', top: y - 32 + 'px' });
    tl.fromTo(lab, { autoAlpha: 0, x: side === 'r' ? -20 : 20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'expo.out' }, t0 + 0.08);
    K.check(lab, 23, 'star label');
  });
  const cons = K.lines(sE, { lines: ['YOUR CONSTELLATION'], x: 72, y: 1262, size: 30, color: C.orange, track: 0.08 });
  const consT = K.lines(sE, { lines: ['A record of what you can do, backed', 'by something you actually did.'], font: 'serif', size: 62, lh: 1.05, x: 72, y: 1306 });
  K.fit(consT, 820);
  K.reveal(cons, 19.5, { stagger: 0.02 });
  K.reveal(consT, 19.65, { stagger: 0.03, dur: 0.6, from: 135 });
  // It suggests what to test next.
  const [, lx, ly] = TRIED[3];
  const nx = 430, ny = 1135;
  const dash = K.path(ssv, `M${lx},${ly} L${nx},${ny}`, { stroke: C.orange, width: 5, cap: 'round' });
  dash.setAttribute('stroke-dasharray', '16 12');
  ssv.insertBefore(dash, ssv.firstChild);
  gsap.set(dash, { autoAlpha: 0 });
  tl.set(dash, { autoAlpha: 1 }, 21.2);
  tl.fromTo(dash, { strokeDashoffset: 280 }, { strokeDashoffset: 0, duration: 2.6, ease: 'none', immediateRender: false }, 21.2);
  const nxt = starEl(nx, ny, C.paper2, true);
  tl.to(nxt, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, 21.5);
  const nl = K.el('div', 'ecard', sE, `<b>NEXT TO TEST</b>Chosen from what you enjoyed`);
  K.css(nl, { left: nx + 44 + 'px', top: ny - 32 + 'px' });
  tl.fromTo(nl, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'expo.out' }, 21.6);
  K.sfx('pop', 21.5, 0.7, { note: 8 });
  K.check(consT.box, 23, 'constellation text');
  tl.fromTo(K.cam, { ...K.frameOn(540, Y3 + 960, 1) }, { ...K.frameOn(540, Y3 + 1000, 1.03), duration: 7.9, ease: 'none', immediateRender: false }, 16.0);

  // ---------------------------------------------------------------- F: end card and loop
  AI.end(24.0, 29.62, { ask: ['Which part of your', 'week could AI do?'] });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (G minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Gm', drums: 'pulse', pad: 0.9, lp: [0.24, 0.36] },                        //  0 two predictions
      { chord: 'Gm', drums: 'intro', pad: 0.9, lp: [0.36, 0.6] },                         //  2 can't agree
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'up', lp: [0.65, 0.9] },        //  4 who's right
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          //  6
      { chord: 'Gm', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         //  8 tasks
      { chord: 'Eb', drums: 'build', bass: 1, pad: 1, arp: 'up' },                        // 10
      { chord: 'Bb', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                         // 12 audit one week
      { chord: 'F', drums: 'half', bass: 0.7, pad: 1, arp: 'up', arpgain: 0.5, lp: [0.8, 1] },
      { chord: 'Gm', drums: 'four', bass: 1, pad: 1, arp: 'up' },                         // 16 evidence
      { chord: 'Eb', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 24 end card
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },          // 28 closing into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [22.0, 24.0, 0.6]],
    rolls: [[11.0, 12.0]],
  };
  K.sfx('boom', 0, 0.6);

  // ---------------------------------------------------------------- TikTok cut (keep last: the build measures the page)
  K.refit(27.7, 114.8, 0.859);
};
