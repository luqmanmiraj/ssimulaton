const express = require("express");
const puppeteer = require("puppeteer");
const PuppeteerMassScreenshots = require("./screen.shooter");
const app = express();
const PORT = 4000;




const puppeteer1 = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer1.use(StealthPlugin())




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
//New imports
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("browse", async ({ url }) => {
        const browser = await puppeteer1.launch({
            headless: false,
        });
        //👇🏻 creates an incognito browser context
        const context = await browser.createIncognitoBrowserContext();
        //👇🏻 creates a new page in a pristine context.
        const page = await context.newPage();
        await page.setViewport({
            width: 1255,
            height: 800
        });
        //👇🏻 Fetches the web page
        await page.goto(url);
        //👇🏻 Instance of PuppeteerMassScreenshots takes the screenshots
        await page.waitForTimeout(2000)
        await page.evaluate(() => {
            window.scrollTo(0, 100);
        });
        const screenshots = new PuppeteerMassScreenshots();
        await screenshots.init(page, socket);
        await screenshots.start();

        socket.on("scroll", ({ position }) => {
            //scrolls the page
            page.evaluate((top) => {
                window.scrollTo({ top });
            }, position);
        });

    });
    socket.on("browseBard", async ({ url }) => {


        puppeteer1.launch({ headless: false }).then(async browser => {
            console.log('Running tests..')
            const page = await browser.newPage()
            await page.setViewport({
                width: 1255,
                height: 800,
            });
            await page.goto('https://remotedesktop.google.com/access', { waitUntil: 'networkidle2' })
            await page.$eval('input[name="identifier"]', (el, value) => el.value = value, 'bhaloob24');
            // await page.waitForSelector('.AjY5Oe', { visible: true });

            // // Click the button
            await page.click('#identifierNext');
            await page.waitForNavigation();
            await page.waitForTimeout(5000)

            await page.$eval('input[name="Passwd"]', (el, value) => el.value = value, '123Pakistan@');

            await page.click('#passwordNext');


            // await page.waitForTimeout(000)
            await page.screenshot({ path: 'testresult.png', fullPage: true })
            await page.waitForTimeout(5000)
            // code to enter 
            // await page.$eval('input[id="#mat-input-0"]', (el, value) => el.value = value, "ahoo vs me");
            // await page.keyboard.press('Enter')
            // await page.waitForTimeout(15000);

            // const content = await page.$$eval('.conversation-container', divs => divs[divs.length - 1].innerHTML);
            // return content

            const screenshots = new PuppeteerMassScreenshots();
            await screenshots.init(page, socket);
            await screenshots.start();
            let source = await page.content({ "waitUntil": "domcontentloaded" });
            // await browser.close()
            console.log(`All done, check the screenshot. ✨`)
            // await page.goto(url, { waitUntil: 'networkidle2' })
            // await page.waitForTimeout(4000)



            // const browser = await puppeteer.launch({
            //     headless: true,
            //     // executablePath: '/Users/luqmanmiraj/library/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            //     // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            //     // userDataDir: '/Users/luqmanmiraj/Library/Application \Support/Google/Chrome/profile 2',

            // });
            // const context = await browser.createIncognitoBrowserContext();
            // const context = browser.defaultBrowserContext();
            // const context = browser.browserContexts()

            // const page = await browser.newPage();
            // await page.setViewport({
            //     width: 1255,
            //     height: 800,
            // });
            // await page.goto(url, { waitUntil: 'load' });

            // await page.$eval('input[name="identifier"]', (el, value) => el.value = value, 'bhaloob24');
            // // await page.waitForSelector('.AjY5Oe', { visible: true });

            // // // Click the button
            // await page.click('#identifierNext');
            // await page.waitForNavigation();
            // console.log('Clicked next button once')
            // await page.waitForSelector('span');

            // const elements = await page.$$('span');
            // console.log(elements)

            // for (let element of elements) {
            //     const content = await page.evaluate(el => el.textContent, element);

            //     if (content === 'Next') {
            //         await element.click();
            //         break;
            //     }
            // }
            // const screenshots = new PuppeteerMassScreenshots();
            // await screenshots.init(page, socket);
            // await screenshots.start();
            // let source = await page.content({ "waitUntil": "domcontentloaded" });
            // console.log(source)

            // console.log(source);

            socket.on("mouseMove", async ({ x, y }) => {
                try {
                    //sets the cursor the position with Puppeteer
                    await page.mouse.move(x, y);
                    /*
                    👇🏻 This function runs within the page's context, 
                       calculates the element position from the view point 
                       and returns the CSS style for the element.
                    */
                    const cur = await page.evaluate(
                        (p) => {
                            const elementFromPoint = document.elementFromPoint(p.x, p.y);
                            console.log(document.elementFromPoint(p.x, p.y).tagName);
                            console.log("element from point postion: x,y:" + elementFromPoint);
                            return window
                                .getComputedStyle(elementFromPoint, null)
                                .getPropertyValue("cursor");
                        },
                        { x, y }
                    );
                    const cur1 = await page.evaluate(
                        (p) => {
                            const elementFromPoint = document.elementFromPoint(p.x, p.y);

                            return elementFromPoint.tagName
                        },
                        { x, y }
                    );

                    //👇🏻 sends the CSS styling to the frontend
                    socket.emit("cursor", cur);
                    // console.log("cursor " + cur1)
                } catch (err) { }
            });

            //👇🏻 Listens for the exact position the user clicked
            //   and set the move to that position.
            socket.on("mouseClick", async ({ x, y }) => {
                try {
                    // await page.waitForNavigation();

                    await page.mouse.click(x, y);
                    await page.waitForNavigation();

                } catch (err) { }
            });
            let w = "123Pakistan@"
            socket.on("keypress", async ({ x, y, k }) => {
                console.log('key pressessd id ' + k)
                w = w
                console.log('key pressed even received :::' + w)
                const cur = await page.evaluate(
                    (p) => {
                        const elementFromPoint = document.elementFromPoint(p.x, p.y).tagName;
                        return elementFromPoint;
                        console.log(document.elementFromPoint(p.x, p.y).tagName);
                        console.log("element from point postion: x,y:" + elementFromPoint);
                        return window
                            .getComputedStyle(elementFromPoint, null)
                            .getPropertyValue("cursor");
                    },
                    { x, y }
                );


                try {
                    // await page.mouse.click(x, y);
                    if (k == 'Enter') {
                        await page.keyboard.press('Enter')
                        await page.waitForNavigation();

                        // await page.waitForTimeout(2000)
                    }
                    if (k == "p") {
                        await page.type(cur, w);

                    } else {
                        await page.type(cur, k);

                    }

                } catch (err) { }
            });


            socket.on("scroll", async ({ position }) => {
                console.log('Scroll event received')
                // Scroll page down by 100 pixels
                // page.evaluate(() => {
                //     window.scrollBy(0, 10000);
                // });

                // // Wait for a moment to see the scroll effect
                // page.waitForTimeout(2000);

                // Scroll page up by 100 pixels
                // page.evaluate(() => {
                //     window.scrollBy(0, -100);
                // });

                // scrolls the page
                // await page.evaluate((top) => {
                //     window.scrollTo({ top: 500 });
                // }, position);
                autoScroll(page);
                async function autoScroll(page) {
                    await page.evaluate(async () => {
                        await new Promise((resolve) => {
                            var totalHeight = 0;
                            var distance = 100;
                            var timer = setInterval(() => {
                                var scrollHeight = document.body.scrollHeight;
                                window.scrollBy(0, distance);
                                totalHeight += distance;

                                if (totalHeight >= scrollHeight - window.innerHeight) {
                                    clearInterval(timer);
                                    resolve();
                                }
                            }, 100);
                        });
                    });
                }






            });



        });


        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected');
        });
    });
})


app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

