const { Before, After, Status } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { getProperty } = require('../utils/propertyReader');
const config = require('../playwright.config');

let browser;
let page;
let context;

// Before Hook - Runs before each scenario
Before(async function (scenario) {
  const scenarioName = scenario.pickle.name || 'Unknown Scenario';
  const timestamp = new Date().toLocaleString();
  
  console.log('\n📌 Starting Test Scenario: ' + scenarioName);
  console.log('⏱️  Timestamp: ' + timestamp);
  
  // Attach logs to HTML report
  await this.attach('Starting Test Scenario: ' + scenarioName, 'text/plain');
  await this.attach('Timestamp: ' + timestamp, 'text/plain');
  
  try {
    // Get environment from playwright.config.js
    const environment = config.env.environment || 'QA';
    
    console.log('🔧 Environment from playwright.config.js: ' + environment);
    await this.attach('📍 Environment: ' + environment, 'text/plain');
    
    // Launch browser
    console.log('🚀 Launching browser...');
    await this.attach('🚀 Launching Chromium browser...', 'text/plain');
    
    browser = await chromium.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled']
    });
    
    // Create context with specific settings
    console.log('🔨 Creating browser context...');
    await this.attach('🔨 Creating browser context with viewport 1280x720', 'text/plain');
    
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    // Create page
    page = await context.newPage();
    
    // Store page in world context for access in steps
    this.page = page;
    this.browser = browser;
    this.context = context;
    this.environment = environment;
    
    console.log('✅ Browser launched successfully');
    await this.attach('✅ Browser launched successfully', 'text/plain');
    
    // Read URL from env.properties file based on environment
    try {
      const webUrl = getProperty(environment, 'webURL');
      console.log('🌐 Navigating to: ' + webUrl);
      console.log('📍 Environment: ' + environment);
      await this.attach('🌐 Navigating to URL: ' + webUrl, 'text/plain');
      
      await page.goto(webUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log('✅ Page loaded successfully');
      await this.attach('✅ Page loaded successfully', 'text/plain');
    } catch (urlError) {
      console.warn('⚠️  URL loading warning:', urlError.message);
      await this.attach('⚠️  URL Loading Warning: ' + urlError.message, 'text/plain');
      console.log('📝 Make sure env.properties has entries like:');
      console.log('   ' + environment + '.webURL=<url>');
      // Don't throw - allow test to continue
    }
    
  } catch (error) {
    console.error('❌ Error in Before hook:', error.message);
    await this.attach('❌ Error in Before hook: ' + error.message, 'text/plain');
    throw error;
  }
});

// After Hook - Runs after each scenario
After(async function (scenario) {
  const scenarioName = scenario.pickle.name || 'Unknown Scenario';
  
  console.log('\n📌 Closing Test Scenario: ' + scenarioName);
  await this.attach('Closing Test Scenario: ' + scenarioName, 'text/plain');
  
  const status = scenario.result.status;
  
  // Take screenshot on failure
  if (status === Status.FAILED) {
    console.log('❌ Scenario Failed - Taking screenshot...');
    await this.attach('❌ Scenario FAILED - Capturing screenshot and error details', 'text/plain');
    
    try {
      const screenshotDir = path.join(__dirname, '../testReports/screenshots');
      
      // Create screenshots directory if it doesn't exist
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const screenshotPath = path.join(
        screenshotDir,
        `${scenarioName.replace(/\s+/g, '_')}_${Date.now()}.png`
      );
      
      if (this.page) {
        await this.page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        await this.attach('📸 Screenshot saved: ' + screenshotPath, 'text/plain');
      }
    } catch (error) {
      console.error('⚠️  Could not take screenshot:', error.message);
      await this.attach('⚠️  Could not take screenshot: ' + error.message, 'text/plain');
    }
    
    // Log error message if available
    if (scenario.result.message) {
      console.log('Error Details:', scenario.result.message);
      await this.attach('Error Details: ' + scenario.result.message, 'text/plain');
    }
  } else if (status === Status.PASSED) {
    console.log('✅ Scenario Passed');
    await this.attach('✅ Scenario PASSED', 'text/plain');
  } else {
    console.log('⏭️  Scenario Skipped');
    await this.attach('⏭️  Scenario SKIPPED', 'text/plain');
  }
  
  // Cleanup
  try {
    console.log('🧹 Cleaning up resources...');
    await this.attach('🧹 Cleaning up resources (closing browser, context, page)', 'text/plain');
    
    if (this.page) {
      await this.page.close();
      console.log('✅ Page closed');
    }
    if (this.context) {
      await this.context.close();
      console.log('✅ Context closed');
    }
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
    console.log('✅ Browser closed successfully\n');
    await this.attach('✅ All resources cleaned up successfully', 'text/plain');
  } catch (error) {
    console.error('❌ Error closing browser:', error.message);
    await this.attach('❌ Error closing browser: ' + error.message, 'text/plain');
  }
});

// Hook for handling errors
After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    console.log('Test Result: FAILED');
    await this.attach('🔴 Test Result: FAILED', 'text/plain');
    
    if (scenario.result.message) {
      console.log('Error:', scenario.result.message);
      await this.attach('Error Message: ' + scenario.result.message, 'text/plain');
    }
  } else {
    console.log('Test Result: ' + scenario.result.status);
    await this.attach('Test Result: ' + scenario.result.status, 'text/plain');
  }
});