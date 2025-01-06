const puppeteer = require('puppeteer');

async function testPuppeteer() {
    try {
        console.log("Launching Puppeteer...");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://example.com');
        console.log("Page title:", await page.title());
        await browser.close();
        console.log("Puppeteer is working correctly.");
    } catch (error) {
        console.error("Error testing Puppeteer:", error);
    }
}

testPuppeteer();
