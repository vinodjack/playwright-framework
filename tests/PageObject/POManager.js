const LoginPage = require('./loginPage');
const registrationFormPage = require('./RegistrationFormPage');

class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.registrationFormPage = new registrationFormPage(this.page);
    }
}
module.exports = POManager;