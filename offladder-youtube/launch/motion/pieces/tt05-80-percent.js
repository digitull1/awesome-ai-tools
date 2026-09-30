// @shared ai
/* The ladder is breaking #5 · The 80% test (TikTok cut)
 * The YouTube layout, scaled by K.refit into TikTok's box (10-viral-standard.md). Everything else matches ai05.
 *
 *  0.0  Jensen Huang, Milken Institute Global Conference, May 2025 (Fortune): "You're not going to lose
 *       your job to an AI, but you're going to lose your job to someone who uses AI."
 *  3.5  So become that someone.
 *  5.5  Whip down. THE 80% TEST, from offladder.com's AI guide: take your most repetitive task, have AI
 *       draft the first 80%, write down what you had to fix. An illustrative run: the draft types in,
 *       an orange pen marks what's wrong, a fix list builds. That list is where your value sits.
 * 14.0  Ladder wipe to paper. Some people are turning this into work: AI workflow designer and model
 *       evaluation writer, described as on offladder.com/directions, each with a way to test it tonight.
 *       OffLadder finds directions like these and adapts to what you enjoy.
 * 24.0  End card. What's the most repetitive task in your week?
 * 29.6  Ladder wipe back to the quote.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06, safe: 'social' });

  // ---------------------------------------------------------------- A: the quote
  function hook(parent) {
    return AI.quote(parent, {
      who: 'JENSEN HUANG · NVIDIA CEO · MAY 2025',
      lines: ['“You’re not going to lose', 'your job to an AI, but', 'you’re going to lose', 'your job to someone', 'who uses AI.”'],
      accent: [3, 4], size: 108, y: 420, labelY: 362, fit: 880,
    });
  }
  const sA = K.scene(0, 5.9);
  const A = hook(sA);
  A.q.lines[3].words.slice(0, 3).forEach(w => { w.style.color = C.paper; });
  K.check(A.q.box, 0.5, 'Huang quote');
  K.drift(0, 3.4, { from: 1, to: 1.035 });
  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0].forEach((t, i) => K.sfx('tick', t, 0.5, { tock: i % 2 === 1 }));
  K.unreveal(A.q, 3.3, { stagger: 0.01 });
  K.unreveal(A.lab, 3.3, { stagger: 0.005 });
  const be = K.lines(sA, { lines: ['So become', 'that someone.'], font: 'serif', size: 190, lh: 0.96, x: 72, y: 600, color: C.paper });
  K.fit(be, 900);
  be.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(be, 3.9, { stagger: 0.06, dur: 0.7, from: 135 });
  K.sfx('impact', 4.05, 0.45, { big: 0.6 });
  K.check(be.box, 4.8, 'become that someone');

  // ---------------------------------------------------------------- B: the 80% test
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 5.08);
  K.sfx('whoosh', 4.98, 1, { dur: 0.6, up: false });
  const sB = K.scene(5.0, 14.2);
  sB.style.top = Y1 + 'px';
  const title = K.marks(sB, { lines: ['THE 80% TEST'], x: 72, y: 318, size: 104 });
  K.markIn(title, 5.55);
  K.sfx('thud', 5.55, 0.6);
  const sub = K.lines(sB, { lines: ['20 minutes. Try it this week.'], font: 'serif', size: 64, x: 72, y: 472, color: C.paper });
  K.reveal(sub, 5.9, { stagger: 0.03, dur: 0.55, from: 135 });
  const step = (n, text, y, t) => {
    const s = K.lines(sB, { lines: [`${n}  ${text}`], x: 72, y, size: 25, color: C.orange, track: 0.08 });
    K.reveal(s, t, { stagger: 0.01 });
    return s;
  };
  step(1, 'GIVE AI YOUR MOST REPETITIVE TASK', 590, 6.3);
  const win = K.el('div', 'win', sB, `<div class="bar"><i></i><i></i><i></i>AI assistant · illustrative</div><div class="body"><div class="prompt"></div><div class="out"></div></div>`);
  win.style.top = '634px';
  tl.fromTo(win, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.4)' }, 6.45);
  K.sfx('pop', 6.5, 0.6, { note: 2 });
  const typed = K.type(win.querySelector('.prompt'), 'Draft this week’s update email from my notes.', 6.95, { cps: 30, seed: 5, keepCaret: false });
  const LINES = ['Hi team, what a great week!', 'Launch is on track for 14 Oct.', 'Sales rose 40% after the new pricing.', 'No blockers this week.'];
  const out = win.querySelector('.out');
  const lineEls = LINES.map((txt, k) => {
    const p = K.el('p', '', out);
    const sk = K.el('div', 'skel', p); sk.style.width = (380 + ((k * 137) % 260)) + 'px';
    const tx = K.el('span', '', p, txt);
    gsap.set(tx, { autoAlpha: 0 });
    tl.fromTo(sk, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.3, ease: 'expo.out' }, typed.end + 0.15 + k * 0.08);
    tl.to(sk, { autoAlpha: 0, duration: 0.15 }, typed.end + 0.75 + k * 0.1);
    tl.to(tx, { autoAlpha: 1, duration: 0.2 }, typed.end + 0.75 + k * 0.1);
    return tx;
  });
  K.sfx('shimmer', typed.end + 0.7, 0.3, { dur: 0.5 });
  // The orange pen: what you had to fix.
  // Measure inside the window (it's mid-entrance at build time), then place in scene coordinates.
  const WY = 634, wb = win.getBoundingClientRect();
  const s2y = WY + win.offsetHeight + 30;
  step(2, 'WRITE DOWN WHAT YOU HAD TO FIX', s2y, 9.75);
  const psv = K.svg(sB);
  const FIXES = [[0, 'strike', 'Wrong tone'], [1, 'circle', 'Wrong date'], [2, 'strike', 'An invented number'], [3, 'under', 'Missed the real problem']];
  const r = document.createRange();
  const fixCard = K.el('div', 'fix', sB, '<h5>WHAT I HAD TO FIX</h5><ul></ul>');
  fixCard.style.top = s2y + 42 + 'px';
  tl.fromTo(fixCard, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.4)' }, 9.85);
  const ul = fixCard.querySelector('ul');
  FIXES.forEach(([i, kind, note], k) => {
    r.selectNodeContents(lineEls[i]);
    const b = r.getBoundingClientRect();
    const x0 = 72 + (b.left - wb.left), x1 = 72 + (b.right - wb.left), ym = WY + (b.top - wb.top) + b.height * 0.55, yb = WY + (b.bottom - wb.top) - 2;
    const t = 10.0 + k * 0.42;
    let d;
    if (kind === 'strike') d = `M${x0 - 6},${ym + 4} C${(x0 + x1) / 2},${ym - 8} ${(x0 + x1) / 2},${ym + 6} ${x1 + 8},${ym - 6}`;
    else if (kind === 'under') d = `M${x0 - 4},${yb + 2} C${x0 + 120},${yb + 10} ${x1 - 80},${yb - 4} ${x1 + 10},${yb + 6}`;
    else { const cx = x1 - 70, cy = ym, rx = 88, ry = 30; d = `M${cx + rx},${cy} C${cx + rx},${cy - ry * 1.3} ${cx - rx},${cy - ry * 1.3} ${cx - rx},${cy} C${cx - rx},${cy + ry * 1.3} ${cx + rx + 6},${cy + ry * 1.2} ${cx + rx - 14},${cy - ry * 0.9}`; }
    const pen = K.path(psv, d, { stroke: C.orange, width: 7 });
    gsap.set(pen, { drawSVG: '0%' });
    K.draw(pen, t, 0.28, 'power2.inOut', 'scribble');
    const li = K.el('li', '', ul, note);
    tl.fromTo(li, { x: -24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'expo.out' }, t + 0.2);
  });
  K.check(fixCard, 11.6, 'fix list');
  // The point.
  K.unreveal(sub, 11.55, { stagger: 0.01 });
  K.markOut(title, 11.5);
  const val = K.lines(sB, { lines: ['That list is where', 'your value sits.'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 318, color: C.paper });
  K.fit(val, 880);
  val.lines[1].words.forEach(w => { w.style.color = C.orange; });
  K.reveal(val, 11.85, { stagger: 0.04, dur: 0.6, from: 135 });
  K.sfx('sparkle', 12.0, 0.5);
  K.check(val.box, 13.2, 'value');

  // ---------------------------------------------------------------- C: work built on that list
  K.ladder(14.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 14.0); K.theme('light', 14.0); K.camSet(14.0, { scale: 1, x: 0, y: 0 });
  const sC = K.scene(14.0, 24.1);
  const labC = K.lines(sC, { lines: ['WORK TAKING SHAPE NOW'], x: 72, y: 318, size: 32, color: C.orange, track: 0.08 });
  const hC = K.lines(sC, { lines: ['Some people are turning', 'that list into a job.'], font: 'serif', size: 92, lh: 1.0, x: 72, y: 360 });
  K.fit(hC, 900);
  K.reveal(labC, 14.1, { stagger: 0.02 });
  K.reveal(hC, 14.18, { stagger: 0.04, dur: 0.6, from: 135 });
  const DIRS = [
    ['AI workflow designer', 'Redesigns how a team works once part of the work can go to a model, and answers for the handover.', 'TRY TONIGHT: MAP ONE PROCESS, MARK WHAT A MODEL COULD DRAFT'],
    ['Model evaluation writer', 'Designs the tests that show whether an AI is good enough for a real use, and writes down where it fails.', 'TRY TONIGHT: WRITE 10 TEST QUESTIONS FOR AN AI TOOL'],
  ];
  let dy = 590;
  DIRS.forEach(([h, p, t], k) => {
    const el = K.el('div', 'dir', sC, `<h5>${h}</h5><p>${p}</p><span class="t">${t}</span>`);
    el.style.top = dy + 'px';
    dy += el.offsetHeight + 28;
    tl.fromTo(el, { y: 60, autoAlpha: 0, rotation: k ? 1.5 : -1.5 }, { y: 0, autoAlpha: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.6)' }, 15.0 + k * 0.9);
    K.sfx('deal', 15.05 + k * 0.9, 0.8);
    K.check(el, 18, 'direction card');
  });
  const off = K.lines(sC, { lines: ['OffLadder finds directions like', 'these, with a test for each.'], font: 'serif', size: 68, lh: 1.05, x: 72, y: dy + 20 });
  K.fit(off, 860);
  K.reveal(off, 17.4, { stagger: 0.03, dur: 0.6, from: 135 });
  const LOOP = ['EXPLORE', 'TRY', 'LEARN', 'ADAPT'];
  const ly = dy + 20 + 170;
  LOOP.forEach((w, i) => {
    const el = K.el('div', 'ltag', sC, w);
    K.css(el, { left: 72 + i * 205 + 'px', top: ly + 'px', right: 'auto', transform: 'none' });
    tl.fromTo(el, { scale: 0, rotation: -20 }, { scale: 1, rotation: i % 2 ? 3 : -3, duration: 0.4, ease: 'back.out(2.5)' }, 19.2 + i * 0.35);
    K.sfx('pop', 19.2 + i * 0.35, 0.6, { note: 4 + i });
    K.check(el, 21, 'loop tag');
  });
  const ad = K.lines(sC, { lines: ['It adapts to what you enjoyed.'], font: 'serif', size: 60, x: 72, y: ly + 76, color: C.orange });
  K.fit(ad, 860);
  K.reveal(ad, 20.8, { stagger: 0.03, dur: 0.55, from: 135 });
  K.check(ad.box, 22, 'adapts');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 9.9, ease: 'none', immediateRender: false }, 14.0);

  // ---------------------------------------------------------------- D: end card and loop
  AI.end(24.0, 29.62, { ask: ['What’s the most repetitive', 'task in your week?'] });
  AI.loop(29.62, C.ink, 'dark', p => { const h = hook(p); h.q.lines[3].words.slice(0, 3).forEach(w => { w.style.color = C.paper; }); });

  // ---------------------------------------------------------------- score (C minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Cm', drums: 'pulse', pad: 0.9, lp: [0.24, 0.34] },                        //  0 the quote
      { chord: 'Cm', drums: 'pulse', pad: 0.9, lp: [0.34, 0.5] },                         //  2 become that someone
      { chord: 'Ab', drums: 'intro', pad: 0.9, lp: [0.5, 0.7], fill: true },              //  4
      { chord: 'Eb', drums: 'four', bass: 1, pad: 1, arp: 'up' },                         //  6 the test
      { chord: 'Bb', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Cm', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 10 the pen
      { chord: 'Ab', drums: 'build', bass: 1, pad: 1, arp: 'up' },                        // 12 your value
      { chord: 'Eb', drums: 'half', bass: 0.7, pad: 1, lp: 0.85 },                        // 14 work taking shape
      { chord: 'Bb', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Cm', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Ab', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'Ab', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 24 end card
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Bb', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },         // 28 closing into the loop
    ],
    risers: [[12.0, 14.0, 0.9], [22.0, 24.0, 0.6]],
    rolls: [[13.0, 14.0]],
  };
  K.sfx('boom', 0, 0.6);

  // ---------------------------------------------------------------- TikTok cut (keep last: the build measures the page)
  K.refit(27.7, 114.8, 0.859);
};
