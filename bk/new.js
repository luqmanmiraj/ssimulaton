const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage()
    await page.goto('https://remotedesktop.google.com/access', { waitUntil: 'networkidle2' })
    await page.$eval('input[name="identifier"]', (el, value) => el.value = value, 'bhaloob24');
    // await page.waitForSelector('.AjY5Oe', { visible: true });

    // // Click the button
    await page.click('#identifierNext');
    await page.waitForNavigation();
    // await page.$eval('input[name="Passwd"]', (el, value) => el.value = value, '123Pakistan@');
    // await page.click('#passwordNext');
    await page.waitForTimeout(5000)
    await page.$eval('input[name="Passwd"]', (el, value) => el.value = value, '123Pakistan@');
    await page.click('#passwordNext');
    let source = await page.content({ "waitUntil": "domcontentloaded" });
    console.log(source)
    await page.waitForTimeout(500000)
    await page.screenshot({ path: 'testresult.png', fullPage: true })
    await browser.close()
    console.log(`All done, check the screenshot. ✨`)
})