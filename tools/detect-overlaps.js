const { chromium } = require('playwright');
const express = require('express');
const path = require('path');

(async () => {
  // Spin up a lightweight static server on a random available port
  const app = express();
  const publicDir = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDir));

  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  const serverUrl = `http://localhost:${port}/`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(serverUrl, { waitUntil: 'networkidle' });
  // Allow animations/layout to settle
  await page.waitForTimeout(5000);

  const overlaps = await page.evaluate(() => {
    const toRect = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        right: r.right,
        bottom: r.bottom,
        area: r.width * r.height,
      };
    };

    const intersects = (a, b) => {
      const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.x, b.x));
      const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y));
      const area = xOverlap * yOverlap;
      return { area, xOverlap, yOverlap };
    };

    const cssPath = (el) => {
      if (!el || el.nodeType !== 1) return '';
      const parts = [];
      while (el && el.nodeType === 1 && el !== document.documentElement) {
        const name = el.nodeName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().replace(/\s+/g, '.')
          : '';
        parts.unshift(`${name}${id}${cls}`);
        el = el.parentElement;
      }
      return parts.join(' > ');
    };

    const images = Array.from(document.querySelectorAll('img')).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    const textCandidates = Array.from(
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span')
    ).filter((el) => {
      const text = el.innerText || '';
      const r = el.getBoundingClientRect();
      const area = r.width * r.height;
      const tooBig = area > 500000; // filter out huge wrappers like main containers
      const containsImage = el.querySelector('img') !== null;
      return text.trim().length > 0 && r.width > 0 && r.height > 0 && !tooBig && !containsImage;
    });

    const collisions = [];
    const MIN_AREA = 100; // px^2 to ignore tiny overlaps

    images.forEach((img) => {
      const ir = toRect(img);
      textCandidates.forEach((txt) => {
        // Skip if text element is inside the image container
        if (img.contains(txt) || txt.contains(img)) return;
        const tr = toRect(txt);
        const { area, xOverlap, yOverlap } = intersects(ir, tr);
        if (area > MIN_AREA) {
          const overlapRatio = area / Math.min(ir.area || 1, tr.area || 1);
          collisions.push({
            image: cssPath(img),
            text: cssPath(txt),
            overlapArea: Math.round(area),
            overlapRatio: Number(overlapRatio.toFixed(3)),
            imageBox: { x: Math.round(ir.x), y: Math.round(ir.y), w: Math.round(ir.w), h: Math.round(ir.h) },
            textBox: { x: Math.round(tr.x), y: Math.round(tr.y), w: Math.round(tr.w), h: Math.round(tr.h) },
            xOverlap: Math.round(xOverlap),
            yOverlap: Math.round(yOverlap),
          });
        }
      });
    });

    return collisions;
  });

  console.log(JSON.stringify(overlaps, null, 2));
  await browser.close();
  server.close();
})();
