import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:3000/fuer-eltern/kindertagespflege');
await page.waitForTimeout(3000);

const result = await page.evaluate(() => {
  const img = document.querySelector('img[src*="kinderwagen"]');
  if (!img) return 'Bild nicht gefunden';
  const rect = img.getBoundingClientRect();
  return {
    display: { w: Math.round(rect.width), h: Math.round(rect.height) },
    natural: { w: img.naturalWidth, h: img.naturalHeight },
    currentSrc: img.currentSrc.split('?')[1]
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
