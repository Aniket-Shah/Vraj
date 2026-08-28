const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
    }
    check();
  });
}

async function main() {
  const outputDir = '/mnt/c/Users/shaha/.gemini/antigravity-ide/brain/2ebd8210-bd38-4f79-9dfd-70fe026b6273';
  const PORT = 3099;
  const baseUrl = `http://127.0.0.1:${PORT}`;

  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: '/var/www/html/MyClients/Vraj',
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(baseUrl, 20000);
    console.log('Server is up and responding on port 3099!');
  } catch (err) {
    console.error('Server startup error:', err.message);
    try { server.kill(); } catch (e) {}
    process.exit(1);
  }

  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({
    executablePath: '/home/aniketshah24/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const routes = [
    {
      name: 'homepage',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/homepage_vraj_chem_impex_chemical/code.html',
      appUrl: `${baseUrl}/`
    },
    {
      name: 'categories',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/chemical_categories_vraj_chem_impex/code.html',
      appUrl: `${baseUrl}/chemicals`
    },
    {
      name: 'solvents_listing',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/solvents_listing_vraj_chem_impex/code.html',
      appUrl: `${baseUrl}/chemicals/solvents`
    },
    {
      name: 'product_details',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/product_details_acetone_vraj_chem_impex/code.html',
      appUrl: `${baseUrl}/chemicals/solvents/acetone`
    },
    {
      name: 'rfq_form',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/b2b_rfq_vraj_chem_impex_chemical/code.html',
      appUrl: `${baseUrl}/request-quote`
    },
    {
      name: 'contact_us',
      stitchHtml: 'file:///var/www/html/MyClients/Vraj/stitch_vraj_chem_pharma_platform/contact_us_vraj_chem_impex_chemical/code.html',
      appUrl: `${baseUrl}/contact`
    }
  ];

  for (const r of routes) {
    console.log(`[Playwright] Capturing ${r.name}...`);
    
    // Target Stitch design
    try {
      const page1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page1.goto(r.stitchHtml, { waitUntil: 'load', timeout: 15000 });
      const targetPath = path.join(outputDir, `target_${r.name}.png`);
      await page1.screenshot({ path: targetPath, fullPage: true });
      console.log(`  -> Saved target_${r.name}.png`);
      await page1.close();
    } catch (e) {
      console.error(`  -> Failed target_${r.name}:`, e.message);
    }

    // Created Next.js App page
    try {
      const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page2.goto(r.appUrl, { waitUntil: 'load', timeout: 15000 });
      const createdPath = path.join(outputDir, `created_${r.name}.png`);
      await page2.screenshot({ path: createdPath, fullPage: true });
      console.log(`  -> Saved created_${r.name}.png`);
      await page2.close();
    } catch (e) {
      console.error(`  -> Failed created_${r.name}:`, e.message);
    }
  }

  await browser.close();
  try { server.kill(); } catch (e) {}
  console.log('[Playwright] Comparison captures completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('[Playwright Error]:', err);
  process.exit(1);
});
