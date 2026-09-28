/* Social #2 · The AI tier list: 15 jobs, tiered by Microsoft's data. Where's yours?
 * @shared ai co so
 *
 * Tiers are rank bands in Microsoft Research's AI applicability data (785 US jobs, data v1.1):
 * S = the paper's top 40, A = 41-157 (top 20%), B = 158-393 (top half), C = 394-628, D = 629-785 (bottom 20%).
 * The claim on screen is overlap with what people use AI for, never risk: "S isn't doomed. D isn't safe."
 *
 *  0.0  AI TIER LIST: WHERE'S YOURS? over the empty board.
 *  2.2  Fifteen jobs, one at a time, in an order that keeps you guessing: each appears, shows its rank,
 *       and slams into its tier.
 * 18.2  S isn't doomed. D isn't safe. It's overlap with AI, not a forecast.
 * 21.4  Whatever your tier, test the work next to yours. OffLadder finds it in 3 questions.
 * 24.0  End card: comment a job for part 2; send this to someone in S tier.
 * 29.6  Ladder wipe back to the first frame.
 */
window.build = function () {
  const { C, tl } = K;
  K.init({ duration: 30, bg: C.ink, chip: 'AI tier list', theme: 'dark', grain: 0.05, safe: 'social' });

  const TIERS = [
    ['S', 'TOP 40', '#FFDEC7', C.ink], ['A', 'TOP 20%', C.orange, C.ink], ['B', 'TOP HALF', '#C23D04', C.paper2],
    ['C', 'LOWER HALF', '#7A2A0A', C.paper2], ['D', 'BOTTOM 20%', '#3A2A22', C.paper2],
  ];
  // [name lines, icon, rank, tier] in the order they're placed.
  const JOBS = [
    [['SOFTWARE', 'DEVELOPERS'], 'code', 120, 1], [['NURSES'], 'cross', 460, 3], [['WRITERS'], 'pen', 3, 0],
    [['LAWYERS'], 'scales', 286, 2], [['ROOFERS'], 'roof', 770, 4], [['CUSTOMER', 'SERVICE'], 'headset', 7, 0],
    [['CEOS'], 'tie', 361, 2], [['CASHIERS'], 'receipt', 97, 1], [['DENTISTS'], 'tooth', 705, 4],
    [['MARKETERS'], 'megaphone', 26, 0], [['MUSICIANS'], 'note', 569, 3], [['PHARMACISTS'], 'pill', 119, 1],
    [['GRAPHIC', 'DESIGNERS'], 'bezier', 196, 2], [['PLUMBERS'], 'wrench', 613, 3], [['HAIRDRESSERS'], 'scissors', 634, 4],
  ];
  const BX = 80, BY = 604, RH = 124, GAP = 5, LW = 150, TW = 214, TH = 108;
  const rowY = r => BY + r * (RH + GAP);
  const slot = (r, k) => ({ x: BX + LW + 12 + k * (TW + 8), y: rowY(r) + (RH - TH) / 2 });

  // ---------------------------------------------------------------- the board (also the loop's last frame)
  function board(parent) {
    const rows = TIERS.map(([L, key, bg, fg], r) => {
      const row = K.el('div', 'tlrow', parent, `<div class="lab" style="background:${bg};color:${fg}"><b>${L}</b><i>${key}</i></div>`);
      K.css(row, { left: BX + 'px', top: rowY(r) + 'px', width: '812px', height: RH + 'px' });
      return row;
    });
    const lab = K.lines(parent, { lines: ['MICROSOFT RESEARCH DATA · 2025'], x: 82, y: 350, size: 30, color: C.orange, track: 0.06 });
    const title = K.lines(parent, { lines: ['AI TIER LIST:', 'WHERE’S YOURS?'], x: 80, y: 394, size: 86, lh: 0.94, color: C.paper });
    K.fit(title, 812);
    title.lines[1].words.forEach(w => { w.style.color = C.orange; });
    return { rows, lab, title };
  }
  const sB = K.scene(0, 21.5);
  const B = board(sB);
  K.check(B.lab.box, 0.5, 'label'); K.check(B.title.box, 0.5, 'title');
  B.rows.forEach(r => K.check(r.querySelector('.lab'), 0.5, 'tier label'));
  K.drift(0, 2.0, { from: 1, to: 1.012 });
  K.camSet(2.0, { scale: 1, x: 0, y: 0 });
  // The tiers pulse top to bottom while you read the hook.
  B.rows.forEach((row, r) => {
    tl.fromTo(row.querySelector('.lab'), { scale: 1 }, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, 0.5 + r * 0.14);
    K.sfx('tick', 0.5 + r * 0.14, 0.35, { tock: r % 2 === 1 });
  });
  K.unreveal(B.lab, 1.9, { stagger: 0.01 });
  K.unreveal(B.title, 1.9, { stagger: 0.02 });
  const key = K.el('div', 'src', sB, 'Tier = rank of 785 jobs by AI overlap');
  K.css(key, { left: '82px', top: '560px', color: '#9A968F' });
  tl.fromTo(key, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.2);

  // ---------------------------------------------------------------- the jobs, one by one
  const filled = [0, 0, 0, 0, 0];
  JOBS.forEach(([lines, icon, rank, tier], i) => {
    const t = 2.3 + i * (i < 5 ? 1.12 : 1.02);
    // The candidate, big, with its rank.
    const cand = K.el('div', 'tlcand', sB, `<div class="nm">${lines.join('<br>')}</div><div class="rk">#${rank} <span>OF 785</span></div>`);
    K.css(cand, { left: '160px', top: '336px' });
    const ci = SO.icon(cand, icon, { x: 28, y: 36, size: 128, width: 7, color: C.ink });
    // The tile it becomes on the board.
    const k = filled[tier]++;
    const pos = slot(tier, k);
    const tile = K.el('div', 'tltile', sB, `<div class="nm">${lines.join('<br>')}</div><div class="rk">#${rank}</div>`);
    K.css(tile, { left: pos.x + 'px', top: pos.y + 'px' });
    SO.icon(tile, icon, { x: 8, y: 24, size: 58, width: 8, color: C.ink });
    gsap.set(tile, { autoAlpha: 0 });
    const nm = tile.querySelector('.nm');
    if (nm.scrollWidth > TW - 86) nm.style.fontSize = (22 * (TW - 86) / nm.scrollWidth).toFixed(1) + 'px';
    tl.fromTo(cand, { scale: 0.5, autoAlpha: 0, rotation: -4 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.28, ease: 'back.out(2)' }, t);
    SO.draw(ci, t + 0.02, 0.3);
    K.sfx('pop', t, 0.5, { note: (i * 3) % 10 });
    // Fly into the slot: the candidate shrinks towards the tile, then the tile lands.
    const land = t + 0.62;
    const cx = 160 + 350, cy = 336 + 100;
    tl.to(cand, { x: pos.x + TW / 2 - cx, y: pos.y + TH / 2 - cy, scale: 0.3, autoAlpha: 0.2, duration: 0.3, ease: 'power3.in' }, land - 0.3);
    tl.set(cand, { autoAlpha: 0 }, land);
    tl.set(tile, { autoAlpha: 1 }, land);
    tl.fromTo(tile, { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'back.out(2.6)', immediateRender: false }, land);
    const lb = B.rows[tier].querySelector('.lab');
    tl.fromTo(lb, { filter: 'brightness(1.6)' }, { filter: 'brightness(1)', duration: 0.35, immediateRender: false }, land);
    K.sfx('thud', land, 0.55);
    K.sfx('flap', land + 0.01, 0.8);
    tl.fromTo(K.shaker, { y: 0 }, { y: 7, duration: 0.06, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, land);
    K.check(cand, t + 0.3, 'candidate ' + lines.join(' '));
  });
  tl.to(key, { autoAlpha: 0, duration: 0.2 }, 18.0);

  // ---------------------------------------------------------------- the twist
  const sT = K.scene(18.1, 21.5);
  const scrim = K.el('div', 'layer', sT);
  K.css(scrim, { background: C.ink });
  tl.fromTo(scrim, { opacity: 0 }, { opacity: 0.9, duration: 0.35 }, 18.15);
  const m1 = K.marks(sT, { lines: ['S ISN’T DOOMED.'], x: 80, y: 420, size: 84 });
  const m2 = K.marks(sT, { lines: ['D ISN’T SAFE.'], x: 80, y: 560, size: 84, bg: C.paper2, shadow: C.orange });
  K.markIn(m1, 18.3); K.markIn(m2, 18.9, { sfx: null });
  K.sfx('impact', 18.3, 0.5, { big: 0.5 }); K.sfx('thud', 18.9, 0.6);
  const tw = K.lines(sT, { lines: ['It’s overlap with AI,', 'not a forecast.'], font: 'serif', size: 84, lh: 1.02, x: 82, y: 740, color: C.paper });
  K.fit(tw, 808);
  K.reveal(tw, 19.5, { stagger: 0.04, dur: 0.55, from: 135 });
  [m1, m2].forEach(M => K.check(M.box, 21.0, 'twist mark')); K.check(tw.box, 21.0, 'not a forecast');

  // ---------------------------------------------------------------- OffLadder
  K.ladder(21.5, { colors: [C.orange, C.paper2], bars: 8 });
  K.bg(C.paper, 21.5); K.theme('light', 21.5); K.camSet(21.5, { scale: 1, x: 0, y: 0 });
  const sO = K.scene(21.5, 24.1);
  const o1 = K.lines(sO, { lines: ['WHATEVER YOUR TIER,'], x: 80, y: 380, size: 74, color: C.ink });
  K.fit(o1, 812);
  K.reveal(o1, 21.6, { stagger: 0.03 });
  const o2 = K.lines(sO, { lines: ['test the work', 'next to yours.'], font: 'serif', size: 120, lh: 0.98, x: 76, y: 470, color: C.orange });
  K.fit(o2, 812);
  K.reveal(o2, 22.0, { stagger: 0.04, dur: 0.6, from: 135 });
  const oi = K.ident(sO, { x: 80, y: 800, size: 118, color: C.ink });
  K.identIn(oi, 22.5);
  const o3 = K.lines(sO, { lines: ['OffLadder finds it in 3 questions,', 'then adapts to what you try.'], font: 'serif', size: 56, lh: 1.04, x: 216, y: 806, color: C.ink });
  K.fit(o3, 676);
  K.reveal(o3, 22.7, { stagger: 0.025, dur: 0.5, from: 135 });
  [o1, o2, o3].forEach(T => K.check(T.box, 23.8, 'offladder'));
  tl.fromTo(K.cam, { scale: 1 }, { scale: 1.015, duration: 2.5, ease: 'none', immediateRender: false }, 21.5);

  // ---------------------------------------------------------------- end card and loop
  SO.end(24.0, 29.62, { ask: ['COMMENT A JOB', 'FOR PART 2.'], send: ['Send this to', 'someone in S tier.'], note: 'Tier = rank of 785 in Microsoft’s data.' });
  AI.loop(29.62, C.ink, 'dark', p => board(p));

  // ---------------------------------------------------------------- score (beat, E minor)
  K.music = {
    bpm: 120, style: 'beat',
    bars: [
      { chord: 'Em', drums: 'intro', pad: 0.9, arp: 'up', arpgain: 0.5, lp: [0.5, 0.9] },   //  0 the board
      { chord: 'C', drums: 'trap', bass: 1, pad: 1, arp: 'up', hit: true },                //  2 first job
      { chord: 'G', drums: 'trap', bass: 1, pad: 1, arp: 'up' },
      { chord: 'D', drums: 'trap', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Em', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                        //  8
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'G', drums: 'trap', bass: 1, pad: 1, arp: 'up', hit: true },                // 12
      { chord: 'D', drums: 'trap', bass: 1, pad: 1, arp: 'up' },
      { chord: 'Em', drums: 'build', bass: 1, pad: 1, arp: 'up' },                         // 16
      { chord: 'C', drums: 'half', bass: 0.8, pad: 1, lp: 0.8, hit: true },                // 18 the twist
      { chord: 'G', drums: 'build', bass: 1, pad: 1, arp: 'up' },                          // 20
      { chord: 'D', drums: 'bounce', bass: 1, pad: 1, arp: 'up', hit: true },              // 22 offladder
      { chord: 'Em', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },                        // 24 end card
      { chord: 'C', drums: 'bounce', bass: 1, pad: 1, arp: 'up' },
      { chord: 'D', drums: 'bounce', bass: 1, pad: 1, arp: 'down', lp: [1, 0.45] },        // 28 into the loop
    ],
    risers: [[16.0, 18.0, 0.8], [20.0, 22.0, 0.5]],
    rolls: [[17.0, 18.0]],
  };
};
