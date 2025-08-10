#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

try {
  // Get git commit information
  const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  const commitTimestamp = execSync('git log -1 --pretty=%cI', { encoding: 'utf8' }).trim();
  const buildTime = new Date().toISOString();

  // Create .env file with git information
  const envContent = `VITE_COMMIT_HASH=${commitHash}
VITE_COMMIT_MESSAGE=${commitMessage.replace(/\n/g, ' ')}
VITE_COMMIT_TIMESTAMP=${commitTimestamp}
VITE_BUILD_TIME=${buildTime}
`;

  writeFileSync(join(process.cwd(), '.env'), envContent);
  console.log('✅ Git information extracted and .env file created');
  console.log(`📝 Commit: ${commitHash.substring(0, 8)}`);
  console.log(`💬 Message: ${commitMessage.substring(0, 50)}${commitMessage.length > 50 ? '...' : ''}`);
  console.log(`⏰ Timestamp: ${commitTimestamp}`);

} catch (error) {
  console.error('❌ Error extracting git information:', error.message);
  console.log('⚠️  Proceeding with build without git information');
  
  // Create .env file with fallback values
  const envContent = `VITE_COMMIT_HASH=unknown
VITE_COMMIT_MESSAGE=No commit message available
VITE_COMMIT_TIMESTAMP=unknown
VITE_BUILD_TIME=${new Date().toISOString()}
`;
  
  writeFileSync(join(process.cwd(), '.env'), envContent);
}
