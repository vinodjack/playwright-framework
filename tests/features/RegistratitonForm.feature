Feature: validate registration form
@RegistrationForm
  Scenario: validate registration form with valid data
    Given User is on registration form page
    When User enters valid data in the registration form
        |key      |value           |
        |firstName|John          |
        |lastName |Doe           |
        |address  |123 Main St    |
        |email    |john.doe@example.com|
        |phone    |1234567890     |
    # Then User selects the gender "Male"
    # Then User selects the hobbies
    #     |hobbies  |
    #     |Cricket  |
    #     |Movies   |
    # Then User selects the language as "English"
    # Then User selects the skills "Java"
    # Then User selects the country "India"
    # Then User selects the date of birth
    #     |dob        |
    #     |01-Jan-1990|   
    # Then User enters the password "Password123"
    # Then User should be able to submit the registration form successfully