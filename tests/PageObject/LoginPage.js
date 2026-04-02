const { expect } = require('@playwright/test');

class LoginPage{
    constructor(page){
        this.page = page;
    }

    async loginvalidateLoginPage(){
        const pageTitle = await this.page.title();
        return pageTitle.includes('Facebook');
    }

    async enterUsername(username){
        await this.page.fill('#email', username);
    }

    async enterPassword(password){
        await this.page.fill('#pass', password);
    }

    async clickLogin(){
        await this.page.click('button[name="login"]');
    }
    async validateLoginSuccess(){
        await this.page.waitForSelector('div[aria-label="Account"]', { timeout: 5000 });
        return await this.page.isVisible('div[aria-label="Account"]');
    }
    async isErrorMessageDisplayed(){
        await this.page.waitForSelector('div[role="alert"]', { timeout: 5000 });
        return await this.page.isVisible('div[role="alert"]');
    }
    
}
module.exports = LoginPage;