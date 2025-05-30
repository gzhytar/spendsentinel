# Version-Based localStorage Cleanup

This document explains how the automatic localStorage cleanup system works in the SpendSentinel app.

## Overview

The app automatically manages localStorage cleanup based on version changes to prevent conflicts when releasing new features or fixing bugs. This ensures all users get a clean, working experience after updates.

## How It Works

### Automatic Detection
- The app checks the stored version in localStorage against the current app version on every startup
- Version information is stored in the `app_version` localStorage key
- Cleanup operations are logged in `cleanup_history` for debugging

### Cleanup Strategies

#### 1. Major Version Updates (e.g., 1.x.x → 2.x.x)
- **Action**: Complete localStorage cleanup (except version info)
- **Reason**: Major structural changes that require fresh data
- **User Impact**: All progress reset, like a fresh install
- **Trigger**: Set `clearAllOnMajorUpdate: true` in VersionManager config

#### 2. Minor Version Updates (e.g., 2.1.x → 2.2.x)
- **Action**: Selective cleanup of problematic keys
- **Reason**: Specific features changed that need reset
- **User Impact**: Only affected features reset
- **Trigger**: Specified in `clearSpecificKeys` array

#### 3. Patch Updates (e.g., 2.1.1 → 2.1.2)
- **Action**: Data migration and corruption repair
- **Reason**: Bug fixes that don't change data structure
- **User Impact**: Data preserved and improved
- **Trigger**: `migrateData: true` in config

## Configuration

### Current Setup
```typescript
// In src/app/[lang]/layout.tsx
const CURRENT_VERSION = '2.1.0';

useStorageCleanup({
  strategy: 'version',
  currentVersion: CURRENT_VERSION,
  autoRepair: true,
  onCleanup: (info) => {
    console.log(`Storage cleanup completed: ${info.clearedItems} items removed`);
  }
});
```

### Version Manager Config
```typescript
VersionManager.initializeVersion({
  currentVersion: CURRENT_VERSION,
  clearAllOnMajorUpdate: true,
  clearSpecificKeys: ['dailyCheckInProgress', 'completedCheckIns'],
  migrateData: true,
  showUserNotification: true
});
```

## localStorage Keys Managed

The system tracks these app-specific keys:
- `dailyCheckInProgress` - Daily check-in state
- `completedCheckIns` - Check-in completion history  
- `calmHistory` - Self-compassion score history
- `expenses` - Expense tracking data
- `visionBoardItems` - User's vision board
- `selfAssessmentResults` - Assessment results
- `quizResults` - Quick quiz results
- `deepAssessmentResults` - Deep assessment results
- `dailyCheckInReturnContext` - Navigation state

## Data Migration Examples

### Expense Migration (v2.0.0)
```typescript
// Ensures all expenses have required fields
const migratedExpenses = parsed.map((expense: any) => ({
  id: expense.id || Date.now().toString(),
  amount: Number(expense.amount) || 0,
  description: expense.description || 'Unknown',
  category: expense.category || 'unassigned',
  date: expense.date || new Date().toISOString().split('T')[0],
  type: expense.type || 'expense', // New field in v2.0
  triggeredParts: expense.triggeredParts || []
}));
```

### Assessment Results Migration (v2.2.0)
```typescript
// Adds locale field to old assessment results
if (!parsed.locale) {
  parsed.locale = 'en'; // Default locale for old results
  localStorage.setItem('quizResults', JSON.stringify(parsed));
}
```

## Release Workflow

### 1. Normal Release (Minor/Patch)
```bash
# For minor version (new features)
npm run version:minor

# For patch version (bug fixes)  
npm run version:patch

# Full release with checks
npm run release
```

### 2. Major Release (Breaking Changes)
```bash
# Major version (will clear all user data)
npm run version:major
npm run deploy:major
```

### 3. Emergency Cleanup
```bash
# Forces cleanup for all users on next visit
npm run deploy:with-cleanup
```

## Manual Version Updates

1. **Update package.json version**:
   ```bash
   npm version minor  # or major/patch
   ```

2. **Run the version sync script**:
   ```bash
   npm run update-version
   ```

3. **Update CURRENT_VERSION in layout.tsx** (done automatically by script):
   ```typescript
   const CURRENT_VERSION = '2.2.0';
   ```

## Debugging

### View Version Info
Add `?debug=true` to any URL to see the VersionInfo component:
```
http://localhost:9002/en?debug=true
```

### Console Logs
The system logs all cleanup operations:
```
✅ App updated from 2.0.0 to 2.1.0
Cleared problematic keys for version transition 2.0.0 -> 2.1.0
Migrated 15 expenses to v2.0 format
```

### Manual Cleanup
```typescript
// Emergency cleanup (dev console)
VersionManager.forceCleanup();

// Repair corrupted data
CleanupManager.repairCorrupted();

// Get storage info
VersionManager.getVersionInfo();
```

## Best Practices

### When to Use Each Strategy

#### Major Version (Full Cleanup)
- Complete UI redesign
- Database schema changes
- New authentication system
- Major feature overhauls

#### Minor Version (Selective Cleanup)
- New optional features
- Changes to specific data formats
- Feature deprecations
- Navigation structure changes

#### Patch Version (Migration Only)
- Bug fixes
- Performance improvements
- Security updates
- Minor UI tweaks

### Version Numbering
Follow semantic versioning:
- **Major** (X.0.0): Breaking changes requiring full reset
- **Minor** (X.Y.0): New features with selective cleanup
- **Patch** (X.Y.Z): Bug fixes with data preservation

### Testing Versions
1. Test locally with different version numbers
2. Use debug mode to monitor cleanup operations
3. Verify data migration works correctly
4. Check that user experience is smooth

## Troubleshooting

### Common Issues

#### Version Not Updating
- Check `CURRENT_VERSION` in layout.tsx matches package.json
- Verify cleanup hook is properly configured
- Clear browser cache and localStorage manually

#### Data Loss After Update
- Check if major version update was intended
- Review cleanup logs in browser console
- Use `CleanupManager.getCleanupHistory()` to see what happened

#### Corrupted Data
- The system auto-repairs corrupted JSON data
- Force cleanup as last resort
- Check browser console for migration errors

### Recovery
If users experience issues after an update:

1. **Immediate fix**: Temporarily force cleanup for all users
2. **Medium term**: Fix the migration logic and release patch
3. **Long term**: Improve testing process for version changes

## Environment Variables

Control cleanup behavior via environment variables:

```bash
# Force cleanup for all users (temporary)
NEXT_PUBLIC_FORCE_CLEANUP=true

# Cleanup specific keys only
NEXT_PUBLIC_CLEANUP_KEYS=dailyCheckInProgress,completedCheckIns
```

## Monitoring

Track cleanup operations through:
- Browser console logs
- Custom events (`app-updated`, `app-major-update`)
- VersionInfo component in debug mode
- Cleanup history in localStorage 