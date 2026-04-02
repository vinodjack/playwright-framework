const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');
const cliParams = require('../support/paramSetup');
const { buildFinalConfig } = require('../utils/configManager');

// Ensure testReports directory exists
const testReportsDir = path.join(__dirname, '../testReports');
if (!fs.existsSync(testReportsDir)) {
  fs.mkdirSync(testReportsDir, { recursive: true });
}

const finalConfig = buildFinalConfig(cliParams);

console.log('\n═══════════════════════════════════════════════════');
console.log('  🧪 Test Execution Started');
console.log('═══════════════════════════════════════════════════');
console.table(finalConfig);
console.log('═══════════════════════════════════════════════════\n');

// Build Cucumber command
let command = 'npx cucumber-js';
const args = [];

// Add tags if provided
if (finalConfig.tags) {
  args.push('--tags');
  args.push(finalConfig.tags);
}

// Add parallel workers
if (finalConfig.parallel) {
  args.push('--parallel');
  args.push(String(finalConfig.parallel));
}

// Add JSON format for reporting (required for report generation)
args.push('--format');
args.push('json:testReports/report.json');

// Add pretty format for console output
args.push('--format');
args.push('progress');

console.log(`▶ Running: ${command} ${args.join(' ')}\n`);

const testProcess = spawn(command, args, { 
  shell: true, 
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

testProcess.on('error', (err) => {
  console.error('Failed to start test process:', err);
  process.exit(1);
});

testProcess.on('exit', (code) => {
  setTimeout(() => {
    generateReports(code);
  }, 1000); // Wait 1 second for file system to flush
});

function generateReports(code) {
  console.log('\n═══════════════════════════════════════════════════');
  
  if (code === 0) {
    console.log('  ✓ Tests Execution Completed');
  } else {
    console.log('  ✗ Tests Execution Failed');
  }
  
  console.log('═══════════════════════════════════════════════════\n');
  console.log('📊 Generating Extent Reports...\n');
  
  const reportJsonPath = path.join(__dirname, '../testReports/report.json');
  const reportDir = path.join(__dirname, '../testReports');
  
  try {
    // Check if JSON report exists
    if (!fs.existsSync(reportJsonPath)) {
      console.error('❌ Error: No JSON report found!');
      console.error(`   Expected at: ${reportJsonPath}`);
      console.error('\n⚠️  Possible causes:');
      console.error('  • No feature files found matching the path');
      console.error('  • No scenarios matched the tags');
      console.error('  • Features directory is empty\n');
      process.exit(code);
      return;
    }
    
    // Read and validate JSON
    const jsonContent = fs.readFileSync(reportJsonPath, 'utf-8');
    const jsonData = JSON.parse(jsonContent);
    
    console.log(`✓ Found Cucumber JSON report`);
    console.log(`  Features: ${jsonData.length}`);
    console.log(`  Total Scenarios: ${jsonData.reduce((sum, f) => sum + (f.elements ? f.elements.length : 0), 0)}\n`);
    
    // Generate HTML Report using cucumber-html-reporter
    const reportHtmlPath = path.join(reportDir, 'index.html');
    
    const options = {
      theme: 'bootstrap',
      jsonFile: reportJsonPath,
      output: reportHtmlPath,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      metadata: {
        'App Version': '1.0.0',
        'Test Environment': finalConfig.env || 'QA',
        'Browser': finalConfig.browser || 'chromium',
        'Platform': process.platform,
        'Execution Type': finalConfig.executionType || 'LOCAL',
        'Parallel Workers': finalConfig.parallel || '2'
      }
    };
    
    console.log('Generating report with options:', JSON.stringify({
      jsonFile: reportJsonPath,
      output: reportHtmlPath,
      theme: 'bootstrap'
    }, null, 2));
    
    // Generate the report
    reporter.generate(options);
    
    // Check if report was created
    const reportFile = path.join(reportDir, 'index.html');
    if (fs.existsSync(reportFile)) {
      console.log('✓ Extent Report Generated Successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📂 Report Location:');
      console.log(`   ${reportFile}\n`);
      console.log('   Open in browser: testReports/index.html');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.warn('⚠️  Report file not created. Checking output...');
      const files = fs.readdirSync(reportDir);
      console.log('Files in testReports:', files);
    }
    
  } catch (err) {
    console.error('❌ Error Generating Report:');
    console.error(`   ${err.message}\n`);
    console.error('Stack:', err.stack);
    console.error('\n⚠️  Please check:');
    console.error('  1. multiple-cucumber-html-reporter is installed');
    console.error('  2. testReports directory has valid report.json');
    console.error('  3. JSON file is not corrupted\n');
  }
  
  process.exit(code);
}