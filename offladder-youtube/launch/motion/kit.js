/* OffLadder motion kit.
 *
 * Deterministic, beat-synced motion design for 1080x1920 Shorts. A piece builds one
 * paused GSAP timeline; the renderer calls seek(t) for every sub-frame, so any frame
 * can be reproduced exactly. Procedural layers (particles, grain, canvases) register
 * frame functions that draw from t alone. Every helper that makes a sound records an
 * audio cue, so the soundtrack is generated from the same timeline as the picture.
 */
(function () {
  gsap.registerPlugin(CustomEase, CustomWiggle, DrawSVGPlugin, MorphSVGPlugin);
  // 2D transforms only, so Chromium re-rasterises type at every scale (no blurry zooms),
  // and no pixel rounding, so slow drifts don't step.
  gsap.config({ force3D: false });
  gsap.defaults({ autoRound: false });
  const W = 1080, H = 1920, FPS = 30, NS = 'http://www.w3.org/2000/svg';
  const C = {
    paper: '#F4F2EE', paper2: '#FBFAF7', ink: '#0C0C0C', orange: '#FA5608',
    muted: '#54524F', mist: '#E8E6E0', ember: '#C23D04', smoke: '#2A2927',
  };

  // The motion language: one entrance curve, one whip, two shakes.
  CustomEase.create('brand', '0.16, 1, 0.3, 1');
  CustomEase.create('whip', '0.76, 0, 0.24, 1');
  CustomEase.create('settle', '0.34, 1.56, 0.64, 1');
  CustomWiggle.create('shake', { wiggles: 9, type: 'easeOut' });
  CustomWiggle.create('jolt', { wiggles: 5, type: 'easeOut' });

  const K = { W, H, FPS, C, NS, cues: [], frameFns: [], checks: [], hints: [], music: null, duration: 0, fi: 0 };
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  K.tl = tl;

  // ---------- utilities ----------
  K.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  K.el = function (tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  K.css = (e, o) => { Object.assign(e.style, o); return e; };
  K.sfx = (name, t, gain = 1, extra = {}) => { K.cues.push({ name, t: +(+t).toFixed(4), gain, ...extra }); };
  K.frame = fn => K.frameFns.push(fn);
  // Canvas layers tell the renderer how far their content moves (in px) between two times,
  // so it can spend motion-blur samples where they're needed.
  K.hint = fn => K.hints.push(fn);
  K.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  K.easeOut = p => 1 - Math.pow(1 - K.clamp(p), 3);
  K.easeInOut = p => { p = K.clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  // Show an element from t (instantly), optionally hide it again at t1.
  K.show = function (e, t, t1) {
    if (t <= 0) gsap.set(e, { autoAlpha: 1 }); else { gsap.set(e, { autoAlpha: 0 }); tl.set(e, { autoAlpha: 1 }, t); }
    if (t1 != null) tl.set(e, { autoAlpha: 0 }, t1);
    return e;
  };

  // ---------- stage ----------
  const THEMES = {
    light: { wm: C.ink, l: C.orange, chipBg: C.ink, chipFg: C.paper },
    dark: { wm: C.paper, l: C.orange, chipBg: C.orange, chipFg: C.ink },
    orange: { wm: C.ink, l: C.paper, chipBg: C.ink, chipFg: C.orange },
  };
  K.init = function ({ duration, bg = C.paper, chip = '', theme = 'light', bpm = 120, grain = 0.075, safe = 'shorts' }) {
    K.duration = duration; K.bpm = bpm; K.beat = 60 / bpm; K.bar = 4 * K.beat;
    // 'social' is the box that clears Instagram, TikTok and YouTube at once (see 10-viral-standard.md).
    K.SAFE = safe === 'social' ? K.SAFE_SOCIAL : K.SAFE_SHORTS;
    const stage = document.getElementById('stage');
    K.stage = stage;
    K.bgl = K.el('div', 'layer bgl', stage); K.bgl.style.background = bg;
    K.back = K.el('div', 'layer back', stage);          // full-bleed decoration, not affected by the camera
    K.cam = K.el('div', 'layer cam', stage);
    K.shaker = K.el('div', 'layer shaker', K.cam);
    K.world = K.el('div', 'layer world', K.shaker);
    K.pc = K.el('canvas', 'layer pcanvas', K.shaker); K.pc.width = W; K.pc.height = H;
    K.pctx = K.pc.getContext('2d');
    K.fx = K.el('div', 'layer fx', stage);
    K.hud = buildHud(stage, chip, theme);
    if (safe === 'social') K.hud.style.top = '284px';
    K.flashEl = K.el('div', 'layer flash', stage);
    K.grainEl = buildGrain(stage, grain);
    gsap.set([K.cam, K.shaker], { transformOrigin: '50% 50%' });
    K.frameFns.unshift(() => K.pctx.clearRect(0, 0, W, H));
  };

  function buildHud(stage, chip, theme) {
    const h = K.el('div', 'hud', stage);
    const wm = K.el('div', 'wm', h, 'off<span class="l">ladder</span>');
    const c = chip ? K.el('div', 'chip', h, chip) : null;
    K.hudParts = { h, wm, l: wm.querySelector('.l'), c };
    applyTheme(theme, 0, true);
    return h;
  }
  function applyTheme(name, t, immediate) {
    const th = THEMES[name], p = K.hudParts;
    const pairs = [[p.wm, { color: th.wm }], [p.l, { color: th.l }]];
    if (p.c) pairs.push([p.c, { backgroundColor: th.chipBg, color: th.chipFg }]);
    for (const [e, v] of pairs) immediate ? gsap.set(e, v) : tl.set(e, v, t);
  }
  K.theme = (name, t) => applyTheme(name, t, false);
  K.bg = (color, t) => (t <= 0 ? gsap.set(K.bgl, { backgroundColor: color }) : tl.set(K.bgl, { backgroundColor: color }, t));
  K.hudOut = t => tl.to(K.hud, { autoAlpha: 0, y: -24, duration: 0.3, ease: 'expo.in' }, t);
  K.hudIn = t => tl.fromTo(K.hud, { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'brand', immediateRender: false }, t);

  // Film grain changes once per output frame (not per sub-frame) so motion blur never smears it.
  function buildGrain(stage, amount) {
    const cv = K.el('canvas', 'layer grain', stage);
    cv.width = 540; cv.height = 960; cv.style.opacity = amount;
    const ctx = cv.getContext('2d');
    const r = K.rng(4242), tiles = [];
    for (let k = 0; k < 6; k++) {
      const img = ctx.createImageData(540, 960);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (r() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
      tiles.push(img);
    }
    let last = -1;
    K.frame(() => {
      const f = K.fi;
      if (f !== last) { ctx.putImageData(tiles[((f % 6) + 6) % 6], 0, 0); last = f; }
    });
    return cv;
  }

  // ---------- scenes ----------
  K.scene = function (t0, t1) {
    const s = K.el('div', 'scene', K.world);
    return K.show(s, t0, t1);
  };

  // ---------- type ----------
  // Display type is set as explicit lines. Each line is a mask; words rise into it.
  K.lines = function (parent, o) {
    const { lines, x = 72, y, size, font = 'display', color = C.ink, lh = 0.92, track = -0.02, align = 'left', w = 936 } = o;
    const box = K.el('div', 'tbox ' + font, parent);
    K.css(box, { left: x + 'px', top: y + 'px', width: w + 'px', fontSize: size + 'px', lineHeight: lh, letterSpacing: track + 'em', color, textAlign: align });
    const out = [];
    for (const ln of lines) {
      const mask = K.el('div', 'mask', box);
      const inner = K.el('div', 'inner', mask);
      const parts = ln.split(' ');
      const words = parts.map((wd, i) => {
        const s = K.el('span', 'word', inner, wd);
        if (i < parts.length - 1) inner.appendChild(document.createTextNode(' '));
        return s;
      });
      out.push({ mask, inner, words });
    }
    return { box, lines: out, words: out.flatMap(l => l.words) };
  };
  // Shrink a set of lines until the widest one fits maxW (measured from the glyphs, not the box).
  K.fit = function (T, maxW) {
    const r = document.createRange();
    const widest = () => Math.max(...T.lines.map(l => { r.selectNodeContents(l.inner); return r.getBoundingClientRect().width; }));
    const size = parseFloat(T.box.style.fontSize);
    const w = widest();
    if (w > maxW) T.box.style.fontSize = (size * maxW / w).toFixed(2) + 'px';
    return T;
  };
  K.reveal = function (T, t, o = {}) {
    const { stagger = 0.045, dur = 0.62, from = 112, ease = 'brand', each = 'word', tilt = 5, sfx = null, gain = 1 } = o;
    const targets = each === 'line' ? T.lines.map(l => l.inner) : T.words;
    tl.fromTo(targets, { yPercent: from, rotation: from > 0 ? tilt : -tilt }, { yPercent: 0, rotation: 0, duration: dur, ease, stagger }, t);
    if (sfx) K.sfx(sfx, t, gain);
    return t + dur + stagger * (targets.length - 1);
  };
  K.unreveal = function (T, t, o = {}) {
    const { stagger = 0.025, dur = 0.36, to = -112, ease = 'expo.in', each = 'word' } = o;
    const targets = each === 'line' ? T.lines.map(l => l.inner) : T.words;
    tl.to(targets, { yPercent: to, rotation: to < 0 ? -4 : 4, duration: dur, ease, stagger }, t);
    const end = t + dur + stagger * (targets.length - 1);
    tl.set(targets, { autoAlpha: 0 }, end);
    return end;
  };

  // Highlight boxes, one per line, like the "CHOOSE ONE." box on offladder.com.
  K.marks = function (parent, o) {
    const { lines, x = 72, y, size, bg = C.orange, color = C.ink, shadow = C.ink, border = C.ink, font = 'display', track = -0.015, lift = 12 } = o;
    const box = K.el('div', 'mbox ' + font, parent);
    K.css(box, { left: x + 'px', top: y + 'px', fontSize: size + 'px', letterSpacing: track + 'em' });
    const rows = lines.map(ln => {
      const row = K.el('div', 'mrow', box);
      const m = K.el('div', 'mark', row);
      const sh = K.el('div', 'msh', m); sh.style.background = shadow;
      const b = K.el('div', 'mbg', m); b.style.background = bg; b.style.boxShadow = `inset 0 0 0 ${Math.max(5, size * 0.05)}px ${border}`;
      const mask = K.el('div', 'mmask', m);
      const tx = K.el('div', 'mtext', mask, ln); tx.style.color = color;
      return { row, m, sh, b, tx };
    });
    return { box, rows, lift };
  };
  K.markIn = function (M, t, o = {}) {
    const { stagger = 0.09, sfx = 'pop', gain = 1 } = o;
    M.rows.forEach((r, i) => {
      const s = t + i * stagger;
      tl.fromTo(r.b, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, s);
      tl.fromTo(r.tx, { yPercent: 108 }, { yPercent: 0, duration: 0.55, ease: 'brand' }, s + 0.07);
      tl.fromTo(r.sh, { x: 0, y: 0, autoAlpha: 0 }, { x: M.lift, y: M.lift, autoAlpha: 1, duration: 0.32, ease: 'power3.out' }, s + 0.2);
    });
    if (sfx) K.sfx(sfx, t, gain);
    return t + 0.6 + stagger * (M.rows.length - 1);
  };
  K.markShow = function (M) { M.rows.forEach(r => gsap.set(r.sh, { x: M.lift, y: M.lift, autoAlpha: 1 })); };
  K.markOut = function (M, t, o = {}) {
    const { stagger = 0.05 } = o;
    M.rows.forEach((r, i) => {
      const s = t + i * stagger;
      tl.to(r.tx, { yPercent: -110, duration: 0.32, ease: 'expo.in' }, s);
      tl.to(r.sh, { x: 0, y: 0, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, s);
      tl.to(r.b, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.34, ease: 'expo.in' }, s + 0.08);
    });
  };

  // ---------- impacts ----------
  K.stamp = function (parent, o) {
    const { text, x, y, size, color = C.ink, rot = -7, bg = 'transparent', border = true, shadow = null } = o;
    const s = K.el('div', 'stamp', parent, text);
    K.css(s, { left: x + 'px', top: y + 'px', fontSize: size + 'px', color, borderColor: color, background: bg });
    if (!border) s.style.borderWidth = '0';
    if (shadow) s.style.boxShadow = `${size * 0.08}px ${size * 0.08}px 0 ${shadow}`;
    gsap.set(s, { xPercent: -50, yPercent: -50, rotation: rot, autoAlpha: 0 });
    s._cx = x; s._cy = y; s._rot = rot;
    return s;
  };
  // The stamp lands exactly on t: approach, impact, squash, shake, flash, dust.
  K.slam = function (s, t, o = {}) {
    const { from = 2.6, shake = 24, flash = 0.3, dust = C.ink, sfx = 'impact', gain = 1, seed = 7 } = o;
    tl.fromTo(s, { autoAlpha: 0, scale: from, rotation: s._rot - 9 }, { autoAlpha: 1, scale: 1, rotation: s._rot, duration: 0.17, ease: 'power4.in' }, t - 0.17);
    tl.to(s, { scaleX: 1.06, scaleY: 0.95, duration: 0.05, ease: 'power2.out' }, t);
    tl.to(s, { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1, 0.45)' }, t + 0.05);
    K.shake(t, { amp: shake });
    if (flash) K.flash(t, { a: flash });
    if (dust) K.burst(t, { x: s._cx, y: s._cy, color: dust, n: 16, seed });
    K.sfx(sfx, t, gain);
    return t;
  };
  K.shake = function (t, o = {}) {
    const { amp = 18, dur = 0.45, rot = 0.9 } = o;
    tl.fromTo(K.shaker, { x: 0 }, { x: amp, duration: dur, ease: 'shake', immediateRender: false }, t);
    tl.fromTo(K.shaker, { y: 0 }, { y: -amp * 0.75, duration: dur * 0.9, ease: 'jolt', immediateRender: false }, t);
    tl.fromTo(K.shaker, { rotation: 0 }, { rotation: rot, duration: dur, ease: 'shake', immediateRender: false }, t);
  };
  K.flash = function (t, o = {}) {
    const { color = '#FFFFFF', a = 0.35, dur = 0.16 } = o;
    tl.fromTo(K.flashEl, { backgroundColor: color, opacity: a }, { opacity: 0, duration: dur, ease: 'power2.out', immediateRender: false }, t);
  };

  // Square particles with drag and gravity, drawn from t alone.
  K.burst = function (t, o = {}) {
    const { x, y, n = 14, color = C.ink, speed = [650, 1500], size = [10, 28], life = 0.75, gravity = 2400, drag = 3.2, seed = 1, spread = Math.PI * 2, angle = -Math.PI / 2 } = o;
    const r = K.rng(seed);
    const ps = Array.from({ length: n }, () => {
      const a = angle + (r() - 0.5) * spread, v = speed[0] + r() * (speed[1] - speed[0]);
      return { vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: size[0] + r() * (size[1] - size[0]), rot: r() * 6.28, vr: (r() - 0.5) * 18, life: life * (0.65 + r() * 0.7), col: Array.isArray(color) ? color[(r() * color.length) | 0] : color };
    });
    K.hint((a, b) => (b < t || a > t + life * 1.5 ? 0 : (speed[1] * Math.exp(-drag * Math.max(0, a - t)) + gravity * Math.max(0, b - t)) * (b - a)));
    K.frame(tt => {
      const dt = tt - t;
      if (dt < 0 || dt > life * 1.5) return;
      const c = K.pctx, k = (1 - Math.exp(-drag * dt)) / drag;
      for (const p of ps) {
        if (dt > p.life) continue;
        const px = x + p.vx * k, py = y + p.vy * k + 0.5 * gravity * dt * dt;
        c.save(); c.globalAlpha = 1 - Math.pow(dt / p.life, 2);
        c.translate(px, py); c.rotate(p.rot + p.vr * dt); c.fillStyle = p.col;
        c.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); c.restore();
      }
    });
  };

  // A digital glitch: the frame jumps sideways in steps, bars of colour tear across it.
  K.glitch = function (t, o = {}) {
    const { dur = 0.2, amp = 46, seed = 9, colors = [C.orange, C.paper, C.ink], bars = 7, sfx = true, gain = 1 } = o;
    const r = K.rng(seed), steps = 6;
    for (let k = 0; k < steps; k++) {
      const at = t + (k / steps) * dur;
      tl.set(K.shaker, { x: (r() - 0.5) * 2 * amp, skewX: (r() - 0.5) * 6 }, at);
    }
    tl.set(K.shaker, { x: 0, skewX: 0 }, t + dur);
    for (let b = 0; b < bars; b++) {
      const e = K.el('div', 'layer', K.fx);
      const h = 8 + r() * 90;
      K.css(e, { top: ((r() * (H - h)) | 0) + 'px', height: h + 'px', background: colors[(r() * colors.length) | 0], opacity: 0 });
      const a0 = t + r() * dur * 0.7, a1 = a0 + 0.03 + r() * 0.06;
      tl.set(e, { opacity: 0.85, x: (r() - 0.5) * 300 }, a0);
      tl.set(e, { opacity: 0 }, a1);
    }
    if (sfx) K.sfx('glitch', t, gain, { seed });
  };

  // ---------- camera ----------
  K.drift = function (t0, t1, o = {}) {
    const { from = 1, to = 1.035, rot = 0, x = 0, y = 0 } = o;
    tl.fromTo(K.cam, { scale: from, rotation: 0, x: 0, y: 0 }, { scale: to, rotation: rot, x, y, duration: t1 - t0, ease: 'none', immediateRender: t0 <= 0 }, t0);
  };
  // Put world point (px, py) at the centre of the frame at the given scale.
  K.focus = (px, py, scale) => ({ scale, x: -scale * (px - W / 2), y: -scale * (py - H / 2) });
  // Put world point (px, py) at screen point (qx, qy) at the given scale.
  K.frameOn = (px, py, scale, qx = W / 2, qy = H / 2) => ({ scale, x: qx - W / 2 - scale * (px - W / 2), y: qy - H / 2 - scale * (py - H / 2) });
  // Where an element sits in world coordinates (camera ignored), measured once at build time.
  K.box = function (e) {
    const r = e.getBoundingClientRect(), w = K.world.getBoundingClientRect();
    return { x: r.left - w.left, y: r.top - w.top, w: r.width, h: r.height, cx: r.left - w.left + r.width / 2, cy: r.top - w.top + r.height / 2 };
  };
  K.camTo = function (t, dur, vars, ease = 'whip') { tl.to(K.cam, { ...vars, duration: dur, ease }, t); };
  K.camSet = function (t, vars) { t <= 0 ? gsap.set(K.cam, vars) : tl.set(K.cam, vars, t); };

  // ---------- transitions ----------
  // The ladder wipe: rungs sweep across, fully cover at `mid`, then clear the other way.
  K.ladder = function (mid, o = {}) {
    const { colors = [C.orange, C.ink], bars = 8, dur = 0.28, stagger = 0.024, dir = 1, sfx = true } = o;
    const start = mid - dur - stagger * (bars - 1);
    const wrap = K.el('div', 'layer ladder', K.fx);
    const h = H / bars;
    const rungs = [];
    for (let i = 0; i < bars; i++) {
      const b = K.el('div', 'rung', wrap);
      K.css(b, { top: Math.floor(i * h) + 'px', height: Math.ceil(h) + 2 + 'px', background: colors[i % colors.length] });
      gsap.set(b, { scaleX: 0, transformOrigin: dir > 0 ? '0% 50%' : '100% 50%' });
      rungs.push(b);
    }
    tl.to(rungs, { scaleX: 1, duration: dur, ease: 'power3.in', stagger }, start);
    tl.set(rungs, { transformOrigin: dir > 0 ? '100% 50%' : '0% 50%' }, mid);
    tl.to(rungs, { scaleX: 0, duration: dur, ease: 'power3.out', stagger }, mid);
    if (sfx) K.sfx('whoosh', start, 1, { dur: 2 * (dur + stagger * (bars - 1)) });
    return mid;
  };
  // A single panel slides across with a skewed edge.
  K.panel = function (mid, o = {}) {
    const { color = C.orange, dur = 0.34, dir = 1, sfx = true } = o;
    const p = K.el('div', 'layer panel', K.fx);
    p.style.background = color;
    gsap.set(p, { xPercent: dir > 0 ? -170 : 170, skewX: dir > 0 ? -14 : 14, scaleX: 1.3, autoAlpha: 0 });
    tl.set(p, { autoAlpha: 1 }, mid - dur);
    tl.to(p, { xPercent: 0, duration: dur, ease: 'power3.in' }, mid - dur);
    tl.to(p, { xPercent: dir > 0 ? 170 : -170, duration: dur, ease: 'power3.out' }, mid);
    tl.set(p, { autoAlpha: 0 }, mid + dur);
    if (sfx) K.sfx('whoosh', mid - dur, 0.9, { dur: dur * 2 });
    return mid;
  };

  // ---------- drawing ----------
  K.svg = function (parent, o = {}) {
    const { x = 0, y = 0, w = W, h = H, vb } = o;
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', w); s.setAttribute('height', h);
    s.setAttribute('viewBox', vb || `0 0 ${w} ${h}`);
    s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.overflow = 'visible';
    parent.appendChild(s);
    return s;
  };
  K.path = function (svg, d, o = {}) {
    const { stroke = C.ink, width = 10, fill = 'none', cap = 'round', join = 'round' } = o;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', fill); p.setAttribute('stroke', stroke);
    p.setAttribute('stroke-width', width); p.setAttribute('stroke-linecap', cap); p.setAttribute('stroke-linejoin', join);
    svg.appendChild(p);
    return p;
  };
  K.draw = function (p, t, dur = 0.6, ease = 'power2.inOut', sfx = null) {
    tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease }, t);
    if (sfx) K.sfx(sfx, t, 0.8);
  };
  // A hand-drawn arrow with a head, drawn on in two strokes.
  K.arrow = function (svg, pts, o = {}) {
    const { stroke = C.ink, width = 12, head = 44 } = o;
    const [a, c1, c2, b] = pts;
    const shaft = K.path(svg, `M${a[0]},${a[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`, { stroke, width });
    const ang = Math.atan2(b[1] - c2[1], b[0] - c2[0]);
    const l = [b[0] - head * Math.cos(ang - 0.5), b[1] - head * Math.sin(ang - 0.5)];
    const rr = [b[0] - head * Math.cos(ang + 0.5), b[1] - head * Math.sin(ang + 0.5)];
    const tip = K.path(svg, `M${l[0]},${l[1]} L${b[0]},${b[1]} L${rr[0]},${rr[1]}`, { stroke, width });
    return { shaft, tip };
  };
  K.drawArrow = function (A, t, dur = 0.55) {
    K.draw(A.shaft, t, dur, 'power2.inOut');
    K.draw(A.tip, t + dur * 0.85, 0.2, 'power2.out');
    K.sfx('scribble', t, 0.7, { dur });
  };

  // ---------- numbers and typing ----------
  // Slot-machine digits: each column spins through 0-9 and lands on its digit, left to right.
  K.slot = function (parent, o) {
    const { x, y, size, cols = 3, color = C.ink, font = 'display', track = -0.02, spins = 2 } = o;
    const box = K.el('div', 'slot ' + font, parent);
    K.css(box, { position: 'absolute', left: x + 'px', top: y + 'px', fontSize: size + 'px', color, lineHeight: 1, letterSpacing: track + 'em', display: 'flex' });
    const strip = [''].concat(...Array.from({ length: spins + 1 }, () => '0123456789'.split('')));
    const columns = Array.from({ length: cols }, () => {
      const m = K.el('div', '', box);
      K.css(m, { overflow: 'hidden', height: '1em', padding: '0.1em 0.04em', margin: '-0.1em -0.04em', boxSizing: 'content-box' });
      const s = K.el('div', '', m);
      strip.forEach(d => { const c = K.el('div', '', s, d || '&#8203;'); K.css(c, { height: '1em', textAlign: 'center', minWidth: '0.62em' }); });
      return { m, s };
    });
    return { box, columns, spins, value: null };
  };
  // Land the slot on a number at t (leading zeros stay blank).
  K.slotTo = function (S, value, t, o = {}) {
    const { dur = 0.9, stagger = 0.09, sfx = 'tick', cycle = S.spins } = o;
    const str = String(value).padStart(S.columns.length, ' ');
    S.columns.forEach((c, i) => {
      const ch = str[i];
      const idx = ch === ' ' ? 0 : 1 + 10 * cycle + Number(ch);
      tl.to(c.s, { y: () => -idx * parseFloat(getComputedStyle(S.box).fontSize), duration: dur + i * stagger, ease: 'expo.out' }, t);
      if (sfx && ch !== ' ') for (let k = 0; k < 3; k++) K.sfx(sfx, t + (dur + i * stagger) * (0.12 + 0.2 * k), 0.3);
    });
    return t + dur + stagger * (S.columns.length - 1);
  };
  // A masked window that rolls between values at the given times.
  K.roller = function (parent, o) {
    const { x, y, w, h, size, values, color = C.ink, font = 'display', align = 'center' } = o;
    const win = K.el('div', 'roller ' + font, parent);
    K.css(win, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', fontSize: size + 'px', color, textAlign: align, lineHeight: h + 'px' });
    const spans = values.map(v => { const s = K.el('div', 'rv', win, String(v)); gsap.set(s, { yPercent: 100 }); return s; });
    gsap.set(spans[0], { yPercent: 0 });
    return { win, spans };
  };
  K.rollAt = function (R, i, t, o = {}) {
    const { dur = 0.34, sfx = null, gain = 1 } = o;
    tl.to(R.spans[i - 1], { yPercent: -100, duration: dur, ease: 'expo.inOut' }, t - dur * 0.5);
    tl.fromTo(R.spans[i], { yPercent: 100 }, { yPercent: 0, duration: dur, ease: 'expo.inOut', immediateRender: false }, t - dur * 0.5);
    if (sfx) K.sfx(sfx, t, gain);
  };
  // Characters appear at a human, slightly irregular pace with a block caret.
  K.type = function (el, text, t, o = {}) {
    const { cps = 20, jitter = 0.4, seed = 5, sound = true, gain = 0.55, keepCaret = true } = o;
    el.innerHTML = '';
    const chars = [...text].map(ch => { const s = K.el('span', 'ch', el); s.textContent = ch; gsap.set(s, { opacity: 0 }); return s; });
    const r = K.rng(seed);
    let tt = t, prev = null;
    for (const s of chars) {
      tl.set(s, { opacity: 1, '--cur': 1 }, tt);
      if (prev) tl.set(prev, { '--cur': 0 }, tt);
      if (sound && s.textContent.trim()) K.sfx('type', tt, gain * (0.7 + r() * 0.6), { seed: (r() * 1e6) | 0 });
      prev = s;
      tt += (1 / cps) * (1 + (r() - 0.5) * 2 * jitter) * (s.textContent === ' ' ? 1.7 : 1);
    }
    if (!keepCaret && prev) tl.set(prev, { '--cur': 0 }, tt + 0.3);
    return { end: tt, chars };
  };

  // ---------- brand ident ----------
  // OffLadder's logo mark (from offladder.com): the ring draws on, the rungs stack up.
  K.ident = function (parent, o) {
    const { x, y, size = 200, color = C.orange } = o;
    const s = K.svg(parent, { x, y, w: size, h: size * 1.08, vb: '0 -4 100 108' });
    const ring = K.path(s, 'M30.5 69.85 A34 34 0 1 1 69.5 69.85', { stroke: color, width: 20, cap: 'butt' });
    const rungs = ['M41 76h18l3.5 6h-25z', 'M36.5 85h27l4 6.5h-35z', 'M31 94.5h38l4.5 6.5h-47z'].map(d => {
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', color); s.appendChild(p); return p;
    });
    return { s, ring, rungs };
  };
  K.identIn = function (I, t) {
    tl.fromTo(I.ring, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'expo.inOut' }, t);
    tl.fromTo(I.rungs, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.08 }, t + 0.38);
    K.sfx('ident', t + 0.42, 1);
  };

  // ---------- safe area ----------
  // Text must stay clear of the Shorts UI: the top bar, the right-hand buttons and the caption.
  K.SAFE_SHORTS = { l: 40, t: 170, r: 900, b: 1500, rTop: 1020, split: 1000 };
  K.SAFE_SOCIAL = { l: 65, t: 270, r: 900, b: 1250, rTop: 940, split: 1000 };
  K.SAFE = K.SAFE_SHORTS;
  K.check = function (e, t, name) { K.checks.push({ e, t, name: name || (e.textContent || '').trim().slice(0, 40) }); };
  // Measures the ink, not the layout box: words, marks, or the element itself.
  window.__checks = function () {
    const bad = [];
    for (const c of K.checks) {
      window.seek(c.t, Math.round(c.t * FPS));
      const parts = c.e.querySelectorAll ? c.e.querySelectorAll('.word, .mark') : [];
      const rs = (parts.length ? [...parts] : [c.e]).map(p => p.getBoundingClientRect()).filter(r => r.width > 0);
      if (!rs.length) continue;
      const r = { left: Math.min(...rs.map(q => q.left)), top: Math.min(...rs.map(q => q.top)), right: Math.max(...rs.map(q => q.right)), bottom: Math.max(...rs.map(q => q.bottom)) };
      const S = K.SAFE, right = r.bottom <= S.split ? S.rTop : S.r;
      if (r.left < S.l - 0.5 || r.top < S.t - 0.5 || r.right > right + 0.5 || r.bottom > S.b + 0.5)
        bad.push({ name: c.name, t: c.t, box: [r.left, r.top, r.right, r.bottom].map(Math.round) });
    }
    return bad;
  };

  // ---------- run ----------
  // t is the sub-frame time; fi is the output frame it belongs to (for grain and other per-frame noise).
  window.seek = function (t, fi) {
    K.fi = fi == null ? Math.round(t * FPS) : fi;
    tl.seek(Math.max(0, t), true);
    for (const f of K.frameFns) f(t);
  };
  window.__meta = () => ({ duration: K.duration, bpm: K.bpm, cues: K.cues, music: K.music });
  // The largest on-screen displacement (px) of anything visible between t0 and t1.
  window.__motion = function (t0, t1, fi) {
    const els = K._all || (K._all = [...K.stage.querySelectorAll('*')].filter(e => !e.classList.contains('grain')));
    const vis = { opacityProperty: true, visibilityProperty: true };
    const snap = t => { window.seek(t, fi); return els.map(e => (e.checkVisibility(vis) ? e.getBoundingClientRect() : null)); };
    const a = snap(t0), b = snap(t1);
    let m = 0;
    for (let i = 0; i < els.length; i++) {
      const p = a[i], q = b[i];
      if (!p || !q || (p.width === 0 && p.height === 0)) continue;
      m = Math.max(m, Math.abs(p.left - q.left), Math.abs(p.top - q.top), Math.abs(p.right - q.right), Math.abs(p.bottom - q.bottom));
    }
    for (const h of K.hints) m = Math.max(m, h(t0, t1));
    return m;
  };
  window.K = K;
})();
