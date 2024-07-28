require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome');

(async function applyToInstahyre() {
    // Load email and password from environment variables
    const email = process.env.INSTAHYRE_EMAIL;
    const password = process.env.INSTAHYRE_PASSWORD;

    if (!email || !password) {
        throw new Error("Please set the INSTAHYRE_EMAIL and INSTAHYRE_PASSWORD environment variables");
    }


    let options = new Options();
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--incognito'); // Adding this line for incognito mode

    // Creating a new browser instance
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    console.log(driver)
    try {

        await driver.get('https://www.instahyre.com/candidates/register/');


        let loginButton = await driver.wait(until.elementLocated(By.xpath("//a[@href='/login/']")), 15000);
        await loginButton.click();


        let emailField = await driver.wait(until.elementLocated(By.id('email')), 15000);
        await emailField.sendKeys(email);


        let passwordField = await driver.wait(until.elementLocated(By.id('password')), 15000);
        await passwordField.sendKeys(password);


        let submitButton = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 15000);
        await submitButton.click();

        // Wait for login to complete
        await driver.sleep(10000);

        let viewButtons = await driver.wait(until.elementsLocated(By.xpath("//button[contains(text(), 'View')]")), 15000);
        if (viewButtons.length > 0) {
            await viewButtons[0].click();
            await driver.sleep(15000);

            // Number of applications to be sent.
            let applicationsToSend = 1000;
            while (applicationsToSend > 0) {
                try {

                    let applyButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Apply')]")), 15000);
                    await applyButton.click();
                    applicationsToSend -= 1;
                    await driver.sleep(15000);
                } catch (e) {
                    console.log(`Error while applying: ${e}`);
                    break;
                }
            }
        } else {
            console.log('View button not found.');
        }
    } finally {
        await driver.quit();
    }
})();
