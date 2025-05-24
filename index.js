const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

app.get('/', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://www.example.com');
    const title = await page.title();

    res.status(200).send(`Page Title: ${title}`);
  } catch (error) {
    console.error('Error launching Puppeteer:', error);
    res.status(500).send('Error launching Puppeteer');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const port = process.env.PORT || 8080;  // Default to 8080 if not set in .env file
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
