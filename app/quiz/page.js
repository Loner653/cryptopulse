"use client";

import { useState, useEffect } from "react";
import styles from "./quiz.module.css";
import { db, analytics } from "../lib/firebase"; // Adjusted to match your firebase.js
import { ref, get, set, onValue } from "firebase/database";

export default function CryptoQuiz() {
  const [allQuestions, setAllQuestions] = useState([]); // All questions
  const [currentLevel, setCurrentLevel] = useState(1); // Current level
  const [levelQuestions, setLevelQuestions] = useState([]); // 5 questions/level
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index in level
  const [score, setScore] = useState(0); // Total BTC score
  const [showResult, setShowResult] = useState(false); // Level complete flag
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Current answer
  const [timeLeft, setTimeLeft] = useState(30); // 30s timer
  const [dailyCompleted, setDailyCompleted] = useState(false); // Daily limit
  const [username, setUsername] = useState(""); // User’s alias
  const [showUsernameModal, setShowUsernameModal] = useState(true); // Username prompt
  const [difficulty, setDifficulty] = useState("beginner"); // Difficulty tier
  const [streak, setStreak] = useState(0); // Consecutive correct answers
  const [achievements, setAchievements] = useState([]); // Earned badges
  const [leaderboard, setLeaderboard] = useState([]); // Top 10 scores
  const [currentTab, setCurrentTab] = useState("quiz"); // Navigation tab

  // Your expanded question pool (...+ questions, abbreviated here)
  const questionPool = [
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
    { question: "What is the name of the process where crypto transactions are verified?", options: ["Mining", "Trading", "Staking", "Burning"], correctAnswer: "Mining", difficulty: "beginner" },
    { question: "Which cryptocurrency was created as a joke but gained popularity?", options: ["Dogecoin", "Bitcoin", "Ethereum", "Litecoin"], correctAnswer: "Dogecoin", difficulty: "beginner" },
    { question: "What does 'BTC' stand for?", options: ["Bitcoin", "Blockchain Token Coin", "Bit Transaction Currency", "Basic Trading Coin"], correctAnswer: "Bitcoin", difficulty: "beginner" },
    { question: "What is a 'block' in blockchain?", options: ["A group of transactions", "A type of wallet", "A mining tool", "A crypto coin"], correctAnswer: "A group of transactions", difficulty: "beginner" },
    { question: "Which of these is a type of cryptocurrency wallet?", options: ["Paper Wallet", "Cloud Wallet", "Sky Wallet", "Rain Wallet"], correctAnswer: "Paper Wallet", difficulty: "beginner" },
    { question: "What does 'FUD' mean in crypto slang?", options: ["Fear, Uncertainty, Doubt", "Fast Utility Delivery", "Frequent User Discount", "Future Utility Demand"], correctAnswer: "Fear, Uncertainty, Doubt", difficulty: "beginner" },
    { question: "What is the name of the token used on the Dogecoin blockchain?", options: ["DOGE", "SHIB", "BTC", "ETH"], correctAnswer: "DOGE", difficulty: "beginner" },
    { question: "What is a 'public key' used for in crypto?", options: ["Receiving funds", "Mining coins", "Creating tokens", "Burning assets"], correctAnswer: "Receiving funds", difficulty: "beginner" },
    { question: "What does 'ATH' stand for in crypto?", options: ["All-Time High", "Average Transaction Hash", "Automated Trading Hub", "Annual Token Harvest"], correctAnswer: "All-Time High", difficulty: "beginner" },
    { question: "Which of these is a popular crypto payment processor?", options: ["BitPay", "CoinSwap", "BlockMine", "EtherHub"], correctAnswer: "BitPay", difficulty: "beginner" },
    { question: "What is the name of the token used on the Litecoin blockchain?", options: ["LTC", "ETH", "XRP", "BNB"], correctAnswer: "LTC", difficulty: "beginner" },
    { question: "What does 'wallet' software primarily do?", options: ["Manages private keys", "Mines crypto", "Trades tokens", "Creates blockchains"], correctAnswer: "Manages private keys", difficulty: "beginner" },
    { question: "Which term refers to a sudden increase in a crypto’s price?", options: ["Pump", "Dump", "Dip", "Burn"], correctAnswer: "Pump", difficulty: "beginner" },
    { question: "What is a 'private key' used for?", options: ["Spending funds", "Receiving funds", "Mining blocks", "Trading pairs"], correctAnswer: "Spending funds", difficulty: "beginner" },
    { question: "Which of these is a type of crypto scam?", options: ["Ponzi Scheme", "Proof Scheme", "Block Scheme", "Hash Scheme"], correctAnswer: "Ponzi Scheme", difficulty: "beginner" },
    { question: "What does 'DYOR' mean in crypto?", options: ["Do Your Own Research", "Daily Yield On Return", "Decentralized Yield Operations", "Dynamic Yield Optimization"], correctAnswer: "Do Your Own Research", difficulty: "beginner" },
    { question: "What is the name of the token used on the Bitcoin Cash blockchain?", options: ["BCH", "BTC", "ETH", "XRP"], correctAnswer: "BCH", difficulty: "beginner" },
    { question: "What is a 'crypto exchange' used for?", options: ["Buying and selling crypto", "Mining new coins", "Creating wallets", "Burning tokens"], correctAnswer: "Buying and selling crypto", difficulty: "beginner" },
    { question: "Which of these is a popular mobile crypto wallet?", options: ["Trust Wallet", "Block Wallet", "Chain Wallet", "Hash Wallet"], correctAnswer: "Trust Wallet", difficulty: "beginner" },
    { question: "What does 'Lambo' refer to in crypto slang?", options: ["A luxury car from profits", "A type of token", "A mining rig", "A blockchain layer"], correctAnswer: "A luxury car from profits", difficulty: "beginner" },
    { question: "What is the name of the token used on the EOS blockchain?", options: ["EOS", "ETH", "SOL", "ADA"], correctAnswer: "EOS", difficulty: "beginner" },
    { question: "What does 'bullish' mean in crypto trading?", options: ["Expecting price to rise", "Expecting price to fall", "Holding long-term", "Selling quickly"], correctAnswer: "Expecting price to rise", difficulty: "beginner" },
    { question: "What is a 'bear market'?", options: ["A declining market", "A rising market", "A stable market", "A new market"], correctAnswer: "A declining market", difficulty: "beginner" },
    { question: "Which of these is a popular crypto news site?", options: ["CoinDesk", "BlockNews", "ChainTimes", "HashPost"], correctAnswer: "CoinDesk", difficulty: "beginner" },
    { question: "What does 'moon' mean in crypto slang?", options: ["A price soaring high", "A price crashing", "A new coin launch", "A mining term"], correctAnswer: "A price soaring high", difficulty: "beginner" },
    { question: "What is the name of the token used on the NEM blockchain?", options: ["XEM", "ETH", "SOL", "BNB"], correctAnswer: "XEM", difficulty: "beginner" },
    { question: "What is a 'crypto faucet'?", options: ["A site giving free crypto", "A mining tool", "A trading bot", "A wallet type"], correctAnswer: "A site giving free crypto", difficulty: "beginner" },
    { question: "Which of these is a type of crypto token?", options: ["Utility Token", "Mining Token", "Hash Token", "Block Token"], correctAnswer: "Utility Token", difficulty: "beginner" },
    { question: "What does 'whale' refer to in crypto?", options: ["A large holder of crypto", "A small investor", "A mining pool", "A new exchange"], correctAnswer: "A large holder of crypto", difficulty: "beginner" },
    { question: "What is the name of the token used on the Lisk blockchain?", options: ["LSK", "ETH", "SOL", "ADA"], correctAnswer: "LSK", difficulty: "beginner" },
    { question: "What does 'bagholder' mean in crypto?", options: ["Someone holding losing assets", "A wallet owner", "A miner", "A trader"], correctAnswer: "Someone holding losing assets", difficulty: "beginner" },
    { question: "Which of these is a popular crypto hardware wallet brand?", options: ["Trezor", "MetaMask", "Trust", "Coinbase"], correctAnswer: "Trezor", difficulty: "beginner" },
    { question: "What is a 'dust' amount in crypto?", options: ["A tiny amount of crypto", "A large amount", "A burned token", "A mined coin"], correctAnswer: "A tiny amount of crypto", difficulty: "beginner" },
    { question: "What does 'shilling' mean in crypto?", options: ["Promoting a coin heavily", "Selling a coin", "Mining a coin", "Burning a coin"], correctAnswer: "Promoting a coin heavily", difficulty: "beginner" },
    { question: "What is the name of the token used on the Nano blockchain?", options: ["XNO", "ETH", "SOL", "BNB"], correctAnswer: "XNO", difficulty: "beginner" },
    { question: "What does 'to the moon' imply in crypto?", options: ["A big price increase", "A price drop", "A new wallet", "A mining reward"], correctAnswer: "A big price increase", difficulty: "beginner" },
    { question: "Which of these is a type of crypto transaction fee?", options: ["Gas Fee", "Hash Fee", "Block Fee", "Chain Fee"], correctAnswer: "Gas Fee", difficulty: "beginner" },
    { question: "What is a 'crypto airdrop'?", options: ["Free token distribution", "A price drop", "A mining event", "A wallet backup"], correctAnswer: "Free token distribution", difficulty: "beginner" },
    { question: "What does 'REKT' mean in crypto slang?", options: ["Financially ruined", "Rewarded", "Retired", "Reinvested"], correctAnswer: "Financially ruined", difficulty: "beginner" },
    { question: "What is the name of the token used on the Ravencoin blockchain?", options: ["RVN", "ETH", "SOL", "ADA"], correctAnswer: "RVN", difficulty: "beginner" },
    { question: "What is a 'crypto mixer' used for?", options: ["Enhancing privacy", "Mining coins", "Trading pairs", "Burning tokens"], correctAnswer: "Enhancing privacy", difficulty: "beginner" },
    { question: "Which of these is a popular crypto charting tool?", options: ["TradingView", "BlockChart", "ChainView", "HashGraph"], correctAnswer: "TradingView", difficulty: "beginner" },
    { question: "What does 'dip' mean in crypto trading?", options: ["A price drop", "A price rise", "A new coin", "A wallet"], correctAnswer: "A price drop", difficulty: "beginner" },
    { question: "What is the name of the token used on the Decred blockchain?", options: ["DCR", "ETH", "SOL", "BNB"], correctAnswer: "DCR", difficulty: "beginner" },
    { question: "What does 'hash' refer to in crypto?", options: ["A cryptographic function", "A wallet type", "A trading pair", "A coin name"], correctAnswer: "A cryptographic function", difficulty: "beginner" },
    { question: "Which of these is a type of crypto scam?", options: ["Phishing", "Mining", "Staking", "Trading"], correctAnswer: "Phishing", difficulty: "beginner" },
    { question: "What is a 'crypto ticker'?", options: ["A coin’s symbol", "A mining tool", "A wallet app", "A blockchain"], correctAnswer: "A coin’s symbol", difficulty: "beginner" },
    { question: "What does 'BTFD' stand for in crypto?", options: ["Buy The F***ing Dip", "Build The Future Decentralized", "Burn The Fiat Dollars", "Boost The Funding Daily"], correctAnswer: "Buy The F***ing Dip", difficulty: "beginner" },
    { question: "What is the name of the token used on the Zilliqa blockchain?", options: ["ZIL", "ETH", "SOL", "ADA"], correctAnswer: "ZIL", difficulty: "beginner" },
    { question: "What does 'crypto custody' mean?", options: ["Safekeeping of assets", "Mining of coins", "Trading of tokens", "Burning of funds"], correctAnswer: "Safekeeping of assets", difficulty: "beginner" },
    { question: "Which of these is a popular crypto forum?", options: ["Reddit", "BlockForum", "ChainChat", "HashTalk"], correctAnswer: "Reddit", difficulty: "beginner" },
    { question: "What is a 'crypto pump and dump'?", options: ["A price manipulation scheme", "A mining strategy", "A wallet feature", "A staking method"], correctAnswer: "A price manipulation scheme", difficulty: "beginner" },
    { question: "What does 'NGMI' mean in crypto slang?", options: ["Not Gonna Make It", "New Global Market Index", "Next Generation Mining Initiative", "No Gain Market Investment"], correctAnswer: "Not Gonna Make It", difficulty: "beginner" },
    { question: "What is the name of the token used on the Internet Computer blockchain?", options: ["ICP", "ETH", "SOL", "BNB"], correctAnswer: "ICP", difficulty: "beginner" },
    { question: "What does 'crypto volatility' refer to?", options: ["Price fluctuations", "Mining speed", "Wallet security", "Token supply"], correctAnswer: "Price fluctuations", difficulty: "beginner" },
    { question: "Which of these is a type of crypto exchange?", options: ["Spot Exchange", "Block Exchange", "Hash Exchange", "Chain Exchange"], correctAnswer: "Spot Exchange", difficulty: "beginner" },
    { question: "What does 'WAGMI' mean in crypto?", options: ["We’re All Gonna Make It", "Wallet Address Generation Method", "Worldwide Annual Growth Market", "Web3 Annual General Meeting"], correctAnswer: "We’re All Gonna Make It", difficulty: "beginner" },
    { question: "What is the name of the token used on the Flow blockchain?", options: ["FLOW", "ETH", "SOL", "ADA"], correctAnswer: "FLOW", difficulty: "beginner" },
    { question: "What is a 'crypto seed phrase'?", options: ["A wallet recovery key", "A mining code", "A trading signal", "A blockchain ID"], correctAnswer: "A wallet recovery key", difficulty: "beginner" },
    { question: "Which of these is a popular crypto analytics site?", options: ["CoinMarketCap", "BlockStats", "ChainData", "HashMetrics"], correctAnswer: "CoinMarketCap", difficulty: "beginner" },
    { question: "What does 'crypto staking' involve?", options: ["Locking coins for rewards", "Trading coins", "Mining coins", "Burning coins"], correctAnswer: "Locking coins for rewards", difficulty: "beginner" },
    { question: "What is the name of the token used on the Celo blockchain?", options: ["CELO", "ETH", "SOL", "BNB"], correctAnswer: "CELO", difficulty: "beginner" },
    { question: "What does 'crypto liquidity' mean?", options: ["Ease of buying/selling", "Mining speed", "Wallet capacity", "Token supply"], correctAnswer: "Ease of buying/selling", difficulty: "beginner" },
    { question: "Which of these is a type of crypto wallet?", options: ["Software Wallet", "Cloud Wallet", "Sky Wallet", "Rain Wallet"], correctAnswer: "Software Wallet", difficulty: "beginner" },
    { question: "What does 'crypto adoption' refer to?", options: ["Widespread use of crypto", "Mining growth", "Wallet creation", "Token burning"], correctAnswer: "Widespread use of crypto", difficulty: "beginner" },
    { question: "What is the name of the token used on the WAX blockchain?", options: ["WAXP", "ETH", "SOL", "ADA"], correctAnswer: "WAXP", difficulty: "beginner" },
    { question: "What does 'crypto fork' mean?", options: ["A blockchain split", "A wallet type", "A mining tool", "A trading pair"], correctAnswer: "A blockchain split", difficulty: "beginner" },
    { question: "Which of these is a popular crypto social platform?", options: ["Twitter", "BlockSocial", "ChainTalk", "HashConnect"], correctAnswer: "Twitter", difficulty: "beginner" },
    { question: "What does 'crypto burn' mean?", options: ["Removing tokens from supply", "Mining new coins", "Trading assets", "Staking funds"], correctAnswer: "Removing tokens from supply", difficulty: "beginner" },
    { question: "What is the name of the token used on the Hive blockchain?", options: ["HIVE", "ETH", "SOL", "BNB"], correctAnswer: "HIVE", difficulty: "beginner" },
    { question: "What does 'crypto hash rate' measure?", options: ["Mining power", "Trading volume", "Wallet security", "Token price"], correctAnswer: "Mining power", difficulty: "beginner" },
    { question: "Which of these is a type of crypto asset?", options: ["Security Token", "Mining Token", "Hash Token", "Block Token"], correctAnswer: "Security Token", difficulty: "beginner" },
    { question: "What does 'crypto leverage' mean?", options: ["Borrowing to trade", "Mining with more power", "Staking more coins", "Burning assets"], correctAnswer: "Borrowing to trade", difficulty: "beginner" },
    { question: "What is the name of the token used on the Steem blockchain?", options: ["STEEM", "ETH", "SOL", "ADA"], correctAnswer: "STEEM", difficulty: "beginner" },
    { question: "What does 'crypto arbitrage' mean?", options: ["Price difference trading", "Mining strategy", "Wallet backup", "Token burning"], correctAnswer: "Price difference trading", difficulty: "beginner" },
    { question: "Which of these is a popular crypto exchange?", options: ["Kraken", "BlockTrade", "ChainSwap", "HashMarket"], correctAnswer: "Kraken", difficulty: "beginner" },
    { question: "What does 'crypto slippage' refer to?", options: ["Price change during trade", "Mining delay", "Wallet error", "Token burn"], correctAnswer: "Price change during trade", difficulty: "beginner" },
    { question: "What is the name of the token used on the BitTorrent blockchain?", options: ["BTT", "ETH", "SOL", "BNB"], correctAnswer: "BTT", difficulty: "beginner" },
    { question: "What does 'crypto market cap' measure?", options: ["Total value of a coin", "Mining power", "Wallet count", "Trading volume"], correctAnswer: "Total value of a coin", difficulty: "beginner" },
    { question: "Which of these is a type of crypto scam?", options: ["Rug Pull", "Block Pull", "Chain Pull", "Hash Pull"], correctAnswer: "Rug Pull", difficulty: "beginner" },
    { question: "What does 'crypto yield' mean?", options: ["Profit from staking", "Mining speed", "Trading loss", "Wallet fee"], correctAnswer: "Profit from staking", difficulty: "beginner" },
    { question: "What is the name of the token used on the Holo blockchain?", options: ["HOT", "ETH", "SOL", "ADA"], correctAnswer: "HOT", difficulty: "beginner" },
    { question: "What does 'crypto vesting' mean?", options: ["Locked tokens over time", "Burned tokens", "Mined coins", "Traded assets"], correctAnswer: "Locked tokens over time", difficulty: "beginner" },
    { question: "Which of these is a popular crypto browser?", options: ["Brave", "BlockBrowser", "ChainWeb", "HashNet"], correctAnswer: "Brave", difficulty: "beginner" },
    { question: "What does 'crypto inflation' refer to?", options: ["Increase in token supply", "Price drop", "Mining cost", "Wallet limit"], correctAnswer: "Increase in token supply", difficulty: "beginner" },
    { question: "What is the name of the token used on the Ankr blockchain?", options: ["ANKR", "ETH", "SOL", "BNB"], correctAnswer: "ANKR", difficulty: "beginner" },
    { question: "What does 'crypto governance' mean?", options: ["Community decision-making", "Mining rules", "Wallet security", "Trading limits"], correctAnswer: "Community decision-making", difficulty: "beginner" },
    { question: "Which of these is a type of crypto wallet?", options: ["Hardware Wallet", "Cloud Wallet", "Sky Wallet", "Rain Wallet"], correctAnswer: "Hardware Wallet", difficulty: "beginner" },
    { question: "What does 'crypto halving' mean?", options: ["Reduction in mining rewards", "Price increase", "Wallet split", "Token burn"], correctAnswer: "Reduction in mining rewards", difficulty: "beginner" },
    { question: "What is the name of the token used on the Cartesi blockchain?", options: ["CTSI", "ETH", "SOL", "ADA"], correctAnswer: "CTSI", difficulty: "beginner" },
    { question: "What does 'crypto decentralization' mean?", options: ["No central authority", "Central control", "Mining monopoly", "Trading hub"], correctAnswer: "No central authority", difficulty: "beginner" },
    { question: "Which of these is a popular crypto exchange?", options: ["Coinbase", "BlockBase", "ChainCoin", "HashTrade"], correctAnswer: "Coinbase", difficulty: "beginner" },
    { question: "What does 'crypto consensus' mean?", options: ["Agreement on transactions", "Mining speed", "Wallet type", "Trading pair"], correctAnswer: "Agreement on transactions", difficulty: "beginner" },
    { question: "What is the name of the token used on the Chromia blockchain?", options: ["CHR", "ETH", "SOL", "BNB"], correctAnswer: "CHR", difficulty: "beginner" },
    { question: "What does 'crypto peg' mean?", options: ["Value tied to an asset", "Mining limit", "Wallet lock", "Trading cap"], correctAnswer: "Value tied to an asset", difficulty: "beginner" },
    { question: "Which of these is a type of crypto token?", options: ["Governance Token", "Mining Token", "Hash Token", "Block Token"], correctAnswer: "Governance Token", difficulty: "beginner" },
    { question: "What does 'crypto spoofing' mean?", options: ["Fake trading activity", "Mining trick", "Wallet hack", "Token burn"], correctAnswer: "Fake trading activity", difficulty: "beginner" },
    { question: "What is the name of the token used on the Wanchain blockchain?", options: ["WAN", "ETH", "SOL", "ADA"], correctAnswer: "WAN", difficulty: "beginner" },

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
    { question: "Which blockchain uses 'Proof of Stake' as its primary consensus?", options: ["Cardano", "Bitcoin", "Litecoin", "Ripple"], correctAnswer: "Cardano", difficulty: "intermediate" },
    { question: "What year was Ethereum launched?", options: ["2015", "2013", "2017", "2011"], correctAnswer: "2015", difficulty: "intermediate" },
    { question: "Which crypto exchange introduced the concept of 'Launchpad' for token sales?", options: ["Binance", "Coinbase", "Kraken", "Bitfinex"], correctAnswer: "Binance", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Arbitrum layer-2 solution?", options: ["ARB", "ETH", "SOL", "MATIC"], correctAnswer: "ARB", difficulty: "intermediate" },
    { question: "Which blockchain is known for its 'zero-fee' transactions?", options: ["Nano", "Bitcoin", "Ethereum", "Ripple"], correctAnswer: "Nano", difficulty: "intermediate" },
    { question: "What is the name of the first major Bitcoin fork?", options: ["Bitcoin Cash", "Bitcoin SV", "Bitcoin Gold", "Litecoin"], correctAnswer: "Bitcoin Cash", difficulty: "intermediate" },
    { question: "Which DeFi protocol is known for its lending and borrowing platform?", options: ["Aave", "Uniswap", "Curve", "Balancer"], correctAnswer: "Aave", difficulty: "intermediate" },
    { question: "What year did the Bitcoin halving occur that reduced the reward to 6.25 BTC?", options: ["2020", "2016", "2024", "2012"], correctAnswer: "2020", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Importance' as its consensus?", options: ["NEM", "EOS", "Tezos", "Stellar"], correctAnswer: "NEM", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Optimism layer-2 solution?", options: ["OP", "ETH", "SOL", "BNB"], correctAnswer: "OP", difficulty: "intermediate" },
    { question: "Which crypto exchange was founded by the Winklevoss twins?", options: ["Gemini", "Coinbase", "Kraken", "Binance"], correctAnswer: "Gemini", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Kava blockchain?", options: ["KAVA", "ETH", "SOL", "ADA"], correctAnswer: "KAVA", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on supply chain management?", options: ["VeChain", "Ripple", "Stellar", "EOS"], correctAnswer: "VeChain", difficulty: "intermediate" },
    { question: "What is the name of the token used on the THORChain blockchain?", options: ["RUNE", "ETH", "SOL", "BNB"], correctAnswer: "RUNE", difficulty: "intermediate" },
    { question: "Which crypto event caused a major price crash in 2018?", options: ["Bitcoin Cash Fork", "Mt. Gox Hack", "Ethereum DAO Hack", "Binance Launch"], correctAnswer: "Bitcoin Cash Fork", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Terra blockchain before its collapse?", options: ["LUNA", "UST", "ETH", "SOL"], correctAnswer: "LUNA", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Capacity' for mining?", options: ["Burstcoin", "Chia", "Filecoin", "Sia"], correctAnswer: "Burstcoin", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Injective Protocol?", options: ["INJ", "ETH", "SOL", "ADA"], correctAnswer: "INJ", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'margin trading' features?", options: ["BitMEX", "Coinbase", "Kraken", "Gemini"], correctAnswer: "BitMEX", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Perpetual Protocol?", options: ["PERP", "ETH", "SOL", "BNB"], correctAnswer: "PERP", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on gaming NFTs?", options: ["WAX", "Ethereum", "Solana", "Polygon"], correctAnswer: "WAX", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Audius protocol?", options: ["AUDIO", "ETH", "SOL", "ADA"], correctAnswer: "AUDIO", difficulty: "intermediate" },
    { question: "Which crypto exchange was hacked in 2019, losing 7,000 BTC?", options: ["Binance", "Coinbase", "Kraken", "Bitfinex"], correctAnswer: "Binance", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SKALE Network?", options: ["SKL", "ETH", "SOL", "BNB"], correctAnswer: "SKL", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Activity' as its consensus?", options: ["Decred", "NEM", "EOS", "Tezos"], correctAnswer: "Decred", difficulty: "intermediate" },
    { question: "What is the name of the token used on the BarnBridge protocol?", options: ["BOND", "ETH", "SOL", "ADA"], correctAnswer: "BOND", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'zero-fee' trading pairs?", options: ["KuCoin", "Binance", "Coinbase", "Kraken"], correctAnswer: "KuCoin", difficulty: "intermediate" },
    { question: "What is the name of the token used on the DODO protocol?", options: ["DODO", "ETH", "SOL", "BNB"], correctAnswer: "DODO", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on video streaming?", options: ["Theta", "Ethereum", "Solana", "Polygon"], correctAnswer: "Theta", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Hegic protocol?", options: ["HEGIC", "ETH", "SOL", "ADA"], correctAnswer: "HEGIC", difficulty: "intermediate" },
    { question: "Which crypto event marked the start of the DeFi boom in 2020?", options: ["Compound’s COMP launch", "Uniswap V2", "Aave V1", "MakerDAO crash"], correctAnswer: "Compound’s COMP launch", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Mirror protocol?", options: ["MIR", "ETH", "SOL", "BNB"], correctAnswer: "MIR", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Reputation' as its consensus?", options: ["GoChain", "NEM", "EOS", "Tezos"], correctAnswer: "GoChain", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Anchor protocol?", options: ["ANC", "ETH", "SOL", "ADA"], correctAnswer: "ANC", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'futures trading' platform?", options: ["Bybit", "Coinbase", "Kraken", "Gemini"], correctAnswer: "Bybit", difficulty: "intermediate" },
    { question: "What is the name of the token used on the UMA protocol?", options: ["UMA", "ETH", "SOL", "BNB"], correctAnswer: "UMA", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on IoT devices?", options: ["IOTA", "VeChain", "Helium", "NEM"], correctAnswer: "IOTA", difficulty: "intermediate" },
    { question: "What is the name of the token used on the API3 protocol?", options: ["API3", "ETH", "SOL", "ADA"], correctAnswer: "API3", difficulty: "intermediate" },
    { question: "Which crypto exchange was founded in 2012 and is based in the US?", options: ["Coinbase", "Binance", "Kraken", "Bitfinex"], correctAnswer: "Coinbase", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Band Protocol?", options: ["BAND", "ETH", "SOL", "BNB"], correctAnswer: "BAND", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Transfer' for cross-chain swaps?", options: ["THORChain", "Cosmos", "Polkadot", "Avalanche"], correctAnswer: "THORChain", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ocean Protocol?", options: ["OCEAN", "ETH", "SOL", "ADA"], correctAnswer: "OCEAN", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'staking rewards' program?", options: ["Kraken", "Coinbase", "Binance", "Gemini"], correctAnswer: "Kraken", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Ren protocol?", options: ["REN", "ETH", "SOL", "BNB"], correctAnswer: "REN", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on social media?", options: ["Steem", "Hive", "Theta", "WAX"], correctAnswer: "Steem", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Alpha Finance protocol?", options: ["ALPHA", "ETH", "SOL", "ADA"], correctAnswer: "ALPHA", difficulty: "intermediate" },
    { question: "Which crypto exchange was hacked in 2016, losing 120,000 BTC?", options: ["Bitfinex", "Binance", "Coinbase", "Kraken"], correctAnswer: "Bitfinex", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Badger DAO protocol?", options: ["BADGER", "ETH", "SOL", "BNB"], correctAnswer: "BADGER", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Stake' with a focus on governance?", options: ["Tezos", "Cardano", "EOS", "NEM"], correctAnswer: "Tezos", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Harvest Finance protocol?", options: ["FARM", "ETH", "SOL", "ADA"], correctAnswer: "FARM", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'spot trading' focus?", options: ["Bittrex", "Bybit", "BitMEX", "KuCoin"], correctAnswer: "Bittrex", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Cream Finance protocol?", options: ["CREAM", "ETH", "SOL", "BNB"], correctAnswer: "CREAM", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on decentralized storage?", options: ["Filecoin", "Sia", "Arweave", "IPFS"], correctAnswer: "Filecoin", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Alpaca Finance protocol?", options: ["ALPACA", "ETH", "SOL", "ADA"], correctAnswer: "ALPACA", difficulty: "intermediate" },
    { question: "Which crypto exchange is based in Malta?", options: ["Binance", "Coinbase", "Kraken", "Gemini"], correctAnswer: "Binance", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Venus protocol?", options: ["XVS", "ETH", "SOL", "BNB"], correctAnswer: "XVS", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Space' for eco-friendly mining?", options: ["Chia", "Burstcoin", "Filecoin", "Sia"], correctAnswer: "Chia", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Autofarm protocol?", options: ["AUTO", "ETH", "SOL", "ADA"], correctAnswer: "AUTO", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'P2P trading' platform?", options: ["LocalBitcoins", "Binance", "Coinbase", "Kraken"], correctAnswer: "LocalBitcoins", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Beefy Finance protocol?", options: ["BIFI", "ETH", "SOL", "BNB"], correctAnswer: "BIFI", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on fan tokens?", options: ["Chiliz", "WAX", "Theta", "Flow"], correctAnswer: "Chiliz", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SpiritSwap protocol?", options: ["SPIRIT", "ETH", "SOL", "ADA"], correctAnswer: "SPIRIT", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'OTC trading' desk?", options: ["Huobi", "Binance", "Coinbase", "Kraken"], correctAnswer: "Huobi", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SpookySwap protocol?", options: ["BOO", "ETH", "SOL", "BNB"], correctAnswer: "BOO", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Authority' for enterprise use?", options: ["VeChain", "Ripple", "Stellar", "EOS"], correctAnswer: "VeChain", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Trader Joe protocol?", options: ["JOE", "ETH", "SOL", "ADA"], correctAnswer: "JOE", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'IEO' platform?", options: ["OKX", "Coinbase", "Kraken", "Gemini"], correctAnswer: "OKX", difficulty: "intermediate" },
    { question: "What is the name of the token used on the QuickSwap protocol?", options: ["QUICK", "ETH", "SOL", "BNB"], correctAnswer: "QUICK", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on music streaming?", options: ["Audius", "Theta", "WAX", "Flow"], correctAnswer: "Audius", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Saber protocol?", options: ["SBR", "ETH", "SOL", "ADA"], correctAnswer: "SBR", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'copy trading' feature?", options: ["eToro", "Binance", "Coinbase", "Kraken"], correctAnswer: "eToro", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Orca protocol?", options: ["ORCA", "ETH", "SOL", "BNB"], correctAnswer: "ORCA", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Burn' for token economics?", options: ["Counterparty", "Ripple", "Stellar", "EOS"], correctAnswer: "Counterparty", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Raydium protocol?", options: ["RAY", "ETH", "SOL", "ADA"], correctAnswer: "RAY", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'grid trading' bot?", options: ["Pionex", "Binance", "Coinbase", "Kraken"], correctAnswer: "Pionex", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Serum protocol?", options: ["SRM", "ETH", "SOL", "BNB"], correctAnswer: "SRM", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on decentralized identity?", options: ["Civic", "VeChain", "IOTA", "NEM"], correctAnswer: "Civic", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Bancor protocol?", options: ["BNT", "ETH", "SOL", "ADA"], correctAnswer: "BNT", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'lending' platform?", options: ["Nexo", "Binance", "Coinbase", "Kraken"], correctAnswer: "Nexo", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Kyber Network?", options: ["KNC", "ETH", "SOL", "BNB"], correctAnswer: "KNC", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Stake' with a focus on scalability?", options: ["Polygon", "Cardano", "EOS", "NEM"], correctAnswer: "Polygon", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Loopring protocol?", options: ["LRC", "ETH", "SOL", "ADA"], correctAnswer: "LRC", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'derivatives' trading?", options: ["Deribit", "Binance", "Coinbase", "Kraken"], correctAnswer: "Deribit", difficulty: "intermediate" },
    { question: "What is the name of the token used on the dYdX protocol?", options: ["DYDX", "ETH", "SOL", "BNB"], correctAnswer: "DYDX", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on prediction markets?", options: ["Augur", "VeChain", "IOTA", "NEM"], correctAnswer: "Augur", difficulty: "intermediate" },
    { question: "What is the name of the token used on the 1inch protocol?", options: ["1INCH", "ETH", "SOL", "ADA"], correctAnswer: "1INCH", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'savings' accounts?", options: ["Crypto.com", "Binance", "Coinbase", "Kraken"], correctAnswer: "Crypto.com", difficulty: "intermediate" },
    { question: "What is the name of the token used on the PancakeSwap protocol?", options: ["CAKE", "ETH", "SOL", "BNB"], correctAnswer: "CAKE", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Stake' with a focus on interoperability?", options: ["Cosmos", "Cardano", "EOS", "NEM"], correctAnswer: "Cosmos", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Synthetix protocol?", options: ["SNX", "ETH", "SOL", "ADA"], correctAnswer: "SNX", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'token launch' platform?", options: ["Gate.io", "Binance", "Coinbase", "Kraken"], correctAnswer: "Gate.io", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Yearn Finance protocol?", options: ["YFI", "ETH", "SOL", "BNB"], correctAnswer: "YFI", difficulty: "intermediate" },
    { question: "Which blockchain is known for its focus on digital art?", options: ["Flow", "WAX", "Theta", "Chiliz"], correctAnswer: "Flow", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Balancer protocol?", options: ["BAL", "ETH", "SOL", "ADA"], correctAnswer: "BAL", difficulty: "intermediate" },
    { question: "Which crypto exchange is known for its 'insurance fund'?", options: ["FTX (pre-collapse)", "Binance", "Coinbase", "Kraken"], correctAnswer: "FTX (pre-collapse)", difficulty: "intermediate" },
    { question: "What is the name of the token used on the Curve protocol?", options: ["CRV", "ETH", "SOL", "BNB"], correctAnswer: "CRV", difficulty: "intermediate" },
    { question: "Which blockchain uses 'Proof of Stake' with a focus on payments?", options: ["Stellar", "Cardano", "EOS", "NEM"], correctAnswer: "Stellar", difficulty: "intermediate" },
    { question: "What is the name of the token used on the SushiSwap protocol?", options: ["SUSHI", "ETH", "SOL", "ADA"], correctAnswer: "SUSHI", difficulty: "intermediate" },

    // Advanced Questions (expanded from 120 to 170+)
    { question: "Which token standard is commonly used for NFTs on Ethereum?", options: ["ERC-20", "ERC-721", "ERC-1155", "ERC-777"], correctAnswer: "ERC-721", difficulty: "advanced" },
    { question: "What is the name of Cardano’s staking mechanism?", options: ["Ouroboros", "Byzantine Fault Tolerance", "Tendermint", "Casper"], correctAnswer: "Ouroboros", difficulty: "advanced" },
    { question: "What is the name of the algorithm used by Bitcoin for mining?", options: ["SHA-256", "Ethash", "Scrypt", "Equihash"], correctAnswer: "SHA-256", difficulty: "advanced" },
    { question: "Which blockchain uses a 'Directed Acyclic Graph' (DAG) instead of a traditional chain?", options: ["IOTA", "Bitcoin", "Ethereum", "Tezos"], correctAnswer: "IOTA", difficulty: "advanced" },
    { question: "What is the name of Ethereum’s upgrade that introduced EIP-1559 (fee burning)?", options: ["London", "Berlin", "Istanbul", "Shanghai"], correctAnswer: "London", difficulty: "advanced" },
    { question: "What is Solana’s theoretical maximum TPS (transactions per second)?", options: ["65,000", "10,000", "1,000", "500,000"], correctAnswer: "65,000", difficulty: "advanced" },
    { question: "What gas limit change did EIP-2929 introduce to Ethereum?", options: ["Increased SSTORE cost", "Reduced CALL cost", "Removed gas refunds", "Added gas rebates"], correctAnswer: "Increased SSTORE cost", difficulty: "advanced" },
    { question: "Which blockchain uses 'Tower BFT' as part of its consensus?", options: ["Solana", "Avalanche", "Polkadot", "Cosmos"], correctAnswer: "Solana", difficulty: "advanced" },
    { question: "What is the purpose of Ethereum’s EIP-4844 (Proto-Danksharding)?", options: ["Reduce gas fees via blobs", "Increase block size", "Add PoW again", "Enable smart contracts"], correctAnswer: "Reduce gas fees via blobs", difficulty: "advanced" },
    { question: "Which protocol introduced 'Flash Loans' to DeFi?", options: ["Aave", "Compound", "MakerDAO", "Uniswap"], correctAnswer: "Aave", difficulty: "advanced" },
    { question: "What is the name of Avalanche’s primary consensus protocol?", options: ["Snowman", "Frosty", "Avalanche", "Slush"], correctAnswer: "Avalanche", difficulty: "advanced" },
    { question: "Which blockchain uses 'zk-SNARKs' for transaction privacy?", options: ["Zcash", "Monero", "Dash", "Bitcoin"], correctAnswer: "Zcash", difficulty: "advanced" },
    { question: "What is the main innovation of Cosmos’ Tendermint consensus?", options: ["Byzantine Fault Tolerance", "Proof of Work", "Sharding", "DAG"], correctAnswer: "Byzantine Fault Tolerance", difficulty: "advanced" },
    { question: "Which Ethereum scaling solution uses 'Validium' for off-chain data?", options: ["StarkNet", "Optimism", "Arbitrum", "Polygon"], correctAnswer: "StarkNet", difficulty: "advanced" },
    { question: "What is the block time of Bitcoin on average?", options: ["10 minutes", "1 minute", "15 seconds", "2 minutes"], correctAnswer: "10 minutes", difficulty: "advanced" },
    { question: "Which blockchain’s consensus is based on 'Proof of Spacetime'?", options: ["Filecoin", "Chia", "Arweave", "Sia"], correctAnswer: "Filecoin", difficulty: "advanced" },
    { question: "What is the purpose of EIP-3074 on Ethereum?", options: ["Enable sponsored transactions", "Reduce gas costs", "Add sharding", "Burn ETH"], correctAnswer: "Enable sponsored transactions", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'vaults' for automated yield farming?", options: ["Yearn Finance", "Aave", "Curve", "Balancer"], correctAnswer: "Yearn Finance", difficulty: "advanced" },
    { question: "What is the name of Polkadot’s relay chain governance token?", options: ["DOT", "KSM", "ETH", "LINK"], correctAnswer: "DOT", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Coverage' for IoT networks?", options: ["Helium", "IOTA", "VeChain", "NEM"], correctAnswer: "Helium", difficulty: "advanced" },
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
    { question: "What is the maximum block gas limit on Ethereum as of 2025?", options: ["30 million", "15 million", "50 million", "10 million"], correctAnswer: "30 million", difficulty: "advanced" },
    { question: "Which blockchain uses 'FBA' (Federated Byzantine Agreement)?", options: ["Stellar", "Ripple", "Cardano", "EOS"], correctAnswer: "Stellar", difficulty: "advanced" },
    { question: "What does EIP-3529 remove from Ethereum?", options: ["Gas refunds for SSTORE", "CALL opcode", "SHA-256 precompile", "Gas rebates"], correctAnswer: "Gas refunds for SSTORE", difficulty: "advanced" },
    { question: "Which protocol introduced 'Concentrated Liquidity' to AMMs?", options: ["Uniswap V3", "SushiSwap", "Curve", "Balancer"], correctAnswer: "Uniswap V3", difficulty: "advanced" },
    { question: "What is the name of Algorand’s pure proof-of-stake variant?", options: ["PPoS", "DPoS", "LPoS", "BPoS"], correctAnswer: "PPoS", difficulty: "advanced" },
    { question: "Which blockchain uses 'Snowflake' in its consensus family?", options: ["Avalanche", "Solana", "Polkadot", "Tezos"], correctAnswer: "Avalanche", difficulty: "advanced" },
    { question: "What is the purpose of EIP-3198 on Ethereum?", options: ["Add BASEFEE opcode", "Reduce gas costs", "Enable sharding", "Burn ETH"], correctAnswer: "Add BASEFEE opcode", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of History' alongside PoS?", options: ["Solana", "Cardano", "Ethereum", "Polkadot"], correctAnswer: "Solana", difficulty: "advanced" },
    { question: "What is the block reward for Bitcoin miners as of 2025 (post-2024 halving)?", options: ["3.125 BTC", "6.25 BTC", "1.5625 BTC", "12.5 BTC"], correctAnswer: "3.125 BTC", difficulty: "advanced" },
    { question: "Which DeFi protocol is known for 'stable pools' for pegged assets?", options: ["Curve", "Uniswap", "Balancer", "SushiSwap"], correctAnswer: "Curve", difficulty: "advanced" },
    { question: "What is the name of Tezos’ self-amending upgrade process?", options: ["Baking", "Endorsing", "Protocol Upgrade", "Evolution"], correctAnswer: "Evolution", difficulty: "advanced" },
    { question: "Which blockchain uses 'zk-STARKs' for scalability?", options: ["StarkNet", "zkSync", "Polygon", "Optimism"], correctAnswer: "StarkNet", difficulty: "advanced" },
    { question: "What is the purpose of EIP-1559’s BASEFEE?", options: ["Dynamic fee adjustment", "Fixed fee cap", "Gas refund", "Staking reward"], correctAnswer: "Dynamic fee adjustment", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Space' for eco-friendly mining?", options: ["Chia", "Filecoin", "Arweave", "Sia"], correctAnswer: "Chia", difficulty: "advanced" },
    { question: "What is the name of Cosmos’ inter-blockchain communication protocol?", options: ["IBC", "ICF", "ABCI", "Tendermint"], correctAnswer: "IBC", difficulty: "advanced" },
    { question: "Which Ethereum L2 uses 'Optimistic Rollups'?", options: ["Arbitrum", "zkSync", "StarkNet", "Polygon"], correctAnswer: "Arbitrum", difficulty: "advanced" },
    { question: "What is the purpose of EIP-4444 on Ethereum?", options: ["Prune historical data", "Increase gas limit", "Add sharding", "Burn ETH"], correctAnswer: "Prune historical data", difficulty: "advanced" },
    { question: "Which blockchain uses 'Leased Proof of Stake'?", options: ["Waves", "Tezos", "Cardano", "EOS"], correctAnswer: "Waves", difficulty: "advanced" },
    { question: "What is the name of Polkadot’s parachain auction token?", options: ["DOT", "KSM", "ETH", "LINK"], correctAnswer: "DOT", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'dynamic AMM' for liquidity?", options: ["Balancer", "Uniswap", "Curve", "SushiSwap"], correctAnswer: "Balancer", difficulty: "advanced" },
    { question: "What is the block time of Solana on average?", options: ["400ms", "1s", "10s", "2min"], correctAnswer: "400ms", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Burn' for token economics?", options: ["Counterparty", "Ripple", "Stellar", "EOS"], correctAnswer: "Counterparty", difficulty: "advanced" },
    { question: "What is the purpose of EIP-3855 on Ethereum?", options: ["Add PUSH0 opcode", "Reduce gas costs", "Enable sharding", "Burn ETH"], correctAnswer: "Add PUSH0 opcode", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Authority' for enterprise use?", options: ["VeChain", "Ripple", "Stellar", "EOS"], correctAnswer: "VeChain", difficulty: "advanced" },
    { question: "What is the name of Cardano’s smart contract language?", options: ["Plutus", "Solidity", "Vyper", "Rust"], correctAnswer: "Plutus", difficulty: "advanced" },
    { question: "Which Ethereum L2 uses 'zk-Rollups' for privacy?", options: ["zkSync", "Arbitrum", "Optimism", "Polygon"], correctAnswer: "zkSync", difficulty: "advanced" },
    { question: "What is the purpose of EIP-4345 on Ethereum?", options: ["Adjust difficulty bomb", "Increase gas limit", "Add sharding", "Burn ETH"], correctAnswer: "Adjust difficulty bomb", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Transfer' for cross-chain swaps?", options: ["THORChain", "Cosmos", "Polkadot", "Avalanche"], correctAnswer: "THORChain", difficulty: "advanced" },
    { question: "What is the name of Algorand’s randomness beacon?", options: ["VRF", "RNG", "DRAND", "ORACLE"], correctAnswer: "VRF", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'synthetic assets'?", options: ["Synthetix", "Aave", "Curve", "Uniswap"], correctAnswer: "Synthetix", difficulty: "advanced" },
    { question: "What is the block reward halving interval for Bitcoin?", options: ["210,000 blocks", "100,000 blocks", "420,000 blocks", "50,000 blocks"], correctAnswer: "210,000 blocks", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Elapsed Time'?", options: ["Hyperledger Sawtooth", "Corda", "Quorum", "Fabric"], correctAnswer: "Hyperledger Sawtooth", difficulty: "advanced" },
    { question: "What is the purpose of EIP-4895 on Ethereum?", options: ["Enable beacon chain withdrawals", "Reduce gas costs", "Add sharding", "Burn ETH"], correctAnswer: "Enable beacon chain withdrawals", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Reputation'?", options: ["GoChain", "NEM", "IOST", "Wanchain"], correctAnswer: "GoChain", difficulty: "advanced" },
    { question: "What is the name of Avalanche’s subnet governance token?", options: ["AVAX", "XAVA", "SNOW", "ICE"], correctAnswer: "AVAX", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced the concept of 'transient storage'?", options: ["EIP-1153", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-1153", difficulty: "advanced" },
    { question: "What is the name of Solana’s runtime environment for smart contracts?", options: ["Sealevel", "EVM", "WASM", "Substrate"], correctAnswer: "Sealevel", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake' with a 'slashing' mechanism?", options: ["Ethereum 2.0", "Bitcoin", "Litecoin", "Ripple"], correctAnswer: "Ethereum 2.0", difficulty: "advanced" },
    { question: "What is the maximum TPS of Avalanche’s X-Chain?", options: ["4,500", "65,000", "1,000", "10,000"], correctAnswer: "4,500", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced the 'CREATE2' opcode?", options: ["EIP-1014", "EIP-1559", "EIP-2929", "EIP-3074"], correctAnswer: "EIP-1014", difficulty: "advanced" },
    { question: "What is the name of Polkadot’s runtime environment?", options: ["Substrate", "EVM", "WASM", "Sealevel"], correctAnswer: "Substrate", difficulty: "advanced" },
    { question: "Which blockchain uses 'zk-STARKs' for privacy and scalability?", options: ["StarkNet", "zkSync", "Polygon", "Optimism"], correctAnswer: "StarkNet", difficulty: "advanced" },
    { question: "What is the block time of Cosmos Hub on average?", options: ["6 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "6 seconds", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced the 'BASEFEE' opcode?", options: ["EIP-3198", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3198", difficulty: "advanced" },
    { question: "What is the name of Cardano’s smart contract runtime?", options: ["Plutus Core", "Solidity", "Vyper", "Rust"], correctAnswer: "Plutus Core", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Validation' in its consensus?", options: ["Avalanche", "Solana", "Polkadot", "Cosmos"], correctAnswer: "Avalanche", difficulty: "advanced" },
    { question: "What is the gas limit increase introduced by EIP-1559?", options: ["None, it’s dynamic", "2x", "10 million", "50%"], correctAnswer: "None, it’s dynamic", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'tranches' for risk management?", options: ["BarnBridge", "Aave", "Compound", "MakerDAO"], correctAnswer: "BarnBridge", difficulty: "advanced" },
    { question: "What is the name of Algorand’s smart contract language?", options: ["TEAL", "Solidity", "Vyper", "Plutus"], correctAnswer: "TEAL", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'calldata cost reduction'?", options: ["EIP-4488", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4488", difficulty: "advanced" },
    { question: "What is the maximum TPS of Polygon’s PoS chain?", options: ["7,000", "65,000", "1,000", "10,000"], correctAnswer: "7,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Liquidity' in its consensus?", options: ["Bancor", "Uniswap", "Curve", "Balancer"], correctAnswer: "Bancor", difficulty: "advanced" },
    { question: "What is the name of Tezos’ smart contract language?", options: ["Michelson", "Solidity", "Vyper", "Plutus"], correctAnswer: "Michelson", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'PUSH0' opcode?", options: ["EIP-3855", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3855", difficulty: "advanced" },
    { question: "What is the block time of Binance Smart Chain on average?", options: ["3 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "3 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'synthetic assets' for trading?", options: ["Synthetix", "Aave", "Compound", "MakerDAO"], correctAnswer: "Synthetix", difficulty: "advanced" },
    { question: "What is the name of Solana’s archival storage solution?", options: ["Arweave", "Filecoin", "BigchainDB", "IPFS"], correctAnswer: "Arweave", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'difficulty bomb delay'?", options: ["EIP-4345", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4345", difficulty: "advanced" },
    { question: "What is the maximum TPS of Stellar’s network?", options: ["1,000", "65,000", "4,500", "7,000"], correctAnswer: "1,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Devotion' in its consensus?", options: ["Nebulas", "NEM", "EOS", "Tezos"], correctAnswer: "Nebulas", difficulty: "advanced" },
    { question: "What is the name of Avalanche’s smart contract runtime?", options: ["EVM", "Substrate", "WASM", "Sealevel"], correctAnswer: "EVM", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'beacon chain withdrawals'?", options: ["EIP-4895", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4895", difficulty: "advanced" },
    { question: "What is the block time of Polkadot’s relay chain?", options: ["6 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "6 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'dynamic fees' for liquidity pools?", options: ["Balancer", "Uniswap", "Curve", "SushiSwap"], correctAnswer: "Balancer", difficulty: "advanced" },
    { question: "What is the name of Cosmos’ smart contract runtime?", options: ["CosmWasm", "Solidity", "Vyper", "Plutus"], correctAnswer: "CosmWasm", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'historical data pruning'?", options: ["EIP-4444", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-4444", difficulty: "advanced" },
    { question: "What is the maximum TPS of Ripple’s XRP Ledger?", options: ["1,500", "65,000", "4,500", "7,000"], correctAnswer: "1,500", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Age' in its consensus?", options: ["Peercoin", "NEM", "EOS", "Tezos"], correctAnswer: "Peercoin", difficulty: "advanced" },
    { question: "What is the name of Polygon’s zkEVM runtime?", options: ["EVM", "Substrate", "WASM", "Sealevel"], correctAnswer: "EVM", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'sponsored transactions'?", options: ["EIP-3074", "EIP-1559", "EIP-4844", "EIP-3855"], correctAnswer: "EIP-3074", difficulty: "advanced" },
    { question: "What is the block time of Algorand on average?", options: ["4.4 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "4.4 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'concentrated liquidity'?", options: ["Uniswap V3", "Aave", "Compound", "MakerDAO"], correctAnswer: "Uniswap V3", difficulty: "advanced" },
    { question: "What is the name of Stellar’s smart contract language?", options: ["None (uses transactions)", "Solidity", "Vyper", "Plutus"], correctAnswer: "None (uses transactions)", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'gas refund removal'?", options: ["EIP-3529", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3529", difficulty: "advanced" },
    { question: "What is the maximum TPS of Cardano’s Hydra layer?", options: ["1,000,000", "65,000", "4,500", "7,000"], correctAnswer: "1,000,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Participation' in its consensus?", options: ["Waves", "NEM", "EOS", "Tezos"], correctAnswer: "Waves", difficulty: "advanced" },
    { question: "What is the name of Flow’s smart contract language?", options: ["Cadence", "Solidity", "Vyper", "Plutus"], correctAnswer: "Cadence", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'blob transactions'?", options: ["EIP-4844", "EIP-1559", "EIP-3529", "EIP-3074"], correctAnswer: "EIP-4844", difficulty: "advanced" },
    { question: "What is the block time of Hedera Hashgraph?", options: ["3-5 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "3-5 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'stable pools' for pegged assets?", options: ["Curve", "Uniswap", "Balancer", "SushiSwap"], correctAnswer: "Curve", difficulty: "advanced" },
    { question: "What is the name of IOTA’s smart contract runtime?", options: ["WASP", "Solidity", "Vyper", "Plutus"], correctAnswer: "WASP", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'SSTORE cost increase'?", options: ["EIP-2929", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2929", difficulty: "advanced" },
    { question: "What is the maximum TPS of EOS?", options: ["4,000", "65,000", "1,500", "7,000"], correctAnswer: "4,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Agreement' in its consensus?", options: ["Ontology", "NEM", "EOS", "Tezos"], correctAnswer: "Ontology", difficulty: "advanced" },
    { question: "What is the name of VeChain’s smart contract runtime?", options: ["VET (none specific)", "Solidity", "Vyper", "Plutus"], correctAnswer: "VET (none specific)", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'EVM object format'?", options: ["EIP-3541", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3541", difficulty: "advanced" },
    { question: "What is the block time of Tron on average?", options: ["3 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "3 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'vaults' for yield optimization?", options: ["Yearn Finance", "Aave", "Compound", "MakerDAO"], correctAnswer: "Yearn Finance", difficulty: "advanced" },
    { question: "What is the name of Elrond’s smart contract language?", options: ["Rust", "Solidity", "Vyper", "Plutus"], correctAnswer: "Rust", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'consensus layer upgrade'?", options: ["EIP-3675", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-3675", difficulty: "advanced" },
    { question: "What is the maximum TPS of Zilliqa with sharding?", options: ["2,828", "65,000", "4,500", "7,000"], correctAnswer: "2,828", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Trust' in its consensus?", options: ["Corda", "NEM", "EOS", "Tezos"], correctAnswer: "Corda", difficulty: "advanced" },
    { question: "What is the name of Harmony’s smart contract runtime?", options: ["EVM", "Substrate", "WASM", "Sealevel"], correctAnswer: "EVM", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'minimal proxy standard'?", options: ["EIP-1167", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-1167", difficulty: "advanced" },
    { question: "What is the block time of Fantom on average?", options: ["1 second", "10 minutes", "400ms", "15 seconds"], correctAnswer: "1 second", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'flash swaps'?", options: ["Uniswap V2", "Aave", "Compound", "MakerDAO"], correctAnswer: "Uniswap V2", difficulty: "advanced" },
    { question: "What is the name of NEO’s smart contract language?", options: ["C#", "Solidity", "Vyper", "Plutus"], correctAnswer: "C#", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'account abstraction' groundwork?", options: ["EIP-2938", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2938", difficulty: "advanced" },
    { question: "What is the maximum TPS of Hedera Hashgraph?", options: ["10,000", "65,000", "4,500", "7,000"], correctAnswer: "10,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Randomness'?", options: ["Nxt", "NEM", "EOS", "Tezos"], correctAnswer: "Nxt", difficulty: "advanced" },
    { question: "What is the name of Waves’ smart contract language?", options: ["Ride", "Solidity", "Vyper", "Plutus"], correctAnswer: "Ride", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'precompile for BLS12-381'?", options: ["EIP-2537", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2537", difficulty: "advanced" },
    { question: "What is the block time of Klaytn on average?", options: ["1 second", "10 minutes", "400ms", "15 seconds"], correctAnswer: "1 second", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'liquidity mining' as a core feature?", options: ["SushiSwap", "Aave", "Compound", "MakerDAO"], correctAnswer: "SushiSwap", difficulty: "advanced" },
    { question: "What is the name of Qtum’s smart contract runtime?", options: ["EVM", "Substrate", "WASM", "Sealevel"], correctAnswer: "EVM", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'EVM version control'?", options: ["EIP-615", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-615", difficulty: "advanced" },
    { question: "What is the maximum TPS of Flow’s network?", options: ["10,000", "65,000", "4,500", "7,000"], correctAnswer: "10,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Velocity'?", options: ["Qtum", "NEM", "EOS", "Tezos"], correctAnswer: "Qtum", difficulty: "advanced" },
    { question: "What is the name of ICON’s smart contract language?", options: ["Python", "Solidity", "Vyper", "Plutus"], correctAnswer: "Python", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'gas cost changes for SSTORE'?", options: ["EIP-2200", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2200", difficulty: "advanced" },
    { question: "What is the block time of Wanchain on average?", options: ["10 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "10 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'governance mining'?", options: ["Compound", "Aave", "Uniswap", "MakerDAO"], correctAnswer: "Compound", difficulty: "advanced" },
    { question: "What is the name of Chromia’s smart contract language?", options: ["Rell", "Solidity", "Vyper", "Plutus"], correctAnswer: "Rell", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'SHA256 precompile'?", options: ["EIP-1052", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-1052", difficulty: "advanced" },
    { question: "What is the maximum TPS of Celo’s network?", options: ["1,000", "65,000", "4,500", "7,000"], correctAnswer: "1,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Authority'?", options: ["Polygon", "NEM", "EOS", "Tezos"], correctAnswer: "Polygon", difficulty: "advanced" },
    { question: "What is the name of Cartesi’s smart contract runtime?", options: ["Linux", "Solidity", "Vyper", "Plutus"], correctAnswer: "Linux", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'keccak256 precompile'?", options: ["EIP-1352", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-1352", difficulty: "advanced" },
    { question: "What is the block time of Ankr on average?", options: ["4 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "4 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'cross-chain bridges' natively?", options: ["THORChain", "Aave", "Compound", "MakerDAO"], correctAnswer: "THORChain", difficulty: "advanced" },
    { question: "What is the name of Holo’s smart contract runtime?", options: ["HoloFuel", "Solidity", "Vyper", "Plutus"], correctAnswer: "HoloFuel", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'ECDSA precompile'?", options: ["EIP-2565", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-2565", difficulty: "advanced" },
    { question: "What is the maximum TPS of BitTorrent’s network?", options: ["2,000", "65,000", "4,500", "7,000"], correctAnswer: "2,000", difficulty: "advanced" },
    { question: "Which blockchain uses 'Proof of Stake Governance'?", options: ["Decentraland", "NEM", "EOS", "Tezos"], correctAnswer: "Decentraland", difficulty: "advanced" },
    { question: "What is the name of Steem’s smart contract runtime?", options: ["None (uses plugins)", "Solidity", "Vyper", "Plutus"], correctAnswer: "None (uses plugins)", difficulty: "advanced" },
    { question: "Which Ethereum EIP introduced 'EIP-155 replay protection'?", options: ["EIP-155", "EIP-1559", "EIP-4844", "EIP-3074"], correctAnswer: "EIP-155", difficulty: "advanced" },
    { question: "What is the block time of Hive on average?", options: ["3 seconds", "10 minutes", "400ms", "15 seconds"], correctAnswer: "3 seconds", difficulty: "advanced" },
    { question: "Which DeFi protocol uses 'automated market making' with bonding curves?", options: ["Bancor", "Aave", "Compound", "MakerDAO"], correctAnswer: "Bancor", difficulty: "advanced" },
    { question: "What is the name of WAX’s smart contract runtime?", options: ["EVM", "Substrate", "WASM", "Sealevel"], correctAnswer: "WASM", difficulty: "advanced" },
  ];

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const getLevelQuestions = (questions, diff) => {
  const filtered = questions.filter((q) => q.difficulty === diff);
  const shuffled = shuffleArray([...filtered]);
  const questionsWithShuffledOptions = shuffled.slice(0, 5).map((q) => ({
    ...q,
    options: shuffleArray([...q.options]),
  }));
  return questionsWithShuffledOptions;
};

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

const handleUsernameSubmit = async (input) => {
  const sanitized = input.trim().replace(/[^a-zA-Z0-9]/g, "").slice(0, 15);
  if (sanitized.length < 3) {
    alert("Username must be 3-15 characters!");
    return;
  }
  const userRef = ref(db, `users/${sanitized}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const randomNum = Math.floor(Math.random() * 1000);
    const newUsername = `${sanitized}${randomNum}`;
    setUsername(newUsername);
    localStorage.setItem("quizUsername", newUsername);
    await set(ref(db, `users/${newUsername}`), {
      totalScore: 0,
      lastUpdated: new Date().toDateString(),
    });
  } else {
    setUsername(sanitized);
    localStorage.setItem("quizUsername", sanitized);
    await set(ref(db, `users/${sanitized}`), {
      totalScore: 0,
      lastUpdated: new Date().toDateString(),
    });
  }
  setShowUsernameModal(false);

  // Log username submission to Firebase Analytics
  if (analytics) {
    import("firebase/analytics").then(({ logEvent }) => {
      logEvent(analytics, "username_submitted", { username: sanitized });
    });
  }
};

const updateScore = async (newScore) => {
  const today = new Date().toDateString();
  await set(ref(db, `users/${username}`), { totalScore: newScore, lastUpdated: today });
  await set(ref(db, `dailyLeaderboard/${username}`), {
    username,
    score: newScore,
    timestamp: Date.now(),
  });
};

const fetchLeaderboard = () => {
  const leaderRef = ref(db, "dailyLeaderboard");
  onValue(leaderRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const leaderboardArray = Object.values(data)
        .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
        .slice(0, 10);
      setLeaderboard(leaderboardArray);
    }
  });
};

useEffect(() => {
  const savedUsername = localStorage.getItem("quizUsername");
  if (savedUsername) {
    setUsername(savedUsername);
    setShowUsernameModal(false);
  }
  const completedLevels = checkDailyProgress();
  setAllQuestions(questionPool);
  setLevelQuestions(getLevelQuestions(questionPool, difficulty));
  setCurrentLevel(completedLevels + 1);
  if (completedLevels >= 5) setDailyCompleted(true);
  fetchLeaderboard();

  // Log page view to Firebase Analytics
  if (analytics) {
    import("firebase/analytics").then(({ logEvent }) => {
      logEvent(analytics, "page_view", { page_title: "Crypto Quiz" });
    });
  }
}, []);

useEffect(() => {
  if (
    timeLeft > 0 &&
    !showResult &&
    !selectedAnswer &&
    currentTab === "quiz" &&
    !dailyCompleted
  ) {
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  } else if (timeLeft === 0) {
    handleAnswer(null);
  }
}, [timeLeft, selectedAnswer, showResult, currentTab, dailyCompleted]);

const handleAnswer = (answer) => {
  setSelectedAnswer(answer);
  const isCorrect = answer === levelQuestions[currentQuestion].correctAnswer;
  const btcValue = difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 1.5 : 2;
  const multiplier = streak >= 2 ? (streak >= 3 ? 1.5 : 1.2) : 1;
  const points = isCorrect ? btcValue * multiplier : 0;

  if (isCorrect) {
    setScore(score + points);
    setStreak(streak + 1);
    checkAchievements(points);
  } else {
    setStreak(0);
  }

  // Log answer submission to Firebase Analytics
  if (analytics) {
    import("firebase/analytics").then(({ logEvent }) => {
      logEvent(analytics, "answer_submitted", {
        level: currentLevel,
        question: currentQuestion + 1,
        isCorrect,
        pointsEarned: points,
        username,
      });
    });
  }

  setTimeout(() => {
    if (currentQuestion + 1 < levelQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      updateScore(score + points);
      setCurrentTab("results");

      // Log level completion to Firebase Analytics
      if (analytics) {
        import("firebase/analytics").then(({ logEvent }) => {
          logEvent(analytics, "level_completed", {
            level: currentLevel,
            score: score + points,
            username,
          });
        });
      }
    }
  }, 1000);
};

const checkAchievements = (points) => {
  let newAchievements = [...achievements];
  if (score + points >= 10 && !achievements.includes("Satoshi’s Apprentice")) {
    newAchievements.push("Satoshi’s Apprentice");
  }
  if (
    currentQuestion === 4 &&
    score + points ===
      currentLevel * (difficulty === "beginner" ? 5 : difficulty === "intermediate" ? 7.5 : 10)
  ) {
    newAchievements.push("HODL Master");
  }
  if (timeLeft > 20 && !achievements.includes("Gas Saver")) {
    newAchievements.push("Gas Saver");
  }
  setAchievements(newAchievements);
  localStorage.setItem("quizAchievements", JSON.stringify(newAchievements));

  // Log achievement earned to Firebase Analytics
  if (newAchievements.length > achievements.length && analytics) {
    import("firebase/analytics").then(({ logEvent }) => {
      logEvent(analytics, "achievement_earned", {
        achievement: newAchievements[newAchievements.length - 1],
        username,
      });
    });
  }
};

const handleNextLevel = () => {
  const completedLevels = checkDailyProgress() + 1;
  localStorage.setItem("quizLevelsCompleted", completedLevels.toString());
  if (completedLevels >= 5) {
    setDailyCompleted(true);
  } else {
    setLevelQuestions(getLevelQuestions(allQuestions, difficulty));
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setCurrentLevel(currentLevel + 1);
    setStreak(0);
    setCurrentTab("quiz");
  }
};

const resetDaily = () => {
  localStorage.setItem("quizLevelsCompleted", "0");
  setDailyCompleted(false);
  setCurrentLevel(1);
  setScore(0);
  setLevelQuestions(getLevelQuestions(allQuestions, difficulty));
  setCurrentQuestion(0);
  setShowResult(false);
  setSelectedAnswer(null);
  setTimeLeft(30);
  setStreak(0);
  setCurrentTab("quiz");
};

const shareScore = () => {
  const tweet = `I mined ${score} BTC on Level ${currentLevel} of CryptoQuiz! Test your skills: [https://cryptoglobalive.com/quiz] #CryptoQuiz`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");

  // Log share event to Firebase Analytics
  if (analytics) {
    import("firebase/analytics").then(({ logEvent }) => {
      logEvent(analytics, "score_shared", {
        score,
        level: currentLevel,
        username,
      });
    });
  }
};

const progress = ((currentQuestion + 1) / levelQuestions.length) * 100;

// Username modal
if (showUsernameModal) {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Welcome, Miner!</h1>
      <div className={styles.section}>
        <p>Enter your crypto alias (3-15 characters):</p>
        <input
          type="text"
          maxLength={15}
          onKeyPress={(e) => e.key === "Enter" && handleUsernameSubmit(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={() => handleUsernameSubmit(document.querySelector("input").value)}
          className={styles.xLink}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

return (
  <div className={styles.container}>
    {/* Navigation Tabs */}
    <div className={styles.navTabs}>
      <button
        className={`${styles.tab} ${currentTab === "quiz" ? styles.activeTab : ""}`}
        onClick={() => setCurrentTab("quiz")}
      >
        Quiz
      </button>
      <button
        className={`${styles.tab} ${currentTab === "leaderboard" ? styles.activeTab : ""}`}
        onClick={() => setCurrentTab("leaderboard")}
      >
        Leaderboard
      </button>
      <button
        className={`${styles.tab} ${currentTab === "results" ? styles.activeTab : ""}`}
        onClick={() => setCurrentTab("results")}
      >
        Results
      </button>
    </div>

    {/* Quiz Tab */}
    {currentTab === "quiz" && (
      <>
        <h1 className={styles.pageTitle}>
          Crypto Quiz - Level {currentLevel} ({difficulty})
        </h1>
        {dailyCompleted ? (
          <div className={styles.section}>
            <p>Miner: {username}</p>
            <p>You’ve mined {checkDailyProgress() * 5} blocks today.</p>
            <p>Total BTC: {score}</p>
            <p className={styles.dailyLimitMessage}>
              Daily limit reached! Come back tomorrow for more mining.
            </p>
            <button onClick={resetDaily} className={styles.xLink}>
              Reset (Test)
            </button>
          </div>
        ) : (
          <div className={styles.section}>
            <p>
              Miner: {username} | Streak: {streak}x
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <h2 className={styles.sectionTitle}>
              Block {currentQuestion + 1}/5 (Time: {timeLeft}s)
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
                  ? `Mined! +${(difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 1.5 : 2) * (streak >= 3 ? 1.5 : streak === 2 ? 1.2 : 1)} BTC`
                  : "Rejected!"}
              </p>
            )}
            {showResult && !dailyCompleted && (
              <button onClick={handleNextLevel} className={styles.xLink}>
                Next Level
              </button>
            )}
          </div>
        )}
      </>
    )}

    {/* Leaderboard Tab */}
    {currentTab === "leaderboard" && (
      <>
        <h1 className={styles.pageTitle}>Leaderboard</h1>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Miners</h2>
          <ul>
            {leaderboard.map((entry, i) => (
              <li key={i} className={entry.username === username ? styles.highlight : ""}>
                {i + 1}. {entry.username} - {entry.score} BTC
              </li>
            ))}
          </ul>
        </div>
      </>
    )}

    {/* Results Tab */}
    {currentTab === "results" && (
      <>
        <h1 className={styles.pageTitle}>Your Results</h1>
        <div className={styles.section}>
          <p>Miner: {username}</p>
          <p>Total BTC: {score}</p>
          <p>Levels Completed: {checkDailyProgress()}</p>
          <p>Achievements: {achievements.join(", ") || "None yet"}</p>
          {dailyCompleted && (
            <p className={styles.dailyLimitMessage}>
              Daily limit reached! Come back tomorrow for more mining.
            </p>
          )}
          {showResult && !dailyCompleted && (
            <button onClick={handleNextLevel} className={styles.xLink}>
              Next Level
            </button>
          )}
          <button onClick={shareScore} className={styles.xLink}>
            Share on X
          </button>
          {dailyCompleted && (
            <button onClick={resetDaily} className={styles.xLink}>
              Reset (Test)
            </button>
          )}
        </div>
      </>
    )}

    <button className={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
      ↑ Top
    </button>
  </div>
 );
}