const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const sizes = [[390,900,'mobile'],[820,1100,'tablet'],[1440,1000,'desktop']];
  for (const [w,h,name] of sizes) {
    const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:2 });
    await p.goto('http://localhost:3000', { waitUntil:'networkidle' });
    await p.locator('.ms-section').scrollIntoViewIfNeeded();
    await p.waitForTimeout(1500);
    await p.locator('.ms-section').screenshot({ path:`/tmp/ms-${name}.png` });
    console.log(name, 'ok');
    await p.close();
  }
  await b.close();
})();
