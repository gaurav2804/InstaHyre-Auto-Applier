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

    // Set up Chrome options for incognito mode
    let options = new Options();
    // options.addArguments('--headless'); // Remove this line if you want to run in non-headless mode
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--incognito'); // Add this line for incognito mode

    // Create a new browser instance
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    console.log(driver)
    try {
        // Navigate to the website
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

        // Locate the first view button and click on it
        let viewButtons = await driver.wait(until.elementsLocated(By.xpath("//button[contains(text(), 'View')]")), 15000);
        if (viewButtons.length > 0) {
            await viewButtons[0].click();
            await driver.sleep(3000);

            // Number of applications to be sent
            let applicationsToSend = 1000;
            while (applicationsToSend > 0) {
                try {

                    let applyButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Apply')]")), 15000);
                    await applyButton.click();
                    applicationsToSend -= 1;
                    await driver.sleep(1000);
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
