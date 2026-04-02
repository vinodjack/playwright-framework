const os = require('os');

function getOptimalWorkers(defaultWorkers) {
  return Math.min(os.cpus().length - 1, defaultWorkers || 2);
}

module.exports = { getOptimalWorkers };