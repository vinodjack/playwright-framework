const fs = require('fs');
const path = require('path');

function getProperty(env, key) {
  try {
    // Resolve path relative to project root
    const filePath = path.join(__dirname, '../testData/BaseURL.properties');
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Property file not found at: ${filePath}`);
    }
    
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    for (let line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      const [k, v] = trimmedLine.split('=');
      const propertyKey = `${env}.${key}`;
      
      if (k && k.trim() === propertyKey) {
        const value = v ? v.trim() : '';
        console.log(`✅ Property found: ${propertyKey}=${value}`);
        return value;
      }
    }

    throw new Error(`Missing property: ${env}.${key} in ${filePath}`);
  } catch (error) {
    console.error(`❌ Error reading property: ${error.message}`);
    throw error;
  }
}

module.exports = { getProperty };