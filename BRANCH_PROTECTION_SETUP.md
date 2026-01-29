# Branch Protection Setup Guide

## Overview

This guide helps you configure branch protection rules for the Zali repository to ensure code quality and prevent accidental changes to critical branches.

## Main Branch Protection

### Prerequisites

- Repository admin access
- CI/CD workflows deployed and functional

### Step-by-Step Setup

#### 1. Access Branch Protection Settings

1. Navigate to repository settings
2. Click "Branches" in the left sidebar
3. Under "Branch protection rules", click "Add rule"
4. Enter `main` as the branch name pattern

#### 2. Required Status Checks

Enable "Require status checks to pass before merging"

Check these required status checks:
- ✅ `lint` (Frontend CI)
- ✅ `test` (Frontend CI)
- ✅ `e2e` (Frontend CI)
- ✅ `build` (Frontend CI)
- ✅ `test` (Contracts CI)
- ✅ `coverage` (Code Quality)

Options:
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

#### 3. Pull Request Reviews

Enable "Require a pull request before merging"

Settings:
- Required approving reviews: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (if CODEOWNERS file exists)
- ❌ Restrict who can dismiss pull request reviews (optional)
- ✅ Allow specified actors to bypass required pull requests (maintainers only)

#### 4. Restrict Push Access

Enable "Restrict who can push to matching branches"

Settings:
- Add: **Maintainers** team
- Add: Specific trusted contributors (if applicable)

#### 5. Additional Settings

- ✅ Require linear history (optional - enforces squash or rebase merges)
- ✅ Require deployments to succeed before merging (if using GitHub Deployments)
- ✅ Lock branch (prevents any pushes - use cautiously)
- ✅ Do not allow bypassing the above settings
- ❌ Allow force pushes (keep disabled)
- ❌ Allow deletions (keep disabled)

### Verification

After setup, try to:
1. Push directly to `main` (should fail)
2. Create a PR without passing checks (should be blocked)
3. Merge a PR without approval (should be blocked)

## Develop Branch Protection

For the `develop` branch (if using GitFlow):

1. Follow similar steps as main branch
2. Adjust required reviews to 1
3. Keep status checks required
4. Allow more flexibility for experimentation

Pattern: `develop`

Required checks:
- Same as main branch

Reviews required: 1

## Feature Branch Naming

Enforce branch naming conventions:

Pattern examples:
- `feat/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation
- `refactor/*` - Code refactoring
- `test/*` - Test additions/updates
- `chore/*` - Maintenance tasks

### Setup Branch Naming Rules

While GitHub doesn't natively enforce branch naming, you can:

1. Document naming conventions in CONTRIBUTING.md
2. Use PR automation to check branch names
3. Add pre-push git hooks

## CODEOWNERS File

Create `.github/CODEOWNERS` to automatically request reviews:

```
# Global owners
* @DeborahOlaboye

# Frontend
/frontend/ @frontend-team

# Contracts
/contracts/ @contracts-team

# CI/CD
/.github/ @devops-team

# Documentation
*.md @docs-team
```

## GitHub Environments

Set up protected environments for deployments:

### Production Environment

1. Go to Settings → Environments
2. Create "production" environment
3. Configure:
   - ✅ Required reviewers: Add maintainers
   - ✅ Wait timer: 5 minutes (optional)
   - ✅ Deployment branches: Only `main`

### Staging Environment

1. Create "staging" environment
2. Configure:
   - Deployment branches: `main`, `develop`
   - No required reviewers

## Automation Scripts

### Using GitHub CLI

```bash
#!/bin/bash
# setup-branch-protection.sh

REPO="DeborahOlaboye/Zali"
BRANCH="main"

gh api repos/$REPO/branches/$BRANCH/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["lint","test","e2e","build"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  -f restrictions=null
```

### Using Terraform

```hcl
resource "github_branch_protection" "main" {
  repository_id = "DeborahOlaboye/Zali"
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = ["lint", "test", "e2e", "build"]
  }

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = false
    required_approving_review_count = 1
  }

  enforce_admins = true
}
```

## Monitoring

Monitor branch protection compliance:

1. Review merged PRs weekly
2. Check for force pushes in audit log
3. Verify CI/CD success rates
4. Update rules based on team feedback

## Troubleshooting

### Status Check Not Appearing

1. Ensure workflow has run at least once
2. Check workflow file syntax
3. Verify workflow targets the correct branch
4. Wait up to 1 hour for GitHub to register the check

### Can't Merge Despite Passing Checks

1. Verify branch is up to date
2. Check all conversations are resolved
3. Ensure required reviews are approved
4. Check if admin bypass is needed

### Need to Hotfix Production

If emergency changes are needed:

1. Contact repository admin
2. Request temporary rule bypass
3. Create PR as normal
4. Fast-track review process
5. Re-enable protection immediately after merge

## Best Practices

1. **Start Strict**: It's easier to relax rules than tighten them
2. **Document Exceptions**: Keep a log of when/why rules were bypassed
3. **Regular Reviews**: Review protection rules quarterly
4. **Team Input**: Get feedback from contributors on rules
5. **Automate Everything**: Use CI/CD for all checks possible

## Related Documentation

- [CI/CD Guide](./CI_CD_GUIDE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [GitHub Docs: Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

---

**Last Updated**: 2026-01-29
**Version**: 1.0.0
