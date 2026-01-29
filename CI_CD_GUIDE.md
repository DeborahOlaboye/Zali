# CI/CD Pipeline Guide

## Overview

This document describes the CI/CD pipeline setup for the Zali project, including automated testing, code quality checks, and deployment processes.

## Workflows

### 1. Frontend CI (`frontend-ci.yml`)

Runs on every PR and push to `main`/`develop` branches when frontend code changes.

**Jobs:**
- **Lint**: ESLint and TypeScript checks
- **Test**: Unit tests with Jest
- **E2E**: End-to-end tests with Playwright
- **Build**: Next.js production build

**Artifacts:**
- Test coverage reports
- Playwright test reports
- Build output

### 2. Contracts CI (`contracts-ci.yml`)

Runs on every PR and push to `main`/`develop` branches when contract code changes.

**Jobs:**
- **Test**: Foundry unit tests
- **Lint**: Solidity formatting checks
- **Gas Report**: Gas usage analysis
- **Slither**: Security analysis

**Artifacts:**
- Coverage reports
- Gas snapshots
- Security scan results

### 3. Deploy Production (`deploy-production.yml`)

Runs on push to `main` branch or manually via workflow dispatch.

**Jobs:**
- **Deploy**: Build and deploy to Vercel
  - Runs tests before deployment
  - Creates Sentry release
  - Sends notifications

### 4. Code Quality (`code-quality.yml`)

Runs on all PRs and pushes.

**Jobs:**
- **Coverage**: Generate and upload code coverage
- **Bundle Size**: Check bundle size against budget
- **Dependency Review**: Security check for dependencies
- **Security Scan**: Trivy vulnerability scanning
- **Lighthouse**: Performance testing

### 5. PR Automation (`pr-automation.yml`)

Runs on PR open, edit, or synchronize.

**Jobs:**
- **Label**: Auto-label PRs based on changed files
- **Size**: Add size labels
- **Lint PR Title**: Enforce conventional commit format
- **Auto Assign**: Assign reviewers
- **Comment**: Welcome message with checklist
- **Conventional Commits**: Validate commit messages
- **Verify Links**: Check broken links

## Required Secrets

Configure these in GitHub repository settings:

### Deployment
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `VERCEL_SCOPE`: Vercel team scope

### Environment Variables
- `NEXT_PUBLIC_SUBGRAPH_URL`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_USDC_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_NETWORK_NAME`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_ALCHEMY_ID`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_MIXPANEL_TOKEN`

### Monitoring
- `SENTRY_AUTH_TOKEN`: Sentry API token
- `SENTRY_ORG`: Sentry organization
- `SENTRY_PROJECT`: Sentry project name

### Notifications
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

### Code Coverage
- `CODECOV_TOKEN`: Codecov upload token

## Branch Protection Rules

Recommended settings for `main` branch:

1. **Require pull request reviews**
   - Require 1 approval
   - Dismiss stale reviews when new commits are pushed

2. **Require status checks to pass**
   - Frontend CI: Lint, Test, E2E, Build
   - Contracts CI: Test, Lint
   - Code Quality: Coverage
   - All conversations resolved

3. **Require branches to be up to date**
   - Enable

4. **Do not allow bypassing the above settings**

5. **Restrict who can push to matching branches**
   - Maintainers only

## Local Development

### Running Tests Locally

```bash
# Frontend tests
cd frontend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run lint           # Linting

# Contract tests
cd contracts
forge test             # Run tests
forge coverage         # Coverage
forge fmt --check      # Format check
```

### Pre-commit Hooks

Install pre-commit hooks to run checks locally:

```bash
# Install husky
npm install --save-dev husky

# Setup hooks
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"
```

## Deployment Process

### Automatic Deployment

- **Production**: Automatically deploys when code is merged to `main`
- **Preview**: Automatically creates preview for all PRs

### Manual Deployment

Trigger manual deployment via GitHub Actions:

1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"
4. Select environment (production/staging)
5. Click "Run workflow"

## Monitoring & Alerts

### Code Coverage

- Reports uploaded to Codecov
- PR comments show coverage diff
- Minimum coverage: 80%

### Performance

- Lighthouse CI runs on PRs
- Performance budgets enforced
- Bundle size tracked

### Security

- Dependency scanning on PRs
- Trivy vulnerability scanning
- Slither static analysis for contracts

## Troubleshooting

### Failed CI Checks

1. **Linting Failures**
   ```bash
   npm run lint --fix
   ```

2. **Test Failures**
   - Check test logs in GitHub Actions
   - Run locally: `npm test`
   - Update snapshots if needed

3. **Build Failures**
   - Verify environment variables
   - Check for TypeScript errors
   - Ensure all dependencies are installed

### Deployment Failures

1. Check Vercel deployment logs
2. Verify all secrets are configured
3. Check Sentry for runtime errors
4. Review build output artifacts

## Best Practices

1. **Write Tests**
   - Add tests for new features
   - Maintain test coverage above 80%
   - Include E2E tests for critical flows

2. **Follow Conventions**
   - Use conventional commit messages
   - Keep PRs focused and small
   - Update documentation

3. **Review Before Merge**
   - Ensure all CI checks pass
   - Get code review approval
   - Squash commits if needed

4. **Monitor Production**
   - Check Sentry for errors
   - Monitor performance metrics
   - Review deployment notifications

## Continuous Improvement

The CI/CD pipeline is continuously improved based on:
- Build times
- Test reliability
- Developer feedback
- Production incidents

Suggest improvements by opening an issue or PR!

## Related Documentation

- [Deployment Guide](./frontend/DEPLOYMENT.md)
- [Testing Guide](./frontend/TESTING.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## Support

For CI/CD issues:
1. Check this documentation
2. Review GitHub Actions logs
3. Contact the maintainers

---

**Last Updated**: 2026-01-29
**Version**: 1.0.0
