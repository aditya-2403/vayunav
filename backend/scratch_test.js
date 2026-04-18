const puppeteer = require('puppeteer');

async function test() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    await page.goto('https://aim-india.aai.aero/eaip/eaip-v2-04-2026/eAIP/IN-AD%202.1VABB-en-GB.html', { waitUntil: 'networkidle2' });
    
    // Are there any iframes?
    const frames = page.frames();
    console.log(`Frames in the page: ${frames.length}`);
    for (let f of frames) {
        console.log(`- Frame url: ${f.url()}`);
    }

    // Let's print out the last few scripts
    const scripts = await page.evaluate(() => Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerText.substring(0, 50)));
    console.log("Scripts:", scripts);

    await browser.close();
}

test().catch(console.error);
