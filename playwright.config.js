const { devices } = require('@playwright/test');

module.exports = {
  use: {
    browserName: 'chromium',
    headless: false
  },

  workers: 2,

  projects: [
    {
      name: 'UI_Test',
      testMatch: '**/features/UI/**/*.feature',
      tags: ['@login']
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

  tagGroups: {
    smoke: '@smoke',
    regression: '@regression or @critical'
  }
};