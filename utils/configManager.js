const fs = require('fs');
const config = require('../playwright.config');

function loadStored() {
  try {
    return JSON.parse(fs.readFileSync('./support/commandData.json'));
  } catch {
    return {};
  }
}

function detectEnvironment() {
  if (process.env.JENKINS_HOME) return 'CI';
  if (process.env.GITHUB_ACTIONS) return 'CI';
  return 'LOCAL';
}

function buildFinalConfig(cli = {}) {

  const stored = loadStored();

  const finalConfig = {
    env: cli.env || stored.env || config.env.environment,
    project: cli.pname || stored.pname || config.env.projectName,
    browser: cli.browser || stored.browser || config.use.browserName,
    tags: cli.tags || stored.tags,
    parallel: cli.parallel || stored.parallel || config.workers,
    executionType: detectEnvironment()
  };

  validate(finalConfig);

  return finalConfig;
}

function validate(cfg) {
  if (!cfg.project) throw new Error("Project missing");
  if (!cfg.env) throw new Error("Environment missing");
}

module.exports = { buildFinalConfig };