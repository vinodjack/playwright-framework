const { program } = require('commander');

program
  .option('--env <env>')
  .option('--pname <pname>')
  .option('--browser <browser>')
  .option('--tags <tags>')
  .option('--parallel <parallel>');

program.parse(process.argv);

module.exports = program.opts();