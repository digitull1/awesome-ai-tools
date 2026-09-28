/* Social #3 · Guess #1: Microsoft ranked 785 jobs by how much their work overlaps with AI
 * @shared ai co so
 *
 * Episode 6 (co01) rebuilt to 10-viral-standard.md: every readable element inside the social safe box,
 * a guessing game from the first frame ("Can you guess #1?"), a "Did you guess it?" beat on the reveal,
 * and the comment lookup on the end card. Same facts and sources as co01 (scripts/cooked-or-not.md, K1-K6).
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'Guess #1', theme: 'dark', grain: 0.06, safe: 'social' });
  const GRID = { x0: 80, y0: 858, cols: 44, pitch: 18.5, size: 14.5 };

  // ---------------------------------------------------------------- A: the hook (also the loop's last frame)
  function hook(parent, from, to) {
    const M = CO.heatmap(parent, { ...GRID, t0: -10, from, t1: to });
    const lab = K.lines(parent, { lines: ['200,000 REAL AI CHATS · 2025'], x: 82, y: 344, size: 30, color: C.orange, track: 0.06 });
    const t1 = K.lines(parent, { lines: ['MICROSOFT RANKED'], x: 80, y: 388, size: 70, color: C.paper });
    K.fit(t1, 812);
    const t2 = K.lines(parent, { lines: ['785 JOBS'], x: 76, y: 454, size: 150, color: C.paper });
    K.fit(t2, 812);
    t2.words[0].style.color = C.orange;
    const sub = K.lines(parent, { lines: ['by how much their work overlaps with AI.'], font: 'serif', size: 52, x: 82, y: 608, color: C.paper });
    K.fit(sub, 808);
    const ask = K.marks(parent, { lines: ['CAN YOU GUESS #1?'], x: 80, y: 690, size: 60 });
    K.markShow(ask);
    const key = K.el('div', 'src', parent, 'Each square is one job · most overlap first');
    K.css(key, { left: '82px', top: '818px' });
    return { M, lab, t1, t2, sub, ask, key };
  }
  const sGrid = K.scene(0, 22.0);
  const sA = K.scene(0, 2.0);
  const A = hook(sA, -1, 22.1);
  const M = A.M;
  sGrid.appendChild(M.cv);          // the map outlives the hook
  [A.lab, A.t1, A.t2, A.sub].forEach(T => K.check(T.box, 0.5, 'hook'));
  K.check(A.ask.box, 0.5, 'hook ask');
  K.drift(0, 2.0, { from: 1, to: 1.012 });
  tl.to(A.key, { autoAlpha: 0, duration: 0.25 }, 1.75);
  tl.fromTo(M.s, { shimmer: 0 }, { shimmer: 0.09, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, 0.15);
  for (let i = 0; i < 10; i++) M.ring(i, 0.8 + i * 0.03, 1.95);
  K.sfx('shimmer', 0.8, 0.45, { dur: 0.8 });
  tl.to(A.ask.box, { scale: 1.07, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '0% 50%' }, 1.2);
  K.sfx('pop', 1.2, 0.6, { note: 5 });
  K.unreveal(A.lab, 1.72, { stagger: 0.01 });
  K.unreveal(A.t1, 1.72, { stagger: 0.02 });
  K.unreveal(A.t2, 1.74, { stagger: 0.02 });
  K.unreveal(A.sub, 1.74, { stagger: 0.01 });
  K.markOut(A.ask, 1.72);

  // ---------------------------------------------------------------- B: the countdown
  const TOP = [
    [10, ['MATHEMATICIANS'], '2,220 US workers', 'sigma'],
    [9, ['POLITICAL', 'SCIENTISTS'], '5,580 US workers', 'ballot'],
    [8, ['TELEMARKETERS'], '81,580 US workers', 'phone'],
    [7, ['CUSTOMER SERVICE', 'REPRESENTATIVES'], '2.9 million US workers', 'headset'],
    [6, ['BROADCAST ANNOUNCERS', 'AND RADIO DJS'], '25,070 US workers', 'mic'],
    [5, ['CNC TOOL', 'PROGRAMMERS'], '28,030 US workers', 'gear'],
    [4, ['SERVICES SALES', 'REPRESENTATIVES'], '1.1 million US workers', 'case'],
    [3, ['WRITERS AND', 'AUTHORS'], '49,450 US workers', 'pen'],
    [2, ['HISTORIANS'], '3,040 US workers', 'history'],
    [1, ['INTERPRETERS AND', 'TRANSLATORS'], '51,560 US workers', 'translate'],
  ];
  const AT = [2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.5, 12.0], END = 14.0;
  const sB = K.scene(1.9, END);
  const src = K.el('div', 'src', sB, 'Microsoft Research, “Working with AI”, 2025');
  K.css(src, { left: '82px', top: '818px' });
  tl.fromTo(src, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.0);
  tl.fromTo(K.cam, { scale: 1.012 }, { scale: 1.022, duration: 10, ease: 'none', immediateRender: false }, 2.0);
  const R = K.roller(sB, { x: 70, y: 346, w: 600, h: 232, size: 204, values: TOP.map(([r]) => `<small>#</small>${r}`), align: 'left' });
  R.win.classList.add('rank');
  R.spans.forEach((s, k) => { s.style.color = CO.heatOf(TOP[k][0]); });
  tl.fromTo(R.spans[0], { yPercent: 100 }, { yPercent: 0, duration: 0.34, ease: 'expo.out' }, AT[0] - 0.05);
  TOP.forEach(([rank, lines, sub, icon], k) => {
    const t = AT[k], next = k < 9 ? AT[k + 1] : END;
    if (k) K.rollAt(R, k, t, { dur: 0.3 });
    const T = K.lines(sB, { lines, x: 80, y: 596, size: 84, lh: 0.92, color: rank === 1 ? CO.heatOf(1) : C.paper });
    K.fit(T, 812);
    const h = parseFloat(T.box.style.fontSize) * 0.92 * lines.length;
    const S = K.lines(sB, { lines: [sub], font: 'serif', size: 54, x: 82, y: 596 + h + 10, color: rank === 7 || rank === 4 ? C.orange : C.paper });
    K.reveal(T, t + 0.04, { stagger: 0.035, dur: 0.5 });
    K.reveal(S, t + 0.16, { stagger: 0.02, dur: 0.5, from: 135 });
    const I = CO.icon(sB, icon, { x: 690, y: 356, size: 180, color: CO.heatOf(rank), width: 6.5 });
    CO.iconIn(I, t + 0.02, rank === 1 ? 0.6 : 0.4);
    M.ring(rank - 1, t, next - 0.05);
    tl.fromTo(K.shaker, { scale: rank === 1 ? 1.03 : 1.014 }, { scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, t);
    if (k < 9) {
      K.unreveal(T, next - 0.3, { stagger: 0.015, dur: 0.26 });
      K.unreveal(S, next - 0.3, { stagger: 0.01, dur: 0.26 });
      CO.iconOut(I, next - 0.26);
      K.sfx('whoosh', t - 0.12, 0.35, { dur: 0.3 });
      K.sfx('pop', t + 0.02, 0.55, { note: 9 - rank });
    }
    if (rank === 3 || rank === 2) { K.sfx('impact', t, 0.45, { big: 0.5 }); K.shake(t, { amp: 8, dur: 0.3 }); }
    K.check(T.box, t + 0.7, `#${rank} title`); K.check(S.box, t + 0.7, `#${rank} workers`);
    if (rank === 1) K.unreveal(S, 12.78, { stagger: 0.01, dur: 0.2 });
  });
  // #1 lands on the drop: the map flares, heat bursts out of the top tile.
  tl.to(M.s, { dim: 0.45, duration: 1.0, ease: 'power2.in' }, 11.0);
  tl.to(M.s, { dim: 0, boost: 0.35, duration: 0.08 }, 12.0);
  tl.to(M.s, { boost: 0, duration: 1.2, ease: 'power2.out' }, 12.1);
  K.flash(12.0, { a: 0.3 });
  K.shake(12.0, { amp: 20 });
  K.burst(12.0, { x: M.pos(0).x, y: M.pos(0).y, color: [CO.heatOf(1), C.orange, '#FF8C50'], n: 28, seed: 12, speed: [700, 1700] });
  K.sfx('impact', 12.0, 0.9, { big: 1 });
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.02, duration: 2.0, ease: 'none', immediateRender: false }, 12.0);
  K.camSet(14.0, { scale: 1, x: 0, y: 0 });
  // The guess pays off.
  const guess = K.lines(sB, { lines: ['Did you guess it?'], font: 'serif', size: 60, x: 82, y: 752, color: C.orange });
  K.reveal(guess, 12.98, { stagger: 0.03, dur: 0.5, from: 135 });
  K.unreveal(guess, 13.66, { stagger: 0.01, dur: 0.22 });
  K.check(guess.box, 13.3, 'did you guess');
  K.unreveal({ words: R.spans }, 13.72, { stagger: 0, dur: 0.26 });
  tl.to(src, { autoAlpha: 0, duration: 0.2 }, 13.72);

  // ---------------------------------------------------------------- C: software developers
  const sC = K.scene(13.9, 16.0);
  const c1 = K.lines(sC, { lines: ['SOFTWARE', 'DEVELOPERS?'], x: 80, y: 350, size: 104, lh: 0.92, color: C.paper });
  K.fit(c1, 812);
  K.reveal(c1, 14.02, { stagger: 0.05 });
  const hash = K.lines(sC, { lines: ['#'], x: 76, y: 556, size: 96, color: C.orange });
  K.reveal(hash, 14.35, {});
  const slot = K.slot(sC, { x: 150, y: 546, size: 184, cols: 3, color: C.orange, spins: 2 });
  K.slotTo(slot, 120, 14.35, { dur: 0.8 });
  const c2 = K.lines(sC, { lines: ['Not even top 100.'], font: 'serif', size: 64, x: 82, y: 740, color: C.paper });
  K.reveal(c2, 15.0, { stagger: 0.04, dur: 0.55, from: 135 });
  K.check(c1.box, 15.5, 'software developers'); K.check(c2.box, 15.5, 'not even top 100');
  // The top 100, outlined on the map; #120 sits just outside it.
  const { x0, y0, pitch: P, size: Z, cols } = GRID, pad = 5;
  const X = c => x0 + c * P, Y = r => y0 + r * P;
  const outline = `M${X(0) - pad} ${Y(0) - pad} H${X(cols - 1) + Z + pad} V${Y(1) + Z + pad} H${X(11) + Z + pad} V${Y(2) + Z + pad} H${X(0) - pad} Z`;
  const osv = K.svg(sC);
  const op = K.path(osv, outline, { stroke: C.paper2, width: 5, join: 'miter', cap: 'butt' });
  gsap.set(op, { drawSVG: '0%' });
  K.draw(op, 14.2, 0.6, 'power2.inOut', 'scribble');
  const tag = K.el('div', 'src', sC, 'TOP 100');
  K.css(tag, { left: (X(12) + 8) + 'px', top: (Y(2) - 2) + 'px', color: C.paper2, background: C.ink, padding: '3px 8px 1px' });
  tl.fromTo(tag, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 14.6);
  M.ring(119, 14.4, 15.95, C.paper2);
  tl.to(M.s, { dim: 0.2, duration: 0.4 }, 14.0);

  // ---------------------------------------------------------------- D: so are they cooked?
  const sD = K.scene(16.0, 17.05);
  const d1 = K.lines(sD, { lines: ['SO ARE THESE', 'JOBS COOKED?'], x: 80, y: 420, size: 112, lh: 0.92, color: C.paper });
  K.fit(d1, 812);
  d1.lines[1].words[1].style.color = C.orange;
  K.reveal(d1, 16.02, { stagger: 0.05 });
  K.check(d1.box, 16.8, 'are they cooked');
  tl.to(M.s, { dim: 0, boost: 0.28, shimmer: 0.12, duration: 0.9, ease: 'power2.in' }, 16.0);
  K.sfx('shimmer', 16.0, 0.5, { dur: 1.0 });
  K.unreveal(d1, 16.8, { stagger: 0.015, dur: 0.24 });

  // ---------------------------------------------------------------- E: "This would be a mistake."
  const sE = K.scene(17.0, 18.65);
  const e0 = K.lines(sE, { lines: ['THE RESEARCHERS WHO MADE THE LIST,', 'ON READING IT AS JOB LOSS:'], x: 82, y: 350, size: 30, lh: 1.2, color: C.orange, track: 0.06 });
  K.fit(e0, 808);
  K.reveal(e0, 17.02, { stagger: 0.02, dur: 0.45 });
  const e1 = K.lines(sE, { lines: ['“This would be', 'a mistake.”'], font: 'serif', size: 150, lh: 0.96, x: 76, y: 450, color: C.paper2 });
  K.fit(e1, 812);
  K.reveal(e1, 17.12, { stagger: 0.05, dur: 0.6, from: 135 });
  K.check(e0.box, 18.2, 'researchers'); K.check(e1.box, 18.2, 'mistake');
  tl.to(M.s, { boost: 0, shimmer: 0, dim: 0.62, duration: 0.5, ease: 'power3.out' }, 17.0);
  K.sfx('thud', 17.12, 0.8); K.shake(17.12, { amp: 10, dur: 0.35 });
  K.unreveal(e0, 18.42, { stagger: 0.01, dur: 0.22 }); K.unreveal(e1, 18.42, { stagger: 0.015, dur: 0.24 });

  // ---------------------------------------------------------------- F: the #1 job, still projected to grow
  const sF = K.scene(18.6, 20.05);
  const f0 = K.lines(sF, { lines: ['THE #1 JOB, TRANSLATORS:'], x: 80, y: 350, size: 46, color: C.orange });
  K.fit(f0, 812);
  K.reveal(f0, 18.62, { stagger: 0.02, dur: 0.45 });
  const f1 = K.lines(sF, { lines: ['+2%'], x: 70, y: 410, size: 230, color: C.paper2 });
  K.reveal(f1, 18.72, { dur: 0.55 });
  K.sfx('pop', 18.72, 0.7, { note: 7 });
  const f2 = K.lines(sF, { lines: ['projected US job growth,', '2025 to 2035'], font: 'serif', size: 58, lh: 1.0, x: 82, y: 640, color: C.paper });
  K.reveal(f2, 18.86, { stagger: 0.025, dur: 0.5, from: 135 });
  const f3 = K.lines(sF, { lines: ['(the average job: +3%)'], font: 'serif', size: 44, x: 82, y: 764, color: '#9A968F' });
  K.reveal(f3, 19.0, { stagger: 0.02, dur: 0.45, from: 135 });
  const fs = K.el('div', 'src', sF, 'US Bureau of Labor Statistics, Aug 2026');
  K.css(fs, { left: '82px', top: '818px' });
  tl.fromTo(fs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 18.7);
  M.ring(0, 18.7, 19.95);
  tl.to(M.s, { dim: 0.3, duration: 0.4 }, 18.6);
  [f0, f1, f2, f3].forEach(T => K.check(T.box, 19.7, 'translators'));
  K.unreveal(f0, 19.82, { stagger: 0.01, dur: 0.2 }); K.unreveal(f1, 19.82, { dur: 0.2 });
  K.unreveal(f2, 19.82, { stagger: 0.01, dur: 0.2 }); K.unreveal(f3, 19.84, { stagger: 0.01, dur: 0.2 });

  // ---------------------------------------------------------------- G: hot isn't cooked
  const sG = K.scene(20.0, 22.0);
  const g1 = K.marks(sG, { lines: ['HOT ISN’T'], x: 80, y: 370, size: 116, shadow: C.ember });
  const g1b = K.marks(sG, { lines: ['COOKED.'], x: 80, y: 540, size: 116, bg: C.paper2, shadow: C.orange });
  K.markIn(g1, 20.0);
  K.markIn(g1b, 20.12, { sfx: null });
  K.check(g1b.box, 21.5, 'cooked');
  K.sfx('impact', 20.0, 0.6, { big: 0.6 });
  const g2 = K.lines(sG, { lines: ['Tasks change before titles do.'], font: 'serif', size: 62, x: 82, y: 736, color: C.paper });
  K.fit(g2, 808);
  K.reveal(g2, 20.55, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(g1.box, 21.5, 'hot isnt cooked'); K.check(g2.box, 21.5, 'tasks change');
  tl.to(M.s, { dim: 0, shimmer: 0.05, duration: 0.6 }, 20.0);
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.015, duration: 2.0, ease: 'none', immediateRender: false }, 20.0);

  // ---------------------------------------------------------------- H: how OffLadder helps
  K.ladder(22.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 22.0); K.theme('light', 22.0); K.camSet(22.0, { scale: 1, x: 0, y: 0 });
  const sH = K.scene(22.0, 24.1);
  const h0 = K.lines(sH, { lines: ['HOW OFFLADDER HELPS'], x: 82, y: 350, size: 32, color: C.orange, track: 0.06 });
  K.reveal(h0, 22.05, { stagger: 0.02, dur: 0.45 });
  const h1 = K.marks(sH, { lines: ['3 QUESTIONS.'], x: 80, y: 412, size: 100 });
  K.markIn(h1, 22.15);
  const h2 = K.lines(sH, { lines: ['Directions you’d never', 'have thought of.'], font: 'serif', size: 84, lh: 1.0, x: 82, y: 580 });
  K.fit(h2, 808);
  K.reveal(h2, 22.55, { stagger: 0.035, dur: 0.55, from: 135 });
  const h3 = K.lines(sH, { lines: ['Then it adapts to', 'what you try.'], font: 'serif', size: 84, lh: 1.0, x: 82, y: 790, color: C.orange });
  K.fit(h3, 808);
  K.reveal(h3, 23.1, { stagger: 0.035, dur: 0.55, from: 135 });
  K.sfx('pop', 22.55, 0.5, { note: 4 }); K.sfx('pop', 23.1, 0.5, { note: 6 });
  [h0, h2, h3].forEach(T => K.check(T.box, 23.8, 'offladder')); K.check(h1.box, 23.8, '3 questions');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.015, duration: 2.0, ease: 'none', immediateRender: false }, 22.0);

  // ---------------------------------------------------------------- I: end card and loop
  SO.end(24.0, 29.62, { ask: ['COMMENT YOUR', 'JOB.'], send: ['We’ll reply with its', 'rank out of 785.'], note: 'Overlap with AI, not job loss.' });
  AI.loop(29.62, C.ink, 'dark', p => hook(p, 29.5, 99));

  // ---------------------------------------------------------------- score (A minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Am', drums: 'pulse', pad: 0.9, lp: [0.35, 0.55] },                         //  0 the hook
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           //  2 #10, #9
      { chord: 'C', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           //  4 #8, #7
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           //  6 #6, #5
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          //  8 #4, #3
      { chord: 'F', drums: 'build', bass: 1, pad: 1, arp: 'up' },                          // 10 #2
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up', hit: true },                // 12 #1
      { chord: 'G', drums: 'half', bass: 0.7, pad: 1, lp: 0.75 },                          // 14 software developers
      { chord: 'Am', drums: 'pulse', pad: 1, lp: [0.55, 0.7] },                            // 16 cooked? a mistake
      { chord: 'F', drums: 'build', bass: 1, pad: 1, arp: 'up' },                          // 18 +2%
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up', hit: true },                // 20 hot isn't cooked
      { chord: 'G', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           // 22 OffLadder
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 24 end card
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },           // 28 closing into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [18.0, 20.0, 0.8]],
    rolls: [[11.0, 12.0], [19.0, 20.0]],
  };
  K.sfx('boom', 0, 0.5);
};
