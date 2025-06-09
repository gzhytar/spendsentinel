# Scripts Documentation

This directory contains utility scripts for maintaining the SpendSentinel codebase.

## Translation Analysis Script

### Purpose
The `find-unused-translations.js` script analyzes translation files to identify unused translation keys that can be safely removed from your internationalization files. This helps maintain clean and efficient translation files.

### Usage

```bash
# Run the translation analysis
npm run i18n:check-unused

# Alternative command
npm run i18n:analyze
```

### What the Script Does

1. **Scans Translation Files**: Parses all `.ts` files in `src/lib/i18n/translations/`
2. **Extracts All Keys**: Recursively finds all translation keys with their hierarchical paths (e.g., `common.loading`, `navigation.home`)
3. **Respects Freeze System**: Identifies and protects keys marked with `@freeze` comments
4. **Searches Codebase**: Looks for translation key usage patterns in all TypeScript/JavaScript files
5. **Generates Report**: Provides detailed analysis with actionable recommendations

### Understanding the Output

The script generates a comprehensive report showing:

- **Summary Statistics**: Total keys, usage rates, frozen keys count
- **Safe to Delete**: Keys that can be removed without breaking functionality
- **Frozen Keys**: Keys protected by `@freeze` markers that need manual review
- **Actionable Recommendations**: Steps to clean up and maintain translations

### Freeze System Integration

The script fully respects the freeze system documented in `docs/localization.md`:

- `@freeze` - Protects individual keys
- `@freeze-group` / `@freeze-group-end` - Protects multiple keys in a section
- Frozen keys are flagged for manual review rather than automatic deletion

### Example Output

```
📊 TRANSLATION ANALYSIS REPORT
==================================================

📈 Summary:
  Total translation keys: 342
  Keys in use: 298
  Unused keys found: 44
  Frozen keys (protected): 23
  Usage rate: 87.1%

🗂️  EN Translation File:
   File: src/lib/i18n/translations/en.ts
   Unused keys: 12

   ✂️  SAFE TO DELETE:
      ❌ oldFeature.unusedButton (line 156)
      ❌ deprecated.message (line 203)

   🔒 FROZEN (Review needed):
      ⚠️  legal.termsUpdate (line 89) - Protected by @freeze
```

### Safety Features

- **Validation**: Only suggests removal of genuinely unused keys
- **Freeze Protection**: Respects manually protected translations
- **Dynamic Key Handling**: Accounts for template-based key construction
- **Import Filtering**: Ignores keys found in import statements

### Best Practices

1. **Run Regularly**: Execute monthly or before major releases
2. **Review Frozen Keys**: Manually evaluate protected unused keys
3. **Test After Changes**: Always test thoroughly after removing keys
4. **Backup First**: Consider creating a backup before mass deletion
5. **Team Coordination**: Ensure all team members understand frozen keys

### Integration with CI/CD

Consider adding this to your development workflow:

```json
{
  "scripts": {
    "precommit": "npm run i18n:check-unused && npm run lint",
    "prerelease": "npm run i18n:check-unused && npm run build"
  }
}
```

### Troubleshooting

**False Positives**: If the script flags keys as unused but they are actually used:
- Check for dynamic key construction patterns
- Verify keys aren't used in external configuration files
- Consider adding `@freeze` markers for special cases

**Missing Dependencies**: If you get module errors:
```bash
npm install glob
```

**Permission Issues**: On Unix systems, ensure the script is executable:
```bash
chmod +x scripts/find-unused-translations.js
```

### Contributing

When modifying translation files:
- Use `@freeze` for important keys that should never be auto-removed
- Document the reason for freezing keys
- Run the analysis before submitting PRs that modify translations
- Update this documentation if you extend the script functionality 