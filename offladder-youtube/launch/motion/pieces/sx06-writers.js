/* Social #6 · Are writers cooked? (Microsoft AI data, BLS projections)
 * @shared ai co so
 *
 * Built to 10-viral-standard.md, on the frame of the CS cut (sx04): the dial opens and closes the piece,
 * a flat meter takes the needle during the evidence. Facts: scripts/cooked-or-not.md, K1, K4, K6, K12-K15.
 *
 *  0.0  Are writers cooked? The needle flinches.
 *  2.0  Six writing jobs, all in the top 20 of Microsoft's 785. On a 785-long strip they sit at the very start.
 *  6.5  The researchers, on reading it as job loss: "This would be a mistake."
 *  8.6  BLS, 2025 to 2035: technical writers +1%, writers little or no change, editors -1%, reporters -6%. Average +3%.
 * 12.0  BUT. 11,900 openings a year for writers and authors.
 * 15.5  The dial returns: HEATING UP. Tasks change before titles do.
 * 18.0  If you write for a living: three moves. Directions next to writing. Comment your job.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'Cooked or not?', theme: 'dark', grain: 0.06, safe: 'social' });
  const GC = { cx: 540, cy: 1150, r: 230, band: 50 };

  // ---------------------------------------------------------------- A: the hook (also the loop's last frame)
  function hook(parent) {
    const lab = K.lines(parent, { lines: ['MICROSOFT AI DATA · BLS PROJECTIONS'], x: 82, y: 344, size: 30, color: C.orange, track: 0.06 });
    K.fit(lab, 808);
    const title = K.lines(parent, { lines: ['ARE WRITERS'], x: 80, y: 392, size: 112, color: C.paper });
    K.fit(title, 812);
    const cooked = K.lines(parent, { lines: ['COOKED?'], x: 76, y: 512, size: 176, color: C.orange });
    K.fit(cooked, 816);
    const G = CO.gauge(parent, GC);
    G.s.trem = 1;
    return { lab, title, cooked, G };
  }
  const sA = K.scene(0, 2.1);
  const A = hook(sA);
  [A.lab, A.title, A.cooked].forEach(T => K.check(T.box, 0.5, 'hook'));
  K.drift(0, 2.0, { from: 1, to: 1.02 });
  K.camSet(2.0, { scale: 1, x: 0, y: 0 });
  tl.to(A.G.s, { v: 0.7, duration: 0.3, ease: 'power3.out' }, 0.9);
  tl.to(A.G.s, { v: 0.52, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, 1.2);
  K.sfx('tick', 0.9, 0.5); K.sfx('tick', 1.2, 0.4, { tock: true });
  K.unreveal(A.lab, 1.75, { stagger: 0.01 });
  K.unreveal(A.title, 1.75, { stagger: 0.02 });
  K.unreveal(A.cooked, 1.8, {});
  const G = A.G;
  const sGauge = K.scene(0, 18.05);
  sGauge.appendChild(G.box);
  tl.to(G.box, { scale: 0.3, autoAlpha: 0, duration: 0.4, ease: 'power3.in', transformOrigin: `${GC.cx}px ${GC.cy}px` }, 1.9);
  const sMeter = K.scene(2.0, 15.6);
  const MT = CO.meter(sMeter, { x: 80, y: 1180, w: 812 });
  MT.s.trem = 1;
  tl.fromTo(MT.box, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, 2.1);
  tl.to(MT.box, { autoAlpha: 0, y: 30, duration: 0.3, ease: 'power3.in' }, 15.3);
  MT.labels.forEach(L => K.check(L, 8, 'meter label'));

  // ---------------------------------------------------------------- B: six writing jobs, all in the top 20
  const sB = K.scene(2.0, 6.55);
  const bsrc = K.el('div', 'src', sB, 'Microsoft Research, “Working with AI”, 2025');
  K.css(bsrc, { left: '82px', top: '1108px' });
  tl.fromTo(bsrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.05);
  const b0 = K.lines(sB, { lines: ['MICROSOFT RANKED 785 JOBS BY AI OVERLAP'], x: 82, y: 344, size: 30, color: C.orange, track: 0.06 });
  K.fit(b0, 808);
  K.reveal(b0, 2.05, { stagger: 0.012, dur: 0.45 });
  const b1 = K.lines(sB, { lines: ['SIX WRITING JOBS.', 'ALL IN THE TOP 20.'], x: 80, y: 388, size: 78, lh: 0.94, color: C.paper });
  K.fit(b1, 812);
  b1.lines[1].words.slice(-2).forEach(w => { w.style.color = C.orange; });
  K.reveal(b1, 2.1, { stagger: 0.04 });
  const JOBS = [[3, 'WRITERS AND AUTHORS'], [11, 'REPORTERS'], [13, 'TECHNICAL WRITERS'], [15, 'PROOFREADERS'], [16, 'EDITORS'], [18, 'PR SPECIALISTS']];
  const rows = JOBS.map(([rank, name], k) => {
    const y = 566 + k * 68, t = 2.7 + k * 0.34;
    const row = K.el('div', 'wrow', sB, `<b class="num">#${rank}</b><span>${name}</span>`);
    K.css(row, { top: y + 'px' });
    tl.fromTo(row, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.38, ease: 'back.out(2)' }, t);
    K.sfx('pop', t, 0.5, { note: 2 + k });
    K.check(row, 5.6, 'writing job ' + (k + 1));
    return row;
  });
  CO.needle(MT, 3.2, 0.7);
  CO.needle(MT, 4.6, 0.84, { dur: 0.6 });
  // A strip of all 785 jobs, most overlap first: the six sit at the very start.
  const strip = K.el('div', 'rstrip', sB);
  const stops = [0, 0.25, 0.5, 0.75, 1].map(f => `${CO.heat(0.95 - f * 0.85)} ${f * 100}%`).join(', ');
  K.css(strip, { top: '1000px', background: `linear-gradient(90deg, ${stops})` });
  tl.fromTo(strip, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, 4.75);
  K.sfx('shimmer', 4.75, 0.35, { dur: 0.6 });
  JOBS.forEach(([rank], k) => {
    const tk = K.el('div', 'rtick', sB);
    K.css(tk, { left: (80 + (rank - 1) / 784 * 812 - 1.5) + 'px', top: '992px' });
    tl.fromTo(tk, { scaleY: 0 }, { scaleY: 1, duration: 0.2, ease: 'back.out(3)' }, 5.2 + k * 0.05);
  });
  const l1 = K.el('div', 'src', sB, '#1'), l785 = K.el('div', 'src', sB, '#785');
  K.css(l1, { left: '80px', top: '1034px', color: C.paper }); K.css(l785, { left: '826px', top: '1034px', color: C.paper });
  const lall = K.el('div', 'src', sB, '← All six are here');
  K.css(lall, { left: '112px', top: '1034px', color: C.orange });
  [l1, l785, lall].forEach(e => tl.fromTo(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 5.35));
  K.check(lall, 6.0, 'all six'); K.check(l785, 6.0, 'rank 785');
  [b0, b1].forEach(T => K.check(T.box, 5.6, 'top 20'));
  K.unreveal(b0, 6.25, { stagger: 0.005, dur: 0.22 }); K.unreveal(b1, 6.25, { stagger: 0.01, dur: 0.24 });
  tl.to([...rows, strip, l1, l785, lall, bsrc], { autoAlpha: 0, duration: 0.22 }, 6.28);
  tl.to(sB.querySelectorAll('.rtick'), { autoAlpha: 0, duration: 0.22 }, 6.28);

  // ---------------------------------------------------------------- C: "This would be a mistake."
  const sC = K.scene(6.5, 8.65);
  const c0 = K.lines(sC, { lines: ['THE RESEARCHERS WHO MADE THE LIST,', 'ON READING IT AS JOB LOSS:'], x: 82, y: 350, size: 30, lh: 1.2, color: C.orange, track: 0.06 });
  K.fit(c0, 808);
  K.reveal(c0, 6.52, { stagger: 0.02, dur: 0.45 });
  const c1 = K.lines(sC, { lines: ['“This would be', 'a mistake.”'], font: 'serif', size: 150, lh: 0.96, x: 76, y: 450, color: C.paper2 });
  K.fit(c1, 812);
  K.reveal(c1, 6.62, { stagger: 0.05, dur: 0.6, from: 135 });
  K.sfx('thud', 6.62, 0.8); K.shake(6.62, { amp: 10, dur: 0.35 });
  CO.needle(MT, 7.2, 0.64, { dur: 0.8 });
  K.check(c0.box, 8.1, 'researchers'); K.check(c1.box, 8.1, 'mistake');
  K.unreveal(c0, 8.35, { stagger: 0.01, dur: 0.22 }); K.unreveal(c1, 8.35, { stagger: 0.015, dur: 0.24 });

  // ---------------------------------------------------------------- D: BLS projections, 2025 to 2035
  const sD = K.scene(8.6, 12.05);
  const dsrc = K.el('div', 'src', sD, 'US Bureau of Labor Statistics, Aug 2026');
  K.css(dsrc, { left: '82px', top: '1108px' });
  tl.fromTo(dsrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 8.62);
  const d0 = K.lines(sD, { lines: ['PROJECTED US JOBS, 2025 TO 2035'], x: 82, y: 344, size: 30, color: C.orange, track: 0.06 });
  K.fit(d0, 808);
  K.reveal(d0, 8.62, { stagger: 0.015, dur: 0.45 });
  const Z = 560, PX = 56;                    // zero line and pixels per percentage point
  const axis = K.el('div', 'zaxis', sD);
  K.css(axis, { left: (Z - 2) + 'px', top: '420px', height: '470px' });
  tl.fromTo(axis, { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: 'expo.out' }, 8.7);
  const PROJ = [['TECHNICAL WRITERS', 1, '+1%'], ['WRITERS & AUTHORS', 0, 'Little or no change'], ['EDITORS', -1, '−1%'], ['REPORTERS', -6, '−6%']];
  PROJ.forEach(([name, v, lab], k) => {
    const y = 428 + k * 114, t = 8.95 + k * 0.36;
    const L = K.lines(sD, { lines: [name], x: 80, y, size: 36, color: C.paper, track: 0.02 });
    K.reveal(L, t, { stagger: 0.02, dur: 0.35 });
    const bar = K.el('div', 'pbar', sD);
    const w = Math.abs(v) * PX;
    K.css(bar, { top: (y + 46) + 'px', left: (v >= 0 ? Z : Z - w) + 'px', width: Math.max(w, 6) + 'px', background: v > 0 ? C.paper2 : v < 0 ? C.orange : C.paper, transformOrigin: v >= 0 ? '0% 50%' : '100% 50%' });
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, t + 0.05);
    const V = K.lines(sD, { lines: [lab], font: v === 0 ? 'serif' : 'display', size: v === 0 ? 40 : 54, x: v >= 0 ? Z + w + 18 : 80, y: y + 42, w: v >= 0 ? 520 : Z - w - 98, color: v < 0 ? C.orange : C.paper2, align: v >= 0 ? 'left' : 'right' });
    K.css(V.box, { zIndex: 2, width: 'auto', background: C.ink, padding: '0 8px' });
    if (v < 0) V.box.style.left = (Z - w - 18 - V.box.offsetWidth) + 'px'; else V.box.style.left = (Z + w + 10) + 'px';
    K.reveal(V, t + 0.2, { dur: 0.35 });
    K.sfx(v < 0 ? 'thud' : 'pop', t + 0.1, v < 0 ? 0.35 + 0.05 * -v : 0.5, { note: 5 });
    K.check(L.box, 11.5, 'projection name'); K.check(V.box, 11.5, 'projection value');
  });
  const avg = K.el('div', 'avgline', sD);
  K.css(avg, { left: (Z + 3 * PX - 2) + 'px', top: '420px', height: '470px', zIndex: 1 });
  tl.fromTo(avg, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, 10.45);
  const avgL = K.lines(sD, { lines: ['Average job: +3%'], font: 'serif', size: 40, x: Z + 3 * PX - 160, w: 320, align: 'center', y: 898, color: C.paper });
  K.reveal(avgL, 10.6, { stagger: 0.02, dur: 0.4, from: 135 });
  K.check(avgL.box, 11.5, 'average job');
  CO.needle(MT, 10.7, 0.72, { dur: 0.7 });
  K.check(d0.box, 11.5, 'projections label');

  // ---------------------------------------------------------------- E: BUT.
  K.glitch(11.95, { dur: 0.16, seed: 23 });
  tl.to(sD, { opacity: 0.12, duration: 0.25 }, 12.0);
  const sE = K.scene(12.0, 12.7);
  const but = K.lines(sE, { lines: ['BUT.'], x: 70, y: 430, size: 290, color: C.paper2 });
  K.reveal(but, 12.0, { dur: 0.3, from: 120 });
  K.check(but.box, 12.4, 'but');
  tl.to(MT.s, { trem: 3.2, duration: 0.1 }, 12.0);
  tl.to(MT.s, { trem: 1, duration: 0.8 }, 12.3);
  K.unreveal(but, 12.5, { dur: 0.2 });

  // ---------------------------------------------------------------- F: still hiring
  const sF = K.scene(12.6, 15.65);
  const fsrc = K.el('div', 'src', sF, 'US Bureau of Labor Statistics, Aug 2026');
  K.css(fsrc, { left: '82px', top: '1108px' });
  tl.fromTo(fsrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 12.65);
  const f0 = K.lines(sF, { lines: ['PROJECTED EVERY YEAR TO 2035:'], x: 82, y: 350, size: 30, color: C.orange, track: 0.05 });
  K.fit(f0, 808);
  K.reveal(f0, 12.65, { stagger: 0.015, dur: 0.45 });
  const f1 = K.lines(sF, { lines: ['11,900'], x: 70, y: 392, size: 220, color: C.paper2 });
  K.fit(f1, 816);
  K.reveal(f1, 12.8, { dur: 0.55 });
  K.sfx('impact', 12.8, 0.5, { big: 0.5 });
  const f2 = K.lines(sF, { lines: ['openings for writers and authors.'], font: 'serif', size: 60, x: 82, y: 616, color: C.paper });
  K.fit(f2, 808);
  K.reveal(f2, 13.05, { stagger: 0.02, dur: 0.5, from: 135 });
  const f3 = K.lines(sF, { lines: ['People retire, move and switch. The seats refill.'], font: 'serif', size: 44, x: 82, y: 700, color: '#9A968F' });
  K.fit(f3, 808);
  K.reveal(f3, 13.4, { stagger: 0.015, dur: 0.45, from: 135 });
  [f0, f1, f2, f3].forEach(T => K.check(T.box, 15.2, 'openings'));
  CO.needle(MT, 13.6, 0.56);
  K.unreveal(f0, 15.35, { stagger: 0.005, dur: 0.22 }); K.unreveal(f1, 15.35, { dur: 0.22 });
  K.unreveal(f2, 15.35, { stagger: 0.005, dur: 0.22 }); K.unreveal(f3, 15.37, { stagger: 0.005, dur: 0.22 });
  tl.to(fsrc, { autoAlpha: 0, duration: 0.2 }, 15.35);

  // ---------------------------------------------------------------- G: the verdict
  tl.set(G.s, { v: 0.5 }, 15.5);
  tl.fromTo(G.box, { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, y: -40, duration: 0.6, ease: 'back.out(1.4)', immediateRender: false }, 15.55);
  K.sfx('whoosh', 15.5, 0.6, { dur: 0.5, up: false });
  CO.needle(G, 16.0, 0.54, { dur: 1.2 });
  tl.to(G.s, { trem: 0.35, duration: 1.0 }, 16.0);
  const sG = K.scene(15.6, 18.05);
  const st = K.stamp(sG, { text: 'HEATING UP.', x: 490, y: 520, size: 90, color: C.orange, rot: -6 });
  K.slam(st, 16.4, { dust: C.paper2, shake: 22, flash: 0.25 });
  const g2 = K.lines(sG, { lines: ['Tasks change before titles do.'], font: 'serif', size: 62, x: 82, y: 650, color: C.paper });
  K.fit(g2, 808);
  K.reveal(g2, 16.9, { stagger: 0.03, dur: 0.55, from: 135 });
  K.check(st, 17.6, 'heating up'); K.check(g2.box, 17.6, 'tasks change');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.012, duration: 2.4, ease: 'none', immediateRender: false }, 15.6);

  // ---------------------------------------------------------------- H: three moves
  K.ladder(18.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 18.0); K.theme('light', 18.0); K.camSet(18.0, { scale: 1, x: 0, y: 0 });
  const sH = K.scene(18.0, 21.45);
  const h0 = K.lines(sH, { lines: ['IF YOU WRITE FOR A LIVING:'], x: 82, y: 350, size: 30, color: C.orange, track: 0.06 });
  K.reveal(h0, 18.05, { stagger: 0.02, dur: 0.45 });
  const h1 = K.lines(sH, { lines: ['THE FIRST DRAFT', 'GOT CHEAP.'], x: 80, y: 394, size: 84, lh: 0.92 });
  K.fit(h1, 812);
  K.reveal(h1, 18.1, { stagger: 0.04 });
  const h2 = K.marks(sH, { lines: ['SO:'], x: 80, y: 572, size: 76 });
  K.markIn(h2, 18.6);
  const MOVES = ['Own a subject, not just the words.', 'Get good at editing AI drafts.', 'Test a direction next to yours.'];
  const mrows = MOVES.map((txt, k) => {
    const r = K.el('div', 'chk', sH, `<div class="box"></div>${txt}`);
    r.style.top = (706 + k * 90) + 'px';
    r.style.left = '80px'; r.style.width = '790px';
    const t = 19.1 + k * 0.62;
    tl.fromTo(r, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, t);
    K.sfx('pop', t, 0.55, { note: 4 + k });
    K.check(r, 21.0, 'move ' + (k + 1));
    return { r, t };
  });
  const tsv = K.svg(sH);
  mrows.forEach(({ r, t }) => {
    const y = parseFloat(r.style.top);
    const tick = K.path(tsv, `M${80 + 12} ${y + 28} L${80 + 26} ${y + 44} L${80 + 52} ${y + 8}`, { stroke: C.orange, width: 11 });
    gsap.set(tick, { drawSVG: '0%' });
    K.draw(tick, t + 0.25, 0.25, 'power2.out', 'scribble');
  });
  [h0, h1].forEach(T => K.check(T.box, 21.0, 'first draft')); K.check(h2.box, 21.0, 'so mark');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.012, duration: 3.4, ease: 'none', immediateRender: false }, 18.0);

  // ---------------------------------------------------------------- I: directions next to writing
  K.camSet(21.4, { scale: 1, x: 0, y: 0 });
  const sI = K.scene(21.4, 24.1);
  const i0 = K.lines(sI, { lines: ['DIRECTIONS NEXT TO WRITING'], x: 82, y: 350, size: 30, color: C.orange, track: 0.06 });
  K.reveal(i0, 21.42, { stagger: 0.02, dur: 0.45 });
  const isrc = K.el('div', 'src', sI, 'from offladder.com/directions');
  K.css(isrc, { left: '82px', top: '392px', color: C.muted });
  tl.fromTo(isrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 21.5);
  const wrap = K.el('div', 'layer', sI);
  wrap.style.left = '14px';
  const cards = AI.cards(wrap, ['Model evaluation writer', 'Provenance and authenticity analyst', 'AI tutor designer'], 21.5, { y0: 440, step: 112, every: 0.22, seed: 37 });
  cards.forEach(c => K.check(c, 23.6, 'direction card'));
  const i1 = K.lines(sI, { lines: ['OffLadder finds yours in 3 questions,', 'then adapts to what you try.'], font: 'serif', size: 62, lh: 1.04, x: 82, y: 800 });
  K.fit(i1, 808);
  i1.lines[1].words.slice(-3).forEach(w => { w.style.color = C.orange; });
  K.reveal(i1, 22.3, { stagger: 0.025, dur: 0.55, from: 135 });
  K.check(i1.box, 23.6, 'offladder line'); K.check(i0.box, 23.6, 'directions label');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.012, duration: 2.6, ease: 'none', immediateRender: false }, 21.4);

  // ---------------------------------------------------------------- J: end card and loop
  SO.end(24.0, 29.62, { ask: ['COMMENT YOUR', 'JOB.'], send: ['We’ll reply with its', 'rank out of 785.'], note: 'Overlap with AI, not job loss. Data: Microsoft, BLS.' });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (A minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Am', drums: 'pulse', pad: 0.9, lp: [0.35, 0.5] },                          //  0 the hook
      { chord: 'F', drums: 'intro', pad: 1, arp: 'up', arpgain: 0.7, lp: [0.55, 0.85] },   //  2 six writing jobs
      { chord: 'C', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           //  4 the strip
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           //  6 a mistake
      { chord: 'Am', drums: 'build', bass: 1, pad: 1, arp: 'up' },                         //  8 projections
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },               // 10
      { chord: 'C', drums: 'half', bass: 0.7, pad: 1, lp: 0.7, hit: true },                // 12 BUT.
      { chord: 'G', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           // 14 11,900
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'up', hit: true },               // 16 the verdict
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           // 18 three moves
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 22 directions
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up', hit: true },                // 24 end card
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },          // 28 into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [14.0, 16.0, 0.7]],
    rolls: [[11.0, 12.0], [15.0, 16.0]],
  };
  K.sfx('boom', 0, 0.5);
};
