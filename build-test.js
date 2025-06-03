// Simple build test script
const { execSync } = require('child_process');

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
