/* The ladder is breaking #3 · 39% of your skills will change by 2030
 *
 *  0.0  World Economic Forum, Future of Jobs Report 2025: workers can expect 39% of their existing
 *       skill sets to be transformed or become outdated, 2025–2030. A "your skills" bar with its
 *       39% in orange, legible from the first frame. At 0.9 the orange crumbles away; at 2.4 a new
 *       segment grows back in its place.
 *  4.0  Whip down. If the world's workforce were 100 people, 59 would need training by 2030.
 *  8.0  Whip down. So what should you learn? The skill that doesn't expire: finding out, fast,
 *       what you're good at.
 * 12.0  Ladder wipe to paper. Before you pay for a course, try an hour of the real work. Then decide.
 * 16.0  Whip down. How OffLadder keeps going: the site's four-step loop, travelled twice, each
 *       round adding a star to your constellation.
 * 24.0  End card. What skill do you want to learn next?
 * 29.6  Ladder wipe back to the bar, so the Short loops.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06 });

  // ---------------------------------------------------------------- A: the skills bar
  const BX = 72, BW = 826, BY = 1040, KEEP = Math.round(BW * 0.61);
  function hook(parent) {
    const lab = K.lines(parent, { lines: ['WORLD ECONOMIC FORUM · JAN 2025'], x: 72, y: 330, size: 34, color: C.orange, track: 0.06 });
    const big = K.lines(parent, { lines: ['39%'], x: 58, y: 380, size: 360, lh: 1, color: C.orange });
    const cap = K.lines(parent, { lines: ['of your skills will change', 'by 2030.'], font: 'serif', size: 100, lh: 1.0, x: 72, y: 760, color: C.paper });
    K.fit(cap, 900);
    const bar = K.el('div', 'sbar', parent);
    K.css(bar, { top: BY + 'px' });
    const keep = K.el('div', 'keep', bar); keep.style.width = KEEP + 'px';
    const gone = K.el('div', 'gone', bar); K.css(gone, { left: KEEP + 6 + 'px', width: BW - KEEP - 6 + 'px' });
    const fresh = K.el('div', 'fresh', bar); K.css(fresh, { left: KEEP + 6 + 'px', width: BW - KEEP - 6 + 'px' });
    const l1 = K.lines(parent, { lines: ['YOUR SKILLS'], x: 72, y: BY + 116, size: 24, color: C.paper, track: 0.08 });
    const l2 = K.lines(parent, { lines: ['39% TRANSFORMED OR OUTDATED'], x: 72, y: BY + 116, size: 24, color: C.orange, track: 0.08 });
    l2.box.style.left = BX + BW - 6 + 'px'; l2.box.style.width = 'auto'; l2.box.style.transform = 'translateX(-100%)'; l2.box.style.textAlign = 'right';
    return { lab, big, cap, bar, keep, gone, fresh, l1, l2 };
  }
  const sA = K.scene(0, 4.2);
  const A = hook(sA);
  K.check(A.big.box, 0.5, '39%'); K.check(A.cap.box, 0.5, 'caption'); K.check(A.bar, 0.5, 'bar');
  K.drift(0, 2.2, { from: 1, to: 1.03 });
  // The orange 39% breaks into pieces and falls away, then new ground grows back.
  const cv = K.el('canvas', 'layer', sA); cv.width = 1080; cv.height = 1920;
  const g = cv.getContext('2d');
  const PS = 16, gx0 = BX + KEEP + 6, gw = BW - KEEP - 6, cols = Math.floor(gw / PS), rows = 6;
  const pr = K.rng(39);
  const bits = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    bits.push({ x: gx0 + c * PS + PS / 2, y: BY + r * PS + PS / 2, t: 0.9 + (c / cols) * 0.35 + pr() * 0.25, vx: (pr() - 0.3) * 420, vy: -pr() * 500, spin: (pr() - 0.5) * 14 });
  }
  tl.set(A.gone, { autoAlpha: 0 }, 0.9);
  K.hint((a, b) => (b > 0.85 && a < 2.4 ? 45 : 0));
  K.frame(t => {
    if (t < 0.85 || t > 2.6) { if (t > 2.6) g.clearRect(0, 0, 1080, 1920); return; }
    g.clearRect(0, 0, 1080, 1920);
    for (const p of bits) {
      const dt = t - p.t;
      g.save();
      if (dt <= 0) { g.fillStyle = C.orange; g.fillRect(p.x - PS / 2, p.y - PS / 2, PS, PS); g.restore(); continue; }
      if (dt > 1.2) { g.restore(); continue; }
      g.globalAlpha = Math.max(0, 1 - dt / 1.1);
      g.translate(p.x + p.vx * dt, p.y + p.vy * dt + 0.5 * 2600 * dt * dt); g.rotate(p.spin * dt);
      g.fillStyle = C.orange; g.fillRect(-PS / 2 + 1, -PS / 2 + 1, PS - 2, PS - 2);
      g.restore();
    }
  });
  K.sfx('downer', 0.9, 0.7, { dur: 1.1 });
  K.sfx('glitch', 0.9, 0.35, { seed: 12 });
  tl.to(A.fresh, { scaleX: 1, duration: 0.8, ease: 'expo.out' }, 2.4);
  tl.to(A.l2.words, { autoAlpha: 0, duration: 0.2 }, 2.3);
  const l3 = K.lines(sA, { lines: ['NEW SKILLS'], x: 72, y: BY + 116, size: 24, color: C.paper, track: 0.08 });
  l3.box.style.left = BX + BW - 6 + 'px'; l3.box.style.width = 'auto'; l3.box.style.transform = 'translateX(-100%)';
  K.reveal(l3, 2.6, { stagger: 0.02 });
  K.sfx('sparkle', 2.45, 0.5);

  // ---------------------------------------------------------------- B: 59 in 100
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 3.58);
  K.sfx('whoosh', 3.48, 1, { dur: 0.6, up: false });
  const sB = K.scene(3.5, 8.2);
  sB.style.top = Y1 + 'px';
  const labB = K.lines(sB, { lines: ['WORLD ECONOMIC FORUM · JAN 2025'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  const ifB = K.lines(sB, { lines: ['If the world’s workforce', 'were 100 people,'], font: 'serif', size: 100, lh: 1.0, x: 72, y: 362, color: C.paper });
  K.fit(ifB, 900);
  K.reveal(labB, 4.02, { stagger: 0.02 });
  K.reveal(ifB, 4.08, { stagger: 0.035, dur: 0.6, from: 135 });
  const people = Array.from({ length: 100 }, (_, k) => {
    const el = K.el('div', 'person', sB, '<i></i><b></b>');
    K.css(el, { left: 72 + (k % 20) * 40.5 + 'px', top: 600 + ((k / 20) | 0) * 76 + 'px' });
    tl.fromTo(el, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' }, 4.5 + ((k % 20) + ((k / 20) | 0)) * 0.012);
    if (k < 59) tl.to(el, { color: C.orange, duration: 0.1 }, 5.15 + k * 0.016);
    return el;
  });
  K.sfx('shimmer', 5.15, 0.4, { dur: 0.95 });
  const slot = K.slot(sB, { x: 60, y: 990, size: 250, cols: 2, color: C.orange, spins: 2 });
  K.slotTo(slot, 59, 5.1, { dur: 0.9 });
  const need = K.lines(sB, { lines: ['would need training', 'by 2030.'], font: 'serif', size: 96, lh: 1.0, x: 400, y: 1010, color: C.paper });
  K.fit(need, 480);
  K.reveal(need, 5.6, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(need.box, 7.5, 'need training'); K.check(people[99], 7.5, 'people');

  // ---------------------------------------------------------------- C: what to learn
  const Y2 = 3840;
  tl.to(K.cam, { ...K.frameOn(540, Y2 + 960, 1), duration: 0.42, ease: 'whip' }, 7.58);
  K.sfx('whoosh', 7.48, 1, { dur: 0.6, up: false });
  const sC = K.scene(7.5, 12.0);
  sC.style.top = Y2 + 'px';
  const what = K.lines(sC, { lines: ['So what', 'should you', 'learn?'], font: 'serif', size: 190, lh: 0.96, x: 72, y: 380, color: C.paper });
  K.fit(what, 900);
  K.reveal(what, 8.0, { stagger: 0.05, dur: 0.7, from: 135 });
  K.unreveal(what, 9.7, { stagger: 0.02 });
  const exp1 = K.lines(sC, { lines: ['The skill that', 'doesn’t expire:'], font: 'serif', size: 110, lh: 1.0, x: 72, y: 400, color: C.paper });
  K.fit(exp1, 900);
  K.reveal(exp1, 9.95, { stagger: 0.04, dur: 0.6, from: 135 });
  const exp2 = K.marks(sC, { lines: ['FINDING OUT', 'WHAT YOU’RE', 'GOOD AT. FAST.'], x: 72, y: 700, size: 92 });
  K.markIn(exp2, 10.5, { stagger: 0.1 });
  K.sfx('thud', 10.5, 0.6);
  K.check(exp1.box, 11.5, 'doesnt expire'); K.check(exp2.box, 11.5, 'finding out');

  // ---------------------------------------------------------------- D: the approach
  K.ladder(12.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 12.0); K.theme('light', 12.0); K.camSet(12.0, { scale: 1, x: 0, y: 0 });
  const sD = K.scene(12.0, 16.3);
  const d1 = K.lines(sD, { lines: ['BEFORE YOU PAY', 'FOR A COURSE,'], x: 72, y: 460, size: 120, lh: 0.92 });
  K.fit(d1, 900);
  K.reveal(d1, 12.08, { stagger: 0.05 });
  const d2 = K.lines(sD, { lines: ['try an hour of', 'the real work.'], font: 'serif', size: 130, lh: 1.0, x: 72, y: 720, color: C.orange });
  K.fit(d2, 880);
  K.reveal(d2, 12.9, { stagger: 0.04, dur: 0.65, from: 135 });
  const d3 = K.marks(sD, { lines: ['THEN DECIDE.'], x: 72, y: 1060, size: 96 });
  K.markIn(d3, 14.2);
  K.sfx('thud', 14.2, 0.6);
  K.check(d1.box, 15.4, 'before you pay'); K.check(d2.box, 15.4, 'try an hour'); K.check(d3.box, 15.4, 'then decide');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.04, duration: 3.6, ease: 'none', immediateRender: false }, 12.0);

  // ---------------------------------------------------------------- E: the loop that keeps going
  const Y3 = 5760;
  tl.to(K.cam, { ...K.frameOn(540, Y3 + 960, 1), duration: 0.42, ease: 'whip' }, 15.58);
  K.sfx('whoosh', 15.48, 1, { dur: 0.6, up: false });
  const sE = K.scene(15.5, 24.1);
  sE.style.top = Y3 + 'px';
  const labE = K.lines(sE, { lines: ['HOW OFFLADDER WORKS'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  const hE = K.lines(sE, { lines: ['Then it keeps going', 'with you.'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 362 });
  K.fit(hE, 900);
  K.reveal(labE, 16.0, { stagger: 0.02 });
  K.reveal(hE, 16.08, { stagger: 0.04, dur: 0.6, from: 135 });
  const STEPS = [
    ['Answer 3 questions', 'Your first directions in about 2 minutes.'],
    ['Try one out', 'A small, real experiment. Stuck? Laddie helps.'],
    ['Tell Laddie how it went', 'What you enjoyed, and what you didn’t.'],
    ['Get a weekly brief', 'A new direction to test, shaped by everything so far.'],
  ];
  const SY = [580, 745, 910, 1075];
  const tsv = K.svg(sE);
  const track = K.path(tsv, `M98,${SY[0] + 22} L98,${SY[3] + 22}`, { stroke: C.ink, width: 6, cap: 'butt' });
  K.draw(track, 16.4, 0.8, 'power2.inOut');
  const stepEls = STEPS.map(([h, p], k) => {
    const el = K.el('div', 'step', sE, `<div class="no"><span class="lit"></span><span class="n">0${k + 1}</span></div><h4>${h}</h4><p>${p}</p>`);
    el.style.top = SY[k] + 'px';
    tl.fromTo(el, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, 16.5 + k * 0.18);
    return el;
  });
  // An orange marker runs the loop twice; each stop lights its step and adds a star.
  const dot = document.createElementNS(K.NS, 'rect');
  dot.setAttribute('width', 30); dot.setAttribute('height', 30); dot.setAttribute('x', -15); dot.setAttribute('y', -15); dot.setAttribute('fill', C.orange);
  tsv.appendChild(dot);
  const back = K.arrow(tsv, [[70, SY[3] + 22], [22, SY[3] - 60], [22, SY[0] + 100], [70, SY[0] + 22]], { stroke: C.orange, width: 9, head: 26 });
  gsap.set(dot, { x: 98, y: SY[0] + 22, autoAlpha: 0 });
  tl.set(dot, { autoAlpha: 1 }, 17.4);
  let t = 17.4;
  for (let round = 0; round < 2; round++) {
    for (let k = 0; k < 4; k++) {
      tl.to(dot, { y: SY[k] + 22, duration: k === 0 ? 0.01 : 0.45, ease: 'power2.inOut' }, t);
      const on = t + (k === 0 ? 0.02 : 0.45);
      tl.set(stepEls[k].querySelector('.lit'), { autoAlpha: 1 }, on);
      tl.fromTo(stepEls[k], { scale: 1.035 }, { scale: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, on);
      K.sfx('pop', on, 0.6, { note: round * 4 + k });
      if (k > 0) tl.set(stepEls[k - 1].querySelector('.lit'), { autoAlpha: 0 }, on);
      t = on + 0.06;
    }
    tl.set(stepEls[3].querySelector('.lit'), { autoAlpha: 0 }, t + 0.35);
    if (round === 0) { K.drawArrow(back, t + 0.02, 0.4); tl.to(dot, { y: SY[0] + 22, duration: 0.4, ease: 'power2.inOut' }, t + 0.02); t += 0.44; }
  }
  const again = K.lines(sE, { lines: ['Every round sharpens', 'what comes next.'], font: 'serif', size: 76, lh: 1.0, x: 72, y: 1250, color: C.ink });
  K.fit(again, 820);
  again.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(again, 20.4, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(again.box, 22.5, 'every round'); K.check(stepEls[3], 22.5, 'step 4');
  tl.fromTo(K.cam, { ...K.frameOn(540, Y3 + 960, 1) }, { ...K.frameOn(540, Y3 + 1000, 1.03), duration: 7.9, ease: 'none', immediateRender: false }, 16.0);

  // ---------------------------------------------------------------- F: end card and loop
  AI.end(24.0, 29.62, { ask: ['What skill do you', 'want to learn next?'] });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (E minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Em', drums: 'pulse', pad: 0.9, lp: [0.24, 0.36] },                        //  0 39%
      { chord: 'Em', drums: 'intro', pad: 0.9, lp: [0.36, 0.6] },                         //  2 new skills
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up', lp: [0.65, 0.9] },         //  4 59 in 100
      { chord: 'D', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          //  6
      { chord: 'Em', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         //  8 what to learn
      { chord: 'C', drums: 'build', bass: 1, pad: 1, arp: 'up' },                         // 10
      { chord: 'G', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                          // 12 before the course
      { chord: 'D', drums: 'half', bass: 0.7, pad: 1, arp: 'up', arpgain: 0.5, lp: [0.8, 1] },
      { chord: 'Em', drums: 'four', bass: 1, pad: 1, arp: 'up' },                         // 16 the loop
      { chord: 'C', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'D', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          // 24 end card
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'D', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },          // 28 closing into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [22.0, 24.0, 0.6]],
    rolls: [[11.0, 12.0]],
  };
  K.sfx('boom', 0, 0.6);
};
