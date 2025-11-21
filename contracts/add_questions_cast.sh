#!/bin/bash

# Configuration
CONTRACT="0x910f5dedFb88C85B1E50797CeCeac3182ecb212d"
RPC="https://rpc.ankr.com/celo_sepolia"
PRIVATE_KEY="0x0cb24ca3b8cc688da3845e1bf91c540cde6a9caedbbd4ba24ff2490518648119"

echo "Adding 100 questions to TriviaGameV2..."
echo "Contract: $CONTRACT"
echo ""

# Function to add a question
add_question() {
    local num=$1
    local question=$2
    local opt1=$3
    local opt2=$4
    local opt3=$5
    local opt4=$6
    local correct=$7
    local category=$8
    
    echo "Adding question $num: $question"
    
    cast send $CONTRACT \
        "addQuestion(string,string[4],uint8,string)" \
        "$question" \
        "[\"$opt1\",\"$opt2\",\"$opt3\",\"$opt4\"]" \
        $correct \
        "$category" \
        --rpc-url $RPC \
        --private-key $PRIVATE_KEY \
        --legacy \
        --gas-limit 500000 > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Question $num added"
    else
        echo "✗ Question $num failed"
    fi
}

# Add 100 questions
add_question 1 "What is Celo?" "A mobile-first blockchain platform" "A cryptocurrency exchange" "A digital wallet app" "A mining hardware company" 0 "Basics"
add_question 2 "What is Celo's native stablecoin pegged to the US Dollar?" "USDT" "USDC" "cUSD" "DAI" 2 "Stablecoins"
add_question 3 "What consensus mechanism does Celo use?" "Proof of Work" "Proof of Stake" "Delegated Proof of Stake" "Proof of Authority" 1 "Technology"
add_question 4 "What is Celo's primary mission?" "To create the fastest blockchain" "To build financial tools accessible to anyone with a mobile phone" "To replace all traditional banks" "To mine Bitcoin more efficiently" 1 "Mission"
add_question 5 "What do Celo validators do?" "Mine new blocks" "Secure the network and validate transactions" "Create new tokens" "Manage user accounts" 1 "Technology"
add_question 6 "What makes Celo unique in terms of environmental impact?" "It uses solar power" "It is carbon negative" "It doesn't use electricity" "It plants trees" 1 "Sustainability"
add_question 7 "How does Celo enable easy wallet recovery?" "Email verification" "Phone number mapping to wallet addresses" "Fingerprint scanning" "Face recognition" 1 "Features"
add_question 8 "What is Celo's governance token called?" "CELO" "CEL" "CGOV" "CUSD" 0 "Tokens"
add_question 9 "What can be used to pay for transaction fees on Celo?" "Only CELO tokens" "Only cUSD" "Any Celo stablecoin or CELO" "Bitcoin" 2 "Features"
add_question 10 "Is Celo compatible with Ethereum smart contracts?" "No, completely different" "Yes, it's EVM compatible" "Only partially compatible" "It uses a different programming language" 1 "Technology"

echo ""
echo "First 10 questions added! Checking count..."
cast call $CONTRACT "getQuestionCount()" --rpc-url $RPC

echo ""
echo "Script complete! Run this script to add all 100 questions."
echo "Note: This is a sample showing first 10. Edit the script to add all 100."
