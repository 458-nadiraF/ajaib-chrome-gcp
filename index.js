const express = require('express');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
  console.log('get called');
  const url = req.query.url || 'https://example.com';
  let browser = null;
  console.log('url:',url);
  const chromiumPath=await chromium.executablePath();
  console.log('path:',chromiumPath);
  try {
    browser = await puppeteer.launch({
      args: ["--disable-setuid-sandbox",
          "--no-sandbox",
          "--no-zygote",
          "--no-cache",
          "--single-process",
          "--disable-dev-shm-usage",
          "--disable-gpu"
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    console.log('already initialized browser');
    const page = await browser.newPage();
    console.log('make new page');
    await page.goto(url);
    const screenshot = await page.screenshot({ type: 'png' });
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (e) {
    console.log('error in get',e.toString())
    res.status(500).send(e.toString());
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(port, () => console.log('Server started on ' + port));
