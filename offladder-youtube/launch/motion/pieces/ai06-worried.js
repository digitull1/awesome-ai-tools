/* The ladder is breaking #6 · Half of workers are worried. Here's what to do this month.
 *
 *  0.0  Pew Research Center, February 2025: 52% of US workers are worried about the future impact of AI
 *       use in the workplace. A donut drawn to 52%, legible from the first frame.
 *  2.0  If that's you, here's what to do this month.
 *  4.0  Ladder wipe to paper. The four moves from offladder.com's AI guide, checked off one by one:
 *       audit one week; use AI on one cheap block, properly; get better at one hard block;
 *       test one direction next to yours.
 * 13.6  Whip down. Move 4 is what OffLadder is for: 3 questions, 2 directions, 1 experiment for tonight.
 *       Then tell Laddie how it went; it remembers, spots patterns and shapes what comes next.
 * 24.0  End card. Which of the four are you starting with?
 * 29.6  Ladder wipe back to the donut.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06 });

  // ---------------------------------------------------------------- A: 52%
  const DX = 540, DY = 640, DR = 205;
  function hook(parent) {
    const lab = K.lines(parent, { lines: ['PEW RESEARCH CENTER · FEB 2025'], x: 72, y: 322, size: 34, color: C.orange, track: 0.06 });
    const sv = K.svg(parent);
    const ring = `M${DX},${DY - DR} A${DR},${DR} 0 1 1 ${DX - 0.01},${DY - DR}`;
    const track = K.path(sv, ring, { stroke: '#2B2A28', width: 74, cap: 'butt' });
    const arc = K.path(sv, ring, { stroke: C.orange, width: 74, cap: 'butt' });
    gsap.set(arc, { drawSVG: '0% 52%' });
    const pct = K.lines(parent, { lines: ['52%'], x: DX - 200, y: DY - 78, size: 150, lh: 1, color: C.paper, align: 'center', w: 400 });
    const cap = K.lines(parent, { lines: ['of US workers are worried', 'about the future impact', 'of AI at work.'], font: 'serif', size: 90, lh: 1.0, x: 72, y: 912, color: C.paper });
    K.fit(cap, 880);
    cap.lines[0].words.slice(-1).forEach(w => { w.style.color = C.orange; });
    return { lab, sv, arc, pct, cap };
  }
  const sA = K.scene(0, 4.2);
  const A = hook(sA);
  K.check(A.cap.box, 0.5, 'caption'); K.check(A.pct.box, 0.5, '52%');
  K.drift(0, 2.0, { from: 1, to: 1.03 });
  // The arc re-fills on the beat: a nervous pulse.
  [0.5, 1.0, 1.5].forEach(t => tl.fromTo(A.arc, { drawSVG: '0% 47%' }, { drawSVG: '0% 52%', duration: 0.4, ease: 'expo.out', immediateRender: false }, t));
  [0.5, 1.0, 1.5].forEach((t, i) => K.sfx('heart', t, 0.5));
  K.unreveal(A.cap, 1.9, { stagger: 0.012 });
  const ift = K.lines(sA, { lines: ['If that’s you, here’s', 'what to do this month.'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 912, color: C.paper });
  K.fit(ift, 880);
  ift.lines[1].words.slice(-2).forEach(w => { w.style.color = C.orange; });
  K.reveal(ift, 2.3, { stagger: 0.04, dur: 0.6, from: 135 });
  K.check(ift.box, 3.4, 'if thats you');

  // ---------------------------------------------------------------- B: the four moves
  K.ladder(4.0, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 4.0); K.theme('light', 4.0); K.camSet(4.0, { scale: 1, x: 0, y: 0 });
  const sB = K.scene(4.0, 14.2);
  const labB = K.lines(sB, { lines: ['FROM OFFLADDER.COM’S AI GUIDE'], x: 72, y: 318, size: 30, color: C.orange, track: 0.08 });
  const hB = K.lines(sB, { lines: ['Four moves, at a size', 'you can act on.'], font: 'serif', size: 88, lh: 1.0, x: 72, y: 360 });
  K.fit(hB, 900);
  K.reveal(labB, 4.1, { stagger: 0.02 });
  K.reveal(hB, 4.18, { stagger: 0.04, dur: 0.6, from: 135 });
  const MOVES = [
    ['Audit one week', 'Mark each block: cheap to produce, or hard to replace.'],
    ['Use AI on one cheap block', 'Properly. Then judge it like an editor, not a fan.'],
    ['Get better at one hard block', 'Deliberately, for a month.'],
    ['Test one direction next to yours', 'A small experiment, before you need it.'],
  ];
  let my = 568;
  const ticks = [];
  const moveEls = MOVES.map(([h, p], k) => {
    const el = K.el('div', 'move', sB, `<div class="box"></div><div class="num">0${k + 1}</div><h4>${h}</h4><p>${p}</p>`);
    el.style.top = my + 'px';
    const t = 4.9 + k * 2.0;
    tl.fromTo(el, { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, t);
    K.sfx('pop', t, 0.5, { note: k });
    ticks.push([my + 2, t + 0.9]);
    my += el.offsetHeight + 30;
    K.check(el, 13.2, 'move');
    return el;
  });
  // Ticks draw into the boxes (an SVG made after the moves, so it sits on top of them).
  const msv = K.svg(sB);
  ticks.forEach(([by, t]) => {
    const bx = 72;
    const tick = K.path(msv, `M${bx + 14},${by + 38} L${bx + 32},${by + 58} L${bx + 64},${by + 12}`, { stroke: C.orange, width: 12 });
    gsap.set(tick, { drawSVG: '0%' });
    K.draw(tick, t, 0.3, 'power2.out', 'scribble');
  });
  const four = K.stamp(sB, { text: 'OffLadder is for this one', x: 560, y: my + 40, size: 34, color: C.ink, bg: C.orange, rot: -3, shadow: C.ink });
  four.style.textTransform = 'uppercase';
  K.slam(four, 12.7, { from: 1.8, shake: 8, flash: 0, dust: null, sfx: 'thud', gain: 0.6 });
  K.check(four, 13.4, 'stamp');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 9.6, ease: 'none', immediateRender: false }, 4.0);

  // ---------------------------------------------------------------- C: 3, 2, 1
  const Y1 = 1920;
  tl.to(K.cam, { ...K.frameOn(540, Y1 + 960, 1), duration: 0.42, ease: 'whip' }, 13.58);
  K.sfx('whoosh', 13.48, 1, { dur: 0.6, up: false });
  const sC = K.scene(13.5, 24.1);
  sC.style.top = Y1 + 'px';
  const labC = K.lines(sC, { lines: ['HOW OFFLADDER WORKS'], x: 72, y: 318, size: 34, color: C.orange, track: 0.06 });
  K.reveal(labC, 14.05, { stagger: 0.02 });
  const ROWS = [['3', 'questions'], ['2', 'directions you’d never have thought of'], ['1', 'experiment for tonight']];
  ROWS.forEach(([n, txt], k) => {
    const el = K.el('div', 'big321', sC, `<b>${n}</b><span>${txt}</span>`);
    el.style.top = 400 + k * 262 + 'px';
    const t = 14.3 + k * 1.0;
    tl.fromTo(el.querySelector('b'), { scale: 2.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'power4.in' }, t - 0.2);
    tl.fromTo(el.querySelector('span'), { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out' }, t + 0.05);
    K.shake(t, { amp: 9, dur: 0.3 });
    K.sfx('thud', t, 0.6);
    K.check(el, 17, 'row');
  });
  const then = K.lines(sC, { lines: ['Then tell Laddie how it went.', 'It remembers, spots patterns,', 'and adapts your next step.'], font: 'serif', size: 72, lh: 1.05, x: 72, y: 1206 });
  K.fit(then, 860);
  then.lines[2].words.slice(1, 2).forEach(w => { w.style.color = C.orange; });
  K.reveal(then, 17.6, { stagger: 0.03, dur: 0.6, from: 135 });
  K.sfx('sparkle', 18.4, 0.5);
  K.check(then.box, 21, 'then tell laddie');
  tl.fromTo(K.cam, { ...K.frameOn(540, Y1 + 960, 1) }, { ...K.frameOn(540, Y1 + 990, 1.03), duration: 10, ease: 'none', immediateRender: false }, 14.0);

  // ---------------------------------------------------------------- D: end card and loop
  AI.end(24.0, 29.62, { ask: ['Which of the four are', 'you starting with?'] });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (F minor)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Fm', drums: 'pulse', pad: 0.9, lp: [0.24, 0.36] },                        //  0 52%
      { chord: 'Fm', drums: 'intro', pad: 0.9, lp: [0.36, 0.6] },                         //  2 if that's you
      { chord: 'Db', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                         //  4 the moves
      { chord: 'Ab', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Eb', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Fm', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Db', drums: 'build', bass: 1, pad: 1, arp: 'up' },                        // 12 OffLadder is for this one
      { chord: 'Ab', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 14 3, 2, 1
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Fm', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Db', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'Db', drums: 'full', bass: 1, pad: 1, arp: 'up' },                         // 24 end card
      { chord: 'Ab', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Eb', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },         // 28 closing into the loop
    ],
    risers: [[2.5, 4.0, 0.7], [12.0, 13.6, 0.8], [22.0, 24.0, 0.6]],
    rolls: [[13.0, 13.6]],
  };
  K.sfx('boom', 0, 0.6);
};
