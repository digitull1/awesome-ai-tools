// Render an OffLadder motion piece to a 1080x1920, 30 fps H.264 MP4 with motion blur.
//
//   node render.cjs <piece> [options]
//
//   --fast            one sample per frame (no motion blur), for quick previews
//   --sub=N           a fixed number of motion-blur samples per frame (1, 2, 4, 8 or 16)
//                     (default: adaptive, from 1 on still frames to 16 on the fastest moves)
//   --pages=N         Chromium pages rendering in parallel (default 3)
//   --from=a --to=b   render only this stretch (seconds), without sound, for checking
//   --stills=a,b,c    only save PNG stills at these times (seconds)
//   --sheet[=step]    only save a contact sheet, one frame every `step` seconds (default 0.5)
//   --strip=a,b[,n]   only save a filmstrip of n frames between times a and b (for checking transitions)
//   --noaudio         skip the soundtrack
//
// Pieces live in ./pieces/<piece>.js and build one paused GSAP timeline with the kit in kit.js.
// Needs Playwright with Chromium, python3 with numpy, scipy and imageio-ffmpeg, and the brand
// fonts (../shorts/fetch-fonts.sh, or FONTS_DIR). Output goes to ./out.
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (_) { /* fall through */ }
  return require('/opt/node22/lib/node_modules/playwright');
}

const FPS = 30;
const FONTS = [
  ['Archivo Black', 'ArchivoBlack-Regular.ttf', 400, 'normal'],
  ['Hind', 'Hind-Regular.ttf', 400, 'normal'],
  ['Hind', 'Hind-Medium.ttf', 500, 'normal'],
  ['Hind', 'Hind-SemiBold.ttf', 600, 'normal'],
  ['Hind', 'Hind-Bold.ttf', 700, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic'],
];
const VENDOR = ['gsap.min.js', 'CustomEase.min.js', 'CustomWiggle.min.js', 'DrawSVGPlugin.min.js', 'MorphSVGPlugin.min.js'];

const args = process.argv.slice(2);
const opt = name => { const a = args.find(x => x === `--${name}` || x.startsWith(`--${name}=`)); return a == null ? null : (a.includes('=') ? a.split('=')[1] : true); };
const id = args.find(a => !a.startsWith('--'));
if (!id) { console.error('usage: node render.cjs <piece> [--fast] [--stills=..] [--sheet] [--strip=..]'); process.exit(1); }

const here = (...p) => path.resolve(__dirname, ...p);
const ffmpeg = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();

function buildHtml() {
  const fontsDir = process.env.FONTS_DIR || here('../shorts/fonts');
  const fontCss = FONTS.map(([fam, file, w, st]) =>
    `@font-face{font-family:'${fam}';src:url(data:font/ttf;base64,${fs.readFileSync(path.join(fontsDir, file)).toString('base64')}) format('truetype');font-weight:${w};font-style:${st};}`).join('\n');
  const vendor = VENDOR.map(f => fs.readFileSync(here('vendor', f), 'utf8')).join('\n;\n');
  // A series can share components: pieces/<prefix>-shared.js and .css are included when present.
  // A piece can name other series to borrow from with an "@shared a b" line (loaded in that order).
  const prefix = id.replace(/\d.*$/, '');
  const read = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
  const src = fs.readFileSync(here('pieces', `${id}.js`), 'utf8');
  const named = src.match(/@shared\s+([\w -]+)/);
  const shared = named ? named[1].trim().split(/\s+/) : [prefix];
  const piece = shared.map(p => read(here('pieces', `${p}-shared.js`))).join('\n;\n') + '\n;\n' + src;
  const pieceCss = shared.map(p => read(here('pieces', `${p}-shared.css`))).join('\n') + '\n' + read(here('pieces', `${id}.css`));
  // Function replacers, because minified code is full of `$` sequences that String.replace would expand.
  return fs.readFileSync(here('shell.html'), 'utf8')
    .replace('/*FONTS*/', () => fontCss).replace('/*PIECECSS*/', () => pieceCss)
    .replace('/*VENDOR*/', () => vendor).replace('/*KIT*/', () => fs.readFileSync(here('kit.js'), 'utf8'))
    .replace('/*PIECE*/', () => piece);
}

async function openPage(browser, html) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  await page.setContent(html, { waitUntil: 'load' });
  const meta = await page.evaluate(async () => {
    // Faces load lazily, so request each one before anything is measured.
    await Promise.all(['400 64px "Archivo Black"', '400 40px "Hind"', '500 40px "Hind"', '600 40px "Hind"', '700 40px "Hind"', 'italic 400 64px "Instrument Serif"']
      .map(f => document.fonts.load(f)));
    await document.fonts.ready;
    if (!document.fonts.check('64px "Archivo Black"') || !document.fonts.check('600 40px "Hind"')) throw new Error('brand fonts failed to load');
    window.build();
    window.seek(0, 0);
    return window.__meta();
  });
  if (errors.length) throw new Error(`page errors: ${errors.join(' | ')}`);
  const cdp = await page.context().newCDPSession(page);
  const grab = async (t, fi, format = 'jpeg') => {
    await page.evaluate(([t, fi]) => window.seek(t, fi), [t, fi]);
    const { data } = await cdp.send('Page.captureScreenshot', format === 'png' ? { format: 'png' } : { format: 'jpeg', quality: 93, optimizeForSpeed: true });
    return Buffer.from(data, 'base64');
  };
  return { page, meta, grab };
}

function run(cmd, argv, input) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, argv, { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
    p.on('close', c => (c === 0 ? res() : rej(new Error(`${path.basename(cmd)} exit ${c}`))));
    if (input) input(p.stdin);
  });
}

// Two-pass loudness: measure first, then normalise linearly to -14 LUFS (YouTube's reference).
function measureLoudness(wav) {
  const r = require('child_process').spawnSync(ffmpeg, ['-hide_banner', '-nostats', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const txt = r.stderr.slice(r.stderr.lastIndexOf('{'));
  const m = JSON.parse(txt.slice(0, txt.indexOf('}') + 1));
  return `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
}

(async () => {
  const html = buildHtml();
  const outDir = here('out');
  fs.mkdirSync(outDir, { recursive: true });
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--force-color-profile=srgb'] });
  const first = await openPage(browser, html);
  const { meta } = first;
  const dur = meta.duration;
  fs.writeFileSync(path.join(outDir, `${id}.meta.json`), JSON.stringify(meta, null, 1));

  const bad = await first.page.evaluate(() => window.__checks());
  if (bad.length) console.warn(`SAFE AREA ${id}:\n` + bad.map(b => `  ${b.t.toFixed(2)}s ${b.name}: ${b.box.join(',')}`).join('\n'));

  const stills = opt('stills'), sheet = opt('sheet'), strip = opt('strip');
  if (stills || sheet || strip) {
    const dir = path.join(outDir, id);
    fs.mkdirSync(dir, { recursive: true });
    if (stills) {
      for (const s of String(stills).split(',').map(Number)) {
        fs.writeFileSync(path.join(dir, `t${s.toFixed(2).padStart(5, '0')}.png`), await first.grab(s, Math.round(s * FPS), 'png'));
      }
      console.log(`stills -> ${dir}`);
    }
    for (const [kind, spec] of [['sheet', sheet], ['strip', strip]]) {
      if (!spec) continue;
      let times;
      if (kind === 'sheet') {
        const step = spec === true ? 0.5 : Number(spec);
        times = Array.from({ length: Math.floor(dur / step + 1e-6) + 1 }, (_, i) => +(i * step).toFixed(3)).filter(t => t < dur);
      } else {
        const [a, b, n = 12] = String(spec).split(',').map(Number);
        times = Array.from({ length: n }, (_, i) => +(a + (b - a) * i / (n - 1)).toFixed(3));
      }
      const tmp = fs.mkdtempSync(path.join(outDir, 'sheet-'));
      for (const [i, t] of times.entries()) {
        await first.page.evaluate(t => {
          let lab = document.getElementById('__t');
          if (!lab) { lab = document.createElement('div'); lab.id = '__t'; lab.style.cssText = 'position:absolute;left:0;top:0;z-index:99;background:#000;color:#0f0;font:bold 64px monospace;padding:6px 14px'; document.body.appendChild(lab); }
          lab.textContent = t.toFixed(2);
        }, t);
        fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`), await first.grab(t, Math.round(t * FPS)));
      }
      const cols = kind === 'sheet' ? 10 : Math.min(times.length, 6);
      const rows = Math.ceil(times.length / cols);
      const name = kind === 'sheet' ? 'sheet.png' : `strip-${String(spec).replace(/,/g, '_')}.png`;
      execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(tmp, 'f%04d.jpg'),
        '-vf', `scale=270:480:flags=lanczos,pad=274:484:2:2:white,tile=${cols}x${rows}`, '-frames:v', '1', path.join(dir, name)]);
      fs.rmSync(tmp, { recursive: true, force: true });
      await first.page.evaluate(() => document.getElementById('__t').remove());
      console.log(`${kind} (${times.length} frames) -> ${path.join(dir, name)}`);
    }
    await browser.close();
    return;
  }

  // Soundtrack from the same timeline as the picture.
  const metaPath = path.join(outDir, `${id}.meta.json`);
  const wav = path.join(outDir, `${id}.wav`);
  const noaudio = !!opt('noaudio');
  if (!noaudio) execFileSync('python3', [here('audio.py'), metaPath, wav], { stdio: 'inherit' });

  // Motion blur: a 180-degree shutter that opens on each frame's time, so a cut on a frame
  // boundary stays clean. Each frame gets 1-16 samples, picked from how far anything on screen
  // moves while the shutter is open; samples are repeated into 16 slots and averaged.
  const SLOTS = 16;
  const fixed = opt('fast') ? 1 : (opt('sub') ? Number(opt('sub')) : 0);
  if (fixed && SLOTS % fixed) throw new Error('--sub must be 1, 2, 4, 8 or 16');
  const nPages = Number(opt('pages') || 3);
  const from = opt('from') ? Math.round(Number(opt('from')) * FPS) : 0;
  const to = opt('to') ? Math.round(Number(opt('to')) * FPS) : Math.round(dur * FPS);
  const frames = to - from;
  const segment = from > 0 || to < Math.round(dur * FPS);
  const workers = [first];
  for (let k = 1; k < nPages; k++) workers.push(await openPage(browser, html));
  const shutter = 0.5 / FPS;
  const samplesFor = async (w, i) => {
    if (fixed) return fixed;
    const m = await w.page.evaluate(([a, b, fi]) => window.__motion(a, b, fi), [i / FPS, i / FPS + shutter, i]);
    return [1, 2, 4, 8, 16].find(n => m / n <= 4.5) || 16;
  };
  const stats = [0, 0, 0, 0, 0];

  const mp4 = path.join(outDir, segment ? `${id}-${from}-${to}.mp4` : `${id}.mp4`);
  const branches = Array.from({ length: SLOTS }, (_, k) => `[s${k}]select='eq(mod(n,${SLOTS}),${k})',setpts=N/(${FPS}*TB)[m${k}]`);
  const graph = [
    `[0:v]split=${SLOTS}${Array.from({ length: SLOTS }, (_, k) => `[s${k}]`).join('')}`,
    ...branches,
    `${Array.from({ length: SLOTS }, (_, k) => `[m${k}]`).join('')}mix=inputs=${SLOTS}[mx]`,
    '[mx]scale=in_color_matrix=bt601:in_range=pc:out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p[v]',
  ].join(';');
  const withAudio = !noaudio && !segment;
  const ffArgs = [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS * SLOTS), '-c:v', 'mjpeg', '-i', '-',
    ...(withAudio ? ['-i', wav] : []),
    '-filter_complex', graph, '-map', '[v]',
    ...(withAudio ? ['-map', '1:a', '-af', measureLoudness(wav), '-ar', '48000', '-c:a', 'aac', '-b:a', '256k'] : []),
    '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-tune', 'film',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-movflags', '+faststart', '-shortest', mp4,
  ];

  // Pages render interleaved frames; a single writer feeds ffmpeg in order.
  const t0 = Date.now();
  const done = new Map();
  const waiters = [];
  let next = 0;
  const WINDOW = 48;
  await run(ffmpeg, ffArgs, async stdin => {
    const write = buf => (stdin.write(buf) ? Promise.resolve() : new Promise(r => stdin.once('drain', r)));
    const flush = async () => {
      while (done.has(next)) {
        for (const b of done.get(next)) await write(b);
        done.delete(next); next++;
        if (next % 90 === 0) process.stdout.write(`  ${next}/${frames} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
      }
      while (waiters.length) waiters.shift()();
    };
    let flushing = Promise.resolve();
    await Promise.all(workers.map(async (w, p) => {
      for (let j = p; j < frames; j += workers.length) {
        while (j - next > WINDOW) await new Promise(r => waiters.push(r));
        const i = from + j;
        const n = await samplesFor(w, i);
        stats[Math.log2(n)]++;
        const bufs = [];
        for (let k = 0; k < n; k++) {
          const b = await w.grab(Math.min(i / FPS + ((k + 0.5) / n) * shutter, dur - 1e-4), i);
          for (let r = 0; r < SLOTS / n; r++) bufs.push(b);
        }
        done.set(j, bufs);
        flushing = flushing.then(flush);
      }
    }));
    await flushing;
    stdin.end();
  });
  await browser.close();
  const secs = (Date.now() - t0) / 1000;
  const shots = stats.reduce((a, c, k) => a + c * 2 ** k, 0);
  console.log(`rendered ${id}: ${frames} frames, ${shots} samples (per frame 1/2/4/8/16: ${stats.join('/')}) in ${secs.toFixed(0)}s -> ${mp4}`);
})().catch(e => { console.error(e); process.exit(1); });
