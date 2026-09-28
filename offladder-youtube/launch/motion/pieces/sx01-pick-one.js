/* Social #1 · Pick one. It shows jobs you'd never have thought of.
 * @shared ai co so
 *
 * Built to 10-viral-standard.md: one master for TikTok, Reels and Shorts, every readable element inside
 * the social safe box. The viewer has a job from the first frame (pick one of four), gets an identity
 * ("I'm a 3"), a reason to rewatch (every answer), and someone to send it to.
 *
 *  0.0  PICK ONE. Four things you might happily do on a Sunday, and a 3-2-1 countdown at their centre.
 *  2.0  Zoom through card 1 on the drop. Each pick reveals two directions from offladder.com/directions,
 *       described in our own words: 2.0, 7.0, 12.0, 17.0, whip-panning between them.
 * 22.0  You'd never have searched for these. All eight gather round OffLadder's mark: it finds yours in
 *       3 questions, then adapts to what you try.
 * 24.5  End card: comment your number; send this to a friend who's a 4. Not a personality test.
 * 29.6  Ladder wipe back to the first frame.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.paper, chip: 'Pick one', theme: 'light', grain: 0.05, safe: 'social' });

  const PICKS = [
    { n: 1, icon: 'tangle', lines: ['UNTANGLE', 'THE CHAOS'], title: 'UNTANGLE THE CHAOS', dirs: [
      ['nodes', 'AI workflow designer', 'Redesigns how a team works when AI takes over part of the job.'],
      ['bolt', 'Grid flexibility coordinator', 'Moves when power gets used, so the grid stays steady.']] },
    { n: 2, icon: 'bulb', lines: ['EXPLAIN', 'HARD STUFF'], title: 'EXPLAIN HARD STUFF', dirs: [
      ['cap', 'AI tutor designer', 'Decides how a machine should teach, and when to hold back the answer.'],
      ['compass', 'Community health navigator', 'Walks people through systems that assume they can cope.']] },
    { n: 3, icon: 'wrench', lines: ['FIX WHAT’S', 'BROKEN'], title: 'FIX WHAT’S BROKEN', dirs: [
      ['battery', 'Battery second-life technician', 'Tests and rebuilds used battery packs, safely.'],
      ['drop', 'Water systems technician', 'Finds leaks and keeps ageing water networks running.']] },
    { n: 4, icon: 'search', lines: ['FIND OUT', 'WHAT’S TRUE'], title: 'FIND OUT WHAT’S TRUE', dirs: [
      ['camera', 'Provenance and authenticity analyst', 'Works out where a photo or a claim really came from.'],
      ['shield', 'Cyber-physical security tester', 'Finds the weak spots in real-world systems before anyone else does.']] },
  ];
  const GRID = [[80, 660], [501, 660], [80, 1042], [501, 1042]];
  const CW = 391, CH = 356, RX = 806, RY = 578;

  // ---------------------------------------------------------------- A: the grid (also the loop's last frame)
  function grid(parent) {
    const title = K.marks(parent, { lines: ['PICK ONE.'], x: 80, y: 330, size: 112 });
    K.markShow(title);
    const sub = K.lines(parent, { lines: ['Your pick shows jobs you’d', 'never have thought of.'], font: 'serif', size: 60, lh: 1.0, x: 82, y: 500 });
    K.fit(sub, 620);
    const cards = PICKS.map((p, k) => {
      const c = SO.task(parent, { n: p.n, icon: p.icon, lines: p.lines, x: GRID[k][0], y: GRID[k][1], w: CW, h: CH });
      return c;
    });
    // The countdown sits where the four cards meet.
    const ring = K.el('div', 'soring', parent);
    K.css(ring, { left: (RX - 84) + 'px', top: (RY - 84) + 'px' });
    const sv = K.svg(ring, { w: 168, h: 168, vb: '0 0 168 168' });
    const arc = K.path(sv, 'M84 14 A70 70 0 1 1 83.99 14', { stroke: C.orange, width: 12, cap: 'butt' });
    const R = K.roller(ring, { x: 0, y: 34, w: 168, h: 100, size: 92, values: ['3', '2', '1'], color: C.ink });
    return { title, sub, cards, ring, arc, R };
  }
  const sA = K.scene(0, 2.02);
  const A = grid(sA);
  K.check(A.title.box, 0.5, 'pick one'); K.check(A.sub.box, 0.5, 'sub');
  A.cards.forEach((c, k) => K.check(c.querySelector('.t'), 0.5, 'card ' + (k + 1)));
  // Attention travels the grid, card by card, as the countdown runs.
  A.cards.forEach((c, k) => {
    tl.fromTo(c, { y: 0 }, { y: -16, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, 0.12 + k * 0.36);
    K.sfx('pop', 0.12 + k * 0.36, 0.45, { note: 3 + k });
  });
  tl.fromTo(A.arc, { drawSVG: '0% 100%' }, { drawSVG: '0% 0%', duration: 1.95, ease: 'none', immediateRender: false }, 0.02);
  K.rollAt(A.R, 1, 0.67, { dur: 0.26 }); K.rollAt(A.R, 2, 1.33, { dur: 0.26 });
  K.sfx('tick', 0.67, 0.8); K.sfx('tick', 1.33, 0.8, { tock: true });
  tl.to(A.ring, { scale: 1.25, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.67);
  tl.to(A.ring, { scale: 1.25, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.33);
  tl.to(A.ring, { scale: 0, rotation: 90, duration: 0.25, ease: 'back.in(2)' }, 1.7);
  // Zoom through card 1 onto the drop.
  const c1 = { x: GRID[0][0] + CW / 2, y: GRID[0][1] + CH / 2 };
  tl.to(K.cam, { ...K.frameOn(c1.x, c1.y, 3.2), duration: 0.3, ease: 'power3.in' }, 1.7);
  K.sfx('whoosh', 1.62, 0.8, { dur: 0.4 });

  // ---------------------------------------------------------------- B: the reveals
  const PAGE = k => 1080 * (k + 1);
  const AT = [2.0, 7.0, 12.0, 17.0];
  PICKS.forEach((p, k) => {
    const t = AT[k], t1 = k < 3 ? AT[k + 1] : 22.0;
    const s = K.scene(t - 0.25, t1 + 0.3);
    s.style.left = PAGE(k) + 'px';
    const big = K.el('div', 'sobig', s, String(p.n));
    K.css(big, { left: '470px', top: '1150px' });
    for (let j = 0; j < 4; j++) {
      const seg = K.el('div', 'soprog' + (j <= k ? ' on' : ''), s);
      K.css(seg, { left: (80 + j * 206) + 'px', top: '1226px', width: '194px' });
    }
    const head = K.el('div', 'sohead', s, `<div class="n">${p.n}</div><div class="k">IF YOU PICKED</div><div class="t">${p.title}</div>`);
    K.css(head, { left: '80px', top: '352px' });
    const hi = SO.icon(head, p.icon, { x: 686, y: 24, size: 104, width: 8 });
    const lab = K.el('div', 'solabel', s, 'YOU’D BE GOOD AT:');
    K.css(lab, { left: '82px', top: '590px' });
    const d1 = SO.dir(s, { icon: p.dirs[0][0], name: p.dirs[0][1], desc: p.dirs[0][2], x: 80, w: 812, y: 642 });
    const d2 = SO.dir(s, { icon: p.dirs[1][0], name: p.dirs[1][1], desc: p.dirs[1][2], x: 80, w: 812, y: 934 });
    [head, d1, d2].forEach(e => K.check(e, t + 3.5, `pick ${p.n}`));
    // The page lands, then each direction deals in with its icon drawing on.
    if (k === 0) {
      K.camSet(t, { ...K.frameOn(PAGE(k) + 540, 960, 1.2) });
      tl.to(K.cam, { ...K.frameOn(PAGE(k) + 540, 960, 1), duration: 0.5, ease: 'expo.out' }, t);
      K.flash(t, { color: C.orange, a: 0.35, dur: 0.2 });
    }
    tl.fromTo(head.querySelector('.n'), { scale: 1.35 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', immediateRender: false }, t + 0.02);
    K.sfx('thud', t + 0.02, 0.5);
    SO.draw(hi, t + 0.1, 0.4);
    tl.fromTo(lab, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, t + 0.45);
    [d1, d2].forEach((d, j) => {
      const td = t + 0.7 + j * 0.9;
      tl.fromTo(d, { x: 700, rotation: 6, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.4)' }, td);
      SO.draw(d._icon, td + 0.2, 0.5);
      K.sfx('deal', td + 0.08, 0.9, { pan: 0.3 });
      K.sfx('pop', td + 0.25, 0.5, { note: 5 + 2 * k + j });
    });
    K.sfx('sparkle', t + 1.9, 0.35);
    // Drift while it's read, then whip to the next page.
    tl.fromTo(K.cam, { ...K.frameOn(PAGE(k) + 540, 960, 1) }, { ...K.frameOn(PAGE(k) + 540, 964, 1.014), duration: t1 - t - 0.9, ease: 'none', immediateRender: false }, t + 0.5);
    const nextX = k < 3 ? PAGE(k + 1) + 540 : 1080 * 5 + 540;
    tl.to(K.cam, { ...K.frameOn(nextX, 960, 1), duration: 0.42, ease: 'whip' }, t1 - 0.21);
    K.sfx('whoosh', t1 - 0.3, 0.8, { dur: 0.5 });
  });

  // ---------------------------------------------------------------- C: you'd never have searched for these
  const sC = K.scene(21.7, 24.6);
  sC.style.left = (1080 * 5) + 'px';
  const c0 = K.lines(sC, { lines: ['YOU’D NEVER HAVE', 'SEARCHED FOR THESE.'], x: 80, y: 330, size: 84, lh: 0.94 });
  K.fit(c0, 812);
  K.reveal(c0, 22.1, { stagger: 0.04 });
  const CX = 486, CY = 800, RR = 250;
  const I = K.ident(sC, { x: CX - 75, y: CY - 81, size: 150, color: C.orange });
  const csv = K.svg(sC);
  const all = PICKS.flatMap(p => p.dirs.map(d => d[0]));
  all.forEach((name, j) => {
    const a = -Math.PI / 2 + (j / all.length) * Math.PI * 2;
    const x = CX + RR * Math.cos(a), y = CY + RR * Math.sin(a);
    const line = K.path(csv, `M${CX + 95 * Math.cos(a)} ${CY + 95 * Math.sin(a)} L${x - 58 * Math.cos(a)} ${y - 58 * Math.sin(a)}`, { stroke: C.ink, width: 4 });
    gsap.set(line, { drawSVG: '0%' });
    K.draw(line, 22.9 + j * 0.07, 0.3);
    const ic = SO.icon(sC, name, { x: x - 50, y: y - 50, size: 100, width: 8, color: C.ink });
    tl.fromTo(ic.s, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 22.4 + j * 0.07);
    SO.draw(ic, 22.4 + j * 0.07, 0.35);
    K.sfx('pop', 22.4 + j * 0.07, 0.35, { note: 2 + j });
  });
  K.identIn(I, 23.0);
  const c1l = K.lines(sC, { lines: ['OffLadder finds yours in 3 questions,', 'then adapts to what you try.'], font: 'serif', size: 58, lh: 1.02, x: 82, y: 1094 });
  K.fit(c1l, 808);
  c1l.lines[1].words.slice(-3).forEach(w => { w.style.color = C.orange; });
  K.reveal(c1l, 23.2, { stagger: 0.025, dur: 0.5, from: 135 });
  K.check(c0.box, 24.2, 'never searched'); K.check(c1l.box, 24.2, 'offladder finds yours');

  // ---------------------------------------------------------------- D: end card and loop
  SO.end(24.5, 29.62, { ask: ['COMMENT YOUR', 'NUMBER.'], chips: ['1', '2', '3', '4'], send: ['Send this to a friend', 'who’s a 4.'], note: 'Not a personality test. A place to start.' });
  AI.loop(29.62, C.paper, 'light', p => grid(p));

  // ---------------------------------------------------------------- score (beat, A minor)
  K.music = {
    bpm: 120, style: 'beat',
    bars: [
      { chord: 'Am', drums: 'intro', pad: 0.9, arp: 'up', arpgain: 0.5, lp: [0.5, 0.9] },   //  0 pick one
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },              //  2 #1
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                         //  6 #2 at 7
      { chord: 'Am', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'build', bass: 1, pad: 1, arp: 'up' },                          // 10
      { chord: 'C', drums: 'trap', bass: 1, pad: 1, arp: 'up', hit: true },                // 12 #3
      { chord: 'G', drums: 'trap', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Am', drums: 'trap', bass: 1, pad: 1, arp: 'up' },                          // 16 #4 at 17
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'build', bass: 1, pad: 1, arp: 'up' },                          // 20
      { chord: 'G', drums: 'half', bass: 0.8, pad: 1, lp: 0.85 },                          // 22 never searched
      { chord: 'Am', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },             // 24 end card
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'down', lp: [1, 0.45] },        // 28 into the loop
    ],
    risers: [[10.0, 12.0, 0.7], [20.0, 22.0, 0.6]],
    rolls: [[11.0, 12.0]],
  };
};
