#!/bin/bash

# Test execution script for Zali contracts
# This script provides convenient ways to run the contract test suite

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONTRACTS_DIR="$SCRIPT_DIR/contracts"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if foundry is installed
check_foundry() {
    if ! command -v forge &> /dev/null; then
        print_error "Foundry not found. Please install it:"
        echo "curl -L https://foundry.paradigm.xyz | bash"
        exit 1
    fi
}

# Run all tests
run_all_tests() {
    print_info "Running all contract tests..."
    cd "$CONTRACTS_DIR"
    forge test "$@"
    print_success "All tests passed!"
}

# Run specific test file
run_test_file() {
    local test_file=$1
    print_info "Running tests from $test_file..."
    cd "$CONTRACTS_DIR"
    forge test --match-path "*/$test_file" -v
    print_success "Tests passed!"
}

# Run specific test function
run_test_function() {
    local contract=$1
    local function=$2
    print_info "Running $contract::$function..."
    cd "$CONTRACTS_DIR"
    forge test --match-contract "$contract" --match-function "$function" -v
    print_success "Test passed!"
}

# Build contracts
build_contracts() {
    print_info "Building contracts..."
    cd "$CONTRACTS_DIR"
    forge build
    print_success "Build completed!"
}

# Generate gas report
gas_report() {
    print_info "Generating gas report..."
    cd "$CONTRACTS_DIR"
    forge test --gas-report
    print_success "Gas report generated!"
}

# Show help
show_help() {
    cat << EOF
${BLUE}Zali Contract Testing Script${NC}

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    all              Run all tests (default)
    faucet           Run Faucet contract tests
    trivia           Run SimpleTriviaGame contract tests
    build            Build all contracts
    gas              Generate gas consumption report
    help             Show this help message

Examples:
    $0                    # Run all tests
    $0 all -vv           # Run all tests with verbose output
    $0 faucet            # Run Faucet tests
    $0 trivia -v         # Run TriviaGame tests with verbose output
    $0 build             # Build contracts
    $0 gas               # Generate gas report

EOF
}

# Main script
main() {
    check_foundry

    case "${1:-all}" in
        all)
            run_all_tests "${@:2}"
            ;;
        faucet)
            run_test_file "Faucet.t.sol"
            ;;
        trivia)
            run_test_file "TriviaGame.t.sol"
            ;;
        build)
            build_contracts
            ;;
        gas)
            gas_report
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
