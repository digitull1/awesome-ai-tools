// @shared ai
/* The ladder is breaking #2 · The jobs employers expect to shrink by 2030 (TikTok cut)
 * The YouTube layout, scaled by K.refit into TikTok's box (10-viral-standard.md). Everything else matches ai02.
 *
 *  0.0  A split-flap departures board, legible from the first frame: jobs employers expect to shrink
 *       (World Economic Forum, Future of Jobs Report 2025, fastest-declining roles).
 *  2.0  Every leaf clatters over to the roles expected to grow fastest.
 *  4.0  Whip down. MIT: about 60% of US jobs are types of work created since 1940 (Autor et al., QJE).
 *  8.0  Whip down. Work taking shape right now: six directions from offladder.com. Your job might not
 *       have a name yet.
 * 12.0  Ladder wipe to paper. So don't choose a job title. Find the kind of work you're good at. Then test it.
 * 16.0  Whip down. How OffLadder works: question one from the site, a tap, directions, a tonight experiment.
 * 24.0  End card. What were you told to study?
 * 29.6  Ladder wipe back to the board, so the Short loops.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06, safe: 'social' });

  // ---------------------------------------------------------------- A: the board
  const DOWN = ['BANK TELLERS', 'DATA ENTRY CLERKS', 'POSTAL SERVICE CLERKS', 'CASHIERS', 'ADMIN ASSISTANTS', 'ACCOUNTANTS, AUDITORS'];
  const UP = ['BIG DATA SPECIALISTS', 'FINTECH ENGINEERS', 'AI AND ML SPECIALISTS', 'SOFTWARE DEVELOPERS', 'SECURITY SPECIALISTS', 'EV SPECIALISTS'];
  const NT = 22, PX = 42.55, PY = 70, BX = 72, BY = 566;
  const glyph = ch => (ch === ' ' ? '&nbsp;' : ch === '&' ? '&amp;' : ch);
  function board(parent) {
    const lab = K.lines(parent, { lines: ['WORLD ECONOMIC FORUM · JAN 2025'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
    const title = K.lines(parent, { lines: ['Employers expect these', 'jobs to shrink by 2030:'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 362, color: C.paper });
    K.fit(title, 900);
    const tiles = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < NT; c++) {
        const el = K.el('div', 'tile', parent);
        K.css(el, { left: BX + c * PX + 'px', top: BY + r * PY + 'px' });
        const a = DOWN[r][c] || ' ', b = UP[r][c] || ' ';
        tiles.push({ r, c, el, sp: K.el('span', '', el, glyph(a)), a, b, shown: a });
      }
    }
    const yours = K.lines(parent, { lines: ['Is yours', 'on the list?'], font: 'serif', size: 150, lh: 0.96, x: 72, y: 1060, color: C.orange });
    K.fit(yours, 820);
    return { lab, title, tiles, yours };
  }
  const sA = K.scene(0, 4.2);
  const B = board(sA);
  K.check(B.title.box, 0.5, 'board title');
  K.check(B.tiles[B.tiles.length - 1].el, 0.5, 'board');
  K.drift(0, 2.0, { from: 1, to: 1.02 });

  // At 2.0 every leaf clatters over, in a wave from the top left.
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&';
  const hash = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const STEP = 0.052;
  B.tiles.forEach(T => {
    T.t0 = 2.0 + T.r * 0.05 + T.c * 0.012;
    T.n = T.a === ' ' && T.b === ' ' ? 0 : 3 + Math.floor(hash(T.r, T.c) * 4);
    T.seq = Array.from({ length: T.n }, (_, k) => LETTERS[Math.floor(hash(T.r * 7 + k, T.c * 3 + k) * LETTERS.length)]);
    for (let k = 0; k <= T.n; k++) if (T.n && T.c % 2 === 0) K.sfx('flap', T.t0 + k * STEP, 0.55, { pan: (T.c / NT - 0.5) * 1.2, seed: T.r * 100 + T.c * 7 + k });
  });
  K.hint((a, b) => (b > 1.95 && a < 2.9 ? 20 : 0));
  K.frame(t => {
    if (t > 4.3) return;
    for (const T of B.tiles) {
      let ch = T.a, sq = 1;
      if (T.n && t >= T.t0) {
        const f = (t - T.t0) / STEP, k = Math.floor(f);
        ch = k < T.n ? T.seq[k] : T.b;
        if (k <= T.n) sq = Math.max(0.08, Math.abs(Math.cos(Math.PI * Math.min(1, f - k + 0.5))));
      } else if (!T.n) ch = T.b;
      if (ch !== T.shown) { T.sp.innerHTML = glyph(ch); T.shown = ch; }
      T.sp.style.transform = `scaleY(${sq.toFixed(3)})`;
    }
  });
  K.unreveal(B.title, 1.86, { stagger: 0.02 });
  K.unreveal(B.yours, 1.8, { stagger: 0.03 });
  K.check(B.yours.box, 0.5, 'is yours on the list');
  const t2 = K.lines(sA, { lines: ['…and these to grow', 'fastest by 2030:'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 362, color: C.paper });
  K.fit(t2, 900);
  t2.lines[0].words.slice(-2).forEach(w => { w.style.color = C.orange; });
  K.reveal(t2, 2.12, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(t2.box, 3.4, 'grow title');

  // ---------------------------------------------------------------- B: new work since 1940
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 3.58);
  K.sfx('whoosh', 3.48, 1, { dur: 0.6, up: false });
  const sB = K.scene(3.5, 8.2);
  sB.style.top = Y1 + 'px';
  const labB = K.lines(sB, { lines: ['MIT · QUARTERLY JOURNAL OF ECONOMICS · 2024'], x: 72, y: 318, size: 30, color: C.orange, track: 0.06 });
  const about = K.lines(sB, { lines: ['About'], font: 'serif', size: 84, x: 72, y: 362, color: C.paper });
  K.reveal(labB, 4.02, { stagger: 0.02 });
  K.reveal(about, 4.1, { stagger: 0.04, dur: 0.55, from: 135 });
  const SL = 330;
  const slot = K.slot(sB, { x: 60, y: 452, size: SL, cols: 2, color: C.orange, spins: 2 });
  K.slotTo(slot, 60, 4.3, { dur: 0.85 });
  const pct = K.lines(sB, { lines: ['%'], x: 60 + 2 * 0.64 * SL, y: 452, size: SL, lh: 1, color: C.orange });
  K.reveal(pct, 4.7, { stagger: 0 });
  const ofB = K.lines(sB, { lines: ['of US jobs are types of work', 'created since 1940.'], font: 'serif', size: 84, lh: 1.02, x: 72, y: 806, color: C.paper });
  K.fit(ofB, 900);
  K.reveal(ofB, 4.9, { stagger: 0.035, dur: 0.6, from: 135 });
  const figs = Array.from({ length: 10 }, (_, k) => {
    const f = K.el('div', 'fig', sB, '<i></i><b></b>');
    K.css(f, { left: 72 + k * 84 + 'px', top: '1030px', color: '#3A3936' });
    tl.fromTo(f, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)' }, 5.3 + k * 0.03);
    if (k < 6) { tl.to(f, { color: C.orange, duration: 0.12 }, 5.9 + k * 0.09); K.sfx('pop', 5.9 + k * 0.09, 0.6, { note: k }); }
    return f;
  });
  const key = K.lines(sB, { lines: ['■ NEW TYPES OF WORK SINCE 1940'], x: 72, y: 1166, size: 22, color: C.orange, track: 0.08 });
  K.reveal(key, 6.4, { stagger: 0.02 });
  const inv = K.lines(sB, { lines: ['New work keeps', 'being invented.'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 1230, color: C.paper });
  K.reveal(inv, 6.8, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(ofB.box, 7.5, 'of US jobs'); K.check(inv.box, 7.6, 'new work'); K.check(figs[9], 7.5, 'figures');

  // ---------------------------------------------------------------- C: work taking shape
  const Y2 = 3840;
  tl.to(K.cam, { ...K.frameOn(540, Y2 + 960, 1), duration: 0.42, ease: 'whip' }, 7.58);
  K.sfx('whoosh', 7.48, 1, { dur: 0.6, up: false });
  const sC = K.scene(7.5, 12.0);
  sC.style.top = Y2 + 'px';
  const labC = K.lines(sC, { lines: ['Work taking shape', 'right now:'], font: 'serif', size: 92, lh: 1.0, x: 72, y: 318, color: C.paper });
  K.reveal(labC, 8.0, { stagger: 0.04, dur: 0.6, from: 135 });
  K.unreveal(labC, 10.25, { stagger: 0.02 });
  AI.cards(sC, ['Provenance and authenticity analyst', 'Digital accessibility engineer', 'Supply chain traceability analyst',
    'Bio-materials fabricator', 'Cyber-physical security tester', 'Sound and acoustics installer'], 8.3, { y0: 600, step: 118, every: 0.3, seed: 21 });
  const name = K.lines(sC, { lines: ['Your job might not', 'have a name yet.'], font: 'serif', size: 110, lh: 1.0, x: 72, y: 300, color: C.orange });
  K.fit(name, 900);
  K.reveal(name, 10.56, { stagger: 0.05, dur: 0.6, from: 135 });
  K.check(name.box, 11.3, 'no name yet');

  // ---------------------------------------------------------------- D: the approach
  K.ladder(12.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 12.0); K.theme('light', 12.0); K.camSet(12.0, { scale: 1, x: 0, y: 0 });
  const sD = K.scene(12.0, 16.3);
  const d1 = K.lines(sD, { lines: ['SO DON’T', 'CHOOSE A', 'JOB TITLE.'], x: 72, y: 430, size: 150, lh: 0.9 });
  K.fit(d1, 900);
  K.reveal(d1, 12.08, { stagger: 0.05 });
  const d2 = K.lines(sD, { lines: ['Find the kind of work', 'you’re good at.'], font: 'serif', size: 104, lh: 1.0, x: 72, y: 880, color: C.orange });
  K.fit(d2, 880);
  K.reveal(d2, 12.9, { stagger: 0.04, dur: 0.65, from: 135 });
  K.check(d1.box, 13.6, 'dont choose'); K.check(d2.box, 13.6, 'find the work');
  K.unreveal(d1, 13.86, { stagger: 0.02 }); K.unreveal(d2, 13.9, { stagger: 0.02 });
  const d3 = K.marks(sD, { lines: ['THEN', 'TEST IT.'], x: 72, y: 640, size: 156 });
  K.markIn(d3, 14.1, { stagger: 0.12 });
  K.sfx('thud', 14.1, 0.6);
  K.check(d3.box, 15.4, 'then test it');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.04, duration: 3.6, ease: 'none', immediateRender: false }, 12.0);

  // ---------------------------------------------------------------- E: how OffLadder works
  const Y3 = 5760;
  tl.to(K.cam, { ...K.frameOn(540, Y3 + 960, 1), duration: 0.42, ease: 'whip' }, 15.58);
  K.sfx('whoosh', 15.48, 1, { dur: 0.6, up: false });
  const sE = K.scene(15.5, 24.1);
  sE.style.top = Y3 + 'px';
  const labE = K.lines(sE, { lines: ['HOW OFFLADDER WORKS'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  const hE = K.lines(sE, { lines: ['Start with 3 questions.'], font: 'serif', size: 88, x: 72, y: 362 });
  K.fit(hE, 900);
  K.reveal(labE, 16.0, { stagger: 0.02 });
  K.reveal(hE, 16.08, { stagger: 0.04, dur: 0.6, from: 135 });
  const ill = K.lines(sE, { lines: ['ILLUSTRATIVE EXAMPLE, FROM OFFLADDER.COM'], x: 72, y: 470, size: 20, color: C.muted, track: 0.1 });
  K.reveal(ill, 16.3, { stagger: 0.01 });
  const OPTS = [['Make something real', 'e.g. set builder, bike mechanic'], ['Work with nature', 'e.g. countryside ranger, vet nurse'],
    ['Create an experience', 'e.g. game writer, podcast producer'], ['Make things run better', 'e.g. live events, logistics'],
    ['Help people', 'e.g. youth worker, paramedic'], ['Figure things out', 'e.g. data analyst, cyber security']];
  const qc = K.el('div', 'qcard', sE, `<div class="tag">Question 1 of 3</div><div class="q">What would you rather spend an hour doing?</div>
    <div class="qopts">${OPTS.map(([a]) => `<div class="qopt"><div class="hl"></div><b>${a}</b></div>`).join('')}</div>`);
  qc.style.top = '512px';
  tl.fromTo(qc, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.5)' }, 16.55);
  K.sfx('pop', 16.6, 0.7, { note: 2 });
  const opts = [...qc.querySelectorAll('.qopt')];
  tl.fromTo(opts, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.06 }, 16.8);
  // A cursor glides to "Figure things out" and taps it.
  const pick = opts[5];
  const qh = qc.offsetHeight;
  const pb = { x: 72 + 5 + pick.offsetLeft + pick.offsetWidth * 0.55, y: 512 + 5 + pick.offsetTop + pick.offsetHeight * 0.55 };
  const cur = K.svg(sE, { x: 0, y: 0, w: 54, h: 70, vb: '0 0 54 70' });
  cur.classList.add('cursor');
  K.path(cur, 'M4 4 L4 56 L17 44 L26 64 L35 60 L26 40 L44 40 Z', { stroke: C.paper2, width: 5, fill: C.ink, join: 'round' });
  gsap.set(cur, { x: 900, y: 1400, autoAlpha: 0 });
  tl.set(cur, { autoAlpha: 1 }, 17.4);
  tl.to(cur, { x: pb.x, y: pb.y, duration: 0.7, ease: 'power3.inOut' }, 17.4);
  tl.to(cur, { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: '10% 10%' }, 18.12);
  tl.to(pick.querySelector('.hl'), { scaleX: 1, duration: 0.3, ease: 'expo.out' }, 18.14);
  K.sfx('click', 18.14, 1);
  tl.to(cur, { x: 980, y: 1500, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 18.6);
  const dc = K.el('div', 'dcard', sE, `<div class="tag">Directions you’d never have thought of</div><div class="txt"><span class="opt">Provenance and authenticity analyst</span><span class="opt">Model evaluation writer</span></div>`);
  dc.style.top = 512 + qh + 26 + 'px';
  tl.fromTo(dc, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.6)' }, 18.75);
  K.sfx('pop', 18.8, 0.7, { note: 5 });
  const tc = K.el('div', 'dcard you', sE, `<div class="tag">Try tonight</div><div class="txt">Trace one viral image to its source, and write down how you know.</div>`);
  tc.style.top = 512 + qh + 26 + dc.offsetHeight + 22 + 'px';
  tl.fromTo(tc, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.6)' }, 19.85);
  K.sfx('pop', 19.9, 0.7, { note: 7 });
  // The header turns over to the point of it all: the loop adapts.
  K.unreveal(hE, 20.9, { stagger: 0.02 });
  K.unreveal(labE, 20.86, { stagger: 0.01 });
  const ad = K.lines(sE, { lines: ['Then it learns what you', 'liked, and adapts.'], font: 'serif', size: 80, lh: 1.0, x: 72, y: 318, color: C.ink });
  K.fit(ad, 900);
  ad.lines[1].words.slice(-1).forEach(w => { w.style.color = C.orange; });
  tl.to(ill.box, { autoAlpha: 0, duration: 0.2 }, 20.9);
  K.reveal(ad, 21.05, { stagger: 0.04, dur: 0.6, from: 135 });
  K.sfx('sparkle', 21.5, 0.6);
  K.check(tc, 22.5, 'try card'); K.check(ad.box, 22.5, 'adapts');
  tl.fromTo(K.cam, { ...K.frameOn(540, Y3 + 960, 1) }, { ...K.frameOn(540, Y3 + 1000, 1.03), duration: 7.9, ease: 'none', immediateRender: false }, 16.0);

  // ---------------------------------------------------------------- F: end card and loop
  AI.end(24.0, 29.62, { ask: ['What were you', 'told to study?'] });
  AI.loop(29.62, C.ink, 'dark', p => board(p));

  // ---------------------------------------------------------------- score (D minor, lifting to F)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Dm', drums: 'pulse', pad: 0.9, lp: [0.24, 0.36] },                        //  0 the board
      { chord: 'Dm', drums: 'intro', pad: 0.9, lp: [0.36, 0.6] },                         //  2 it flips
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up', lp: [0.65, 0.9] },        //  4 60%
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },                          //  6
      { chord: 'Dm', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         //  8 work taking shape
      { chord: 'Bb', drums: 'build', bass: 1, pad: 1, arp: 'up' },                        // 10
      { chord: 'F', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                          // 12 don't choose a title
      { chord: 'C', drums: 'half', bass: 0.7, pad: 1, arp: 'up', arpgain: 0.5, lp: [0.8, 1] },
      { chord: 'Dm', drums: 'four', bass: 1, pad: 1, arp: 'up' },                         // 16 how it works
      { chord: 'Bb', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 24 end card
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },          // 28 closing into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [22.0, 24.0, 0.6]],
    rolls: [[11.0, 12.0]],
  };
  K.sfx('boom', 0, 0.6);

  // ---------------------------------------------------------------- TikTok cut (keep last: the build measures the page)
  K.refit(27.7, 114.8, 0.859);
};
