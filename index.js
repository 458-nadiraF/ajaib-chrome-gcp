const express = require('express');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
  const url = req.query.url || 'https://example.com';
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ type: 'png' });
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (e) {
    res.status(500).send(e.toString());
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(port, () => console.log('Server started on ' + port));
