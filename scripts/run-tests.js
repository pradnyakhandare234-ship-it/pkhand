const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, options));
  return res.status === 0;
}

function hasLocalTestCafe() {
  const p = path.join(process.cwd(), 'node_modules', 'testcafe', 'lib', 'cli', 'index.js');
  return fs.existsSync(p);
}

function hasGlobalTestCafe() {
  try {
    const res = spawnSync('testcafe', ['-v'], { stdio: 'ignore', shell: true });
    return res.status === 0;
  } catch (e) {
    return false;
  }
}

function installLocalTestCafe() {
  console.log('Attempting to install testcafe locally (may require network access)...');
  return runCommand('npm', ['install', '--no-audit', '--no-fund', '--no-save', 'testcafe@latest']);
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) args.push('chrome', 'tests/register.test.js');

  // Support slowing the execution via environment variable SLOW
  // Set SLOW=1 to enable and optionally SPEED_VALUE (0.01-1) to pick speed.
  if (process.env.SLOW && !args.includes('--speed')) {
    const speed = process.env.SPEED_VALUE || '0.3';
    args.unshift('--speed', speed);
    console.log(`Slow mode enabled — TestCafe speed set to ${speed}`);
  }

  // Support multi-window tests by disabling native automation when MULTI_WINDOW=1
  // Native Automation doesn't support multiple windows; TestCafe flag is --disable-native-automation
  if (process.env.MULTI_WINDOW && !args.includes('--disable-native-automation')) {
    args.unshift('--disable-native-automation');
    console.log('Multi-window mode enabled — native automation disabled');
  }

  if (hasLocalTestCafe()) {
    console.log('Using local TestCafe');
    process.exit(runCommand('npx', ['testcafe', ...args]) ? 0 : 1);
  }

  if (hasGlobalTestCafe()) {
    console.log('Using global TestCafe');
    process.exit(runCommand('testcafe', args) ? 0 : 1);
  }

  // Try to install locally
  if (installLocalTestCafe()) {
    console.log('Local install succeeded; running tests with local TestCafe');
    process.exit(runCommand('npx', ['testcafe', ...args]) ? 0 : 1);
  }

  console.error('Could not find TestCafe locally or globally, and automatic install failed.');
  console.error('Please install TestCafe manually with: npm install --save-dev testcafe');
  process.exit(2);
}

main();
