const {Given, When, Then} = require('@cucumber/cucumber');
const POManager = require('../PageObject/POManager');

let poManager;

Given('User is on registration form page', async function(){
    poManager = new POManager(this.page);
    await poManager.registrationFormPage.navigateToResgistrationForm();
     this.attach('Navigated to registration form page', 'text/plain');
})

When('User enters valid data in the registration form', async function(dataTable){
    poManager = new POManager(this.page);
    await poManager.registrationFormPage.fillRegistrationForm(dataTable);
     this.attach('Filled registration form with valid data', 'text/plain');
})