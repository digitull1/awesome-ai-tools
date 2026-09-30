/* Shared components for "The ladder is breaking", the AI-and-work series.
 * Loaded before each ai* piece. Only defines functions; nothing runs until a piece calls them.
 */
window.AI = (function () {
  const AI = {};

  // An attributed quote, legible from the first frame: orange label, big serif lines.
  AI.quote = function (parent, o) {
    const { C } = K;
    const { who, lines, accent = [], size = 230, y = 430, labelY = 372, fit = 880, color = C.paper } = o;
    const lab = K.lines(parent, { lines: [who], x: 72, y: labelY, size: 36, color: C.orange, track: 0.06 });
    const q = K.lines(parent, { lines, font: 'serif', size, lh: 0.94, x: 66, y, color });
    K.fit(q, fit);
    accent.forEach(i => q.lines[i].words.forEach(w => { w.style.color = C.orange; }));
    return { lab, q };
  };

  // Direction cards dealt onto the frame from alternate sides, on the beat.
  AI.cards = function (parent, names, t0, o = {}) {
    const { tl } = K;
    const { y0 = 590, step = 110, every = 0.25, seed = 88 } = o;
    const jr = K.rng(seed);
    return names.map((name, k) => {
      const card = K.el('div', 'jcard', parent, `<i>${String(k + 1).padStart(2, '0')}</i><b>${name}</b>`);
      const b = card.querySelector('b');
      const room = 780 - 88 - 26;
      if (b.scrollWidth > room) b.style.fontSize = (38 * room / b.scrollWidth).toFixed(1) + 'px';
      const x = 72 + (jr() - 0.5) * 28, y = y0 + k * step, rot = (jr() - 0.5) * 7;
      const from = k % 2 ? 1 : -1, t = t0 + k * every;
      gsap.set(card, { x: x + from * 1100, y: y - 60, rotation: from * 24, autoAlpha: 1 });
      tl.to(card, { x, y, rotation: rot, duration: 0.42, ease: 'back.out(1.5)' }, t);
      K.sfx('deal', t + 0.12, 0.9, { pan: from * 0.4 });
      return card;
    });
  };

  // The orange end card: the line, the site, and a comment prompt pointing at the comments.
  AI.end = function (t0, t1, o = {}) {
    const { C, tl } = K;
    const { ask = ['What job were you', 'told was ‘safe’?'] } = o;
    K.panel(t0, { color: C.orange, dur: 0.32 });
    K.bg(C.orange, t0); K.theme('orange', t0); K.camSet(t0, { scale: 1, x: 0, y: 0 });
    const s = K.scene(t0, t1);
    const g1 = K.lines(s, { lines: ['DON’T PICK', 'YOUR FUTURE.'], x: 72, y: 400, size: 106, lh: 0.94 });
    K.fit(g1, 900);
    K.reveal(g1, t0 + 0.08, { stagger: 0.05 });
    const g2 = K.marks(s, { lines: ['TEST IT.'], x: 72, y: 640, size: 150, bg: C.paper2, color: C.ink, shadow: C.ink, border: C.ink });
    K.markIn(g2, t0 + 0.6);
    K.sfx('impact', t0 + 0.6, 0.5, { big: 0.7 });
    const I = K.ident(s, { x: 72, y: 900, size: 104, color: C.ink });
    K.identIn(I, t0 + 1.2);
    const dom = K.lines(s, { lines: ['offladder.com'], x: 196, y: 918, size: 50, track: -0.01 });
    dom.box.style.textTransform = 'none';
    dom.words[0].innerHTML = `off<span style="color:${C.paper2}">ladder</span>.com`;
    K.reveal(dom, t0 + 1.4, { stagger: 0.02 });
    const sub = K.lines(s, { lines: ['3 questions · free · no account'], font: 'body', size: 40, x: 198, y: 984 });
    K.reveal(sub, t0 + 1.6, { stagger: 0.02 });
    const q = K.lines(s, { lines: ask, font: 'serif', size: 92, lh: 1.02, x: 72, y: 1110 });
    K.fit(q, 780);
    K.reveal(q, t0 + 2.3, { stagger: 0.05, dur: 0.65, from: 135 });
    const sv = K.svg(s);
    const A = K.arrow(sv, [[770, 1300], [900, 1300], [975, 1360], [962, 1452]], { stroke: C.ink, width: 11, head: 34 });
    K.drawArrow(A, t0 + 3.0, 0.45);
    [g1, g2, dom, sub, q].forEach(e => K.check(e.box, t0 + 4, 'end card'));
    tl.fromTo(K.cam, { scale: 1 }, { scale: 1.03, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
    return s;
  };

  // A ladder wipe back to a rebuilt first frame, so the Short loops without a seam.
  AI.loop = function (mid, bg, theme, buildFirst) {
    K.ladder(mid, { colors: [K.C.ink, K.C.orange], bars: 8, dur: 0.22, stagger: 0.018 });
    K.bg(bg, mid); K.theme(theme, mid); K.camSet(mid, { scale: 1, x: 0, y: 0 });
    buildFirst(K.scene(mid, 99));
  };

  return AI;
})();
