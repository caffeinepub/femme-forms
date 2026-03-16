# femme forms

## Current State
Art shop with artworks, jewelry, orders, contact messages, shimmery silver design. Backend has authorization requiring `_initializeAccessControlWithSecret(token)` to register users. First call with correct CAFFEINE_ADMIN_TOKEN becomes admin. Problem: frontend never calls this after login so admin access always fails.

## Requested Changes (Diff)

### Add
- AdminSetupPage at /admin/setup: owner enters admin token, calls `_initializeAccessControlWithSecret(token)`, on success redirects to /admin dashboard.
- Auto-register hook: after login, call `_initializeAccessControlWithSecret("")` to register as regular user.
- Route /admin/setup in App.tsx.

### Modify
- AccessDeniedScreen: if logged in but not admin, show "Set Up Admin Access" button linking to /admin/setup with clear instructions on where to find the admin token (Caffeine project settings).
- App.tsx: add /admin/setup route (no auth guard).

### Remove
- Nothing.

## Implementation Plan
1. Create useAutoRegister hook - calls `_initializeAccessControlWithSecret("")` once after identity is available, silently.
2. Invoke hook in App.tsx so every logged-in user auto-registers.
3. Create AdminSetupPage with token input field; on submit calls `_initializeAccessControlWithSecret(token)`, then checks `isCallerAdmin()`, redirects to /admin on true, shows error on false.
4. Update AccessDeniedScreen to show a "Set Up Admin Access" button (visible when logged in but denied).
5. Register /admin/setup route without auth guard in App.tsx.
