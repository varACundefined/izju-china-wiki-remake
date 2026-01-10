const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const url = 'http://localhost:7001/pages/3Wet%20Lab/parts.html';
  await page.goto(url, { waitUntil: 'networkidle' });

  // Scroll to bottom to reproduce overlay near footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);

  const probes = await page.evaluate(() => {
    const points = [
      { label: 'bottom-right', x: window.innerWidth - 12, y: window.innerHeight - 12 },
      { label: 'bottom-right-80', x: window.innerWidth - 12, y: window.innerHeight - 80 },
      { label: 'bottom-right-160', x: window.innerWidth - 12, y: window.innerHeight - 160 },
      { label: 'center-right', x: window.innerWidth - 12, y: window.innerHeight / 2 },
    ];

    return points.map(p => {
      const el = document.elementFromPoint(p.x, p.y);
      const style = el ? getComputedStyle(el) : null;
      return {
        label: p.label,
        point: { x: p.x, y: p.y },
        tag: el ? el.tagName : null,
        id: el ? el.id : null,
        className: el ? el.className : null,
        zIndex: style ? style.zIndex : null,
        position: style ? style.position : null,
        background: style ? style.background : null,
      };
    });
  });

  console.log(JSON.stringify({ probes }, null, 2));

  await page.screenshot({ path: 'tmp_parts.png', fullPage: true });
  await browser.close();
})();
