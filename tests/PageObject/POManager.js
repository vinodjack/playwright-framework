const LoginPage = require('./loginPage');

class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
    }
}
module.exports = POManager;