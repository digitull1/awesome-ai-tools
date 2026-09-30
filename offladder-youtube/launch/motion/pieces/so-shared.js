/* Shared components for the social-first pieces (TikTok, Reels and Shorts from one master).
 * Load with "@shared ai co so". Every readable element stays inside K.SAFE_SOCIAL
 * (x 65-900, y 270-1250); see 10-viral-standard.md.
 */
window.SO = (function () {
  const SO = {};
  const { C } = K;

  // More line icons on the same 100 x 100 grid as CO.ICONS.
  SO.ICONS = {
    tangle: ['M14 62 C12 24 58 18 52 44 C46 70 18 62 34 40 C50 18 88 28 78 56 C68 84 38 78 50 56 C60 38 90 50 86 82'],
    bulb: ['M50 10 A27 27 0 0 1 67 58 V70 H33 V58 A27 27 0 0 1 50 10 Z', 'M38 80 H62', 'M42 90 H58', 'M50 30 V50'],
    wrench: ['M64 12 A22 22 0 0 0 46 42 L14 74 A8.5 8.5 0 0 0 26 86 L58 54 A22 22 0 0 0 88 36 L74 40 L62 28 Z'],
    search: ['M62 40 A22 22 0 1 1 18 40 A22 22 0 1 1 62 40 Z', 'M56 56 L86 86'],
    nodes: ['M12 17 H30 V35 H12 Z', 'M70 17 H88 V35 H70 Z', 'M41 68 H59 V86 H41 Z', 'M30 26 H70', 'M21 35 V52 H50 V68', 'M79 35 V52 H50'],
    bolt: ['M56 8 L24 56 H48 L42 92 L76 40 H52 Z'],
    cap: ['M50 18 L92 38 L50 58 L8 38 Z', 'M26 47 V68 C26 80 74 80 74 68 V47', 'M92 38 V62'],
    compass: ['M88 50 A38 38 0 1 1 12 50 A38 38 0 1 1 88 50 Z', 'M50 22 L60 50 L50 78 L40 50 Z'],
    battery: ['M14 30 H80 V70 H14 Z', 'M80 42 H88 V58 H80', 'M28 42 V58', 'M42 42 V58', 'M56 42 V58'],
    drop: ['M50 10 C50 10 20 46 20 64 A30 30 0 0 0 80 64 C80 46 50 10 50 10 Z', 'M36 66 A14 14 0 0 0 50 80'],
    camera: ['M12 32 H32 L38 22 H62 L68 32 H88 V80 H12 Z', 'M65 56 A15 15 0 1 1 35 56 A15 15 0 1 1 65 56 Z'],
    shield: ['M50 10 L84 22 V48 C84 70 68 84 50 92 C32 84 16 70 16 48 V22 Z', 'M40 50 H60 V68 H40 Z', 'M44 50 V43 A6 6 0 0 1 56 43 V50'],
    megaphone: ['M12 42 H28 L70 18 V82 L28 58 H12 Z', 'M28 58 L34 82 H46 L42 62', 'M80 36 Q90 50 80 64'],
    receipt: ['M26 10 H74 V90 L66 84 L58 90 L50 84 L42 90 L34 84 L26 90 Z', 'M36 30 H64', 'M36 44 H64', 'M36 58 H54'],
    pill: ['M22 58 L58 22 A18 18 0 0 1 84 48 L48 84 A18 18 0 0 1 22 58 Z', 'M40 40 L66 66'],
    bezier: ['M16 74 C28 24 72 24 84 74', 'M10 68 H22 V80 H10 Z', 'M78 68 H90 V80 H78 Z', 'M44 16 H56 V28 H44 Z', 'M22 22 H78'],
    scales: ['M50 14 V86', 'M32 86 H68', 'M14 28 H86', 'M14 28 L4 56 M14 28 L26 56', 'M86 28 L74 56 M86 28 L96 56', 'M4 56 A11 8 0 0 0 26 56 Z', 'M74 56 A11 8 0 0 0 96 56 Z'],
    tie: ['M40 10 H60 L55 24 H45 Z', 'M45 24 L36 70 L50 90 L64 70 L55 24'],
    cross: ['M40 14 H60 V40 H86 V60 H60 V86 H40 V60 H14 V40 H40 Z'],
    note: ['M26 76 A12 9 0 1 0 50 76 A12 9 0 1 0 26 76 Z', 'M50 76 V16', 'M50 16 C58 30 76 28 78 46'],
    scissors: ['M42 74 A12 12 0 1 1 18 74 A12 12 0 1 1 42 74 Z', 'M82 74 A12 12 0 1 1 58 74 A12 12 0 1 1 82 74 Z', 'M38 64 L74 12', 'M62 64 L26 12'],
    tooth: ['M30 14 C18 14 12 28 16 42 C20 56 26 70 30 86 C36 88 38 74 42 62 C46 56 54 56 58 62 C62 74 64 88 70 86 C74 70 80 56 84 42 C88 28 82 14 70 14 C62 14 58 20 50 20 C42 20 38 14 30 14 Z'],
    roof: ['M8 52 L50 16 L92 52', 'M22 42 V86 H78 V42', 'M42 86 V62 H58 V86'],
  };
  SO.icon = function (parent, name, o) {
    const { x = 0, y = 0, size = 140, color = C.ink, width = 7 } = o || {};
    const s = K.svg(parent, { x, y, w: size, h: size, vb: '0 0 100 100' });
    const d = SO.ICONS[name] || CO.ICONS[name];
    const paths = d.map(p => K.path(s, p, { stroke: color, width }));
    return { s, paths };
  };
  SO.draw = function (I, t, dur = 0.45) {
    I.paths.forEach((p, k) => K.tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'power2.inOut' }, t + k * 0.05));
  };

  // A task card for the pick-one grid: number, icon, two lines.
  SO.task = function (parent, o) {
    const { n, icon, lines, x, y, w = 400, h = 300 } = o;
    const e = K.el('div', 'sotask', parent, `<div class="n">${n}</div><div class="t">${lines.join('<br>')}</div>`);
    K.css(e, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    const I = SO.icon(e, icon, { x: w - 172, y: h - 172, size: 150, width: 7 });
    e._icon = I;
    const tx = e.querySelector('.t'), room = w - 44;
    if (tx.scrollWidth > room) tx.style.fontSize = (42 * room / tx.scrollWidth).toFixed(1) + 'px';
    return e;
  };

  // A direction card: icon on the left, name, and one line of what the work is.
  SO.dir = function (parent, o) {
    const { icon, name, desc, x = 80, y, w = 812 } = o;
    const e = K.el('div', 'sodir', parent, `<h4>${name}</h4><p>${desc}</p>`);
    K.css(e, { left: x + 'px', top: y + 'px', width: w + 'px' });
    const I = SO.icon(e, icon, { x: 26, y: 34, size: 132, width: 7, color: C.orange });
    e._icon = I;
    return e;
  };

  // The social end card, inside the safe box: the ask, who to send it to, the site, and a nudge to the comments.
  SO.end = function (t0, t1, o) {
    const { tl } = K;
    const { ask = ['COMMENT YOUR', 'NUMBER.'], send = ['Send this to a friend', 'who’s a 4.'], note = '', chips = null } = o || {};
    K.panel(t0, { color: C.orange, dur: 0.32 });
    K.bg(C.orange, t0); K.theme('orange', t0); K.camSet(t0, { scale: 1, x: 0, y: 0, rotation: 0 });
    const s = K.scene(t0, t1);
    const a = K.lines(s, { lines: ask, x: 84, y: 360, size: 128, lh: 0.92 });
    K.fit(a, 808);
    K.reveal(a, t0 + 0.08, { stagger: 0.05 });
    const dy = chips ? 180 : 0, dz = chips ? 150 : 0;
    (chips || []).forEach((label, k) => {
      const ch = K.el('div', 'sochip', s, label);
      K.css(ch, { left: (86 + k * 186) + 'px', top: '614px' });
      tl.fromTo(ch, { scale: 0, rotation: -12 }, { scale: 1, rotation: (k % 2 ? 3 : -3), duration: 0.4, ease: 'back.out(2.2)' }, t0 + 0.5 + k * 0.1);
      K.sfx('pop', t0 + 0.5 + k * 0.1, 0.5, { note: 4 + k });
      K.check(ch, t0 + 3.5, 'chip');
    });
    const b = K.lines(s, { lines: send, font: 'serif', size: 78, lh: 1.0, x: 86, y: 620 + dy, color: C.paper2 });
    K.fit(b, 800);
    K.reveal(b, t0 + 0.7, { stagger: 0.04, dur: 0.6, from: 135 });
    const I = K.ident(s, { x: 86, y: 830 + dz, size: 104, color: C.ink });
    K.identIn(I, t0 + 1.3);
    const dom = K.lines(s, { lines: ['offladder.com'], x: 210, y: 848 + dz, size: 50, track: -0.01 });
    dom.box.style.textTransform = 'none';
    dom.words[0].innerHTML = `off<span style="color:${C.paper2}">ladder</span>.com`;
    K.reveal(dom, t0 + 1.5, { stagger: 0.02 });
    const sub = K.lines(s, { lines: ['3 questions · free · no account'], font: 'body', size: 40, x: 212, y: 914 + dz });
    K.reveal(sub, t0 + 1.7, { stagger: 0.02 });
    const parts = [a, b, dom, sub];
    if (note) {
      const nt = K.lines(s, { lines: [note], font: 'body', size: 34, x: 86, y: 1040 + dz * 0.6, color: C.ink });
      nt.box.style.opacity = 0.75;
      K.reveal(nt, t0 + 2.1, { stagger: 0.01 });
      parts.push(nt);
    }
    const sv = K.svg(s);
    const A = K.arrow(sv, [[740, 1112], [846, 1112], [892, 1164], [892, 1236]], { stroke: C.ink, width: 11, head: 32 });
    K.drawArrow(A, t0 + 2.4, 0.45);
    parts.forEach(p => K.check(p.box, t0 + 3.5, 'end card'));
    tl.fromTo(K.cam, { scale: 1 }, { scale: 1.015, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
    return s;
  };

  return SO;
})();
