const { Given, When, Then } = require('@cucumber/cucumber');
const POManager = require('../PageObject/POManager');

let poManager;

Given('I am on the facebook login page', async function () {
  // Initialize POManager with the page from hooks
  poManager = new POManager(this.page);
  
  // Log to console
  console.log('📌 Given: I am on the facebook login page');
  
  // Attach log to HTML report
  await this.attach('Initializing POManager with page object', 'text/plain');
  
  // Validate we're on the login page
  const result = await poManager.loginPage.loginvalidateLoginPage();
  
  // Log result
  console.log('✅ Login page validation: ' + result);
  await this.attach('Login page validation result: ' + result, 'text/plain');
  
  if (result) {
    await this.attach('✅ Successfully validated login page', 'text/plain');
  } else {
    await this.attach('❌ Failed to validate login page', 'text/plain');
  }
});

When('I enter valid username and password', async function () {
  poManager = new POManager(this.page);
  // Log to console
  console.log('📌 When: I enter valid username and password');
  await this.attach('Entering valid credentials (test@example.com)', 'text/plain');
  
  try {
    await poManager.loginPage.enterUsername('test@example.com');
    console.log('✅ Username entered');
    await this.attach('✅ Username entered: test@example.com', 'text/plain');
    
    await poManager.loginPage.enterPassword('validPassword123');
    console.log('✅ Password entered');
    await this.attach('✅ Password entered successfully', 'text/plain');
    
    await poManager.loginPage.clickLogin();
    console.log('✅ Login button clicked');
    await this.attach('✅ Login button clicked', 'text/plain');
  } catch (error) {
    console.error('❌ Error entering credentials: ' + error.message);
    await this.attach('❌ Error entering credentials: ' + error.message, 'text/plain');
    throw error;
  }
});

When('I enter invalid username and password', async function () {
  poManager = new POManager(this.page);
  // Log to console
  console.log('📌 When: I enter invalid username and password');
  await this.attach('Entering invalid credentials (invalid@example.com)', 'text/plain');
  
  try {
    await poManager.loginPage.enterUsername('invalid@example.com');
    console.log('✅ Invalid username entered');
    await this.attach('✅ Invalid username entered: invalid@example.com', 'text/plain');
    
    await poManager.loginPage.enterPassword('wrongPassword');
    console.log('✅ Invalid password entered');
    await this.attach('✅ Invalid password entered', 'text/plain');
    
    await poManager.loginPage.clickLogin();
    console.log('✅ Login button clicked');
    await this.attach('✅ Login button clicked', 'text/plain');
  } catch (error) {
    console.error('❌ Error entering credentials: ' + error.message);
    await this.attach('❌ Error entering credentials: ' + error.message, 'text/plain');
    throw error;
  }
});

Then('I should be logged in successfully', async function () {
  poManager = new POManager(this.page);
  // Log to console
  console.log('📌 Then: I should be logged in successfully');
  await this.attach('Validating login success...', 'text/plain');
  
  try {
    const isLoggedIn = await poManager.loginPage.validateLoginSuccess();
    
    if (isLoggedIn) {
      console.log('✅ Login was successful');
      await this.attach('✅ Login was successful', 'text/plain');
    } else {
      console.log('❌ Login was not successful');
      await this.attach('❌ Login was not successful', 'text/plain');
      throw new Error('Login was not successful');
    }
  } catch (error) {
    console.error('❌ Error validating login: ' + error.message);
    await this.attach('❌ Error validating login: ' + error.message, 'text/plain');
    throw error;
  }
});

Then('I should see an error message', async function () {
  poManager = new POManager(this.page);
  // Log to console
  console.log('📌 Then: I should see an error message');
  await this.attach('Checking for error message...', 'text/plain');
  
  try {
    const errorVisible = await poManager.loginPage.isErrorMessageDisplayed();
    
    if (errorVisible) {
      console.log('✅ Error message is displayed');
      await this.attach('✅ Error message is displayed', 'text/plain');
    } else {
      console.log('❌ No error message found');
      await this.attach('❌ No error message found', 'text/plain');
      throw new Error('Error message not displayed');
    }
  } catch (error) {
    console.error('❌ Error checking error message: ' + error.message);
    await this.attach('❌ Error checking error message: ' + error.message, 'text/plain');
    throw error;
  }
});

