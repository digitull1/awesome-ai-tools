/* Cooked or not? #2 · Is a computer science degree cooked?
 * @shared ai co
 *
 *  0.0  Is a computer science degree cooked? The verdict gauge, needle trembling in the middle.
 *  2.0  New York Fed, 2024 data: unemployment for recent grads (22-27) across 73 majors, as bars.
 *       Computer science: 7.0%, 4th highest of 73. All recent grads: 4.2%. The needle swings to COOKED.
 *  6.0  Higher than art history (6.7%), English (6.1%), philosophy (5.1%). The needle creeps further.
 * 10.0  BUT.
 * 10.6  Working in a job that doesn't need a degree: CS grads 19%, all recent grads 39%. Needle back.
 * 13.0  Software developer jobs: +10% projected, 2025-35 (average +3%). Needle back again.
 * 15.6  The verdict: NOT COOKED. But it's harder to get into.
 * 18.0  Ladder wipe to paper. Don't just collect the degree. Build proof: three moves.
 * 21.4  Directions next to CS from offladder.com/directions. OffLadder finds yours in 3 questions.
 * 24.0  End card. Comment your degree. We'll look it up.
 * 29.6  Ladder wipe back to the first frame.
 *
 * Sources and exact wording: scripts/cooked-or-not.md (claims K7-K10).
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'Cooked or not?', theme: 'dark', grain: 0.06 });
  const GC = { cx: 540, cy: 1330, r: 290 };

  // ---------------------------------------------------------------- A: the hook (also the loop's last frame)
  function hook(parent) {
    const lab = K.lines(parent, { lines: ['NEW YORK FED DATA · RECENT GRADS'], x: 72, y: 330, size: 32, color: C.orange, track: 0.06 });
    const title = K.lines(parent, { lines: ['IS A COMPUTER', 'SCIENCE DEGREE'], x: 72, y: 378, size: 94, lh: 0.92, color: C.paper });
    K.fit(title, 900);
    const cooked = K.lines(parent, { lines: ['COOKED?'], x: 66, y: 552, size: 170, color: C.orange });
    const G = CO.gauge(parent, GC);
    G.s.trem = 1;
    return { lab, title, cooked, G };
  }
  const sA = K.scene(0, 2.1);
  const A = hook(sA);
  [A.lab, A.title, A.cooked].forEach(T => K.check(T.box, 0.5, 'hook'));
  K.drift(0, 2.0, { from: 1, to: 1.02 });
  K.camSet(2.0, { scale: 1, x: 0, y: 0 });
  // The needle flinches towards COOKED, then back.
  tl.to(A.G.s, { v: 0.64, duration: 0.3, ease: 'power3.out' }, 0.9);
  tl.to(A.G.s, { v: 0.5, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, 1.2);
  K.sfx('tick', 0.9, 0.5); K.sfx('tick', 1.2, 0.4, { tock: true });
  K.unreveal(A.lab, 1.75, { stagger: 0.01 });
  K.unreveal(A.title, 1.75, { stagger: 0.02 });
  K.unreveal(A.cooked, 1.8, {});
  // The gauge stays for the evidence: small, at the bottom, reacting to every number.
  const G = A.G;
  const sGauge = K.scene(0, 18.05);
  sGauge.appendChild(G.box);
  tl.to(G.box, { scale: 0.56, y: 120, duration: 0.55, ease: 'whip', transformOrigin: `${GC.cx}px ${GC.cy}px` }, 1.95);

  // ---------------------------------------------------------------- B: 73 majors
  const RATES = [['Anthropology', 7.92], ['Computer Engineering', 7.78], ['Fine Arts', 7.66], ['Computer Science', 6.99], ['Performing Arts', 6.95], ['Architecture', 6.84], ['Art History', 6.69], ['Physics', 6.63], ['Early Childhood Education', 6.59], ['Environmental Studies', 6.31], ['Medical Technicians', 6.24], ['English Language', 6.14], ['International Affairs', 6.11], ['Information Systems & Management', 5.98], ['Mathematics', 5.77], ['Commercial Art & Graphic Design', 5.74], ['Advertising and Public Relations', 5.68], ['Pharmacy', 5.62], ['Mass Media', 5.16], ['Philosophy', 5.12], ['Business Analytics', 5.03], ['Psychology', 4.99], ['Ethnic Studies', 4.86], ['Chemical Engineering', 4.71], ['Sociology', 4.59], ['General Engineering', 4.54], ['Nutrition Sciences', 4.54], ['Political Science', 4.48], ['Miscellaneous Biological Science', 4.4], ['Marketing', 4.4], ['Mechanical Engineering', 4.36], ['Chemistry', 4.33], ['General Business', 4.31], ['History', 4.31], ['Biology', 4.29], ['Family and Consumer Sciences', 4.29], ['Industrial Engineering', 4.15], ['Interdisciplinary Studies', 3.94], ['Communications', 3.86], ['Liberal Arts', 3.84], ['Earth Sciences', 3.84], ['Health Services', 3.82], ['Business Management', 3.79], ['Miscellaneous Engineering', 3.69], ['Miscellaneous Technologies', 3.6], ['Criminal Justice', 3.56], ['Economics', 3.52], ['Electrical Engineering', 3.16], ['Theology and Religion', 3.12], ['Finance', 2.76], ['Leisure and Hospitality', 2.73], ['Biochemistry', 2.69], ['General Education', 2.63], ['Treatment Therapy', 2.62], ['Accounting', 2.55], ['Animal and Plant Sciences', 2.54], ['Miscellaneous Physical Sciences', 2.52], ['Journalism', 2.32], ['Civil Engineering', 2.26], ['General Social Sciences', 2.26], ['Public Policy and Law', 2.24], ['Construction Services', 2.18], ['Aerospace Engineering', 2.18], ['Nursing', 2.15], ['Secondary Education', 2.12], ['Social Services', 1.94], ['Engineering Technologies', 1.74], ['Geography', 1.6], ['Foreign Language', 1.58], ['Agriculture', 1.4], ['Elementary Education', 1.18], ['Miscellaneous Education', 1.09], ['Special Education', 0.74]];
  const Y0 = 1180, PX = 50, X0 = 72, PITCH = 12.8;
  const CS = 3, colX = i => X0 + i * PITCH;
  const sChart = K.scene(2.0, 10.7);
  const cols = RATES.map(([, v], i) => {
    const e = K.el('div', 'col', sChart);
    K.css(e, { left: colX(i) + 'px', top: (Y0 - v * PX) + 'px', height: (v * PX) + 'px', background: CO.heat(0.3 + 0.62 * (v / 8)) });
    tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'expo.out' }, 2.1 + i * 0.008);
    return e;
  });
  K.sfx('shimmer', 2.1, 0.4, { dur: 0.7 });
  const axis = K.el('div', 'layer', sChart);
  K.css(axis, { top: Y0 + 'px', left: X0 + 'px', width: (72 * PITCH + 9) + 'px', height: '3px', background: C.muted });
  tl.fromTo(axis, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 2.05);
  tl.to(cols[CS], { backgroundColor: C.paper2, duration: 0.15 }, 3.0);
  tl.fromTo(cols[CS], { scaleX: 1 }, { scaleX: 1.8, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, 3.0);
  const csTag = K.el('div', 'src', sChart, 'CS');
  K.css(csTag, { left: (colX(CS) - 6) + 'px', top: (Y0 - 6.99 * PX - 34) + 'px', color: C.paper2 });
  tl.fromTo(csTag, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 3.0);
  const dash = K.el('div', 'dash', sChart);
  K.css(dash, { left: X0 + 'px', top: (Y0 - 4.21 * PX - 2) + 'px', width: (72 * PITCH + 9) + 'px' });
  tl.fromTo(dash, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 4.0);
  const dashL = K.el('div', 'src', sChart, 'All recent grads: 4.2%');
  K.css(dashL, { left: '600px', top: (Y0 - 4.21 * PX - 38) + 'px', color: C.paper });
  tl.fromTo(dashL, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 4.3);
  K.check(dashL, 5, 'all grads label');

  const sB = K.scene(2.0, 6.0);
  const src = K.el('div', 'src', sB, 'New York Fed · 2024 data, published Feb 2026');
  K.css(src, { left: '72px', top: '284px' });
  tl.fromTo(src, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.05);
  const b0 = K.lines(sB, { lines: ['UNEMPLOYMENT, RECENT GRADS (22–27)'], x: 72, y: 330, size: 30, color: C.orange, track: 0.06 });
  K.fit(b0, 900);
  K.reveal(b0, 2.05, { stagger: 0.015, dur: 0.45 });
  const pct = K.lines(sB, { lines: ['7.0%'], x: 64, y: 374, size: 190, color: C.orange });
  K.reveal(pct, 3.0, { dur: 0.55 });
  K.sfx('impact', 3.0, 0.5, { big: 0.5 });
  const nm = K.lines(sB, { lines: ['COMPUTER SCIENCE'], x: 72, y: 560, size: 62, color: C.paper });
  K.fit(nm, 900);
  K.reveal(nm, 3.12, { stagger: 0.03, dur: 0.5 });
  const rk = K.lines(sB, { lines: ['4th highest of 73 majors.'], font: 'serif', size: 60, x: 72, y: 632, color: C.paper });
  K.reveal(rk, 3.5, { stagger: 0.03, dur: 0.5, from: 135 });
  [b0, pct, nm, rk].forEach(T => K.check(T.box, 5.2, 'cs 7%'));
  CO.needle(G, 4.0, 0.72);
  K.unreveal(pct, 5.72, { dur: 0.24 }); K.unreveal(nm, 5.72, { stagger: 0.01, dur: 0.24 });
  K.unreveal(rk, 5.74, { stagger: 0.01, dur: 0.24 }); K.unreveal(b0, 5.74, { stagger: 0.005, dur: 0.24 });
  tl.to(src, { autoAlpha: 0, duration: 0.2 }, 5.75);

  // ---------------------------------------------------------------- C: higher than...
  const sC = K.scene(6.0, 10.0);
  const c0 = K.lines(sC, { lines: ['CS IS HIGHER THAN:'], x: 72, y: 340, size: 78, color: C.paper });
  K.fit(c0, 900);
  K.reveal(c0, 6.0, { stagger: 0.03 });
  [['ART HISTORY', '6.7%', 6, 6.5], ['ENGLISH', '6.1%', 11, 7.5], ['PHILOSOPHY', '5.1%', 19, 8.5]].forEach(([name, v, idx, t], k) => {
    const row = K.lines(sC, { lines: [`${name} ${v}`], x: 72, y: 460 + k * 94, size: 72, color: C.paper });
    row.words[row.words.length - 1].style.color = C.orange;
    K.reveal(row, t, { stagger: 0.03, dur: 0.4 });
    tl.fromTo(row.box, { x: -30 }, { x: 0, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, t);
    tl.to(cols[idx], { backgroundColor: C.paper2, duration: 0.12 }, t);
    tl.fromTo(cols[idx], { scaleX: 1 }, { scaleX: 1.8, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, t);
    K.sfx('thud', t, 0.55);
    K.shake(t, { amp: 6, dur: 0.25 });
    CO.needle(G, t + 0.05, 0.76 + k * 0.05, { dur: 0.6 });
    K.check(row.box, 9.4, 'higher than');
  });
  K.check(c0.box, 9.4, 'higher than');

  // ---------------------------------------------------------------- D: BUT.
  K.glitch(9.95, { dur: 0.16, seed: 21 });
  const sD = K.scene(10.0, 10.7);
  const but = K.lines(sD, { lines: ['BUT.'], x: 60, y: 420, size: 330, color: C.paper2 });
  K.reveal(but, 10.0, { dur: 0.3, from: 120 });
  K.check(but.box, 10.4, 'but');
  tl.to(sChart, { opacity: 0.15, duration: 0.3 }, 10.0);
  tl.to(G.s, { trem: 3.2, duration: 0.1 }, 10.0);
  tl.to(G.s, { trem: 1, duration: 0.8 }, 10.3);
  K.unreveal(but, 10.5, { dur: 0.2 });

  // ---------------------------------------------------------------- E: the CS grads who do work
  const sE = K.scene(10.6, 13.05);
  const e0 = K.lines(sE, { lines: ['WORKING IN A JOB THAT', 'DOESN’T NEED A DEGREE:'], x: 72, y: 330, size: 32, lh: 1.2, color: C.orange, track: 0.06 });
  K.reveal(e0, 10.62, { stagger: 0.015, dur: 0.45 });
  const bars = [['CS GRADS', 19.13, '19%', C.orange, 10.8], ['ALL RECENT GRADS', 39.35, '39%', '#6E6B66', 11.2]].map(([name, v, lab, col, t], k) => {
    const y = 450 + k * 176;
    const L = K.lines(sE, { lines: [name], x: 72, y, size: 36, color: C.paper, track: 0.02 });
    K.reveal(L, t, { stagger: 0.02, dur: 0.4 });
    const bar = K.el('div', 'hbar', sE);
    K.css(bar, { top: (y + 48) + 'px', width: (v * 18) + 'px', background: col });
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t + 0.05);
    const V = K.lines(sE, { lines: [lab], x: 72 + v * 18 + 22, y: y + 44, size: 84, color: C.paper2 });
    K.reveal(V, t + 0.3, { dur: 0.4 });
    K.sfx('pop', t + 0.3, 0.6, { note: 3 + k * 2 });
    K.check(V.box, 12.6, 'bar value'); K.check(L.box, 12.6, 'bar label');
    return { L, bar, V };
  });
  const e2 = K.lines(sE, { lines: ['CS grads who work mostly land', 'jobs that need the degree.'], font: 'serif', size: 62, lh: 1.04, x: 72, y: 830, color: C.paper });
  K.fit(e2, 880);
  K.reveal(e2, 11.7, { stagger: 0.025, dur: 0.5, from: 135 });
  K.check(e0.box, 12.6, 'working in a job'); K.check(e2.box, 12.6, 'cs grads who work');
  CO.needle(G, 12.0, 0.58);
  K.unreveal(e0, 12.78, { stagger: 0.005, dur: 0.22 }); K.unreveal(e2, 12.78, { stagger: 0.005, dur: 0.22 });
  bars.forEach(b => { K.unreveal(b.L, 12.78, { dur: 0.22 }); K.unreveal(b.V, 12.78, { dur: 0.22 }); tl.to(b.bar, { scaleX: 0, duration: 0.25, ease: 'expo.in' }, 12.78); });

  // ---------------------------------------------------------------- F: still growing
  const sF = K.scene(13.0, 15.65);
  const fsrc = K.el('div', 'src', sF, 'US Bureau of Labor Statistics, Aug 2026');
  K.css(fsrc, { left: '72px', top: '284px' });
  tl.fromTo(fsrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 13.05);
  const f0 = K.lines(sF, { lines: ['SOFTWARE DEVELOPER JOBS:'], x: 72, y: 330, size: 32, color: C.orange, track: 0.04 });
  K.fit(f0, 900);
  K.reveal(f0, 13.05, { stagger: 0.015, dur: 0.45 });
  const f1 = K.lines(sF, { lines: ['+10%'], x: 60, y: 384, size: 250, color: C.paper2 });
  K.reveal(f1, 13.2, { dur: 0.55 });
  K.sfx('impact', 13.2, 0.5, { big: 0.5 });
  const f2 = K.lines(sF, { lines: ['projected US growth, 2025 to 2035'], font: 'serif', size: 64, x: 72, y: 638, color: C.paper });
  K.fit(f2, 880);
  K.reveal(f2, 13.45, { stagger: 0.02, dur: 0.5, from: 135 });
  const f3 = K.lines(sF, { lines: ['(the average job: +3%)'], font: 'serif', size: 50, x: 72, y: 716, color: '#9A968F' });
  K.reveal(f3, 13.6, { stagger: 0.02, dur: 0.45, from: 135 });
  [f0, f1, f2, f3].forEach(T => K.check(T.box, 15.2, 'plus ten'));
  CO.needle(G, 14.0, 0.44);
  K.unreveal(f0, 15.4, { stagger: 0.005, dur: 0.22 }); K.unreveal(f1, 15.4, { dur: 0.22 });
  K.unreveal(f2, 15.4, { stagger: 0.005, dur: 0.22 }); K.unreveal(f3, 15.42, { stagger: 0.005, dur: 0.22 });
  tl.to(fsrc, { autoAlpha: 0, duration: 0.2 }, 15.4);

  // ---------------------------------------------------------------- G: the verdict
  tl.to(G.box, { scale: 1, y: -60, duration: 0.6, ease: 'whip' }, 15.55);
  K.sfx('whoosh', 15.5, 0.6, { dur: 0.5, up: false });
  CO.needle(G, 16.0, 0.42, { dur: 1.2 });
  tl.to(G.s, { trem: 0.35, duration: 1.0 }, 16.0);
  const sG = K.scene(15.6, 18.05);
  const st = K.stamp(sG, { text: 'NOT COOKED.', x: 530, y: 560, size: 98, color: C.paper2, rot: -6 });
  K.slam(st, 16.4, { dust: C.orange, shake: 22, flash: 0.25 });
  const g2 = K.lines(sG, { lines: ['But it’s harder to get into.'], font: 'serif', size: 70, x: 72, y: 730, color: C.paper });
  K.fit(g2, 880);
  K.reveal(g2, 16.9, { stagger: 0.03, dur: 0.55, from: 135 });
  K.check(st, 17.6, 'not cooked'); K.check(g2.box, 17.6, 'harder to get into');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 2.4, ease: 'none', immediateRender: false }, 15.6);

  // ---------------------------------------------------------------- H: build proof
  K.ladder(18.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 18.0); K.theme('light', 18.0); K.camSet(18.0, { scale: 1, x: 0, y: 0 });
  const sH = K.scene(18.0, 21.45);
  const h0 = K.lines(sH, { lines: ['IF YOU’RE STUDYING IT:'], x: 72, y: 330, size: 32, color: C.orange, track: 0.06 });
  K.reveal(h0, 18.05, { stagger: 0.02, dur: 0.45 });
  const h1 = K.lines(sH, { lines: ['DON’T JUST COLLECT', 'THE DEGREE.'], x: 72, y: 380, size: 96, lh: 0.92 });
  K.fit(h1, 900);
  K.reveal(h1, 18.1, { stagger: 0.04 });
  const h2 = K.marks(sH, { lines: ['BUILD PROOF:'], x: 72, y: 590, size: 84 });
  K.markIn(h2, 18.6);
  const MOVES = ['Ship one real project a month.', 'Get good at checking AI’s code.', 'Test a direction next to yours.'];
  const rows = MOVES.map((txt, k) => {
    const r = K.el('div', 'chk', sH, `<div class="box"></div>${txt}`);
    r.style.top = (724 + k * 94) + 'px';
    const t = 19.1 + k * 0.62;
    tl.fromTo(r, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, t);
    K.sfx('pop', t, 0.55, { note: 4 + k });
    K.check(r, 21.0, 'move ' + (k + 1));
    return { r, t };
  });
  const tsv = K.svg(sH);
  rows.forEach(({ r, t }) => {
    const y = parseFloat(r.style.top);
    const tick = K.path(tsv, `M${72 + 12} ${y + 28} L${72 + 26} ${y + 44} L${72 + 52} ${y + 8}`, { stroke: C.orange, width: 11 });
    gsap.set(tick, { drawSVG: '0%' });
    K.draw(tick, t + 0.25, 0.25, 'power2.out', 'scribble');
  });
  [h0, h1].forEach(T => K.check(T.box, 21.0, 'build proof')); K.check(h2.box, 21.0, 'build proof mark');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 3.4, ease: 'none', immediateRender: false }, 18.0);

  // ---------------------------------------------------------------- I: directions next to CS
  K.camSet(21.4, { scale: 1, x: 0, y: 0 });
  const sI = K.scene(21.4, 24.1);
  const i0 = K.lines(sI, { lines: ['DIRECTIONS NEXT TO CS'], x: 72, y: 330, size: 32, color: C.orange, track: 0.06 });
  K.reveal(i0, 21.42, { stagger: 0.02, dur: 0.45 });
  const isrc = K.el('div', 'src', sI, 'from offladder.com/directions');
  K.css(isrc, { left: '72px', top: '374px', color: C.muted });
  tl.fromTo(isrc, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 21.5);
  const cards = AI.cards(sI, ['Model evaluation writer', 'AI workflow designer', 'Agentic systems operator'], 21.5, { y0: 430, step: 112, every: 0.22, seed: 31 });
  cards.forEach(c => K.check(c, 23.6, 'direction card'));
  const i1 = K.lines(sI, { lines: ['OffLadder finds yours in 3 questions,', 'then adapts to what you try.'], font: 'serif', size: 68, lh: 1.04, x: 72, y: 800 });
  K.fit(i1, 880);
  i1.lines[1].words.slice(-3).forEach(w => { w.style.color = C.orange; });
  K.reveal(i1, 22.3, { stagger: 0.025, dur: 0.55, from: 135 });
  K.check(i1.box, 23.6, 'offladder line'); K.check(i0.box, 23.6, 'directions label');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 2.6, ease: 'none', immediateRender: false }, 21.4);

  // ---------------------------------------------------------------- J: end card and loop
  AI.end(24.0, 29.62, { ask: ['Comment your degree.', 'We’ll look it up.'] });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (D minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Dm', drums: 'pulse', pad: 0.9, lp: [0.35, 0.5] },                          //  0 the hook
      { chord: 'Bb', drums: 'intro', pad: 1, arp: 'up', arpgain: 0.7, lp: [0.55, 0.85] },  //  2 73 majors
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           //  4 the needle swings
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           //  6 higher than
      { chord: 'Dm', drums: 'build', bass: 1, pad: 1, arp: 'up' },                         //  8
      { chord: 'Bb', drums: 'half', bass: 0.7, pad: 1, lp: 0.7, hit: true },               // 10 BUT.
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           // 12 jobs that need the degree
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },               // 14 +10%
      { chord: 'Dm', drums: 'full', bass: 1, pad: 1, arp: 'up', hit: true },               // 16 the verdict
      { chord: 'Bb', drums: 'four', bass: 1, pad: 1, arp: 'up' },                          // 18 build proof
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 22 directions
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          // 24 end card
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Dm', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },          // 28 closing into the loop
    ],
    risers: [[8.0, 10.0, 0.9], [14.0, 16.0, 0.7]],
    rolls: [[9.0, 10.0], [15.0, 16.0]],
  };
  K.sfx('boom', 0, 0.5);
};
