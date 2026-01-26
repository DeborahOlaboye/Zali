# Developer Guide: TODO Comments and Issue Tracking Policy

## Overview

This guide establishes best practices for tracking work items in the Zali codebase. As of Issue #147, the project has deprecated TODO comments in favor of GitHub Issues for better tracking and team visibility.

---

## Table of Contents

1. [Why GitHub Issues Instead of TODO Comments?](#why-github-issues)
2. [Creating GitHub Issues](#creating-github-issues)
3. [Comment Standards](#comment-standards)
4. [Linking Code to Issues](#linking-code-to-issues)
5. [Issue Templates](#issue-templates)
6. [Best Practices](#best-practices)

---

## Why GitHub Issues Instead of TODO Comments?

### Problems with TODO Comments

1. **Hard to Track**
   - TODO comments get lost in large codebases
   - No centralized tracking mechanism
   - Difficult to search and prioritize

2. **No Accountability**
   - Comments don't track who reported the work
   - No deadline or priority system
   - Can be forgotten indefinitely

3. **Lack of Context**
   - Limited space for problem description
   - No discussion thread or decision history
   - Difficult to understand why something is needed

4. **No Integration**
   - Can't link to PRs automatically
   - No milestone tracking
   - Can't assign to team members
   - No progress visibility

### Benefits of GitHub Issues

✅ **Centralized Tracking**
   - All work visible in one place
   - Project board integration
   - Searchable and filterable

✅ **Team Collaboration**
   - Assign to developers
   - @ mentions for discussions
   - Comment history and decisions

✅ **Automated Workflows**
   - Link PRs to close issues
   - Milestone tracking
   - Workflow automation (labels, assignments)

✅ **Visibility & Accountability**
   - Clear ownership
   - Priority and difficulty estimates
   - Completion tracking

---

## Creating GitHub Issues

### Step 1: Identify the Work

When you discover incomplete work or a feature that needs implementation, ask:

- Is this a bug that needs fixing?
- Is this a feature that needs building?
- Is this a refactoring task?
- Is this a security issue?
- Is this a documentation task?

### Step 2: Create the Issue

**In the GitHub Repository:**

1. Go to Issues tab
2. Click "New Issue"
3. Select appropriate template (or create custom)
4. Fill in required sections:
   - **Title:** Clear, concise description
   - **Description:** Problem statement and requirements
   - **Type:** Bug, Feature, Chore, Security, Documentation
   - **Priority:** Critical, High, Medium, Low
   - **Effort:** Quick (<1h), Moderate (1-3h), Large (3+h)

### Step 3: Link Code References

When creating an issue that references code:

```markdown
## Related Code
- File: `src/hooks/useRewardManagement.ts` (line 216)
- Current state: `unclaimedSessions: []` (hardcoded)
- Issue: Feature not implemented

## Context
See commit `abc123` and Issue #147 for background.
```

---

## Comment Standards

### Approved Comment Types

#### 1. FEATURE Comments (with GitHub Issue Reference)

```typescript
// FEATURE: Load game session from API
// See GitHub Issue #148 for full implementation
// Required: Fetch active game session data and update state
const loadGameSession = async (sessionId: string) => {
  // Implementation pending
};
```

#### 2. SECURITY Comments (with GitHub Issue Reference)

```typescript
// SECURITY: Implement actual signature verification
// See GitHub Issue #149 for full implementation
// Current implementation: accepts all frames without validation
const validateFrameSignature = () => {
  return { valid: true }; // ⚠️ Temporary
};
```

#### 3. FIXME Comments (for Critical Bugs)

Use sparingly - only for active bugs:

```typescript
// FIXME: Race condition when updating balance
// Can result in stale cache if called rapidly
// Temporary workaround: add debounce
const updateBalance = () => {
  // ...
};
```

#### 4. HACK Comments (for Temporary Solutions)

```typescript
// HACK: Using setTimeout because proper event emitter isn't set up
// TODO: Replace with proper event system once integrated
setTimeout(() => {
  setBalance(newBalance);
}, 100);
```

#### 5. NOTE Comments (for Important Context)

```typescript
// NOTE: This calculation must match the smart contract math exactly
// Rounding differences here will cause discrepancies on-chain
const calculateReward = (points: number) => {
  return points * 1.5; // Must be IEEE 754 compliant
};
```

### Prohibited Comment Types

❌ **TODO Comments**
```typescript
// TODO: Implement unclaimed sessions logic ← Don't do this!
// Create GitHub Issue instead
```

❌ **Vague Markers**
```typescript
// TODO: Fix this later ← Too vague
// FIXME: Something is wrong ← Insufficient context
// XXX: This needs work ← Outdated convention
```

---

## Linking Code to Issues

### In Code Comments

When code references an upcoming feature or fix:

```typescript
// Reference the GitHub issue in comments
// Example format:
// FEATURE: [Description]
// See GitHub Issue #[NUMBER] for full details
// Required: [what needs to be done]
```

### In Commit Messages

Link issues when committing related work:

```bash
# When fixing code related to an issue
git commit -m "Implement feature - closes #150"

# When documenting an issue
git commit -m "Add documentation for issue #150"

# When referencing (not closing)
git commit -m "Refactor code related to #150"
```

### In Pull Requests

Always link related issues:

```markdown
## Related Issues

Closes #148 - Toast Notification System Implementation
References #147 - TODO Comments Resolution

## Description

This PR implements the toast notification system...
```

---

## Issue Templates

### Feature Request Template

```markdown
## Description
Clear description of the feature and why it's needed.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Notes
Technical approach and considerations.

## Related Files
- `src/path/to/file.ts` (line XXX)

## Effort Estimate
- [ ] Quick (<1h)
- [ ] Moderate (1-3h)
- [ ] Large (3+h)

## Priority
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low
```

### Bug Report Template

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Affected Code
- File: `src/path/to/file.ts` (line XXX)
- Function: `functionName()`

## Environment
- Node version: X.XX.X
- Browser: Chrome/Firefox/Safari
- OS: macOS/Windows/Linux

## Screenshots/Logs
If applicable, add screenshots or error logs.
```

### Refactoring Template

```markdown
## Description
Why is refactoring needed?

## Scope
Files and components affected.

## Benefits
Improved performance, maintainability, type safety, etc.

## Testing
How will you validate the refactoring?

## Effort Estimate
- [ ] Quick (<1h)
- [ ] Moderate (1-3h)
- [ ] Large (3+h)
```

---

## Best Practices

### 1. Create Issues Early

Don't wait until code is complete:
- Create issue as soon as you identify work
- Use issues for discussion and planning
- Update as understanding evolves

### 2. Write Clear Titles

Good:
- "Implement Farcaster frame signature verification"
- "Fix race condition in balance update"
- "Add error handling for network timeouts"

Bad:
- "Implement feature"
- "Fix bug"
- "Improve code"

### 3. Include Acceptance Criteria

```markdown
## Acceptance Criteria
- [ ] Frame signatures are validated using hub-nodejs
- [ ] Invalid frames return appropriate error messages
- [ ] Validation errors are logged for debugging
- [ ] Unit tests cover common failure scenarios
- [ ] Security audit completed before merge
```

### 4. Link Related Issues

```markdown
## Related Issues
- Closes #123 (depends on completion)
- References #124 (related feature)
- Blocks #125 (this must complete first)
```

### 5. Use Labels for Organization

Apply labels for quick filtering:
- `type: feature` / `type: bug` / `type: chore`
- `priority: critical` / `priority: high`
- `effort: quick` / `effort: moderate` / `effort: large`
- `status: in-progress` / `status: blocked`
- `review-needed` / `documentation-needed`

### 6. Update Issues Regularly

Keep issues current:
- Add comments as you discover more
- Update estimates if they change
- Link PRs when work starts
- Close with summary when complete

### 7. Use Milestones for Planning

Group related issues:
- Create milestone for each sprint
- Link issues to relevant milestone
- Track progress with milestone dashboard

---

## Migration from TODO Comments

### How to Migrate Existing TODOs

If you find old TODO comments:

1. **Create GitHub Issue**
   - Use appropriate template
   - Copy TODO context into description
   - Set priority and effort

2. **Update Code Comment**
   ```typescript
   // OLD:
   // TODO: Implement feature X

   // NEW:
   // FEATURE: Implement feature X
   // See GitHub Issue #999 for details
   ```

3. **Link the Issue**
   - Add issue number to comment
   - Close issue when work is done

### Tracking Migration

During Issue #147, the following TODOs were migrated:

- [x] useContractUtils.ts
- [x] useContractRead.ts
- [x] useContractWrite.ts (2x)
- [x] useEnhancedContract.ts (2x)
- [x] gameSlice.ts → Issue #148
- [x] frameUtils.ts → Issue #149
- [x] useRewardManagement.ts → Issue #151

All 9 TODOs have been resolved. Search codebase for any remaining TODO comments during code review.

---

## Code Review Checklist

When reviewing code, check:

- ✅ No `// TODO:` comments in new code
- ✅ FEATURE/SECURITY/FIXME comments reference GitHub issues
- ✅ Comments are clear and provide context
- ✅ Related GitHub issues are linked in PR
- ✅ Acceptance criteria met for linked issues

---

## Resources

- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [Linking PRs to Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
- [Project Board Management](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues)
- [Zali Issue #147: TODO Resolution](../../issues/147)

---

## Questions?

If you have questions about this policy or need clarification:
1. Check existing issues for examples
2. Ask in PR review comments
3. Bring up in team meetings
4. Reference this guide

---

*Last Updated: Issue #147 - TODO Comments Resolution*  
*Applies to: All frontend and backend code*  
*Enforced by: Code review*
