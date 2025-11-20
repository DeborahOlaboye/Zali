# Qodo Setup Guide for Zali

## Overview
Qodo has been initialized for this monorepo project with configurations for both smart contracts and frontend.

## Configuration Files
- `.qodo.yaml` - Main configuration for the entire monorepo
- `.qodoignore` - Files and directories to ignore during analysis
- `frontend/.qodo.yaml` - Frontend-specific configuration
- `frontend/.qodoignore` - Frontend-specific ignore patterns

## Key Features Enabled

### 1. Automatic Code Review
- Security vulnerability detection
- Gas optimization suggestions
- Best practices enforcement
- Web3 integration patterns

### 2. Smart Contract Analysis
- Reentrancy attack detection
- Access control validation
- Integer overflow checks
- Gas optimization recommendations

### 3. Web3 Integration
- Contract address validation
- Private key exposure detection
- MiniPay compatibility checks

### 4. Testing Requirements
- Minimum 80% coverage for smart contracts
- Minimum 70% coverage for frontend

## Custom Rules

### Solidity
- No hardcoded addresses
- Require NatSpec documentation
- Use SafeERC20 for token transfers

### TypeScript
- No console.log in production
- Use environment variables for addresses
- Proper error handling in async functions
- MiniPay feeCurrency required

## Git Integration

### Commit Format
```
<type>(<scope>): <description>

Examples:
feat(contracts): add PredictionMarket contract
fix(frontend): resolve MiniPay detection issue
```

### Protected Branches
- main
- master
- production

## Development Workflow

### Smart Contracts
```bash
cd contracts
forge build
forge test
forge coverage
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
```

## Next Steps

1. Run initial analysis: `qodo analyze`
2. Review findings: `qodo report`
3. Fix issues
4. Commit changes

---
Last Updated: November 19, 2024
