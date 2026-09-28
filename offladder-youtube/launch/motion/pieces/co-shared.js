/* Shared components for "Cooked or not?", the verdict series (episodes 6 onwards).
 * Pieces load it after ai-shared.js with an "@shared ai co" line. Only defines functions.
 *
 * The data: Microsoft Research, "Working with AI: Measuring the Applicability of Generative AI to
 * Occupations" (Tomlinson, Jaffe, Wang, Counts, Suri; arXiv 2507.07935 v6, 22 Dec 2025), results
 * files v1.1 at github.com/microsoft/working-with-ai (CC BY 4.0). SCORES holds the AI applicability
 * score of all 785 occupations, highest first, times 1000.
 */
window.CO = (function () {
  const CO = {};
  const { C } = K;

  CO.SCORES = '492,462,454,449,419,409,408,404,391,386,383,376,373,372,369,367,367,365,357,355,353,353,353,352,350,350,349,346,344,342,341,340,339,338,337,336,334,334,334,333,332,331,331,331,331,330,330,330,330,329,329,328,328,327,326,326,325,325,324,323,323,322,322,322,321,321,318,317,316,315,315,315,315,314,313,313,312,312,311,311,310,310,309,308,307,307,307,306,306,305,305,305,302,299,298,298,298,298,297,297,297,297,296,296,294,292,291,289,288,287,286,285,285,283,283,281,280,278,278,278,276,275,274,272,271,269,269,267,265,265,264,262,262,261,261,260,260,259,258,257,257,257,256,256,256,255,255,254,253,253,253,253,252,251,251,250,250,250,250,249,249,249,248,248,247,246,246,245,245,244,244,243,242,242,241,241,240,240,240,239,238,237,236,235,234,234,233,232,232,232,232,231,230,229,229,228,228,228,225,225,223,223,222,222,222,222,221,221,219,219,218,218,218,218,218,217,215,212,211,211,211,210,209,209,209,208,207,207,207,207,206,205,205,205,205,205,204,204,203,203,203,202,201,200,200,199,199,199,198,198,198,198,196,196,195,195,194,194,193,193,193,192,192,191,190,189,189,189,189,189,188,186,185,185,184,183,183,182,182,182,181,181,181,180,180,180,180,180,180,180,179,179,178,177,177,177,177,177,176,176,176,175,174,174,173,173,172,172,172,172,172,172,171,170,170,170,169,169,169,169,169,169,169,168,168,168,167,167,167,167,166,166,166,165,164,164,164,164,163,163,163,163,162,162,162,161,160,160,160,159,159,158,158,158,157,157,157,156,156,156,156,155,155,155,155,154,153,153,152,151,151,151,150,149,149,149,149,147,147,146,146,146,146,146,146,145,145,145,144,144,144,144,143,143,143,143,143,142,142,142,141,140,140,140,140,140,139,139,139,139,138,138,138,138,138,137,137,137,137,137,137,136,135,135,134,134,133,133,131,131,131,131,131,130,129,127,127,127,126,126,126,125,125,125,125,125,125,125,124,124,124,124,123,123,123,123,122,122,122,122,122,121,121,121,120,119,119,119,118,117,117,117,117,117,117,116,116,115,115,115,115,115,114,114,113,113,113,113,113,112,112,112,111,111,111,110,110,110,110,110,110,109,109,108,108,108,108,106,105,105,105,104,104,104,104,103,103,102,100,100,100,99,99,99,98,98,98,97,97,97,96,96,95,95,95,94,93,93,93,93,93,92,92,91,91,91,91,91,90,90,89,89,89,89,89,88,88,88,87,87,87,87,87,87,86,86,86,85,85,84,84,84,84,84,84,83,83,83,83,83,82,82,82,81,81,80,80,80,80,79,79,79,78,78,78,78,77,77,77,77,77,76,76,76,76,75,75,75,75,75,75,74,74,74,74,74,73,73,73,72,72,72,72,71,71,70,70,70,70,70,70,70,69,69,68,68,68,67,67,66,66,65,65,64,64,64,64,63,63,63,63,62,62,62,62,62,61,61,61,61,60,60,59,59,58,58,57,57,57,56,55,55,55,55,55,54,54,54,54,54,53,53,53,52,52,52,51,51,51,51,51,51,50,50,50,49,48,48,48,47,47,46,46,46,46,45,45,44,44,44,44,43,43,43,42,42,42,41,41,41,40,40,39,39,38,38,37,36,36,35,34,34,34,34,32,32,30,30,30,30,30,29,29,29,29,28,27,26,26,26,25,25,23,22,22,21,21,21,20,19,18,15,15,13,12,12,12,10,10,9,9,9,8,7,7,5,3,0,0,0,0,0,0,0,0'.split(',').map(Number);

  // Heat: cold tiles sit just above the ink, the hottest glow almost white.
  const STOPS = [[0, [24, 22, 21]], [0.2, [48, 38, 33]], [0.45, [122, 42, 10]], [0.62, [194, 61, 4]], [0.76, [250, 86, 8]], [0.88, [255, 140, 80]], [1, [255, 222, 199]]];
  CO.rgb = function (u) {
    u = K.clamp(u);
    for (let i = 1; i < STOPS.length; i++) {
      const [b, cb] = STOPS[i];
      if (u <= b) {
        const [a, ca] = STOPS[i - 1], k = (u - a) / (b - a);
        return ca.map((v, j) => v + (cb[j] - v) * k);
      }
    }
    return STOPS[STOPS.length - 1][1];
  };
  CO.heat = u => { const c = CO.rgb(u); return `rgb(${c.map(Math.round).join(',')})`; };
  CO.heatOf = rank => CO.heat(CO.SCORES[rank - 1] / CO.SCORES[0]);

  // A warm glow rising from the bottom of the frame, breathing on the beat.
  CO.glow = function (t0, t1, o = {}) {
    const { a = 0.55, color = '194,61,4', y = 118 } = o;
    const g = K.el('div', 'layer coglow', K.back);
    g.style.background = `radial-gradient(120% 60% at 50% ${y}%, rgba(${color},${a}) 0%, rgba(${color},${a * 0.35}) 38%, rgba(${color},0) 70%)`;
    K.show(g, t0, t1);
    const beats = Math.floor((t1 - t0) / K.beat);
    for (let k = 0; k < beats; k++) {
      K.tl.fromTo(g, { opacity: 1 }, { opacity: 0.72, duration: K.beat, ease: 'sine.inOut', immediateRender: false }, t0 + k * K.beat);
    }
    return g;
  };

  // ---------------------------------------------------------------- the heat map
  // One tile per occupation, ranked left to right, top to bottom. Drawn on a canvas from t alone.
  // State the piece can tween: s.dim (0-1, cools every tile), s.boost (extra heat), s.shimmer (amplitude).
  CO.heatmap = function (parent, o) {
    const { x0 = 111, y0 = 900, cols = 33, pitch = 26, size = 21, t0 = 0, wave = 0.012, from = -1, t1 = 99 } = o;
    const n = CO.SCORES.length, top = CO.SCORES[0];
    const cv = K.el('canvas', 'layer', parent); cv.width = K.W; cv.height = K.H;
    const g = cv.getContext('2d');
    const M = { cv, s: { dim: 0, boost: 0, shimmer: 0 }, rings: [], hidden: new Set(), x0, y0, cols, pitch, size, n };
    M.pos = i => ({ x: x0 + (i % cols) * pitch + size / 2, y: y0 + Math.floor(i / cols) * pitch + size / 2 });
    // A highlight ring on tile i between ta and tb.
    M.ring = (i, ta, tb, color = C.paper2) => { M.rings.push({ i, ta, tb, color }); };
    const pop = p => { p = K.clamp(p) - 1; const s = 1.9; return 1 + (s + 1) * p * p * p + s * p * p; };
    K.frame(t => {
      g.clearRect(0, 0, K.W, K.H);
      if (t < from || t > t1) return;
      const { dim, boost, shimmer } = M.s;
      for (let i = 0; i < n; i++) {
        const c = i % cols, r = Math.floor(i / cols);
        const k = t0 <= -50 ? 1 : pop((t - t0 - (c + r) * wave) / 0.3);
        if (k <= 0) continue;
        let u = CO.SCORES[i] / top;
        if (shimmer) u += shimmer * Math.sin(2 * Math.PI * (t * 1.1 - (c + r) * 0.045)) * (0.35 + u * 0.65);
        u = u * (1 + boost) + boost * 0.12;
        let rgb = CO.rgb(u);
        if (dim) rgb = rgb.map(v => v + (14 - v) * dim);
        g.fillStyle = `rgb(${rgb.map(Math.round).join(',')})`;
        const sz = size * k, p = M.pos(i);
        g.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
      for (const R of M.rings) {
        if (t < R.ta || t > R.tb) continue;
        const e = K.easeOut((t - R.ta) / 0.22), p = M.pos(R.i);
        const sz = size + 12 + 30 * (1 - e) + 4 * Math.sin((t - R.ta) * 2 * Math.PI * 2);
        g.strokeStyle = R.color; g.lineWidth = 5; g.globalAlpha = K.clamp((R.tb - t) / 0.12);
        g.strokeRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        g.globalAlpha = 1;
      }
    });
    K.hint((a, b) => (M.rings.some(R => b > R.ta && a < R.ta + 0.3) ? 30 : 0));
    return M;
  };

  // ---------------------------------------------------------------- icons
  // Line icons on a 100 x 100 grid, drawn on like the arrows.
  const gear = (() => {
    let d = '';
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2, w = 0.2;
      const P = (r, ang) => `${(50 + r * Math.cos(ang)).toFixed(1)} ${(50 + r * Math.sin(ang)).toFixed(1)}`;
      d += `${k ? 'L' : 'M'}${P(31, a - 0.39 + w * 0.3)} L${P(42, a - w)} L${P(42, a + w)} L${P(31, a + 0.39 - w * 0.3)} `;
    }
    return d + 'Z';
  })();
  CO.ICONS = {
    translate: ['M16 10 H52 Q60 10 60 18 V38 Q60 46 52 46 H30 L18 56 V46 H16 Q8 46 8 38 V18 Q8 10 16 10 Z', 'M22 38 L34 17 L46 38 M26.5 31 H41.5',
      'M48 54 H84 Q92 54 92 62 V82 Q92 90 84 90 H82 V98 L72 90 H48 Q40 90 40 82 V62 Q40 54 48 54 Z', 'M52 66 H80 M52 78 H72'],
    history: ['M12 34 L50 12 L88 34 Z', 'M22 42 V78 M40 42 V78 M60 42 V78 M78 42 V78', 'M10 88 H90'],
    pen: ['M50 8 L74 44 Q74 58 50 92 Q26 58 26 44 Z', 'M50 58 V92', 'M56 46 A6 6 0 1 1 44 46 A6 6 0 1 1 56 46'],
    case: ['M14 34 H86 Q92 34 92 40 V80 Q92 86 86 86 H14 Q8 86 8 80 V40 Q8 34 14 34 Z', 'M36 34 V24 Q36 18 42 18 H58 Q64 18 64 24 V34', 'M8 56 H92', 'M44 52 H56 V62 H44 Z'],
    gear: [gear, 'M62 50 A12 12 0 1 1 38 50 A12 12 0 1 1 62 50'],
    mic: ['M38 18 A12 12 0 0 1 62 18 V46 A12 12 0 0 1 38 46 Z', 'M26 40 A24 24 0 0 0 74 40', 'M50 64 V82', 'M34 86 H66'],
    headset: ['M18 58 V48 A32 32 0 0 1 82 48 V58', 'M14 54 H26 V82 H14 Q8 82 8 76 V60 Q8 54 14 54 Z', 'M74 54 H86 Q92 54 92 60 V76 Q92 82 86 82 H74 Z', 'M86 82 Q86 92 70 92 H56'],
    phone: ['M30 10 L42 30 L34 38 Q42 56 62 66 L70 58 L90 70 L82 86 Q74 94 60 88 Q26 72 12 38 Q6 24 14 16 Z'],
    ballot: ['M18 46 H82 V88 H18 Z', 'M32 46 H68', 'M38 50 V14 H62 V50', 'M43 32 L49 38 L58 24'],
    sigma: ['M74 16 H26 L54 50 L26 84 H74'],
    code: ['M34 28 L14 50 L34 72', 'M66 28 L86 50 L66 72', 'M58 20 L42 80'],
  };
  CO.icon = function (parent, name, o) {
    const { x, y, size = 200, color = C.paper, width = 6 } = o;
    const s = K.svg(parent, { x, y, w: size, h: size, vb: '0 0 100 100' });
    const paths = CO.ICONS[name].map(d => K.path(s, d, { stroke: color, width }));
    paths.forEach(p => gsap.set(p, { drawSVG: '0%' }));
    return { s, paths };
  };
  CO.iconIn = function (I, t, dur = 0.42) {
    I.paths.forEach((p, k) => K.tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'power2.inOut', immediateRender: false }, t + k * 0.06));
    K.tl.fromTo(I.s, { scale: 0.7, rotation: -8, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t);
  };
  CO.iconOut = function (I, t) {
    K.tl.to(I.s, { scale: 0.6, autoAlpha: 0, rotation: 10, duration: 0.22, ease: 'power3.in', transformOrigin: '50% 50%' }, t);
  };

  // ---------------------------------------------------------------- the verdict gauge
  // Three zones from FINE to COOKED. The needle is our read of the evidence, and says so.
  CO.gauge = function (parent, o) {
    const { cx = 540, cy = 1400, r = 300, band = 54, labels = ['FINE', 'HEATING UP', 'COOKED'], note = 'OUR READ OF THE DATA' } = o;
    const G = { cx, cy, r, s: { v: 0.5, trem: 0 } };
    const box = K.el('div', 'cogauge', parent);
    const sv = K.svg(box);
    const zc = [C.mist, C.orange, C.ember];
    const arc = (a0, a1, rad) => {
      const p = a => [cx + rad * Math.cos(Math.PI - a * Math.PI), cy - rad * Math.sin(Math.PI - a * Math.PI)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rad} ${rad} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };
    G.zones = [0, 1, 2].map(k => K.path(sv, arc(k / 3 + 0.006, (k + 1) / 3 - 0.006, r), { stroke: zc[k], width: band, cap: 'butt' }));
    G.ticks = [];
    for (let k = 0; k <= 30; k++) {
      const a = Math.PI - (k / 30) * Math.PI, r0 = r - band / 2 - 14, r1 = r0 - (k % 5 ? 14 : 30);
      G.ticks.push(K.path(sv, `M${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy - r0 * Math.sin(a)).toFixed(1)} L${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy - r1 * Math.sin(a)).toFixed(1)}`, { stroke: C.paper, width: k % 5 ? 3 : 5 }));
    }
    G.needle = K.path(sv, `M${cx} ${cy + 36} L${cx} ${cy - r + band / 2 + 8}`, { stroke: C.paper2, width: 12 });
    G.hub = K.path(sv, `M${cx + 26} ${cy} A26 26 0 1 1 ${cx - 26} ${cy} A26 26 0 1 1 ${cx + 26} ${cy}`, { stroke: C.paper2, width: 1, fill: C.paper2 });
    G.dot = K.path(sv, `M${cx + 8} ${cy} A8 8 0 1 1 ${cx - 8} ${cy} A8 8 0 1 1 ${cx + 8} ${cy}`, { stroke: C.ink, width: 1, fill: C.ink });
    // FINE sits outside the left end, COOKED outside the right end, HEATING UP over the top.
    G.labels = labels.map((txt, k) => {
      const L = K.el('div', 'colabel', box, txt);
      const a = [Math.PI * 0.82, Math.PI / 2, Math.PI * 0.18][k], rr = r + band / 2 + (k === 1 ? 30 : 22);
      K.css(L, { left: (cx + rr * Math.cos(a)) + 'px', top: (cy - rr * Math.sin(a)) + 'px' });
      gsap.set(L, { xPercent: [-100, -50, 0][k], yPercent: [-50, -100, -50][k] });
      return L;
    });
    G.note = K.el('div', 'conote', box, note);
    K.css(G.note, { left: cx + 'px', top: (cy + 52) + 'px' });
    gsap.set(G.note, { xPercent: -50 });
    const jr = K.rng(77);
    const noise = Array.from({ length: 64 }, () => jr() * 2 - 1);
    const wob = t => { const x = t * 9, i = Math.floor(x), f = x - i, a = noise[((i % 64) + 64) % 64], b = noise[(((i + 1) % 64) + 64) % 64]; return a + (b - a) * (f * f * (3 - 2 * f)); };
    K.frame(t => {
      const v = G.s.v, deg = (v - 0.5) * 180 + G.s.trem * wob(t) * 7;
      gsap.set(G.needle, { rotation: deg, svgOrigin: `${cx} ${cy}` });
      const zone = Math.min(2, Math.floor(K.clamp(v, 0, 0.999) * 3));
      G.labels.forEach((L, k) => { L.style.color = k === zone ? C.paper2 : '#6E6B66'; });
    });
    G.box = box;
    return G;
  };
  // Swing the needle to v at t, overshooting like a real meter.
  CO.needle = function (G, t, v, o = {}) {
    const { dur = 0.9, sfx = true } = o;
    K.tl.to(G.s, { v, duration: dur, ease: 'elastic.out(1, 0.42)' }, t);
    if (sfx) K.sfx('tick', t, 0.5, { tock: v < G._last });
    G._last = v;
  };
  CO.gaugeIn = function (G, t) {
    const { tl } = K;
    G.zones.forEach((z, k) => tl.fromTo(z, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power3.inOut', immediateRender: t > 0 }, t + k * 0.12));
    tl.fromTo(G.ticks, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: 0.012, immediateRender: t > 0 }, t + 0.1);
    tl.fromTo([G.needle, G.hub, G.dot], { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: t > 0 }, t + 0.3);
    tl.fromTo(G.labels.concat(G.note), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, immediateRender: t > 0 }, t + 0.35);
  };

  return CO;
})();
