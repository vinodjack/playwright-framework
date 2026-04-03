const { devices } = require('@playwright/test');

module.exports = {
  use: {
    browserName: 'chromium',
    headless: false,
    actionTimeout: 30000,
    navigationTimeout: 60000
  },

  timeout: 60000,

  workers: 1,

  projects: [
    {
      name: 'UI_Test',
      testMatch: '**/features/UI/**/*.feature',
      tags: ['@RegistrationForm']
    },
    {
      name: 'API_Test',
      testMatch: '**/features/API/**/*.feature',
      tags: ['@api']
    }
  ],

  env: {
    environment: 'QA',
    platform: 'local',
    projectName: 'UI_Test'
  },

};