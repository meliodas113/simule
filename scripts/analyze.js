#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build:prod', { cwd: rootDir, stdio: 'inherit' });
  
  // Get dist folder size
  const { execSync: exec } = await import('child_process');
  const sizeOutput = exec('du -sh dist/', { cwd: rootDir, encoding: 'utf8' });
  console.log(`📊 Dist folder size: ${sizeOutput.trim()}`);
  
  // Analyze individual files
  console.log('\n📁 Individual file sizes:');
  execSync('ls -lah dist/', { cwd: rootDir, stdio: 'inherit' });
  
  console.log('\n✅ Bundle analysis complete!');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
