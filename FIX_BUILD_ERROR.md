# 🔧 Fix Build Error - GameState Export

## Error Description

```
Export GameState doesn't exist in target module
```

This error occurs because Next.js is caching an old version of the `play/page.tsx` file that imported `GameState` from the old contract configuration.

---

## ✅ Solution

### Option 1: Quick Fix (Recommended)

Run the cleanup script:

```bash
cd frontend
./fix-build.sh
```

### Option 2: Manual Fix

```bash
cd frontend

# 1. Stop the dev server (Ctrl+C)

# 2. Clean Next.js cache
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 3. Restart dev server
npm run dev
```

### Option 3: Nuclear Option (If above doesn't work)

```bash
cd frontend

# 1. Stop dev server

# 2. Remove all caches and node_modules
rm -rf .next
rm -rf node_modules
rm -rf .turbo
rm -rf node_modules/.cache

# 3. Reinstall dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## 🔍 Why This Happens

Next.js (especially with Turbopack) caches compiled files for faster builds. When we updated the files, the cache wasn't cleared, so it's still trying to use the old imports.

---

## ✅ Verification

After cleaning the cache, verify the build works:

1. **Check the terminal** - Should see "compiled successfully"
2. **Open browser** - http://localhost:3000
3. **Navigate to /play** - Should load without errors
4. **Check console** - No import errors

---

## 📝 What Was Changed

### Old Code (Causing Error)
```typescript
import { GameState, CONTRACTS } from '@/config/contracts';
```

### New Code (Correct)
```typescript
import { GAME_CONSTANTS } from '@/config/contracts';
```

The `GameState` enum was removed because TriviaGameV2 doesn't use the same game state system as the old contract.

---

## 🎯 Current File Status

All files are correct:
- ✅ `frontend/src/config/contracts.ts` - No GameState export
- ✅ `frontend/src/app/play/page.tsx` - Doesn't import GameState
- ✅ `frontend/src/hooks/useContract.ts` - Updated for TriviaGameV2

The issue is **only** the Next.js cache.

---

## 🚀 After Fix

Once the cache is cleared, you should be able to:

1. ✅ Navigate to all pages without errors
2. ✅ Register username
3. ✅ Start games
4. ✅ View rewards
5. ✅ Check leaderboard
6. ✅ View profile

---

## 💡 Pro Tip

If you encounter similar cache issues in the future:

```bash
# Quick cache clear command
cd frontend && rm -rf .next .turbo node_modules/.cache && npm run dev
```

Or add this to your `package.json`:

```json
{
  "scripts": {
    "clean": "rm -rf .next .turbo node_modules/.cache",
    "dev:clean": "npm run clean && npm run dev"
  }
}
```

Then run:
```bash
npm run dev:clean
```

---

## ✅ Summary

**Problem:** Next.js cache has old file version  
**Solution:** Clear cache and rebuild  
**Command:** `./fix-build.sh` or manually delete `.next` folder  

**Your code is correct - it's just a cache issue! 🎉**
