const puppeteer = require('puppeteer');

(async () => {
    // Launch headless Chrome with a custom user profile
    const browser = await puppeteer.launch({
        headless: false, // Run in headless mode
        executablePath: '/Applications/Google \Chrome.app/Contents/MacOS/Google \Chrome', // Path to Chrome binary
        args: [
            `--user-data-dir=/Users/luqmanmiraj/Library/Application \Support/Google/Chrome/Default` // Path to the custom user profile directory
        ]
    });

    const page = await browser.newPage();

    // Go to the login page
    // await page.goto('https://example.com/login');
    await page.goto('https://remotedesktop.google.com/access', { waitUntil: 'networkidle2' })
    // await page.goto('https://remotedesktop.google.com/access', { waitUntil: 'networkidle2' })
    await page.$eval('input[name="identifier"]', (el, value) => el.value = value, 'bhaloob24');


    // Fill in the login form
    // await page.type('#username', 'your_username');
    // await page.type('#password', 'your_password');

    // Submit the login form
    // await page.click('#loginButton');

    // Wait for the login process to complete
    await page.waitForNavigation();

    // Take a screenshot of the logged-in page
    await page.screenshot({ path: 'logged-in.png' });

    // Close the browser
    // await browser.close();
})()