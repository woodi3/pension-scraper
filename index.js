var puppeteer = require('puppeteer');

/**
 * Every site gets its own function.
 */


(async () => {
    const browser = await puppeteer.launch();
    // await parseMidi(browser);
    await parseRaleighPoliceDepartment(browser);
    await browser.close();
})();

async function parseRaleighPoliceDepartment(browser) {
    const URL = 'https://raleighnc.gov/police';
    var page = await browser.newPage();
    await page.goto(URL);
    const links = await page.$$eval('a', elements => elements.filter(element => {
        const parensRegex = /^((?!\().)*$/;
        return parensRegex.test(element.textContent);
    }).map(element => element.href));

    links.forEach(printLinks);
}

async function parseMidi(browser) {
    const URL = 'https://www.vgmusic.com/music/console/nintendo/nes';
    var page = await browser.newPage();

    await page.goto(URL);

    const links = await page.$$eval('a', elements => elements.filter(element => {
        const parensRegex = /^((?!\().)*$/;
        return element.href.includes('.mid') && parensRegex.test(element.textContent);
    }).map(element => element.href));

    links.forEach(printLinks);
}

function printLinks(link) {
    console.log(link);
}