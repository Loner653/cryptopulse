  "use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./quiz.module.css";
import { db } from "../lib/firebase";
import { ref, get, set, onValue } from "firebase/database";


// Glossary Terms (5 per difficulty level, 15 total)
const glossaryTerms = [
  // Beginner (Basics category)
  { term: "Airdrop", def: "Free token distribution to promote a project or reward users.", category: "Basics", related: ["ICO", "Token"] },
    { term: "Ape In", def: "Buying a large amount of crypto impulsively.", category: "Slang", related: ["FOMO", "YOLO"] },
    { term: "Atomicity", def: "Ensuring a transaction is fully completed or not at all.", category: "Tech", related: ["Consistency", "Smart Contract"] },
    { term: "Adoption Barrier", def: "Challenges like regulatory restrictions or technical complexity that hinder widespread cryptocurrency use.", category: "Geopolitical", related: ["Global Adoption", "User Onboarding"] },
    { term: "Airdrop Campaign", def: "A promotional tactic where free tokens are distributed to raise awareness of a crypto project.", category: "Education", related: ["Community Airdrop", "Token Distribution"] },
    { term: "Altcoin Rally", def: "A significant price increase in altcoins, typically during a bullish market trend.", category: "Historical", related: ["Altcoin Season", "Bull Run"] },
    { term: "Anonymity Layer", def: "A blockchain feature that enhances user privacy by obscuring transaction details.", category: "Tech", related: ["Privacy Layer", "Zero-Knowledge"] },
    { term: "Anti-Censorship", def: "The concept of using cryptocurrency to bypass government censorship in financial transactions.", category: "Ethics", related: ["Crypto Freedom", "Decentralization"] },
    { term: "Art DAO", def: "A decentralized autonomous organization that supports artists by facilitating NFT creation and sales.", category: "Cultural", related: ["Blockchain Art", "DAO"] },
    { term: "Avatar NFT", def: "A non-fungible token representing a digital avatar used in metaverse environments.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Bitcoin Halving 2020", def: "The 2020 event that reduced Bitcoin’s block reward to 6.25 BTC, affecting its supply.", category: "Historical", related: ["Halving", "Bitcoin"] },
    { term: "Blockchain Alliance", def: "A coalition of organizations working together to promote blockchain technology adoption.", category: "Education", related: ["Crypto Advocacy", "Community"] },
    { term: "Blockchain Carbon Offset", def: "A system leveraging blockchain to track and offset carbon emissions for sustainability.", category: "Environmental", related: ["Carbon Credit Token", "Sustainability"] },
    { term: "Blockchain Conference", def: "A professional event where blockchain experts network and discuss industry trends.", category: "Education", related: ["Crypto Summit", "Community"] },
    { term: "Blockchain Ethics", def: "The ethical guidelines and principles that shape blockchain development and usage.", category: "Ethics", related: ["Crypto Ethics", "Transparency Ethics"] },
    { term: "Blockchain Festival", def: "A cultural event celebrating the impact and potential of blockchain technology.", category: "Cultural", related: ["Crypto Tourism", "Community"] },
    { term: "Blockchain Transparency", def: "The characteristic of a blockchain where all transactions are publicly visible and verifiable.", category: "Ethics", related: ["Transparency Ethics", "Privacy"] },
    { term: "Carbon Neutral Mining", def: "Crypto mining practices that achieve net-zero carbon emissions through offsets or renewable energy.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "CBDC Adoption", def: "The process of integrating central bank digital currencies into national economies.", category: "Geopolitical", related: ["Central Bank Digital Currency", "Stablecoin"] },
    { term: "CeFi Platform", def: "A centralized finance platform providing cryptocurrency services with traditional oversight.", category: "DeFi", related: ["CeDeFi", "CEX"] },
    { term: "Chainlink Automation", def: "A Chainlink service that automates smart contract functions on a predefined schedule.", category: "Emerging", related: ["Chainlink Keeper", "Automation"] },
    { term: "Charity NFT", def: "A non-fungible token sold to generate funds for charitable initiatives.", category: "Cultural", related: ["Crypto Charity", "NFT"] },
    { term: "Community Building", def: "Efforts to grow and strengthen a crypto project’s user community through engagement activities.", category: "Education", related: ["Community Token", "Engagement"] },
    { term: "Community Hackathon", def: "An event where a crypto community collaborates to develop new projects or solutions.", category: "Education", related: ["Crypto Hackathon", "Community"] },
    { term: "Creator Economy", def: "An economic system where creators use crypto to monetize their content or services.", category: "Cultural", related: ["Web3 Creator", "Social Token"] },
    { term: "Crypto Academy", def: "An educational institution offering structured courses on cryptocurrency and blockchain.", category: "Education", related: ["Blockchain Education", "Learning"] },
    { term: "Crypto Adoption Curve", def: "A model showing the stages of cryptocurrency acceptance across society over time.", category: "Geopolitical", related: ["Adoption Rate", "Mainstream Adoption"] },
    { term: "Crypto Art Festival", def: "A festival showcasing blockchain-based art, often featuring NFTs.", category: "Cultural", related: ["Blockchain Art", "NFT"] },
    { term: "Crypto Awareness", def: "Initiatives aimed at educating the public about the benefits and risks of cryptocurrencies.", category: "Education", related: ["Crypto Advocacy", "Education"] },
    { term: "Crypto Blackout", def: "A period when government restrictions limit access to cryptocurrency services.", category: "Geopolitical", related: ["Crypto Ban", "Regulatory Crackdown"] },
    { term: "Crypto Community Fund", def: "A community-managed fund to support crypto projects and initiatives.", category: "Education", related: ["Ecosystem Fund", "Community"] },
    { term: "Crypto Crash 2018", def: "The 2018 bear market that followed the 2017 ICO boom, causing significant price drops.", category: "Historical", related: ["Crypto Winter", "Market Cycle"] },
    { term: "Crypto Creator", def: "An individual who creates digital content or assets using cryptocurrency tools.", category: "Cultural", related: ["Decentralized Creator", "NFT"] },
    { term: "Crypto Curriculum", def: "A structured set of educational materials focused on cryptocurrency topics.", category: "Education", related: ["Crypto Academy", "Learning"] },
    { term: "Crypto Diplomacy", def: "The use of cryptocurrency to enhance international economic relationships.", category: "Geopolitical", related: ["Crypto Sanctions", "Cross-Border Payment"] },
    { term: "Crypto Education Platform", def: "An online platform providing resources for learning about cryptocurrencies.", category: "Education", related: ["Blockchain Education", "Learning"] },
    { term: "Crypto Energy Debate", def: "The ongoing discussion about the environmental impact of cryptocurrency energy consumption.", category: "Environmental", related: ["PoW Energy Debate", "Green Mining"] },
    { term: "Crypto Event", def: "A gathering focused on cryptocurrency education, networking, and collaboration.", category: "Education", related: ["Crypto Meetup", "Community"] },
    { term: "Crypto Exchange License", def: "A government-issued permit required to operate a cryptocurrency trading platform.", category: "Regulation", related: ["Compliance", "CEX"] },
    { term: "Crypto Expo", def: "A large-scale event showcasing cryptocurrency projects and innovations.", category: "Education", related: ["Crypto Summit", "Community"] },
    { term: "Crypto Fairness", def: "The principle of ensuring equal access and opportunities within cryptocurrency systems.", category: "Ethics", related: ["Fairness Protocol", "Decentralization"] },
    { term: "Crypto Festival", def: "A cultural celebration highlighting the impact of cryptocurrency and blockchain.", category: "Cultural", related: ["Blockchain Festival", "Community"] },
    { term: "Crypto Fundraiser", def: "A campaign that raises cryptocurrency to support a specific cause or project.", category: "Cultural", related: ["Crypto Charity", "Philanthropy"] },
    { term: "Crypto Gamer", def: "An individual who plays games that offer cryptocurrency-based rewards.", category: "Gaming", related: ["Crypto Gaming", "Play-to-Earn"] },
    { term: "Crypto Hub", def: "A geographic area known for significant cryptocurrency activity and innovation.", category: "Geopolitical", related: ["Crypto Migration", "Adoption"] },
    { term: "Crypto Learning", def: "The act of acquiring knowledge about cryptocurrencies and their applications.", category: "Education", related: ["Blockchain Education", "Learning"] },
    { term: "Crypto Legislation", def: "Laws and regulations specifically designed to govern cryptocurrency activities.", category: "Regulation", related: ["Crypto Regulation", "Compliance"] },
    { term: "Crypto Literacy", def: "The degree of understanding individuals have about cryptocurrencies and blockchain.", category: "Education", related: ["Crypto Awareness", "Education"] },
    { term: "Crypto Market Crash", def: "A sudden and severe decline in cryptocurrency prices across the market.", category: "Historical", related: ["Crypto Crash 2018", "Bear Market"] },
    { term: "Crypto Meetup Group", def: "A local group that organizes regular gatherings for cryptocurrency enthusiasts.", category: "Education", related: ["Crypto Meetup", "Community"] },
    { term: "Crypto Mining Tax", def: "A tax levied on the profits generated from cryptocurrency mining activities.", category: "Regulation", related: ["Crypto Tax", "Mining"] },
    { term: "Crypto Movement", def: "The global effort to promote cryptocurrency adoption and decentralization.", category: "Cultural", related: ["Crypto Ideology", "Community"] },
    { term: "Crypto Narrative", def: "The overarching story or theme that drives interest and adoption in cryptocurrencies.", category: "Cultural", related: ["Crypto Culture", "Hype"] },
    { term: "Crypto News", def: "Media platforms or outlets dedicated to covering cryptocurrency developments.", category: "Education", related: ["Community", "Education"] },
    { term: "Crypto Podcast", def: "A podcast series that explores cryptocurrency trends, news, and insights.", category: "Education", related: ["Crypto News", "Education"] },
    { term: "Crypto Policy", def: "Government policies that influence the development and use of cryptocurrencies.", category: "Geopolitical", related: ["Crypto Legislation", "Regulation"] },
    { term: "Crypto Privacy", def: "The use of cryptocurrencies to ensure user privacy during financial transactions.", category: "Ethics", related: ["Privacy Ethics", "Anonymity"] },
    { term: "Crypto Protest", def: "The use of cryptocurrency to fund or organize protests against centralized authority.", category: "Cultural", related: ["Activist Funding", "Anti-Censorship"] },
    { term: "Crypto Regulation Debate", def: "The ongoing debate about the best ways to regulate the cryptocurrency industry.", category: "Ethics", related: ["Crypto Regulation", "Compliance"] },
    { term: "Crypto Remittance", def: "The use of cryptocurrency for cost-effective international money transfers.", category: "Geopolitical", related: ["Cross-Border Payment", "Financial Inclusion"] },
    { term: "Crypto Research", def: "Academic or independent studies focused on cryptocurrency technologies and impacts.", category: "Education", related: ["Blockchain Education", "Learning"] },
    { term: "Crypto Resistance", def: "The use of cryptocurrency to challenge centralized financial systems and control.", category: "Ethics", related: ["Crypto Freedom", "Anti-Censorship"] },
    { term: "Crypto Retreat", def: "A recreational event where crypto enthusiasts gather to network and relax.", category: "Cultural", related: ["Crypto Tourism", "Community"] },
    { term: "Crypto Revolution", def: "The transformative effect of cryptocurrency on global financial systems.", category: "Cultural", related: ["Crypto Movement", "Adoption"] },
    { term: "Crypto Safe Haven", def: "A region with favorable laws and conditions for cryptocurrency activities.", category: "Geopolitical", related: ["Crypto Hub", "Regulatory Arbitrage"] },
    { term: "Crypto Scholarship", def: "A financial grant for students pursuing studies in blockchain or cryptocurrency.", category: "Education", related: ["Crypto Academy", "Learning"] },
    { term: "Crypto Social Impact", def: "The positive societal changes resulting from cryptocurrency adoption.", category: "Cultural", related: ["Crypto Philanthropy", "Financial Inclusion"] },
    { term: "Crypto Staking Tax", def: "A tax imposed on the profits earned from staking cryptocurrency rewards.", category: "Regulation", related: ["Crypto Tax", "Staking"] },
    { term: "Crypto Storytelling", def: "The use of compelling narratives to promote cryptocurrency projects or concepts.", category: "Cultural", related: ["Crypto Narrative", "Marketing"] },
    { term: "Crypto Tax Haven", def: "A country offering favorable tax conditions for cryptocurrency investors.", category: "Geopolitical", related: ["Crypto Safe Haven", "Tax"] },
    { term: "Crypto Trading Tax", def: "A tax applied to profits made from cryptocurrency trading activities.", category: "Regulation", related: ["Crypto Tax", "Capital Gains Tax"] },
    { term: "Crypto Transparency", def: "The open and verifiable nature of cryptocurrency transactions and operations.", category: "Ethics", related: ["Blockchain Transparency", "Privacy"] },
    { term: "Crypto Travel", def: "The use of cryptocurrency to pay for travel-related services and experiences.", category: "Cultural", related: ["Crypto Tourism", "Adoption"] },
    { term: "Crypto University", def: "A higher education institution offering courses on cryptocurrency and blockchain.", category: "Education", related: ["Crypto Academy", "Learning"] },
    { term: "Crypto Visionary", def: "A thought leader or innovator driving the future of the cryptocurrency industry.", category: "Cultural", related: ["Crypto Evangelist", "Community"] },
    { term: "Crypto Webinar", def: "An online seminar focused on educating participants about cryptocurrency topics.", category: "Education", related: ["Crypto Education Platform", "Learning"] },
    { term: "Crypto Workshop", def: "A hands-on training session teaching practical cryptocurrency skills.", category: "Education", related: ["Crypto Education Platform", "Learning"] },
    { term: "DApp Ecosystem", def: "A network of decentralized applications built on a single blockchain platform.", category: "Emerging", related: ["Web3", "DApp"] },
    { term: "Data Tokenization", def: "The process of converting data into tokens for secure sharing on a blockchain.", category: "Emerging", related: ["Tokenization", "Privacy"] },
    { term: "Decentralized Charity", def: "A charitable organization operating on a blockchain to ensure transparency.", category: "Cultural", related: ["Charity DAO", "Crypto Charity"] },
    { term: "Decentralized Education", def: "Educational systems using blockchain to manage credentials and learning records.", category: "Education", related: ["Learning DAO", "Blockchain Education"] },
    { term: "Decentralized Gaming", def: "Blockchain-based games where players own and trade in-game assets.", category: "Gaming", related: ["Web3 Gaming", "GameFi"] },
    { term: "Decentralized Media", def: "Media platforms built on blockchain that prioritize user control and ownership.", category: "Emerging", related: ["Decentralized Social", "Web3"] },
    { term: "DeFi Adoption", def: "The increasing acceptance and use of decentralized finance protocols.", category: "Emerging", related: ["DeFi", "Adoption"] },
    { term: "DeFi Community", def: "A group of users and developers engaged in decentralized finance projects.", category: "Education", related: ["Community", "DeFi"] },
    { term: "DeFi Crash", def: "A sharp decline in DeFi token prices or total value locked in protocols.", category: "Historical", related: ["DeFi Bubble", "Market Crash"] },
    { term: "DeFi Innovation", def: "New advancements and features introduced in decentralized finance protocols.", category: "Emerging", related: ["DeFi 2.0", "DeFi"] },
    { term: "DeFi Regulation", def: "Government regulations specifically targeting decentralized finance activities.", category: "Regulation", related: ["Crypto Regulation", "Compliance"] },
    { term: "Digital Art Boom", def: "The rapid rise in popularity of blockchain-based digital art sales.", category: "Historical", related: ["NFT Boom", "Crypto Art Boom"] },
    { term: "Digital Art Community", def: "A community of artists and collectors focused on blockchain-based digital art.", category: "Cultural", related: ["NFT Community", "Blockchain Art"] },
    { term: "Digital Art Festival", def: "An event celebrating digital art created and sold on blockchain platforms.", category: "Cultural", related: ["Crypto Art Festival", "NFT"] },
    { term: "Digital Collectible Boom", def: "The 2021 surge in popularity of digital collectibles sold as NFTs.", category: "Historical", related: ["NFT Boom", "Digital Art Boom"] },
    { term: "Digital Economy", def: "An economy powered by digital assets and blockchain technology.", category: "Emerging", related: ["Web3", "Metaverse Economy"] },
    { term: "Digital Rights", def: "The rights of users to control and manage their digital assets on a blockchain.", category: "Ethics", related: ["Data Sovereignty", "Privacy"] },
    { term: "Eco-Conscious Mining", def: "Cryptocurrency mining practices designed to minimize environmental impact.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Economic Freedom", def: "The ability to achieve financial independence through cryptocurrency usage.", category: "Ethics", related: ["Financial Sovereignty", "Crypto Freedom"] },
    { term: "Education NFT", def: "A non-fungible token that certifies the completion of an educational program.", category: "Education", related: ["Decentralized Education", "NFT"] },
    { term: "Energy Consumption Debate", def: "The debate over the environmental impact of blockchain energy usage.", category: "Environmental", related: ["Crypto Energy Debate", "Green Mining"] },
    { term: "Environmental DAO", def: "A decentralized autonomous organization dedicated to environmental initiatives.", category: "Environmental", related: ["Sustainability Token", "DAO"] },
    { term: "Environmental NFT", def: "A non-fungible token created to support environmental causes or awareness.", category: "Environmental", related: ["Charity NFT", "Sustainability"] },
    { term: "Ethereum Gas Crisis", def: "The 2021 period when Ethereum gas fees reached extremely high levels.", category: "Historical", related: ["Gas Fee Spike", "Ethereum"] },
    { term: "Ethical Blockchain", def: "A blockchain developed with ethical considerations like fairness and transparency.", category: "Ethics", related: ["Blockchain Ethics", "Fairness Protocol"] },
    { term: "Ethical DeFi", def: "Decentralized finance protocols that prioritize fairness and ethical practices.", category: "Ethics", related: ["DeFi Ethics", "Transparency"] },
    { term: "Ethical Investing", def: "Investing in cryptocurrency projects that promote positive social or environmental impact.", category: "Ethics", related: ["Crypto Social Impact", "Philanthropy"] },
    { term: "Fiat Devaluation", def: "The decline in fiat currency value, often driving interest in cryptocurrencies.", category: "Geopolitical", related: ["Fiat Inflation", "Inflation Hedge"] },
    { term: "GameFi Boom", def: "The 2021 surge in GameFi projects, focusing on play-to-earn gaming models.", category: "Historical", related: ["Play-to-Earn Boom", "GameFi"] },
    { term: "GameFi Community", def: "A community of users and developers engaged in GameFi projects and ecosystems.", category: "Gaming", related: ["Gaming DAO", "GameFi"] },
    { term: "GameFi Token", def: "A token used within GameFi ecosystems for in-game rewards and transactions.", category: "Gaming", related: ["Gaming Token", "GameFi"] },
    { term: "Gaming Community", def: "A group of players participating in blockchain-based gaming ecosystems.", category: "Gaming", related: ["Crypto Gamer", "GameFi"] },
    { term: "Gaming Ecosystem", def: "A blockchain-based platform that supports gaming activities and asset ownership.", category: "Gaming", related: ["Decentralized Gaming", "GameFi"] },
    { term: "Gaming NFT", def: "A non-fungible token used in gaming ecosystems for assets or rewards.", category: "Gaming", related: ["NFT Gaming", "GameFi"] },
    { term: "Global Crypto Policy", def: "International policies that shape the global cryptocurrency landscape.", category: "Geopolitical", related: ["Crypto Policy", "Global Regulation"] },
    { term: "Green Crypto", def: "Cryptocurrencies designed with a focus on environmental sustainability.", category: "Environmental", related: ["Green Blockchain", "Sustainability"] },
    { term: "Green DeFi", def: "Decentralized finance protocols that emphasize environmental sustainability.", category: "Environmental", related: ["Ethical DeFi", "Sustainability"] },
    { term: "Green NFT", def: "A non-fungible token created with minimal environmental impact.", category: "Environmental", related: ["Environmental NFT", "Sustainability"] },
    { term: "HODL Meme", def: "A popular meme encouraging long-term holding of cryptocurrencies.", category: "Cultural", related: ["HODL Culture", "Slang"] },
    { term: "ICO Crash", def: "The 2018 decline in Initial Coin Offering popularity due to regulatory actions.", category: "Historical", related: ["ICO Boom", "Crypto Crash 2018"] },
    { term: "In-Game NFT", def: "A non-fungible token representing an in-game asset or collectible.", category: "Gaming", related: ["Gaming NFT", "GameFi"] },
    { term: "Learning Community", def: "A group dedicated to sharing knowledge and resources about cryptocurrencies.", category: "Education", related: ["Learning DAO", "Community"] },
    { term: "Learning Token", def: "A token that rewards users for achieving educational milestones.", category: "Education", related: ["Education Token", "Incentive"] },
    { term: "Market Sentiment Analysis", def: "The study of public sentiment to forecast cryptocurrency market trends.", category: "Trading", related: ["Market Sentiment", "TA"] },
    { term: "Metaverse Art", def: "Digital art created specifically for display within metaverse environments.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Metaverse Community", def: "A group of users actively participating in metaverse activities and events.", category: "Gaming", related: ["Metaverse", "Community"] },
    { term: "Metaverse Event", def: "A virtual event hosted in the metaverse, often using cryptocurrency for access.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Metaverse Gaming", def: "Games integrated into the metaverse with cryptocurrency-based economies.", category: "Gaming", related: ["Metaverse", "GameFi"] },
    { term: "Mining Community", def: "A group of cryptocurrency miners who collaborate or share resources.", category: "Education", related: ["Mining Pool", "Community"] },
    { term: "Mining Regulation", def: "Government regulations aimed at controlling cryptocurrency mining operations.", category: "Regulation", related: ["Mining Ban", "Compliance"] },
    { term: "NFT Art Community", def: "A community of artists and collectors focused on NFT-based art.", category: "Cultural", related: ["Digital Art Community", "NFT"] },
    { term: "NFT Art Festival", def: "An event showcasing NFT art and digital collectibles to the public.", category: "Cultural", related: ["Digital Art Festival", "NFT"] },
    { term: "NFT Charity Auction", def: "An auction of NFTs where proceeds are donated to charitable causes.", category: "Cultural", related: ["Charity NFT", "Crypto Charity"] },
    { term: "NFT Creator Community", def: "A group of creators working together on NFT projects and initiatives.", category: "Cultural", related: ["NFT Creator", "Community"] },
    { term: "NFT Ethics Debate", def: "The debate over the ethical implications of NFTs, including environmental concerns.", category: "Ethics", related: ["NFT Ethics", "Environmental"] },
    { term: "NFT Gaming Community", def: "A community of gamers using NFTs within gaming ecosystems.", category: "Gaming", related: ["Gaming Community", "NFT"] },
    { term: "NFT Regulation", def: "Government regulations targeting the creation, sale, and use of NFTs.", category: "Regulation", related: ["Crypto Regulation", "Compliance"] },
    { term: "Non-Custodial Wallet", def: "A cryptocurrency wallet where the user retains control of their private keys.", category: "Tech", related: ["Self-Custody", "Wallet"] },
    { term: "On-Chain Education", def: "Educational content or credentials recorded and verified on a blockchain.", category: "Education", related: ["Decentralized Education", "NFT"] },
    { term: "Open Source Ethics", def: "The ethical principles guiding open-source development in the crypto space.", category: "Ethics", related: ["Blockchain Ethics", "Transparency"] },
    { term: "P2P Gaming", def: "Peer-to-peer gaming on blockchain platforms with player-owned assets.", category: "Gaming", related: ["Decentralized Gaming", "GameFi"] },
    { term: "Philanthropy DAO", def: "A decentralized autonomous organization focused on charitable giving and support.", category: "Cultural", related: ["Charity DAO", "Crypto Charity"] },
    { term: "Play-to-Earn Community", def: "A community of players participating in play-to-earn gaming models.", category: "Gaming", related: ["Crypto Gamer", "GameFi"] },
    { term: "Play-to-Earn Token", def: "A token earned by players through participation in play-to-earn games.", category: "Gaming", related: ["GameFi Token", "Play-to-Earn"] },
    { term: "Privacy Coin Ban", def: "A government ban on cryptocurrencies designed to enhance user privacy.", category: "Regulation", related: ["Crypto Ban", "Privacy"] },
    { term: "Privacy Debate", def: "The debate over balancing privacy and transparency in cryptocurrency systems.", category: "Ethics", related: ["Privacy Ethics", "Regulation"] },
    { term: "Proof of Learning", def: "A system that rewards users with tokens for completing educational tasks.", category: "Education", related: ["Learning Token", "Incentive"] },
    { term: "Proof of Sustainability", def: "A mechanism to verify the environmental sustainability of a blockchain.", category: "Environmental", related: ["Green Blockchain", "Sustainability"] },
    { term: "Regulatory Compliance", def: "The adherence to government regulations in cryptocurrency operations.", category: "Regulation", related: ["Crypto Compliance", "AML"] },
    { term: "Renewable Energy Mining", def: "Cryptocurrency mining that utilizes renewable energy to reduce environmental impact.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Social Impact DAO", def: "A decentralized autonomous organization focused on creating positive social change.", category: "Cultural", related: ["Charity DAO", "Crypto Social Impact"] },
    { term: "Social Impact NFT", def: "A non-fungible token designed to support social causes or raise awareness.", category: "Cultural", related: ["Charity NFT", "Crypto Social Impact"] },
    { term: "Stablecoin Adoption", def: "The increasing use of stablecoins for payments and decentralized finance applications.", category: "Emerging", related: ["Stablecoin", "Adoption"] },
    { term: "Sustainability DAO", def: "A decentralized autonomous organization promoting environmental sustainability efforts.", category: "Environmental", related: ["Environmental DAO", "Sustainability"] },
    { term: "Sustainability Debate", def: "The discussion on how to make cryptocurrency more environmentally sustainable.", category: "Environmental", related: ["Crypto Energy Debate", "Green Mining"] },
    { term: "Tokenized Education", def: "The use of tokens to incentivize or certify educational achievements on a blockchain.", category: "Education", related: ["Education NFT", "Learning Token"] },
    { term: "Tokenized Gaming", def: "Games that use tokens to create in-game economies and reward systems.", category: "Gaming", related: ["GameFi", "Gaming Token"] },
    { term: "Transparency Debate", def: "The debate over balancing transparency and privacy in cryptocurrency systems.", category: "Ethics", related: ["Transparency Ethics", "Privacy"] },
    { term: "Virtual Art Gallery", def: "A digital space in the metaverse for displaying blockchain-based art.", category: "Gaming", related: ["Metaverse Art", "NFT"] },
    { term: "Virtual Event Token", def: "A token that grants access to virtual events hosted in the metaverse.", category: "Gaming", related: ["Metaverse Event", "NFT"] },
    { term: "Web3 Art", def: "Art created and traded using Web3 technologies, often as NFTs.", category: "Cultural", related: ["Metaverse Art", "NFT"] },
    { term: "Web3 Community Fund", def: "A fund managed by a Web3 community to support projects and initiatives.", category: "Education", related: ["Community Fund", "Web3"] },
    { term: "Web3 DAO", def: "A decentralized autonomous organization built on Web3 principles and technologies.", category: "Emerging", related: ["DAO", "Web3"] },
    { term: "Web3 DeFi", def: "Decentralized finance protocols integrated with Web3 for enhanced user control.", category: "Emerging", related: ["DeFi", "Web3"] },
    { term: "Web3 Gaming Community", def: "A community of gamers participating in Web3-based gaming ecosystems.", category: "Gaming", related: ["Gaming Community", "Web3 Gaming"] },
    { term: "Web3 Innovation", def: "New advancements and applications in Web3 technologies.", category: "Emerging", related: ["Web3", "DApp"] },
    { term: "Web3 Learning", def: "Educational resources focused on teaching Web3 concepts and technologies.", category: "Education", related: ["Web3 Education", "Learning"] },
    { term: "Web3 NFT", def: "A non-fungible token created and traded within a Web3 ecosystem.", category: "Emerging", related: ["NFT", "Web3"] },
    { term: "Web3 Social Community", def: "A community of users engaging on Web3-based social platforms.", category: "Cultural", related: ["Web3 Social", "Community"] },
    { term: "Web3 Token", def: "A token used within a Web3 ecosystem for transactions or governance.", category: "Emerging", related: ["Social Token", "Web3"] },
    { term: "Activist Funding", def: "Using crypto to anonymously fund social or political movements.", category: "Cultural", related: ["Crypto Charity", "Anonymity"] },
    { term: "AI Blockchain", def: "A blockchain integrated with AI for smart contract automation.", category: "Emerging Trends", related: ["Web3", "Automation"] },
    { term: "Altcoin Season", def: "A period when altcoins outperform Bitcoin in price growth.", category: "Historical", related: ["Bull Run", "Market Cycle"] },
    { term: "Anonymity Debate", def: "The ethical discussion around crypto’s role in enabling anonymous transactions.", category: "Ethics", related: ["Privacy", "Regulation"] },
    { term: "Art Tokenization", def: "Converting physical or digital art into tokens for fractional ownership.", category: "Cultural", related: ["NFT", "Tokenization"] },
    { term: "ASIC Resistance", def: "Designing a blockchain to prevent mining dominance by ASIC hardware.", category: "Tech", related: ["Mining", "Fairness"] },
    { term: "Avatar Economy", def: "A virtual economy in the metaverse using crypto for avatar assets.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Bear Market Rally", def: "A temporary price increase during a broader downtrend.", category: "Trading", related: ["Bear Market", "Rally"] },
    { term: "Bitcoin Pizza Day", def: "May 22, 2010, when Bitcoin was first used to buy pizza.", category: "Historical", related: ["Satoshi Era", "Adoption"] },
    { term: "Blockchain Activism", def: "Using blockchain to promote transparency in social movements.", category: "Cultural", related: ["Activist Funding", "Transparency"] },
    { term: "Blockchain Agnostic", def: "A system or protocol that works across multiple blockchains.", category: "Tech", related: ["Chain Agnostic", "Interoperability"] },
    { term: "Blockchain Art", def: "Digital art created and sold on a blockchain, often as NFTs.", category: "Cultural", related: ["NFT", "Art Tokenization"] },
    { term: "Blockchain Education", def: "Programs teaching blockchain technology and crypto concepts.", category: "Education", related: ["Crypto Bootcamp", "Learning"] },
    { term: "Blockchain Voting", def: "Using blockchain for secure, transparent voting systems.", category: "Cultural", related: ["Transparency", "Governance"] },
    { term: "Bull Run 2017", def: "The 2017 crypto market surge driven by ICO hype.", category: "Historical", related: ["ICO Boom", "Market Cycle"] },
    { term: "Carbon Credit Token", def: "A token representing carbon credits for environmental sustainability.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Carbon Footprint", def: "The environmental impact of a blockchain’s energy consumption.", category: "Environmental", related: ["Energy Consumption", "Green Mining"] },
    { term: "CeDeFi", def: "Centralized Decentralized Finance; a hybrid of CeFi and DeFi models.", category: "DeFi", related: ["CeFi", "DeFi"] },
    { term: "Central Bank Digital Currency", def: "A government-backed digital currency on a blockchain.", category: "Geopolitical", related: ["CBDC", "Stablecoin"] },
    { term: "Chain Split Drama", def: "Community conflicts leading to a blockchain fork.", category: "Historical", related: ["Hard Fork", "Governance"] },
    { term: "Charity DAO", def: "A decentralized organization focused on charitable initiatives.", category: "Cultural", related: ["Crypto Charity", "DAO"] },
    { term: "Community Airdrop", def: "Distributing tokens to a project’s community to boost engagement.", category: "Education", related: ["Airdrop", "Community"] },
    { term: "Community Consensus", def: "Agreement among a crypto community on protocol changes.", category: "Education", related: ["Governance", "DAO"] },
    { term: "Community Tokenomics", def: "A token model designed to reward community participation.", category: "DeFi", related: ["Tokenomics", "Incentive"] },
    { term: "Crypto Adoption Index", def: "A metric measuring the global adoption of cryptocurrencies.", category: "Geopolitical", related: ["Adoption Rate", "Mainstream"] },
    { term: "Crypto Advocacy", def: "Promoting crypto’s benefits to influence policy and adoption.", category: "Cultural", related: ["Blockchain Activism", "Education"] },
    { term: "Crypto Art Boom", def: "The 2021 surge in NFT art sales and popularity.", category: "Historical", related: ["NFT", "Bull Run"] },
    { term: "Crypto Bootcamp", def: "An intensive training program for learning crypto and blockchain.", category: "Education", related: ["Blockchain Education", "Learning"] },
    { term: "Crypto Charity", def: "Donating crypto to support charitable causes.", category: "Cultural", related: ["Activist Funding", "Philanthropy"] },
    { term: "Crypto Culture", def: "The shared values, slang, and practices of the crypto community.", category: "Cultural", related: ["Crypto Native", "Slang"] },
    { term: "Crypto ETF", def: "An exchange-traded fund tracking crypto prices.", category: "Trading", related: ["Grayscale", "Institutional Investor"] },
    { term: "Crypto Ethics", def: "The moral principles guiding crypto development and use.", category: "Ethics", related: ["Anonymity Debate", "Regulation"] },
    { term: "Crypto Evangelist", def: "A person passionately promoting crypto adoption.", category: "Cultural", related: ["Crypto Advocacy", "Community"] },
    { term: "Crypto Exchange Ban", def: "A government prohibition on crypto trading platforms.", category: "Geopolitical", related: ["Crypto Ban", "Regulation"] },
    { term: "Crypto Forum", def: "An online platform for crypto enthusiasts to discuss ideas.", category: "Education", related: ["Community", "Education"] },
    { term: "Crypto Freedom", def: "The idea of using crypto to achieve financial independence.", category: "Ethics", related: ["Anarcho-Capitalism", "Decentralization"] },
    { term: "Crypto Gaming", def: "Games integrating crypto for in-game economies and rewards.", category: "Gaming", related: ["Play-to-Earn", "NFT"] },
    { term: "Crypto Hackathon", def: "An event where developers build blockchain projects.", category: "Education", related: ["Blockchain Education", "Community"] },
    { term: "Crypto Ideology", def: "The belief system driving the crypto movement, often anti-centralization.", category: "Ethics", related: ["Crypto Freedom", "Decentralization"] },
    { term: "Crypto Influencer", def: "A person with a large following who impacts crypto trends.", category: "Cultural", related: ["Shill", "Community"] },
    { term: "Crypto Meetup", def: "A local gathering of crypto enthusiasts to network and learn.", category: "Education", related: ["Community", "Education"] },
    { term: "Crypto Migration", def: "Moving crypto operations to regions with favorable regulations.", category: "Geopolitical", related: ["Regulatory Arbitrage", "Global Regulation"] },
    { term: "Crypto Philanthropy", def: "Using crypto to fund charitable initiatives globally.", category: "Cultural", related: ["Crypto Charity", "Philanthropy"] },
    { term: "Crypto Sanctions", def: "Using crypto to bypass international economic sanctions.", category: "Geopolitical", related: ["Cross-Border Payment", "Regulation"] },
    { term: "Crypto Subculture", def: "A niche group within the crypto community with shared interests.", category: "Cultural", related: ["Crypto Culture", "Community"] },
    { term: "Crypto Summit", def: "A conference for crypto professionals to discuss trends.", category: "Education", related: ["Community", "Education"] },
    { term: "Crypto Tourism", def: "Traveling to crypto-friendly regions for events or investment.", category: "Cultural", related: ["Crypto Migration", "Adoption"] },
    { term: "Crypto Utopia", def: "The idealistic vision of a world powered by decentralized finance.", category: "Ethics", related: ["Crypto Ideology", "Decentralization"] },
    { term: "DAO Democracy", def: "A governance model where token holders vote on decisions.", category: "Ethics", related: ["Decentralized Governance", "DAO"] },
    { term: "DAO Hack 2016", def: "The 2016 exploit of The DAO, leading to Ethereum’s hard fork.", category: "Historical", related: ["Ethereum Classic", "Hard Fork"] },
    { term: "Dark Pool NFT", def: "A private marketplace for high-value NFT trades.", category: "Gaming", related: ["Dark Pool", "NFT"] },
    { term: "Data Sovereignty", def: "The concept of users controlling their data via blockchain.", category: "Ethics", related: ["Self-Sovereign Identity", "Privacy"] },
    { term: "Decentralized AI", def: "AI systems running on a blockchain for transparency.", category: "Emerging Trends", related: ["AI Blockchain", "Web3"] },
    { term: "Decentralized Creator", def: "A content creator using blockchain to monetize work.", category: "Cultural", related: ["NFT", "Web3"] },
    { term: "Decentralized Social", def: "A social media platform built on a blockchain for user control.", category: "Emerging Trends", related: ["Web3", "Social Media"] },
    { term: "DeFi 2.0", def: "The next generation of DeFi with improved scalability and features.", category: "Emerging Trends", related: ["DeFi", "Scalability"] },
    { term: "DeFi Bubble", def: "The 2020-2021 hype cycle leading to inflated DeFi valuations.", category: "Historical", related: ["DeFi", "Market Cycle"] },
    { term: "DeFi Education", def: "Resources teaching users about decentralized finance.", category: "Education", related: ["Blockchain Education", "DeFi"] },
    { term: "DeFi Ethics", def: "The moral considerations in developing DeFi protocols.", category: "Ethics", related: ["Crypto Ethics", "Regulation"] },
    { term: "DeFi Summer", def: "The 2020 boom in DeFi projects and yield farming.", category: "Historical", related: ["Yield Farming", "DeFi Bubble"] },
    { term: "Digital Art Market", def: "A marketplace for buying and selling blockchain-based art.", category: "Cultural", related: ["NFT", "Blockchain Art"] },
    { term: "Digital Identity", def: "A blockchain-based identity system for secure verification.", category: "Emerging Trends", related: ["Self-Sovereign Identity", "Privacy"] },{ term: "Distributed Ledger", def: "A database shared across multiple nodes for transparency.", category: "Tech", related: ["Blockchain", "Decentralization"] },
    { term: "Dynamic NFT", def: "An NFT that changes based on external conditions or data.", category: "Gaming", related: ["NFT", "Metaverse"] },
    { term: "Eco-Friendly Blockchain", def: "A blockchain designed to minimize environmental impact.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Economic Sanctions", def: "Government restrictions impacting crypto usage.", category: "Geopolitical", related: ["Crypto Sanctions", "Regulation"] },
    { term: "Education Token", def: "A token rewarding users for completing educational tasks.", category: "Education", related: ["Blockchain Education", "Incentive"] },
    { term: "Energy Consumption", def: "The amount of electricity used by a blockchain network.", category: "Environmental", related: ["Carbon Footprint", "Mining"] },
    { term: "Energy-Efficient Mining", def: "Mining practices that reduce electricity usage.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Ethereum Classic", def: "The original Ethereum chain after the 2016 DAO hack fork.", category: "Historical", related: ["DAO Hack 2016", "Hard Fork"] },
    { term: "Ethereum Merge", def: "The 2022 transition of Ethereum to Proof of Stake.", category: "Historical", related: ["Proof of Stake", "Ethereum"] },
    { term: "Ethical Mining", def: "Mining practices that prioritize sustainability and fairness.", category: "Environmental", related: ["Green Mining", "Ethics"] },
    { term: "Fairness Protocol", def: "A blockchain system ensuring equitable access and rewards.", category: "Ethics", related: ["ASIC Resistance", "Decentralization"] },
    { term: "Fiat Inflation", def: "The devaluation of fiat currency driving crypto adoption.", category: "Geopolitical", related: ["Inflation Hedge", "Store of Value"] },
    { term: "Financial Sovereignty", def: "Using crypto to gain control over personal finances.", category: "Ethics", related: ["Crypto Freedom", "Decentralization"] },
    { term: "GameFi", def: "A sector combining gaming and DeFi for play-to-earn models.", category: "Gaming", related: ["Play-to-Earn", "NFT"] },
    { term: "Gaming DAO", def: "A decentralized organization managing a gaming ecosystem.", category: "Gaming", related: ["DAO", "GameFi"] },
    { term: "Gaming Token", def: "A token used within a gaming ecosystem for transactions.", category: "Gaming", related: ["GameFi", "NFT"] },
    { term: "Gas Fee Spike", def: "A sudden increase in Ethereum transaction fees due to demand.", category: "Tech", related: ["Gas Price", "Network Congestion"] },
    { term: "Global Adoption", def: "The worldwide acceptance and use of cryptocurrencies.", category: "Geopolitical", related: ["Crypto Adoption Index", "Mainstream"] },
    { term: "Global South Adoption", def: "The growing use of crypto in developing regions.", category: "Geopolitical", related: ["Financial Inclusion", "Remittance"] },
    { term: "Green Blockchain", def: "A blockchain using renewable energy to reduce its carbon footprint.", category: "Environmental", related: ["Eco-Friendly Blockchain", "Sustainability"] },
    { term: "Green Mining", def: "Mining crypto using renewable energy sources.", category: "Environmental", related: ["Energy-Efficient Mining", "Sustainability"] },
    { term: "HODL Culture", def: "The community practice of holding crypto long-term.", category: "Cultural", related: ["HODL", "Crypto Culture"] },
    { term: "ICO Boom", def: "The 2017-2018 surge in Initial Coin Offerings.", category: "Historical", related: ["Bull Run 2017", "ICO"] },
    { term: "In-Game Currency", def: "A crypto token used for transactions within a game.", category: "Gaming", related: ["Gaming Token", "GameFi"] },
    { term: "Incentive Design", def: "Creating rewards to encourage desired behavior in a network.", category: "Tech", related: ["Incentive Mechanism", "Game Theory"] },
    { term: "Inflation Resistance", def: "A crypto’s ability to maintain value during economic inflation.", category: "Geopolitical", related: ["Inflation Hedge", "Store of Value"] },
    { term: "Institutional Adoption", def: "The integration of crypto by large financial institutions.", category: "Geopolitical", related: ["Institutional Investor", "Crypto ETF"] },
    { term: "Interoperability Standard", def: "A protocol enabling seamless blockchain interactions.", category: "Emerging Trends", related: ["Cross-Chain", "Interoperability"] },
    { term: "L1 Blockchain", def: "A base-layer blockchain like Bitcoin or Ethereum.", category: "Tech", related: ["Layer 1", "Settlement Layer"] },
    { term: "L2 Adoption", def: "The growing use of Layer 2 solutions for scalability.", category: "Emerging Trends", related: ["Layer 2", "Scalability"] },
    { term: "Learning DAO", def: "A decentralized organization focused on education and knowledge sharing.", category: "Education", related: ["DAO", "Blockchain Education"] },
    { term: "Liquidity Farming", def: "Providing liquidity to a pool to earn token rewards.", category: "DeFi", related: ["Yield Farming", "Liquidity Pool"] },
    { term: "Market Cycle", def: "The repeating pattern of bull and bear markets in crypto.", category: "Trading", related: ["Bull Run", "Crypto Winter"] },
    { term: "Metaverse Economy", def: "The economic system within a virtual world using crypto.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Metaverse Land", def: "Virtual real estate in the metaverse, often sold as NFTs.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Metaverse Token", def: "A token used for transactions in a metaverse ecosystem.", category: "Gaming", related: ["Metaverse", "NFT"] },
    { term: "Mining Ban", def: "A government prohibition on crypto mining activities.", category: "Geopolitical", related: ["Crypto Ban", "Regulation"] },
    { term: "Mining Ethics", def: "The moral considerations of crypto mining’s environmental impact.", category: "Ethics", related: ["Ethical Mining", "Environmental"] },
    { term: "Mt. Gox Hack", def: "The 2014 hack of the Mt. Gox exchange, leading to massive Bitcoin losses.", category: "Historical", related: ["Exchange Hack", "Bitcoin"] },
    { term: "NFT Auction", def: "A sale of NFTs through a bidding process.", category: "Gaming", related: ["NFT", "Digital Art Market"] },
    { term: "NFT Boom", def: "The 2021 explosion in NFT popularity and sales.", category: "Historical", related: ["Crypto Art Boom", "NFT"] },
    { term: "NFT Community", def: "A group of enthusiasts focused on NFT projects.", category: "Cultural", related: ["Community", "NFT"] },
    { term: "NFT Creator", def: "An artist or developer creating NFTs for sale.", category: "Cultural", related: ["Decentralized Creator", "NFT"] },
    { term: "NFT Ethics", def: "The moral debates around NFT ownership and environmental impact.", category: "Ethics", related: ["Crypto Ethics", "Environmental"] },
    { term: "NFT Rarity", def: "The uniqueness of an NFT, often driving its value.", category: "Gaming", related: ["NFT", "Digital Collectible"] },
    { term: "Non-Custodial Exchange", def: "An exchange where users retain control of their funds.", category: "Trading", related: ["DEX", "Self-Custody"] },
    { term: "On-Chain Community", def: "A community interacting directly on a blockchain.", category: "Education", related: ["Community", "DAO"] },
    { term: "Open Source Community", def: "A group of developers contributing to open-source crypto projects.", category: "Education", related: ["Community", "Open Source"] },
    { term: "Parity Hack", def: "The 2017 Ethereum wallet hack exploiting a smart contract bug.", category: "Historical", related: ["Contract Exploit", "Ethereum"] },
    { term: "Philanthropy Token", def: "A token designed to support charitable causes.", category: "Cultural", related: ["Crypto Charity", "Philanthropy"] },
    { term: "Play-to-Earn Boom", def: "The 2021 rise of play-to-earn gaming models using crypto.", category: "Historical", related: ["GameFi", "NFT"] },
    { term: "PoW Energy Debate", def: "The controversy over Proof of Work’s high energy consumption.", category: "Environmental", related: ["Energy Consumption", "Green Mining"] },
    { term: "Privacy Ethics", def: "The moral debate over privacy vs. transparency in crypto.", category: "Ethics", related: ["Anonymity Debate", "Regulation"] },
    { term: "Proof of Community", def: "A mechanism rewarding active community participation.", category: "Education", related: ["Community", "Incentive"] },
    { term: "Proof of Donation", def: "A token or record proving a charitable crypto donation.", category: "Cultural", related: ["Crypto Charity", "Philanthropy"] },
    { term: "Quantum Threat", def: "The potential for quantum computers to break blockchain encryption.", category: "Emerging Trends", related: ["Quantum Resistance", "Security"] },
    { term: "Rebase Token", def: "A token with a supply that adjusts to maintain price stability.", category: "DeFi", related: ["Elastic Supply", "Tokenomics"] },
    { term: "Regulatory Crackdown", def: "A government’s aggressive enforcement of crypto regulations.", category: "Geopolitical", related: ["Crypto Ban", "Regulation"] },
    { term: "Renewable Mining", def: "Mining crypto using renewable energy to reduce environmental impact.", category: "Environmental", related: ["Green Mining", "Sustainability"] },
    { term: "Scalability Debate", def: "The ongoing discussion on how to scale blockchains effectively.", category: "Ethics", related: ["Blockchain Trilemma", "Scalability"] },
    { term: "Silk Road", def: "An infamous dark web marketplace using Bitcoin, shut down in 2013.", category: "Historical", related: ["Dark Web", "Bitcoin"] },
    { term: "Social Impact Token", def: "A token funding projects with positive social outcomes.", category: "Cultural", related: ["Crypto Charity", "Philanthropy"] },
    { term: "Social Media Token", def: "A token used on decentralized social media platforms.", category: "Emerging Trends", related: ["Decentralized Social", "Web3"] },
    { term: "Liquidity Bootstrapping", def: "A token sale method to gradually build liquidity.", category: "DeFi", related: ["Initial Liquidity Offering", "Liquidity"] },
    { term: "Liquidity Crunch", def: "A sudden drop in available liquidity, causing price volatility.", category: "Trading", related: ["Liquidity", "Volatility"] },
    { term: "Liquidity Fragmentation", def: "The division of liquidity across multiple platforms.", category: "DeFi", related: ["Liquidity", "DEX Aggregator"] },
    { term: "Liquidity Migration", def: "Moving liquidity from one protocol to another for better yields.", category: "DeFi", related: ["Liquidity Pool", "Yield Farming"] },
    { term: "Liquidity Trap", def: "A situation where adding liquidity leads to losses due to market conditions.", category: "DeFi", related: ["Impermanent Loss", "Liquidity Pool"] },
    { term: "Long Tail Asset", def: "A niche or less popular crypto with potential for growth.", category: "Trading", related: ["Micro Cap", "Speculation"] },
    { term: "Loopring", def: "A Layer 2 protocol for scalable, low-cost DEX trading.", category: "Tech", related: ["Layer 2", "DEX"] },
    { term: "Low Cap Gem", def: "Slang for a small market cap crypto with high growth potential.", category: "Slang", related: ["Micro Cap", "Speculation"] },
    { term: "MakerDAO", def: "A DeFi protocol for creating the DAI stablecoin through CDPs.", category: "DeFi", related: ["DAI", "Collateralized Debt Position"] },
    { term: "Market Impact", def: "The effect of a large trade on a crypto’s price.", category: "Trading", related: ["Liquidity", "Whale"] },
    { term: "Market Maker Fee", def: "A fee paid to incentivize liquidity provision on an exchange.", category: "Trading", related: ["Market Maker", "Liquidity"] },
    { term: "Market Microstructure", def: "The study of how trades and orders affect market prices.", category: "Trading", related: ["Order Book", "Liquidity"] },
    { term: "Market Neutral", def: "A strategy aiming for profits regardless of market direction.", category: "Trading", related: ["Delta Neutral", "Hedge"] },
    { term: "Market Timing", def: "Attempting to predict the best times to buy or sell crypto.", category: "Trading", related: ["Speculation", "TA"] },
    { term: "Max Drawdown", def: "The largest peak-to-trough decline in a portfolio’s value.", category: "Trading", related: ["Risk Management", "Volatility"] },
    { term: "MEV Extraction", def: "Profiting from reordering or including specific transactions.", category: "Tech", related: ["MEV", "Frontrun"] },
    { term: "Micro-Lending", def: "Small-scale lending of crypto through DeFi platforms.", category: "DeFi", related: ["Lending Protocol", "DeFi"] },
    { term: "Mining Contract", def: "An agreement to rent mining power for a set period.", category: "Tech", related: ["Cloud Mining", "Mining"] },
    { term: "Minting Cap", def: "The maximum number of tokens that can be created.", category: "Tech", related: ["Max Supply", "Tokenomics"] },
    { term: "Momentum Trading", def: "A strategy to buy or sell based on recent price trends.", category: "Trading", related: ["TA", "Trend"] },
    { term: "Multi-Party Computation", def: "A cryptographic method for secure data sharing among parties.", category: "Tech", related: ["Privacy", "Security"] },
    { term: "Network Effect", def: "The increased value of a crypto as more users join.", category: "Basics", related: ["Adoption", "User Base"] },
    { term: "Network Fee", def: "A fee paid to process transactions on a blockchain.", category: "Tech", related: ["Transaction Fee", "Gas"] },
    { term: "Network Partition", def: "A split in a blockchain network due to connectivity issues.", category: "Tech", related: ["CAP Theorem", "Consensus"] },
    { term: "NFT Fractionalization", def: "Dividing an NFT into smaller, tradable shares.", category: "DeFi", related: ["Fractional Ownership", "NFT"] },
    { term: "Node Sync", def: "The process of a node downloading and verifying the blockchain.", category: "Tech", related: ["Full Node", "Blockchain"] },
    { term: "Non-Interactive Proof", def: "A cryptographic proof that doesn’t require interaction.", category: "Tech", related: ["Zero-Knowledge", "zk-SNARK"] },
    { term: "Off-Chain Oracle", def: "An oracle that processes data outside the blockchain.", category: "Tech", related: ["Oracle", "Data Oracle"] },
    { term: "On-Chain Analysis", def: "Studying blockchain data to understand market behavior.", category: "Tech", related: ["Heuristic Analysis", "Transparency"] },
    { term: "On-Chain Liquidity", def: "Liquidity directly available on a blockchain protocol.", category: "DeFi", related: ["Liquidity Pool", "DEX"] },
    { term: "Optimistic Oracle", def: "An oracle assuming data is correct unless disputed.", category: "Tech", related: ["Oracle", "Dispute Resolution"] },
    { term: "Order Flow", def: "The stream of buy and sell orders in a market.", category: "Trading", related: ["Order Book", "Market Microstructure"] },
    { term: "Orphan Block", def: "A block that is not part of the main blockchain.", category: "Tech", related: ["Uncle Block", "Mining"] },
    { term: "Overleveraged", def: "Taking on too much debt in trading, risking liquidation.", category: "Trading", related: ["Leverage", "Liquidation"] },
    { term: "P2P Exchange", def: "A platform for direct crypto trading between users.", category: "Trading", related: ["P2P", "DEX"] },
    { term: "Parachain Auction", def: "A bidding process to secure a slot on a relay chain.", category: "Tech", related: ["Polkadot", "Parachain"] },
    { term: "Passive Staking", def: "Earning rewards by holding tokens without active participation.", category: "DeFi", related: ["Staking", "Yield"] },
    { term: "Peg Drift", def: "When a stablecoin’s value deviates from its intended peg.", category: "DeFi", related: ["Stablecoin", "Peg"] },
    { term: "Permissionless", def: "A system where anyone can participate without approval.", category: "Tech", related: ["Decentralization", "Public Blockchain"] },
    { term: "Perpetual Swap", def: "A derivative contract with no expiry, mimicking spot trading.", category: "Trading", related: ["Perpetual Futures", "Derivatives"] },
    { term: "Polkadot", def: "A blockchain protocol enabling interoperability between chains.", category: "Tech", related: ["Parachain", "Relay Chain"] },
    { term: "Portfolio Rebalancing", def: "Adjusting a crypto portfolio to maintain desired allocations.", category: "Trading", related: ["Diversification", "Risk Management"] },
    { term: "Pre-Sale", def: "A token sale phase before the public offering.", category: "Basics", related: ["Private Sale", "ICO"] },
    { term: "Price Floor", def: "The lowest price a crypto is expected to drop to.", category: "Trading", related: ["Support", "Valuation"] },
    { term: "Price Oracle", def: "A service providing real-time price data to smart contracts.", category: "Tech", related: ["Oracle", "Data Oracle"] },
    { term: "Private Key Leak", def: "The accidental exposure of a private key, leading to theft.", category: "Tech", related: ["Security", "Private Key"] },
    { term: "Proof of Attendance", def: "A token or NFT proving participation in an event.", category: "Tech", related: ["NFT", "Event"] },
    { term: "Proof of Capacity", def: "A consensus mechanism using storage space to validate blocks.", category: "Tech", related: ["Consensus", "Mining"] },
    { term: "Proof of Reserves", def: "A method to verify an exchange holds sufficient funds.", category: "Regulation", related: ["Audit", "Transparency"] },
    { term: "Proxy Contract", def: "A smart contract that delegates calls to another contract.", category: "Tech", related: ["Smart Contract", "Upgradeability"] },
    { term: "Public Sale", def: "A token sale open to the general public.", category: "Basics", related: ["Pre-Sale", "ICO"] },
    { term: "Put Option", def: "A contract giving the right to sell a crypto at a set price.", category: "Trading", related: ["Call Option", "Options"] },
    { term: "Quadratic Voting", def: "A voting system where votes cost more as you add them.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Quantum Resistance", def: "A blockchain’s ability to withstand quantum computing attacks.", category: "Tech", related: ["Security", "Cryptography"] },
    { term: "Randomness Oracle", def: "A service providing secure random numbers to smart contracts.", category: "Tech", related: ["Chainlink VRF", "Randomness"] },
    { term: "Re-Entrancy Attack", def: "An exploit where a smart contract is repeatedly called before completing.", category: "Tech", related: ["Security", "Smart Contract"] },
    { term: "Rehypothecation", def: "Using borrowed crypto assets as collateral for further loans.", category: "DeFi", related: ["Leverage", "Risk"] },
    { term: "Relative Value", def: "Comparing a crypto’s value to another asset or benchmark.", category: "Trading", related: ["Valuation", "Market Cap"] },
    { term: "Replay Attack", def: "Reusing a valid transaction to steal funds after a fork.", category: "Tech", related: ["Security", "Fork"] },
    { term: "Reserve Ratio", def: "The ratio of reserves to circulating supply in a stablecoin.", category: "DeFi", related: ["Stablecoin", "Peg"] },
    { term: "Reversal Pattern", def: "A chart pattern indicating a potential trend change.", category: "Trading", related: ["Head and Shoulders", "TA"] },
    { term: "Reward Distribution", def: "The process of allocating staking or mining rewards.", category: "Tech", related: ["Block Reward", "Staking"] },
    { term: "Ring Signature", def: "A cryptographic method for anonymous transactions.", category: "Tech", related: ["Monero", "Privacy"] },
    { term: "Risk-Adjusted Return", def: "A measure of profit relative to the risk taken.", category: "Trading", related: ["ROI", "Risk Management"] },
    { term: "Rollup Chain", def: "A secondary chain processing transactions for a main blockchain.", category: "Tech", related: ["Rollup", "Layer 2"] },
    { term: "Safe Haven", def: "A crypto seen as a stable investment during market turmoil.", category: "Trading", related: ["Blue Chip", "Store of Value"] },
    { term: "Sandwich Trading", def: "A strategy placing trades around a large order to profit.", category: "Trading", related: ["Frontrun", "MEV"] },
    { term: "Satoshi Era", def: "The early days of Bitcoin when Satoshi Nakamoto was active.", category: "Slang", related: ["Satoshi Nakamoto", "Bitcoin"] },
    { term: "Scalability Triad", def: "The balance of speed, cost, and security in blockchain design.", category: "Tech", related: ["Blockchain Trilemma", "Scalability"] },
    { term: "Security Audit", def: "A thorough review of a blockchain or smart contract for vulnerabilities.", category: "Tech", related: ["Audit", "Security"] },
    { term: "Self-Custody", def: "Managing your own private keys without third-party involvement.", category: "Tech", related: ["Non-Custodial", "Wallet"] },
    { term: "Self-Sovereign Identity", def: "A user-controlled digital identity on a blockchain.", category: "Tech", related: ["Decentralized Identity", "Privacy"] },
    { term: "Settlement Layer", def: "A blockchain layer focused on finalizing transactions.", category: "Tech", related: ["Execution Layer", "Layer 1"] },
    { term: "Shamir’s Secret Sharing", def: "A method to split a private key into multiple parts.", category: "Tech", related: ["Security", "Private Key"] },
    { term: "Shard Chain", def: "A subset of a blockchain handling specific transactions for scalability.", category: "Tech", related: ["Sharding", "Ethereum 2.0"] },
    { term: "Sharpe Ratio", def: "A measure of risk-adjusted return in a crypto portfolio.", category: "Trading", related: ["Risk-Adjusted Return", "Volatility"] },
    { term: "Shilling Attack", def: "Coordinated promotion of a crypto to manipulate its price.", category: "Slang", related: ["Shill", "Pump Scheme"] },
    { term: "Sidechain Peg", def: "A mechanism locking assets on a main chain to use on a sidechain.", category: "Tech", related: ["Sidechain", "Cross-Chain"] },
    { term: "Slashing", def: "Penalizing validators for misbehavior by reducing their staked tokens.", category: "Tech", related: ["Proof of Stake", "Validator"] },
    { term: "Slippage Tolerance", def: "The maximum price change a trader is willing to accept in a swap.", category: "DeFi", related: ["Slippage", "DEX"] },
    { term: "Smart Contract Oracle", def: "An oracle integrated into a smart contract for data input.", category: "Tech", related: ["Oracle", "Smart Contract"] },
    { term: "Sniper Bot", def: "A bot designed to buy tokens immediately upon listing.", category: "Trading", related: ["Snipe", "Bot Trading"] },
    { term: "Social Recovery", def: "A wallet recovery method using trusted contacts.", category: "Tech", related: ["Wallet Recovery", "Security"] },
    { term: "Soft Staking", def: "Staking without locking tokens, allowing withdrawal anytime.", category: "DeFi", related: ["Staking", "Bonded Staking"] },
    { term: "Sovereign Rollup", def: "A rollup with its own consensus mechanism.", category: "Tech", related: ["Rollup", "Layer 2"] },
    { term: "Stable Swap", def: "A swap mechanism optimized for stablecoin trading.", category: "DeFi", related: ["Curve Finance", "Stablecoin"] },
    { term: "Staking Derivative", def: "A token representing staked assets, tradable while staking.", category: "DeFi", related: ["Staking", "Liquidity"] },
    { term: "State Channel Network", def: "A network of state channels for off-chain transactions.", category: "Tech", related: ["State Channel", "Layer 2"] },
    { term: "State Rent", def: "A fee for storing data on a blockchain to manage bloat.", category: "Tech", related: ["State Bloat", "Storage"] },
    { term: "Store of Value", def: "A crypto’s ability to retain value over time.", category: "Basics", related: ["Inflation Hedge", "Bitcoin"] },
    { term: "Sybil Protection", def: "Measures to prevent fake identities in a decentralized system.", category: "Tech", related: ["Sybil Resistance", "Security"] },
    { term: "Synthetic Token", def: "A token mimicking the value of another asset in DeFi.", category: "DeFi", related: ["Synthetic Asset", "DeFi"] },
    { term: "Taker Fee", def: "A fee charged for taking liquidity from an exchange.", category: "Trading", related: ["Maker Fee", "Liquidity"] },
    { term: "Tezos", def: "A self-upgrading blockchain with on-chain governance.", category: "Tech", related: ["Baking", "Proof of Stake"] },
    { term: "Time Lock", def: "A mechanism delaying a transaction until a set time.", category: "Tech", related: ["Hash Lock", "Smart Contract"] },
    { term: "Token Bonding", def: "A mechanism to lock tokens for rewards or access.", category: "DeFi", related: ["Staking", "Liquidity"] },
    { term: "Token Curated Registry", def: "A decentralized list maintained through token voting.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Token Distribution Event", def: "An event where tokens are allocated to users.", category: "Basics", related: ["Airdrop", "Token Sale"] },
    { term: "Token Migration", def: "Moving tokens from one blockchain to another.", category: "Tech", related: ["Token Swap", "Bridge"] },
    { term: "Tokenized Asset", def: "A real-world asset represented as a token on a blockchain.", category: "Basics", related: ["Tokenization", "Security Token"] },
    { term: "Total Locked Value", def: "The total value of assets locked in a DeFi protocol.", category: "DeFi", related: ["TVL", "Liquidity"] },
    { term: "Transaction Batching", def: "Combining multiple transactions into a single one to save fees.", category: "Tech", related: ["Gas Optimization", "Scalability"] },
    { term: "Transaction Relay", def: "The process of broadcasting transactions to the network.", category: "Tech", related: ["Mempool", "Node"] },
    { term: "Trend Line", def: "A line on a chart showing the direction of price movement.", category: "Trading", related: ["TA", "Support"] },
    { term: "Trust Score", def: "A metric assessing the reliability of a crypto exchange.", category: "Trading", related: ["Security", "Exchange"] },
    { term: "Uniswap V3", def: "An upgraded version of Uniswap with concentrated liquidity.", category: "DeFi", related: ["Uniswap", "Concentrated Liquidity"] },
    { term: "Unspent Output", def: "A transaction output that can be used as input for a new transaction.", category: "Tech", related: ["UTXO", "Bitcoin"] },
    { term: "Upgradeability", def: "The ability to update a smart contract’s code after deployment.", category: "Tech", related: ["Proxy Contract", "Smart Contract"] },
    { term: "Validator Election", def: "The process of selecting validators in a Proof of Stake system.", category: "Tech", related: ["Validator", "Proof of Stake"] },
    { term: "Value Accrual", def: "The process by which a token gains value through usage.", category: "DeFi", related: ["Tokenomics", "Utility"] },
    { term: "Vaporware Hype", def: "Promoting a crypto project that never materializes.", category: "Slang", related: ["Vaporware", "Hype"] },
    { term: "Velocity of Money", def: "The rate at which a token is used in transactions.", category: "Tech", related: ["Token Velocity", "Tokenomics"] },
    { term: "Volatility Smile", def: "A graph showing implied volatility across option strike prices.", category: "Trading", related: ["Options", "Volatility"] },
    { term: "Volume Profile", def: "A chart showing trading volume at different price levels.", category: "Trading", related: ["Volume", "TA"] },
    { term: "Wallet Drainer", def: "A scam contract that steals funds from a user’s wallet.", category: "Slang", related: ["Honeypot", "Scam"] },
    { term: "Warm Wallet", def: "A wallet with limited online exposure for moderate security.", category: "Tech", related: ["Hot Wallet", "Cold Wallet"] },
    { term: "Weighted Voting", def: "A governance system where votes are proportional to token holdings.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Whale Dump", def: "A large sell-off by a whale, causing a price drop.", category: "Slang", related: ["Whale", "Dumping"] },
    { term: "Wrapped Asset", def: "A tokenized version of an asset for use on another blockchain.", category: "Tech", related: ["Wrapped Token", "Cross-Chain"] },
    { term: "Yield Sensitivity", def: "How much a DeFi yield changes with market conditions.", category: "DeFi", related: ["Yield", "DeFi"] },
    { term: "Zero-Sum Game", def: "A situation where one trader’s gain is another’s loss.", category: "Trading", related: ["Market", "Speculation"] },
    { term: "zk-Rollup", def: "A Layer 2 solution using zero-knowledge proofs for scalability.", category: "Tech", related: ["Rollup", "Zero-Knowledge"] },
    { term: "Address Reuse", def: "Using the same wallet address for multiple transactions, reducing privacy.", category: "Tech", related: ["Privacy", "Wallet Address"] },
    { term: "Adoption Curve", def: "The rate at which a cryptocurrency gains widespread use.", category: "Basics", related: ["Mainstream", "User Base"] },
    { term: "Algo Trading", def: "Using algorithms to automate trading strategies.", category: "Trading", related: ["Trading Bot", "Automation"] },
    { term: "Alpha", def: "Early access or insider information on a crypto project.", category: "Slang", related: ["Beta", "Insider"] },
    { term: "Anonymity Set", def: "The group of users a transaction could potentially belong to, enhancing privacy.", category: "Tech", related: ["Privacy", "Coin Mixer"] },
    { term: "Anti-Sybil", def: "Mechanisms to prevent fake identities in a blockchain network.", category: "Tech", related: ["Sybil Resistance", "Security"] },
    { term: "APY", def: "Annual Percentage Yield; the yearly return on an investment including compounding.", category: "DeFi", related: ["APR", "Yield"] }, 

  // Intermediate (Tech category)
    { term: "Social Token", def: "A token tied to a creator or community for exclusive access.", category: "Cultural", related: ["Decentralized Creator", "NFT"] },
    { term: "Sustainability Token", def: "A token supporting environmental sustainability initiatives.", category: "Environmental", related: ["Carbon Credit Token", "Green Mining"] },
    { term: "Tokenized Real Estate", def: "Real estate assets represented as tokens on a blockchain.", category: "Emerging Trends", related: ["Tokenization", "Fractional Ownership"] },
    { term: "Transparency Ethics", def: "The moral debate over blockchain’s public ledger transparency.", category: "Ethics", related: ["Privacy Ethics", "Regulation"] },
    { term: "Virtual Economy", def: "An economy within a virtual world using crypto for transactions.", category: "Gaming", related: ["Metaverse Economy", "NFT"] },
    { term: "Virtual Land Boom", def: "The 2021 surge in metaverse land sales as NFTs.", category: "Historical", related: ["Metaverse Land", "NFT Boom"] },
    { term: "Web3 Adoption", def: "The growing use of Web3 technologies for decentralized apps.", category: "Emerging Trends", related: ["Web3", "DApp"] },
    { term: "Web3 Community", def: "A group of users and developers focused on Web3 projects.", category: "Education", related: ["Community", "Web3"] },
    { term: "Web3 Creator", def: "A content creator using Web3 tools for monetization.", category: "Cultural", related: ["Decentralized Creator", "Social Token"] },
    { term: "Web3 Education", def: "Resources teaching users about Web3 and decentralized tech.", category: "Education", related: ["Blockchain Education", "Web3"] },
    { term: "Web3 Ethics", def: "The moral considerations in building a decentralized internet.", category: "Ethics", related: ["Crypto Ethics", "Decentralization"] },
    { term: "Web3 Gaming", def: "Games built on Web3 with decentralized ownership of assets.", category: "Gaming", related: ["GameFi", "NFT"] },
    { term: "Web3 Identity", def: "A decentralized identity system for user control in Web3.", category: "Emerging Trends", related: ["Digital Identity", "Self-Sovereign Identity"] },
    { term: "Web3 Social", def: "Social platforms on Web3 prioritizing user ownership.", category: "Emerging Trends", related: ["Decentralized Social", "Social Token"] },
    { term: "Yield Farming Boom", def: "The 2020 surge in DeFi yield farming popularity.", category: "Historical", related: ["DeFi Summer", "Yield Farming"] },
    { term: "Aavegotchi", def: "A DeFi and NFT project combining yield farming with digital collectibles.", category: "DeFi", related: ["NFT", "Yield Farming"] },
    { term: "Accredited Investor", def: "An individual or entity meeting regulatory criteria to invest in private crypto offerings.", category: "Regulation", related: ["SEC", "Private Sale"] },
    { term: "Active Address", def: "A wallet address that has sent or received a transaction within a period.", category: "Tech", related: ["On-Chain Analysis", "User Activity"] },
    { term: "Adaptive Governance", def: "A governance model that evolves based on community feedback.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Address Clustering", def: "Grouping wallet addresses to identify ownership patterns.", category: "Tech", related: ["Heuristic Analysis", "Privacy"] },
    { term: "Adverse Regulatory Event", def: "A government action negatively impacting crypto markets.", category: "Regulation", related: ["Regulatory Risk", "Ban"] },
    { term: "Airdrop Vesting", def: "A schedule for gradually releasing airdropped tokens to recipients.", category: "DeFi", related: ["Airdrop", "Vesting"] },
    { term: "Algorithmic Trading", def: "Using automated systems to execute trades based on predefined rules.", category: "Trading", related: ["Algo Trading", "Bot Trading"] },
    { term: "AML Compliance", def: "Adhering to Anti-Money Laundering regulations in crypto operations.", category: "Regulation", related: ["KYC", "Regulation"] },
    { term: "Anti-Money Laundering", def: "Regulations to prevent the use of crypto for illegal financial activities.", category: "Regulation", related: ["AML", "KYC"] },
    { term: "Arbitrage Fund", def: "A fund specializing in exploiting price differences across crypto markets.", category: "Trading", related: ["Arbitrage", "Hedge Fund"] },
    { term: "Asset Freeze", def: "A regulatory action to block crypto assets linked to illegal activity.", category: "Regulation", related: ["Sanctions", "Compliance"] },
    { term: "Asymmetric Information", def: "When one party in a trade has more knowledge than the other.", category: "Trading", related: ["Adverse Selection", "Market Risk"] },
    { term: "Atomic Cross-Chain", def: "A transaction ensuring assets are swapped across chains simultaneously.", category: "Tech", related: ["Cross-Chain Swap", "Atomic Swap"] },
    { term: "Audit Trail", def: "A record of all transactions for regulatory transparency.", category: "Regulation", related: ["Transparency", "Compliance"] },
    { term: "Automated Liquidity", def: "Providing liquidity to a pool through an automated system.", category: "DeFi", related: ["Liquidity Pool", "AMM"] },
    { term: "Backstop Liquidity", def: "A reserve pool to ensure liquidity during market stress.", category: "DeFi", related: ["Liquidity", "Stability"] },
    { term: "Bagholder Syndrome", def: "Holding a declining crypto hoping for a price recovery.", category: "Slang", related: ["Bags", "HODL"] },
    { term: "Bancor Network", def: "A DeFi protocol for token swaps with built-in liquidity.", category: "DeFi", related: ["Bancor", "Liquidity"] },
    { term: "Bearish Sentiment", def: "A negative outlook on the crypto market’s future performance.", category: "Trading", related: ["Market Sentiment", "Bear Market"] },
    { term: "Blacklist", def: "A list of wallet addresses banned by regulators or protocols.", category: "Regulation", related: ["Sanctions", "Compliance"] },
    { term: "Block Reward Halving", def: "A reduction in mining rewards to control token issuance.", category: "Tech", related: ["Halving", "Emission Schedule"] },
    { term: "Blockchain Forensics", def: "Analyzing blockchain data to investigate illegal activities.", category: "Regulation", related: ["On-Chain Analysis", "Compliance"] },
    { term: "Bonded Liquidity", def: "Liquidity locked in a pool for a set period to earn rewards.", category: "DeFi", related: ["Liquidity Pool", "Staking"] },
    { term: "Botsniper", def: "A user or bot aiming to buy tokens at launch for quick profits.", category: "Slang", related: ["Sniper Bot", "Snipe"] },
    { term: "BTD Strategy", def: "A strategy of buying crypto during price dips.", category: "Trading", related: ["BTD", "DCA"] },
    { term: "Bullish Sentiment", def: "A positive outlook on the crypto market’s future performance.", category: "Trading", related: ["Market Sentiment", "Bull Market"] },
    { term: "Burn Fee", def: "A fee that is burned to reduce token supply.", category: "Tech", related: ["Fee Burn", "Deflation"] },
    { term: "Capital Gains Tax", def: "A tax on profits from selling crypto assets.", category: "Regulation", related: ["Tax", "Capital Gains"] },
    { term: "CFTC", def: "Commodity Futures Trading Commission; a U.S. agency regulating crypto derivatives.", category: "Regulation", related: ["SEC", "Regulation"] },
    { term: "Chain Governance", def: "The process of managing and updating a blockchain’s rules.", category: "Tech", related: ["Governance", "DAO"] },
    { term: "Chainlink Keeper", def: "A service automating smart contract functions on a schedule.", category: "Tech", related: ["Chainlink", "Automation"] },
    { term: "Collateralized Loan", def: "A loan in DeFi backed by crypto assets as collateral.", category: "DeFi", related: ["Collateral", "Lending Protocol"] },
    { term: "Compliance Officer", def: "A role ensuring a crypto firm adheres to regulations.", category: "Regulation", related: ["Compliance", "Regulation"] },
    { term: "Compound Governance", def: "The governance system of the Compound protocol using COMP tokens.", category: "DeFi", related: ["Compound", "Governance Token"] },
    { term: "Consensus Failure", def: "A breakdown in a blockchain’s agreement process.", category: "Tech", related: ["Consensus Attack", "Byzantine Fault"] },
    { term: "Consumer Protection", def: "Regulations ensuring fair treatment of crypto users.", category: "Regulation", related: ["Regulation", "Scam Prevention"] },
    { term: "Contract Exploit", def: "A hack taking advantage of vulnerabilities in a smart contract.", category: "Tech", related: ["DeFi Exploit", "Security"] },
    { term: "Coordinated Buying", def: "A group effort to buy a crypto and drive up its price.", category: "Trading", related: ["Pump Scheme", "Market Manipulation"] },
    { term: "Cross-Border Payment", def: "Using crypto for international transactions to bypass traditional systems.", category: "Basics", related: ["Remittance", "Stablecoin"] },
    { term: "Cross-Chain Governance", def: "A system for managing rules across multiple blockchains.", category: "Tech", related: ["Cross-Chain", "Governance"] },
    { term: "Crypto Ban", def: "A government prohibition on crypto trading or usage.", category: "Regulation", related: ["Regulatory Risk", "Adverse Regulatory Event"] },
    { term: "Crypto Compliance", def: "Ensuring crypto activities meet legal and regulatory standards.", category: "Regulation", related: ["AML", "KYC"] },
    { term: "Crypto Custodian", def: "A third party holding crypto assets for security and compliance.", category: "Regulation", related: ["Custodial", "Security"] },
    { term: "Crypto Regulation", def: "Government rules governing the use and trading of cryptocurrencies.", category: "Regulation", related: ["Compliance", "SEC"] },
    { term: "Crypto Tax", def: "Taxes applied to crypto transactions, such as capital gains.", category: "Regulation", related: ["Capital Gains Tax", "Tax"] },
    { term: "Crypto Tracing", def: "Tracking crypto transactions to identify illicit activities.", category: "Regulation", related: ["Blockchain Forensics", "Compliance"] },
    { term: "Curve Pool", def: "A liquidity pool on Curve Finance for stablecoin swaps.", category: "DeFi", related: ["Curve Finance", "Stable Swap"] },
    { term: "Custodial Exchange", def: "An exchange that holds users’ funds on their behalf.", category: "Trading", related: ["CEX", "Custodial Risk"] },
    { term: "Dark Pool Exchange", def: "A private exchange for large crypto trades to avoid market impact.", category: "Trading", related: ["Dark Pool", "Liquidity"] },
    { term: "Data Privacy", def: "Protecting user data in blockchain transactions.", category: "Regulation", related: ["Privacy", "GDPR"] },
    { term: "Decentralized Voting", def: "A voting system on a blockchain for governance decisions.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "DeFi Hack", def: "A cyberattack targeting a DeFi protocol to steal funds.", category: "DeFi", related: ["DeFi Exploit", "Security"] },
    { term: "DeFi Liquidity", def: "The availability of funds for trading in DeFi protocols.", category: "DeFi", related: ["Liquidity Pool", "DEX"] },
    { term: "Delegated Governance", def: "A system where token holders delegate voting to representatives.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Deposit Insurance", def: "A regulatory mechanism to protect user funds on exchanges.", category: "Regulation", related: ["Consumer Protection", "Custodial"] },
    { term: "Digital Asset Regulation", def: "Laws governing the creation and trading of digital assets.", category: "Regulation", related: ["Crypto Regulation", "SEC"] },
    { term: "Distributed Network", def: "A network where nodes operate without a central authority.", category: "Tech", related: ["Decentralization", "P2P Network"] },
    { term: "Dumping Scheme", def: "A coordinated sell-off to crash a crypto’s price.", category: "Slang", related: ["Pump and Dump", "Market Manipulation"] },
    { term: "Dynamic Staking", def: "A staking system where rewards adjust based on network conditions.", category: "DeFi", related: ["Staking", "Yield"] },
    { term: "Early Exit Penalty", def: "A fee for withdrawing staked tokens before a lockup period ends.", category: "DeFi", related: ["Staking", "Lockup Period"] },
    { term: "Economic Model", def: "The framework governing a crypto’s supply, demand, and incentives.", category: "Basics", related: ["Tokenomics", "Incentive"] },
    { term: "EIP-4844", def: "An Ethereum proposal to reduce gas costs for rollups.", category: "Tech", related: ["Rollup", "Ethereum"] },
    { term: "Elastic Liquidity", def: "Liquidity that adjusts dynamically to market conditions.", category: "DeFi", related: ["Liquidity", "AMM"] },
    { term: "Emergency Proposal", def: "A governance proposal to address urgent issues in a protocol.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Emission Curve", def: "A graph showing the rate of new token issuance over time.", category: "Tech", related: ["Emission Schedule", "Tokenomics"] },
    { term: "Encrypted Transaction", def: "A transaction with data hidden for privacy.", category: "Tech", related: ["Privacy", "Zero-Knowledge"] },
    { term: "Equity Crowdfunding", def: "Raising funds for a crypto project through tokenized equity.", category: "Basics", related: ["Crowdsale", "Security Token"] },
    { term: "Escrow Contract", def: "A smart contract holding funds until conditions are met.", category: "Tech", related: ["Escrow", "Smart Contract"] },
    { term: "Exchange Hack", def: "A cyberattack on a crypto exchange to steal user funds.", category: "Tech", related: ["Security", "CEX"] },
    { term: "Exit Strategy", def: "A plan to sell or withdraw from a crypto investment.", category: "Trading", related: ["Take Profit", "Risk Management"] },
    { term: "Fair Market Value", def: "The price a crypto would fetch in an open market.", category: "Trading", related: ["Fair Value", "Valuation"] },
    { term: "FATF", def: "Financial Action Task Force; an international body setting AML standards for crypto.", category: "Regulation", related: ["AML", "Compliance"] },
    { term: "Fee Escalation", def: "Increasing transaction fees during network congestion.", category: "Tech", related: ["Dynamic Fee", "Gas War"] },
    { term: "Fiat Gateway", def: "A service allowing users to buy crypto with fiat currency.", category: "Basics", related: ["Fiat On-Ramp", "CEX"] },
    { term: "Financial Inclusion", def: "Using crypto to provide financial services to the unbanked.", category: "Basics", related: ["Remittance", "Cross-Border Payment"] },
    { term: "FinCEN", def: "Financial Crimes Enforcement Network; a U.S. agency regulating crypto for AML.", category: "Regulation", related: ["AML", "Compliance"] },
    { term: "Flash Loan Attack", def: "An exploit using flash loans to manipulate DeFi protocols.", category: "DeFi", related: ["Flash Loan", "DeFi Exploit"] },
    { term: "Fork Governance", def: "The decision-making process for implementing a blockchain fork.", category: "Tech", related: ["Governance", "Fork"] },
    { term: "Fraud Detection", def: "Using blockchain analytics to identify suspicious activities.", category: "Regulation", related: ["Blockchain Forensics", "Compliance"] },
    { term: "Front-Running Attack", def: "Exploiting pending transactions to gain an unfair advantage.", category: "Tech", related: ["Frontrun", "MEV"] },
    { term: "Funding Fee", def: "A periodic fee in perpetual futures to align prices with the spot market.", category: "Trading", related: ["Funding Rate", "Perpetual Futures"] },
    { term: "Gasless Transaction", def: "A transaction where gas fees are paid by a third party.", category: "Tech", related: ["Meta Transaction", "Gas Station Network"] },
    { term: "GDPR Compliance", def: "Adhering to the EU’s General Data Protection Regulation in crypto.", category: "Regulation", related: ["Data Privacy", "Regulation"] },
    { term: "Global Regulation", def: "The worldwide framework of laws governing crypto activities.", category: "Regulation", related: ["Crypto Regulation", "FATF"] },
    { term: "Governance Quorum", def: "The minimum participation needed for a governance vote to be valid.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Grayscale", def: "A firm offering crypto investment trusts for institutional investors.", category: "Trading", related: ["Institutional Investor", "Crypto ETF"] },
    { term: "Hard Fork Governance", def: "The process of managing community consensus for a hard fork.", category: "Tech", related: ["Hard Fork", "Governance"] },
    { term: "Hash Function", def: "A cryptographic function converting data into a fixed-length hash.", category: "Tech", related: ["Hash", "Security"] },
    { term: "Hedge Strategy", def: "A trading approach to reduce exposure to price volatility.", category: "Trading", related: ["Hedge", "Risk Management"] },
    { term: "High Cap", def: "A cryptocurrency with a large market capitalization.", category: "Trading", related: ["Blue Chip", "Market Cap"] },
    { term: "HODL Strategy", def: "Holding crypto long-term regardless of market conditions.", category: "Trading", related: ["HODL", "Long-Term"] },
    { term: "Hot Wallet Risk", def: "The vulnerability of an online wallet to hacks.", category: "Tech", related: ["Hot Wallet", "Security"] },
    { term: "Hybrid Token", def: "A token combining features of utility and security tokens.", category: "Basics", related: ["Utility Token", "Security Token"] },
    { term: "ICO Regulation", def: "Government rules governing Initial Coin Offerings.", category: "Regulation", related: ["ICO", "Compliance"] },
    { term: "Identity Verification", def: "The process of confirming a user’s identity for regulatory compliance.", category: "Regulation", related: ["KYC", "AML"] },
    { term: "Impermanent Loss Protection", def: "A mechanism to reduce losses for liquidity providers.", category: "DeFi", related: ["Impermanent Loss", "Liquidity Pool"] },
    { term: "Incentive Pool", def: "A reserve of tokens used to reward network participants.", category: "Tech", related: ["Incentive Mechanism", "Reward"] },
    { term: "Index Token", def: "A token tracking the performance of a basket of cryptocurrencies.", category: "Trading", related: ["Crypto Index", "Diversification"] },
    { term: "Initial Staking Offering", def: "A fundraising method where participants stake tokens to receive new ones.", category: "DeFi", related: ["IDO", "Staking"] },
    { term: "Insider Information", def: "Non-public data used to gain a trading advantage.", category: "Regulation", related: ["Insider Trading", "Ethics"] },
    { term: "Institutional Custody", def: "Secure storage of crypto assets for institutional investors.", category: "Regulation", related: ["Crypto Custodian", "Security"] },
    { term: "Inter-Block Time", def: "The average time between consecutive blocks on a blockchain.", category: "Tech", related: ["Block Time", "Throughput"] },
    { term: "Internal Transaction", def: "A transaction triggered by a smart contract, not directly by a user.", category: "Tech", related: ["Smart Contract", "Transaction"] },
    { term: "L1 Scaling", def: "Improving the base layer of a blockchain for better performance.", category: "Tech", related: ["Layer 1", "Scalability"] },
    { term: "L2 Liquidity", def: "Liquidity available on Layer 2 solutions for faster trades.", category: "DeFi", related: ["Layer 2", "Liquidity"] },
    { term: "Lambo Season", def: "Slang for a period of massive crypto price gains.", category: "Slang", related: ["Lambo Dreams", "Mooning"] },
    { term: "Legal Tender Status", def: "When a cryptocurrency is recognized as official currency by a government.", category: "Regulation", related: ["Adoption", "Regulation"] },
    { term: "Leverage Ratio", def: "The proportion of borrowed funds to a trader’s own capital.", category: "Trading", related: ["Leverage", "Margin"] },
    { term: "Liquidity Adjustment", def: "Modifying liquidity in a pool to balance trading activity.", category: "DeFi", related: ["Liquidity Pool", "AMM"] },
    { term: "Liquidity Provider Fee", def: "A fee earned by users providing liquidity to a pool.", category: "DeFi", related: ["Liquidity Pool", "Yield"] },
    { term: "Liquidity Reserve", def: "A pool of funds to ensure smooth trading on a platform.", category: "Trading", related: ["Liquidity", "Backstop Liquidity"] },
    { term: "Liquidity Staking", def: "Staking tokens in a liquidity pool to earn rewards.", category: "DeFi", related: ["Liquidity Pool", "Yield Farming"] },
    { term: "Long-Term Holder", def: "An investor who holds crypto for an extended period.", category: "Trading", related: ["HODL", "Diamond Hands"] },
    { term: "Low Liquidity", def: "A market condition with limited funds available for trading.", category: "Trading", related: ["Illiquid Market", "Volatility"] },
    { term: "Market Cap Dominance", def: "The percentage of total crypto market cap held by a single coin.", category: "Trading", related: ["Market Cap", "Dominance"] },
    { term: "Market Manipulation Fine", def: "A penalty imposed by regulators for illegal market activities.", category: "Regulation", related: ["Market Manipulation", "Compliance"] },
    { term: "Market Surveillance", def: "Monitoring crypto markets for illegal activities like manipulation.", category: "Regulation", related: ["Compliance", "Market Manipulation"] },
    { term: "Mempool Priority", def: "The order in which transactions are processed based on fees.", category: "Tech", related: ["Mempool", "Transaction Fee"] },
    { term: "Merkle Proof", def: "A cryptographic proof verifying a transaction’s inclusion in a block.", category: "Tech", related: ["Merkle Tree", "Block"] },
    { term: "Meta Governance", def: "A system for managing governance across multiple DAOs.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Mining Farm", def: "A large-scale operation with multiple mining rigs.", category: "Tech", related: ["Mining", "Hash Power"] },
    { term: "Minting Policy", def: "The rules governing the creation of new tokens.", category: "Tech", related: ["Minting", "Tokenomics"] },
    { term: "Money Laundering Risk", def: "The potential for crypto to be used in illegal financial activities.", category: "Regulation", related: ["AML", "Compliance"] },
    { term: "Multi-Chain Governance", def: "A governance system spanning multiple blockchains.", category: "Tech", related: ["Cross-Chain Governance", "DAO"] },
    { term: "Multi-Sig Governance", def: "A governance system requiring multiple signatures for decisions.", category: "DeFi", related: ["Multi-Signature", "Governance"] },
    { term: "Network Security", def: "Measures to protect a blockchain from attacks.", category: "Tech", related: ["Security", "Consensus"] },
    { term: "NFT Lending", def: "Using NFTs as collateral to borrow crypto in DeFi.", category: "DeFi", related: ["NFT", "Lending Protocol"] },
    { term: "Node Incentives", def: "Rewards for running a node to support a blockchain network.", category: "Tech", related: ["Incentive Mechanism", "Node"] },
    { term: "Non-Compliant Token", def: "A token that fails to meet regulatory standards.", category: "Regulation", related: ["Compliance", "Security Token"] },
    { term: "Off-Chain Liquidity", def: "Liquidity managed outside the blockchain for faster trades.", category: "Trading", related: ["Off-Chain", "Liquidity"] },
    { term: "On-Chain Voting", def: "A governance voting process recorded on the blockchain.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Open Source Audit", def: "A public review of a protocol’s code for security.", category: "Tech", related: ["Security Audit", "Transparency"] },
    { term: "Optimistic Execution", def: "Processing transactions assuming they are valid, with later verification.", category: "Tech", related: ["Optimistic Rollup", "Layer 2"] },
    { term: "Order Matching", def: "The process of pairing buy and sell orders on an exchange.", category: "Trading", related: ["Order Book", "Liquidity"] },
    { term: "OTC Trading", def: "Over-the-counter trading of crypto directly between parties.", category: "Trading", related: ["P2P", "Dark Pool"] },
    { term: "P2P Marketplace", def: "A platform for direct trading of goods or services using crypto.", category: "Tech", related: ["Decentralized Marketplace", "P2P"] },
    { term: "Panic Buying", def: "Rapid buying of crypto due to fear of missing out.", category: "Slang", related: ["FOMO Buy", "Hype"] },
    { term: "Passive Yield", def: "Earnings from DeFi activities with minimal active management.", category: "DeFi", related: ["Yield", "Passive Income"] },
    { term: "Peg Stability", def: "The ability of a stablecoin to maintain its intended value.", category: "DeFi", related: ["Stablecoin", "Peg Drift"] },
    { term: "Permissioned Network", def: "A blockchain where access is restricted to authorized participants.", category: "Tech", related: ["Permissioned Ledger", "Private Blockchain"] },
    { term: "Platform Risk", def: "The risk of using a crypto platform due to hacks or failures.", category: "Trading", related: ["Exchange Hack", "Security"] },
    { term: "Price Manipulation", def: "Illegal activities to artificially influence a crypto’s price.", category: "Regulation", related: ["Market Manipulation", "Compliance"] },
    { term: "Privacy Layer", def: "A blockchain layer enhancing transaction anonymity.", category: "Tech", related: ["Privacy", "Zero-Knowledge"] },
    { term: "Private Key Recovery", def: "Restoring access to a wallet using a backup method.", category: "Tech", related: ["Wallet Recovery", "Seed Phrase"] },
    { term: "Proof of Compliance", def: "A method to show adherence to regulatory requirements.", category: "Regulation", related: ["Compliance", "Audit Trail"] },
    { term: "Proof of Liquidity", def: "A mechanism to verify a protocol’s available liquidity.", category: "DeFi", related: ["Liquidity", "Transparency"] },
    { term: "Protocol Fee", def: "A fee charged by a blockchain protocol for transactions.", category: "Tech", related: ["Transaction Fee", "Gas"] },
    { term: "Public Key Encryption", def: "A cryptographic method using a public key to encrypt data.", category: "Tech", related: ["Asymmetric Encryption", "Security"] },
    { term: "Pump and Dump Fine", def: "A regulatory penalty for orchestrating a pump and dump scheme.", category: "Regulation", related: ["Pump and Dump", "Market Manipulation"] },
    { term: "Quadratic Funding", def: "A funding model where contributions are matched based on community support.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Re-Entrancy Guard", def: "A security feature to prevent re-entrancy attacks in smart contracts.", category: "Tech", related: ["Re-Entrancy Attack", "Security"] },
    { term: "Realized Volatility", def: "The actual price volatility of a crypto over a period.", category: "Trading", related: ["Volatility", "Risk"] },
    { term: "Regulatory Arbitrage", def: "Exploiting differences in crypto regulations across jurisdictions.", category: "Regulation", related: ["Compliance", "Global Regulation"] },
    { term: "Regulatory Ban", def: "A government prohibition on specific crypto activities.", category: "Regulation", related: ["Crypto Ban", "Adverse Regulatory Event"] },
    { term: "Regulatory Clarity", def: "Clear government guidelines on crypto usage and compliance.", category: "Regulation", related: ["Crypto Regulation", "Compliance"] },
    { term: "Regulatory Framework", def: "The set of laws and rules governing crypto activities.", category: "Regulation", related: ["Crypto Regulation", "Compliance"] },
    { term: "Regulatory Sandbox", def: "A controlled environment for testing crypto innovations under regulation.", category: "Regulation", related: ["Innovation", "Compliance"] },
    { term: "Remittance Token", def: "A token designed for low-cost cross-border payments.", category: "Basics", related: ["Cross-Border Payment", "Stablecoin"] },
    { term: "Reserve Audit", def: "A review to confirm an exchange’s reserve funds.", category: "Regulation", related: ["Proof of Reserves", "Transparency"] },
    { term: "Reward Pool", def: "A pool of tokens distributed as incentives to users.", category: "Tech", related: ["Incentive Pool", "Reward"] },
    { term: "Risk Disclosure", def: "A regulatory requirement to inform users of crypto investment risks.", category: "Regulation", related: ["Consumer Protection", "Compliance"] },
    { term: "Sanctioned Address", def: "A wallet address blocked due to regulatory sanctions.", category: "Regulation", related: ["Blacklist", "Compliance"] },
    { term: "Scam Prevention", def: "Measures to protect users from fraudulent crypto schemes.", category: "Regulation", related: ["Consumer Protection", "Compliance"] },
    { term: "SEC", def: "Securities and Exchange Commission; a U.S. agency regulating crypto securities.", category: "Regulation", related: ["CFTC", "Compliance"] },
    { term: "Security Token Offering", def: "A regulated token sale representing ownership in an asset.", category: "Regulation", related: ["STO", "Security Token"] },
    { term: "Self-Regulation", def: "The crypto industry setting its own standards to avoid government rules.", category: "Regulation", related: ["Compliance", "Regulation"] },
    { term: "Sell Pressure", def: "Increased selling activity pushing a crypto’s price down.", category: "Trading", related: ["Buy Pressure", "Dumping"] },
    { term: "Sharding Scalability", def: "Using sharding to improve a blockchain’s transaction capacity.", category: "Tech", related: ["Sharding", "Scalability"] },
    { term: "Short-Term Holder", def: "An investor who trades crypto frequently for quick profits.", category: "Trading", related: ["Scalping", "Day Trading"] },
    { term: "Smart Contract Bug", def: "A coding error in a smart contract leading to vulnerabilities.", category: "Tech", related: ["Contract Exploit", "Security"] },
    { term: "Stablecoin Regulation", def: "Government rules governing the issuance and use of stablecoins.", category: "Regulation", related: ["Stablecoin", "Compliance"] },
    { term: "Staking Contract", def: "A smart contract managing the staking process on a blockchain.", category: "Tech", related: ["Staking", "Smart Contract"] },
    { term: "Staking Rewards", def: "Tokens earned for locking crypto to support a network.", category: "DeFi", related: ["Staking", "Yield"] },
    { term: "State Transition", def: "The change in a blockchain’s state after a transaction.", category: "Tech", related: ["Smart Contract", "Blockchain"] },
    { term: "STO", def: "Security Token Offering; a regulated sale of security tokens.", category: "Regulation", related: ["Security Token Offering", "Compliance"] },
    { term: "Supply Shock", def: "A sudden decrease in a crypto’s available supply, causing a price spike.", category: "Trading", related: ["Demand Shock", "Volatility"] },
    { term: "Synthetic Stablecoin", def: "A stablecoin created through DeFi protocols rather than fiat backing.", category: "DeFi", related: ["Stablecoin", "Synthetic Asset"] },
    { term: "Tax Evasion Risk", def: "The potential for crypto to be used to avoid taxes illegally.", category: "Regulation", related: ["Crypto Tax", "Compliance"] },
    { term: "Tax Reporting", def: "The process of documenting crypto transactions for tax purposes.", category: "Regulation", related: ["Crypto Tax", "Compliance"] },
    { term: "Token Blacklist", def: "A list of tokens banned by regulators or platforms.", category: "Regulation", related: ["Blacklist", "Compliance"] },
    { term: "Token Issuance", def: "The creation and distribution of new tokens.", category: "Basics", related: ["Minting", "Token Sale"] },
    { term: "Token Lockup", def: "Restricting token transfers for a set period.", category: "DeFi", related: ["Token Lock", "Vesting"] },
    { term: "Token Utility", def: "The practical use of a token within its ecosystem.", category: "Basics", related: ["Utility Token", "Tokenomics"] },
    { term: "Trade Execution", def: "The process of completing a buy or sell order in the market.", category: "Trading", related: ["Order Matching", "Liquidity"] },
    { term: "Trading Pair", def: "Two assets that can be traded against each other on an exchange.", category: "Trading", related: ["Liquidity", "Exchange"] },
    { term: "Transaction Anonymity", def: "The ability to hide transaction details for privacy.", category: "Tech", related: ["Privacy", "Ring Signature"] },
    { term: "Transaction Fee Market", def: "A system where users bid on fees to prioritize transactions.", category: "Tech", related: ["Fee Market", "Gas Price"] },
    { term: "Transaction Finality", def: "The point at which a transaction is irreversibly confirmed.", category: "Tech", related: ["Finality", "Confirmation"] },
    { term: "Travel Rule", def: "A FATF regulation requiring crypto firms to share user data for transactions.", category: "Regulation", related: ["FATF", "Compliance"] },
    { term: "Treasury Management", def: "Managing a crypto project’s funds for sustainability.", category: "DeFi", related: ["Ecosystem Fund", "Governance"] },
    { term: "Unregulated Exchange", def: "An exchange operating without government oversight.", category: "Regulation", related: ["Compliance", "Risk"] },
    { term: "User Onboarding", def: "The process of introducing new users to a crypto platform.", category: "Basics", related: ["Adoption", "User Experience"] },
    { term: "Validator Rewards", def: "Tokens earned by validators for securing a blockchain.", category: "Tech", related: ["Validator", "Proof of Stake"] },
    { term: "Value Proposition", def: "The unique benefit a crypto project offers to users.", category: "Basics", related: ["Utility", "Adoption"] },
    { term: "Volatility Risk", def: "The risk of price fluctuations affecting a crypto investment.", category: "Trading", related: ["Volatility", "Risk Management"] },
    { term: "Wallet Sanction", def: "A regulatory action blocking a wallet due to illegal activity.", category: "Regulation", related: ["Sanctioned Address", "Compliance"] },
    { term: "Wash Trading Fine", def: "A penalty for artificially inflating trading volume.", category: "Regulation", related: ["Wash Trading", "Market Manipulation"] },
    { term: "Whale Strategy", def: "A trading approach used by large holders to influence markets.", category: "Trading", related: ["Whale", "Market Impact"] },
    { term: "Yield Farming Strategy", def: "A plan to maximize returns from DeFi yield farming.", category: "DeFi", related: ["Yield Farming", "Liquidity Pool"] },
    { term: "Zero-Knowledge Oracle", def: "An oracle providing data to smart contracts with privacy guarantees.", category: "Tech", related: ["Zero-Knowledge", "Oracle"] },
    { term: "Aave", def: "A DeFi protocol for lending and borrowing with flash loans.", category: "DeFi", related: ["Lending Protocol", "Flash Loan"] },
    { term: "Adaptive State Sharding", def: "A sharding method that adjusts based on network demand.", category: "Tech", related: ["Sharding", "Scalability"] },
    { term: "Address Poisoning", def: "A scam sending fake transactions to trick users into copying a malicious address.", category: "Tech", related: ["Phishing", "Scam"] },
    { term: "Adoption Rate", def: "The speed at which a crypto gains users and use cases.", category: "Basics", related: ["Network Effect", "Mainstream Adoption"] },
    { term: "Airdrop Hunter", def: "Someone who actively seeks out airdrops to earn free tokens.", category: "Slang", related: ["Airdrop Farming", "Token Distribution"] },
    { term: "Algorithmic Peg", def: "A stablecoin peg maintained through automated mechanisms.", category: "DeFi", related: ["Stablecoin", "Peg Drift"] },
    { term: "Alpha Strategy", def: "A trading strategy aiming to outperform the market.", category: "Trading", related: ["Market Neutral", "Hedge"] },
    { term: "AMM Curve", def: "The mathematical formula determining prices in an Automated Market Maker.", category: "DeFi", related: ["AMM", "Liquidity Pool"] },
    { term: "Anti-Dilution", def: "A mechanism to protect early investors from token supply increases.", category: "DeFi", related: ["Tokenomics", "Vesting"] },
    { term: "Arbitrage Spread", def: "The price difference between markets that can be exploited for profit.", category: "Trading", related: ["Arbitrage", "Spread"] },
    { term: "Asset Tokenization", def: "Converting real-world assets into blockchain tokens.", category: "Basics", related: ["Tokenized Asset", "Fractional Ownership"] },
    { term: "Asymmetric Risk", def: "A trade with a higher potential reward than risk.", category: "Trading", related: ["Risk Management", "Reward"] },
    { term: "Atomic Transaction", def: "A transaction that either fully completes or fails entirely.", category: "Tech", related: ["Atomicity", "Smart Contract"] },
    { term: "Attack Surface", def: "The potential vulnerabilities in a blockchain system.", category: "Tech", related: ["Security", "Exploit"] },
    { term: "Auto-Compounding", def: "Automatically reinvesting staking rewards to increase returns.", category: "DeFi", related: ["Compound Interest", "Staking"] },
    { term: "Automated Governance", def: "A system where governance decisions are executed via code.", category: "DeFi", related: ["DAO", "Smart Contract"] },
    { term: "Backrunning", def: "Placing a transaction immediately after a target transaction to profit.", category: "Trading", related: ["Frontrun", "MEV"] },
    { term: "Balanced Portfolio", def: "A crypto portfolio diversified to minimize risk.", category: "Trading", related: ["Diversification", "Risk Management"] },
    { term: "Base Protocol", def: "The foundational layer of a blockchain system.", category: "Tech", related: ["Layer 1", "Settlement Layer"] },
    { term: "Bearish Trend", def: "A sustained downward price movement in the market.", category: "Trading", related: ["Bear Market", "Trend"] },
    { term: "Binance Smart Chain", def: "A blockchain by Binance for fast, low-cost transactions.", category: "Tech", related: ["BEP-20", "DEX"] },
    { term: "Block Confirmation", def: "The number of blocks added after a transaction, confirming its validity.", category: "Tech", related: ["Confirmation", "Finality"] },
    { term: "Block Producer", def: "A node responsible for creating new blocks in a blockchain.", category: "Tech", related: ["Miner", "Validator"] },
    { term: "Block Size", def: "The maximum data capacity of a single block.", category: "Tech", related: ["Block", "Scalability"] },
    { term: "Block Validation", def: "The process of verifying a block’s transactions and integrity.", category: "Tech", related: ["Consensus", "Validator"] },
    { term: "Blockchain Analysis", def: "Studying on-chain data to track transactions or users.", category: "Tech", related: ["On-Chain Analysis", "Heuristic Analysis"] },
    { term: "Bond Curve", def: "A pricing model for tokens based on supply and demand dynamics.", category: "DeFi", related: ["Bonding Curve", "Tokenomics"] },
    { term: "Botsnipe", def: "Using a bot to quickly buy tokens at launch for profit.", category: "Slang", related: ["Sniper Bot", "Snipe"] },
    { term: "Breakout Strategy", def: "A trading approach to profit from price movements beyond key levels.", category: "Trading", related: ["Breakout", "TA"] },
    { term: "Bridging Fee", def: "The cost to transfer assets between blockchains via a bridge.", category: "Tech", related: ["Cross-Chain Bridge", "Fee"] },
    { term: "Bullish Trend", def: "A sustained upward price movement in the market.", category: "Trading", related: ["Bull Market", "Trend"] },
    { term: "Burn Address", def: "A wallet address used to permanently remove tokens from circulation.", category: "Tech", related: ["Token Burn", "Deflation"] },
    { term: "Buy Pressure", def: "Increased demand for a crypto, pushing its price up.", category: "Trading", related: ["Sell Pressure", "Demand"] },
    { term: "Byzantine Agreement", def: "A consensus method ensuring agreement despite faulty nodes.", category: "Tech", related: ["Byzantine Fault", "Consensus"] },
    { term: "Capital Lockup", def: "Funds locked in a protocol for a set period, often for staking.", category: "DeFi", related: ["Lockup Period", "Staking"] },
    { term: "Cascading Liquidation", def: "A chain reaction of liquidations due to falling prices.", category: "Trading", related: ["Liquidation", "Leverage"] },
    { term: "Chain ID", def: "A unique identifier for a blockchain to prevent replay attacks.", category: "Tech", related: ["Replay Attack", "Fork"] },
    { term: "Chainlink CCIP", def: "Chainlink’s Cross-Chain Interoperability Protocol for secure data transfer.", category: "Tech", related: ["Chainlink", "Cross-Chain"] },
    { term: "Checkpointing", def: "Saving a blockchain’s state at intervals for recovery or verification.", category: "Tech", related: ["Checkpoint", "Security"] },
    { term: "Circuit Breaker Fee", def: "A fee to pause trading during extreme market conditions.", category: "Trading", related: ["Circuit Breaker", "Volatility"] },
    { term: "Cloud Mining", def: "Renting mining power from a remote data center.", category: "Tech", related: ["Mining Contract", "Mining"] },
    { term: "Code Is Law", def: "The principle that smart contract code defines the rules in DeFi.", category: "Basics", related: ["Smart Contract", "Decentralization"] },
    { term: "Collateral Factor", def: "The percentage of an asset’s value that can be borrowed in DeFi.", category: "DeFi", related: ["Collateral", "Lending Protocol"] },
    { term: "Collateral Liquidation", def: "Selling off collateral to cover a defaulted DeFi loan.", category: "DeFi", related: ["Liquidation", "Collateral"] },
    { term: "Community Token", def: "A token distributed to a project’s community for engagement.", category: "Basics", related: ["Airdrop", "Governance Token"] },
    { term: "Compound", def: "A DeFi protocol for lending and borrowing with auto-compounding.", category: "DeFi", related: ["Aave", "Lending Protocol"] },
    { term: "Consensus Attack", def: "An attempt to disrupt a blockchain’s agreement process.", category: "Tech", related: ["51% Attack", "Security"] },
    { term: "Constant Product Formula", def: "The pricing model used by AMMs like Uniswap.", category: "DeFi", related: ["AMM Curve", "Liquidity Pool"] },
    { term: "Contract Upgrade", def: "Updating a smart contract’s code while preserving its state.", category: "Tech", related: ["Upgradeability", "Proxy Contract"] },
    { term: "Convergence Trading", def: "A strategy exploiting price differences until they align.", category: "Trading", related: ["Arbitrage", "Market Efficiency"] },
    { term: "Cooperative Mining", def: "Miners working together to share rewards and reduce variance.", category: "Tech", related: ["Mining Pool", "Block Reward"] },
    { term: "Counterparty Risk", def: "The risk that the other party in a trade fails to fulfill their obligation.", category: "Trading", related: ["Risk", "CEX"] },
    { term: "Cross-Chain Messaging", def: "Sending data or instructions between blockchains.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "Cross-Margining", def: "Using a single pool of funds to cover multiple trading positions.", category: "Trading", related: ["Cross Margin", "Leverage"] },
    { term: "Crypto Arbitrage", def: "Profiting from price differences across crypto exchanges.", category: "Trading", related: ["Arbitrage", "Spread"] },
    { term: "Crypto Collateral", def: "Using crypto assets as collateral for loans in DeFi.", category: "DeFi", related: ["Collateral", "Lending Protocol"] },
    { term: "Crypto Derivative", def: "A financial contract based on the price of a crypto asset.", category: "Trading", related: ["Derivatives", "Futures"] },
    { term: "Crypto Escrow", def: "A third-party service holding crypto until trade conditions are met.", category: "Trading", related: ["Escrow", "P2P"] },
    { term: "Crypto Lending", def: "Lending crypto assets to earn interest in DeFi.", category: "DeFi", related: ["Lending Protocol", "Yield"] },
    { term: "Crypto Staking", def: "Locking crypto to support a network and earn rewards.", category: "DeFi", related: ["Staking", "Proof of Stake"] },
    { term: "Crypto Volatility", def: "The degree of price fluctuation in a crypto asset.", category: "Trading", related: ["Volatility", "Risk"] },
    { term: "Custodial Risk", def: "The risk of losing funds held by a third-party custodian.", category: "Trading", related: ["Custodial", "Security"] },
    { term: "DAI", def: "A decentralized stablecoin pegged to the USD, created by MakerDAO.", category: "DeFi", related: ["MakerDAO", "Stablecoin"] },
    { term: "Dark Pool Trading", def: "Executing large trades privately to avoid market impact.", category: "Trading", related: ["Dark Pool", "Whale"] },
    { term: "Data Sharding", def: "Splitting blockchain data into smaller parts for efficiency.", category: "Tech", related: ["Sharding", "Scalability"] },
    { term: "Death Cross", def: "A bearish signal when a short-term moving average crosses below a long-term one.", category: "Trading", related: ["Golden Cross", "TA"] },
    { term: "Decentralized Governance", def: "A system where decisions are made by token holders.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Decentralized Marketplace", def: "A peer-to-peer platform for trading goods or services.", category: "Tech", related: ["P2P", "DEX"] },
    { term: "DeFi Exploit", def: "A hack or attack targeting vulnerabilities in a DeFi protocol.", category: "DeFi", related: ["Security", "Smart Contract"] },
    { term: "DeFi Insurance", def: "A protocol offering protection against DeFi risks like hacks.", category: "DeFi", related: ["Insurance", "Risk"] },
    { term: "DeFi Yield", def: "The return earned from DeFi activities like staking or lending.", category: "DeFi", related: ["Yield", "Passive Income"] },
    { term: "Delegated Validator", def: "A validator chosen by token holders to secure a network.", category: "Tech", related: ["Delegated Proof of Stake", "Validator"] },
    { term: "Demand Shock", def: "A sudden increase in demand causing a price spike.", category: "Trading", related: ["Supply Shock", "Volatility"] },
    { term: "Deterministic Outcome", def: "A predictable result from a smart contract execution.", category: "Tech", related: ["Smart Contract", "Code Is Law"] },
    { term: "DEX Volume", def: "The total trading volume on a decentralized exchange.", category: "DeFi", related: ["DEX", "Trade Volume"] },
    { term: "Digital Collectible", def: "A unique digital item, often an NFT, with collectible value.", category: "Tech", related: ["NFT", "Crypto Kitty"] },
    { term: "Dispute Resolution", def: "A mechanism to resolve conflicts in decentralized systems.", category: "DeFi", related: ["Oracle", "Governance"] },
    { term: "Distributed Key Generation", def: "A method to create cryptographic keys across multiple parties.", category: "Tech", related: ["Multi-Party Computation", "Security"] },
    { term: "Divergent Fork", def: "A fork creating two incompatible blockchain versions.", category: "Tech", related: ["Hard Fork", "Chain Split"] },
    { term: "Dumping Pressure", def: "Increased selling activity causing a price drop.", category: "Trading", related: ["Buy Pressure", "Dumping"] },
    { term: "Dynamic Pricing", def: "Adjusting token prices based on real-time market conditions.", category: "DeFi", related: ["Bond Curve", "Tokenomics"] },
    { term: "Early Adopter", def: "A user who joins a crypto project in its initial stages.", category: "Basics", related: ["Crypto Native", "OG"] },
    { term: "Economic Incentive", def: "A reward system to encourage network participation.", category: "Tech", related: ["Incentive Mechanism", "Game Theory"] },
    { term: "Ecosystem Fund", def: "A pool of funds to support a crypto project’s development.", category: "Basics", related: ["Treasury", "Governance"] },
    { term: "Elastic Peg", def: "A flexible peg allowing a stablecoin to adjust its value slightly.", category: "DeFi", related: ["Stablecoin", "Peg Drift"] },
    { term: "Emergency Shutdown", def: "A protocol feature to halt operations in a crisis.", category: "Tech", related: ["Kill Switch", "Security"] },
    { term: "Emission Schedule", def: "The planned release of new tokens over time.", category: "Tech", related: ["Emission Rate", "Tokenomics"] },
    { term: "End-to-End Encryption", def: "A security method ensuring data is only readable by sender and receiver.", category: "Tech", related: ["Encryption", "Privacy"] },
    { term: "ENS", def: "Ethereum Name Service; a system for human-readable blockchain addresses.", category: "Tech", related: ["Ethereum Name Service", "Address"] },
    { term: "Equity Stake", def: "A token representing ownership in a project or company.", category: "Basics", related: ["Equity Token", "Security Token"] },
    { term: "Event Trigger", def: "A condition in a smart contract that activates an action.", category: "Tech", related: ["Smart Contract", "Oracle"] },
    { term: "Exchange Liquidity", def: "The availability of funds for trading on an exchange.", category: "Trading", related: ["Liquidity", "Order Book"] },
    { term: "Exit Liquidity Scam", def: "A scam where early investors sell to new buyers before abandoning the project.", category: "Slang", related: ["Exit Liquidity", "Rug Pull"] },
    { term: "Exponential Decay", def: "A token emission model where issuance decreases over time.", category: "Tech", related: ["Emission Schedule", "Tokenomics"] },
    { term: "Fair Distribution", def: "A token allocation method ensuring equitable access.", category: "Basics", related: ["Fair Launch", "Token Distribution"] },
    { term: "Farming Pool", def: "A liquidity pool where users stake tokens to earn rewards.", category: "DeFi", related: ["Liquidity Pool", "Yield Farming"] },
    { term: "Fee Rebate", def: "A refund or discount on trading fees to incentivize users.", category: "Trading", related: ["Maker Fee", "Taker Fee"] },
    { term: "Final Settlement", def: "The irreversible completion of a blockchain transaction.", category: "Tech", related: ["Finality", "Atomic Settlement"] },
    { term: "Flash Swap", def: "A DeFi swap where tokens are borrowed and repaid in one transaction.", category: "DeFi", related: ["Flash Loan", "Swap"] },
    { term: "Fork Resistance Mechanism", def: "A system to prevent unwanted blockchain forks.", category: "Tech", related: ["Fork Resistance", "Consensus"] },
    { term: "Fractional Reserve", def: "A system where an exchange holds only a portion of user funds.", category: "Trading", related: ["Proof of Reserves", "Custodial Risk"] },
    { term: "Fraud Proof", def: "A mechanism to challenge invalid transactions in a rollup.", category: "Tech", related: ["Optimistic Rollup", "Layer 2"] },
    { term: "Front-Running Bot", def: "A bot that exploits pending transactions for profit.", category: "Trading", related: ["Frontrun", "MEV"] },
    { term: "Funding Round", def: "A phase of raising capital for a crypto project.", category: "Basics", related: ["Seed Round", "Venture Capital"] },
    { term: "Game Theory", def: "The study of strategic decision-making in blockchain incentives.", category: "Tech", related: ["Incentive Alignment", "Economics"] },
    { term: "Gas Snapshot", def: "A record of gas prices at a specific time for analysis.", category: "Tech", related: ["Gas Price", "Ethereum"] },
    { term: "Governance Tokenomics", def: "The economic model of a governance token’s distribution and use.", category: "DeFi", related: ["Governance Token", "Tokenomics"] },
    { term: "Halving Event", def: "A scheduled reduction in block rewards, often in Bitcoin.", category: "Tech", related: ["Halving", "Block Reward"] },
    { term: "Hard Cap Sale", def: "A token sale with a maximum funding limit.", category: "Basics", related: ["Soft Cap", "ICO"] },
    { term: "Account Abstraction", def: "A blockchain feature allowing smart contracts to initiate transactions, simplifying user interactions.", category: "Tech", related: ["EIP-4337", "User Experience"] },
    { term: "Adverse Selection", def: "A situation in trading where one party has more information, leading to unfair trades.", category: "Trading", related: ["Information Asymmetry", "Market Risk"] },
    { term: "Airdrop Farming", def: "Strategically participating in multiple airdrops to maximize token rewards.", category: "DeFi", related: ["Airdrop", "Token Distribution"] },
    { term: "Alpha Leak", def: "When insider information about a crypto project is unintentionally revealed.", category: "Slang", related: ["Alpha", "Insider Trading"] },
    { term: "AMM Slippage", def: "The price difference in an Automated Market Maker trade due to low liquidity.", category: "DeFi", related: ["Slippage", "AMM"] },
    { term: "Anarcho-Capitalism", def: "A philosophy advocating for decentralized systems like crypto to replace centralized governance.", category: "Basics", related: ["Decentralization", "Libertarian"] },
    { term: "Anti-Fragility", def: "A blockchain’s ability to improve under stress or attacks.", category: "Tech", related: ["Resilience", "Security"] },
    { term: "Arbitrage Latency", def: "The time delay in executing arbitrage trades across exchanges.", category: "Trading", related: ["Arbitrage", "Latency"] },
    { term: "Asymmetric Encryption", def: "A cryptographic method using a public-private key pair for secure communication.", category: "Tech", related: ["Encryption", "Digital Signature"] },
    { term: "Atomic Settlement", def: "The instant and final settlement of a transaction on a blockchain.", category: "Tech", related: ["Finality", "Atomic Swap"] },
    { term: "Auction Mechanism", def: "A system for token sales where participants bid to determine the price.", category: "Basics", related: ["Dutch Auction", "Token Sale"] },
    { term: "Autonomous Agent", def: "A self-executing program on a blockchain performing tasks without human intervention.", category: "Tech", related: ["Smart Contract", "DAO"] },
    { term: "Baking", def: "The process of validating transactions in Tezos, similar to staking.", category: "Tech", related: ["Tezos", "Proof of Stake"] },
    { term: "Barter Token", def: "A token used for direct exchange of goods or services in a decentralized ecosystem.", category: "Basics", related: ["Utility Token", "P2P"] },
    { term: "Batch Auction", def: "A token sale where bids are collected and settled at a single clearing price.", category: "DeFi", related: ["Auction Mechanism", "Token Sale"] },
    { term: "Beacon Chain", def: "A core component of Ethereum 2.0 managing validators and consensus.", category: "Tech", related: ["Ethereum 2.0", "Proof of Stake"] },
    { term: "Bearish Engulfing", def: "A candlestick pattern signaling a potential price decline.", category: "Trading", related: ["Bullish Engulfing", "TA"] },
    { term: "BEP-20", def: "A token standard on Binance Smart Chain, similar to ERC-20.", category: "Tech", related: ["Binance Smart Chain", "Token Standard"] },
    { term: "Bid-Ask Spread", def: "The difference between the highest buy and lowest sell price in a market.", category: "Trading", related: ["Spread", "Liquidity"] },
    { term: "Blackpool", def: "A DeFi protocol focused on NFT market strategies and liquidity.", category: "DeFi", related: ["NFT", "Liquidity Pool"] },
    { term: "Block Finality", def: "The point at which a block is permanently added to the blockchain.", category: "Tech", related: ["Finality", "Consensus"] },
    { term: "Block Gas Limit", def: "The maximum amount of gas that can be used in a single block.", category: "Tech", related: ["Gas Limit", "Ethereum"] },
    { term: "Block Propagation", def: "The process of broadcasting a new block to all nodes in a network.", category: "Tech", related: ["Network Latency", "Node"] },
    { term: "Block Timestamp", def: "The recorded time when a block is mined on a blockchain.", category: "Tech", related: ["Block", "Mining"] },
    { term: "Bonded Staking", def: "Staking where tokens are locked for a fixed period to earn rewards.", category: "DeFi", related: ["Staking", "Lockup Period"] },
    { term: "Bottleneck", def: "A limitation in a blockchain’s capacity to process transactions.", category: "Tech", related: ["Scalability", "Throughput"] },
    { term: "Break-Even Point", def: "The price at which a trade neither gains nor loses value.", category: "Trading", related: ["Cost Basis", "ROI"] },
    { term: "Bridged Asset", def: "A token transferred from one blockchain to another via a bridge.", category: "Tech", related: ["Bridge", "Cross-Chain"] },
    { term: "Bullish Engulfing", def: "A candlestick pattern signaling a potential price increase.", category: "Trading", related: ["Bearish Engulfing", "TA"] },
    { term: "Burn Mechanism", def: "A system to reduce token supply by permanently removing tokens.", category: "Tech", related: ["Token Burn", "Deflationary Token"] },
    { term: "Call Option", def: "A contract giving the right to buy a crypto at a set price.", category: "Trading", related: ["Put Option", "Options"] },
    { term: "Capital Efficiency", def: "The ability to maximize returns with minimal locked capital in DeFi.", category: "DeFi", related: ["Liquidity", "Yield Farming"] },
    { term: "Censorship Attack", def: "An attempt to block or delay transactions on a blockchain.", category: "Tech", related: ["Censorship Resistance", "Security"] },
    { term: "Chain Agnostic", def: "A protocol or tool that operates across multiple blockchains.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "Chainlink VRF", def: "A verifiable random function by Chainlink for provably fair randomness.", category: "Tech", related: ["Chainlink", "Randomness"] },
    { term: "Circulating Market Cap", def: "The market cap based on a crypto’s circulating supply.", category: "Trading", related: ["Market Cap", "Circulating Supply"] },
    { term: "Clawback", def: "A mechanism to reclaim tokens or funds under specific conditions.", category: "Tech", related: ["Smart Contract", "Governance"] },
    { term: "Coin Age", def: "The time a coin has been held, often used in Proof of Stake.", category: "Tech", related: ["Proof of Stake", "Staking"] },
    { term: "Collateralized Debt Position", def: "A DeFi mechanism to borrow assets by locking collateral.", category: "DeFi", related: ["CDP", "MakerDAO"] },
    { term: "Commitment Scheme", def: "A cryptographic method to commit to a value while keeping it hidden.", category: "Tech", related: ["Zero-Knowledge", "Privacy"] },
    { term: "Compound Interest", def: "Interest earned on both the initial principal and accumulated interest.", category: "DeFi", related: ["APY", "Yield"] },
    { term: "Concentrated Liquidity", def: "Providing liquidity within a specific price range in AMMs.", category: "DeFi", related: ["Uniswap V3", "Liquidity Pool"] },
    { term: "Conditional Order", def: "A trade order executed only when specific conditions are met.", category: "Trading", related: ["Limit Order", "Stop Loss"] },
    { term: "Consensus Layer", def: "The part of a blockchain managing agreement among nodes.", category: "Tech", related: ["Consensus", "Beacon Chain"] },
    { term: "Continuous Auction", def: "A token sale where prices adjust dynamically based on demand.", category: "DeFi", related: ["Auction Mechanism", "Token Sale"] },
    { term: "Coordinated Attack", def: "A planned assault on a blockchain by multiple malicious actors.", category: "Tech", related: ["51% Attack", "Security"] },
    { term: "Cross-Chain Bridge", def: "A protocol enabling asset transfers between blockchains.", category: "Tech", related: ["Bridge", "Interoperability"] },
    { term: "Cross-Chain Swap", def: "A direct exchange of assets between two different blockchains.", category: "Tech", related: ["Atomic Swap", "Cross-Chain"] },
    { term: "Crypto Anarchist", def: "Someone advocating for crypto to achieve financial and political freedom.", category: "Slang", related: ["Anarcho-Capitalism", "Decentralization"] },
    { term: "Crypto Dusting", def: "Sending small amounts of crypto to track wallet activity.", category: "Tech", related: ["Dust Attack", "Privacy"] },
    { term: "Crypto Native", def: "A person or entity deeply integrated into the crypto ecosystem.", category: "Slang", related: ["OG", "Early Adopter"] },
    { term: "Crypto Vesting", def: "The gradual release of tokens to stakeholders over time.", category: "Basics", related: ["Vesting", "Token Allocation"] },
    { term: "Curve Finance", def: "A DeFi protocol for stablecoin swaps with low slippage.", category: "DeFi", related: ["Stablecoin", "AMM"] },
    { term: "Custody Solution", def: "A service for securely storing crypto assets, often for institutions.", category: "Tech", related: ["Custodial", "Security"] },
    { term: "Dark Pool Liquidity", def: "Hidden liquidity in private trading venues for large trades.", category: "Trading", related: ["Dark Pool", "Liquidity"] },
    { term: "Data Oracle", def: "A service providing off-chain data to smart contracts.", category: "Tech", related: ["Oracle", "Chainlink"] },
    { term: "Decentralized Storage", def: "A system for storing data across a distributed network.", category: "Tech", related: ["IPFS", "Filecoin"] },
    { term: "DeFi Aggregator", def: "A platform that optimizes DeFi yields across multiple protocols.", category: "DeFi", related: ["Yield Aggregator", "DeFi"] },
    { term: "DeFi Blue Chip", def: "A well-established DeFi project with a strong reputation.", category: "DeFi", related: ["Blue Chip", "Market Cap"] },
    { term: "Delegated Staking", def: "Staking through a delegate who manages the process for you.", category: "DeFi", related: ["Staking", "Validator"] },
    { term: "Delta Neutral", def: "A trading strategy aiming to offset price movement risks.", category: "Trading", related: ["Hedge", "Risk Management"] },
    { term: "Deterministic Wallet", def: "A wallet where private keys are generated from a single seed.", category: "Tech", related: ["Seed Phrase", "Wallet"] },
    { term: "DEX Liquidity", def: "The pool of funds available for trading on a decentralized exchange.", category: "DeFi", related: ["Liquidity Pool", "DEX"] },
    { term: "Digital Asset", def: "A broad term for any asset existing in digital form on a blockchain.", category: "Basics", related: ["Crypto Asset", "Token"] },
    { term: "Distributed Consensus", def: "The process of achieving agreement in a decentralized network.", category: "Tech", related: ["Consensus", "Nakamoto Consensus"] },
    { term: "Divergence Trading", def: "A strategy using divergence between price and indicators.", category: "Trading", related: ["Divergence", "TA"] },
    { term: "Doji Candle", def: "A candlestick pattern indicating market indecision.", category: "Trading", related: ["Candlestick", "TA"] },
    { term: "Double Bottom", def: "A chart pattern signaling a potential price reversal upward.", category: "Trading", related: ["Double Top", "TA"] },
    { term: "Double Top", def: "A chart pattern signaling a potential price reversal downward.", category: "Trading", related: ["Double Bottom", "TA"] },
    { term: "Dutch Auction", def: "A token sale where the price decreases until sold or the auction ends.", category: "DeFi", related: ["Auction Mechanism", "Token Sale"] },
    { term: "Dynamic Minting", def: "Creating tokens based on real-time demand or conditions.", category: "Tech", related: ["Minting", "Tokenomics"] },
    { term: "Eclipse Attack", def: "An attack isolating a node by controlling its network connections.", category: "Tech", related: ["Security", "Network Attack"] },
    { term: "Economic Abstraction", def: "Allowing users to pay transaction fees in any token.", category: "Tech", related: ["Gas", "User Experience"] },
    { term: "EIP-4337", def: "An Ethereum proposal for account abstraction without protocol changes.", category: "Tech", related: ["Account Abstraction", "Ethereum"] },
    { term: "Elastic Supply", def: "A token supply that adjusts based on market conditions.", category: "Tech", related: ["Rebase", "Tokenomics"] },
    { term: "Elliptic Curve", def: "A cryptographic method used in blockchain for secure key generation.", category: "Tech", related: ["Asymmetric Encryption", "Security"] },
    { term: "Endgame", def: "Slang for a crypto project’s ultimate goal or final phase.", category: "Slang", related: ["Roadmap", "Vision"] },
    { term: "Epoch", def: "A fixed time period in a blockchain for events like staking rewards.", category: "Tech", related: ["Staking", "Consensus"] },
    { term: "Escrow Lock", def: "Funds held in escrow until predefined conditions are met.", category: "Tech", related: ["Escrow", "Smart Contract"] },
    { term: "Execution Layer", def: "The part of a blockchain handling transaction processing.", category: "Tech", related: ["Consensus Layer", "Ethereum 2.0"] },
    { term: "Exit Fee", def: "A fee charged when withdrawing funds from a DeFi protocol.", category: "DeFi", related: ["Liquidity Pool", "Fee"] },
    { term: "Exponential Growth", def: "A rapid increase in a crypto’s price or adoption.", category: "Trading", related: ["Rally", "Adoption Curve"] },
    { term: "Fair Value", def: "The theoretical price of a crypto based on fundamentals.", category: "Trading", related: ["Market Price", "Valuation"] },
    { term: "Farming Strategy", def: "A plan to maximize DeFi yield farming returns.", category: "DeFi", related: ["Yield Farming", "Liquidity Mining"] },
    { term: "Fee Burn", def: "Burning a portion of transaction fees to reduce token supply.", category: "Tech", related: ["Burn Mechanism", "EIP-1559"] },
    { term: "Fee Structure", def: "The breakdown of fees charged by a crypto platform.", category: "Basics", related: ["Transaction Fee", "Gas"] },
    { term: "Filecoin", def: "A decentralized storage network rewarding users for hosting data.", category: "Tech", related: ["Decentralized Storage", "IPFS"] },
    { term: "Flash Minting", def: "Temporarily creating tokens for a DeFi transaction, then burning them.", category: "DeFi", related: ["Flash Loan", "Minting"] },
    { term: "Fork Choice Rule", def: "The algorithm a blockchain uses to select the canonical chain.", category: "Tech", related: ["Chain Reorg", "Consensus"] },
    { term: "Fractional Ownership", def: "Dividing ownership of an asset into tokenized shares.", category: "DeFi", related: ["Tokenization", "NFT"] },
    { term: "Frontier Market", def: "An emerging crypto market with high risk and potential.", category: "Trading", related: ["Micro Cap", "Speculation"] },
    { term: "FUD Campaign", def: "A coordinated effort to spread fear and doubt about a crypto.", category: "Slang", related: ["FUD", "Market Manipulation"] },
    { term: "Fully Diluted Value", def: "The market cap if all possible tokens were in circulation.", category: "Trading", related: ["Market Cap", "Total Supply"] },
    { term: "Fungible Token", def: "A token where each unit is interchangeable with another.", category: "Basics", related: ["Non-Fungible", "Token"] },
    { term: "Gas Optimization", def: "Techniques to reduce the gas cost of Ethereum transactions.", category: "Tech", related: ["Gas", "Smart Contract"] },
    { term: "Gas Station Network", def: "A system allowing third parties to pay gas fees for users.", category: "Tech", related: ["Meta Transaction", "Gasless"] },
    { term: "Gini Coefficient", def: "A measure of token distribution inequality in a crypto ecosystem.", category: "Tech", related: ["Tokenomics", "Distribution"] },
    { term: "Golden Cross", def: "A bullish signal when a short-term moving average crosses above a long-term one.", category: "Trading", related: ["Death Cross", "TA"] },
    { term: "Governance Attack", def: "Manipulating a DAO’s voting process to control decisions.", category: "DeFi", related: ["DAO", "Governance"] },
    { term: "Griefing", def: "An attack where a user intentionally causes harm without direct profit.", category: "Tech", related: ["Security", "Attack Vector"] },
    { term: "Hard Stop", def: "A strict price level to exit a trade to limit losses.", category: "Trading", related: ["Stop Loss", "Risk Management"] },
    { term: "Hash Lock", def: "A cryptographic lock requiring a hash to unlock a transaction.", category: "Tech", related: ["Atomic Swap", "Security"] },
    { term: "Head and Shoulders", def: "A chart pattern predicting a trend reversal.", category: "Trading", related: ["TA", "Reversal Pattern"] },
    { term: "Hedge Fund", def: "A fund using advanced strategies to invest in crypto markets.", category: "Trading", related: ["Institutional Investor", "Speculation"] },
    { term: "Heuristic Analysis", def: "Using patterns to identify wallet ownership or transaction origins.", category: "Tech", related: ["Privacy", "Blockchain Analysis"] },
    { term: "HFT", def: "High-Frequency Trading; rapid trades to exploit small price differences.", category: "Trading", related: ["Algo Trading", "Scalping"] },
    { term: "Honeypot Contract", def: "A smart contract designed to trap malicious actors.", category: "Tech", related: ["Security", "Honeypot"] },
    { term: "Hot Potato", def: "Slang for a crypto being rapidly traded during a price surge.", category: "Slang", related: ["Pump", "Volatility"] },
    { term: "Hybrid DEX", def: "A decentralized exchange combining on-chain and off-chain elements.", category: "DeFi", related: ["DEX", "Liquidity"] },
    { term: "Hyperledger", def: "An open-source framework for enterprise blockchain solutions.", category: "Tech", related: ["Enterprise Blockchain", "Permissioned Ledger"] },
    { term: "Iceberg Order", def: "A large order split into smaller, hidden parts to avoid market impact.", category: "Trading", related: ["Order Book", "Whale"] },
    { term: "Illiquid Market", def: "A market with low trading volume, leading to high price swings.", category: "Trading", related: ["Liquidity", "Volatility"] },
    { term: "Immutable Code", def: "Smart contract code that cannot be altered after deployment.", category: "Tech", related: ["Immutability", "Smart Contract"] },
    { term: "Incentive Alignment", def: "Designing rewards to encourage desired behavior in a network.", category: "Tech", related: ["Incentive Mechanism", "Game Theory"] },
    { term: "Inflation Hedge", def: "Using crypto to protect against currency devaluation.", category: "Trading", related: ["Store of Value", "Bitcoin"] },
    { term: "Initial Liquidity Offering", def: "A token sale providing immediate liquidity on a DEX.", category: "DeFi", related: ["IDO", "Liquidity Pool"] },
    { term: "Interledger Protocol", def: "A protocol for connecting different payment networks.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "Intrinsic Value", def: "The perceived fundamental value of a crypto based on its utility.", category: "Trading", related: ["Fair Value", "Valuation"] },
    { term: "IPFS", def: "InterPlanetary File System; a decentralized protocol for file storage.", category: "Tech", related: ["Decentralized Storage", "Filecoin"] },
    { term: "Karma System", def: "A reputation mechanism in DAOs to reward positive contributions.", category: "DeFi", related: ["Governance", "DAO"] },
    { term: "Key Derivation", def: "Generating cryptographic keys from a single master key.", category: "Tech", related: ["Deterministic Wallet", "Seed Phrase"] },
    { term: "Kill Switch", def: "A mechanism to halt a smart contract in emergencies.", category: "Tech", related: ["Smart Contract", "Security"] },
    { term: "L2 Scaling", def: "Layer 2 solutions to improve blockchain scalability.", category: "Tech", related: ["Layer 2", "Rollup"] },
    { term: "Lending Protocol", def: "A DeFi platform for lending and borrowing crypto assets.", category: "DeFi", related: ["Aave", "Compound"] },
    { term: "Leveraged Token", def: "A token that amplifies price movements using leverage.", category: "Trading", related: ["Leverage", "Derivatives"] },

  // Advanced (Slang category as a placeholder for advanced)
  { term: "APR", def: "Annual Percentage Rate; the yearly return on an investment without compounding.", category: "DeFi", related: ["APY", "Yield"] },
    { term: "Arbitrage Opportunity", def: "A chance to profit from price differences across markets.", category: "Trading", related: ["Arbitrage", "Spread"] },
    { term: "Asset-Backed Token", def: "A token representing ownership of a physical or digital asset.", category: "Basics", related: ["Security Token", "Tokenization"] },
    { term: "Attack Vector", def: "A method used to exploit vulnerabilities in a blockchain.", category: "Tech", related: ["Security", "Exploit"] },
    { term: "Automated Trading", def: "Using software to execute trades based on predefined rules.", category: "Trading", related: ["Algo Trading", "Trading Bot"] },
    { term: "Backtest", def: "Testing a trading strategy using historical data.", category: "Trading", related: ["Algo Trading", "Strategy"] },
    { term: "Bags", def: "Slang for holding a large amount of a declining crypto.", category: "Slang", related: ["Bagholder", "Loss"] },
    { term: "Base Fee", def: "A minimum fee for Ethereum transactions, adjusted dynamically.", category: "Tech", related: ["Gas Price", "EIP-1559"] },
    { term: "Beta", def: "A measure of a crypto’s volatility compared to the market.", category: "Trading", related: ["Alpha", "Volatility"] },
    { term: "Bifurcation", def: "A split in a blockchain due to protocol changes.", category: "Tech", related: ["Fork", "Chain Split"] },
    { term: "Block Subsidy", def: "The reward given to miners for creating a new block.", category: "Tech", related: ["Block Reward", "Mining"] },
    { term: "Blockchain Trilemma", def: "The challenge of balancing security, scalability, and decentralization.", category: "Tech", related: ["Scalability", "Decentralization"] },
    { term: "Blue Chip", def: "A well-established, stable cryptocurrency like Bitcoin.", category: "Trading", related: ["Market Cap", "Stability"] },
    { term: "Bollinger Bands", def: "A trading indicator showing price volatility and potential reversals.", category: "Trading", related: ["TA", "Volatility"] },
    { term: "Bonding Curve", def: "A mathematical model for pricing tokens based on supply.", category: "DeFi", related: ["Tokenomics", "Liquidity"] },
    { term: "Bot Trading", def: "Using automated bots to execute crypto trades.", category: "Trading", related: ["Algo Trading", "Automation"] },
    { term: "BTD", def: "Buy The Dip; a strategy to purchase during price drops.", category: "Slang", related: ["DCA", "Dip"] },
    { term: "Burn Rate", def: "The speed at which a project spends its token supply or funds.", category: "Basics", related: ["Token Burn", "Tokenomics"] },
    { term: "Buy Wall", def: "A large number of buy orders at a specific price level.", category: "Trading", related: ["Sell Wall", "Order Book"] },
    { term: "Byzantine Fault", def: "A failure in a distributed system due to malicious actors.", category: "Tech", related: ["BFT", "Consensus"] },
    { term: "CAGR", def: "Compound Annual Growth Rate; a measure of yearly investment growth.", category: "Trading", related: ["ROI", "Profit"] },
    { term: "Canary Network", def: "A test network for trialing blockchain upgrades.", category: "Tech", related: ["Testnet", "Mainnet"] },
    { term: "Capital Gains", def: "Profit from selling a crypto asset at a higher price.", category: "Trading", related: ["Tax", "ROI"] },
    { term: "CeFi", def: "Centralized Finance; traditional financial systems in crypto.", category: "Basics", related: ["DeFi", "CEX"] },
    { term: "Chain Reorg", def: "A blockchain reorganization due to a longer chain being adopted.", category: "Tech", related: ["Fork", "Consensus"] },
    { term: "Checkpoint", def: "A point in the blockchain used to verify its integrity.", category: "Tech", related: ["Block Height", "Security"] },
    { term: "Circuit Breaker", def: "A mechanism to halt trading during extreme volatility.", category: "Trading", related: ["Volatility", "Crash"] },
    { term: "Coin Swap", def: "Exchanging one cryptocurrency for another.", category: "Trading", related: ["Swap", "DEX"] },
    { term: "Cold Minting", def: "Creating tokens offline for added security.", category: "Tech", related: ["Minting", "Cold Storage"] },
    { term: "Collateral Ratio", def: "The ratio of collateral to borrowed funds in DeFi.", category: "DeFi", related: ["Collateral", "Liquidation"] },
    { term: "Community Governance", def: "A system where token holders vote on protocol changes.", category: "DeFi", related: ["Governance Token", "DAO"] },
    { term: "Composability", def: "The ability of DeFi protocols to work together seamlessly.", category: "DeFi", related: ["Interoperability", "DeFi"] },
    { term: "Confirmation Time", def: "The time it takes for a transaction to be confirmed.", category: "Tech", related: ["Block Time", "Throughput"] },
    { term: "Consensus Mechanism", def: "A system for nodes to agree on the blockchain’s state.", category: "Tech", related: ["Proof of Work", "Proof of Stake"] },
    { term: "Consolidation", def: "A period of stable prices after a big move.", category: "Trading", related: ["Sideways Market", "Volatility"] },
    { term: "Contract Address", def: "The address of a smart contract on a blockchain.", category: "Tech", related: ["Smart Contract", "Address"] },
    { term: "Correction", def: "A short-term price decline after a rapid increase.", category: "Trading", related: ["Volatility", "Rally"] },
    { term: "Cost Basis", def: "The original price paid for a crypto asset.", category: "Trading", related: ["Capital Gains", "Tax"] },
    { term: "Crowdsale", def: "A public sale of tokens to raise funds for a project.", category: "Basics", related: ["ICO", "Token Sale"] },
    { term: "Crypto Asset", def: "A digital asset secured by cryptography on a blockchain.", category: "Basics", related: ["Token", "Coin"] },
    { term: "Crypto Broker", def: "An intermediary facilitating crypto trades for a fee.", category: "Trading", related: ["CEX", "Broker"] },
    { term: "Crypto Faucet", def: "A site giving small amounts of crypto for free.", category: "Basics", related: ["Faucet", "Testnet"] },
    { term: "Crypto Index", def: "A benchmark tracking the performance of multiple cryptos.", category: "Trading", related: ["Index Fund", "Market Cap"] },
    { term: "Crypto Kitty", def: "A popular NFT game on Ethereum involving digital cats.", category: "Tech", related: ["NFT", "DApp"] },
    { term: "Crypto Portfolio", def: "A collection of crypto assets held by an investor.", category: "Trading", related: ["Diversification", "Holdings"] },
    { term: "Crypto Swap", def: "A platform for exchanging one crypto for another.", category: "DeFi", related: ["Swap", "DEX"] },
    { term: "DAG", def: "Directed Acyclic Graph; an alternative to traditional blockchains.", category: "Tech", related: ["Tangle", "Scalability"] },
    { term: "Dark Web", def: "A hidden part of the internet often associated with crypto payments.", category: "Tech", related: ["Privacy", "Anonymity"] },
    { term: "Data Availability", def: "Ensuring blockchain data is accessible to all nodes.", category: "Tech", related: ["Scalability", "Layer 2"] },
    { term: "DDoS", def: "Distributed Denial of Service; an attack to overwhelm a network.", category: "Tech", related: ["Security", "Attack Vector"] },
    { term: "Decentralized Oracle", def: "A system providing external data to smart contracts.", category: "Tech", related: ["Oracle", "Chainlink"] },
    { term: "DeFi Staking", def: "Locking tokens in a DeFi protocol to earn rewards.", category: "DeFi", related: ["Staking", "Yield"] },
    { term: "Demo Account", def: "A practice account for trading without real funds.", category: "Trading", related: ["Paper Trading", "Practice"] },
    { term: "Difficulty Bomb", def: "A mechanism to increase mining difficulty over time.", category: "Tech", related: ["Ethereum", "Proof of Work"] },
    { term: "Digital Signature", def: "A cryptographic method to verify transaction authenticity.", category: "Tech", related: ["Private Key", "Security"] },
    { term: "Dip Buy", def: "Purchasing crypto during a temporary price drop.", category: "Trading", related: ["BTD", "DCA"] },
    { term: "Diversification", def: "Spreading investments across multiple assets to reduce risk.", category: "Trading", related: ["Portfolio", "Risk Management"] },
    { term: "Dumping Ground", def: "Slang for a market where investors sell off losing assets.", category: "Slang", related: ["Dump", "Bear Market"] },
    { term: "Dust Transaction", def: "A transaction involving a very small amount of crypto.", category: "Tech", related: ["Dust", "Microtransaction"] },
    { term: "Dynamic Fee", def: "A transaction fee that adjusts based on network demand.", category: "Tech", related: ["Base Fee", "Gas Price"] },
    { term: "EIP-1559", def: "An Ethereum upgrade introducing a base fee and burn mechanism.", category: "Tech", related: ["Base Fee", "Ethereum"] },
    { term: "Emission Rate", def: "The rate at which new tokens are created in a network.", category: "Tech", related: ["Tokenomics", "Supply"] },
    { term: "Equity Token", def: "A token representing ownership in a company or project.", category: "Basics", related: ["Security Token", "Tokenization"] },
    { term: "Ethereum Name Service", def: "A system for assigning human-readable names to Ethereum addresses.", category: "Tech", related: ["ENS", "Address"] },
    { term: "Event-Driven Trading", def: "Trading based on specific market events or news.", category: "Trading", related: ["News Trading", "Volatility"] },
    { term: "Exit Scam", def: "A scam where developers abandon a project after raising funds.", category: "Slang", related: ["Rug Pull", "Scam"] },
    { term: "Fair Launch", def: "A token launch with no pre-mine or private sale.", category: "Basics", related: ["ICO", "Token Sale"] },
    { term: "Fakeout", def: "A false price breakout that quickly reverses.", category: "Trading", related: ["Breakout", "Volatility"] },
    { term: "Farming Rewards", def: "Tokens earned by providing liquidity in DeFi.", category: "DeFi", related: ["Liquidity Mining", "Yield Farming"] },
    { term: "Fat Finger", def: "A trading error caused by a typo in the order amount.", category: "Slang", related: ["Error", "Trade"] },
    { term: "Fee Market", def: "A system where users compete to pay higher transaction fees.", category: "Tech", related: ["Dynamic Fee", "Gas War"] },
    { term: "Fiat Peg", def: "A crypto’s value tied to a fiat currency like USD.", category: "Basics", related: ["Stablecoin", "Peg"] },
    { term: "Finality", def: "The assurance that a blockchain transaction cannot be reversed.", category: "Tech", related: ["Confirmation", "Immutability"] },
    { term: "Flash Crash", def: "A sudden and severe price drop in the market.", category: "Trading", related: ["Volatility", "Crash"] },
    { term: "Fork Resistance", def: "A blockchain’s ability to prevent unwanted forks.", category: "Tech", related: ["Fork", "Security"] },
    { term: "Frontrun", def: "Executing a trade before a known large transaction.", category: "Trading", related: ["Front Running", "MEV"] },
    { term: "Full Node", def: "A node that stores the entire blockchain history.", category: "Tech", related: ["Light Node", "Node"] },
    { term: "Funding Rate", def: "A fee in perpetual futures to balance long and short positions.", category: "Trading", related: ["Futures", "Leverage"] },
    { term: "Gas Refund", def: "A partial return of gas fees for certain Ethereum transactions.", category: "Tech", related: ["Gas", "EIP-1559"] },
    { term: "Governance Proposal", def: "A suggested change to a protocol voted on by token holders.", category: "DeFi", related: ["Governance Token", "DAO"] },
    { term: "Green Candle", def: "A candlestick showing a price increase.", category: "Trading", related: ["Red Candle", "Candlestick"] },
    { term: "Hard Peg", def: "A strict fixed exchange rate between a crypto and another asset.", category: "Basics", related: ["Soft Peg", "Stablecoin"] },
    { term: "Hash Power", def: "The computational power used to mine and secure a blockchain.", category: "Tech", related: ["Hashrate", "Mining"] },
    { term: "Hedge", def: "A strategy to reduce risk by taking an offsetting position.", category: "Trading", related: ["Risk Management", "Derivatives"] },
    { term: "High-Frequency Trading", def: "Rapid, automated trading to exploit small price changes.", category: "Trading", related: ["Algo Trading", "Bot Trading"] },
    { term: "Honeypot Scam", def: "A fraudulent project designed to lure and trap investors.", category: "Slang", related: ["Exit Scam", "Scam"] },
    { term: "Hot Swap", def: "Quickly exchanging one crypto for another online.", category: "Trading", related: ["Swap", "Hot Wallet"] },
    { term: "Hybrid Blockchain", def: "A blockchain combining public and private features.", category: "Tech", related: ["Public Blockchain", "Private Blockchain"] },
    { term: "ICO Whitelist", def: "A list of pre-approved participants for a token sale.", category: "Basics", related: ["ICO", "Whitelisting"] },
    { term: "Immutable Ledger", def: "A blockchain record that cannot be altered.", category: "Tech", related: ["Immutability", "Security"] },
    { term: "Incentive Mechanism", def: "A system to reward users for network participation.", category: "Tech", related: ["Staking", "Reward"] },
    { term: "Insider Trading", def: "Trading based on non-public information, often illegal.", category: "Trading", related: ["Frontrun", "Ethics"] },
    { term: "Institutional Investor", def: "A large organization investing in crypto markets.", category: "Trading", related: ["Whale", "Market Impact"] },
    { term: "Inter-Blockchain", def: "Communication between different blockchain networks.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "KYC Compliance", def: "Adhering to Know Your Customer regulations.", category: "Regulation", related: ["KYC", "AML"] },
    { term: "Lagging Indicator", def: "A trading indicator that follows price movements.", category: "Trading", related: ["Leading Indicator", "TA"] },
    { term: "Layer 3", def: "Solutions built on top of Layer 2 for additional functionality.", category: "Tech", related: ["Layer 2", "Scalability"] },
    { term: "Leading Indicator", def: "A trading indicator that predicts price movements.", category: "Trading", related: ["Lagging Indicator", "TA"] },
    { term: "Liquidity Event", def: "A significant event affecting a crypto’s trading volume.", category: "Trading", related: ["Liquidity", "Volatility"] },
    { term: "Liquidity Ratio", def: "The ratio of available liquidity to trading volume.", category: "Trading", related: ["Liquidity", "Spread"] },
    { term: "Lockup Period", def: "A time during which tokens cannot be sold or transferred.", category: "Basics", related: ["Vesting", "Token Lock"] },
    { term: "Long Squeeze", def: "A rapid price drop forcing long position holders to sell.", category: "Trading", related: ["Short Squeeze", "Liquidation"] },
    { term: "Mainstream Adoption", def: "Widespread acceptance of crypto by the general public.", category: "Basics", related: ["Adoption Curve", "User Base"] },
    { term: "Market Sentiment", def: "The overall mood of investors toward the crypto market.", category: "Trading", related: ["Bullish", "Bearish"] },
    { term: "Mempool Size", def: "The number of unconfirmed transactions waiting to be processed.", category: "Tech", related: ["Mempool", "Transaction Fee"] },
    { term: "Meta Transaction", def: "A transaction where gas fees are paid by a third party.", category: "Tech", related: ["Gasless", "User Experience"] },
    { term: "Micro Cap", def: "A cryptocurrency with a very small market capitalization.", category: "Trading", related: ["Small Cap", "Market Cap"] },
    { term: "Mining Difficulty", def: "The level of effort required to mine a new block.", category: "Tech", related: ["Difficulty", "Hash Power"] },
    { term: "Minting Fee", def: "The cost to create a new token or NFT on a blockchain.", category: "Tech", related: ["Minting", "Gas"] },
    { term: "Monero", def: "A privacy-focused cryptocurrency using ring signatures.", category: "Tech", related: ["Privacy Coin", "Anonymity"] },
    { term: "Mooning", def: "Slang for a crypto experiencing a rapid price increase.", category: "Slang", related: ["To The Moon", "Rally"] },
    { term: "Multi-Signature", def: "A wallet requiring multiple signatures to authorize a transaction.", category: "Tech", related: ["Multisig", "Security"] },
    { term: "Network Congestion", def: "A situation where a blockchain struggles with high transaction volume.", category: "Tech", related: ["Scalability", "Throughput"] },
    { term: "News Trading", def: "Trading based on market news and events.", category: "Trading", related: ["Event-Driven Trading", "Volatility"] },
    { term: "Node Operator", def: "An individual or entity running a blockchain node.", category: "Tech", related: ["Node", "Validator"] },
    { term: "Non-Fungible", def: "A unique digital asset that cannot be exchanged on a 1:1 basis.", category: "Basics", related: ["NFT", "Fungibility"] },
    { term: "Off-Chain Governance", def: "Decision-making processes outside the blockchain.", category: "Tech", related: ["On-Chain Governance", "DAO"] },
    { term: "On-Chain Governance", def: "Decision-making processes recorded on the blockchain.", category: "Tech", related: ["Off-Chain Governance", "DAO"] },
    { term: "Open Interest", def: "The total number of active futures or options contracts.", category: "Trading", related: ["Futures", "Derivatives"] },
    { term: "Optimistic Rollup", def: "A Layer 2 solution assuming transactions are valid unless challenged.", category: "Tech", related: ["Rollup", "Layer 2"] },
    { term: "Overcollateralization", def: "Providing more collateral than needed for a loan.", category: "DeFi", related: ["Collateral", "DeFi"] },
    { term: "P2P Network", def: "A decentralized network where nodes interact directly.", category: "Tech", related: ["P2P", "Decentralization"] },
    { term: "Panic Buy", def: "Buying crypto out of fear of missing a price surge.", category: "Slang", related: ["FOMO Buy", "Hype"] },
    { term: "Passive Income", def: "Earnings from staking, lending, or yield farming.", category: "DeFi", related: ["Yield", "Staking"] },
    { term: "Perpetual Futures", def: "Futures contracts with no expiration date.", category: "Trading", related: ["Futures", "Funding Rate"] },
    { term: "Play-to-Earn", def: "A gaming model where players earn crypto rewards.", category: "Tech", related: ["NFT", "Metaverse"] },
    { term: "Pre-Mine", def: "Tokens created and distributed before a project’s launch.", category: "Basics", related: ["Fair Launch", "ICO"] },
    { term: "Price Discovery", def: "The process of determining a crypto’s market price.", category: "Trading", related: ["Liquidity", "Market Cap"] },
    { term: "Private Sale", def: "A token sale restricted to select investors before public launch.", category: "Basics", related: ["ICO", "Crowdsale"] },
    { term: "Proof of Burn", def: "A consensus mechanism where tokens are burned to gain rights.", category: "Tech", related: ["Burn", "Consensus"] },
    { term: "Proof of History", def: "A mechanism to timestamp events on a blockchain.", category: "Tech", related: ["Solana", "Consensus"] },
    { term: "Protocol Upgrade", def: "A change to a blockchain’s rules or functionality.", category: "Tech", related: ["Fork", "EIP"] },
    { term: "Pump Scheme", def: "A coordinated effort to artificially inflate a crypto’s price.", category: "Slang", related: ["Pump", "Market Manipulation"] },
    { term: "Red Candle", def: "A candlestick showing a price decrease.", category: "Trading", related: ["Green Candle", "Candlestick"] },
    { term: "Relay Chain", def: "A main chain coordinating with sidechains, like in Polkadot.", category: "Tech", related: ["Parachain", "Interoperability"] },
    { term: "Risk Management", def: "Strategies to minimize losses in crypto trading.", category: "Trading", related: ["Stop Loss", "Diversification"] },
    { term: "Rug", def: "Slang for a project that scams investors by pulling out.", category: "Slang", related: ["Rug Pull", "Exit Scam"] },
    { term: "Sandwich Attack", def: "A DeFi exploit placing transactions around a target trade.", category: "DeFi", related: ["Frontrun", "MEV"] },
    { term: "Satoshi Unit", def: "A small fraction of a Bitcoin, named after its creator.", category: "Basics", related: ["Satoshi", "Bitcoin"] },
    { term: "Scalping", def: "A trading strategy focusing on small, frequent profits.", category: "Trading", related: ["High-Frequency Trading", "Bot Trading"] },
    { term: "Seed Round", def: "An early funding stage for a crypto project.", category: "Basics", related: ["Venture Capital", "ICO"] },
    { term: "Sell Wall", def: "A large number of sell orders at a specific price level.", category: "Trading", related: ["Buy Wall", "Order Book"] },
    { term: "Short Squeeze", def: "A rapid price increase forcing short sellers to buy back.", category: "Trading", related: ["Long Squeeze", "Liquidation"] },
    { term: "Side Channel", def: "An off-chain method for fast, private transactions.", category: "Tech", related: ["State Channel", "Off-Chain"] },
    { term: "Small Cap", def: "A cryptocurrency with a relatively small market capitalization.", category: "Trading", related: ["Micro Cap", "Market Cap"] },
    { term: "Smart Contract Audit", def: "A security review of a smart contract’s code.", category: "Tech", related: ["Audit", "Security"] },
    { term: "Soft Peg", def: "A flexible exchange rate between a crypto and another asset.", category: "Basics", related: ["Hard Peg", "Stablecoin"] },
    { term: "Solana", def: "A high-speed blockchain using Proof of History.", category: "Tech", related: ["Proof of History", "Scalability"] },
    { term: "Speculation", def: "Investing in crypto based on price predictions.", category: "Trading", related: ["Volatility", "Risk"] },
    { term: "Spoofer", def: "A trader placing fake orders to manipulate the market.", category: "Slang", related: ["Spoofing", "Market Manipulation"] },
    { term: "Stablecoin Peg", def: "The mechanism tying a stablecoin’s value to an asset.", category: "Basics", related: ["Stablecoin", "Fiat Peg"] },
    { term: "Staking Pool", def: "A group of users pooling their tokens to stake together.", category: "DeFi", related: ["Staking", "Yield"] },
    { term: "State Bloat", def: "The growth of blockchain data, slowing down the network.", category: "Tech", related: ["Pruning", "Scalability"] },
    { term: "Swing Trading", def: "A strategy to profit from short- to medium-term price swings.", category: "Trading", related: ["Scalping", "TA"] },
    { term: "Synthetic Asset", def: "A tokenized version of a real-world asset in DeFi.", category: "DeFi", related: ["Tokenization", "DeFi"] },
    { term: "Tax Harvesting", def: "Selling crypto at a loss to offset taxable gains.", category: "Trading", related: ["Capital Gains", "Tax"] },
    { term: "Token Allocation", def: "The distribution plan for a project’s tokens.", category: "Basics", related: ["Tokenomics", "Vesting"] },
    { term: "Token Generation Event", def: "The initial creation and distribution of a token.", category: "Basics", related: ["ICO", "Token Sale"] },
    { term: "Token Velocity", def: "The speed at which a token circulates in an ecosystem.", category: "Tech", related: ["Tokenomics", "Liquidity"] },
    { term: "Trade Volume", def: "The total amount of crypto traded in a given period.", category: "Trading", related: ["Volume", "Liquidity"] },
    { term: "Transaction Throughput", def: "The rate at which a blockchain processes transactions.", category: "Tech", related: ["TPS", "Scalability"] },
    { term: "Trustless", def: "A system where users don’t need to trust a central authority.", category: "Tech", related: ["Decentralization", "Smart Contract"] },
    { term: "Uncle Block", def: "A valid block not included in the main chain.", category: "Tech", related: ["Orphan Block", "Mining"] },
    { term: "User Base", def: "The total number of active users in a crypto ecosystem.", category: "Basics", related: ["Adoption Curve", "Mainstream"] },
    { term: "Validator Node", def: "A node responsible for validating transactions in Proof of Stake.", category: "Tech", related: ["Validator", "Proof of Stake"] },
    { term: "Vaporware Scam", def: "A hyped project that never delivers on promises.", category: "Slang", related: ["Exit Scam", "Scam"] },
    { term: "Volatility Spike", def: "A sudden increase in price fluctuations.", category: "Trading", related: ["Volatility", "Flash Crash"] },
    { term: "Wallet Balance", def: "The total amount of crypto held in a wallet.", category: "Tech", related: ["Wallet", "Address"] },
    { term: "Wash Sale", def: "Selling and repurchasing a crypto to manipulate tax records.", category: "Trading", related: ["Tax Harvesting", "Regulation"] },
    { term: "Web3 Wallet", def: "A wallet designed for interacting with Web3 applications.", category: "Tech", related: ["Web3", "DApp"] },
    { term: "Whale Movement", def: "Large transactions by major crypto holders.", category: "Slang", related: ["Whale", "Market Impact"] },
    { term: "Yield Curve", def: "A graph showing the relationship between yield and time in DeFi.", category: "DeFi", related: ["Yield", "DeFi"] },
    { term: "Zcash", def: "A privacy-focused cryptocurrency using zero-knowledge proofs.", category: "Tech", related: ["Privacy Coin", "zk-SNARK"] },
    { term: "Zero-Knowledge", def: "A cryptographic method to prove something without revealing details.", category: "Tech", related: ["zk-SNARK", "Privacy"] },
    { term: "BaaS", def: "Blockchain as a Service; cloud-based blockchain solutions.", category: "Tech", related: ["Cloud", "Enterprise"] },
    { term: "Bancor", def: "Protocol for creating smart tokens with built-in liquidity.", category: "DeFi", related: ["Liquidity", "Smart Token"] },
    { term: "Base Layer", def: "The primary blockchain layer handling core functions.", category: "Tech", related: ["Layer 1", "Scalability"] },
    { term: "Bear Trap", def: "A false signal indicating a price drop, trapping sellers.", category: "Trading", related: ["Bull Trap", "Market Manipulation"] },
    { term: "BFT", def: "Byzantine Fault Tolerance; handling malicious nodes in consensus.", category: "Tech", related: ["Consensus", "Fault Tolerance"] },
    { term: "Black Swan", def: "An unpredictable event causing major market impact.", category: "Trading", related: ["Volatility", "Crash"] },
    { term: "Block Explorer", def: "Tool to view blockchain transactions and data.", category: "Tech", related: ["TxID", "Transparency"] },
    { term: "Block Height", def: "The number of blocks in a blockchain up to the current one.", category: "Tech", related: ["Block", "Chain"] },
    { term: "Bounty", def: "Reward for completing tasks like bug hunting or promotion.", category: "Basics", related: ["Airdrop", "Incentive"] },
    { term: "Breakout", def: "Price movement beyond a key resistance or support level.", category: "Trading", related: ["Resistance", "Support"] },
    { term: "Bridge", def: "Technology connecting two blockchains for asset transfer.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "Bull Trap", def: "A false signal indicating a price rise, trapping buyers.", category: "Trading", related: ["Bear Trap", "Market Manipulation"] },
    { term: "Byzantine Generals", def: "A problem describing challenges in distributed consensus.", category: "Tech", related: ["BFT", "Consensus"] },
    { term: "Candle", def: "A single unit on a candlestick chart showing price action.", category: "Trading", related: ["Candlestick", "OHLC"] },
    { term: "CAP Theorem", def: "Theory stating a system can only have two of consistency, availability, or partition tolerance.", category: "Tech", related: ["Consistency", "Distributed System"] },
    { term: "Censorship Resistance", def: "A blockchain’s ability to prevent transaction censorship.", category: "Tech", related: ["Decentralization", "Immutability"] },
    { term: "Chain Split", def: "When a blockchain diverges into two separate chains.", category: "Tech", related: ["Fork", "Hard Fork"] },
    { term: "Churning", def: "Rapid buying and selling to create fake trading volume.", category: "Trading", related: ["Wash Trading", "Market Manipulation"] },
    { term: "Coin Mixer", def: "Service that mixes crypto to enhance privacy.", category: "Tech", related: ["Tumbling", "Privacy"] },
    { term: "Collateral", def: "Assets locked to secure a loan or position in DeFi.", category: "DeFi", related: ["Loan", "Liquidation"] },
    { term: "Confirmation", def: "The process of validating a transaction on the blockchain.", category: "Tech", related: ["Block", "Mining"] },
    { term: "ConsenSys", def: "A blockchain company focused on Ethereum development.", category: "Tech", related: ["Ethereum", "DApp"] },
    { term: "Cross Margin", def: "Using all account funds to cover trading losses.", category: "Trading", related: ["Isolated Margin", "Leverage"] },
    { term: "Crypto Winter", def: "A prolonged period of low crypto prices and activity.", category: "Trading", related: ["Bear Market", "Volatility"] },
    { term: "Cryptojacking", def: "Unauthorized use of a device to mine crypto.", category: "Tech", related: ["Security", "Malware"] },
    { term: "CT", def: "Crypto Twitter; the crypto community on Twitter.", category: "Slang", related: ["Hype", "Influencer"] },
    { term: "Dark Pool", def: "Private trading venue for large crypto trades.", category: "Trading", related: ["Liquidity", "Whale"] },
    { term: "DCA Strategy", def: "Investing a fixed amount regularly to reduce volatility impact.", category: "Trading", related: ["BTFD", "Long-Term"] },
    { term: "Dead Cat Bounce", def: "A temporary price recovery after a major drop.", category: "Trading", related: ["Bear Market", "Volatility"] },
    { term: "Decentralized Identity", def: "Self-sovereign identity managed on a blockchain.", category: "Tech", related: ["DID", "Privacy"] },
    { term: "Deflationary Token", def: "A token designed to decrease in supply over time.", category: "Tech", related: ["Burn", "Scarcity"] },
    { term: "Delegated Proof of Stake", def: "A consensus where users vote for delegates to validate.", category: "Tech", related: ["Proof of Stake", "Validator"] },
    { term: "Derivatives", def: "Financial contracts based on the price of an underlying crypto.", category: "Trading", related: ["Futures", "Options"] },
    { term: "DID", def: "Decentralized Identifier; a unique ID on a blockchain.", category: "Tech", related: ["Decentralized Identity", "Privacy"] },
    { term: "Divergence", def: "When price and an indicator move in opposite directions.", category: "Trading", related: ["RSI", "MACD"] },
    { term: "Double Spend", def: "Spending the same crypto twice, a blockchain security issue.", category: "Tech", related: ["51% Attack", "Confirmation"] },
    { term: "Dust Limit", def: "Minimum amount of crypto required for a transaction.", category: "Tech", related: ["Dust", "Transaction Fee"] },
    { term: "EIP", def: "Ethereum Improvement Proposal; suggests upgrades to Ethereum.", category: "Tech", related: ["BIP", "Upgrade"] },
    { term: "EMA", def: "Exponential Moving Average; a weighted price average.", category: "Trading", related: ["SMA", "TA"] },
    { term: "Encryption", def: "Securing data by converting it into an unreadable format.", category: "Tech", related: ["Hash", "Security"] },
    { term: "Enterprise Blockchain", def: "Private blockchain for business use cases.", category: "Tech", related: ["BaaS", "Permissioned"] },
    { term: "ERC-1155", def: "Ethereum standard for both fungible and non-fungible tokens.", category: "Tech", related: ["ERC-20", "NFT"] },
    { term: "Escrow Service", def: "A third-party service holding funds until conditions are met.", category: "Trading", related: ["Escrow", "P2P"] },
    { term: "Ethereum 2.0", def: "Ethereum’s upgrade to Proof of Stake and sharding.", category: "Tech", related: ["Proof of Stake", "Sharding"] },
    { term: "Exit Liquidity", def: "When early investors sell to new buyers at a peak.", category: "Slang", related: ["Rug Pull", "Dump"] },
    { term: "Faucet Token", def: "Free tokens given for testing on a testnet.", category: "Tech", related: ["Faucet", "Testnet"] },
    { term: "Fibonacci Retracement", def: "A tool to identify potential price support levels.", category: "Trading", related: ["TA", "Support"] },
    { term: "Flash Loan", def: "Uncollateralized loan in DeFi, repaid in the same transaction.", category: "DeFi", related: ["DeFi", "Smart Contract"] },
    { term: "FOMO Buy", def: "Buying crypto due to fear of missing a price surge.", category: "Slang", related: ["FOMO", "Hype"] },
    { term: "Front Running", def: "Trading based on advance knowledge of pending transactions.", category: "Trading", related: ["MEV", "Ethics"] },
    { term: "Fungibility", def: "Property of an asset where each unit is interchangeable.", category: "Basics", related: ["NFT", "Token"] },
    { term: "Gas Price", def: "The cost per unit of gas for an Ethereum transaction.", category: "Tech", related: ["Gas", "Transaction Fee"] },
    { term: "Governance Token", def: "Token giving holders voting rights in a protocol.", category: "DeFi", related: ["DAO", "Voting"] },
    { term: "Hard Wallet", def: "A physical device for securely storing crypto keys.", category: "Tech", related: ["Cold Wallet", "Security"] },
    { term: "Hash Collision", def: "When two different inputs produce the same hash output.", category: "Tech", related: ["Hash", "Security"] },
    { term: "Honeypot", def: "A scam token designed to trap investors.", category: "Slang", related: ["Rug Pull", "Scam"] },
    { term: "Hybrid Consensus", def: "Combining multiple consensus mechanisms for efficiency.", category: "Tech", related: ["Proof of Work", "Proof of Stake"] },
    { term: "ICO Scam", def: "A fraudulent Initial Coin Offering to steal funds.", category: "Slang", related: ["Rug Pull", "Scam"] },
    { term: "Immutability", def: "The inability to alter blockchain data once recorded.", category: "Tech", related: ["Security", "Transparency"] },
    { term: "Index Fund", def: "A fund tracking a basket of cryptocurrencies.", category: "Trading", related: ["ETF", "Diversification"] },
    { term: "Inflationary Token", def: "A token designed to increase in supply over time.", category: "Tech", related: ["Deflationary Token", "Supply"] },
    { term: "Initial Exchange Offering", def: "Token sale hosted on an exchange.", category: "Basics", related: ["ICO", "IDO"] },
    { term: "Interoperability", def: "Ability of blockchains to communicate with each other.", category: "Tech", related: ["Cross-Chain", "Bridge"] },
    { term: "Isolated Margin", def: "Using only a portion of funds for a trade to limit risk.", category: "Trading", related: ["Cross Margin", "Leverage"] },
    { term: "K-Line", def: "Another term for a candlestick on a price chart.", category: "Trading", related: ["Candlestick", "TA"] },
    { term: "Key Pair", def: "A set of public and private keys for crypto transactions.", category: "Tech", related: ["Private Key", "Public Key"] },
    { term: "L2", def: "Layer 2; solutions built on top of a base blockchain.", category: "Tech", related: ["Layer 1", "Scalability"] },
    { term: "Lambo Dreams", def: "Hoping for massive crypto gains to buy luxury items.", category: "Slang", related: ["Lambo", "Moon"] },
    { term: "Latency", def: "The delay in processing blockchain transactions.", category: "Tech", related: ["Throughput", "Scalability"] },
    { term: "Layer 1", def: "The main blockchain protocol, like Bitcoin or Ethereum.", category: "Tech", related: ["Layer 2", "Base Layer"] },
    { term: "Lending Pool", def: "A pool of funds in DeFi for lending and borrowing.", category: "DeFi", related: ["Liquidity Pool", "Yield"] },
    { term: "Light Node", def: "A node that doesn’t store the full blockchain data.", category: "Tech", related: ["Full Node", "Node"] },
    { term: "Liquidation", def: "Closing a leveraged position due to insufficient funds.", category: "Trading", related: ["Leverage", "Margin"] },
    { term: "Liquidity Mining", def: "Earning rewards by providing liquidity to a protocol.", category: "DeFi", related: ["Farming", "Yield Farming"] },
    { term: "Long Position", def: "Buying crypto expecting its price to rise.", category: "Trading", related: ["Short Position", "Leverage"] },
    { term: "MACD", def: "Moving Average Convergence Divergence; a trading indicator.", category: "Trading", related: ["EMA", "TA"] },
    { term: "Margin Call", def: "A demand to add funds to a leveraged position.", category: "Trading", related: ["Liquidation", "Leverage"] },
    { term: "Market Maker", def: "An entity providing liquidity by placing buy and sell orders.", category: "Trading", related: ["Liquidity", "Spread"] },
    { term: "Masternode", def: "A node with additional functions, often for rewards.", category: "Tech", related: ["Node", "Staking"] },
    { term: "Max Supply", def: "The total number of tokens that will ever exist.", category: "Basics", related: ["Total Supply", "Hard Cap"] },
    { term: "Merkle Root", def: "The top hash in a Merkle Tree, summarizing transactions.", category: "Tech", related: ["Merkle Tree", "Block"] },
    { term: "Microtransaction", def: "A very small crypto transaction, often for fees.", category: "Tech", related: ["Dust", "Transaction Fee"] },
    { term: "Mining Pool", def: "A group of miners combining resources to earn rewards.", category: "Tech", related: ["Mining", "Hashrate"] },
    { term: "Mintable Token", def: "A token that can be created after its initial issuance.", category: "Tech", related: ["Minting", "Token"] },
    { term: "Moon Boy", def: "An overly optimistic crypto investor expecting huge gains.", category: "Slang", related: ["To The Moon", "Hype"] },
    { term: "Multi-Chain", def: "A system operating across multiple blockchains.", category: "Tech", related: ["Cross-Chain", "Interoperability"] },
    { term: "Nakamoto Consensus", def: "The consensus mechanism used by Bitcoin.", category: "Tech", related: ["Proof of Work", "Consensus"] },
    { term: "Non-Custodial", def: "A service where users control their own private keys.", category: "Tech", related: ["Custodial", "Wallet"] },
    { term: "Off-Chain", def: "Transactions or data processed outside the blockchain.", category: "Tech", related: ["On-Chain", "Layer 2"] },
    { term: "OHLC", def: "Open, High, Low, Close; data points on a candlestick chart.", category: "Trading", related: ["Candlestick", "TA"] },
    { term: "On-Chain", def: "Transactions or data recorded directly on the blockchain.", category: "Tech", related: ["Off-Chain", "Transparency"] },
    { term: "Options", def: "Contracts giving the right to buy/sell crypto at a set price.", category: "Trading", related: ["Derivatives", "Futures"] },
    { term: "Order Book", def: "A list of buy and sell orders for a crypto on an exchange.", category: "Trading", related: ["Liquidity", "Market Maker"] },
    { term: "Overbought", def: "When a crypto’s price is too high, likely to drop.", category: "Trading", related: ["Oversold", "RSI"] },
    { term: "Oversold", def: "When a crypto’s price is too low, likely to rise.", category: "Trading", related: ["Overbought", "RSI"] },
    { term: "P2P Lending", def: "Direct lending of crypto between users on a platform.", category: "DeFi", related: ["Lending Pool", "DeFi"] },
    { term: "Paper Trading", def: "Simulated trading without real money.", category: "Trading", related: ["Demo Account", "Practice"] },
    { term: "Parachain", def: "A blockchain connected to a main chain like Polkadot.", category: "Tech", related: ["Sidechain", "Interoperability"] },
    { term: "Pegged Currency", def: "A crypto tied to the value of another asset.", category: "Basics", related: ["Stablecoin", "Peg"] },
    { term: "Permissioned Ledger", def: "A blockchain with restricted access for participants.", category: "Tech", related: ["Enterprise Blockchain", "Private Blockchain"] },
    { term: "Phishing", def: "A scam to steal crypto by pretending to be a trusted entity.", category: "Slang", related: ["Scam", "Security"] },
    { term: "Plasma", def: "A Layer 2 scaling solution using child chains.", category: "Tech", related: ["Layer 2", "Scalability"] },
    { term: "Ponzi Scheme", def: "A scam paying early investors with new investors’ funds.", category: "Slang", related: ["Scam", "Rug Pull"] },
    { term: "Privacy Coin", def: "A cryptocurrency focused on anonymous transactions.", category: "Tech", related: ["Monero", "Zcash"] },
    { term: "Private Blockchain", def: "A blockchain with restricted access and control.", category: "Tech", related: ["Permissioned Ledger", "Enterprise Blockchain"] },
    { term: "Protocol", def: "A set of rules governing a blockchain’s operations.", category: "Tech", related: ["Consensus", "Smart Contract"] },
    { term: "Pruning", def: "Removing old blockchain data to save space.", category: "Tech", related: ["Light Node", "Storage"] },
    { term: "Public Blockchain", def: "A blockchain open to anyone to participate.", category: "Tech", related: ["Private Blockchain", "Decentralization"] },
    { term: "Pump", def: "A rapid price increase, often manipulated.", category: "Trading", related: ["Pump and Dump", "Hype"] },
    { term: "QR Code", def: "A scannable code for crypto wallet addresses.", category: "Tech", related: ["Address", "Wallet"] },
    { term: "Rally", def: "A sustained upward price movement in the market.", category: "Trading", related: ["Bull Market", "Breakout"] },
    { term: "Rebase", def: "Adjusting a token’s supply to control its price.", category: "Tech", related: ["Deflationary Token", "Supply"] },
    { term: "Resistance", def: "A price level where selling pressure halts a rise.", category: "Trading", related: ["Support", "Breakout"] },
    { term: "ROI", def: "Return on Investment; profit or loss from a crypto trade.", category: "Trading", related: ["Profit", "Loss"] },
    { term: "RSI", def: "Relative Strength Index; a momentum indicator for trading.", category: "Trading", related: ["Overbought", "Oversold"] },
    { term: "Satoshi Nakamoto", def: "Pseudonym of Bitcoin’s anonymous creator.", category: "Basics", related: ["Bitcoin", "Genesis Block"] },
    { term: "Scalability", def: "A blockchain’s ability to handle increased transactions.", category: "Tech", related: ["Layer 2", "Sharding"] },
    { term: "Scam Coin", def: "A fraudulent cryptocurrency designed to deceive investors.", category: "Slang", related: ["Rug Pull", "Honeypot"] },
    { term: "Security Token", def: "A token representing ownership in a real-world asset.", category: "Basics", related: ["Utility Token", "Regulation"] },
    { term: "Seed Funding", def: "Early investment to launch a crypto project.", category: "Basics", related: ["ICO", "Venture Capital"] },
    { term: "SegWit", def: "A Bitcoin upgrade to improve scalability and security.", category: "Tech", related: ["Bitcoin", "Scalability"] },
    { term: "Shill", def: "Promoting a crypto to artificially boost its price.", category: "Slang", related: ["Hype", "Pump"] },
    { term: "Short Position", def: "Selling crypto expecting its price to fall.", category: "Trading", related: ["Long Position", "Leverage"] },
    { term: "Sideways Market", def: "A market with no clear upward or downward trend.", category: "Trading", related: ["Volatility", "Consolidation"] },
    { term: "SMA", def: "Simple Moving Average; a basic price average over time.", category: "Trading", related: ["EMA", "TA"] },
    { term: "Smart Token", def: "A token with built-in logic for automated actions.", category: "Tech", related: ["Smart Contract", "Bancor"] },
    { term: "Snapshot", def: "A record of wallet balances at a specific block height.", category: "Tech", related: ["Airdrop", "Fork"] },
    { term: "SNI", def: "Stakeholder Node Incentive; rewards for network participation.", category: "Tech", related: ["Staking", "Incentive"] },
    { term: "Soft Cap", def: "The minimum funding goal for a token sale.", category: "Basics", related: ["Hard Cap", "ICO"] },
    { term: "Spoofing", def: "Placing fake orders to manipulate market perception.", category: "Trading", related: ["Market Manipulation", "Wash Trading"] },
    { term: "Spread", def: "The difference between the buy and sell price of a crypto.", category: "Trading", related: ["Liquidity", "Market Maker"] },
    { term: "Stable Yield", def: "Consistent returns from DeFi staking or lending.", category: "DeFi", related: ["Yield Farming", "Staking"] },
    { term: "State Channel", def: "An off-chain solution for fast, private transactions.", category: "Tech", related: ["Layer 2", "Off-Chain"] },
    { term: "Stop Loss", def: "An order to sell crypto at a set price to limit losses.", category: "Trading", related: ["Take Profit", "Risk Management"] },
    { term: "Support", def: "A price level where buying pressure halts a decline.", category: "Trading", related: ["Resistance", "Breakout"] },
    { term: "Swap", def: "Exchanging one crypto for another, often on a DEX.", category: "DeFi", related: ["DEX", "Liquidity Pool"] },
    { term: "Sybil Resistance", def: "Mechanisms to prevent fake identities in a network.", category: "Tech", related: ["Sybil Attack", "Security"] },
    { term: "Take Profit", def: "An order to sell crypto at a set price to lock in gains.", category: "Trading", related: ["Stop Loss", "Profit"] },
    { term: "Tangle", def: "A DAG-based structure used by IOTA for transactions.", category: "Tech", related: ["Blockchain", "DAG"] },
    { term: "Technical Indicator", def: "A tool used to predict price movements.", category: "Trading", related: ["RSI", "MACD"] },
    { term: "Throughput", def: "The number of transactions a blockchain can process per second.", category: "Tech", related: ["Scalability", "Latency"] },
    { term: "Token Burn", def: "Permanently removing tokens to reduce supply.", category: "Tech", related: ["Burn", "Deflationary Token"] },
    { term: "Token Sale", def: "A fundraising event where tokens are sold to investors.", category: "Basics", related: ["ICO", "IDO"] },
    { term: "Token Standard", def: "A set of rules for creating tokens on a blockchain.", category: "Tech", related: ["ERC-20", "ERC-721"] },
    { term: "Token Swap", def: "Migrating tokens from one blockchain to another.", category: "Tech", related: ["Bridge", "Cross-Chain"] },
    { term: "Tokenomics", def: "The economic model of a token’s supply and demand.", category: "Basics", related: ["Supply", "Incentive"] },
    { term: "TPS", def: "Transactions Per Second; a measure of blockchain speed.", category: "Tech", related: ["Throughput", "Scalability"] },
    { term: "Trading Bot", def: "Automated software for executing crypto trades.", category: "Trading", related: ["Algorithm", "Automation"] },
    { term: "Transaction Hash", def: "A unique identifier for a blockchain transaction.", category: "Tech", related: ["TxID", "Block Explorer"] },
    { term: "Transparency", def: "The ability to view all blockchain transactions publicly.", category: "Tech", related: ["Immutability", "Public Blockchain"] },
    { term: "Turing Complete", def: "A system capable of performing any computation.", category: "Tech", related: ["Smart Contract", "EVM"] },
    { term: "Utility Token", def: "A token used to access a specific product or service.", category: "Basics", related: ["Security Token", "Token"] },
    { term: "Venture Capital", def: "Funding provided to early-stage crypto projects.", category: "Basics", related: ["Seed Funding", "ICO"] },
    { term: "Volatility Index", def: "A measure of crypto market price fluctuations.", category: "Trading", related: ["Volatility", "Risk"] },
    { term: "Wallet Address", def: "A unique string for sending/receiving crypto.", category: "Tech", related: ["Address", "Public Key"] },
    { term: "Weak Hands", def: "Investors who sell at the first sign of a price drop.", category: "Slang", related: ["Paper Hands", "Panic Sell"] },
    { term: "Whale Wallet", def: "A wallet holding a large amount of crypto.", category: "Slang", related: ["Whale", "Market Impact"] },
    { term: "White Label", def: "A product or service rebranded for another company.", category: "Basics", related: ["BaaS", "Enterprise"] },
    { term: "Wick", def: "The thin line on a candlestick showing price extremes.", category: "Trading", related: ["Candlestick", "OHLC"] },
    { term: "Wrapped Token", def: "A token pegged to another crypto for cross-chain use.", category: "Tech", related: ["Bridge", "Cross-Chain"] },
    { term: "Yield", def: "The return earned from staking or lending crypto.", category: "DeFi", related: ["Yield Farming", "Staking"] },
    { term: "Zero Confirmation", def: "A transaction not yet confirmed on the blockchain.", category: "Tech", related: ["Confirmation", "Double Spend"] },
    { term: "zk-SNARK", def: "A zero-knowledge proof for private transactions.", category: "Tech", related: ["Zero-Knowledge Proof", "Privacy"] },
    { term: "Ape", def: "Slang for impulsively investing in a crypto project.", category: "Slang", related: ["Ape In", "YOLO"] },
    { term: "Arbitrage Bot", def: "A bot that exploits price differences across exchanges.", category: "Trading", related: ["Arbitrage", "Trading Bot"] },
    { term: "Audit", def: "A security review of a smart contract or protocol.", category: "Tech", related: ["Security", "Smart Contract"] },
    { term: "Bearish Divergence", def: "When price rises but an indicator falls, signaling a drop.", category: "Trading", related: ["Divergence", "RSI"] },
    { term: "Block Time", def: "The average time to mine a new block.", category: "Tech", related: ["Mining", "Throughput"] },
    { term: "Bullish Divergence", def: "When price falls but an indicator rises, signaling a rise.", category: "Trading", related: ["Divergence", "RSI"] },
    { term: "Chainlink", def: "A decentralized oracle network for smart contracts.", category: "Tech", related: ["Oracle", "Smart Contract"] },
    { term: "Cold Staking", def: "Staking crypto while keeping it offline for security.", category: "Tech", related: ["Staking", "Cold Wallet"] },
    { term: "Consensus Algorithm", def: "A method for nodes to agree on blockchain state.", category: "Tech", related: ["Consensus", "Proof of Work"] },
    { term: "DApp Store", def: "A platform for discovering decentralized applications.", category: "Tech", related: ["DApp", "Web3"] },
    { term: "DeFi Protocol", def: "A decentralized platform for financial services.", category: "DeFi", related: ["DeFi", "Smart Contract"] },
    { term: "DEX Aggregator", def: "A platform combining liquidity from multiple DEXs.", category: "DeFi", related: ["DEX", "Liquidity"] },
    { term: "Fiat On-Ramp", def: "A service to buy crypto with traditional currency.", category: "Basics", related: ["Fiat", "CEX"] },
    { term: "Gas War", def: "Competition to pay higher fees for faster transaction processing.", category: "Tech", related: ["Gas", "Transaction Fee"] },
    { term: "Gox", def: "Slang for losing funds due to an exchange failure.", category: "Slang", related: ["Goxxed", "Scam"] },
    { term: "HODLer", def: "Someone who holds crypto long-term despite volatility.", category: "Slang", related: ["HODL", "Diamond Hands"] },
    { term: "Hot Staking", def: "Staking crypto while keeping it online and accessible.", category: "Tech", related: ["Staking", "Hot Wallet"] },
    { term: "ICO Token", def: "A token issued during an Initial Coin Offering.", category: "Basics", related: ["ICO", "Token Sale"] },
    { term: "Liquidity Provider", def: "A user who adds funds to a liquidity pool.", category: "DeFi", related: ["Liquidity Pool", "Yield Farming"] },
    { term: "Market Depth", def: "The volume of buy and sell orders at different prices.", category: "Trading", related: ["Order Book", "Liquidity"] },
    { term: "Mining Rig", def: "A computer setup optimized for crypto mining.", category: "Tech", related: ["Mining", "ASIC"] },
    { term: "NFT Marketplace", def: "A platform for buying and selling NFTs.", category: "Tech", related: ["NFT", "Marketplace"] },
    { term: "Panic Sell", def: "Selling crypto quickly due to fear of a price drop.", category: "Slang", related: ["Weak Hands", "FUD"] },
    { term: "Proof of Authority", def: "A consensus where trusted nodes validate transactions.", category: "Tech", related: ["Consensus", "Validator"] },
    { term: "Pump Group", def: "A group coordinating to artificially inflate a coin’s price.", category: "Slang", related: ["Pump", "Market Manipulation"] },
    { term: "Smart Pool", def: "A mining pool with automated reward distribution.", category: "Tech", related: ["Mining Pool", "Reward"] },
    { term: "Token Lock", def: "Restricting token access for a set period.", category: "Tech", related: ["Vesting", "Tokenomics"] },
    { term: "Vesting", def: "Gradual release of tokens to team or investors.", category: "Basics", related: ["Token Lock", "Tokenomics"] },
    { term: "Wallet Recovery", def: "Restoring access to a wallet using a seed phrase.", category: "Tech", related: ["Seed Phrase", "Wallet"] },
    { term: "Yield Aggregator", def: "A platform optimizing DeFi yield farming returns.", category: "DeFi", related: ["Yield Farming", "DeFi"] },
    { term: "Zero-Knowledge Rollup", def: "A Layer 2 solution using zero-knowledge proofs.", category: "Tech", related: ["Rollup", "zk-SNARK"] },
    { term: "Altcoin", def: "Any cryptocurrency other than Bitcoin, like Ethereum or Ripple.", category: "Basics", related: ["Bitcoin", "Coin"] },
    { term: "AML", def: "Anti-Money Laundering; regulations to combat illegal finance.", category: "Regulation", related: ["KYC", "Regulation"] },
    { term: "Arbitrage", def: "Profiting from price differences across exchanges.", category: "Trading", related: ["DEX", "Liquidity"] },
    { term: "ASIC", def: "Specialized hardware designed for mining specific cryptocurrencies.", category: "Tech", related: ["Mining", "Hashrate"] },
    { term: "ATH", def: "All-Time High; the peak price a crypto has ever hit.", category: "Trading", related: ["ATL", "Market Cap"] },
    { term: "ATL", def: "All-Time Low; the lowest price a crypto has ever reached.", category: "Trading", related: ["ATH", "Bear Market"] },
    { term: "Bagholder", def: "Someone stuck with a coin after a big price drop.", category: "Slang", related: ["Rekt", "Dumping"] },
    { term: "Bear Market", def: "A long period of declining crypto prices.", category: "Trading", related: ["Bull Market", "Volatility"] },
    { term: "BIP", def: "Bitcoin Improvement Proposal; suggests upgrades to Bitcoin.", category: "Tech", related: ["Fork", "Soft Fork"] },
    { term: "Block", def: "A set of transactions recorded on a blockchain.", category: "Tech", related: ["Blockchain", "Mining"] },
    { term: "Blockchain", def: "A decentralized ledger for secure transaction records.", category: "Tech", related: ["Block", "Consensus"] },
    { term: "Block Reward", def: "Crypto given to miners for validating a block.", category: "Tech", related: ["Mining", "Halving"] },
    { term: "Bull Market", def: "A long period of rising crypto prices.", category: "Trading", related: ["Bear Market", "FOMO"] },
    { term: "Burn", def: "Removing tokens from circulation to reduce supply.", category: "Tech", related: ["Token", "Deflation"] },
    { term: "Candlestick", def: "A chart showing price movements over time.", category: "Trading", related: ["TA", "Volatility"] },
    { term: "Cold Wallet", def: "An offline wallet for secure crypto storage.", category: "Tech", related: ["Hot Wallet", "Private Key"] },
    { term: "Consensus", def: "Agreement process for blockchain transaction validation.", category: "Tech", related: ["Proof of Work", "Proof of Stake"] },
    { term: "Crypto", def: "Short for cryptocurrency; digital money on a blockchain.", category: "Basics", related: ["Coin", "Token"] },
    { term: "Custodial", def: "A service managing your private keys for you.", category: "Tech", related: ["Non-Custodial", "Wallet"] },
    { term: "DApp", def: "Decentralized app running on a blockchain.", category: "Tech", related: ["Smart Contract", "DeFi"] },
    { term: "DAO", def: "Decentralized Autonomous Organization; governed by code.", category: "Tech", related: ["DeFi", "Governance"] },
    { term: "Decentralized", def: "No central authority; power spread across users.", category: "Basics", related: ["Blockchain", "DEX"] },
    { term: "DeFi", def: "Decentralized Finance; blockchain-based financial systems.", category: "Tech", related: ["DAO", "Yield Farming"] },
    { term: "DEX", def: "Decentralized Exchange; peer-to-peer crypto trading.", category: "Tech", related: ["CEX", "Liquidity Pool"] },
    { term: "Difficulty", def: "The effort needed to mine a blockchain block.", category: "Tech", related: ["Mining", "Hashrate"] },
    { term: "Dumping", def: "Mass selling of crypto to crash its price.", category: "Trading", related: ["Pump and Dump", "Bagholder"] },
    { term: "Dust", def: "Tiny crypto amounts left after transactions.", category: "Tech", related: ["Dust Attack", "UTXO"] },
    { term: "DYOR", def: "Do Your Own Research; advice for investors.", category: "Slang", related: ["FOMO", "FUD"] },
    { term: "ERC-20", def: "Ethereum token standard for fungible assets.", category: "Tech", related: ["ERC-721", "Token"] },
    { term: "ERC-721", def: "Ethereum standard for unique NFTs.", category: "Tech", related: ["NFT", "ERC-20"] },
    { term: "Farming", def: "Earning rewards by adding liquidity to DeFi.", category: "DeFi", related: ["Yield Farming", "Liquidity Pool"] },
    { term: "Fiat", def: "Traditional currency issued by governments (e.g., USD).", category: "Basics", related: ["Stablecoin", "CEX"] },
    { term: "FOMO", def: "Fear Of Missing Out; panic-buying during a rally.", category: "Slang", related: ["Hype", "Bull Market"] },
    { term: "Fork", def: "A split in a blockchain creating two versions.", category: "Tech", related: ["Hard Fork", "Soft Fork"] },
    { term: "FUD", def: "Fear, Uncertainty, Doubt; spreading negativity.", category: "Slang", related: ["FUDster", "DYOR"] },
    { term: "Gas", def: "Fee for processing Ethereum transactions.", category: "Tech", related: ["Gas Limit", "EVM"] },
    { term: "Genesis Block", def: "The very first block in a blockchain.", category: "Tech", related: ["Block", "Blockchain"] },
    { term: "Halving", def: "Bitcoin reward cut in half every ~4 years.", category: "Tech", related: ["Block Reward", "Mining"] },
    { term: "Hash", def: "A cryptographic function for securing data.", category: "Tech", related: ["Hashrate", "Merkle Tree"] },
    { term: "Hashrate", def: "Total computing power mining a blockchain.", category: "Tech", related: ["Difficulty", "ASIC"] },
    { term: "HODL", def: "Hold On for Dear Life; long-term holding.", category: "Slang", related: ["Diamond Hands", "Paper Hands"] },
    { term: "Hot Wallet", def: "Online wallet; convenient but less secure.", category: "Tech", related: ["Cold Wallet", "Wallet"] },
    { term: "ICO", def: "Initial Coin Offering; crypto crowdfunding.", category: "Basics", related: ["IDO", "Token"] },
    { term: "KYC", def: "Know Your Customer; ID verification process.", category: "Regulation", related: ["AML", "CEX"] },
    { term: "Ledger", def: "A record of all blockchain transactions.", category: "Tech", related: ["Blockchain", "TxID"] },
    { term: "Liquidity", def: "Ease of trading an asset without price impact.", category: "Trading", related: ["Liquidity Pool", "Slippage"] },
    { term: "Mainnet", def: "The live, primary blockchain network.", category: "Tech", related: ["Testnet", "Fork"] },
    { term: "Market Cap", def: "Total value of a crypto’s circulating supply.", category: "Trading", related: ["Circulating Supply", "ATH"] },
    { term: "Mempool", def: "Pool of unconfirmed blockchain transactions.", category: "Tech", related: ["TxID", "Mining"] },
    { term: "Mining", def: "Validating transactions to earn crypto rewards.", category: "Tech", related: ["Block Reward", "ASIC"] },
    { term: "Moon", def: "Slang for a crypto price soaring high.", category: "Slang", related: ["To The Moon", "Lambo"] },
    { term: "Multisig", def: "Wallet needing multiple approvals for transactions.", category: "Tech", related: ["Wallet", "Security"] },
    { term: "NFT", def: "Non-Fungible Token; unique digital asset.", category: "Tech", related: ["ERC-721", "Minting"] },
    { term: "Node", def: "A computer supporting a blockchain network.", category: "Tech", related: ["Validator", "Consensus"] },
    { term: "Nonce", def: "Number used once in mining to find a block.", category: "Tech", related: ["Mining", "Hash"] },
    { term: "Oracle", def: "Service feeding real-world data to smart contracts.", category: "Tech", related: ["Smart Contract", "DeFi"] },
    { term: "Paper Wallet", def: "Physical printout of crypto keys.", category: "Tech", related: ["Cold Wallet", "Seed Phrase"] },
    { term: "P2P", def: "Peer-to-Peer; direct user transactions.", category: "Tech", related: ["DEX", "Decentralized"] },
    { term: "Private Key", def: "Secret code to access your crypto wallet.", category: "Tech", related: ["Public Key", "Wallet"] },
    { term: "Proof of Stake", def: "Consensus using staked crypto for validation.", category: "Tech", related: ["Staking", "Validator"] },
    { term: "Proof of Work", def: "Consensus using computational effort.", category: "Tech", related: ["Mining", "Difficulty"] },
    { term: "Public Key", def: "Address for receiving crypto funds.", category: "Tech", related: ["Private Key", "Address"] },
    { term: "Pump and Dump", def: "Scheme to inflate then crash a coin’s price.", category: "Trading", related: ["Dumping", "Hype"] },
    { term: "Rekt", def: "Slang for major financial loss in crypto.", category: "Slang", related: ["Bagholder", "Rug Pull"] },
    { term: "Rug Pull", def: "Scam where devs abandon a project with funds.", category: "Slang", related: ["Shitcoin", "Rekt"] },
    { term: "Satoshi", def: "Smallest Bitcoin unit (1 BTC = 100M Satoshis).", category: "Basics", related: ["Bitcoin", "Coin"] },
    { term: "Seed Phrase", def: "Words to recover a crypto wallet.", category: "Tech", related: ["Wallet", "Private Key"] },
    { term: "Sharding", def: "Splitting a blockchain for better scalability.", category: "Tech", related: ["Layer 2", "Scalability"] },
    { term: "Shitcoin", def: "Slang for a worthless or scam crypto.", category: "Slang", related: ["Rug Pull", "Vaporware"] },
    { term: "Sidechain", def: "Separate blockchain linked to the main one.", category: "Tech", related: ["Layer 2", "Cross-Chain"] },
    { term: "Smart Contract", def: "Self-executing code with predefined rules.", category: "Tech", related: ["DApp", "Oracle"] },
    { term: "Soft Fork", def: "Backward-compatible blockchain update.", category: "Tech", related: ["Fork", "BIP"] },
    { term: "Stablecoin", def: "Crypto pegged to a stable asset (e.g., USD).", category: "Basics", related: ["Fiat", "Peg"] },
    { term: "Staking", def: "Locking crypto to support a network and earn rewards.", category: "Tech", related: ["Proof of Stake", "Yield Farming"] },
    { term: "Testnet", def: "Sandbox blockchain for testing.", category: "Tech", related: ["Mainnet", "Faucet"] },
    { term: "Token", def: "Digital asset built on an existing blockchain.", category: "Basics", related: ["Coin", "ERC-20"] },
    { term: "Transaction Fee", def: "Cost to process a blockchain transaction.", category: "Tech", related: ["Gas", "Mempool"] },
    { term: "Tumbling", def: "Mixing crypto to hide its origin.", category: "Tech", related: ["Privacy", "Dust"] },
    { term: "Validator", def: "Node confirming transactions in Proof of Stake.", category: "Tech", related: ["Proof of Stake", "Node"] },
    { term: "Volatility", def: "Degree of price swings in a crypto.", category: "Trading", related: ["Bull Market", "Bear Market"] },
    { term: "Wallet", def: "Tool to store and manage crypto keys.", category: "Tech", related: ["Private Key", "Seed Phrase"] },
    { term: "Whale", def: "Entity with a massive crypto holding.", category: "Slang", related: ["Market Cap", "Liquidity"] },
    { term: "Whitepaper", def: "Document detailing a crypto project’s goals.", category: "Basics", related: ["ICO", "Roadmap"] },
    { term: "Yield Farming", def: "Earning rewards via DeFi lending or staking.", category: "DeFi", related: ["Farming", "Liquidity Pool"] },
    { term: "Zero-Knowledge Proof", def: "Proving something without revealing details.", category: "Tech", related: ["Privacy", "zk-SNARK"] },
    { term: "51% Attack", def: "Controlling over 50% of a network’s hashrate.", category: "Tech", related: ["Security", "Mining"] },
    { term: "Atomic Swap", def: "Direct crypto trade across blockchains.", category: "Tech", related: ["Cross-Chain", "P2P"] },
    { term: "BTFD", def: "Buy The F***ing Dip; buy low during dips.", category: "Slang", related: ["DCA", "Bear Market"] },
    { term: "Cross-Chain", def: "Linking different blockchains for interoperability.", category: "Tech", related: ["Sidechain", "Atomic Swap"] },
    { term: "DCA", def: "Dollar-Cost Averaging; investing fixed amounts over time.", category: "Trading", related: ["BTFD", "Volatility"] },
    { term: "Diamond Hands", def: "Holding crypto through volatility.", category: "Slang", related: ["HODL", "Paper Hands"] },
    { term: "Dust Attack", def: "Sending tiny crypto to identify wallet owners.", category: "Tech", related: ["Dust", "Privacy"] },
    { term: "EVM", def: "Ethereum Virtual Machine; runs smart contracts.", category: "Tech", related: ["Smart Contract", "Gas"] },
    { term: "Faucet", def: "Site giving free testnet crypto.", category: "Tech", related: ["Testnet", "Token"] },
    { term: "Flippening", def: "Ethereum surpassing Bitcoin in market cap.", category: "Trading", related: ["Market Cap", "Altcoin"] },
    { term: "Gas Limit", def: "Max gas a user will pay for a transaction.", category: "Tech", related: ["Gas", "Transaction Fee"] },
    { term: "Hard Cap", def: "Max supply or funds a project aims for.", category: "Basics", related: ["ICO", "Token"] },
    { term: "Layer 2", def: "Scalability solutions on top of a blockchain.", category: "Tech", related: ["Sharding", "Rollup"] },
    { term: "Merkle Tree", def: "Structure for efficient transaction verification.", category: "Tech", related: ["Hash", "Block"] },
    { term: "Sybil Attack", def: "Flooding a network with fake identities.", category: "Tech", related: ["Security", "Consensus"] },
    { term: "Wash Trading", def: "Fake trading to boost volume.", category: "Trading", related: ["Pump and Dump", "Liquidity"] },
    { term: "Address", def: "Unique identifier for sending/receiving crypto.", category: "Tech", related: ["Public Key", "Wallet"] },
    { term: "Bearish", def: "Expecting prices to fall.", category: "Trading", related: ["Bear Market", "TA"] },
    { term: "Bullish", def: "Expecting prices to rise.", category: "Trading", related: ["Bull Market", "TA"] },
    { term: "CEX", def: "Centralized Exchange; traditional trading platform.", category: "Trading", related: ["DEX", "KYC"] },
    { term: "Circulating Supply", def: "Total coins available in the market.", category: "Trading", related: ["Market Cap", "Total Supply"] },
    { term: "Coin", def: "A cryptocurrency with its own blockchain.", category: "Basics", related: ["Token", "Altcoin"] },
    { term: "Cold Storage", def: "Offline storage for crypto security.", category: "Tech", related: ["Cold Wallet", "Paper Wallet"] },
    { term: "Dusting", def: "Sending small crypto amounts to track wallets.", category: "Tech", related: ["Dust Attack", "Privacy"] },
    { term: "Escrow", def: "Third-party holding funds until conditions are met.", category: "Trading", related: ["P2P", "Smart Contract"] },
    { term: "FUDster", def: "Someone spreading FUD to manipulate markets.", category: "Slang", related: ["FUD", "Hype"] },
    { term: "Goxxed", def: "Losing funds due to an exchange hack (from Mt. Gox).", category: "Slang", related: ["Rekt", "CEX"] },
    { term: "Hard Fork", def: "Non-compatible blockchain split.", category: "Tech", related: ["Fork", "Soft Fork"] },
    { term: "Hype", def: "Exaggerated excitement driving crypto prices.", category: "Slang", related: ["FOMO", "Pump and Dump"] },
    { term: "IDO", def: "Initial DEX Offering; token sale on a DEX.", category: "DeFi", related: ["ICO", "DEX"] },
    { term: "Impermanent Loss", def: "Loss from providing liquidity in DeFi.", category: "DeFi", related: ["Yield Farming", "Liquidity Pool"] },
    { term: "Lambo", def: "Slang for profits big enough to buy a Lamborghini.", category: "Slang", related: ["Moon", "To The Moon"] },
    { term: "Layer 0", def: "Base infrastructure for blockchain connectivity.", category: "Tech", related: ["Layer 2", "Cross-Chain"] },
    { term: "Leverage", def: "Borrowing to amplify trading gains/losses.", category: "Trading", related: ["Margin", "Volatility"] },
    { term: "Limit Order", def: "Order to buy/sell at a specific price.", category: "Trading", related: ["Market Order", "Liquidity"] },
    { term: "Liquidity Pool", def: "Funds locked in a smart contract for trading.", category: "DeFi", related: ["DEX", "Farming"] },
    { term: "Market Order", def: "Order to buy/sell at current market price.", category: "Trading", related: ["Limit Order", "Slippage"] },
    { term: "Memecoin", def: "Crypto based on internet memes (e.g., Dogecoin).", category: "Slang", related: ["Shitcoin", "Hype"] },
    { term: "Metaverse", def: "Virtual world often tied to blockchain assets.", category: "Tech", related: ["NFT", "Web3"] },
    { term: "MEV", def: "Miner Extractable Value; profit from reordering transactions.", category: "Tech", related: ["Mining", "Mempool"] },
    { term: "Minting", def: "Creating new tokens or NFTs on a blockchain.", category: "Tech", related: ["NFT", "Token"] },
    { term: "Paper Hands", def: "Selling crypto at the first sign of trouble.", category: "Slang", related: ["Diamond Hands", "HODL"] },
    { term: "Peg", def: "Fixing a crypto’s value to another asset.", category: "Tech", related: ["Stablecoin", "Fiat"] },
    { term: "Rollup", def: "Layer 2 solution bundling transactions.", category: "Tech", related: ["Layer 2", "Sharding"] },
    { term: "Slippage", def: "Price difference between order and execution.", category: "Trading", related: ["Liquidity", "Market Order"] },
    { term: "TA", def: "Technical Analysis; predicting prices with charts.", category: "Trading", related: ["Candlestick", "Volatility"] },
    { term: "To The Moon", def: "Slang for expecting a huge price surge.", category: "Slang", related: ["Moon", "Lambo"] },
    { term: "Total Supply", def: "All coins ever created for a crypto.", category: "Trading", related: ["Circulating Supply", "Market Cap"] },
    { term: "TxID", def: "Transaction ID; unique transaction identifier.", category: "Tech", related: ["Mempool", "Ledger"] },
    { term: "UTXO", def: "Unspent Transaction Output; Bitcoin’s transaction model.", category: "Tech", related: ["Dust", "Bitcoin"] },
    { term: "Vaporware", def: "A hyped project that never materializes.", category: "Slang", related: ["Shitcoin", "Rug Pull"] },
    { term: "Web3", def: "Decentralized internet powered by blockchain.", category: "Tech", related: ["Metaverse", "DApp"] },
];

   // Utility function to shuffle arrays
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Auto-generate questions from glossary terms
const generateGlossaryQuestions = (terms) => {
  try {
    return terms.map((term) => {
      if (!term.def || !term.term) {
        console.error(`Invalid term: ${JSON.stringify(term)}`);
        return null;
      }
      const correctAnswer = term.def;
      // Generate wrong answers by picking definitions from other terms
      const otherDefs = terms
        .filter((t) => t.def !== correctAnswer && t.def)
        .map((t) => t.def);
      const wrongAnswers = shuffleArray([...otherDefs]).slice(0, 3);
      const options = shuffleArray([correctAnswer, ...wrongAnswers]);
      const difficulty =
        term.category === "Basics" || term.category === "Education"
          ? "beginner"
          : term.category === "Tech" || term.category === "Trading" || term.category === "Historical"
          ? "intermediate"
          : "advanced";
      return {
        question: `What does "${term.term}" mean?`,
        options,
        correctAnswer,
        difficulty,
      };
    }).filter((q) => q !== null);
  } catch (error) {
    console.error("Error generating glossary questions:", error);
    return [];
  }
};

// Main Question Pool (5 per difficulty level, 15 total)
const questionPool = [
  // Beginner
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

export default function CryptoQuiz() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelQuestions, setLevelQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [username, setUsername] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentTab, setCurrentTab] = useState("quiz");
  const [analytics, setAnalytics] = useState(null);

  // Initialize analytics client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("firebase/analytics").then(({ getAnalytics }) => {
        import("firebase/app").then(({ getApp }) => {
          const analyticsInstance = getAnalytics(getApp());
          setAnalytics(analyticsInstance);
        });
      });
    }
  }, []);

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
    if (analytics) {
      import("firebase/analytics").then(({ logEvent }) => {
        logEvent(analytics, "username_submitted", { username: sanitized });
      });
    }
  };

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setShowDifficultyModal(false);
    setLevelQuestions(getLevelQuestions(allQuestions, selectedDifficulty));
  };

  const updateScore = async (newScore) => {
    const today = new Date().toDateString();
    await set(ref(db, `users/${username}`), { totalScore: newScore, lastUpdated: today });
    await set(ref(db, `weeklyLeaderboard/${username}`), {
      username,
      score: newScore,
      timestamp: Date.now(),
    });
  };

  const fetchLeaderboard = () => {
    const leaderRef = ref(db, "weeklyLeaderboard");
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

  const checkAchievements = useCallback(
    (points) => {
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

      if (newAchievements.length > achievements.length && analytics) {
        import("firebase/analytics").then(({ logEvent }) => {
          logEvent(analytics, "achievement_earned", {
            achievement: newAchievements[newAchievements.length - 1],
            username,
          });
        });
      }
    },
    [achievements, score, currentQuestion, currentLevel, difficulty, timeLeft, analytics, username]
  );

  const handleAnswer = useCallback(
    (answer) => {
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
    },
    [
      currentLevel,
      currentQuestion,
      levelQuestions,
      difficulty,
      streak,
      score,
      username,
      analytics,
      checkAchievements,
      updateScore,
    ]
  );

  useEffect(() => {
    try {
      const savedUsername = localStorage.getItem("quizUsername");
      if (savedUsername) {
        setUsername(savedUsername);
        setShowUsernameModal(false);
      }
      const completedLevels = checkDailyProgress();
      const glossaryQuestions = generateGlossaryQuestions(glossaryTerms);
      const validQuestions = [...questionPool, ...glossaryQuestions].filter(
        (q) => q && q.question && q.correctAnswer && q.options && q.difficulty
      );
      if (validQuestions.length === 0) {
        console.error("No valid questions generated");
        return;
      }
      setAllQuestions(validQuestions);
      setCurrentLevel(completedLevels + 1);
      if (completedLevels >= 5) setDailyCompleted(true);
      fetchLeaderboard();

      if (analytics) {
        import("firebase/analytics").then(({ logEvent }) => {
          logEvent(analytics, "page_view", { page_title: "Crypto Quiz" });
        });
      }
    } catch (error) {
      console.error("Error initializing quiz:", error);
    }
  }, [analytics]);

  useEffect(() => {
    if (
      timeLeft > 0 &&
      !showResult &&
      !selectedAnswer &&
      currentTab === "quiz" &&
      !dailyCompleted &&
      difficulty
    ) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleAnswer(null);
    }
  }, [timeLeft, selectedAnswer, showResult, currentTab, dailyCompleted, difficulty, handleAnswer]);

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

  // Username Modal
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

  // Difficulty Selection Modal
  if (showDifficultyModal) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Choose Your Difficulty</h1>
        <div className={styles.section}>
          <button
            onClick={() => handleDifficultySelect("beginner")}
            className={styles.xLink}
          >
            Beginner
          </button>
          <button
            onClick={() => handleDifficultySelect("intermediate")}
            className={styles.xLink}
          >
            Intermediate
          </button>
          <button
            onClick={() => handleDifficultySelect("advanced")}
            className={styles.xLink}
          >
            Advanced
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
          <h1 className={styles.pageTitle}>Weekly Leaderboard</h1>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Miners (Weekly)</h2>
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
            <p>Levels Completed Today: {checkDailyProgress()}</p>
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