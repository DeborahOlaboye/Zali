# 🚀 Qodo Quick Reference

## 📋 Common Commands

### Analysis
```bash
# Analyze entire project
qodo analyze

# Analyze specific directory
qodo analyze contracts/
qodo analyze frontend/

# Generate report
qodo report

# Check specific file
qodo check contracts/src/TriviaGame.sol
```

### Code Review
```bash
# Review changes
qodo review

# Review specific commit
qodo review <commit-hash>

# Review pull request
qodo review --pr <pr-number>
```

### Testing
```bash
# Run tests with coverage
qodo test

# Check coverage
qodo coverage

# Test specific file
qodo test contracts/test/Faucet.t.sol
```

### Documentation
```bash
# Generate documentation
qodo docs

# Update documentation
qodo docs --update
```

## 🔍 Quick Checks

### Before Commit
```bash
# Run all checks
qodo pre-commit

# Check commit message
qodo commit-msg "feat(contracts): add new feature"
```

### Security Scan
```bash
# Full security scan
qodo security

# Check for secrets
qodo secrets

# Dependency audit
qodo audit
```

### Gas Optimization
```bash
# Analyze gas usage
qodo gas

# Get optimization suggestions
qodo optimize
```

## 📝 Commit Message Format

```
<type>(<scope>): <description>

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation
  style    - Formatting
  refactor - Code restructuring
  test     - Adding tests
  chore    - Maintenance

Scopes:
  contracts - Smart contract changes
  frontend  - Frontend changes
  root      - Root level changes

Examples:
  ✅ feat(contracts): add PredictionMarket contract
  ✅ fix(frontend): resolve wallet connection issue
  ✅ docs(root): update README
  ✅ test(contracts): add Faucet tests
  ❌ updated code
  ❌ fixed bug
```

## 🎯 Project-Specific Checks

### Smart Contracts
```bash
# Check for reentrancy
qodo check --reentrancy contracts/src/

# Validate access control
qodo check --access-control contracts/src/

# Gas optimization
qodo optimize contracts/src/TriviaGame.sol
```

### Frontend
```bash
# Check MiniPay compatibility
qodo check --minipay frontend/src/

# Validate Web3 integration
qodo check --web3 frontend/src/hooks/

# Check mobile optimization
qodo check --mobile frontend/src/
```

## 🔧 Configuration

### View Current Config
```bash
qodo config show
```

### Update Config
```bash
# Edit main config
nano .qodo.yaml

# Edit ignore patterns
nano .qodoignore
```

### Validate Config
```bash
qodo config validate
```

## 📊 Reports

### Generate Reports
```bash
# Full report
qodo report --full

# Security report
qodo report --security

# Coverage report
qodo report --coverage

# Gas report
qodo report --gas
```

### Export Reports
```bash
# Export as JSON
qodo report --format json > report.json

# Export as HTML
qodo report --format html > report.html

# Export as Markdown
qodo report --format md > report.md
```

## 🐛 Troubleshooting

### Common Issues

**Issue: Files not being analyzed**
```bash
# Check ignore patterns
cat .qodoignore

# Force analysis
qodo analyze --force
```

**Issue: False positives**
```bash
# Add exception in .qodo.yaml
# Under custom_rules, add exclude patterns
```

**Issue: Slow analysis**
```bash
# Analyze incrementally
qodo analyze --incremental

# Exclude large directories
echo "node_modules/" >> .qodoignore
```

## 🎓 Best Practices

### Daily Workflow
1. `qodo analyze` - Start of day
2. Make changes
3. `qodo check <file>` - After each file
4. `qodo test` - Before commit
5. `qodo pre-commit` - Before committing
6. Commit with proper format

### Before Deployment
1. `qodo analyze --full`
2. `qodo security`
3. `qodo test --coverage`
4. `qodo report --full`
5. Review all findings
6. Fix critical issues

### Code Review
1. `qodo review --pr <number>`
2. Check security findings
3. Verify test coverage
4. Review gas optimization
5. Approve or request changes

## 📚 Resources

- [Full Setup Guide](./QODO_SETUP.md)
- [Project README](./README.md)
- [Build Guide](./zali.md)
- [Qodo Docs](https://qodo.ai/docs)

## 🆘 Help

```bash
# Get help
qodo --help

# Command-specific help
qodo analyze --help
qodo review --help
qodo test --help
```

---
**Quick Tip:** Add `alias q='qodo'` to your shell for faster commands!
