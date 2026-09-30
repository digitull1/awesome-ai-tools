// @shared ai
/* The ladder is breaking #1 · "Probably none of us will have a job." (TikTok cut)
 * The YouTube layout, scaled by K.refit into TikTok's box (10-viral-standard.md). Everything else matches ai01.
 *
 *  0.0  Elon Musk, VivaTech (Paris, remote), 23 May 2024: "Probably none of us will have a job."
 *       On screen from the first frame; the word "job" gets struck out.
 *  2.0  Glitch cut. Sam Altman, "The Gentle Singularity", June 2025: "whole classes of jobs going away".
 *  4.0  Glitch cut. World Economic Forum, Future of Jobs Report 2025 (employer survey, to 2030):
 *       1,200 squares, one per million of the 1.2 billion jobs studied. 92 fall out; 170 new ones light up.
 *  8.0  Whip down. Work taking shape right now: eight directions from offladder.com/directions.
 * 12.0  Ladder wipe to paper. Nobody knows which jobs will last. So don't bet on a job title. Test it first.
 * 16.0  Whip down. How OffLadder works: the site's own illustrative example of the loop adapting.
 * 24.0  Panel wipe to orange. Don't pick your future. Test it. offladder.com. What job were you told was safe?
 * 29.6  Ladder wipe back to the first frame, so the Short loops.
 *
 * Every quote is verbatim and every figure is the source's own; see scripts/ai-series.md.
 */
window.build = function () {
  const { C, tl } = K;
  const DUR = 30;
  K.init({ duration: DUR, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06, safe: 'social' });

  // ---------------------------------------------------------------- A: Musk
  function musk(parent) {
    const lab = K.lines(parent, { lines: ['ELON MUSK · MAY 2024'], x: 72, y: 372, size: 36, color: C.orange, track: 0.06 });
    const q = K.lines(parent, { lines: ['“Probably', 'none of us', 'will have', 'a job.”'], font: 'serif', size: 232, lh: 0.94, x: 66, y: 430, color: C.paper });
    K.fit(q, 880);
    q.lines[1].words.forEach(w => { w.style.color = C.orange; });
    return { lab, q };
  }
  const sA = K.scene(0, 2.0);
  const A = musk(sA);
  K.check(A.q.box, 0.5, 'Musk quote');
  K.drift(0, 2.0, { from: 1, to: 1.035 });
  // "a job." is struck out, in orange, like a line deleted from a list.
  const strikeSvg = K.svg(sA);
  const r = document.createRange(); r.selectNodeContents(A.q.lines[3].inner);
  const jb = r.getBoundingClientRect(), wb = K.world.getBoundingClientRect();
  const sy = jb.top - wb.top + jb.height * 0.52;
  const strike = K.path(strikeSvg, `M${jb.left - wb.left - 10},${sy + 8} L${jb.right - wb.left + 14},${sy - 10}`, { stroke: C.orange, width: 16, cap: 'butt' });
  gsap.set(strike, { drawSVG: '0%' });
  K.draw(strike, 1.2, 0.3, 'power3.inOut', 'scribble');
  tl.to(A.q.lines[3].inner, { opacity: 0.45, duration: 0.3 }, 1.35);
  K.sfx('boom', 0, 0.7);
  [0.5, 1.0, 1.5].forEach((t, i) => K.sfx('tick', t, 0.6, { tock: i % 2 === 1 }));

  // ---------------------------------------------------------------- B: Altman
  K.glitch(1.9, { dur: 0.18, seed: 3 });
  const sB = K.scene(2.0, 4.0);
  const labB = K.lines(sB, { lines: ['SAM ALTMAN · JUNE 2025'], x: 72, y: 372, size: 36, color: C.orange, track: 0.06 });
  const qB = K.lines(sB, { lines: ['“Whole classes', 'of jobs', 'going away.”'], font: 'serif', size: 210, lh: 0.94, x: 66, y: 440, color: C.paper });
  K.fit(qB, 830);
  qB.lines[2].words.forEach(w => { w.style.color = C.orange; });
  const srcB = K.lines(sB, { lines: ['from his essay “The Gentle Singularity”'], font: 'serif', size: 52, x: 72, y: 1050, color: C.paper });
  srcB.box.style.opacity = 0.62;
  K.reveal(labB, 2.0, { stagger: 0.02, dur: 0.45 });
  K.reveal(qB, 2.03, { stagger: 0.05, dur: 0.62, from: 135 });
  K.reveal(srcB, 2.5, { stagger: 0.02, dur: 0.5, from: 135 });
  K.check(qB.box, 3.2, 'Altman quote');
  K.check(srcB.box, 3.2, 'Altman source');
  tl.fromTo(K.cam, { scale: 1.05 }, { scale: 1, duration: 1.9, ease: 'power2.out', immediateRender: false }, 2.0);
  K.camSet(2.0, { x: 0, y: 0 });
  [2.5, 3.0, 3.5].forEach((t, i) => K.sfx('tick', t, 0.6, { tock: i % 2 === 0 }));

  // ---------------------------------------------------------------- C: the WEF grid
  K.glitch(3.9, { dur: 0.18, seed: 5 });
  const sC = K.scene(4.0, 8.0);
  K.camSet(4.0, { scale: 1, x: 0, y: 0 });
  const labC = K.lines(sC, { lines: ['WORLD ECONOMIC FORUM · JAN 2025'], x: 72, y: 330, size: 34, color: C.orange, track: 0.06 });
  const byC = K.lines(sC, { lines: ['By 2030, employers expect'], font: 'serif', size: 76, x: 72, y: 386, color: C.paper });
  K.reveal(labC, 4.02, { stagger: 0.02, dur: 0.45 });
  K.reveal(byC, 4.12, { stagger: 0.04, dur: 0.6, from: 135 });
  const SL = 300;
  const slot = K.slot(sC, { x: 60, y: 486, size: SL, cols: 3, color: C.orange, spins: 3 });
  const first = slot.columns[0].m;
  gsap.set(first, { width: 0 });
  K.slotTo(slot, 92, 4.5, { dur: 0.85, cycle: 1 });
  tl.to(first, { width: 0.64 * SL, duration: 0.5, ease: 'expo.inOut' }, 5.95);
  K.slotTo(slot, 170, 6.0, { dur: 0.85, cycle: 3 });
  tl.to(slot.box, { color: C.paper2, duration: 0.3 }, 6.0);
  const mil = K.lines(sC, { lines: ['MILLION'], x: 72, y: 820, size: 92, color: C.paper });
  K.reveal(mil, 4.9, { stagger: 0.02 });
  const capA = K.lines(sC, { lines: ['jobs displaced'], font: 'serif', size: 96, x: 72, y: 912, color: C.orange });
  const capB = K.lines(sC, { lines: ['new jobs created'], font: 'serif', size: 96, x: 72, y: 912, color: C.paper2 });
  K.reveal(capA, 5.0, { stagger: 0.05, dur: 0.6, from: 135 });
  K.unreveal(capA, 5.85, { stagger: 0.03 });
  K.reveal(capB, 6.12, { stagger: 0.05, dur: 0.6, from: 135 });
  K.check(capB.box, 7.4, 'new jobs created');
  const unit = K.lines(sC, { lines: ['1 square = 1 million jobs'], x: 72, y: 1020, size: 22, color: C.paper, track: 0.08 });
  unit.box.style.opacity = 0.55;
  K.reveal(unit, 4.4, { stagger: 0.02 });

  // 1,200 squares: one per million of the 1.2 billion jobs in WEF's dataset.
  const cv = K.el('canvas', 'layer', sC); cv.width = 1080; cv.height = 1920;
  const g = cv.getContext('2d');
  const COLS = 50, P = 16, CELL = 12, GX = 72 + CELL / 2, GY = 1062;
  const rng = K.rng(2025);
  const idx = Array.from({ length: 1200 }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const gone = new Map(idx.slice(0, 92).map((cell, k) => [cell, { flag: 4.62 + rng() * 0.3, drop: 5.15 + rng() * 0.5, vx: (rng() - 0.5) * 260, spin: (rng() - 0.5) * 10 }]));
  const born = new Map();
  [...gone.keys()].forEach((cell, k) => born.set(cell, 6.08 + k * 0.0055));
  for (let k = 0; k < 78; k++) born.set(1200 + k, 6.6 + k * 0.006);
  const pop = p => { p = K.clamp(p) - 1; const s = 2.2; return 1 + (s + 1) * p * p * p + s * p * p; };
  K.hint((a, b) => (b > 5.1 && a < 6.4 ? 40 : 0));
  K.frame(t => {
    if (t < 3.95 || t > 8.1) return;
    g.clearRect(0, 0, 1080, 1920);
    for (let i = 0; i < 1278; i++) {
      const c = i % COLS, row = (i / COLS) | 0;
      let x = GX + c * P, y = GY + row * P, k, col = '#3A3936', rot = 0, alpha = 1;
      if (i < 1200) {
        k = pop((t - 4.0 - (c + row) * 0.0055) / 0.22);
        if (k <= 0) continue;
        const d = gone.get(i);
        if (d && t >= d.flag) {
          col = C.orange;
          if (t >= d.drop) {
            const dt = t - d.drop;
            x += d.vx * dt; y += 0.5 * 2600 * dt * dt; rot = d.spin * dt; alpha = Math.max(0, 1 - dt / 0.7);
            const b = born.get(i);
            if (t >= b) {
              g.globalAlpha = 1; g.fillStyle = C.paper2;
              const kb = pop((t - b) / 0.25) * CELL;
              g.fillRect(GX + c * P - kb / 2, GY + row * P - kb / 2, kb, kb);
            }
            if (alpha <= 0) continue;
          }
        }
      } else {
        const b = born.get(i);
        if (t < b) continue;
        k = pop((t - b) / 0.25);
        col = C.paper2;
      }
      const sz = CELL * (k == null ? 1 : k);
      g.save(); g.globalAlpha = alpha; g.translate(x, y); if (rot) g.rotate(rot);
      g.fillStyle = col; g.fillRect(-sz / 2, -sz / 2, sz, sz); g.restore();
    }
  });
  K.sfx('shimmer', 6.08, 0.5, { dur: 1.0 });
  K.sfx('downer', 5.15, 0.55, { dur: 0.9 });

  // ---------------------------------------------------------------- D: work taking shape
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 7.58);
  K.sfx('whoosh', 7.48, 1, { dur: 0.6, up: false });
  const sD = K.scene(7.5, 12.0);
  sD.style.top = Y1 + 'px';
  const labD = K.lines(sD, { lines: ['Work taking shape', 'right now:'], font: 'serif', size: 92, lh: 1.0, x: 72, y: 318, color: C.paper });
  K.reveal(labD, 8.0, { stagger: 0.04, dur: 0.6, from: 135 });
  K.unreveal(labD, 10.2, { stagger: 0.02 });
  const ever = K.lines(sD, { lines: ['Ever heard', 'of these?'], font: 'serif', size: 120, lh: 1.0, x: 72, y: 300, color: C.orange });
  K.reveal(ever, 10.56, { stagger: 0.05, dur: 0.6, from: 135 });
  K.check(ever.box, 11.2, 'ever heard of these');
  const JOBS = ['AI workflow designer', 'Model evaluation writer', 'Robot fleet supervisor', 'Synthetic data curator',
    'Drone survey operator', 'Energy retrofit assessor', 'Agentic systems operator', 'Precision fermentation technician'];
  const jr = K.rng(88);
  JOBS.forEach((name, k) => {
    const card = K.el('div', 'jcard', sD, `<i>${String(k + 1).padStart(2, '0')}</i><b>${name}</b>`);
    const b = card.querySelector('b');
    const room = 780 - 88 - 26;
    if (b.scrollWidth > room) b.style.fontSize = (38 * room / b.scrollWidth).toFixed(1) + 'px';
    const x = 72 + (jr() - 0.5) * 28, y = 590 + k * 110, rot = (jr() - 0.5) * 7;
    const from = k % 2 ? 1 : -1, t = 8.25 + k * 0.25;
    gsap.set(card, { x: x + from * 1100, y: y - 60, rotation: from * 24, autoAlpha: 1 });
    tl.to(card, { x, y, rotation: rot, duration: 0.42, ease: 'back.out(1.5)' }, t);
    K.sfx('deal', t + 0.12, 0.9, { pan: from * 0.4 });
    if (k === 7) K.check(card, 11.0, 'last job card');
  });

  // ---------------------------------------------------------------- E: the approach
  K.ladder(12.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 12.0); K.theme('light', 12.0); K.camSet(12.0, { scale: 1, x: 0, y: 0 });
  const sE = K.scene(12.0, 16.3);
  const e1 = K.lines(sE, { lines: ['NOBODY', 'KNOWS WHICH', 'JOBS WILL LAST.'], x: 72, y: 520, size: 130, lh: 0.92 });
  K.fit(e1, 900);
  K.reveal(e1, 12.08, { stagger: 0.05 });
  const e2 = K.lines(sE, { lines: ['Not even the people', 'building AI.'], font: 'serif', size: 110, lh: 1.0, x: 72, y: 930, color: C.orange });
  K.fit(e2, 820);
  K.reveal(e2, 12.9, { stagger: 0.05, dur: 0.65, from: 135 });
  K.check(e1.box, 13.6, 'nobody knows'); K.check(e2.box, 13.6, 'not even the people building AI');
  K.unreveal(e1, 13.86, { stagger: 0.02 }); K.unreveal(e2, 13.9, { stagger: 0.02 });
  const e3 = K.lines(sE, { lines: ['SO DON’T BET', 'YOUR FUTURE', 'ON A JOB TITLE.'], x: 72, y: 480, size: 120, lh: 0.92 });
  K.fit(e3, 900);
  K.reveal(e3, 14.06, { stagger: 0.05 });
  const e4 = K.marks(sE, { lines: ['TEST IT', 'FIRST.'], x: 72, y: 860, size: 150 });
  K.markIn(e4, 15.0);
  K.sfx('thud', 15.0, 0.6);
  K.check(e3.box, 15.6, 'dont bet'); K.check(e4.box, 15.6, 'test it first');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.04, duration: 3.6, ease: 'none', immediateRender: false }, 12.0);

  // ---------------------------------------------------------------- F: how OffLadder works
  const Y2 = 3840;
  tl.to(K.cam, { ...K.frameOn(540, Y2 + 960, 1), duration: 0.42, ease: 'whip' }, 15.58);
  K.sfx('whoosh', 15.48, 1, { dur: 0.6, up: false });
  const sF = K.scene(15.5, 24.1);
  sF.style.top = Y2 + 'px';
  const labF = K.lines(sF, { lines: ['HOW OFFLADDER WORKS'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  const hF = K.lines(sF, { lines: ['It learns from what', 'you actually try.'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 366 });
  K.fit(hF, 900);
  K.reveal(labF, 16.0, { stagger: 0.02 });
  K.reveal(hF, 16.08, { stagger: 0.04, dur: 0.6, from: 135 });
  const ill = K.lines(sF, { lines: ['ILLUSTRATIVE EXAMPLE, FROM OFFLADDER.COM'], x: 72, y: 578, size: 20, color: C.muted, track: 0.1 });
  K.reveal(ill, 16.3, { stagger: 0.01 });
  K.check(hF.box, 17.0, 'it learns');
  const cards = [
    ['you', 'You', '“I like organising people and solving last-minute problems.”', 16.62],
    ['', 'Directions for you', '<span class="opt">Live event production</span><span class="opt">Logistics and routing</span>', 17.55],
    ['', 'Try this week', 'Plan a one-day festival. What changes when a supplier cancels?', 18.5],
    ['you', 'You, after trying it', '“I liked untangling the schedule. The budget drained me.”', 19.6],
    ['', 'What changes', 'More operational problem-solving. Fewer finance-heavy routes.', 20.6],
  ];
  let cy = 616;
  const cardEls = cards.map(([kind, tag, txt, t], k) => {
    const el = K.el('div', 'dcard ' + kind, sF, `<div class="tag">${tag}</div><div class="txt">${txt}</div>`);
    el.style.top = cy + 'px';
    const h = el.offsetHeight;
    cy += h + 20;
    tl.fromTo(el, { y: 70, autoAlpha: 0, rotation: kind ? 1.5 : -1.5 }, { y: 0, autoAlpha: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.6)' }, t);
    K.sfx('pop', t + 0.05, 0.7, { note: 3 + k });
    return el;
  });
  K.check(cardEls[4], 21.8, 'last demo card');
  // The loop: every answer shapes what comes next.
  const tags = [['EXPLORE', 1], ['TRY', 2], ['LEARN', 3], ['ADAPT', 4]];
  tags.forEach(([name, k], i) => {
    const t = K.el('div', 'ltag', cardEls[k], name);
    tl.fromTo(t, { scale: 0, rotation: -20 }, { scale: 1, rotation: 4, duration: 0.4, ease: 'back.out(2.5)' }, 21.7 + i * 0.16);
    K.sfx('pop', 21.7 + i * 0.16, 0.6, { note: 6 + i });
  });
  const fsv = K.svg(sF);
  const top1 = parseFloat(cardEls[1].style.top) + cardEls[1].offsetHeight / 2, top4 = parseFloat(cardEls[4].style.top) + cardEls[4].offsetHeight / 2;
  const loop = K.arrow(fsv, [[818, top4], [898, top4 - 40], [898, top1 + 40], [826, top1]], { stroke: C.orange, width: 11, head: 30 });
  K.drawArrow(loop, 22.45, 0.6);
  tl.fromTo(K.cam, { ...K.frameOn(540, Y2 + 960, 1) }, { ...K.frameOn(540, Y2 + 1000, 1.03), duration: 7.9, ease: 'none', immediateRender: false }, 16.0);

  // ---------------------------------------------------------------- G: end card
  K.panel(24.0, { color: C.orange, dur: 0.32 });
  K.bg(C.orange, 24.0); K.theme('orange', 24.0); K.camSet(24.0, { scale: 1, x: 0, y: 0 });
  const sG = K.scene(24.0, 29.62);
  const g1 = K.lines(sG, { lines: ['DON’T PICK', 'YOUR FUTURE.'], x: 72, y: 400, size: 106, lh: 0.94 });
  K.fit(g1, 900);
  K.reveal(g1, 24.08, { stagger: 0.05 });
  const g2 = K.marks(sG, { lines: ['TEST IT.'], x: 72, y: 640, size: 150, bg: C.paper2, color: C.ink, shadow: C.ink, border: C.ink });
  K.markIn(g2, 24.6);
  K.sfx('impact', 24.6, 0.5, { big: 0.7 });
  const I = K.ident(sG, { x: 72, y: 900, size: 104, color: C.ink });
  K.identIn(I, 25.2);
  const dom = K.lines(sG, { lines: ['offladder.com'], x: 196, y: 918, size: 50, track: -0.01 });
  dom.box.style.textTransform = 'none';
  dom.words[0].innerHTML = `off<span style="color:${C.paper2}">ladder</span>.com`;
  K.reveal(dom, 25.4, { stagger: 0.02 });
  const sub = K.lines(sG, { lines: ['3 questions · free · no account'], font: 'body', size: 40, x: 198, y: 984 });
  sub.box.style.textTransform = 'none';
  K.reveal(sub, 25.6, { stagger: 0.02 });
  const ask = K.lines(sG, { lines: ['What job were you', 'told was ‘safe’?'], font: 'serif', size: 92, lh: 1.02, x: 72, y: 1110 });
  K.fit(ask, 780);
  K.reveal(ask, 26.3, { stagger: 0.05, dur: 0.65, from: 135 });
  const gsv = K.svg(sG);
  const A2 = K.arrow(gsv, [[770, 1300], [900, 1300], [975, 1360], [962, 1452]], { stroke: C.ink, width: 11, head: 34 });
  K.drawArrow(A2, 27.0, 0.45);
  K.check(g1.box, 28, 'dont pick'); K.check(g2.box, 28, 'test it'); K.check(dom.box, 28, 'domain');
  K.check(sub.box, 28, 'sub'); K.check(ask.box, 28, 'ask');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 5.6, ease: 'none', immediateRender: false }, 24.0);

  // ---------------------------------------------------------------- loop
  K.ladder(29.62, { colors: [C.ink, C.orange], bars: 8, dur: 0.22, stagger: 0.018 });
  K.bg(C.ink, 29.62); K.theme('dark', 29.62); K.camSet(29.62, { scale: 1, x: 0, y: 0 });
  musk(K.scene(29.62, 99));

  // ---------------------------------------------------------------- score
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Am', drums: 'pulse', pad: 0.9, lp: [0.22, 0.34] },                       //  0 Musk
      { chord: 'Am', drums: 'pulse', pad: 0.9, lp: [0.34, 0.5] },                        //  2 Altman
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up', lp: [0.6, 0.85] },        //  4 92 million
      { chord: 'E', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         //  6 170 million
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'up' },                        //  8 work taking shape
      { chord: 'F', drums: 'build', bass: 1, pad: 1, arp: 'up' },                        // 10
      { chord: 'C', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                         // 12 nobody knows
      { chord: 'G', drums: 'half', bass: 0.7, pad: 1, arp: 'up', arpgain: 0.5, lp: [0.8, 1] }, // 14 test it first
      { chord: 'Am', drums: 'four', bass: 1, pad: 1, arp: 'up' },                        // 16 how it works
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 24 end card
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },         // 28 closing into the loop
    ],
    risers: [[10.0, 12.0, 0.9], [22.0, 24.0, 0.6]],
    rolls: [[11.0, 12.0]],
  };

  // ---------------------------------------------------------------- TikTok cut (keep last: the build measures the page)
  K.refit(27.7, 114.8, 0.859);
};
