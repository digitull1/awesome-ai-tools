// Render OffLadder text-led Shorts to 1080x1920 H.264 MP4s.
//
//   node render.cjs [--stills] [id ...]
//
// Needs: Playwright with Chromium, python3 with numpy and imageio-ffmpeg
// (pip install numpy imageio-ffmpeg), and the brand fonts in ./fonts
// (run ./fetch-fonts.sh). Output goes to ./out.
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (_) { /* fall through */ }
  return require('/opt/node22/lib/node_modules/playwright');
}

const FONTS = [
  ['Archivo Black', 'ArchivoBlack-Regular.ttf', 400, 'normal'],
  ['Hind', 'Hind-Regular.ttf', 400, 'normal'],
  ['Hind', 'Hind-Medium.ttf', 500, 'normal'],
  ['Hind', 'Hind-SemiBold.ttf', 600, 'normal'],
  ['Hind', 'Hind-Bold.ttf', 700, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic'],
];

(async () => {
  const args = process.argv.slice(2);
  const stills = args.includes('--stills');
  const specs = (await import(path.resolve(__dirname, 'specs.mjs'))).default;
  const ids = args.filter(a => !a.startsWith('--'));
  const todo = ids.length ? ids : Object.keys(specs);

  const fontsDir = process.env.FONTS_DIR || path.resolve(__dirname, 'fonts');
  const fontCss = FONTS.map(([fam, file, w, st]) =>
    `@font-face{font-family:'${fam}';src:url(data:font/ttf;base64,${fs.readFileSync(path.join(fontsDir, file)).toString('base64')}) format('truetype');font-weight:${w};font-style:${st};}`
  ).join('\n');
  const tpl = fs.readFileSync(path.resolve(__dirname, 'engine.html'), 'utf8');
  const outDir = path.resolve(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const ffmpeg = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });

  for (const id of todo) {
    const spec = specs[id];
    if (!spec) throw new Error(`no spec ${id}`);
    const html = tpl.replace('/*FONTS*/', fontCss).replace('/*SPEC*/', `window.SPEC=${JSON.stringify(spec)};`);
    await page.setContent(html, { waitUntil: 'load' });
    const info = await page.evaluate(async () => {
      // Faces load lazily, so request each one before measuring anything.
      await Promise.all(['400 64px "Archivo Black"', '400 40px "Hind"', '500 40px "Hind"', '600 40px "Hind"', '700 40px "Hind"']
        .map(f => document.fonts.load(f)));
      await document.fonts.ready;
      const ok = document.fonts.check('64px "Archivo Black"') && document.fonts.check('600 40px "Hind"');
      return { ok, built: window.build(), report: window.report() };
    });
    if (!info.ok) throw new Error('brand fonts failed to load');
    const over = info.report.filter(r => r.overflow === 'yes');
    if (over.length) throw new Error(`${id}: scenes overflow the safe area: ${JSON.stringify(over)}`);

    if (stills) {
      // One still per scene, taken once every block in it has landed.
      const dir = path.join(outDir, 'stills', id);
      fs.mkdirSync(dir, { recursive: true });
      for (const [i, sc] of spec.scenes.entries()) {
        const last = Math.max(...sc.blocks.map(b => b.in));
        const t = Math.min(sc.out - 0.05, last + 0.45);
        await page.evaluate(t => window.seek(t), t);
        await page.screenshot({ path: path.join(dir, `scene-${String(i).padStart(2, '0')}.png`) });
      }
      await page.evaluate(() => window.seek(0));
      await page.screenshot({ path: path.join(dir, 'first-frame.png') });
      console.log(`stills ${id}: ${spec.scenes.length + 1} images`);
      continue;
    }

    const specPath = path.join(outDir, `${id}.json`);
    fs.writeFileSync(specPath, JSON.stringify(spec));
    const wav = path.join(outDir, `${id}.wav`);
    execFileSync('python3', [path.resolve(__dirname, 'audio.py'), specPath, wav], { stdio: 'inherit' });

    const fps = 30;
    const frames = Math.round(spec.duration * fps);
    const mp4 = path.join(outDir, `${id}.mp4`);
    const ff = spawn(ffmpeg, [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-i', wav, '-map', '0:v', '-map', '1:a',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps),
      // Normalise to YouTube's loudness reference so every Short plays at the same volume.
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000',
      '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < frames; i++) {
      await page.evaluate(t => window.seek(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`)))));
    console.log(`rendered ${id}: ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${mp4}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
