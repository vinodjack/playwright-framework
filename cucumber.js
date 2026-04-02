module.exports = {
  default: {
    require: [
      'support/hooks.js',
      'tests/stepDefinitions/**/*.js'
    ],
    format: [
      'progress',
      'json:testReports/report.json'
    ],
    paths: [
      'tests/features/**/*.feature'
    ]
  }
};