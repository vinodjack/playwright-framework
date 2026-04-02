const { expect } = require('@playwright/test');

class LoginPage{
    constructor(page){
        this.page = page;
        this.emailInput = page.locator('[name="email"]');
        this.passwordInput = page.locator('[name="pass"]');
        this.loginButton = page.locator('//span[text()="Log in"]');
        this.accountDiv = page.locator('div[aria-label="Account"]');
        this.errorMessage = page.locator("//a[text()='Find your account and log in.']");
    }

    async loginvalidateLoginPage(){
        
        const pageTitle = await this.page.title();
        console.log(`Page title: ${pageTitle}`);
        return pageTitle.includes('Facebook');
    }

    async enterCredentials(username, password){
        await this.emailInput.fill(username);
        console.log(`Entered username: ${username}`);
        await this.passwordInput.fill(password);
        console.log(`Entered password: ${'*'.repeat(password.length)}`);    
    }

    async clickLogin(){
        await this.loginButton.click();
        console.log('Clicked login button');
    }
    async validateLoginSuccess(){
        try {
            await this.accountDiv.waitFor({ timeout: 10000 });
            console.log('Account div found');
            return await this.accountDiv.isVisible();
        } catch (error) {
            console.log('Account div not found:', error.message);
            return false;
        }
    }
    async isErrorMessageDisplayed(){
        try {
            await this.errorMessage.waitFor({ timeout: 10000 });
            console.log('Error message found');
            return await this.errorMessage.isVisible();
        } catch (error) {
            console.log('Error message not found:', error.message);
            return false;
        }
    }
    
}
module.exports = LoginPage;