const { chromium } = require("playwright");
const { process } = require("process");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseUrl = process.env.WEB_APP_URL || "http://localhost:8080";

  const paths = ["/", "/projects", "/links"];

  for (const path of paths) {
    await page.goto(`${baseUrl}${path}`);
    await page.screenshot({
      path: `./screenshots/${path.replace(/\//g, "index")}.png`,
      fullPage: true,
    });
  }

  await browser.close();
})();
