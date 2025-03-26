"use client";

import styles from "./page.module.css";

export default function History() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>History of Cryptocurrencies</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pre-Crypto Foundations: The Roots of Digital Currency (1980s-2007)</h2>
        <p>
          The concept of digital currency predates Bitcoin by decades. In 1983, David Chaum, a cryptographer, introduced the idea of eCash, a cryptographic system for anonymous digital payments. Chaum later founded DigiCash in 1989, which allowed secure, untraceable transactions using blind signatures. Despite its innovation, DigiCash failed to gain traction and went bankrupt in 1998 due to lack of adoption.
        </p>
        <p>
          In 1998, Wei Dai published a proposal for b-money, a decentralized digital currency system that used proof-of-work to create money and a network of nodes to maintain consensus. Around the same time, Nick Szabo proposed Bit Gold, a decentralized currency that also used proof-of-work and cryptographic puzzles to secure transactions. Both b-money and Bit Gold were theoretical but heavily influenced Bitcoins design.
        </p>
        <p>
          The early 2000s saw the rise of centralized digital payment systems like PayPal (founded in 1998 as Confinity) and Liberty Reserve (2006), which offered digital currency-like functionality but were centralized and prone to shutdowns. Liberty Reserve, for example, was shut down in 2013 for money laundering. These early experiments highlighted the need for a truly decentralized, trustless system—setting the stage for Bitcoin.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Birth of Cryptocurrency: Bitcoin and Early Altcoins (2008-2012)</h2>
        <p>
          The cryptocurrency era began with Bitcoin. On October 31, 2008, Satoshi Nakamoto published the Bitcoin whitepaper, Bitcoin: A Peer-to-Peer Electronic Cash System, outlining a decentralized digital currency using a proof-of-work (PoW) consensus mechanism. The Bitcoin network launched on January 3, 2009, with the mining of the genesis block, which included a message referencing a financial crisis headline: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.
        </p>
        <p>
          Bitcoin’s early years were marked by slow adoption. The first notable transaction occurred on May 22, 2010, when Laszlo Hanyecz bought two pizzas for 10,000 BTC, now celebrated as Bitcoin Pizza Day. At the time, 10,000 BTC was worth about $41; by 2025, that amount would be valued at over $600 million. In 2010, Bitcoin’s first exchange, Mt. Gox, was established, handling over 70% of Bitcoin transactions by 2013 but later collapsing in 2014 after a hack that lost 850,000 BTC.
        </p>
        <p>
          The success of Bitcoin inspired the creation of altcoins. In April 2011, Namecoin was launched as the first altcoin, aiming to create a decentralized DNS system using blockchain technology. Namecoin allowed users to register .bit domains, resistant to censorship, but it never gained widespread adoption.
        </p>
        <p>
          In October 2011, Charlie Lee, a former Google engineer, launched Litecoin (LTC), often called the silver to Bitcoin’s gold. Litecoin used the Scrypt algorithm instead of SHA-256, making it more accessible for CPU mining in its early days, and had a faster block time (2.5 minutes vs. Bitcoin’s 10 minutes). Litecoin also increased the total supply to 84 million coins, four times Bitcoin’s 21 million cap.
        </p>
        <p>
          Also in 2011, Peercoin (PPC) was introduced by Sunny King and Scott Nadal, pioneering the proof-of-stake (PoS) consensus mechanism as an energy-efficient alternative to PoW. Peercoin used a hybrid PoW/PoS system, where PoW was used for initial coin distribution, and PoS secured the network over time.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Altcoin Explosion and Ethereum’s Rise (2013-2016)</h2>
        <p>
          The early 2010s saw a wave of new cryptocurrencies. In 2013, Ripple (XRP) was launched by Ripple Labs (originally OpenCoin), founded by Chris Larsen and Jed McCaleb. Ripple focused on cross-border payments, using the XRP Ledger to enable near-instant transactions with low fees. Unlike Bitcoin, XRP was pre-mined, with 100 billion tokens created, 80% of which were held by Ripple Labs, leading to centralization concerns.
        </p>
        <p>
          Also in 2013, Dogecoin (DOGE) was created by Billy Markus and Jackson Palmer as a lighthearted alternative to Bitcoin, based on the Doge Shiba Inu meme. Dogecoin used Scrypt and had an inflationary supply with no cap, producing 10,000 new coins per block. Despite its origins as a joke, Dogecoin gained a loyal community, often used for tipping on platforms like Reddit and Twitter, and later saw massive price surges in 2021 due to endorsements from Elon Musk.
        </p>
        <p>
          In 2014, Dash (originally Darkcoin) was launched by Evan Duffield, focusing on privacy and speed. Dash introduced features like PrivateSend for optional anonymity and InstantSend for fast transactions. It also pioneered the concept of masternodes—special nodes that provide additional services in exchange for rewards, requiring a stake of 1,000 DASH to operate.
        </p>
        <p>
          The same year, Monero (XMR) was launched, emphasizing privacy through ring signatures, stealth addresses, and RingCT (Ring Confidential Transactions). Monero became a favorite for users seeking untraceable transactions, though its privacy features also made it controversial, often associated with darknet markets.
        </p>
        <p>
          In 2015, Ethereum revolutionized the crypto space. Proposed by Vitalik Buterin in 2013 and launched on July 30, 2015, Ethereum introduced smart contracts—self-executing code on the blockchain. This enabled decentralized applications (dApps), from decentralized exchanges to games. Ethereum’s native token, Ether (ETH), quickly became the second-largest cryptocurrency by market cap. In 2016, the DAO (Decentralized Autonomous Organization) hack on Ethereum led to a controversial hard fork, splitting the network into Ethereum (ETH) and Ethereum Classic (ETC).
        </p>
        <p>
          Also in 2015, IOTA was launched, focusing on the Internet of Things (IoT). Unlike traditional blockchains, IOTA used a directed acyclic graph (DAG) called the Tangle, eliminating miners and fees. IOTA aimed to enable feeless microtransactions for IoT devices but faced criticism for centralization (via its Coordinator node) and security issues.
        </p>
        <p>
          In 2016, Zcash (ZEC) was launched by Zooko Wilcox, offering optional privacy through zero-knowledge proofs (zk-SNARKs). Zcash allowed users to choose between transparent and shielded transactions, balancing privacy with regulatory compliance. However, its founders reward (20% of block rewards for the first four years) drew criticism.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The ICO Boom and Mainstream Attention (2017-2019)</h2>
        <p>
          2017 was a landmark year for crypto, driven by the Initial Coin Offering (ICO) boom. Projects raised billions by issuing tokens, often on Ethereum. One of the largest ICOs was EOS, which raised $4.1 billion from 2017 to 2018. Launched by Block.one, EOS aimed to be a scalable blockchain for dApps, using delegated proof-of-stake (DPoS) and promising up to 1,000 transactions per second (TPS). However, EOS faced criticism for centralization due to its 21 block producers.
        </p>
        <p>
          Tezos (XTZ), another 2017 ICO, raised $232 million. Founded by Arthur and Kathleen Breitman, Tezos introduced on-chain governance, allowing the protocol to upgrade without hard forks. Tezos uses a PoS mechanism called baking, but its launch was marred by legal disputes between the founders and the Tezos Foundation.
        </p>
        <p>
          Binance Coin (BNB) was launched in July 2017 by the Binance exchange, founded by Changpeng Zhao. BNB was initially an ERC-20 token used for trading fee discounts on Binance. In 2019, Binance launched the Binance Chain, and BNB became its native token. Later, the Binance Smart Chain (now BNB Chain) emerged as a hub for DeFi and dApps, competing with Ethereum.
        </p>
        <p>
          In 2017, NEO (originally AntShares) was launched in China, often called the Ethereum of China. NEO supported smart contracts and aimed to digitize assets, with a dual-token system: NEO for governance and GAS for transaction fees. NEO’s focus on regulatory compliance made it popular in Asia.
        </p>
        <p>
          Stablecoins gained traction in this period. Tether (USDT), launched in 2014, became the dominant stablecoin, pegged 1:1 to the U.S. dollar. However, Tether faced scrutiny for lack of transparency about its reserves. In 2018, USD Coin (USDC) was launched by Circle and Coinbase, backed by audited reserves, and TrueUSD (TUSD) emerged as another transparent alternative.
        </p>
        <p>
          In 2018, Tron (TRX) was launched by Justin Sun after raising $70 million in an ICO. Tron aimed to decentralize the internet, focusing on content sharing and entertainment. Tron acquired BitTorrent in 2018 and later became a hub for DeFi and stablecoins like USDT-TRON.
        </p>
        <p>
          On March 14, 2019 (Pi Day), Pi Network was launched by Stanford Ph.D.s Nicolas Kokkalis, Chengdiao Fan, and Vincent McPhillips. Pi Network aimed to democratize crypto mining by allowing users to mine Pi coins on their mobile phones without draining battery life, using a modified Stellar Consensus Protocol (SCP). The project grew rapidly, reaching 1 million users within months. Pi Network emphasized accessibility, targeting users in developing countries, but its lack of a tradable coin and prolonged test phases led to skepticism. By 2019, Pi had introduced its wallet and testnet, allowing users to test transactions within the ecosystem.
        </p>
        <p>
          Also in 2019, Chainlink (LINK) gained prominence. Launched in 2017 by Sergey Nazarov, Chainlink provides decentralized oracles to connect smart contracts with real-world data. Chainlink’s price feeds became essential for DeFi protocols, and LINK’s value soared as adoption grew.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>DeFi, NFTs, and Layer 1 Wars (2020-2022)</h2>
        <p>
          The early 2020s were defined by decentralized finance (DeFi) and non-fungible tokens (NFTs). DeFi exploded in 2020, often called the DeFi Summer. Uniswap, launched in 2018 by Hayden Adams, became a leading decentralized exchange (DEX), introducing the automated market maker (AMM) model. In 2020, Uniswap launched its UNI token, airdropping 400 UNI to early users, worth thousands of dollars at peak prices.
        </p>
        <p>
          Other DeFi projects thrived: Aave (2020) introduced flash loans, allowing users to borrow without collateral if repaid in the same transaction. Compound (2018) enabled lending and borrowing with algorithmically adjusted interest rates. MakerDAO, launched in 2017, continued to grow with its DAI stablecoin, backed by crypto collateral and governed by MKR token holders.
        </p>
        <p>
          NFTs took off in 2021. CryptoPunks, launched in 2017 by Larva Labs, became a cultural phenomenon, with some Punks selling for millions. Bored Ape Yacht Club (BAYC), launched in April 2021 by Yuga Labs, created a community-driven NFT ecosystem, with apes granting access to exclusive events. The NFT market peaked in 2021, with sales reaching $25 billion, though high Ethereum gas fees drove users to other blockchains.
        </p>
        <p>
          Solana, launched in March 2020 by Anatoly Yakovenko, emerged as an Ethereum competitor, offering up to 65,000 TPS using proof-of-history (PoH) and proof-of-stake (PoS). Solana became a hub for DeFi (e.g., Serum) and NFTs (e.g., Magic Eden), but faced multiple network outages in 2021-2022, raising concerns about its stability.
        </p>
        <p>
          Cardano, founded by Charles Hoskinson in 2017, reached a milestone with its Alonzo upgrade in September 2021, adding smart contract functionality. Cardano’s Ouroboros PoS mechanism emphasized energy efficiency, and its focus on research-driven development (with peer-reviewed papers) attracted a loyal community. Cardano also partnered with African governments for blockchain solutions in education and identity.
        </p>
        <p>
          Polkadot, launched in 2020 by Ethereum co-founder Gavin Wood, introduced a multi-chain architecture with parachains—custom blockchains that connect to the Polkadot Relay Chain. Projects like Moonbeam (an Ethereum-compatible parachain) and Acala (a DeFi hub) thrived, with Polkadot’s interoperability vision gaining traction.
        </p>
        <p>
          Cosmos, launched in 2019, pursued a similar interoperability goal with its Internet of Blockchains. The Inter-Blockchain Communication (IBC) protocol enabled Cosmos chains like Osmosis and Terra to share data. Terra (LUNA), launched in 2018 by Do Kwon, became a DeFi powerhouse with its UST stablecoin, but collapsed in May 2022 due to a death spiral, wiping out $40 billion in value and shaking the crypto market.
        </p>
        <p>
          In 2020, Avalanche was launched by Ava Labs, offering high throughput (4,500 TPS) and sub-second finality. Avalanche’s subnet architecture allowed for custom blockchains, making it popular for DeFi (e.g., Trader Joe) and NFTs. Avalanche also supported Ethereum-compatible dApps through its C-Chain.
        </p>
        <p>
          Algorand, launched in 2019 by MIT professor Silvio Micali, used a pure proof-of-stake (PPoS) mechanism, focusing on scalability and decentralization. Algorand gained attention for its carbon-negative blockchain and partnerships with governments, such as tokenizing real estate in Italy.
        </p>
        <p>
          During this period, Pi Network continued to grow, reaching 30 million users by 2021. In December 2021, Pi launched its enclosed mainnet, restricting transactions to its ecosystem. In 2022, Pi introduced KYC verification to combat fake accounts, a process that verified over 10 million users by 2023. However, delays in its open mainnet launch fueled skepticism, with critics labeling it a social experiment rather than a functional blockchain.
        </p>
        <p>
          Meme coins also surged. Shiba Inu (SHIB), launched in August 2020 by Ryoshi, rode the Dogecoin wave, branding itself as the Dogecoin killer. SHIB’s ecosystem grew with ShibaSwap (a DEX) and plans for a metaverse. In 2021, SHIB’s price soared 50,000,000%, driven by retail hype and listings on major exchanges.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Maturation, Regulation, and Web3 (2023-2025)</h2>
        <p>
          By 2023, the crypto market showed signs of maturation. Bitcoin hit new all-time highs after the U.S. approved spot Bitcoin ETFs in January 2024, with firms like BlackRock and Fidelity launching funds. Ethereum completed its Shanghai upgrade in April 2023, enabling staking withdrawals, and continued to dominate DeFi and NFTs despite competition.
        </p>
        <p>
          Layer 2 solutions for Ethereum gained traction. Optimism and Arbitrum, both launched in 2021, used optimistic rollups to scale Ethereum, reducing gas fees and increasing throughput. Polygon (MATIC), launched in 2019, became a leading Layer 2, with its zkEVM (zero-knowledge Ethereum Virtual Machine) launched in 2023, offering EVM compatibility with zk-rollups.
        </p>
        <p>
          In 2023, Aptos and Sui emerged as new Layer 1 blockchains, both founded by former Meta employees from the Diem project (Meta’s abandoned stablecoin). Aptos and Sui used the Move programming language, focusing on high throughput and parallel transaction processing. Aptos launched its mainnet in October 2022, followed by Sui in May 2023, attracting DeFi and gaming projects.
        </p>
        <p>
          Hedera Hashgraph, launched in 2018, gained attention for its enterprise use cases. Hedera uses a directed acyclic graph (DAG) and its Hashgraph consensus, offering high throughput (10,000 TPS) and low fees. Hedera’s governing council, including Google, IBM, and Boeing, made it a favorite for tokenized assets and supply chain solutions.
        </p>
        <p>
          In the stablecoin space, Paxos Standard (PAX) and Binance USD (BUSD), both launched in 2018, faced regulatory scrutiny. BUSD was shut down in 2023 after the SEC targeted Paxos, its issuer, for unregistered securities. Meanwhile, MakerDAO’s DAI continued to grow, maintaining its decentralized peg through over-collateralization.
        </p>
        <p>
          Pi Network finally launched its open mainnet on February 20, 2025, after years of delays. Pi coins became tradable on exchanges like OKX, Bitget, and CoinDCX, with an initial price surge to $0.50, valuing the network at billions. However, the price dropped to $0.10 within weeks due to profit-taking and lack of a robust dApp ecosystem. Pi’s team announced plans for a developer platform, but adoption remained slow, with many users still holding un-migrated testnet coins.
        </p>
        <p>
          Meme coins continued to thrive. Pepe (PEPE), launched in April 2023, became a top meme coin, driven by the Pepe the Frog meme. PEPE’s market cap hit $1 billion within weeks, though its lack of utility made it highly speculative. Other meme coins like Bonk (BONK) on Solana and Floki Inu (FLOKI) also gained popularity, often tied to NFT and gaming projects.
        </p>
        <p>
          In 2024, Filecoin (FIL), launched in 2017 by Protocol Labs, saw increased adoption for decentralized storage. Filecoin incentivizes users to rent out storage space, competing with centralized providers like Amazon S3. Its integration with IPFS (InterPlanetary File System) made it a key player in Web3.
        </p>
        <p>
          The Graph (GRT), launched in 2020, became essential for Web3, providing indexing and querying for blockchains like Ethereum and Polygon. Known as the Google of Web3, The Graph’s subgraphs powered dApps like Uniswap and Aave, with its GRT token used for staking and governance.
        </p>
        <p>
          Regulatory developments shaped the space. In 2023, the EU passed the Markets in Crypto-Assets (MiCA) regulation, providing a framework for crypto in Europe. The U.S. lagged, but by 2025, the SEC had classified most tokens as securities, except Bitcoin and Ethereum, leading to lawsuits against exchanges like Coinbase and Binance.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Future of Cryptocurrencies: 2025 and Beyond</h2>
        <p>
          As of March 2025, the crypto space is at a crossroads. Bitcoin remains a store of value, often called digital gold, while Ethereum continues to lead in smart contracts and dApps. Layer 1 blockchains like Solana, Cardano, and Avalanche are competing for DeFi and NFT market share, while interoperability projects like Polkadot and Cosmos enable cross-chain innovation.
        </p>
        <p>
          Web3 is driving new use cases, from decentralized social platforms (e.g., Lens Protocol on Polygon) to blockchain gaming (e.g., Axie Infinity, launched in 2018, and newer projects like Illuvium). Decentralized identity solutions, such as those on Hedera and Cardano, aim to give users control over their data.
        </p>
        <p>
          Pi Network’s future hinges on its ability to build a developer ecosystem. While its user base of over 50 million is impressive, the lack of dApps and real-world utility has limited its impact post-mainnet. Competing mobile-first projects like Worldcoin (launched in 2023 by Sam Altman), which uses iris scanning for identity verification, are gaining traction despite privacy concerns.
        </p>
        <p>
          Emerging trends include quantum-resistant blockchains (e.g., QANplatform), AI-blockchain integration (e.g., Fetch.ai and SingularityNET), and tokenized real-world assets (RWAs). Projects like VeChain (launched in 2015) continue to focus on supply chain transparency, while Helium (2019) builds a decentralized IoT network, rewarding users for providing wireless coverage.
        </p>
        <p>
          The crypto space remains a mix of innovation, speculation, and regulation. While established coins like Bitcoin and Ethereum provide stability, new projects push the boundaries of what blockchain can achieve, promising a decentralized future—if they can overcome the challenges of adoption, scalability, and governance.
        </p>
      </section>
    </div>
  );
}