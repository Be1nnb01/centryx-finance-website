const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 15000 });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  // Full page screenshot
  await page.screenshot({
    path: path.resolve(__dirname, 'temp_screenshots/full-page.png'),
    fullPage: true
  });

  // Hero viewport screenshot
  await page.screenshot({
    path: path.resolve(__dirname, 'temp_screenshots/hero-viewport.png'),
    fullPage: false
  });

  // Scroll sections
  const sections = [
    { name: 'mid-page', y: 1200 },
    { name: 'products', y: 2400 },
    { name: 'form-section', y: 4000 },
  ];

  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo(0, y), s.y);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.resolve(__dirname, `temp_screenshots/${s.name}.png`),
      fullPage: false
    });
  }

  await browser.close();
  console.log('Screenshots saved to temp_screenshots/');
})();
