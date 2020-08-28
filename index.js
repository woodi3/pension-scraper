'use strict';

var puppeteer = require('puppeteer');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36';
const VIEW_PORT = {
    width: 1200,
    height: 800
};

(async () => {
    const browser = await puppeteer.launch();
    await parseGeoInvestors(browser);
    await parseCoreCivicInvestors(browser);
    await browser.close();
})();


async function parseGeoInvestors(browser) {
    const URL = 'https://www.nasdaq.com/market-activity/stocks/geo/institutional-holdings';
    var companies = await getStakeholdersFromNASDAQ(browser, URL);
    console.log(`======= Institutional Stakeholders in Geo Group Inc ==============`);
    console.log(companies.length);
}
async function parseCoreCivicInvestors(browser) {
    const URL = 'https://www.nasdaq.com/market-activity/stocks/cxw/institutional-holdings';
    var companies = await getStakeholdersFromNASDAQ(browser, URL);
    console.log(`======= Institutional Stakeholders in CoreCivic ==============`);
    console.log(companies.length);
}

async function getStakeholdersFromNASDAQ(browser, url) {
    var page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport(VIEW_PORT);
    await page.goto(url, { waitUntil: 'networkidle0' });

    var maxPage = await page.$eval('.pagination__pages button:last-child', function getMaxPage(element) {
        return element.textContent;
    });
    maxPage = Number(maxPage);

    // loop until the max pages
    var companies = [];
    for (let i = 0; i < maxPage; i++) {
        // get the listings for each page
        let links = await page.$$eval('a.firstCell', function transformElements(elements) {
            return elements.map(function transform(element) {
                return {
                    text: element.textContent,
                    href: element.href
                }
            });
        });
        // add companies
        companies = [...companies, ...links];
        let [nextBtnHandle] = await page.$x('.//button[@class="pagination__next"]');
        let nextBtnProperty = await nextBtnHandle.getProperty('disabled');
        let disabledValue = await nextBtnProperty.jsonValue();
        let isDisabled = disabledValue == 'true';
        if (!isDisabled) {
            // go next
            nextBtnHandle.click();
            await timer(250);
        }
    }
    return companies;
}

function timer(duration) {
    return new Promise(function(res){
        setTimeout(res, duration);
    });
}

function printLinks(links) {
    links.forEach((link) => console.log(link));
}