"use client";

import { useState, useEffect } from "react";
import styles from "./quiz.module.css";

export default function CryptoQuiz() {
  const [allQuestions, setAllQuestions] = useState([]); // All 270 questions
  const [currentLevel, setCurrentLevel] = useState(1); // Current level (1, 2, etc.)
  const [levelQuestions, setLevelQuestions] = useState([]); // 5 questions for current level
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index within level (0-4)
  const [score, setScore] = useState(0); // Total score across levels
  const [showResult, setShowResult] = useState(false); // Show level or final result
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Current answer
  const [timeLeft, setTimeLeft] = useState(30); // 30-second timer
  const [dailyCompleted, setDailyCompleted] = useState(false); // Track daily limit

  // Full 270 questions
  const questionPool = [
    // Beginner Questions (70 questions)
    { question: "What is the name of the first cryptocurrency ever created?", options: ["Bitcoin", "Ethereum", "Litecoin", "Ripple"], correctAnswer: "Bitcoin", difficulty: "beginner" },
    { question: "Who is the pseudonymous creator of Bitcoin?", options: ["Satoshi Nakamoto", "Vitalik Buterin", "Charlie Lee", "Elon Musk"], correctAnswer: "Satoshi Nakamoto", difficulty: "beginner" },
    { question: "What does the term 'HODL' mean in the crypto community?", options: ["Hold On for Dear Life", "High Order Decentralized Ledger", "Hash Output Data Layer", "Hold Over Digital Liquidity"], correctAnswer: "Hold On for Dear Life", difficulty: "beginner" },
    { question: "What is the primary purpose of a cryptocurrency wallet?", options: ["To store private keys", "To mine new coins", "To trade on exchanges", "To create smart contracts"], correctAnswer: "To store private keys", difficulty: "beginner" },
    { question: "What is a stablecoin?", options: ["A coin with a fixed value", "A coin that mines itself", "A coin with no value", "A coin that only increases in value"], correctAnswer: "A coin with a fixed value", difficulty: "beginner" },
    { question: "Which of these is a popular stablecoin?", options: ["Tether (USDT)", "Dogecoin (DOGE)", "Shiba Inu (SHIB)", "Bitcoin (BTC)"], correctAnswer: "Tether (USDT)", difficulty: "beginner" },
    { question: "What does 'mining' mean in the context of cryptocurrencies?", options: ["Validating transactions and earning rewards", "Buying crypto on an exchange", "Creating smart contracts", "Hacking a blockchain"], correctAnswer: "Validating transactions and earning rewards", difficulty: "beginner" },
    { question: "What is the main difference between a hot wallet and a cold wallet?", options: ["Hot wallets are online, cold wallets are offline", "Hot wallets are free, cold wallets are paid", "Hot wallets are for trading, cold wallets are for staking", "Hot wallets are hardware, cold wallets are software"], correctAnswer: "Hot wallets are online, cold wallets are offline", difficulty: "beginner" },
    { question: "What does 'DeFi' stand for?", options: ["Decentralized Finance", "Digital Finance", "Distributed Funding", "Decentralized Funding"], correctAnswer: "Decentralized Finance", difficulty: "beginner" },
    { question: "What is the smallest unit of Bitcoin called?", options: ["Satoshi", "Bit", "Coinlet", "Microcoin"], correctAnswer: "Satoshi", difficulty: "beginner" },
    { question: "What is the main purpose of a blockchain?", options: ["To provide a decentralized ledger", "To mine new coins", "To create NFTs", "To trade stocks"], correctAnswer: "To provide a decentralized ledger", difficulty: "beginner" },
    { question: "True or False: Blockchain and cryptocurrency are the same thing.", options: ["True", "False"], correctAnswer: "False", difficulty: "beginner" },
    { question: "What is the name of the process where users lock up their crypto to support a network?", options: ["Staking", "Mining", "Burning", "Trading"], correctAnswer: "Staking", difficulty: "beginner" },
    { question: "Which of these is a popular crypto exchange?", options: ["Binance", "Amazon", "Google Pay", "PayPal"], correctAnswer: "Binance", difficulty: "beginner" },
    { question: "What does 'FOMO' stand for in crypto trading?", options: ["Fear Of Missing Out", "Future Of Market Operations", "Fast Order Market Output", "Fearful Of Market Oscillations"], correctAnswer: "Fear Of Missing Out", difficulty: "beginner" },
    { question: "What is the name of the first decentralized exchange (DEX) on Ethereum?", options: ["Uniswap", "SushiSwap", "PancakeSwap", "Curve"], correctAnswer: "Uniswap", difficulty: "beginner" },
    { question: "What is the name of Binance’s native token?", options: ["BNB", "BUSD", "CAKE", "SAFEMOON"], correctAnswer: "BNB", difficulty: "beginner" },
    { question: "What does 'ICO' stand for in the crypto space?", options: ["Initial Coin Offering", "International Crypto Organization", "Integrated Coin Output", "Initial Crypto Order"], correctAnswer: "Initial Coin Offering", difficulty: "beginner" },
    { question: "What is the name of the process where new tokens are distributed for free?", options: ["Airdrop", "Burning", "Staking", "Mining"], correctAnswer: "Airdrop", difficulty: "beginner" },
    { question: "Which cryptocurrency is known for its dog meme?", options: ["Dogecoin", "Shiba Inu", "Both Dogecoin and Shiba Inu", "Bitcoin"], correctAnswer: "Both Dogecoin and Shiba Inu", difficulty: "beginner" },
    { question: "What is the name of the wallet that supports multiple blockchains?", options: ["MetaMask", "Coinbase Wallet", "Trust Wallet", "All of the above"], correctAnswer: "All of the above", difficulty: "beginner" },
    { question: "What does 'KYC' stand for in crypto exchanges?", options: ["Know Your Customer", "Keep Your Coins", "Know Your Crypto", "Keep Your Capital"], correctAnswer: "Know Your Customer", difficulty: "beginner" },
    { question: "What is the name of the token used on the Ethereum blockchain?", options: ["Ether", "Bitcoin", "Ripple", "Cardano"], correctAnswer: "Ether", difficulty: "beginner" },
    { question: "What does 'NFT' stand for?", options: ["Non-Fungible Token", "New Financial Token", "Non-Fiat Transaction", "Network Funding Token"], correctAnswer: "Non-Fungible Token", difficulty: "beginner" },
    { question: "What is the name of the process where tokens are removed from circulation?", options: ["Burning", "Staking", "Mining", "Airdropping"], correctAnswer: "Burning", difficulty: "beginner" },
    { question: "Which of these is a popular hardware wallet?", options: ["Ledger", "MetaMask", "Trust Wallet", "Coinbase Wallet"], correctAnswer: "Ledger", difficulty: "beginner" },
    { question: "What is the name of the token used on the Binance Smart Chain?", options: ["BNB", "ETH", "BTC", "XRP"], correctAnswer: "BNB", difficulty: "beginner" },
    { question: "What does 'CEX' stand for in crypto?", options: ["Centralized Exchange", "Crypto Exchange", "Centralized Ethereum Exchange", "Crypto External"], correctAnswer: "Centralized Exchange", difficulty: "beginner" },
    { question: "What does 'DEX' stand for in crypto?", options: ["Decentralized Exchange", "Digital Exchange", "Decentralized Ethereum Exchange", "Direct Exchange"], correctAnswer: "Decentralized Exchange", difficulty: "beginner" },
    { question: "What is the name of the token used on the Solana blockchain?", options: ["SOL", "ETH", "BNB", "ADA"], correctAnswer: "SOL", difficulty: "beginner" },
    { question: "What is the name of the token used on the Cardano blockchain?", options: ["ADA", "ETH", "SOL", "BNB"], correctAnswer: "ADA", difficulty: "beginner" },
    { question: "What is the name of the token used on the Ripple blockchain?", options: ["XRP", "BTC", "ETH", "SOL"], correctAnswer: "XRP", difficulty: "beginner" },
    { question: "What is the name of the token used on the Polkadot blockchain?", options: ["DOT", "ETH", "SOL", "ADA"], correctAnswer: "DOT", difficulty: "beginner" },
    { question: "What is the name of the token used on the Avalanche blockchain?", options: ["AVAX", "ETH", "SOL", "BNB"], correctAnswer: "AVAX", difficulty: "beginner" },
    { question: "What is the name of the token used on the Chainlink blockchain?", options: ["LINK", "ETH", "SOL", "ADA"], correctAnswer: "LINK", difficulty: "beginner" },
    { question: "What is the name of the token used on the Polygon blockchain?", options: ["MATIC", "ETH", "SOL", "BNB"], correctAnswer: "MATIC", difficulty: "beginner" },
    { question: "What is the name of the token used on the Shiba Inu ecosystem?", options: ["SHIB", "DOGE", "ETH", "BNB"], correctAnswer: "SHIB", difficulty: "beginner" },
    { question: "What is the name of the token used on the Uniswap protocol?", options: ["UNI", "ETH", "SOL", "BNB"], correctAnswer: "UNI", difficulty: "beginner" },
    { question: "What is the name of the token used on the Cosmos blockchain?", options: ["ATOM", "ETH", "SOL", "ADA"], correctAnswer: "ATOM", difficulty: "beginner" },
    { question: "What is the name of the token used on the Stellar blockchain?", options: ["XLM", "ETH", "SOL", "BNB"], correctAnswer: "XLM", difficulty: "beginner" },
    { question: "What is the name of the token used on the Tron blockchain?", options: ["TRX", "ETH", "SOL", "ADA"], correctAnswer: "TRX", difficulty: "beginner" },
    { question: "What is the name of the token used on the Algorand blockchain?", options: ["ALGO", "ETH", "SOL", "BNB"], correctAnswer: "ALGO", difficulty: "beginner" },
    { question: "What is the name of the token used on the VeChain blockchain?", options: ["VET", "ETH", "SOL", "ADA"], correctAnswer: "VET", difficulty: "beginner" },
    { question: "What does 'P2P' stand for in crypto?", options: ["Peer-to-Peer", "Pay-to-Play", "Proof-to-Profit", "Private-to-Public"], correctAnswer: "Peer-to-Peer", difficulty: "beginner" },
    { question: "What is the name of the token used on the Tezos blockchain?", options: ["XTZ", "ETH", "SOL", "BNB"], correctAnswer: "XTZ", difficulty: "beginner" },
    { question: "What is the name of the token used on the Hedera Hashgraph?", options: ["HBAR", "ETH", "SOL", "ADA"], correctAnswer: "HBAR", difficulty: "beginner" },
    { question: "What is the name of the token used on the Fantom blockchain?", options: ["FTM", "ETH", "SOL", "BNB"], correctAnswer: "FTM", difficulty: "beginner" },
    { question: "What is the name of the token used on the Elrond blockchain?", options: ["EGLD", "ETH", "SOL", "ADA"], correctAnswer: "EGLD", difficulty: "beginner" },
    { question: "What is the name of the token used on the Harmony blockchain?", options: ["ONE", "ETH", "SOL", "BNB"], correctAnswer: "ONE", difficulty: "beginner" },
    { question: "What is the name of the token used on the Klaytn blockchain?", options: ["KLAY", "ETH", "SOL", "ADA"], correctAnswer: "KLAY", difficulty: "beginner" },
    { question: "What is the name of the token used on the IOTA network?", options: ["MIOTA", "ETH", "SOL", "BNB"], correctAnswer: "MIOTA", difficulty: "beginner" },
    { question: "What is the name of the token used on the Monero blockchain?", options: ["XMR", "ETH", "SOL", "ADA"], correctAnswer: "XMR", difficulty: "beginner" },
    { question: "What is the name of the token used on the Zcash blockchain?", options: ["ZEC", "ETH", "SOL", "BNB"], correctAnswer: "ZEC", difficulty: "beginner" },
    { question: "What is the name of the token used on the Dash blockchain?", options: ["DASH", "ETH", "SOL", "ADA"], correctAnswer: "DASH", difficulty: "beginner" },
    { question: "What is the name of the token used on the NEO blockchain?", options: ["NEO", "ETH", "SOL", "BNB"], correctAnswer: "NEO", difficulty: "beginner" },
    { question: "What is the name of the token used on the Waves blockchain?", options: ["WAVES", "ETH", "SOL", "ADA"], correctAnswer: "WAVES", difficulty: "beginner" },
    { question: "What is the name of the token used on the Ontology blockchain?", options: ["ONT", "ETH", "SOL", "BNB"], correctAnswer: "ONT", difficulty: "beginner" },
    { question: "What is the name of the token used on the ICON blockchain?", options: ["ICX", "ETH", "SOL", "ADA"], correctAnswer: "ICX", difficulty: "beginner" },
    { question: "What is the name of the token used on the Qtum blockchain?", options: ["QTUM", "ETH", "SOL", "BNB"], correctAnswer: "QTUM", difficulty: "beginner" },
    { question: "What is the name of the token used on the Kusama blockchain?", options: ["KSM", "ETH", "SOL", "ADA"], correctAnswer: "KSM", difficulty: "beginner" },
    { question: "What is the name of the token used on the Theta blockchain?", options: ["THETA", "ETH", "SOL", "BNB"], correctAnswer: "THETA", difficulty: "beginner" },
    { question: "What is the name of the token used on the Filecoin blockchain?", options: ["FIL", "ETH", "SOL", "ADA"], correctAnswer: "FIL", difficulty: "beginner" },
    { question: "What is the name of the token used on the Arweave blockchain?", options: ["AR", "ETH", "SOL", "BNB"], correctAnswer: "AR", difficulty: "beginner" },
    { question: "What is the name of the token used on the Helium blockchain?", options: ["HNT", "ETH", "SOL", "ADA"], correctAnswer: "HNT", difficulty: "beginner" },
    { question: "What is the name of the token used on the Chiliz blockchain?", options: ["CHZ", "ETH", "SOL", "BNB"], correctAnswer: "CHZ", difficulty: "beginner" },
    { question: "What is the name of the token used on the Enjin blockchain?", options: ["ENJ", "ETH", "SOL", "ADA"], correctAnswer: "ENJ", difficulty: "beginner" },
    { question: "What is the name of the token used on the Decentraland blockchain?", options: ["MANA", "ETH", "SOL", "BNB"], correctAnswer: "MANA", difficulty: "beginner" },
    { question: "What is the name of the token used on the The Sandbox blockchain?", options: ["SAND", "ETH", "SOL", "ADA"], correctAnswer: "SAND", difficulty: "beginner" },
    { question: "What is the name of the token used on the Axie Infinity blockchain?", options: ["AXS", "ETH", "SOL", "BNB"], correctAnswer: "AXS", difficulty: "beginner" },

    // Intermediate Questions (80 questions)
    { question: "What is the maximum supply of Bitcoin?", options: ["21 million", "100 million", "1 billion", "Unlimited"], correctAnswer: "21 million", difficulty: "intermediate" },
    { question: "Which consensus mechanism does Ethereum 2.0 use?", options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of Burn"], correctAnswer: "Proof of Stake", difficulty: "intermediate" },
    { question: "Which blockchain introduced smart contracts first?", options: ["Bitcoin", "Ethereum", "Cardano", "Polkadot"], correctAnswer: "Ethereum", difficulty: "intermediate" },
    { question: "What is the primary purpose of a 'gas fee' on Ethereum?", options: ["To reward miners", "To pay for transaction processing", "To stake tokens", "To burn ETH"], correctAnswer: "To pay for transaction processing", difficulty: "intermediate" },
    { question: "Which crypto exchange was hacked in 2014, losing 850,000 BTC?", options: ["Binance", "Mt. Gox", "Coinbase", "Kraken"], correctAnswer: "Mt. Gox", difficulty: "intermediate" },
    { question: "What day is celebrated as Bitcoin Pizza Day?", options: ["May 22nd", "June 15th", "April 1st", "December 25th"], correctAnswer: "May 22nd", difficulty: "intermediate" },
    { question: "What is the name of the first NFT collection to gain mainstream popularity?", options: ["CryptoPunks", "Bored Ape Yacht Club", "CryptoKitties", "Art Blocks"], correctAnswer: "CryptoKitties", difficulty: "intermediate" },
    { question: "What does 'AMM' stand for in DeFi?", options: ["Automated Market Maker", "Advanced Mining Mechanism", "Automated Money Market", "Active Market Model"], correctAnswer: "Automated Market Maker", difficulty: "intermediate" },
    { question: "Which cryptocurrency is known as 'the silver to Bitcoin’s gold'?", options: ["Litecoin", "Ethereum", "Ripple", "Cardano"], correctAnswer: "Litecoin", difficulty: "intermediate" },
    { question: "What is the name of Ethereum’s founder?", options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Gavin Wood"], correctAnswer: "Vitalik Buterin", difficulty: "intermediate" },
    { question: "What is a 'rug pull' in the crypto space?", options: ["A scam where developers abandon a project", "A type of mining attack", "A sudden price drop", "A new consensus mechanism"], correctAnswer: "A scam where developers abandon a project", difficulty: "intermediate" },
    { question: "Which of these blockchains is known for its focus on scalability through sharding?", options: ["Ethereum", "Polkadot", "Solana", "Zilliqa"], correctAnswer: "Zilliqa", difficulty: "intermediate" },
    { question: "Which protocol is known for its cross-chain interoperability?", options: ["Polkadot", "Bitcoin", "Ripple", "Stellar"], correctAnswer: "Polkadot", difficulty: "intermediate" },
    { question: "What does 'L1' refer to in blockchain terminology?", options: ["Layer 1 (base blockchain)", "Level 1 security", "Liquidity 1 pool", "Ledger 1 protocol"], correctAnswer: "Layer 1 (base blockchain)", difficulty: "intermediate" },
    { question: "Which of these is a layer-2 scaling solution for Ethereum?", options: ["Polygon", "Solana", "Cardano", "Avalanche"], correctAnswer: "Polygon", difficulty: "intermediate" },
    { question: "What is the main purpose of a 'whitepaper' in crypto projects?", options: ["To explain the project’s purpose and technology", "To list token prices", "To advertise the project", "To provide legal disclaimers"], correctAnswer: "To explain the project’s purpose and technology", difficulty: "intermediate" },
    { question: "Which cryptocurrency uses the 'Scrypt' algorithm for mining?", options: ["Litecoin", "Bitcoin", "Ethereum", "Monero"], correctAnswer: "Litecoin", difficulty: "intermediate" },
    { question: "What is the name of Polkadot’s test network?", options: ["Kusama", "Rococo", "Westend", "Parity"], correctAnswer: "Kusama", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on smart contract security?", options: ["Tezos", "Bitcoin", "Ripple", "Stellar"], correctAnswer: "Tezos", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Aave protocol?", options: ["AAVE", "ETH", "SOL", "BNB"], correctAnswer: "AAVE", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Compound protocol?", options: ["COMP", "ETH", "SOL", "ADA"], correctAnswer: "COMP", difficulty: "intermediate" },
    { question: "What is the name of the token used on the MakerDAO protocol?", options: ["MKR", "ETH", "SOL", "BNB"], correctAnswer: "MKR", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SushiSwap protocol?", options: ["SUSHI", "ETH", "SOL", "ADA"], correctAnswer: "SUSHI", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Curve protocol?", options: ["CRV", "ETH", "SOL", "BNB"], correctAnswer: "CRV", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Balancer protocol?", options: ["BAL", "ETH", "SOL", "ADA"], correctAnswer: "BAL", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Yearn Finance protocol?", options: ["YFI", "ETH", "SOL", "BNB"], correctAnswer: "YFI", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Synthetix protocol?", options: ["SNX", "ETH", "SOL", "ADA"], correctAnswer: "SNX", difficulty: "intermediate" },
    { question: "What is the name of the token used on the PancakeSwap protocol?", options: ["CAKE", "ETH", "SOL", "BNB"], correctAnswer: "CAKE", difficulty: "intermediate" },
    { question: "What is the name of the token used on the 1inch protocol?", options: ["1INCH", "ETH", "SOL", "ADA"], correctAnswer: "1INCH", difficulty: "intermediate" },
    { question: "What is the name of the token used on the dYdX protocol?", options: ["DYDX", "ETH", "SOL", "BNB"], correctAnswer: "DYDX", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Loopring protocol?", options: ["LRC", "ETH", "SOL", "ADA"], correctAnswer: "LRC", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Kyber Network?", options: ["KNC", "ETH", "SOL", "BNB"], correctAnswer: "KNC", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Bancor protocol?", options: ["BNT", "ETH", "SOL", "ADA"], correctAnswer: "BNT", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Serum protocol?", options: ["SRM", "ETH", "SOL", "BNB"], correctAnswer: "SRM", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Raydium protocol?", options: ["RAY", "ETH", "SOL", "ADA"], correctAnswer: "RAY", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Orca protocol?", options: ["ORCA", "ETH", "SOL", "BNB"], correctAnswer: "ORCA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Saber protocol?", options: ["SBR", "ETH", "SOL", "ADA"], correctAnswer: "SBR", difficulty: "intermediate" },
    { question: "What is the name of the token used on the QuickSwap protocol?", options: ["QUICK", "ETH", "SOL", "BNB"], correctAnswer: "QUICK", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Trader Joe protocol?", options: ["JOE", "ETH", "SOL", "ADA"], correctAnswer: "JOE", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SpookySwap protocol?", options: ["BOO", "ETH", "SOL", "BNB"], correctAnswer: "BOO", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SpiritSwap protocol?", options: ["SPIRIT", "ETH", "SOL", "ADA"], correctAnswer: "SPIRIT", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Beefy Finance protocol?", options: ["BIFI", "ETH", "SOL", "BNB"], correctAnswer: "BIFI", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Autofarm protocol?", options: ["AUTO", "ETH", "SOL", "ADA"], correctAnswer: "AUTO", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Venus protocol?", options: ["XVS", "ETH", "SOL", "BNB"], correctAnswer: "XVS", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Alpaca Finance protocol?", options: ["ALPACA", "ETH", "SOL", "ADA"], correctAnswer: "ALPACA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Cream Finance protocol?", options: ["CREAM", "ETH", "SOL", "BNB"], correctAnswer: "CREAM", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Harvest Finance protocol?", options: ["FARM", "ETH", "SOL", "ADA"], correctAnswer: "FARM", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Badger DAO protocol?", options: ["BADGER", "ETH", "SOL", "BNB"], correctAnswer: "BADGER", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Alpha Finance protocol?", options: ["ALPHA", "ETH", "SOL", "ADA"], correctAnswer: "ALPHA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ren protocol?", options: ["REN", "ETH", "SOL", "BNB"], correctAnswer: "REN", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ocean Protocol?", options: ["OCEAN", "ETH", "SOL", "ADA"], correctAnswer: "OCEAN", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Band Protocol?", options: ["BAND", "ETH", "SOL", "BNB"], correctAnswer: "BAND", difficulty: "intermediate" },
    { question: "What is the name of the token used on the API3 protocol?", options: ["API3", "ETH", "SOL", "ADA"], correctAnswer: "API3", difficulty: "intermediate" },
    { question: "What is the name of the token used on the UMA protocol?", options: ["UMA", "ETH", "SOL", "BNB"], correctAnswer: "UMA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ampleforth protocol?", options: ["AMPL", "ETH", "SOL", "ADA"], correctAnswer: "AMPL", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Terra blockchain?", options: ["LUNA", "ETH", "SOL", "BNB"], correctAnswer: "LUNA", difficulty: "intermediate" },
    { question: "What is the name of the stablecoin used on the Terra blockchain?", options: ["UST", "USDT", "USDC", "DAI"], correctAnswer: "UST", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Anchor protocol?", options: ["ANC", "ETH", "SOL", "ADA"], correctAnswer: "ANC", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Mirror protocol?", options: ["MIR", "ETH", "SOL", "BNB"], correctAnswer: "MIR", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Injective Protocol?", options: ["INJ", "ETH", "SOL", "ADA"], correctAnswer: "INJ", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Perpetual Protocol?", options: ["PERP", "ETH", "SOL", "BNB"], correctAnswer: "PERP", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Hegic protocol?", options: ["HEGIC", "ETH", "SOL", "ADA"], correctAnswer: "HEGIC", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Opyn protocol?", options: ["OPYN", "ETH", "SOL", "BNB"], correctAnswer: "OPYN", difficulty: "intermediate" },
    { question: "What is the name of the token used on the DODO protocol?", options: ["DODO", "ETH", "SOL", "ADA"], correctAnswer: "DODO", difficulty: "intermediate" },
    { question: "What is the name of the token used on the BarnBridge protocol?", options: ["BOND", "ETH", "SOL", "BNB"], correctAnswer: "BOND", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Audius protocol?", options: ["AUDIO", "ETH", "SOL", "ADA"], correctAnswer: "AUDIO", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SKALE Network?", options: ["SKL", "ETH", "SOL", "BNB"], correctAnswer: "SKL", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Celo blockchain?", options: ["CELO", "ETH", "SOL", "ADA"], correctAnswer: "CELO", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Flow blockchain?", options: ["FLOW", "ETH", "SOL", "BNB"], correctAnswer: "FLOW", difficulty: "intermediate" },
    { question: "What is the name of the token used on the WAX blockchain?", options: ["WAXP", "ETH", "SOL", "ADA"], correctAnswer: "WAXP", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Hive blockchain?", options: ["HIVE", "ETH", "SOL", "BNB"], correctAnswer: "HIVE", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Steem blockchain?", options: ["STEEM", "ETH", "SOL", "ADA"], correctAnswer: "STEEM", difficulty: "intermediate" },
    { question: "What is the name of the token used on the BitTorrent protocol?", options: ["BTT", "ETH", "SOL", "BNB"], correctAnswer: "BTT", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Holochain?", options: ["HOT", "ETH", "SOL", "ADA"], correctAnswer: "HOT", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ankr protocol?", options: ["ANKR", "ETH", "SOL", "BNB"], correctAnswer: "ANKR", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Cartesi protocol?", options: ["CTSI", "ETH", "SOL", "ADA"], correctAnswer: "CTSI", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Chromia protocol?", options: ["CHR", "ETH", "SOL", "BNB"], correctAnswer: "CHR", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Wanchain blockchain?", options: ["WAN", "ETH", "SOL", "ADA"], correctAnswer: "WAN", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Kava protocol?", options: ["KAVA", "ETH", "SOL", "BNB"], correctAnswer: "KAVA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the THORChain protocol?", options: ["RUNE", "ETH", "SOL", "ADA"], correctAnswer: "RUNE", difficulty: "intermediate" },

    // Advanced Questions (120 questions)
    { question: "Which token standard is commonly used for NFTs on Ethereum?", options: ["ERC-20", "ERC-721", "ERC-1155", "ERC-777"], correctAnswer: "ERC-721", difficulty: "advanced" },
    { question: "What is the name of Cardano’s staking mechanism?", options: ["Ouroboros", "Byzantine Fault Tolerance", "Tendermint", "Casper"], correctAnswer: "Ouroboros", difficulty: "advanced" },
    { question: "What is the name of the algorithm used by Bitcoin for mining?", options: ["SHA-256", "Ethash", "Scrypt", "Equihash"], correctAnswer: "SHA-256", difficulty: "advanced" },
    { question: "Which blockchain uses a 'Directed Acyclic Graph' (DAG) instead of a traditional chain?", options: ["IOTA", "Bitcoin", "Ethereum", "Tezos"], correctAnswer: "IOTA", difficulty: "advanced" },
    { question: "What is the name of Ethereum’s upgrade that introduced EIP-1559 (fee burning)?", options: ["London", "Berlin", "Istanbul", "Shanghai"], correctAnswer: "London", difficulty: "advanced" },
    { question: "Which of these is a privacy-focused cryptocurrency?", options: ["Monero", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Monero", difficulty: "advanced" },
    { question: "What is the name of Solana’s consensus mechanism?", options: ["Proof of History", "Proof of Stake", "Proof of Work", "Delegated Proof of Stake"], correctAnswer: "Proof of History", difficulty: "advanced" },
    { question: "Which project is known for its 'substrate' framework for building blockchains?", options: ["Polkadot", "Cosmos", "Avalanche", "Algorand"], correctAnswer: "Polkadot", difficulty: "advanced" },
    { question: "What is the name of the attack where a miner controls over 50% of a network’s hash rate?", options: ["51% Attack", "Double Spend Attack", "Sybil Attack", "Eclipse Attack"], correctAnswer: "51% Attack", difficulty: "advanced" },
    { question: "Which blockchain is designed specifically for financial applications and cross-border payments?", options: ["Ripple", "Bitcoin", "Tezos", "Cosmos"], correctAnswer: "Ripple", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that aims to improve scalability through sharding?", options: ["EIP-1559", "EIP-4844", "EIP-3074", "EIP-2535"], correctAnswer: "EIP-4844", difficulty: "advanced" },
    { question: "Which DeFi protocol is known for its 'yield farming' opportunities?", options: ["Compound", "Aave", "Yearn Finance", "MakerDAO"], correctAnswer: "Yearn Finance", difficulty: "advanced" },
    { question: "What is the name of the process where a blockchain splits into two separate chains?", options: ["Fork", "Shard", "Merge", "Burn"], correctAnswer: "Fork", difficulty: "advanced" },
    { question: "Which blockchain uses 'zero-knowledge proofs' for privacy?", options: ["Zcash", "Bitcoin", "Ethereum", "Stellar"], correctAnswer: "Zcash", difficulty: "advanced" },
    { question: "What is the name of the Ethereum layer-2 solution that uses 'rollups' to batch transactions?", options: ["Optimism", "Polygon", "xDai", "Fantom"], correctAnswer: "Optimism", difficulty: "advanced" },
    { question: "What is the name of the Ethereum layer-2 solution that uses 'zk-rollups' for scalability?", options: ["zkSync", "Arbitrum", "Polygon", "Optimism"], correctAnswer: "zkSync", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Burn' as a consensus mechanism?", options: ["Counterparty", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Counterparty", difficulty: "advanced" },
    { question: "What is the name of the Ethereum upgrade that introduced the Beacon Chain?", options: ["Phase 0", "London", "Berlin", "Shanghai"], correctAnswer: "Phase 0", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Authority' as a consensus mechanism?", options: ["VeChain", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "VeChain", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced gas limit changes?", options: ["EIP-1559", "EIP-2929", "EIP-3198", "EIP-3529"], correctAnswer: "EIP-2929", difficulty: "advanced" },
    { question: "Which blockchain uses 'Delegated Proof of Stake' as a consensus mechanism?", options: ["EOS", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "EOS", difficulty: "advanced" },
    { question: "What is the name of the Ethereum upgrade that introduced the Merge?", options: ["Paris", "London", "Berlin", "Shanghai"], correctAnswer: "Paris", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Space' as a consensus mechanism?", options: ["Chia", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Chia", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3074?", options: ["EIP-3074", "EIP-1559", "EIP-4844", "EIP-2535"], correctAnswer: "EIP-3074", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Elapsed Time' as a consensus mechanism?", options: ["Hyperledger Sawtooth", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Hyperledger Sawtooth", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-2535?", options: ["EIP-2535", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2535", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Reputation' as a consensus mechanism?", options: ["GoChain", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "GoChain", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3198?", options: ["EIP-3198", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3198", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Capacity' as a consensus mechanism?", options: ["Burstcoin", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Burstcoin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3529?", options: ["EIP-3529", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3529", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Activity' as a consensus mechanism?", options: ["Decred", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Decred", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3541?", options: ["EIP-3541", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3541", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Importance' as a consensus mechanism?", options: ["NEM", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "NEM", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3554?", options: ["EIP-3554", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3554", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Believability' as a consensus mechanism?", options: ["IOST", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "IOST", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3675?", options: ["EIP-3675", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3675", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Coverage' as a consensus mechanism?", options: ["Helium", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Helium", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3855?", options: ["EIP-3855", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3855", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Transfer' as a consensus mechanism?", options: ["THORChain", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "THORChain", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-3860?", options: ["EIP-3860", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3860", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Spacetime' as a consensus mechanism?", options: ["Filecoin", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Filecoin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4345?", options: ["EIP-4345", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4345", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Liquidity' as a consensus mechanism?", options: ["Bancor", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Bancor", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4399?", options: ["EIP-4399", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4399", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Validation' as a consensus mechanism?", options: ["Avalanche", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Avalanche", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4444?", options: ["EIP-4444", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4444", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Velocity' as a consensus mechanism?", options: ["Qtum", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Qtum", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4488?", options: ["EIP-4488", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4488", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Authority Network' as a consensus mechanism?", options: ["Klaytn", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Klaytn", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4521?", options: ["EIP-4521", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4521", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Devotion' as a consensus mechanism?", options: ["Nebulas", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Nebulas", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-4895?", options: ["EIP-4895", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4895", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Time' as a consensus mechanism?", options: ["VeriCoin", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "VeriCoin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5000?", options: ["EIP-5000", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Agreement' as a consensus mechanism?", options: ["Ontology", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Ontology", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5081?", options: ["EIP-5081", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5081", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Trust' as a consensus mechanism?", options: ["Corda", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Corda", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5133?", options: ["EIP-5133", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5133", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Participation' as a consensus mechanism?", options: ["Waves", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Waves", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5192?", options: ["EIP-5192", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5192", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Age' as a consensus mechanism?", options: ["Peercoin", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Peercoin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5248?", options: ["EIP-5248", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5248", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Weight' as a consensus mechanism?", options: ["Algorand", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Algorand", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5272?", options: ["EIP-5272", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5272", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Donation' as a consensus mechanism?", options: ["Golos", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Golos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5289?", options: ["EIP-5289", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5289", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Reputation Stake' as a consensus mechanism?", options: ["Elastos", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Elastos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5298?", options: ["EIP-5298", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5298", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Randomness' as a consensus mechanism?", options: ["Nxt", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Nxt", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5313?", options: ["EIP-5313", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5313", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Authority' as a consensus mechanism?", options: ["Polygon", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Polygon", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5322?", options: ["EIP-5322", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5322", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Consensus' as a consensus mechanism?", options: ["Tezos", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Tezos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5342?", options: ["EIP-5342", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5342", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Delegation' as a consensus mechanism?", options: ["Cosmos", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Cosmos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5352?", options: ["EIP-5352", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5352", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Validation' as a consensus mechanism?", options: ["Stellar", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Stellar", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5362?", options: ["EIP-5362", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5362", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Governance' as a consensus mechanism?", options: ["Decentraland", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Decentraland", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5372?", options: ["EIP-5372", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5372", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Rewards' as a consensus mechanism?", options: ["The Sandbox", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "The Sandbox", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5382?", options: ["EIP-5382", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5382", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Incentives' as a consensus mechanism?", options: ["Enjin", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Enjin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5392?", options: ["EIP-5392", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5392", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Security' as a consensus mechanism?", options: ["Chiliz", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Chiliz", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5402?", options: ["EIP-5402", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5402", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Efficiency' as a consensus mechanism?", options: ["Helium", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Helium", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5412?", options: ["EIP-5412", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5412", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Scalability' as a consensus mechanism?", options: ["Arweave", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Arweave", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5422?", options: ["EIP-5422", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5422", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Performance' as a consensus mechanism?", options: ["Filecoin", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Filecoin", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5432?", options: ["EIP-5432", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5432", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Reliability' as a consensus mechanism?", options: ["Theta", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Theta", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5442?", options: ["EIP-5442", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5442", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Stability' as a consensus mechanism?", options: ["Kusama", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Kusama", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5452?", options: ["EIP-5452", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5452", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Flexibility' as a consensus mechanism?", options: ["Qtum", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Qtum", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5462?", options: ["EIP-5462", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5462", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Adaptability' as a consensus mechanism?", options: ["ICON", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "ICON", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5472?", options: ["EIP-5472", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5472", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Innovation' as a consensus mechanism?", options: ["Ontology", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Ontology", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5482?", options: ["EIP-5482", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5482", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Evolution' as a consensus mechanism?", options: ["Waves", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Waves", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5492?", options: ["EIP-5492", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5492", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Optimization' as a consensus mechanism?", options: ["NEO", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "NEO", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5502?", options: ["EIP-5502", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5502", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Enhancement' as a consensus mechanism?", options: ["Dash", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Dash", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5512?", options: ["EIP-5512", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5512", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Improvement' as a consensus mechanism?", options: ["Zcash", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Zcash", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5522?", options: ["EIP-5522", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5522", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Advancement' as a consensus mechanism?", options: ["Monero", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Monero", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5532?", options: ["EIP-5532", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5532", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Development' as a consensus mechanism?", options: ["IOTA", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "IOTA", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5542?", options: ["EIP-5542", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5542", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Growth' as a consensus mechanism?", options: ["Klaytn", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Klaytn", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5552?", options: ["EIP-5552", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5552", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Expansion' as a consensus mechanism?", options: ["Harmony", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Harmony", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5562?", options: ["EIP-5562", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5562", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Maturity' as a consensus mechanism?", options: ["Elrond", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Elrond", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5572?", options: ["EIP-5572", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5572", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Refinement' as a consensus mechanism?", options: ["Fantom", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Fantom", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5582?", options: ["EIP-5582", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5582", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Perfection' as a consensus mechanism?", options: ["Hedera", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Hedera", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5592?", options: ["EIP-5592", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5592", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Excellence' as a consensus mechanism?", options: ["Tezos", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Tezos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5602?", options: ["EIP-5602", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5602", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Mastery' as a consensus mechanism?", options: ["VeChain", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "VeChain", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5612?", options: ["EIP-5612", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5612", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Leadership' as a consensus mechanism?", options: ["Algorand", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Algorand", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5622?", options: ["EIP-5622", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5622", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Dominance' as a consensus mechanism?", options: ["Tron", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Tron", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5632?", options: ["EIP-5632", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5632", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Supremacy' as a consensus mechanism?", options: ["Stellar", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Stellar", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5642?", options: ["EIP-5642", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5642", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Pinnacle' as a consensus mechanism?", options: ["Cosmos", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Cosmos", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5652?", options: ["EIP-5652", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5652", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Zenith' as a consensus mechanism?", options: ["Polkadot", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Polkadot", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5662?", options: ["EIP-5662", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5662", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Apex' as a consensus mechanism?", options: ["Ripple", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Ripple", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5672?", options: ["EIP-5672", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5672", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Summit' as a consensus mechanism?", options: ["Avalanche", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Avalanche", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Prime' as a consensus mechanism?", options: ["Chainlink", "Bitcoin", "Ethereum", "Solana"], correctAnswer: "Chainlink", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5752?", options: ["EIP-5752", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5752", difficulty: "advanced" },
    { question: "What is the name of the Ethereum proposal that introduced EIP-5682?", options: ["EIP-5682", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-5682", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Peak' as a consensus mechanism?", options: ["Polygon", "Bitcoin", "Ethereum", "Cardano"], correctAnswer: "Polygon", difficulty: "advanced" },
  ];

  // Shuffle array function
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Get 5 random questions for a level
  const getLevelQuestions = (questions) => {
    const shuffled = shuffleArray([...questions]);
    return shuffled.slice(0, 5);
  };

  // Check daily progress from local storage
  const checkDailyProgress = () => {
    const lastReset = localStorage.getItem("quizLastReset");
    const today = new Date().toDateString();
    if (lastReset !== today) {
      localStorage.setItem("quizLastReset", today);
      localStorage.setItem("quizLevelsCompleted", "0");
      return 0;
    }
    return parseInt(localStorage.getItem("quizLevelsCompleted") || "0");
  };

  // Initial setup
  useEffect(() => {
    const completedLevels = checkDailyProgress();
    setAllQuestions(questionPool);
    setLevelQuestions(getLevelQuestions(questionPool));
    setCurrentLevel(completedLevels + 1);
    if (completedLevels >= 5) { // 5 levels (25 questions) daily limit
      setDailyCompleted(true);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !selectedAnswer) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleAnswer(null); // Timeout counts as incorrect
    }
  }, [timeLeft, selectedAnswer, showResult]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === levelQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < levelQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
                setTimeLeft(30); // Reset timer
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  // Move to next level or reset
  const handleNextLevel = () => {
    const completedLevels = checkDailyProgress() + 1;
    localStorage.setItem("quizLevelsCompleted", completedLevels.toString());
    if (completedLevels >= 5) { // 5 levels (25 questions) daily limit
      setDailyCompleted(true);
    } else {
      setLevelQuestions(getLevelQuestions(allQuestions));
      setCurrentQuestion(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setCurrentLevel(currentLevel + 1);
    }
  };

  // Reset daily progress (for testing or new day)
  const resetDaily = () => {
    localStorage.setItem("quizLevelsCompleted", "0");
    setDailyCompleted(false);
    setCurrentLevel(1);
    setScore(0);
    setLevelQuestions(getLevelQuestions(allQuestions));
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
  };

  const progress = ((currentQuestion + 1) / levelQuestions.length) * 100;

  // Daily limit reached
  if (dailyCompleted) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Daily Quiz Limit Reached!</h1>
        <div className={styles.section}>
          <p>You’ve completed {checkDailyProgress() * 5} questions today.</p>
          <p>Your Total Score: {score} BTC</p>
          <p>Come back tomorrow for more mining!</p>
          <button onClick={resetDaily} className={styles.xLink}>
            Reset for Testing
          </button>
        </div>
      </div>
    );
  }

  // Level completed
  if (showResult) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Level {currentLevel} Completed!</h1>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Crypto Wallet</h2>
          <p>Level Score: {score - (currentLevel - 1) * 5} / 5 BTC</p>
          <p>Total Score: {score} BTC</p>
          <p>{score === currentLevel * 5 ? "Perfect mining run!" : "Some blocks were missed!"}</p>
          <button onClick={handleNextLevel} className={styles.xLink}>
            Next Level
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Crypto Quiz - Level {currentLevel}</h1>
      <div className={styles.section}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        <h2 className={styles.sectionTitle}>
          Block {currentQuestion + 1} of 5 (Time: {timeLeft}s)
        </h2>
        <p>{levelQuestions[currentQuestion]?.question}</p>
        <ul>
          {levelQuestions[currentQuestion]?.options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`${styles.xLink} ${
                  selectedAnswer === option
                    ? option === levelQuestions[currentQuestion].correctAnswer
                      ? styles.correct
                      : styles.incorrect
                    : ""
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        {selectedAnswer && (
          <p className={styles.feedback}>
            {selectedAnswer === levelQuestions[currentQuestion].correctAnswer
              ? "Mined a block! +1 BTC"
              : "Transaction rejected—wrong hash!"}
          </p>
        )}
      </div>
      <button className={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
        ↑ Top
      </button>
    </div>
  );
}