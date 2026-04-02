const { Given, When, Then } = require('@cucumber/cucumber');
const POManager = require('../PageObject/POManager');

let poManager;

Given('I am on the facebook login page', async function () {
  poManager = new POManager(this.page);
  await this.attach('Validating Facebook login page', 'text/plain');
  
  const isOnLoginPage = await poManager.loginPage.loginvalidateLoginPage();
  if (!isOnLoginPage) {
    await this.attach('❌ Login page validation failed', 'text/plain');
    throw new Error('Failed to validate login page');
  }
  
  await this.attach('✓ Successfully on Facebook login page', 'text/plain');
});

When('I enter valid username and password', async function () {
  poManager = new POManager(this.page);
  await this.attach('Entering valid credentials', 'text/plain');
  
  await poManager.loginPage.enterCredentials('test@example.com', 'validPassword123');
  await poManager.loginPage.clickLogin();
  
  await this.attach('✓ Valid credentials entered and login clicked', 'text/plain');
});

When('I enter invalid username and password', async function () {
  poManager = new POManager(this.page);
  await this.attach('Entering invalid credentials', 'text/plain');
  
  await poManager.loginPage.enterCredentials('invalid@example.com', 'wrongPassword');
  await poManager.loginPage.clickLogin();
  
  await this.attach('✓ Invalid credentials entered and login clicked', 'text/plain');
});

Then('I should be logged in successfully', async function () {
  poManager = new POManager(this.page);
  await this.attach('Validating login success', 'text/plain');
  
  const isLoggedIn = await poManager.loginPage.validateLoginSuccess();
  if (!isLoggedIn) {
    await this.attach('❌ Login validation failed', 'text/plain');
    throw new Error('Login was not successful');
  }
  
  await this.attach('✓ Login successful - User authenticated', 'text/plain');
});

Then('I should see an error message', async function () {
  poManager = new POManager(this.page);
  await this.attach('Checking for error message', 'text/plain');
  
  const errorVisible = await poManager.loginPage.isErrorMessageDisplayed();
  if (!errorVisible) {
    await this.attach('❌ Error message not found', 'text/plain');
    throw new Error('Error message not displayed');
  }
  
  await this.attach('✓ Error message displayed as expected', 'text/plain');
});

