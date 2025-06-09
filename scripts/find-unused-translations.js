#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Translation Key Usage Analyzer
 * 
 * This script analyzes translation files to find unused keys that can be safely deleted.
 * It respects the @freeze system documented in docs/localization.md
 */

class TranslationAnalyzer {
  constructor() {
    this.translationDir = path.join(__dirname, '../src/lib/i18n/translations');
    this.sourceDir = path.join(__dirname, '../src');
    this.unusedKeys = new Map();
    this.frozenKeys = new Set();
    this.allKeys = new Map(); // key -> Set of {file, lineNumber, isFrozen}
    this.usedKeys = new Set();
    this.debugMode = process.argv.includes('--debug');
    
    // More comprehensive usage patterns
    this.usagePatterns = [
      // Standard t() usage: t('key'), t("key"), t(`key`)
      /\bt\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Object destructuring with template literals: ${t('key')}
      /\$\{\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // React props: prop={t('key')}
      /=\s*\{\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Array/object values: [t('key')], {key: t('key')}
      /[\[\{,:\s]\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Function arguments: func(t('key'))
      /\(\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Return statements: return t('key')
      /return\s+t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Variable assignments: const x = t('key')
      /=\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Conditional expressions: condition ? t('key') : other
      /\?\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /:\s*t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // Property-based patterns (common in React components)
      // titleKey: 'key', descriptionKey: 'key', translationKey: 'key', etc.
      /(?:title|description|label|text|message|placeholder|tooltip|translationKey|key)\s*:\s*['"`]([^'"`]+)['"`]/g,
      // href translationKey patterns: href translationKey='key'
      /translationKey\s*=\s*['"`]([^'"`]+)['"`]/g,
      // String literal usage (direct key references): 'landing.features.something'
      /['"`]([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*){2,})['"`]/g
    ];
  }

  debug(message, ...args) {
    if (this.debugMode) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  analyze() {
    console.log('🔍 Starting Translation Key Analysis...\n');
    
    try {
      this.loadTranslationKeys();
      this.scanSourceFiles();
      this.generateReport();
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      if (this.debugMode) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  loadTranslationKeys() {
    console.log('📖 Loading translation files...');
    
    const translationFiles = glob.sync('*.ts', { cwd: this.translationDir });
    
    for (const file of translationFiles) {
      // Skip index file
      if (file === 'index.ts') continue;
      
      const filePath = path.join(this.translationDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      this.debug(`Processing translation file: ${file}`);
      this.extractKeysFromFile(content, file);
    }
    
    const uniqueKeys = this.allKeys.size;
    console.log(`✅ Loaded ${uniqueKeys} unique translation keys from ${translationFiles.length} files`);
    console.log(`🔒 Found ${this.frozenKeys.size} frozen keys\n`);
  }

  extractKeysFromFile(content, filename) {
    const lines = content.split('\n');
    
    // Find the main export object
    let inExportObject = false;
    let braceDepth = 0;
    let currentPath = [];
    let isFrozen = false;
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();
      const lineNumber = lineIndex + 1;
      
      // Skip empty lines and comments (except freeze markers)
      if (!trimmedLine || (trimmedLine.startsWith('//') && !trimmedLine.includes('@freeze'))) {
        continue;
      }
      
      // Check for @freeze comments
      if (trimmedLine.includes('@freeze')) {
        isFrozen = true;
        this.debug(`Found @freeze marker at line ${lineNumber} in ${filename}`);
        continue;
      }
      
      // Find export declaration
      if (trimmedLine.includes('export const') && trimmedLine.includes('= {')) {
        inExportObject = true;
        braceDepth = 1;
        currentPath = [];
        this.debug(`Started parsing export object at line ${lineNumber}`);
        continue;
      }
      
      if (!inExportObject) continue;
      
      // Count braces in this line, but ignore braces inside strings
      const openBraces = this.countBracesOutsideStrings(line, '{');
      const closeBraces = this.countBracesOutsideStrings(line, '}');
      
      // Handle closing braces FIRST to exit nested objects before processing new content
      if (closeBraces > 0) {
        for (let i = 0; i < closeBraces && currentPath.length > 0; i++) {
          const exitedPath = currentPath.pop();
          this.debug(`Exiting nested object: ${exitedPath}, remaining path: ${currentPath.join('.') || '(root)'}`);
        }
      }
      
      // Update brace depth
      braceDepth += openBraces - closeBraces;
      
      // End of export object
      if (braceDepth === 0) {
        this.debug(`Finished parsing export object at line ${lineNumber}`);
        break;
      }
      
      // Skip lines that only contain closing braces (no property definitions)
      if (closeBraces > 0 && !trimmedLine.includes(':')) {
        continue;
      }
      
      // Extract property key from line
      const keyMatch = this.extractPropertyFromLine(trimmedLine);
      if (keyMatch) {
        const { key, isObject, hasValue } = keyMatch;
        
        if (isObject) {
          // Entering nested object
          currentPath.push(key);
          this.debug(`Entering nested object: ${currentPath.join('.')}`);
        } else if (hasValue) {
          // This is a leaf translation key
          const fullKey = currentPath.length > 0 ? `${currentPath.join('.')}.${key}` : key;
          
          if (isFrozen) {
            this.frozenKeys.add(fullKey);
            this.debug(`Added frozen key: ${fullKey}`);
          }
          
          // Store key with metadata from this file
          if (!this.allKeys.has(fullKey)) {
            this.allKeys.set(fullKey, new Set());
          }
          
          this.allKeys.get(fullKey).add({
            file: filename,
            lineNumber: lineNumber,
            isFrozen: isFrozen
          });
          
          this.debug(`Added translation key: ${fullKey} at ${filename}:${lineNumber}`);
        }
      }
      
      // Reset frozen flag after processing each line (unless it's group-level)
      if (isFrozen && !trimmedLine.includes('@freeze-group')) {
        isFrozen = false;
      }
    }
  }

  countBracesOutsideStrings(line, braceChar) {
    let count = 0;
    let inString = false;
    let stringChar = null;
    let escaped = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
        continue;
      }
      
      if (inString && char === stringChar) {
        inString = false;
        stringChar = null;
        continue;
      }
      
      if (!inString && char === braceChar) {
        count++;
      }
    }
    
    return count;
  }

  extractPropertyFromLine(line) {
    // Remove trailing commas and comments
    let cleanLine = line.replace(/,\s*$/, '').replace(/\/\/.*$/, '').trim();
    
    // Skip lines that don't look like property definitions
    if (!cleanLine.includes(':')) {
      return null;
    }
    
    // Handle different property patterns
    const patterns = [
      // Regular property: key: value
      /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(.+)$/,
      // Quoted property: 'key': value or "key": value
      /^['"`]([^'"`]+)['"`]\s*:\s*(.+)$/
    ];
    
    for (const pattern of patterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        const key = match[1];
        const value = match[2].trim();
        
        const isObject = value.startsWith('{');
        const hasValue = !isObject && (value.startsWith('"') || value.startsWith("'") || value.startsWith('`'));
        
        return { key, isObject, hasValue };
      }
    }
    
    return null;
  }

  scanSourceFiles() {
    console.log('🔎 Scanning source files for usage...');
    
    // Use relative patterns that work with glob library on both Unix and Windows
    // Note: glob doesn't handle absolute Windows paths well, so use relative patterns
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];
    
    let totalFiles = 0;
    
    for (const pattern of patterns) {
      const files = glob.sync(pattern);
      this.debug(`Pattern ${pattern} matched ${files.length} files`);
      
      for (const file of files) {
        // Skip translation files and test files
        if (file.includes('/translations/') || file.includes('\\translations\\') || 
            file.includes('.test.') || file.includes('.spec.')) {
          continue;
        }
        
        this.scanFile(file);
        totalFiles++;
      }
    }
    
    console.log(`✅ Scanned ${totalFiles} source files`);
    console.log(`✅ Found ${this.usedKeys.size} translation keys in use\n`);
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize path separators for display
      
      this.debug(`Scanning file: ${normalizedPath}`);
      
      // Apply all usage patterns
      for (const pattern of this.usagePatterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex state
        
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];
          if (key && this.allKeys.has(key)) {
            this.usedKeys.add(key);
            this.debug(`Found usage of key '${key}' in ${normalizedPath}`);
          }
        }
      }
      
    } catch (error) {
      console.warn(`⚠️  Could not read file ${filePath}: ${error.message}`);
    }
  }

  generateReport() {
    console.log('📊 Generating Analysis Report...\n');
    
    // Calculate unused keys
    const unusedKeys = [];
    const frozenUnusedKeys = [];
    
    for (const [key, metadataSet] of this.allKeys) {
      if (!this.usedKeys.has(key)) {
        const isFrozenInAnyFile = this.frozenKeys.has(key);
        
        // Get representative metadata (from first file)
        const firstMetadata = Array.from(metadataSet)[0];
        
        if (isFrozenInAnyFile) {
          frozenUnusedKeys.push({ 
            key, 
            files: Array.from(metadataSet),
            ...firstMetadata 
          });
        } else {
          unusedKeys.push({ 
            key, 
            files: Array.from(metadataSet),
            ...firstMetadata 
          });
        }
      }
    }
    
    // Display summary
    console.log('='.repeat(60));
    console.log('📋 TRANSLATION KEY ANALYSIS REPORT');
    console.log('='.repeat(60));
    console.log(`Total unique translation keys: ${this.allKeys.size}`);
    console.log(`Keys currently in use: ${this.usedKeys.size}`);
    console.log(`Frozen keys (protected): ${this.frozenKeys.size}`);
    console.log(`Unused keys found: ${unusedKeys.length}`);
    console.log(`Frozen unused keys: ${frozenUnusedKeys.length}`);
    console.log();
    
    // Show sample used keys for verification
    if (this.debugMode && this.usedKeys.size > 0) {
      console.log('🔍 Sample of detected used keys:');
      const sampleKeys = Array.from(this.usedKeys).slice(0, 10);
      sampleKeys.forEach(key => console.log(`  ✅ ${key}`));
      if (this.usedKeys.size > 10) {
        console.log(`  ... and ${this.usedKeys.size - 10} more`);
      }
      console.log();
    }
    
    // Report unused keys
    if (unusedKeys.length > 0) {
      console.log('🗑️  UNUSED TRANSLATION KEYS (Safe to Delete):');
      console.log('-'.repeat(50));
      
      unusedKeys.forEach(({ key, files }) => {
        console.log(`❌ ${key}`);
        files.forEach(({ file, lineNumber }) => {
          console.log(`   📁 ${file}:${lineNumber}`);
        });
      });
    } else {
      console.log('✅ No unused translation keys found!');
    }
    
    // Report frozen unused keys
    if (frozenUnusedKeys.length > 0) {
      console.log('\n🔒 FROZEN UNUSED KEYS (Protected by @freeze):');
      console.log('-'.repeat(50));
      
      frozenUnusedKeys.forEach(({ key, files }) => {
        console.log(`🔒 ${key}`);
        files.forEach(({ file, lineNumber }) => {
          console.log(`   📁 ${file}:${lineNumber}`);
        });
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Show example verification
    if (this.usedKeys.has('expenseHighlighter.visionBoard.empty')) {
      console.log('\n✅ Successfully detected example key usage:');
      console.log('   expenseHighlighter.visionBoard.empty - Found in vision-board.tsx');
    } else {
      console.log('\n⚠️  Example key not detected as used - this may indicate an issue with the detection logic');
    }
    
    // Recommendations
    if (unusedKeys.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('• Review unused keys before deletion');
      console.log('• Check for dynamic key usage patterns');
      console.log('• Use @freeze comments to protect keys that should remain');
      console.log('• Run the analysis again after making changes');
      console.log('• Keys shown here are unused across ALL language files');
    }
    
    console.log('\n🔍 Use --debug flag for detailed analysis information');
  }
}

// Run the analysis
const analyzer = new TranslationAnalyzer();
analyzer.analyze(); 