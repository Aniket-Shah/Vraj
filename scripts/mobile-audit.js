/**
 * Mobile audit — boots the production build, walks the key routes at a phone
 * viewport, and reports horizontal overflow plus undersized tap targets.
 * Screenshots land in /tmp/vrajshots. Run: node scripts/mobile-audit.js
 */
const { chromium } = require('playwright');
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const OUT = '/tmp/vrajshots';
const PORT = 3123;
const base = `http://127.0.0.1:${PORT}`;

const routes = [
  ['home', '/'],
  ['catalog', '/chemicals'],
  ['category', '/chemicals/solvents'],
  ['product', '/chemicals/solvents/acetone'],
  ['rfq', '/request-quote'],
  ['contact', '/contact'],
  ['about', '/about'],
  ['privacy', '/privacy'],
  ['terms', '/terms']
];

function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      http.get(url, () => resolve()).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('server timeout'));
        else setTimeout(check, 500);
      });
    })();
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(), shell: true, stdio: 'ignore'
  });
  try {
    await waitForServer(base);
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const report = [];
    for (const [name, path] of routes) {
      const page = await ctx.newPage();
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const diag = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const cls = (el) => (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || ''));
        const offenders = [];
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (r.right > vw + 1 || r.left < -1) {
            const p = el.parentElement;
            const pr = p ? p.getBoundingClientRect() : null;
            if (!pr || (pr.right <= vw + 1 && pr.left >= -1)) {
              offenders.push(`${el.tagName.toLowerCase()}.${cls(el).slice(0, 90)} [left=${Math.round(r.left)} right=${Math.round(r.right)} w=${Math.round(r.width)}]`);
            }
          }
        });
        const small = [];
        document.querySelectorAll('a,button,input,select,textarea,[role="button"]').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.height < 40) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        });
        return {
          vw,
          scrollWidth: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth > vw + 1,
          offenders: [...new Set(offenders)].slice(0, 12),
          small: [...new Set(small)].slice(0, 14)
        };
      });
      report.push({ name, path, ...diag });
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
      await page.close();
    }
    fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  } finally {
    server.kill();
    spawn('bash', ['-c', `fuser -k ${PORT}/tcp 2>/dev/null || true`]);
  }
  process.exit(0);
})();
