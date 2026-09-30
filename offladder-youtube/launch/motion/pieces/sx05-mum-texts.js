/* Social #5 · POV: telling your mum what you want to study
 * @shared ai co so
 *
 * A chat skit (a conversation plenty of people have had, not a real one) carrying one sourced figure:
 * NY Fed, 2024 data: recent computer science grads 7.0% unemployed, 4th highest of 73 majors (claim K7).
 * Built to 10-viral-standard.md: relatable from the first frame, a punchline, and a share line that names
 * who to send it to. The phone chrome (header, input bar, keyboard) is drawn so it reads as a chat at a
 * glance; everything readable sits in the social safe box, and the keyboard fills the caption zone below.
 *
 *  0.0  POV bar and Mum's first text already on screen.
 *  1.0  "Thinking computer science." "Good. Very safe choice." The data card lands on the downbeat: 7.0%.
 *  7.0  "...what?" "OK. Law then?" Nobody knows which jobs will last. Not even the people building AI.
 * 12.5  "So what are you going to do??" Test a few things first. The OffLadder link.
 * 19.6  Mum typing... stops... typing again: "Can I do it too?"
 * 24.0  End card: send this to your mum; comment what they told you to study.
 * 29.6  Ladder wipe back to the first frame.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.paper, chip: '', theme: 'light', grain: 0.04, safe: 'social' });

  const INK = '#0C0C0C', PAPER = '#F4F2EE';
  const svg = (vb, w, h, body, style = '') => `<svg viewBox="${vb}" width="${w}" height="${h}" style="${style}">${body}</svg>`;
  const ICON = {
    back: svg('0 0 24 24', 40, 40, `<path d="M15 4 7 12l8 8" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`),
    heart: svg('0 0 24 24', 30, 30, `<path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" fill="${C.orange}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`, 'vertical-align:-1px;margin-left:10px'),
    phone: svg('0 0 24 24', 46, 46, `<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" fill="none" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/>`),
    video: svg('0 0 24 24', 50, 50, `<rect x="2" y="6" width="13" height="12" rx="2.5" fill="none" stroke="${INK}" stroke-width="2.3"/><path d="m15 10.5 6-3.5v10l-6-3.5z" fill="none" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/>`),
    plus: svg('0 0 24 24', 36, 36, `<path d="M12 5v14M5 12h14" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`),
    send: svg('0 0 24 24', 34, 34, `<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`),
    love: svg('0 0 24 24', 38, 38, `<path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" fill="#FBFAF7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`, 'margin-top:4px'),
    shift: svg('0 0 24 24', 44, 44, `<path d="M12 3 3 12h5v8h8v-8h5z" fill="none" stroke="${PAPER}" stroke-width="2" stroke-linejoin="round"/>`),
    del: svg('0 0 28 24', 50, 43, `<path d="M9 4h15a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-7-8z" fill="none" stroke="${PAPER}" stroke-width="2" stroke-linejoin="round"/><path d="m13 9 6 6m0-6-6 6" stroke="${PAPER}" stroke-width="2" stroke-linecap="round"/>`),
  };
  const MARK = (w, h) => svg('0 -4 100 108', w, h, `<path d="M30.5 69.85 A34 34 0 1 1 69.5 69.85" fill="none" stroke="${INK}" stroke-width="20"/><path d="M41 76h18l3.5 6h-25z" fill="${INK}"/><path d="M36.5 85h27l4 6.5h-35z" fill="${INK}"/><path d="M31 94.5h38l4.5 6.5h-47z" fill="${INK}"/>`);

  // The NY Fed's 73 majors, highest unemployment first; computer science is 4th.
  const RATES = [7.92, 7.78, 7.66, 6.99, 6.95, 6.84, 6.69, 6.63, 6.59, 6.31, 6.24, 6.14, 6.11, 5.98, 5.77, 5.74, 5.68, 5.62, 5.16, 5.12, 5.03, 4.99, 4.86, 4.71, 4.59, 4.54, 4.54, 4.48, 4.4, 4.4, 4.36, 4.33, 4.31, 4.31, 4.29, 4.29, 4.15, 3.94, 3.86, 3.84, 3.84, 3.82, 3.79, 3.69, 3.6, 3.56, 3.52, 3.16, 3.12, 2.76, 2.73, 2.69, 2.63, 2.62, 2.55, 2.54, 2.52, 2.32, 2.26, 2.26, 2.24, 2.18, 2.18, 2.15, 2.12, 1.94, 1.74, 1.6, 1.58, 1.4, 1.18, 1.09, 0.74];
  const BH = 104, PITCH = 548 / 73;
  const bars = RATES.map((v, i) => `<i class="${i === 3 ? 'cs' : ''}" style="left:${(i * PITCH).toFixed(1)}px;height:${(v / RATES[0] * BH).toFixed(1)}px"></i>`).join('')
    + `<b class="tag" style="left:${(3 * PITCH - 8).toFixed(1)}px;bottom:${(RATES[3] / RATES[0] * BH + 8).toFixed(1)}px">CS</b>`;
  const CARD = `<div class="k">Recent CS grads</div><div class="big">7.0%<span> unemployed</span></div><div class="sm">4th highest of 73 majors</div><div class="bars">${bars}</div><div class="k">NY Fed · 2024 data</div>`;
  const LINK = `<div class="lp">${MARK(88, 96)}<span>off<b>ladder</b></span></div><div class="lx"><div class="lt">3 questions. Directions you’d never have thought of.</div><div class="ld">offladder.com</div></div>`;

  // My texts are typed into the input bar first (type: when typing starts); Mum's show her typing dots.
  const MSGS = [
    { who: 'mum', html: 'Have you picked your<br>degree yet?', t: 0 },
    { who: 'me', text: 'Thinking computer science', t: 1.0, type: 0.3 },
    { who: 'mum', html: 'Good. Very safe choice', t: 2.5, dots: [[1.85, 2.5]] },
    { who: 'me', html: CARD, t: 4.0, cls: 'card', attach: 3.45 },
    { who: 'mum', html: '…what?', t: 7.0, dots: [[6.4, 7.0]] },
    { who: 'mum', html: 'OK. Law then?', t: 8.0, dots: [[7.4, 8.0]] },
    { who: 'me', text: 'Honestly? Nobody knows which jobs will last', html: 'Honestly? Nobody knows<br>which jobs will last', t: 9.5, type: 8.55 },
    { who: 'me', text: 'Not even the people building AI', html: 'Not even the people<br>building AI', t: 11.0, type: 10.15 },
    { who: 'mum', html: 'So what’s the plan??', t: 12.5, dots: [[11.85, 12.5]] },
    { who: 'me', text: 'Test a few things first. Small, real tasks', html: 'Test a few things first.<br>Small, real tasks', t: 14.0, type: 13.05 },
    { who: 'me', text: 'See what I’m actually good at', html: 'See what I’m<br>actually good at', t: 15.5, type: 14.7 },
    { who: 'mum', html: 'How?', t: 17.0, dots: [[16.45, 17.0]] },
    { who: 'me', text: 'offladder.com', html: LINK, t: 18.0, type: 17.35, cls: 'link' },
    { who: 'mum', html: `Can I do it too?<div class="tap">${ICON.love}</div>`, t: 22.0, dots: [[19.6, 20.6], [21.15, 22.0]] },
  ];
  const END = 24.0;

  function keyboard(parent) {
    const kb = K.el('div', 'kb', parent);
    const keys = {};
    const key = (label, x, r, w, cls) => {
      const k = K.el('div', 'key' + (cls ? ' ' + cls : ''), kb, label);
      K.css(k, { left: x + 'px', top: (26 + r * 126) + 'px', width: w + 'px' });
      return k;
    };
    ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].forEach((row, r) => {
      const x0 = (1080 - (row.length * 88 + (row.length - 1) * 12)) / 2;
      [...row].forEach((ch, i) => { keys[ch] = key(ch, x0 + i * 100, r, 88); });
    });
    keys.shift = key(ICON.shift, 46, 2, 128, 'fn');
    keys.del = key(ICON.del, 906, 2, 128, 'fn');
    keys.num = key('123', 46, 3, 150, 'fn');
    keys.space = key('space', 208, 3, 540, 'fn');
    keys.ret = key('return', 760, 3, 274, 'fn');
    return keys;
  }

  // The whole phone screen. The loop rebuilds it with just the first text, so the last frame is the first.
  function chat(parent, upto) {
    const pov = K.el('div', 'povbar', parent, 'POV: telling your mum what<br><span>you want to study</span>');
    const head = K.el('div', 'chead', parent, `<div class="bk">${ICON.back}</div><div class="av">M</div><div class="nm">Mum${ICON.heart}</div><div class="st">online</div><div class="ic">${ICON.video}${ICON.phone}</div>`);
    const clip = K.el('div', 'clip', parent);
    const thread = K.el('div', 'thread', clip);
    K.el('div', 'when', thread, 'Today 21:47');
    const dots = K.el('div', 'dots', thread, '<i style="left:26px"></i><i style="left:56px"></i><i style="left:86px"></i>');
    let y = 62, prev = null;
    const els = MSGS.slice(0, upto).map(m => {
      if (prev) y += prev === m.who ? 16 : 32;
      const b = K.el('div', `bub ${m.who}${m.cls ? ' ' + m.cls : ''}`, thread, m.html || m.text);
      b.style.top = y + 'px';
      const e = { ...m, b, y, h: b.offsetHeight, w: b.offsetWidth };
      y += e.h; prev = m.who;
      return e;
    });
    const inp = K.el('div', 'inp', parent, `<div class="plus">${ICON.plus}</div><div class="field"><div class="ph">Message</div><div class="txt"></div><div class="caret"></div><div class="att"><b>7.0%</b></div><div class="send">${ICON.send}</div></div>`);
    const keys = keyboard(parent);
    return { pov, head, clip, thread, dots, els, inp, keys };
  }

  // ---------------------------------------------------------------- the conversation
  const sA = K.scene(0, END + 0.02);
  const A = chat(sA, MSGS.length);
  K.check(A.pov, 0.5, 'pov bar'); K.check(A.head.querySelector('.nm'), 0.5, 'chat name');
  const status = A.head.querySelector('.st');
  const q = s => A.inp.querySelector(s);
  const inp = { txt: q('.txt'), ph: q('.ph'), caret: q('.caret'), att: q('.att'), send: q('.send'), plus: q('.plus') };
  const VIS = 640, DOTS_H = 76;         // visible thread height (the clip, less a margin); typing-dots height

  // Every typed character: when, and which key it lights.
  const EV = [];
  A.els.forEach(m => {
    if (m.type == null) return;
    const n = m.text.length, last = m.t - 0.16;
    m.ct = [...m.text].map((ch, k) => m.type + (last - m.type) * k / (n - 1));
    m.ct.forEach((tc, k) => {
      const ch = m.text[k].toUpperCase();
      EV.push({ t: tc, key: /[A-Z]/.test(ch) ? A.keys[ch] : ch === ' ' ? A.keys.space : A.keys.num });
      if (k % 2 === 0) K.sfx('type', tc, 0.5 + 0.25 * ((k * 7) % 5) / 4);
    });
  });
  const SENDS = A.els.filter(m => m.who === 'me').map(m => m.t);
  const ATT = A.els.find(m => m.attach != null);
  const allKeys = Object.values(A.keys);
  const dotEls = [...A.dots.querySelectorAll('i')];
  K.frame(t => {
    if (t >= END + 0.02) return;
    let txt = '', typing = false;
    for (const m of A.els) {
      if (m.type == null || t < m.type || t >= m.t) continue;
      let k = 0;
      while (k < m.ct.length && m.ct[k] <= t) k++;
      txt = m.text.slice(0, k); typing = true;
    }
    const attached = t >= ATT.attach + 0.12 && t < ATT.t;
    inp.txt.textContent = txt;
    inp.ph.style.visibility = txt || attached ? 'hidden' : 'visible';
    inp.att.style.visibility = attached ? 'visible' : 'hidden';
    const w = inp.txt.offsetWidth, over = Math.max(0, w - 596);
    inp.txt.style.transform = `translateX(${-over}px)`;
    inp.caret.style.visibility = typing ? 'visible' : 'hidden';
    inp.caret.style.left = (30 + w - over + 4) + 'px';
    for (const k of allKeys) k.classList.remove('on');
    for (const e of EV) if (t >= e.t && t < e.t + 0.09) e.key.classList.add('on');
    inp.send.classList.toggle('on', SENDS.some(s => t >= s - 0.1 && t < s + 0.05));
    inp.plus.classList.toggle('on', t >= ATT.attach && t < ATT.attach + 0.12);
    let dw = null;
    for (const m of A.els) for (const [a, b] of (m.dots || [])) if (t >= a && t < b) dw = { m, a };
    status.textContent = dw ? 'typing…' : 'online';
    A.dots.style.visibility = dw ? 'visible' : 'hidden';
    if (dw) {
      A.dots.style.top = dw.m.y + 'px';
      dotEls.forEach((d, k) => { d.style.transform = `translateY(${(-11 * Math.max(0, Math.sin((t - dw.a) * 9 - k * 0.9))).toFixed(2)}px)`; });
    }
  });

  // Scroll so the newest text (or Mum's typing dots) always sits just above the input bar.
  let cur = 0;
  const need = (bottom, at) => {
    const tgt = Math.max(cur, bottom - VIS);
    if (tgt <= cur) return;
    tl.fromTo(A.thread, { y: -cur }, { y: -tgt, duration: 0.36, ease: 'power3.out', immediateRender: false }, at);
    cur = tgt;
  };
  A.els.forEach((m, i) => {
    if (i === 0) return;
    for (const [a] of (m.dots || [])) need(m.y + DOTS_H, a - 0.02);
    need(m.y + m.h, m.t - 0.03);
    m.scroll = cur;
    const { b } = m;
    gsap.set(b, { autoAlpha: 0 });
    if (m.who === 'me') {
      tl.fromTo(b, { autoAlpha: 1, y: 70, scale: 0.72 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: 'back.out(1.7)', transformOrigin: '100% 100%', immediateRender: false }, m.t);
      K.sfx('whoosh', m.t - 0.07, 0.3, { dur: 0.22 });
      K.sfx('pop', m.t, 0.55, { note: 7 });
    } else {
      tl.fromTo(b, { autoAlpha: 1, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.2)', transformOrigin: '0% 100%', immediateRender: false }, m.t);
      K.sfx('pop', m.t, 0.5, { note: 2 });
    }
    K.check(b, m.t + 0.6, 'message ' + (i + 1));
  });
  const punch = (t, s = 1.03) => tl.fromTo(K.shaker, { scale: s }, { scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, t);
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.012, duration: END, ease: 'none', immediateRender: false }, 0);

  // The card: the chart builds, computer science lights up.
  const card = A.els[3].b;
  const cbars = [...card.querySelectorAll('.bars i')];
  tl.fromTo(cbars, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.out', stagger: 0.005, transformOrigin: '50% 100%' }, 4.15);
  tl.fromTo(card.querySelector('.tag'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'back.out(2)' }, 4.6);
  tl.fromTo(card.querySelector('.cs'), { scaleX: 1 }, { scaleX: 1.8, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, 4.6);
  punch(4.0, 1.025);
  K.sfx('impact', 4.0, 0.35, { big: 0.4 });
  K.sfx('pop', 4.6, 0.45, { note: 9 });
  // "...what?": the record stops.
  tl.fromTo(A.els[4].b, { rotation: 0 }, { rotation: -4, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, 7.05);
  K.sfx('downer', 6.92, 0.5, { dur: 0.7 });
  // "OK. Law then?" lands on the downbeat.
  punch(8.0, 1.035);
  K.sfx('thud', 8.0, 0.5);
  K.sfx('sparkle', 18.1, 0.35);
  // The punchline.
  const last = A.els[A.els.length - 1];
  punch(22.0, 1.045);
  tl.fromTo(last.b, { scale: 1 }, { scale: 1.1, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', transformOrigin: '0% 100%', immediateRender: false }, 22.3);
  // ...and I heart it, the way you would.
  const tap = last.b.querySelector('.tap');
  gsap.set(tap, { scale: 0 });
  tl.fromTo(tap, { scale: 0, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.42, ease: 'back.out(3)', immediateRender: false }, 22.85);
  K.sfx('pop', 22.85, 0.6, { note: 9 });
  K.sfx('sparkle', 22.9, 0.4);

  // ---------------------------------------------------------------- end card and loop
  SO.end(END, 29.62, { ask: ['SEND THIS', 'TO YOUR MUM.'], send: ['Then comment what they', 'told you to study.'], note: 'A conversation you’ve probably had. Data: NY Fed.' });
  AI.loop(29.62, C.paper, 'light', q => chat(q, 1));

  // ---------------------------------------------------------------- score (beat, C major: warm and light)
  K.music = {
    bpm: 120, style: 'beat',
    bars: [
      { chord: 'C', drums: 'intro', pad: 0.8, arp: 'up', arpgain: 0.45, lp: [0.45, 0.75] },  //  0 degree yet?
      { chord: 'Am', drums: 'intro', pad: 0.9, arp: 'up', arpgain: 0.5, lp: 0.8 },           //  2 very safe
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },               //  4 the card
      { chord: 'G', drums: 'half', bass: 0.6, pad: 0.9, lp: [0.8, 0.5] },                   //  6 ...what?
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },               //  8 law then?
      { chord: 'Am', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                         // 10 nobody knows
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                          // 12 so what??
      { chord: 'G', drums: 'build', bass: 1, pad: 1, arp: 'up' },                           // 14 test things
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                          // 16 how?
      { chord: 'Am', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },              // 18 the link
      { chord: 'F', drums: 'half', bass: 0.7, pad: 1, lp: 0.75 },                           // 20 typing...
      { chord: 'G', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },               // 22 can I do it too?
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },               // 24 end card
      { chord: 'F', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'bounce', bass: 1, pad: 1, arp: 'down', lp: [1, 0.45] },         // 28 into the loop
    ],
    risers: [[20.2, 22.0, 0.5]],
  };
};
