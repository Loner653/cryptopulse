// app/faq/FAQPage.js
"use client";
import { useState } from "react";
import styles from "./faq.module.css";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqs = [
    {
      question: "What is Cryptocurrency?",
      answer:
        "Cryptocurrency is a digital or virtual form of money that uses cryptography for security. Unlike traditional currencies issued by governments (like the US dollar or euro), cryptocurrencies operate on decentralized networks, typically based on blockchain technology. Bitcoin, created in 2009 by Satoshi Nakamoto, was the first cryptocurrency and remains the most well-known. Today, there are over 10,000 cryptocurrencies, with a total market cap exceeding $3 trillion as of March 29, 2025. Cryptocurrencies enable peer-to-peer transactions without intermediaries, offering benefits like transparency, security, and global accessibility, but they also come with risks like volatility and regulatory uncertainty.",
    },
    {
      question: "How to Buy Cryptocurrency?",
      answer:
        "Buying cryptocurrency involves several steps. First, choose a reputable exchange like Coinbase, Binance, or Kraken—platforms that support $5 trillion in annual trades as of 2025. Create an account, verify your identity (KYC requirements apply in 90% of exchanges), and deposit funds using fiat (e.g., USD, EUR) or another crypto. Next, select your cryptocurrency—Bitcoin ($1.5 trillion market cap) or Ethereum ($500 billion) are popular choices. Place a buy order (market or limit), and once executed, your crypto will appear in your exchange wallet. For security, transfer it to a personal wallet (e.g., a hardware wallet like Ledger, which protects $500 billion in assets). Fees vary—$2 to $10 per trade—and always double-check wallet addresses to avoid losing funds.",
    },
    {
      question: "What is Blockchain Technology?",
      answer:
        "Blockchain is a decentralized, digital ledger that records transactions across a network of computers. Each transaction forms a 'block,' linked to the previous one using cryptographic hashes, creating an immutable chain. By 2025, blockchains like Ethereum process $5 billion daily, with 10 million nodes ensuring security. Bitcoin’s blockchain, for example, secures $1.5 trillion using proof-of-work, while Ethereum’s proof-of-stake cuts energy use by 99% (0.2 TWh yearly). Blockchains enable trustless systems—no central authority needed—powering $2 trillion in DeFi, $10 billion in NFTs, and $500 billion in tokenized assets. They’re also used beyond crypto, in supply chains (Walmart tracks $1 billion in goods) and healthcare (5 million patient records secured).",
    },
    {
      question: "How to Store Cryptocurrency Safely?",
      answer:
        "Storing cryptocurrency safely is crucial to avoid $2 billion in annual hacks (2025 data). Use a personal wallet: hardware wallets like Ledger or Trezor ($500 each) store your private keys offline, protecting $500 billion in assets. Software wallets (e.g., MetaMask, with 30 million users) are convenient for $1 billion in daily DeFi trades but risk hacks if your device is compromised. Always back up your seed phrase (12-24 words) and never share it—$20 billion in crypto is lost yearly to forgotten keys. Enable two-factor authentication (2FA) on exchanges, and avoid public Wi-Fi for transactions. For large holdings ($10,000+), consider multisig wallets, requiring multiple approvals for transfers, used by 50% of crypto funds.",
    },
    {
      question: "What are NFTs (Non-Fungible Tokens)?",
      answer:
        "NFTs are unique digital assets on a blockchain, representing ownership of items like art, music, or virtual land. Unlike fungible tokens (e.g., Bitcoin), each NFT has distinct metadata, making it one-of-a-kind. By 2025, the NFT market hits $10 billion—$5 billion in art (Beeple’s $69 million sale set the tone) and $5 billion in gaming (Axie Infinity’s $3 billion). Built on Ethereum’s ERC-721 standard, NFTs use smart contracts for $1 billion in royalties yearly. A 2024 Manila gamer earns $1,000 monthly with NFT pets, but risks remain—90% of 2021 NFTs are worthless, and $500 million was lost to hacks in 2024. They’re a cultural shift, with $500 million in virtual land sold annually.",
    },
    {
      question: "How to Spot Crypto Scams?",
      answer:
        "Crypto scams cost $1 billion yearly (2025), but you can spot them. Red flags include promises of guaranteed returns—legit projects never guarantee profits, as crypto is volatile (Bitcoin swings 50% yearly). Be wary of unsolicited messages on X or Telegram; 90% of $500 million in 2024 scams started there. Fake projects often mimic real ones—check URLs (e.g., ‘binance.co’ vs. ‘binance.com’). Rug pulls, where developers abandon projects after raising funds, stole $200 million in 2024—research team transparency on GitHub. Use tools like Etherscan to verify contracts, and never share your private keys or seed phrase, as 50% of scams exploit this. For example, I recently shared a warning about a scam token on my Twitter (@Philkeyz_01, see the post at https://x.com/Philkeyz_01/photo)—always verify before investing.",
    },
    {
      question: "What is DeFi (Decentralized Finance)?",
      answer:
        "DeFi is a financial system built on blockchain, removing intermediaries like banks. By 2025, DeFi locks $2 trillion—$1 trillion in lending (Aave) and $500 billion in swaps (Uniswap). Smart contracts automate services: borrow $1 million at 8% APY without a bank, or trade $5 billion daily with $0.50 fees. Ethereum hosts 90% of DeFi, with 5,000 dApps serving 10 million users. Benefits include accessibility—50 million unbanked join—but risks are high: $500 million in 2024 hacks (e.g., Ronin’s $100 million loss) and 30% of dApps fail yearly. DeFi’s a $10 trillion future if security improves.",
    },
    {
      question: "What is Crypto Mining?",
      answer:
        "Crypto mining validates transactions on proof-of-work blockchains like Bitcoin. Miners use powerful computers (500 MW rigs in 2025) to solve SHA-256 puzzles, earning rewards—$5 billion yearly for Bitcoin alone. A block (3.125 BTC, $200,000) takes 10 minutes, secured by 200 exahashes/second. Mining costs $5 billion in energy (150 TWh), drawing ire—50% decry its 0.6% global power use. Green mining rises—50% hydro-powered in 2025. Altcoins like Litecoin ($50 billion) mine too, but Ethereum’s 2022 PoS shift cut its 10 TWh. Mining secures $3 trillion but needs $1 billion in eco-fixes.",
    },
    {
      question: "What is a Crypto Wallet?",
      answer:
        "A crypto wallet stores your private and public keys to manage cryptocurrencies. Hardware wallets (e.g., Ledger) secure $500 billion offline, while software wallets (e.g., MetaMask, 30 million users) handle $1 billion in daily DeFi trades. Hot wallets (online) are convenient but risk $500 million in hacks yearly; cold wallets (offline) are safer but less accessible. Wallets don’t store crypto—your coins live on the blockchain; wallets just access them. In 2025, 500 million wallets exist—50% use 2FA, but $20 billion is lost to forgotten keys. Always back up your seed phrase securely.",
    },
    {
      question: "What is Crypto Investing?",
      answer:
        "Crypto investing involves buying cryptocurrencies to hold or trade for profit. By 2025, $3 trillion is invested—Bitcoin ($1.5 trillion) and Ethereum ($500 billion) lead. Strategies include HODLing (long-term holding—50% of BTC hasn’t moved in 2 years) or trading (day traders move $5 billion daily). Diversify—altcoins like Solana ($100 billion) offer 50,000 TPS but higher risk (90% fail). Use dollar-cost averaging to mitigate volatility (BTC swings 50% yearly). Risks include hacks ($2 billion in 2025) and regulation ($200 million in U.S. fines). Research via CoinGecko and never invest more than you can lose.",
    },
    {
      question: "What is Staking?",
      answer:
        "Staking locks your crypto to support a proof-of-stake blockchain, earning rewards. By 2025, $500 billion is staked—Ethereum’s 64 shards secure $2 trillion this way. You stake 32 ETH ($100,000) to run a node, earning 5% APY ($5,000 yearly). Platforms like Lido let you stake $100 for 4% APY, pooling $50 billion. Rewards come from transaction fees and inflation—$1 billion paid in 2025. Risks include slashing (losing 1% for downtime) and lockup periods (30 days on Binance). Staking cuts energy use 99% vs. mining, making it eco-friendly, but 20% of stakers face tech issues.",
    },
    {
      question: "How to Avoid Crypto Losses?",
      answer:
        "Avoiding crypto losses requires caution. Diversify—don’t put all $10,000 in one coin; spread across Bitcoin, Ethereum, and altcoins (90% of altcoins fail). Use stop-loss orders on exchanges—limit losses to 10% if Bitcoin drops 50%. Avoid FOMO—$1 billion lost in 2024 to hype-driven pumps (e.g., meme coins). Secure your wallet—$20 billion lost to forgotten keys; use hardware wallets and 2FA. Research projects—check whitepapers and GitHub activity; 50% of scams lack transparency. Stay updated—regulation shifts (e.g., U.S. $200 million fines) can tank prices. Only invest what you can afford to lose.",
    },
    {
      question: "What are Stablecoins?",
      answer:
        "Stablecoins are cryptocurrencies pegged to stable assets like the US dollar to reduce volatility. By 2025, $250 billion in stablecoins circulate—USDT ($120 billion) and USDC ($100 billion) dominate. They’re backed 1:1—$1 USDC equals $1 in reserves (90% audited). Used for $5 billion in daily DeFi trades, they offer $0.50 fees vs. SWIFT’s $20. Visa’s $5 billion USDC pilot in 2025 shows mainstream adoption. Risks include depegging—Terra’s $40 billion 2022 crash—and regulation ($50 billion stalled by audits). Stablecoins bridge crypto and fiat, enabling $1 trillion in cross-border payments.",
    },
    {
      question: "What is Yield Farming?",
      answer:
        "Yield farming lets you earn rewards by lending or staking crypto in DeFi protocols. By 2025, $500 billion is farmed—$1 trillion in DeFi locks fuel it. On Aave, lend $10,000 in USDC for 8% APY ($800 yearly); on Curve, stake $5,000 for 10% APY. Rewards come from fees and token incentives—$100 million paid daily. Risks are high—impermanent loss costs $200 million yearly, and 30% of farms fail (smart contract bugs). Gas fees ($20 per transaction) eat profits, but L2 solutions like Optimism cut costs to $0.50. It’s a $10 trillion future if risks are managed.",
    },
    {
      question: "How Do Airdrops Work?",
      answer:
        "Airdrops distribute free tokens to promote projects or reward users. In 2025, $1 billion in airdrops occur—Uniswap’s 2020 $1,200 drop to 250,000 users set the trend. You qualify by holding tokens (e.g., 1 ETH) or using a dApp (e.g., 50 swaps on SushiSwap). Tokens appear in your wallet—MetaMask users claim $500 million yearly. Some airdrops require tasks (e.g., joining Telegram, 90% of campaigns). Value varies—$10 to $10,000—but 50% are worthless long-term. Scams abound—$100 million lost in 2024 to fake airdrops; never share private keys. Check Etherscan for legitimacy.",
    },
    {
      question: "What is the Future of Crypto?",
      answer:
        "Crypto’s future is a $15 trillion market by 2030. Bitcoin ($1.5 trillion) becomes digital gold, while Ethereum’s $2 trillion in DeFi scales to $10 trillion with 1 million TPS (L2). Stablecoins ($250 billion) hit $1 trillion, replacing SWIFT for $5 trillion in payments. CBDCs grow—$1 trillion in e-yuan trades in 2025. Adoption soars—500 million wallets, 50% unbanked, move $5 trillion yearly. Regulation tightens—$200 million in U.S. fines—but clarity spurs $500 billion in bank coins. Hacks ($2 billion) and quantum threats (2030) loom, but $2 billion in security fixes pave the way.",
    },
    {
      question: "What are Smart Contracts?",
      answer:
        "Smart contracts are self-executing programs on a blockchain, automating agreements without intermediaries. By 2025, $2 trillion in DeFi runs on them—Ethereum’s 5,000 dApps execute $5 billion daily. A Uniswap trade ($1 million) settles in 5 seconds via code. They’re immutable—$1 billion in NFT royalties are paid flawlessly—but bugs cost $500 million in 2024 (e.g., Poly Network hack). Solidity powers 90% of contracts, with 10 million developers coding. Future uses include voting (Estonia’s $100 million system) and insurance ($50 billion in claims automated). They’re a $10 trillion backbone if audits improve.",
    },
    {
      question: "What are Gas Fees?",
      answer:
        "Gas fees are payments for processing transactions on blockchains like Ethereum. In 2025, $20 per transaction is average—$100 million spent yearly (Etherscan). Fees fund miners/validators—$5 billion for Ethereum’s 300 TPS. A $1,000 swap on Uniswap costs $20, but peaks hit $50 during congestion (2024). L2 solutions like Optimism cut fees to $0.50, handling $1 trillion in trades. High fees deter 30% of users, but sharding (Ethereum 2.0) aims for 100,000 TPS by 2027, slashing costs 90%. Gas fees are a $3 trillion ecosystem’s toll—optimization is key.",
    },
    {
      question: "What is Crypto Regulation?",
      answer:
        "Crypto regulation governs the $3 trillion market to curb $1 billion in laundering and $2 billion in hacks (2025). The U.S. fines $200 million—SEC deems stablecoins securities, stalling $50 billion. EU’s MiCA unlocks $1 trillion—95% of exchanges comply. China’s ban axes $500 million; India’s 30% tax nets $100 million but slows $1 billion. Singapore licenses $500 billion, while Japan caps $200 billion. Regulation cuts $1 billion in scams but chokes $1 billion in growth. A $10 trillion future needs $2 billion in enforcement—balancing innovation and safety.",
    },
    {
      question: "What is a Crypto Exchange?",
      answer:
        "A crypto exchange is a platform to buy, sell, or trade cryptocurrencies. By 2025, $5 trillion trades yearly—Binance ($2 trillion), Coinbase ($1 trillion), and Kraken lead. Centralized exchanges (CEXs) handle 80%—$4 trillion—with KYC; decentralized exchanges (DEXs) like Uniswap ($500 billion) offer anonymity. Fees range from 0.1% ($2 per $1,000 trade) to $10. Security varies—$500 million hacked in 2024 (e.g., Binance). Choose exchanges with 2FA, cold storage (90% of funds offline), and audits. They’re the $3 trillion market’s gateway but need $1 billion in security upgrades.",
    },
    {
      question: "What is a Crypto Bull Run?",
      answer:
        "A crypto bull run is a sustained price increase across the market. In 2021, Bitcoin hit $69,000—a 200% rise—lifting the market to $3 trillion. By 2025, a bull run pushes Bitcoin to $100,000, with $5 trillion in total market cap. Causes include halving events (Bitcoin’s 2024 halving cuts supply), adoption (Visa’s $5 billion USDC pilot), and FOMO—$1 billion in retail investments flood in. Altcoins like Solana surge 500%, but 50% crash post-run. Bull runs create millionaires—10,000 in 2021—but FOMO losses hit $500 million. Timing is key; don’t chase peaks.",
    },
    {
      question: "What is a Crypto Bear Market?",
      answer:
        "A crypto bear market is a prolonged price decline—20% or more. In 2022, Bitcoin fell 70% to $16,000, shrinking the market to $800 billion. By 2025, a bear market drops Bitcoin to $50,000, with $1 trillion wiped out. Causes include regulation ($200 million U.S. fines), hacks ($2 billion), and macro factors (e.g., 2024 rate hikes). Altcoins crash 90%—$500 million in projects fail. It’s a buying opportunity—50% of 2022 buyers doubled their money by 2025—but panic selling costs $1 billion. Hold long-term or diversify to weather the storm.",
    },
    {
      question: "What are Crypto Taxes?",
      answer:
        "Crypto taxes apply to gains from trading, staking, or spending. In 2025, the U.S. IRS taxes $500 million—capital gains (10-37%) on profits (e.g., $1,000 profit on Bitcoin taxed at $370 for high earners). Staking rewards ($1 billion) are income—taxed at 10-37%. Mining income ($5 billion) is taxed similarly. India’s 30% tax nets $100 million but slows $1 billion in trades. Record-keeping is key—$500 million evades taxes yearly; tools like Koinly track $1 trillion in trades. Non-compliance risks $50 million in fines. Consult a tax pro to navigate $3 trillion in crypto wealth.",
    },
    {
      question: "What is a Crypto Hardware Wallet?",
      answer:
        "A crypto hardware wallet is a physical device that stores your private keys offline, securing your crypto. Ledger and Trezor dominate—$500 billion in assets protected in 2025. Priced at $50-$500, they use secure chips to sign transactions without exposing keys. A $10,000 Bitcoin holding stays safe from $500 million in online hacks yearly. Setup involves a seed phrase (back it up securely—$20 billion lost to forgotten keys). They’re slower for daily trades ($1 billion in DeFi) but ideal for long-term storage. 50% of high-net-worth users rely on them.",
    },
    {
      question: "What is a Crypto Software Wallet?",
      answer:
        "A crypto software wallet is a digital app or program that stores your private keys for accessing crypto. MetaMask leads with 30 million users, managing $1 billion in daily DeFi trades in 2025. They’re free, easy for $5 billion in swaps (Uniswap), but risk $500 million in hacks yearly if your device is compromised. Hot wallets (online, e.g., Coinbase Wallet) are convenient; cold software wallets (offline, e.g., desktop apps) are safer. Always use 2FA and antivirus—50% of losses stem from phishing. They’re ideal for active users but less secure than hardware wallets.",
    },
    {
      question: "What is Crypto Liquidity?",
      answer:
        "Crypto liquidity is the ease of buying or selling crypto without impacting its price. High liquidity—Bitcoin’s $1 trillion daily volume in 2025—means $1 million trades move prices 0.1%. Low liquidity (e.g., small altcoins) causes 10% swings on $10,000 trades. Liquidity pools in DeFi (e.g., Uniswap’s $500 billion) provide $1 billion daily, earning 10% APY for providers. Exchanges like Binance ($2 trillion volume) ensure liquidity, but illiquid markets risk $200 million in slippage yearly. Liquidity drives adoption—$5 trillion in trades need $1 billion more to stabilize altcoins.",
    },
    {
      question: "What is a Crypto Whitepaper?",
      answer:
        "A crypto whitepaper is a document outlining a project’s purpose, technology, and roadmap. Bitcoin’s 2009 whitepaper by Satoshi Nakamoto introduced a $1.5 trillion asset. Ethereum’s 2014 whitepaper birthed $2 trillion in DeFi. By 2025, 10,000 projects release whitepapers—90% fail, but legit ones (e.g., Solana’s) drive $100 billion in value. They detail tokenomics (e.g., 50% supply to community), tech (e.g., 50,000 TPS), and teams. Scams lack detail—$200 million lost in 2024 to fake whitepapers. Read them on GitHub or project sites to assess legitimacy before investing.",
    },
    {
      question: "What is Crypto Scalability?",
      answer:
        "Crypto scalability is a blockchain’s ability to handle more transactions. Bitcoin’s 7 TPS and Ethereum’s 300 TPS (2025) lag Visa’s 65,000 TPS, bottlenecking $5 billion daily trades. Layer 2 solutions like Optimism (1 million TPS, $1 trillion) and sharding (Ethereum 2.0, 100,000 TPS by 2027) solve this. Polygon’s 7,000 TPS powers $500 billion in NFTs. Scalability cuts fees—$0.50 vs. $20—saving $500 million yearly. Challenges include security ($500 million in L2 hacks) and complexity (20% of nodes fail sharding). A $15 trillion future needs 10,000 TPS across chains.",
    },
    {
      question: "What is a Crypto Token?",
      answer:
        "A crypto token is a digital asset built on an existing blockchain, unlike coins (e.g., Bitcoin) with their own chains. By 2025, $1 trillion in tokens exist—90% on Ethereum. Tokens include utility (e.g., UNI for Uniswap governance, $500 billion in swaps), stablecoins (USDC, $100 billion), and NFTs ($10 billion). ERC-20 powers $500 billion in DeFi; ERC-721 secures $5 billion in art. Tokens drive dApps—$2 trillion in DeFi locks—but 90% fail long-term. Scams abound—$100 million in fake tokens in 2024. Verify contracts on Etherscan before investing.",
    },
    {
      question: "What is Crypto Privacy?",
      answer:
        "Crypto privacy ensures transaction anonymity. Bitcoin’s blockchain is pseudonymous—addresses (e.g., 1A1zP1) hide identities but can be traced ($1 billion in laundering tracked in 2025). Privacy coins like Monero ($10 billion) use ring signatures, hiding $500 million in trades yearly. Zcash’s zero-knowledge proofs secure $100 million. Privacy matters—50 million users seek it amid $200 million in government seizures. But regulation bites—$50 million in U.S. bans hit Monero. Tools like Tornado Cash ($1 billion mixed) face scrutiny ($100 million fined). Privacy’s a $3 trillion balance—freedom vs. oversight.",
    },
    {
      question: "What is a Crypto DAO?",
      answer:
        "A DAO (Decentralized Autonomous Organization) is a blockchain-based group governed by code, not leaders. By 2025, $100 billion in DAOs exist—Uniswap’s DAO manages $500 billion in swaps via token voting. Members stake tokens (e.g., 1,000 UNI) to vote on fees or upgrades—$50 million in proposals yearly. DAOs fund $1 billion in art (2024) and charity ($500 million). Risks include hacks—$100 million lost in 2023 (The DAO)—and low turnout (20% vote). They’re a $10 trillion future for governance if legal clarity ($200 million in disputes) improves.",
    },
    {
      question: "What is Crypto Interoperability?",
      answer:
        "Crypto interoperability lets blockchains communicate. By 2025, $1 trillion crosses chains—Cosmos’ IBC links $500 million daily; Polkadot’s $50 billion bridges 100 chains. A $1 million Ethereum-to-Solana swap takes 5 seconds, saving $20 in fees. Bridges like Wormhole move $500 billion but risk $200 million in hacks (2024). Interoperability fuels $2 trillion in DeFi—$100 million in cross-chain dApps (Aave). Challenges include security (30% of swaps fail) and standards (50% of chains don’t sync). A $15 trillion future needs $1 billion in bridge fixes.",
    },
    {
      question: "What is Crypto Adoption?",
      answer:
        "Crypto adoption is its mainstream use. By 2025, 500 million wallets move $5 trillion yearly—50% unbanked join (Africa’s $100 million P2P). El Salvador’s $500 million BTC economy (90% of shops) leads; Visa’s $5 billion USDC pilot follows. Merchants rise—10% of $500 billion trades accept crypto (Square). DeFi’s $2 trillion lures 10 million; CBDCs add $1 trillion (e-yuan). Challenges include volatility (50% swings), regulation ($200 million fines), and education (50% fear scams). Adoption’s a $15 trillion path—$5 trillion in speed, $100 million unbanked shine.",
    },
    {
      question: "What is a Crypto ETF?",
      answer:
        "A crypto ETF (Exchange-Traded Fund) tracks the price of cryptocurrencies, letting investors buy exposure without owning coins. By 2025, $100 billion in crypto ETFs exist—BlackRock’s Bitcoin ETF holds $50 billion. They trade on stock exchanges (e.g., NYSE), with $1 billion daily volume. ETFs reduce risk—no wallet needed—but fees (1% yearly) cost $500 million. They drive adoption—$10 billion in 2024 inflows—but don’t offer staking rewards (5% APY missed). Regulation varies—U.S. approves $50 billion; EU lags at $20 billion. ETFs bridge crypto and traditional finance for $1 trillion in growth.",
    },
    {
      question: "How to Use Crypto for Payments?",
      answer:
        "Using crypto for payments is growing—$500 billion in trades accept it by 2025. Platforms like BitPay process $1 billion yearly, letting you pay with Bitcoin at 10% of merchants (e.g., Microsoft). Stablecoins (USDC) dominate—$5 billion in Visa pilots. Fees are low—$0.50 vs. $20 for SWIFT—but volatility risks remain (Bitcoin swings 50%). Setup a wallet (MetaMask), load $1,000 in USDC, and scan QR codes at checkout. Adoption rises—90% of El Salvador shops take BTC ($500 million). Challenges include taxes ($100 million tracked) and speed (Ethereum’s 300 TPS). It’s a $5 trillion future.",
    },
    {
      question: "What is a Crypto Halving?",
      answer:
        "A crypto halving cuts mining rewards, reducing new coin supply. Bitcoin’s 2024 halving dropped rewards to 3.125 BTC ($200,000) per block, with $5 billion yearly now. Halvings occur every 210,000 blocks (4 years), driving scarcity—Bitcoin’s $1.5 trillion value rose 200% post-2020 halving. By 2025, 19 million of 21 million BTC are mined. Altcoins like Litecoin ($50 billion) halve too. Halvings spark bull runs—$1 billion in FOMO—but miners lose $500 million yearly, pushing green energy (50% hydro). It’s a $3 trillion market’s supply shock.",
    },
    {
      question: "What is Crypto Lending?",
      answer:
        "Crypto lending lets you borrow or lend crypto via DeFi or centralized platforms. By 2025, $1 trillion is lent—Aave ($500 billion) offers 8% APY on $10,000 USDC ($800 yearly). Borrow $5,000 against $10,000 BTC at 5% APY—smart contracts automate it. Centralized platforms like BlockFi lend $200 billion but risk $100 million in 2024 hacks. Benefits include no credit checks—50 million unbanked join—but overcollateralization (150%) ties up $500 billion. Rates vary—3% to 15%—and liquidation risks $200 million if prices drop 50%. It’s a $5 trillion future with $1 billion in fixes.",
    },
    {
      question: "What is a Crypto Rug Pull?",
      answer:
        "A crypto rug pull is a scam where developers abandon a project after raising funds, leaving investors with worthless tokens. In 2024, $200 million was lost—Squid Game token’s $3 million scam crashed 99% in hours. Red flags include anonymous teams (90% of scams), locked liquidity (check Uniswap pools), and hype on X (50% of scams start there). Research via Etherscan—$100 million in fake contracts flagged yearly. Use audited projects—$500 million in DeFi is safe. Rug pulls cost $1 billion since 2020; due diligence saves $500 million. Always start small and verify.",
    },
    {
      question: "What is Crypto Governance?",
      answer:
        "Crypto governance lets token holders vote on project changes. By 2025, $500 billion in tokens govern—Uniswap’s UNI holders (1,000 tokens) vote on $50 million in fees yearly. On-chain voting (e.g., Compound) secures $200 billion; off-chain (e.g., Snapshot) cuts $20 gas fees. DAOs lead—$100 billion in assets, 10 million votes. Benefits include decentralization—90% of users shape dApps—but low turnout (20%) and whale control (1% hold 50% tokens) skew results. Governance drives $2 trillion in DeFi; $1 billion in legal clarity (2024 disputes) unlocks $10 trillion.",
    },
    {
      question: "What is a Crypto Meme Coin?",
      answer:
        "A crypto meme coin is a token driven by internet culture, not utility. By 2025, $50 billion in meme coins exist—Dogecoin ($30 billion) and Shiba Inu lead. They surge on hype—Elon Musk’s 2021 tweets pumped Doge 500%—but 90% crash long-term. Retail investors trade $1 billion daily, chasing 1,000% gains, but $500 million is lost to pumps (2024). Some evolve—Shiba Inu’s $100 million in DeFi—but most lack fundamentals. Meme coins fuel $5 billion in fun but risk $1 billion scams. Invest small, expect volatility, and take profits fast.",
    },
    {
      question: "What is Crypto Staking Rewards?",
      answer:
        "Crypto staking rewards are earnings for locking tokens to support a blockchain. In 2025, $1 billion is paid—Ethereum’s 5% APY on 32 ETH ($100,000) yields $5,000 yearly. Lido pools $50 billion, offering 4% APY on $100 stakes. Rewards come from fees and inflation—$500 million in Cardano (ADA) alone. High APYs (20%) signal risk—$200 million slashed in 2024 for downtime. Lockups (30 days) tie up $500 billion, and 20% of stakers face tech issues. Staking’s eco-friendly—99% less energy than mining—but needs $1 billion in user education.",
    },
    {
      question: "What is a Crypto Liquidity Pool?",
      answer:
        "A crypto liquidity pool is a DeFi fund where users deposit tokens to enable trading. By 2025, $500 billion in pools exist—Uniswap’s $1 billion daily trades pay 10% APY ($1,000 on $10,000). You provide $5,000 in ETH/USDC pairs; traders swap, paying $0.50 fees you earn. Impermanent loss costs $200 million yearly—if ETH rises 50%, you lose 5%. Pools drive $2 trillion in DeFi, but 30% fail (hacks, bugs). L2 solutions (Optimism) cut $20 fees to $0.50, saving $500 million. It’s a $10 trillion future with $1 billion in security.",
    },
    {
      question: "What is Crypto Cross-Chain Swapping?",
      answer:
        "Crypto cross-chain swapping lets you trade tokens across blockchains. By 2025, $1 trillion swaps yearly—$1 million ETH-to-Solana takes 5 seconds via Wormhole ($500 billion moved). Bridges like Polygon’s PoS ($200 billion) cut $20 fees to $2. Benefits include speed—$5 billion daily trades—and access (100 chains). Risks are high—$200 million hacked in 2024 (e.g., Nomad). Interoperability fuels $2 trillion in DeFi, but 30% of swaps fail (sync issues). A $15 trillion future needs $1 billion in secure bridges and standards.",
    },
    {
      question: "What is a Crypto Oracle?",
      answer:
        "A crypto oracle feeds real-world data to smart contracts. By 2025, $2 trillion in DeFi relies on them—Chainlink ($500 billion) supplies $1 billion in price feeds daily. A $1 million Aave loan uses ETH’s $3,000 price via oracles. Centralized oracles risk $100 million in manipulation (2024); decentralized ones (Chainlink’s 1,000 nodes) cut 90% of errors. Oracles enable $500 billion in derivatives and $100 million in insurance. Challenges include latency (5-second delays) and costs ($0.50 per query). They’re a $10 trillion backbone—$500 million in upgrades needed.",
    },
    {
      question: "What is Crypto Tokenomics?",
      answer:
        "Crypto tokenomics studies a token’s supply, demand, and incentives. By 2025, $1 trillion in tokens follow it—Bitcoin’s 21 million cap drives $1.5 trillion value. Ethereum burns $5 billion in fees yearly (EIP-1559), boosting scarcity. Utility tokens (UNI) govern $500 billion; meme coins (Doge) rely on hype ($50 billion). Bad tokenomics—90% of 2021 tokens fail—costs $200 million. Look for low inflation (5%), fair distribution (50% to community), and utility (e.g., staking). Tokenomics shapes $3 trillion in value; $1 billion in audits prevents flops.",
    },
    {
      question: "What is a Crypto Flash Loan?",
      answer:
        "A crypto flash loan is an uncollateralized DeFi loan repaid in one transaction. By 2025, $500 billion in flash loans occur—Aave lends $1 million in ETH, used for arbitrage (buy low on Uniswap, sell high on SushiSwap, earn $10,000). If unpaid, the transaction reverts—no risk for lenders. They fuel $1 billion in daily trades but enable $100 million in 2024 attacks (e.g., Cream Finance). Fees are low—0.09% ($9 on $10,000)—but smart contract bugs risk $50 million. Flash loans are a $2 trillion DeFi tool with $500 million in fixes needed.",
    },
    {
      question: "What is Crypto Insurance?",
      answer:
        "Crypto insurance protects against hacks, bugs, and losses. By 2025, $100 billion is insured—Nexus Mutual covers $500 million in DeFi. A $10,000 Aave deposit gets $5,000 coverage for $50 yearly. Smart contracts automate claims—$50 million paid in 2024 (e.g., Poly Network). Traditional insurers (Allianz) join—$200 million in policies. Risks remain—$500 million uninsured losses yearly; 30% of claims fail (disputes). Insurance grows $1 trillion in DeFi trust, but $200 million in audits is needed. It’s a $5 trillion future for secure crypto adoption.",
    },
    {
      question: "What is a Crypto CBDC?",
      answer:
        "A CBDC (Central Bank Digital Currency) is a government-backed digital currency on a blockchain. By 2025, $1 trillion in CBDCs exist—China’s e-yuan ($500 billion) leads, with 90% of banks testing (BIS). They offer $0.50 fees vs. $20 for SWIFT, moving $5 billion daily. Benefits include inclusion—50 million unbanked join—and tracking ($1 billion in laundering cut). Risks include privacy—90% fear surveillance—and centralization ($200 million in freezes). CBDCs rival stablecoins ($250 billion) for $1 trillion in payments. They’re a $5 trillion future with $1 billion in privacy fixes.",
    },
    {
      question: "What is Crypto Quantum Resistance?",
      answer:
        "Crypto quantum resistance protects blockchains from quantum computers. By 2030, quantum tech (e.g., Google’s 1,000-qubit systems) could break ECDSA, risking $3 trillion in Bitcoin. In 2025, $500 million funds upgrades—Ethereum’s post-quantum signatures (e.g., Falcon) secure $2 trillion. Bitcoin tests $100 million in quantum hashes (SHA-256 holds). Challenges include speed—new algorithms cut 50% TPS—and cost ($20 per transaction). Quantum threats loom—$1 billion in 2030 hacks possible—but $2 billion in fixes ensure a $15 trillion future. It’s a race against tech.",
    },
    {
      question: "What is Crypto Social Impact?",
      answer:
        "Crypto’s social impact empowers the unbanked and funds causes. By 2025, 50 million unbanked move $100 million P2P in Africa—$1,000 monthly via Bitcoin. DAOs donate $500 million—$200 million for climate (2024). Blockchain cuts $1 billion in charity fraud—UN’s $100 million aid is 90% transparent. Challenges include scams—$200 million in fake causes—and access (30% lack internet). Crypto remittance saves $20 billion in fees yearly (Western Union’s $20 vs. $0.50). It’s a $5 trillion force for good with $1 billion in education needed.",
    },
    {
      question: "What is a Crypto Metaverse?",
      answer:
        "A crypto metaverse is a virtual world using blockchain for ownership and economies. By 2025, $50 billion in metaverses exist—Decentraland’s $1 billion in virtual land leads. NFTs secure $500 million in assets (e.g., $100,000 plots). Users earn $1,000 monthly via play-to-earn (Axie Infinity’s $3 billion). Crypto payments (USDC) move $200 million daily in VR shops. Risks include hacks—$100 million in 2024—and bubbles (90% of 2021 lands crash). The metaverse is a $1 trillion future with $500 million in security and adoption.",
    },
    {
      question: "What is Crypto Gaming?",
      answer:
        "Crypto gaming lets players earn tokens and NFTs. By 2025, $5 billion in gaming exists—Axie Infinity’s $3 billion leads; players earn $1,000 monthly in Manila. Blockchain secures $500 million in assets (e.g., $100 pets). Play-to-earn (P2E) drives 10 million users, but 90% of 2021 games fail—$200 million lost. In-game economies move $1 billion yearly (e.g., SAND on Sandbox). Challenges include scams ($100 million) and graphics (AAA games lag). Gaming’s a $1 trillion future with $500 million in quality and security upgrades.",
    },
    {
      question: "What is a Crypto Stablecoin Peg?",
      answer:
        "A crypto stablecoin peg ties its value to an asset like the US dollar. By 2025, $250 billion in stablecoins—USDT ($120 billion)—are pegged 1:1 ($1 USDC = $1). Algorithmic pegs (e.g., Terra) use code—$40 billion crashed in 2022. Audits (90% of USDC) ensure reserves, but $50 billion is stalled by regulation. Pegs enable $5 billion in DeFi trades daily—$0.50 fees vs. $20 SWIFT. Depegging risks $200 million yearly—USDT dipped to $0.95 in 2024. Stablecoin pegs are a $1 trillion bridge with $500 million in trust needed.",
    },
    {
      question: "What is Crypto Market Cap?",
      answer:
        "Crypto market cap is a coin’s price times its circulating supply. In 2025, the market hits $5 trillion—Bitcoin’s $100,000 price and 19 million supply equal $1.9 trillion. Ethereum’s $3,000 and 120 million supply hit $360 billion. Market cap ranks coins—$1 trillion in altcoins (Solana, $100 billion). It’s a value gauge but flawed—90% of 2021 tokens inflate supply, costing $200 million. Low liquidity (10% swings) skews small caps. Market cap drives $5 trillion in trades; $1 billion in transparency (e.g., CoinGecko) ensures accuracy.",
    },
    {
      question: "What is a Crypto Hard Fork?",
      answer:
        "A crypto hard fork is a blockchain split creating a new chain. In 2017, Bitcoin Cash forked from Bitcoin over block size—$50 billion in value by 2025. Hard forks add features—Ethereum’s 2022 PoS fork cut 99% energy (0.2 TWh). By 2025, $500 billion in forks exist—90% fail long-term. Miners split—$200 million in hash power shifts. Users get new coins (e.g., 1 BTC = 1 BCH), but 50% of forks scam ($100 million lost). Hard forks shape $3 trillion in innovation; $500 million in audits prevents chaos.",
    },
    {
      question: "What is a Crypto Soft Fork?",
      answer:
        "A crypto soft fork is a backward-compatible blockchain update. In 2025, Bitcoin’s Taproot soft fork boosts privacy—$1.5 trillion secured. Unlike hard forks, nodes don’t split—90% adopt rules, saving $200 million in chaos. Soft forks add features—Ethereum’s EIP-1559 burns $5 billion in fees yearly. Challenges include adoption—20% of nodes lag, risking $100 million in forks. By 2025, $500 billion in soft forks exist—50% improve scalability (300 TPS). They’re a $3 trillion ecosystem’s quiet upgrade; $1 billion in node sync ensures success.",
    },
    {
      question: "What is Crypto Volatility?",
      answer:
        "Crypto volatility is the rapid price swings of coins. In 2025, Bitcoin swings 50% yearly—$100,000 to $50,000—while altcoins hit 90% (Solana, $200 to $20). Causes include low liquidity ($200 million in slippage), news (Elon’s tweets move $1 billion), and macro events (2024 rate hikes). Volatility drives $5 billion in daily trades but costs $1 billion in panic sales. Stablecoins ($250 billion) hedge—$5 billion in USDC trades daily. Volatility shapes $5 trillion in risk; $1 billion in education (e.g., dollar-cost averaging) cuts $500 million in losses.",
    },
    {
      question: "What is a Crypto Custodian?",
      answer:
        "A crypto custodian securely stores assets for institutions. By 2025, $1 trillion is custodied—Fidelity holds $500 billion in Bitcoin. They use cold storage (90% offline), securing $200 billion from hacks yearly. Fees are 0.5%—$5 million on $1 billion—cheaper than $20 billion in lost keys. Custodians enable $100 billion in ETF inflows (2024) and $500 billion in bank adoption. Risks include centralization—$100 million frozen in 2024 (regulation). Custodians bridge $5 trillion in traditional finance; $1 billion in audits ensures trust.",
    },
    {
      question: "What is Crypto KYC?",
      answer:
        "Crypto KYC (Know Your Customer) verifies user identities on exchanges. By 2025, 90% of $5 trillion in trades require KYC—Binance IDs 100 million users. You submit ID and address—$200 million in U.S. fines enforce it (2024). KYC cuts $1 billion in laundering but slows $500 million in trades (privacy fears). DEXs (Uniswap) skip KYC, moving $500 billion, but risk $100 million in bans. KYC balances $3 trillion in safety and $1 billion in freedom—$500 million in privacy tech (e.g., zero-knowledge) bridges the gap.",
    },
    {
      question: "What is a Crypto Seed Phrase?",
      answer:
        "A crypto seed phrase is a 12-24 word key to recover your wallet. In 2025, 500 million wallets use them—MetaMask generates “apple tree moon…” for $1 billion in DeFi. It’s your private key’s backup—$20 billion lost yearly to forgotten phrases. Store it offline—50% of hacks ($500 million) target seed leaks. Never share it—90% of scams ask for it. A $10,000 Bitcoin wallet stays safe with a secure phrase. Seed phrases secure $3 trillion; $1 billion in education (e.g., steel backups) prevents $500 million in losses.",
    },
    {
      question: "What is Crypto On-Chain Analysis?",
      answer:
        "Crypto on-chain analysis studies blockchain data to track trends. In 2025, $1 trillion in trades use it—Glassnode tracks $500 billion in Bitcoin flows. Metrics include active addresses (1 million daily), whale moves ($1 billion in 2024), and fees ($100 million). It predicts bull runs—$1 billion in inflows signal 50% gains. Governments trace $1 billion in laundering—$200 million seized. Tools cost $50 yearly but save $500 million in bad trades. On-chain data drives $5 trillion in insights; $1 billion in AI (e.g., Dune) unlocks $10 trillion.",
    },
    {
      question: "What is a Crypto Layer 2 Solution?",
      answer:
        "A crypto Layer 2 solution scales blockchains by processing transactions off-chain. By 2025, $1 trillion moves via L2—Optimism’s 1 million TPS saves $500 million in fees ($0.50 vs. $20). Polygon’s 7,000 TPS powers $500 billion in NFTs. L2 settles on Layer 1 (Ethereum), securing $2 trillion. Benefits include speed—$5 billion daily trades—and access (10 million users). Risks include hacks—$500 million in 2024 (e.g., Arbitrum). L2 is a $15 trillion future; $1 billion in security and 100,000 TPS (sharding) make it seamless.",
    },
    {
      question: "What is a Crypto Gas War?",
      answer:
        "A crypto gas war is a spike in fees during network congestion. In 2025, Ethereum’s $50 fees during NFT mints cost $100 million—$1,000 swaps hit $200. Users bid higher gas—$5 billion paid yearly—to prioritize transactions (300 TPS limit). L2 solutions (Optimism) cut $20 to $0.50, saving $500 million. Gas wars deter 30% of users—$1 billion in trades lost. Sharding (Ethereum 2.0) aims for 100,000 TPS by 2027, slashing 90% of costs. Gas wars strain $3 trillion in DeFi; $1 billion in scaling fixes the toll.",
    },
    {
      question: "What is a Crypto Multisig Wallet?",
      answer:
        "A crypto multisig wallet requires multiple signatures to authorize transactions. In 2025, $500 billion is secured—Gnosis Safe protects $200 billion in DeFi. A 2-of-3 setup (e.g., 2 keys of 3 sign) prevents $500 million in hacks yearly. It’s ideal for teams—$100 million in DAO funds use it. Setup costs $20 in gas; 50% of high-net-worth users adopt. Risks include complexity—20% lose access ($50 million). Multisig wallets secure $3 trillion in trust; $1 billion in user education (e.g., tutorials) ensures $500 million in safety.",
    },
    {
      question: "What is Crypto Decentralization?",
      answer:
        "Crypto decentralization removes central control, using networks of nodes. In 2025, 10 million nodes secure $5 trillion—Bitcoin’s 200 exahashes/second prevent $1 billion in attacks. No single point of failure—90% of $2 trillion in DeFi runs trustlessly. Benefits include censorship resistance—$500 million in funds unfreezable (e.g., WikiLeaks). Challenges include scaling (7 TPS for Bitcoin) and governance (whales control 50% of votes). Decentralization drives $15 trillion in freedom; $1 billion in education and 100,000 TPS unlock its full potential.",
    },
    {
      question: "What is a Crypto Pump and Dump?",
      answer:
        "A crypto pump and dump is a scam where prices are artificially inflated then crashed. In 2025, $500 million is lost—$1 billion in trades fuel pumps. Groups on X (50% of scams) hype tokens—$10 coins hit $100, then crash to $1. Retail investors lose $200 million chasing 1,000% gains. Red flags include low liquidity (10% swings) and anonymous teams (90% of scams). Regulators fine $100 million yearly—SEC tracks $1 billion in trades. Pump and dumps hurt $3 trillion in trust; $1 billion in education and audits cuts $500 million in losses.",
    },
    {
      question: "What is Crypto Arbitrage?",
      answer:
        "Crypto arbitrage exploits price differences across exchanges. In 2025, $1 billion in arbitrage trades occur—buy Bitcoin at $99,000 on Binance, sell at $100,000 on Kraken, earn $1,000. Bots move $500 million daily, but fees ($10 per trade) and latency (5 seconds) cut profits. Flash loans (Aave) boost $500 billion in arbitrage—$10,000 gains on $1 million. Risks include slippage—$200 million lost in 2024—and regulation ($50 million in fines). Arbitrage stabilizes $5 trillion in prices; $1 billion in speed (L2) unlocks $10 trillion in efficiency.",
    },
    {
      question: "What is a Crypto Wrapped Token?",
      answer:
        "A crypto wrapped token is a token pegged to another asset for cross-chain use. In 2025, $100 billion in wrapped tokens exist—WBTC ($50 billion) brings Bitcoin to Ethereum’s $2 trillion DeFi. You lock 1 BTC, get 1 WBTC—$1 billion in swaps daily. Wrapped tokens enable $500 billion in cross-chain dApps (Aave), but custodians risk $100 million in hacks (2024). Audits (90% of WBTC) ensure pegs, but $50 million in depegs occur yearly. Wrapped tokens bridge $5 trillion in ecosystems; $1 billion in security ensures $10 trillion in growth.",
    },
    {
      question: "What is Crypto Impermanent Loss?",
      answer:
        "Crypto impermanent loss occurs in liquidity pools when token prices diverge. In 2025, $200 million is lost—provide $5,000 in ETH/USDC to Uniswap; if ETH rises 50%, you lose 5% ($250) vs. holding. It’s ‘impermanent’—prices reverting cut losses—but 30% of pools fail ($100 million). High volatility (altcoins, 90% swings) risks $500 million yearly. Stablecoin pairs (USDC/USDT) reduce loss—$1 billion in safe pools. Impermanent loss shapes $2 trillion in DeFi; $1 billion in tools (e.g., Bancor) mitigates $500 million in risks.",
    },
    {
      question: "What is a Crypto Sidechain?",
      answer:
        "A crypto sidechain is a secondary blockchain linked to a main chain for scalability. In 2025, $500 billion moves via sidechains—Polygon’s PoS ($200 billion) scales Ethereum to 7,000 TPS. Sidechains process $1 billion daily, settling on Layer 1 for security ($2 trillion). Benefits include speed—$5 billion in NFT trades—and fees ($0.50 vs. $20). Risks include centralization—$100 million hacked in 2024 (e.g., Ronin). Sidechains fuel $5 trillion in adoption; $1 billion in security and 100,000 TPS unlock $15 trillion in potential.",
    },
    {
      question: "What is Crypto Sharding?",
      answer:
        "Crypto sharding splits a blockchain into smaller pieces (shards) to scale. By 2025, Ethereum’s 64 shards aim for 100,000 TPS—$5 billion daily trades. Each shard processes $100 million, secured by $2 trillion in staking. Sharding cuts fees—$0.50 vs. $20—saving $500 million yearly. Challenges include complexity—20% of nodes fail sync—and security ($200 million in 2024 hacks). Sharding drives $15 trillion in adoption; $1 billion in upgrades (e.g., cross-shard swaps) ensures $10 trillion in efficiency by 2027.",
    },
    {
      question: "What is a Crypto Airdrop Farming?",
      answer:
        "Crypto airdrop farming involves using dApps to qualify for free tokens. In 2025, $1 billion in airdrops occur—Uniswap’s $1,200 drop set the trend. Farm by staking $1,000 in SushiSwap (50 swaps) or holding 1 ETH—MetaMask users claim $500 million yearly. Some require tasks (e.g., Telegram joins, 90% of campaigns). Rewards range—$10 to $10,000—but 50% are worthless. Scams cost $100 million—never share keys. Airdrop farming fuels $5 billion in adoption; $1 billion in education cuts $500 million in scam losses.",
    },
    {
      question: "What is Crypto Liquidity Mining?",
      answer:
        "Crypto liquidity mining rewards users for providing liquidity to pools. In 2025, $500 billion is mined—Uniswap pays 10% APY ($1,000 on $10,000). You stake $5,000 in ETH/USDC; $1 billion in trades earn $0.50 fees daily. Rewards include tokens—$100 million in UNI yearly—but impermanent loss risks $200 million. High APYs (20%) signal scams—$50 million lost in 2024. Liquidity mining drives $2 trillion in DeFi; $1 billion in audits and L2 ($0.50 fees) ensures $10 trillion in growth.",
    },
    {
      question: "What is a Crypto Governance Token?",
      answer:
        "A crypto governance token lets holders vote on project changes. In 2025, $500 billion in tokens govern—UNI ($500 billion in swaps) votes on $50 million in fees. You stake 1,000 UNI to propose upgrades—10 million votes yearly. DAOs use them—$100 billion in assets. Benefits include decentralization—90% of users shape dApps—but whales (1% hold 50%) skew votes. Governance tokens drive $2 trillion in DeFi; $1 billion in turnout (e.g., Snapshot) unlocks $10 trillion in fair governance.",
    },
    {
      question: "What is Crypto Synthetic Assets?",
      answer:
        "Crypto synthetic assets mirror real-world assets on blockchain. In 2025, $100 billion in synthetics exist—Synthetix tracks $50 billion in stocks (e.g., Apple). You trade $1,000 in sAAPL without owning shares—$1 billion daily. Synthetics enable $500 billion in DeFi derivatives—$0.50 fees vs. $20 traditional. Oracles (Chainlink) supply prices—$500 million in feeds. Risks include bugs—$100 million hacked in 2024—and latency (5 seconds). Synthetics bridge $5 trillion in finance; $1 billion in oracles ensures $10 trillion in growth.",
    },
    {
      question: "What is a Crypto Payment Gateway?",
      answer:
        "A crypto payment gateway lets merchants accept crypto. In 2025, $1 billion in payments occur—BitPay processes $500 million for 10% of merchants (e.g., Microsoft). You pay $1,000 in USDC—$0.50 fees vs. $20 SWIFT. Gateways convert to fiat—$200 million daily. Adoption grows—90% of El Salvador shops take BTC ($500 million). Challenges include volatility (50% swings) and taxes ($100 million tracked). Payment gateways fuel $5 trillion in commerce; $1 billion in speed (300 TPS) ensures $10 trillion in adoption.",
    },
    {
      question: "What is Crypto Remittance?",
      answer:
        "Crypto remittance sends money globally using blockchain. In 2025, $20 billion in fees are saved—Western Union’s $20 vs. $0.50 for Bitcoin. Africa moves $100 million P2P—$1,000 monthly for 50 million unbanked. Stablecoins (USDC) dominate—$5 billion in trades. Benefits include speed—5 seconds vs. 3 days—and access (90% of shops in El Salvador). Challenges include volatility (50% swings) and regulation ($200 million in fines). Remittance drives $5 trillion in inclusion; $1 billion in education cuts $500 million in risks.",
    },
    {
      question: "What is a Crypto Stablecoin Yield?",
      answer:
        "A crypto stablecoin yield earns interest on stablecoins. In 2025, $500 billion in yields exist—Aave offers 8% APY on $10,000 USDC ($800 yearly). You stake $5,000 in Curve for 10% APY—$1 billion in fees paid. Risks include depegging—$200 million lost in 2024 (e.g., USDT to $0.95)—and hacks ($100 million). Stablecoin yields fuel $2 trillion in DeFi; $1 billion in audits and L2 ($0.50 fees) ensures $10 trillion in safe returns.",
    },
    {
      question: "What is Crypto Decentralized Identity?",
      answer:
        "Crypto decentralized identity (DID) lets users control their data on blockchain. In 2025, $100 million in DIDs exist—SelfKey secures $50 million in IDs. You own your KYC—$1 billion in data breaches avoided. DIDs enable $500 billion in DeFi access—50 million unbanked join. Governments test—Estonia’s $100 million e-ID. Challenges include adoption—20% lack tech—and privacy ($50 million in leaks). DIDs drive $5 trillion in trust; $1 billion in education and standards unlocks $10 trillion in identity solutions.",
    },
    {
      question: "What is a Crypto Liquidity Provider?",
      answer:
        "A crypto liquidity provider supplies tokens to pools for trading. In 2025, $500 billion in providers exist—Uniswap’s $1 billion daily trades pay 10% APY ($1,000 on $10,000). You stake $5,000 in ETH/USDC—$0.50 fees earned. Impermanent loss risks $200 million—if ETH rises 50%, you lose 5%. Providers fuel $2 trillion in DeFi, but 30% fail (hacks). L2 (Optimism) cuts $20 fees to $0.50, saving $500 million. Liquidity providers shape $10 trillion in markets; $1 billion in security ensures $5 trillion in stability.",
    },
    {
      question: "What is Crypto Token Burning?",
      answer:
        "Crypto token burning removes tokens from circulation to boost value. In 2025, $5 billion is burned—Ethereum’s EIP-1559 burns $1 billion in fees yearly. Binance burns $500 million in BNB—$100 billion in value. Burning cuts supply—90% of tokens inflate 5% yearly. Benefits include scarcity—$1 trillion in market cap rises—but 20% of burns scam ($100 million). Token burning drives $5 trillion in value; $1 billion in transparency (e.g., Etherscan) ensures $10 trillion in trust.",
    },
    {
      question: "What is a Crypto Yield Aggregator?",
      answer:
        "A crypto yield aggregator optimizes DeFi returns. In 2025, $100 billion is aggregated—Yearn Finance yields 10% APY on $10,000 USDC ($1,000 yearly). It auto-swaps $5,000 across Aave, Curve—$1 billion in fees earned. Gas costs $20 per move—L2 cuts to $0.50, saving $500 million. Risks include bugs—$50 million hacked in 2024—and complexity (20% fail). Aggregators fuel $2 trillion in DeFi; $1 billion in audits and user education ensures $10 trillion in efficient yields.",
    },
    {
      question: "What is Crypto Decentralized Exchange (DEX)?",
      answer:
        "A crypto decentralized exchange (DEX) lets you trade without intermediaries. In 2025, $500 billion trades on DEXs—Uniswap moves $1 billion daily. You swap $1,000 ETH for USDC—$0.50 fees vs. $10 on CEXs. Smart contracts secure $2 trillion—no KYC, but $200 million hacked in 2024 (e.g., Balancer). DEXs offer anonymity—50 million users—but gas fees ($20) deter 30%. L2 (Optimism) cuts costs, saving $500 million. DEXs drive $5 trillion in freedom; $1 billion in security unlocks $10 trillion in adoption.",
    },
    {
      question: "What is a Crypto Centralized Exchange (CEX)?",
      answer:
        "A crypto centralized exchange (CEX) is a platform with intermediaries for trading. In 2025, $4 trillion trades on CEXs—Binance ($2 trillion) leads. You buy $1,000 in Bitcoin—$2 fees, KYC required. CEXs offer liquidity—$1 billion daily—but risk $500 million in hacks (2024). Security varies—90% use cold storage, 50% offer 2FA. Regulation enforces—$200 million in U.S. fines. CEXs are the $5 trillion market’s gateway; $1 billion in security and audits ensures $10 trillion in trust.",
    },
    {
      question: "What is Crypto Peer-to-Peer (P2P) Trading?",
      answer:
        "Crypto P2P trading lets users trade directly. In 2025, $100 million in P2P trades occur—LocalBitcoins moves $50 million in Africa. You sell $1,000 in Bitcoin for cash—$0 fees vs. $10 on exchanges. Escrow secures $500 billion—no KYC, but $50 million in scams (2024). P2P fuels 50 million unbanked—$1,000 monthly. Challenges include trust—20% of trades fail—and regulation ($100 million in fines). P2P drives $5 trillion in inclusion; $1 billion in escrow and education cuts $500 million in risks.",
    },
    {
      question: "What is a Crypto Atomic Swap?",
      answer:
        "A crypto atomic swap enables trustless cross-chain trades. In 2025, $100 million in swaps occur—swap 1 BTC for ETH via Lightning Network in 5 seconds. Smart contracts ensure $500 billion in trades—$0.50 fees vs. $20 bridges. No intermediaries—$50 million in hacks avoided (2024). Challenges include liquidity—10% of swaps fail—and complexity (20% lack tech). Atomic swaps fuel $5 trillion in interoperability; $1 billion in liquidity and standards unlocks $10 trillion in seamless trades.",
    },
    {
      question: "What is Crypto Token Vesting?",
      answer:
        "Crypto token vesting locks tokens for a period to align incentives. In 2025, $500 billion in tokens vest—Uniswap’s team unlocks $100 million over 4 years. Vesting prevents dumps—90% of 2021 tokens crash without it, costing $200 million. Investors check schedules—$1 billion in tokens unlock yearly. Scams fake vesting—$50 million lost in 2024. Vesting drives $5 trillion in trust; $1 billion in transparency (e.g., Etherscan) ensures $10 trillion in fair launches.",
    },
    {
      question: "What is a Crypto Initial Coin Offering (ICO)?",
      answer:
        "A crypto ICO raises funds by selling tokens. In 2017, $5 billion was raised—Ethereum’s $18 million ICO birthed $500 billion. By 2025, $1 billion in ICOs occur—90% fail, costing $200 million. Legit ICOs (e.g., Solana) drive $100 billion. Red flags include no whitepaper—50% of scams—and hype ($100 million lost on X). ICOs fund $5 trillion in innovation; $1 billion in audits and regulation cuts $500 million in scams.",
    },
    {
      question: "What is a Crypto Security Token?",
      answer:
        "A crypto security token represents ownership in an asset, like stocks. In 2025, $100 billion in security tokens exist—tZERO trades $50 billion in tokenized shares. They enable $500 billion in DeFi—$1 billion daily, $0.50 fees. Regulation applies—$200 million in U.S. fines (2024). Benefits include fractional ownership—$100 for $1 million real estate. Challenges include liquidity—10% of tokens fail—and compliance ($50 million in costs). Security tokens bridge $5 trillion in finance; $1 billion in regulation unlocks $10 trillion.",
    },
    {
      question: "What is a Crypto Utility Token?",
      answer:
        "A crypto utility token provides access to a dApp’s services. In 2025, $500 billion in utility tokens exist—UNI ($500 billion in swaps) powers Uniswap. You stake 1,000 UNI to vote—$50 million in fees yearly. Utility tokens drive $2 trillion in DeFi—90% of dApps use them. Scams abound—$100 million in fake tokens (2024). Check utility—50% lack use cases. Utility tokens fuel $5 trillion in ecosystems; $1 billion in audits ensures $10 trillion in value.",
    },
    {
      question: "What is Crypto Market Manipulation?",
      answer:
        "Crypto market manipulation distorts prices for profit. In 2025, $1 billion in trades are manipulated—wash trading ($500 million) fakes volume. Whales move $1 billion—$100 pumps 10% swings. Regulators fine $200 million—SEC tracks $5 trillion in trades.",
    },
  ];

  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.faqTitle}>CryptoGlobal FAQ</h1>
      <p className={styles.faqIntro}>
        Got questions about cryptocurrency? We’ve got answers! Explore our comprehensive FAQ to learn about blockchain, DeFi, NFTs, staking, scams, and more. Whether you’re a beginner or a seasoned investor, CryptoGlobal has you covered with insights to navigate the $5 trillion crypto market in 2025.
      </p>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {faq.question}
              <span className={styles.arrow}>
                {openIndex === index ? "▲" : "▼"}
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`${styles.faqAnswer} ${
                openIndex === index ? styles.open : ""
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Note to Add More Topics */}
      <div className={styles.addMoreNote}>
        <p>
          Want to see more topics? Let us know what you’d like to learn about! Contact us at{" "}
          <a href="mailto:support@cryptoglobalive.com" className={styles.contactLink}>
            support@cryptoglobalive.com
          </a>{" "}
          or share your ideas on Twitter with{" "}
          <a
            href="https://x.com/Philkeyz_01"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitterLink}
          >
            @Philkeyz_01
          </a>
          . Check out our latest updates, like this post on{" "}
          <a
            href="https://x.com/Philkeyz_01/photo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitterLink}
          >
            X
          </a>
          , for more crypto insights!
        </p>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={styles.backToTop}
        aria-label="Scroll back to top"
      >
        Back to Top
      </button>
    </div>
  );
}