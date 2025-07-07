const express = require('express');
const { chromium } = require('playwright');
const app = express();
app.use(express.json());

app.post('/api/sim', async (req, res) => {
  const num = req.body.number?.trim();
  if (!num) return res.status(400).json({ error: 'Number required' });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.sims.ceo/');

  await page.fill('input[name="number"]', num);
  await page.click('button[type="submit"]');
  await page.waitForSelector('.results', { timeout: 5000 }).catch(() => {});
  const result = await page.$eval('.results', el => el.innerText).catch(() => null);
  await browser.close();

  if (result) res.json({ success: true, result });
  else res.json({ success: false, error: 'No data found' });
});
app.listen(3000, () => console.log('Running on port 3000'));
