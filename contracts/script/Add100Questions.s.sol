// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";

contract Add100Questions is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address triviaGameAddress = vm.envAddress("TRIVIA_GAME_V2_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);

        TriviaGameV2 triviaGame = TriviaGameV2(payable(triviaGameAddress));

        console.log("Current questions:", triviaGame.getQuestionCount());
        console.log("Adding 100 questions...");

        // CELO BASICS (1-15)
        triviaGame.addQuestion("What is Celo?", ["A mobile-first blockchain platform", "A cryptocurrency exchange", "A digital wallet app", "A mining hardware company"], 0, "Basics");
        triviaGame.addQuestion("What is Celo's native stablecoin pegged to the US Dollar?", ["USDT", "USDC", "cUSD", "DAI"], 2, "Stablecoins");
        triviaGame.addQuestion("What consensus mechanism does Celo use?", ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"], 1, "Technology");
        triviaGame.addQuestion("What is Celo's primary mission?", ["To create the fastest blockchain", "To build financial tools accessible to anyone with a mobile phone", "To replace all traditional banks", "To mine Bitcoin more efficiently"], 1, "Mission");
        triviaGame.addQuestion("What do Celo validators do?", ["Mine new blocks", "Secure the network and validate transactions", "Create new tokens", "Manage user accounts"], 1, "Technology");
        triviaGame.addQuestion("What makes Celo unique in terms of environmental impact?", ["It uses solar power", "It is carbon negative", "It doesn't use electricity", "It plants trees"], 1, "Sustainability");
        triviaGame.addQuestion("How does Celo enable easy wallet recovery?", ["Email verification", "Phone number mapping to wallet addresses", "Fingerprint scanning", "Face recognition"], 1, "Features");
        triviaGame.addQuestion("What is Celo's governance token called?", ["CELO", "CEL", "CGOV", "CUSD"], 0, "Tokens");
        triviaGame.addQuestion("What can be used to pay for transaction fees on Celo?", ["Only CELO tokens", "Only cUSD", "Any Celo stablecoin or CELO", "Bitcoin"], 2, "Features");
        triviaGame.addQuestion("Is Celo compatible with Ethereum smart contracts?", ["No, completely different", "Yes, it's EVM compatible", "Only partially compatible", "It uses a different programming language"], 1, "Technology");
        triviaGame.addQuestion("What is MiniPay?", ["A Celo mining pool", "A mobile wallet built on Celo", "A payment gateway", "A stablecoin"], 1, "Ecosystem");
        triviaGame.addQuestion("What backs Celo stablecoins?", ["US Dollar reserves in banks", "Gold reserves", "A diversified crypto reserve", "Nothing, they are algorithmic"], 2, "Stablecoins");
        triviaGame.addQuestion("What is the approximate block time on Celo?", ["1 second", "5 seconds", "15 seconds", "1 minute"], 1, "Technology");
        triviaGame.addQuestion("What is the Celo Alliance for Prosperity?", ["A mining consortium", "A coalition of organizations building on Celo", "A charity foundation", "A validator group"], 1, "Ecosystem");
        triviaGame.addQuestion("Which region is Celo particularly focused on serving?", ["North America only", "Europe only", "Global, with emphasis on emerging markets", "Asia only"], 2, "Mission");

        console.log("Added 15 questions (Celo Basics)");

        // BLOCKCHAIN FUNDAMENTALS (16-30)
        triviaGame.addQuestion("What is a blockchain?", ["A type of database", "A distributed ledger technology", "A cryptocurrency", "A mining algorithm"], 1, "Blockchain");
        triviaGame.addQuestion("What is a smart contract?", ["A legal document", "Self-executing code on the blockchain", "A type of cryptocurrency", "A wallet application"], 1, "Blockchain");
        triviaGame.addQuestion("What does 'decentralized' mean in blockchain?", ["Controlled by one company", "No single point of control", "Faster transactions", "Lower fees"], 1, "Blockchain");
        triviaGame.addQuestion("What is a cryptocurrency wallet?", ["A physical wallet for cash", "Software that stores private keys", "A bank account", "A credit card"], 1, "Crypto");
        triviaGame.addQuestion("What is a private key?", ["A password for your email", "A secret code that controls your crypto", "A public address", "A transaction ID"], 1, "Security");
        triviaGame.addQuestion("What is gas in blockchain terms?", ["Fuel for cars", "Fee for executing transactions", "A type of cryptocurrency", "Mining reward"], 1, "Blockchain");
        triviaGame.addQuestion("What is a token?", ["A physical coin", "A digital asset on a blockchain", "A password", "A wallet address"], 1, "Crypto");
        triviaGame.addQuestion("What does DeFi stand for?", ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Direct Finance"], 1, "DeFi");
        triviaGame.addQuestion("What is a stablecoin?", ["A very old cryptocurrency", "A cryptocurrency pegged to a stable asset", "A coin that never changes price", "A government-issued digital currency"], 1, "Crypto");
        triviaGame.addQuestion("What is mining in cryptocurrency?", ["Digging for physical coins", "Validating transactions and creating new blocks", "Buying cryptocurrency", "Trading on exchanges"], 1, "Blockchain");
        triviaGame.addQuestion("What is a blockchain explorer?", ["A mining tool", "A tool to view blockchain transactions", "A wallet app", "A trading platform"], 1, "Tools");
        triviaGame.addQuestion("What does NFT stand for?", ["New Financial Token", "Non-Fungible Token", "Network File Transfer", "National Finance Technology"], 1, "Crypto");
        triviaGame.addQuestion("What is a DAO?", ["Digital Asset Organization", "Decentralized Autonomous Organization", "Distributed Application Operation", "Data Access Object"], 1, "Blockchain");
        triviaGame.addQuestion("What is the purpose of a blockchain consensus mechanism?", ["To mine coins", "To agree on the state of the blockchain", "To create wallets", "To set prices"], 1, "Blockchain");
        triviaGame.addQuestion("What is a dApp?", ["A mobile app", "A decentralized application", "A data application", "A download app"], 1, "Development");

        console.log("Added 30 questions (Blockchain Fundamentals)");

        // CELO ADVANCED (31-45)
        triviaGame.addQuestion("What programming language is primarily used for Celo smart contracts?", ["Python", "JavaScript", "Solidity", "Rust"], 2, "Development");
        triviaGame.addQuestion("What is the Celo Reserve?", ["A backup blockchain", "A pool of assets backing stablecoins", "A validator fund", "A development grant program"], 1, "Stablecoins");
        triviaGame.addQuestion("Can you send Celo transactions using just a phone number?", ["No, only wallet addresses work", "Yes, through phone number mapping", "Only with special apps", "Only for small amounts"], 1, "Features");
        triviaGame.addQuestion("What is Valora?", ["A Celo validator", "A mobile wallet for Celo", "A stablecoin", "A blockchain explorer"], 1, "Ecosystem");
        triviaGame.addQuestion("How many stablecoins does Celo support?", ["Only 1 (cUSD)", "2 (cUSD and cEUR)", "Multiple including cUSD, cEUR, cREAL", "None"], 2, "Stablecoins");
        triviaGame.addQuestion("What is Celo's approach to identity?", ["Anonymous only", "Phone number-based identity", "Email-based", "Government ID required"], 1, "Features");
        triviaGame.addQuestion("How does Celo achieve carbon negativity?", ["By not using electricity", "Through carbon offset programs", "By using solar panels", "It doesn't"], 1, "Sustainability");
        triviaGame.addQuestion("What is the Celo Dollar (cUSD) pegged to?", ["Bitcoin", "Ethereum", "US Dollar", "Gold"], 2, "Stablecoins");
        triviaGame.addQuestion("Can Celo validators vote on protocol changes?", ["No", "Yes, through governance", "Only founders can vote", "Validators don't exist"], 1, "Governance");
        triviaGame.addQuestion("What is the minimum stake to become a Celo validator?", ["1 CELO", "100 CELO", "10,000 CELO", "No minimum"], 2, "Staking");
        triviaGame.addQuestion("What is Celo's ultralight client?", ["A lightweight wallet", "A mobile-optimized blockchain client", "A mining software", "A trading bot"], 1, "Technology");
        triviaGame.addQuestion("How often are Celo validator elections held?", ["Daily", "Weekly", "Every epoch (approximately daily)", "Monthly"], 2, "Governance");
        triviaGame.addQuestion("What is the Celo Community Fund?", ["A charity", "On-chain fund for ecosystem development", "A validator pool", "A stablecoin reserve"], 1, "Ecosystem");
        triviaGame.addQuestion("Can you stake CELO tokens?", ["No", "Yes, to earn rewards", "Only validators can", "Only with 1000+ CELO"], 1, "Staking");
        triviaGame.addQuestion("What is Celo's approach to transaction fees?", ["Fixed fees", "Pay with any stablecoin or CELO", "Free transactions", "Bitcoin only"], 1, "Features");

        console.log("Added 45 questions (Celo Advanced)");

        // DEFI & CRYPTO CONCEPTS (46-65)
        triviaGame.addQuestion("What is liquidity in DeFi?", ["How fast you can trade", "Availability of assets for trading", "Amount of water in mining", "Number of users"], 1, "DeFi");
        triviaGame.addQuestion("What is yield farming?", ["Growing crops", "Earning rewards by providing liquidity", "Mining cryptocurrency", "Staking tokens"], 1, "DeFi");
        triviaGame.addQuestion("What is a blockchain fork?", ["A mining tool", "A split in the blockchain creating two versions", "A type of wallet", "A trading strategy"], 1, "Blockchain");
        triviaGame.addQuestion("What is the difference between a coin and a token?", ["No difference", "Coins have their own blockchain, tokens are built on existing blockchains", "Tokens are more valuable", "Coins are physical"], 1, "Crypto");
        triviaGame.addQuestion("What is a seed phrase?", ["A password", "A series of words to recover a wallet", "A transaction code", "A username"], 1, "Security");
        triviaGame.addQuestion("What is the Celo Euro (cEUR)?", ["A European exchange", "A stablecoin pegged to the Euro", "A validator group", "A wallet app"], 1, "Stablecoins");
        triviaGame.addQuestion("How does Celo handle network upgrades?", ["Automatic updates", "Through governance proposals", "Only founders decide", "No upgrades possible"], 1, "Governance");
        triviaGame.addQuestion("What is Plumo?", ["A wallet", "Celo's ultralight sync protocol", "A stablecoin", "A validator"], 1, "Technology");
        triviaGame.addQuestion("Can you build Ethereum dApps on Celo?", ["No", "Yes, with minimal changes", "Only with special tools", "Completely different"], 1, "Development");
        triviaGame.addQuestion("What is the Celo Real (cREAL)?", ["A real estate token", "A stablecoin pegged to Brazilian Real", "A validator", "A wallet"], 1, "Stablecoins");
        triviaGame.addQuestion("How does Celo ensure fast finality?", ["Proof of Work", "BFT consensus with instant finality", "Waiting for confirmations", "Centralized servers"], 1, "Technology");
        triviaGame.addQuestion("What is Celo's approach to privacy?", ["Fully anonymous", "Optional privacy features", "No privacy", "Government monitored"], 1, "Features");
        triviaGame.addQuestion("Can you run a Celo node on a mobile device?", ["No, too resource intensive", "Yes, with ultralight clients", "Only on servers", "Only on laptops"], 1, "Technology");
        triviaGame.addQuestion("What is the Celo Foundation?", ["A charity", "Non-profit supporting Celo ecosystem", "A company", "A validator group"], 1, "Ecosystem");
        triviaGame.addQuestion("How does Celo handle cross-chain transfers?", ["Not possible", "Through bridges and protocols", "Only with Bitcoin", "Centralized exchanges only"], 1, "Technology");
        triviaGame.addQuestion("What is an AMM?", ["Automated Money Machine", "Automated Market Maker", "Advanced Mining Method", "Asset Management Module"], 1, "DeFi");
        triviaGame.addQuestion("What is impermanent loss?", ["Permanent loss of funds", "Temporary loss from providing liquidity", "Transaction fees", "Mining costs"], 1, "DeFi");
        triviaGame.addQuestion("What is a liquidity pool?", ["A swimming pool", "A collection of funds locked in a smart contract", "A mining pool", "A wallet"], 1, "DeFi");
        triviaGame.addQuestion("What does APY stand for?", ["Annual Payment Yield", "Annual Percentage Yield", "Asset Price Yearly", "Automated Payment Year"], 1, "DeFi");
        triviaGame.addQuestion("What is slippage in trading?", ["A trading error", "Difference between expected and actual price", "Transaction fee", "Mining reward"], 1, "Trading");

        console.log("Added 65 questions (DeFi & Crypto)");

        // MORE DEFI & TRADING (66-80)
        triviaGame.addQuestion("What is a flash loan?", ["A very fast transaction", "An uncollateralized loan repaid in one transaction", "A type of stablecoin", "A mining reward"], 1, "DeFi");
        triviaGame.addQuestion("What is TVL in DeFi?", ["Total Value Locked", "Transaction Value Limit", "Token Validation Level", "Trading Volume Limit"], 0, "DeFi");
        triviaGame.addQuestion("What is a DEX?", ["Digital Exchange", "Decentralized Exchange", "Data Exchange", "Direct Exchange"], 1, "DeFi");
        triviaGame.addQuestion("What is staking?", ["Selling crypto", "Locking tokens to support network and earn rewards", "Mining", "Trading"], 1, "Crypto");
        triviaGame.addQuestion("What is a governance token?", ["A government-issued token", "A token that gives voting rights", "A stablecoin", "A security token"], 1, "DeFi");
        triviaGame.addQuestion("What is wrapped Bitcoin (WBTC)?", ["Bitcoin in a box", "Bitcoin token on Ethereum", "A Bitcoin wallet", "A Bitcoin fork"], 1, "Crypto");
        triviaGame.addQuestion("What is a lending protocol?", ["A bank", "A platform for borrowing and lending crypto", "A mining pool", "A wallet"], 1, "DeFi");
        triviaGame.addQuestion("What is collateral in DeFi?", ["A type of coin", "Assets locked to secure a loan", "Transaction fee", "Mining reward"], 1, "DeFi");
        triviaGame.addQuestion("What is a liquidity provider?", ["A bank", "Someone who deposits assets in a pool", "A miner", "A validator"], 1, "DeFi");
        triviaGame.addQuestion("What is arbitrage?", ["A type of token", "Profiting from price differences across markets", "A consensus mechanism", "A wallet type"], 1, "Trading");
        triviaGame.addQuestion("What is a synthetic asset?", ["A fake coin", "A token representing another asset", "A stablecoin", "A governance token"], 1, "DeFi");
        triviaGame.addQuestion("What is a vault in DeFi?", ["A secure wallet", "A smart contract that automates yield strategies", "A bank account", "A mining pool"], 1, "DeFi");
        triviaGame.addQuestion("What is a bonding curve?", ["A price chart", "A mathematical curve determining token price", "A staking reward", "A transaction path"], 1, "DeFi");
        triviaGame.addQuestion("What is a bridge in crypto?", ["A physical structure", "A protocol connecting different blockchains", "A wallet", "A mining tool"], 1, "Technology");
        triviaGame.addQuestion("What is composability in DeFi?", ["Making music", "Ability to combine different protocols", "A consensus mechanism", "A token standard"], 1, "DeFi");

        console.log("Added 80 questions (More DeFi & Trading)");

        // SECURITY & BEST PRACTICES (81-100)
        triviaGame.addQuestion("What is the safest way to store cryptocurrency?", ["On an exchange", "In a hardware wallet", "In an email", "On a piece of paper only"], 1, "Security");
        triviaGame.addQuestion("What is a phishing attack?", ["A fishing game", "A scam to steal private keys", "A mining method", "A trading strategy"], 1, "Security");
        triviaGame.addQuestion("Should you share your private key?", ["Yes, with friends", "No, never", "Only with support", "Only on secure websites"], 1, "Security");
        triviaGame.addQuestion("What is two-factor authentication (2FA)?", ["Two passwords", "An extra security layer", "A type of wallet", "A blockchain"], 1, "Security");
        triviaGame.addQuestion("What is a rug pull?", ["A carpet cleaning", "A scam where developers abandon a project", "A trading strategy", "A mining technique"], 1, "Security");
        triviaGame.addQuestion("What should you do before investing in a crypto project?", ["Invest immediately", "Research thoroughly (DYOR)", "Ask random people", "Follow hype"], 1, "Best Practices");
        triviaGame.addQuestion("What is a smart contract audit?", ["A tax review", "Security review of contract code", "A price check", "A wallet inspection"], 1, "Security");
        triviaGame.addQuestion("What is a honeypot scam?", ["A sweet deal", "A contract that prevents selling", "A mining pool", "A staking reward"], 1, "Security");
        triviaGame.addQuestion("What does DYOR mean?", ["Do Your Own Research", "Don't You Own Rewards", "Daily Yield On Returns", "Decentralized Year Of Returns"], 0, "Best Practices");
        triviaGame.addQuestion("What is a cold wallet?", ["A frozen wallet", "An offline wallet for storing crypto", "A wallet in cold countries", "A broken wallet"], 1, "Security");
        triviaGame.addQuestion("What is a hot wallet?", ["A popular wallet", "An online wallet connected to internet", "A wallet in hot countries", "A fast wallet"], 1, "Security");
        triviaGame.addQuestion("What is the best practice for seed phrases?", ["Store digitally", "Write down and store securely offline", "Share with family", "Email to yourself"], 1, "Security");
        triviaGame.addQuestion("What is a dusting attack?", ["Cleaning crypto", "Sending tiny amounts to track wallets", "A mining method", "A trading strategy"], 1, "Security");
        triviaGame.addQuestion("What is KYC in crypto?", ["Keep Your Crypto", "Know Your Customer", "Key Your Code", "Kill Your Coins"], 1, "Compliance");
        triviaGame.addQuestion("What is a multi-signature wallet?", ["Multiple wallets", "A wallet requiring multiple approvals", "A wallet with many coins", "A shared wallet"], 1, "Security");
        triviaGame.addQuestion("What should you check before sending crypto?", ["Nothing", "The recipient address carefully", "The weather", "Your email"], 1, "Best Practices");
        triviaGame.addQuestion("What is a smart contract vulnerability?", ["A feature", "A security flaw in the code", "A trading opportunity", "A mining bug"], 1, "Security");
        triviaGame.addQuestion("What is the purpose of a testnet?", ["To make money", "To test applications without real money", "To mine faster", "To trade"], 1, "Development");
        triviaGame.addQuestion("What is gas optimization?", ["Saving fuel", "Reducing transaction costs", "Mining faster", "Trading better"], 1, "Development");
        triviaGame.addQuestion("What is the best way to learn about crypto?", ["Trust influencers only", "Combine multiple reliable sources and practice", "Follow hype", "Guess"], 1, "Best Practices");

        console.log("Added 100 questions successfully!");
        console.log("Total questions in contract:", triviaGame.getQuestionCount());

        vm.stopBroadcast();
    }
}
