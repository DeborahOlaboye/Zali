# Contributing to Zali

Thank you for your interest in contributing to Zali! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [CI/CD Requirements](#cicd-requirements)
- [Testing Requirements](#testing-requirements)
- [Code Style Guidelines](#code-style-guidelines)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- Foundry (for smart contract development)

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Zali.git
   cd Zali
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/DeborahOlaboye/Zali.git
   ```

4. Install dependencies:
   ```bash
   # Frontend dependencies
   cd frontend
   npm install

   # Smart contract dependencies
   cd ../contracts
   forge install
   ```

5. Set up environment variables:
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

## Development Workflow

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** and test locally

4. **Commit your changes** following our commit guidelines

5. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## Branch Naming Conventions

Use the following prefixes for branch names:

- `feat/` - New features
  - Example: `feat/dark-mode-toggle`
- `fix/` - Bug fixes
  - Example: `fix/login-validation`
- `docs/` - Documentation changes
  - Example: `docs/api-endpoints`
- `refactor/` - Code refactoring
  - Example: `refactor/user-service`
- `test/` - Test additions or updates
  - Example: `test/integration-tests`
- `chore/` - Maintenance tasks
  - Example: `chore/update-dependencies`
- `style/` - Code style changes (formatting, etc.)
  - Example: `style/eslint-fixes`
- `perf/` - Performance improvements
  - Example: `perf/optimize-queries`

For issue-specific branches, use:
- `issue-{number}-{description}`
  - Example: `issue-137-cicd-pipeline`

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI/CD configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
feat(frontend): add dark mode toggle component

Add a theme toggle component that allows users to switch between light,
dark, and system theme preferences. Theme preference is persisted to
localStorage and applied on page load.

Closes #150
```

```bash
fix(contracts): resolve reentrancy vulnerability in withdraw function

Add ReentrancyGuard to prevent reentrancy attacks on the withdraw
function. Update tests to verify the fix.

Fixes #142
```

```bash
docs: add deployment guide for Vercel and Netlify

Create comprehensive deployment documentation covering environment
setup, configuration, and troubleshooting for multiple platforms.
```

### Commit Message Rules

- Use the imperative mood ("add" not "added" or "adds")
- Don't capitalize the first letter of the subject
- No period at the end of the subject line
- Limit subject line to 72 characters
- Separate subject from body with a blank line
- Wrap body at 72 characters
- Reference issues and pull requests in the footer

## Pull Request Process

### Before Opening a PR

1. **Update your branch** with the latest changes from main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run all tests** and ensure they pass:
   ```bash
   # Frontend tests
   cd frontend
   npm run lint
   npm run test
   npm run build

   # Contract tests
   cd contracts
   forge test
   forge fmt --check
   ```

3. **Review your changes**:
   ```bash
   git diff main...your-branch
   ```

### Opening the PR

1. Use the pull request template provided
2. Fill in all required sections
3. Link related issues using keywords (Closes #123, Fixes #456)
4. Add appropriate labels
5. Request review from code owners (automatic via CODEOWNERS)

### PR Requirements

- [ ] All CI checks must pass
- [ ] At least 1 approving review required
- [ ] All conversations must be resolved
- [ ] Branch must be up to date with base branch
- [ ] Conventional commit format followed
- [ ] Tests added/updated for new features or bug fixes
- [ ] Documentation updated if needed

### PR Title Format

PR titles should also follow conventional commit format:

```
feat(frontend): add user authentication
fix(contracts): resolve gas optimization issue
docs: update API documentation
```

## CI/CD Requirements

All pull requests must pass the following automated checks:

### Frontend CI

- **Lint**: ESLint and TypeScript checks
- **Test**: Unit and integration tests with Jest/React Testing Library
- **E2E**: End-to-end tests with Playwright
- **Build**: Production build verification

### Contracts CI

- **Test**: Foundry test suite
- **Coverage**: Minimum 80% code coverage
- **Format**: Solidity formatting check
- **Security**: Slither static analysis

### Code Quality

- **Coverage Report**: Code coverage must not decrease
- **Bundle Size**: Frontend bundle size check
- **Security Scan**: Trivy vulnerability scanning
- **Performance**: Lighthouse performance score > 90

### PR Automation

- Auto-labeling based on changed files
- PR size labeling
- Conventional commit validation
- Auto-assign reviewers

## Testing Requirements

### Frontend Testing

1. **Unit Tests**: Test individual components and functions
   ```bash
   npm run test
   ```

2. **Integration Tests**: Test component interactions
   ```bash
   npm run test:integration
   ```

3. **E2E Tests**: Test complete user flows
   ```bash
   npm run test:e2e
   ```

### Smart Contract Testing

1. **Unit Tests**: Test individual contract functions
   ```bash
   forge test
   ```

2. **Integration Tests**: Test contract interactions
   ```bash
   forge test --match-path test/integration/**
   ```

3. **Coverage**: Generate coverage report
   ```bash
   forge coverage
   ```

4. **Gas Reports**: Check gas consumption
   ```bash
   forge test --gas-report
   ```

### Test Guidelines

- Write tests for all new features
- Update tests for bug fixes
- Maintain or improve code coverage
- Use descriptive test names
- Include edge cases and error scenarios
- Mock external dependencies appropriately

## Code Style Guidelines

### Frontend (TypeScript/React)

- Use TypeScript for type safety
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Smart Contracts (Solidity)

- Follow Solidity style guide
- Use NatSpec comments for all public functions
- Implement proper access control
- Follow checks-effects-interactions pattern
- Optimize for gas efficiency
- Use events for important state changes

### General Guidelines

- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle
- Write self-documenting code
- Add comments for complex logic
- Use consistent naming conventions

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Adding new configuration options
- Fixing significant bugs
- Updating dependencies

### Documentation Types

1. **Code Comments**: Explain complex logic
2. **README**: Project overview and quick start
3. **API Documentation**: Endpoint and function documentation
4. **User Guides**: Step-by-step instructions
5. **Architecture Docs**: System design and decisions

### Documentation Guidelines

- Keep documentation up to date with code changes
- Use clear and concise language
- Include code examples where helpful
- Add diagrams for complex flows
- Link to related documentation

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Review documentation and guides
- Check CI/CD logs for build failures

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project documentation

## License

By contributing to Zali, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Zali!** 🎉

For questions or clarifications, please open an issue or reach out to the maintainers.
