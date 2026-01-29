#!/bin/bash

# Branch Protection Setup Script
# This script automates the setup of branch protection rules for the Zali repository
# using the GitHub CLI (gh).
#
# Prerequisites:
# - GitHub CLI installed: https://cli.github.com/
# - Authenticated with gh: gh auth login
# - Repository admin access
#
# Usage:
#   ./scripts/setup-branch-protection.sh [REPO] [BRANCH]
#
# Examples:
#   ./scripts/setup-branch-protection.sh DeborahOlaboye/Zali main
#   ./scripts/setup-branch-protection.sh DeborahOlaboye/Zali develop

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO="${1:-DeborahOlaboye/Zali}"
BRANCH="${2:-main}"

echo -e "${GREEN}Branch Protection Setup for Zali${NC}"
echo "============================================"
echo "Repository: $REPO"
echo "Branch: $BRANCH"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

echo -e "${YELLOW}Setting up branch protection rules...${NC}"

# Create branch protection rule
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/$REPO/branches/$BRANCH/protection" \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "lint",
      "test",
      "e2e",
      "build",
      "contracts-test",
      "coverage",
      "security-scan"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": false,
    "bypass_pull_request_allowances": {}
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Branch protection rules applied successfully!${NC}"
else
    echo -e "${RED}✗ Failed to apply branch protection rules${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Configuration Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Required status checks enabled"
echo "  - lint, test, e2e, build (Frontend)"
echo "  - contracts-test (Smart Contracts)"
echo "  - coverage, security-scan (Code Quality)"
echo ""
echo "✓ Pull request reviews required"
echo "  - Minimum 1 approval required"
echo "  - Stale reviews dismissed on new commits"
echo "  - Code owner review required"
echo ""
echo "✓ Additional protections"
echo "  - Force pushes: disabled"
echo "  - Branch deletion: disabled"
echo "  - Conversation resolution: required"
echo "  - Branches must be up to date: enabled"
echo ""

# Verify the protection
echo -e "${YELLOW}Verifying branch protection...${NC}"
gh api "repos/$REPO/branches/$BRANCH/protection" \
  -H "Accept: application/vnd.github+json" \
  --jq '.required_status_checks.contexts[] as $check | "✓ \($check)"'

echo ""
echo -e "${GREEN}Branch protection setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify the settings in GitHub UI:"
echo "   https://github.com/$REPO/settings/branches"
echo ""
echo "2. Test the protection by trying to:"
echo "   - Push directly to $BRANCH (should fail)"
echo "   - Create a PR without passing checks (should be blocked)"
echo "   - Merge a PR without approval (should be blocked)"
echo ""
echo "3. If using develop branch, run:"
echo "   ./scripts/setup-branch-protection.sh $REPO develop"
echo ""
echo -e "${GREEN}For more information, see BRANCH_PROTECTION_SETUP.md${NC}"
