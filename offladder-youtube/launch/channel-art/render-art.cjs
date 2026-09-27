// Render OffLadder channel art: banner (2560x1440) and profile picture (800x800).
//   FONTS_DIR=../shorts/fonts node render-art.cjs
const fs = require('fs');
const path = require('path');
function loadPlaywright() { try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } }
const fontsDir = process.env.FONTS_DIR || path.resolve(__dirname, '../shorts/fonts');
const face = (fam, file, w, st) => `@font-face{font-family:'${fam}';src:url(data:font/ttf;base64,${fs.readFileSync(path.join(fontsDir, file)).toString('base64')}) format('truetype');font-weight:${w};font-style:${st};}`;
const FONTS = [face('Archivo Black', 'ArchivoBlack-Regular.ttf', 400, 'normal'), face('Hind', 'Hind-SemiBold.ttf', 600, 'normal'), face('Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic')].join('\n');
// OffLadder's logo mark, as served inline on offladder.com.
const MARK = '<svg viewBox="0 -4 100 108" role="img" aria-label="OffLadder"><path d="M30.5 69.85 A34 34 0 1 1 69.5 69.85" fill="none" stroke="currentColor" stroke-width="20"></path><path d="M41 76h18l3.5 6h-25z" fill="currentColor"></path><path d="M36.5 85h27l4 6.5h-35z" fill="currentColor"></path><path d="M31 94.5h38l4.5 6.5h-47z" fill="currentColor"></path></svg>';
const BASE = `:root{--o:#FA5608;--i:#0C0C0C;--p:#F4F2EE;--p2:#FBFAF7;--m:#54524F}*{margin:0;padding:0;box-sizing:border-box}body{background:var(--p);color:var(--i);-webkit-font-smoothing:antialiased}`;

const banner = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}${BASE}
body{width:2560px;height:1440px;position:relative;overflow:hidden}
/* Everything that must survive on phones sits inside YouTube's 1546x423 safe area. */
.safe{position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;flex-direction:column;justify-content:center;padding:0 40px}
.voice{font-family:'Instrument Serif';font-style:italic;font-size:64px;line-height:1;color:var(--o);margin-bottom:16px;white-space:nowrap}
.h{font-family:'Archivo Black';font-size:104px;line-height:1.04;text-transform:uppercase;letter-spacing:-.01em;white-space:nowrap}
.box{display:inline-block;background:var(--o);border:7px solid var(--i);box-shadow:12px 12px 0 var(--i);padding:4px 20px 0;margin-top:10px;line-height:1}
.band{position:absolute;top:508px;height:423px;display:flex;flex-direction:column;justify-content:center;gap:24px}
.band.l{left:70px;width:400px;align-items:flex-start}.band.r{right:70px;width:420px;align-items:flex-end}
.stamp{font-family:'Archivo Black';text-transform:uppercase;color:var(--o);border:8px solid var(--o);padding:10px 20px 4px;font-size:42px;line-height:1;background:var(--p2);white-space:nowrap}
.url{font-family:'Archivo Black';font-size:44px;background:var(--i);color:var(--p);padding:16px 24px 12px;box-shadow:10px 10px 0 var(--o);white-space:nowrap}
.sub{font-family:'Hind';font-weight:600;font-size:30px;color:var(--m);white-space:nowrap;margin-top:6px}
</style></head><body>
<div class="band l">
  <div class="stamp" style="transform:rotate(-6deg)">More</div>
  <div class="stamp" style="transform:rotate(3deg);margin-left:44px">Variant</div>
  <div class="stamp" style="transform:rotate(-3deg);margin-left:8px">Off the table</div>
</div>
<div class="safe">
  <div class="voice">Don’t pick your future. Test it.</div>
  <div class="h">Try careers before</div>
  <div class="h">you <span class="box">choose one.</span></div>
</div>
<div class="band r">
  <div class="url">offladder.com</div>
  <div class="sub">3 questions · free · no account</div>
</div>
<script>
  // Fail loudly if anything in the safe area would be cropped on a phone.
  const r = document.querySelector('.safe').getBoundingClientRect();
  window.__overflow = [...document.querySelectorAll('.safe *')].some(e => { const b = e.getBoundingClientRect(); return b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.top < r.top - 1; });
</script>
</body></html>`;

const avatar = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
body{width:800px;height:800px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.mark{width:470px;height:508px;color:var(--o);margin-top:4px}.mark svg{width:100%;height:100%}
</style></head><body><div class="mark">${MARK}</div></body></html>`;

(async () => {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const jobs = [['banner-2560x1440.png', banner, 2560, 1440], ['profile-800x800.png', avatar, 800, 800]];
  for (const [name, html, w, h] of jobs) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(async () => { await Promise.all(['400 60px "Archivo Black"', '600 30px "Hind"', 'italic 60px "Instrument Serif"'].map(f => document.fonts.load(f))); await document.fonts.ready; });
    if (await page.evaluate(() => window.__overflow === true)) throw new Error(name + ': content leaves the mobile safe area');
    await page.screenshot({ path: path.join(__dirname, name) });
    await page.close();
    console.log('wrote', name);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
