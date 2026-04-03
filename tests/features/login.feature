Feature: login to facebook
  @login
  Scenario: login with valid credentials
    Given I am on the facebook login page
    When I enter valid username and password
    Then I should be logged in successfully
  @login
  Scenario: login with invalid credentials
    Given I am on the facebook login page
    When I enter invalid username and password
    Then I should see an error message