const fs = require('fs');
const path = require('path');

const tcPath = path.join(process.cwd(), 'node_modules', 'testcafe', 'lib', 'cli', 'index.js');

if (fs.existsSync(tcPath)) {
  console.log('Local TestCafe installation found.');
  process.exit(0);
}

console.warn('Warning: Local TestCafe not found in node_modules.');
console.warn('This project can use a global TestCafe or the resilient runner, so tests will still run.');
console.warn('To install TestCafe locally (recommended for CI), run:');
console.warn('  npm install --save-dev testcafe');

process.exit(0);
