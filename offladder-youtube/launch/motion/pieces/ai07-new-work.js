/* The ladder is breaking #7 · 4 kinds of work AI is creating
 *
 *  0.0  "4 kinds of work AI is creating, that nobody's told you about", over a fan of four face-down
 *       cards (OffLadder's mark on the backs). Legible from the first frame.
 *  2.7  One by one, each card flies to the centre and flips: a direction from offladder.com/directions,
 *       described in the site's words, with OffLadder's own test for tonight.
 * 18.0  Nobody knows which will become settled job titles (the site says so on every entry).
 *       That's why you test.
 * 20.4  Ladder wipe to paper. 24 directions like these, each with a test, at offladder.com/directions.
 *       Or answer 3 questions: it picks directions for you, then adapts to what you enjoy.
 * 24.0  End card. Which one would you try tonight?
 * 29.6  Ladder wipe back to the fan.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI & your job', theme: 'dark', grain: 0.06 });

  const CARDS = [
    ['AI workflow designer', 'Redesigns how a real team gets work done once part of the work can be handed to a model.', 'Map one process at your job. Mark what a model could draft, and who should check it.'],
    ['Model evaluation writer', 'Designs the tests that show whether an AI is good enough for a real use, and writes down where it fails.', 'Write 10 test questions for an AI tool you use. Note where it fails.'],
    ['Provenance and authenticity analyst', 'Works out where a piece of media, a document or a claim actually came from.', 'Trace one viral image to its source, and write down how you know.'],
    ['AI tutor designer', 'Designs how a machine should teach one specific thing, including when not to give the answer.', 'Pick something you know well. Write the 5 hints a tutor should give before the answer.'],
  ];
  const MARK = `<svg viewBox="0 -4 100 108"><path d="M30.5 69.85 A34 34 0 1 1 69.5 69.85" fill="none" stroke="${C.ink}" stroke-width="20"/><path d="M41 76h18l3.5 6h-25z" fill="${C.ink}"/><path d="M36.5 85h27l4 6.5h-35z" fill="${C.ink}"/><path d="M31 94.5h38l4.5 6.5h-47z" fill="${C.ink}"/></svg>`;
  const FAN = [[-165, -13], [-55, -4.5], [55, 4.5], [165, 13]];
  const FX = 190, FY = 740, FS = 0.5;          // the fan: offset and scale
  const CX = 110, CY = 560;                     // a featured card's top-left

  // ---------------------------------------------------------------- A: the hook
  function hook(parent) {
    const title = K.lines(parent, { lines: ['4 KINDS OF WORK', 'AI IS CREATING'], x: 72, y: 330, size: 124, lh: 0.92, color: C.paper });
    K.fit(title, 900);
    title.lines[1].words.slice(-1).forEach(w => { w.style.color = C.orange; });
    const sub = K.lines(parent, { lines: ['that nobody’s told you about.'], font: 'serif', size: 76, x: 72, y: 572, color: C.paper });
    K.fit(sub, 880);
    const decks = CARDS.map(([h, p, t], k) => {
      const d = K.el('div', 'deck', parent, `<div class="face back">${MARK}</div><div class="face front"><div class="no">0${k + 1} / 04</div><h3>${h}</h3><p>${p}</p><div class="try"><b>TRY TONIGHT</b><span>${t}</span></div></div>`);
      const [dx, rot] = FAN[k];
      gsap.set(d, { x: FX + dx, y: FY - 430 + Math.abs(dx) * 0.25, scale: FS, rotation: rot, transformOrigin: '50% 100%', transformPerspective: 1800 });
      return d;
    });
    return { title, sub, decks };
  }
  const sA = K.scene(0, 18.2);
  const A = hook(sA);
  K.check(A.title.box, 0.5, 'title'); K.check(A.sub.box, 0.5, 'sub');
  K.drift(0, 2.6, { from: 1, to: 1.03 });
  A.decks.forEach((d, k) => tl.fromTo(d, { y: `+=0` }, { y: `-=${14}`, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, 0.5 + k * 0.12));
  K.unreveal(A.title, 2.45, { stagger: 0.02 });
  K.unreveal(A.sub, 2.45, { stagger: 0.01 });
  const head = K.lines(sA, { lines: ['4 KINDS OF WORK AI IS CREATING'], x: 72, y: 330, size: 34, color: C.orange, track: 0.06 });
  K.reveal(head, 2.8, { stagger: 0.02 });
  const tag = K.lines(sA, { lines: ['Nobody’s told you about these.'], font: 'serif', size: 64, x: 72, y: 380, color: C.paper });
  K.reveal(tag, 2.95, { stagger: 0.03, dur: 0.55, from: 135 });

  // ---------------------------------------------------------------- B: deal and flip, one by one
  A.decks.forEach((d, k) => {
    const t = 2.7 + k * 3.8;
    tl.set(d, { zIndex: 10 + k }, t);
    tl.to(d, { x: CX, y: CY, scale: 1, rotation: 0, duration: 0.55, ease: 'expo.inOut' }, t);
    tl.to(d, { rotationY: 180, duration: 0.6, ease: 'power3.inOut' }, t + 0.35);
    tl.fromTo(d, { z: 0 }, { z: 120, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, t + 0.35);
    K.sfx('whoosh', t - 0.05, 0.6, { dur: 0.5 });
    K.sfx('flip', t + 0.55, 1);
    K.sfx('pop', t + 0.95, 0.6, { note: 2 + k * 2 });
    if (k < 3) {
      tl.to(d, { x: -980, rotation: -14, duration: 0.55, ease: 'expo.in' }, t + 3.5);
      K.sfx('whoosh', t + 3.45, 0.5, { dur: 0.5 });
    }
    K.check(d, t + 2.5, 'card');
  });
  tl.to(A.decks[3], { x: -980, rotation: -14, duration: 0.55, ease: 'expo.in' }, 17.6);
  K.sfx('whoosh', 17.55, 0.5, { dur: 0.5 });
  K.unreveal(head, 17.7, { stagger: 0.01 }); K.unreveal(tag, 17.7, { stagger: 0.01 });

  // ---------------------------------------------------------------- C: why you test
  const sC = K.scene(17.9, 20.6);
  const n1 = K.lines(sC, { lines: ['Nobody knows which', 'will become settled', 'job titles.'], font: 'serif', size: 118, lh: 1.0, x: 72, y: 470, color: C.paper });
  K.fit(n1, 900);
  K.reveal(n1, 18.2, { stagger: 0.04, dur: 0.6, from: 135 });
  const n2 = K.marks(sC, { lines: ['THAT’S WHY', 'YOU TEST.'], x: 72, y: 900, size: 112 });
  K.markIn(n2, 19.0, { stagger: 0.1 });
  K.sfx('thud', 19.0, 0.6);
  K.check(n1.box, 20, 'nobody knows'); K.check(n2.box, 20, 'why you test');

  // ---------------------------------------------------------------- D: OffLadder
  K.ladder(20.4, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 20.4); K.theme('light', 20.4); K.camSet(20.4, { scale: 1, x: 0, y: 0 });
  const sD = K.scene(20.4, 24.1);
  const d1 = K.lines(sD, { lines: ['24 directions like these,', 'each with a test:'], font: 'serif', size: 96, lh: 1.0, x: 72, y: 420 });
  K.fit(d1, 900);
  K.reveal(d1, 20.5, { stagger: 0.03, dur: 0.55, from: 135 });
  const url = K.lines(sD, { lines: ['offladder.com/directions'], x: 72, y: 650, size: 70, track: -0.01 });
  url.box.style.textTransform = 'none';
  K.fit(url, 880);
  url.words[0].innerHTML = `off<span style="color:${C.orange}">ladder</span>.com/directions`;
  K.reveal(url, 21.0, { stagger: 0.02 });
  const d2 = K.lines(sD, { lines: ['Or answer 3 questions. It picks', 'directions for you, then adapts', 'to what you enjoy.'], font: 'serif', size: 72, lh: 1.05, x: 72, y: 820, color: C.ink });
  K.fit(d2, 860);
  d2.lines[1].words.slice(-1).forEach(w => { w.style.color = C.orange; });
  K.reveal(d2, 21.8, { stagger: 0.025, dur: 0.55, from: 135 });
  K.check(d1.box, 23, 'directions'); K.check(url.box, 23, 'url'); K.check(d2.box, 23, 'or answer');
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: 3.6, ease: 'none', immediateRender: false }, 20.4);

  // ---------------------------------------------------------------- E: end card and loop
  AI.end(24.0, 29.62, { ask: ['Which one would', 'you try tonight?'] });
  AI.loop(29.62, C.ink, 'dark', p => hook(p));

  // ---------------------------------------------------------------- score (A minor, brighter)
  K.music = {
    bpm: 120,
    bars: [
      { chord: 'Am', drums: 'intro', pad: 0.9, arp: 'up', arpgain: 0.6, lp: [0.3, 0.6] },  //  0 the fan
      { chord: 'F', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           //  2 card 1
      { chord: 'C', drums: 'four', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           //  6 card 2
      { chord: 'Am', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 10 card 3
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 14 card 4
      { chord: 'Am', drums: 'build', bass: 1, pad: 1, arp: 'up' },
      { chord: 'F', drums: 'half', bass: 0.7, pad: 1, lp: 0.8 },                          // 18 nobody knows
      { chord: 'C', drums: 'four', bass: 1, pad: 1, arp: 'up' },                           // 20 directions
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'up', fill: true },
      { chord: 'F', drums: 'full', bass: 1, pad: 1, arp: 'up' },                           // 24 end card
      { chord: 'C', drums: 'full', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'full', bass: 1, pad: 1, arp: 'down', lp: [1, 0.3] },           // 28 closing into the loop
    ],
    risers: [[16.0, 18.0, 0.8], [22.0, 24.0, 0.6]],
    rolls: [[17.0, 18.0]],
  };
  K.sfx('boom', 0, 0.5);
};
