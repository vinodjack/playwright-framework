

class RegistrationFormPage {
    constructor(page){
        this.page = page;
        this.firstNameInput = page.locator('input[placeholder="First Name"]');
        this.lastNameInput = page.locator('input[placeholder="Last Name"]');
        this.adddressInput = page.locator('textarea[ng-model="Adress"]');
        this.emailInput = page.locator('input[ng-model="EmailAdress"]');
        this.phoneInput = page.locator('input[ng-model="Phone"]');
        this.genderRadio = page.locator('input[name="radiooptions"]');
        this.hobbiesCheckbox = page.locator('input[type="checkbox"]');
        this.languagesDropdown = page.locator('#msdd');
        this.skillsDropdown = page.locator('#Skills');
        this.countryDropdown = page.locator('#countries');
        this.selectCountryDropdown = page.locator('span[role="combobox"]');
        this.yearDropdown = page.locator('#yearbox');
        this.monthDropdown = page.locator('select[placeholder="Month"]');
        this.dayDropdown = page.locator('#daybox');
        this.passwordInput = page.locator('#firstpassword');
        this.confirmPasswordInput = page.locator('#secondpassword');
        this.submitButton = page.locator('#submitbtn');

    }


    async navigateToResgistrationForm(){
        await this.firstNameInput.waitFor({ timeout: 10000 });
        console.log('Registration form page loaded successfully');
        return true;
    }

    async fillRegistrationForm(dataTable){
        const data = dataTable.rowsHash();
        await this.firstNameInput.fill(data.firstName);
        console.log(`Entered first name: ${data.firstName}`);
        await this.lastNameInput.fill(data.lastName);
        console.log(`Entered last name: ${data.lastName}`);
        await this.adddressInput.fill(data.address);
        console.log(`Entered address: ${data.address}`);
        await this.emailInput.fill(data.email);
        console.log(`Entered email: ${data.email}`);
        await this.phoneInput.fill(data.phone);
        console.log(`Entered phone: ${data.phone}`);
        return true;
    }

}

module.exports = RegistrationFormPage;