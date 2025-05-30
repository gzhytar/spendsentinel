#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the new version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const newVersion = packageJson.version;

console.log(`🔄 Updating app version to ${newVersion}`);

// Update the version in layout.tsx
const layoutPath = './src/app/[lang]/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Replace the CURRENT_VERSION constant
const versionRegex = /const CURRENT_VERSION = ['"][\d.]+['"];/;
const newVersionLine = `const CURRENT_VERSION = '${newVersion}';`;

if (versionRegex.test(layoutContent)) {
  layoutContent = layoutContent.replace(versionRegex, newVersionLine);
  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ Updated CURRENT_VERSION in ${layoutPath}`);
} else {
  console.log(`⚠️  Could not find CURRENT_VERSION in ${layoutPath}`);
}

// Optionally create a changelog entry
const changelogPath = './CHANGELOG.md';
const today = new Date().toISOString().split('T')[0];

let changelogContent = '';
if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
} else {
  changelogContent = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
}

// Add new version entry if it doesn't exist
const versionHeader = `## [${newVersion}] - ${today}`;
if (!changelogContent.includes(versionHeader)) {
  const newEntry = `${versionHeader}

### Added
- 

### Changed
- 

### Fixed
- 

`;

  // Insert after the main header
  const lines = changelogContent.split('\n');
  const insertIndex = lines.findIndex(line => line.startsWith('## [')) || 3;
  lines.splice(insertIndex, 0, newEntry);
  
  fs.writeFileSync(changelogPath, lines.join('\n'));
  console.log(`📝 Added changelog entry for version ${newVersion}`);
}

console.log(`🎉 Version ${newVersion} update complete!`);
console.log(`
Next steps:
1. Update CHANGELOG.md with your changes
2. Test the app locally
3. Deploy with: npm run build
4. For major versions, users' localStorage will be cleared automatically
5. For minor versions, only specific keys will be cleared if needed
`); 