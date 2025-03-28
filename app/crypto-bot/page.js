"use client";

import { useEffect, useState, useCallback } from "react";
import coinListData from "../data/coin-list.json";

export default function CryptoBotPage() {
  const [coinList, setCoinList] = useState(coinListData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoinList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/get-coin-list");
      if (!response.ok) {
        throw new Error("Failed to fetch coin list");
      }
      const data = await response.json();
      setCoinList(data);
      console.log("Coin list loaded from API, total coins:", data.length);
    } catch (error) {
      console.error("Error fetching coin list, using cached data:", error.message);
      setCoinList(coinListData);
      console.log("Coin list loaded from cache, total coins:", coinListData.length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoinList();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://embed.tawk.to/67e617ed84c833190b654d9f/1indcqu9r";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    script.onload = () => {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.setAttributes({
          name: "Crypto Bot",
        });

        window.Tawk_API.onChatMessageVisitor = async function (message) {
          console.log("User message received:", message);
          const userMessage = message.toLowerCase().trim();

          if (isLoading) {
            window.Tawk_API.addMessage({
              type: "msg",
              text: "I’m still loading the coin list, please wait a moment...",
            });
            return;
          }

          if (coinList.length === 0) {
            window.Tawk_API.addMessage({
              type: "msg",
              text: "Sorry, I couldn’t load the list of cryptocurrencies. Please try again later.",
            });
            return;
          }

          let detectedCoin = null;
          let coinName = "";
          let coinSymbol = "";
          for (const coin of coinList) {
            const nameMatch = userMessage.includes(coin.name.toLowerCase());
            const symbolMatch = userMessage.includes(coin.symbol.toLowerCase());
            if (nameMatch || symbolMatch) {
              detectedCoin = coin;
              coinName = nameMatch ? coin.name : coin.symbol;
              coinSymbol = coin.symbol;
              break;
            }
          }

          console.log("Detected coin:", detectedCoin, "Display name:", coinName);

          if (!detectedCoin) {
            window.Tawk_API.addMessage({
              type: "msg",
              text: "Sorry, I couldn’t find that cryptocurrency. Please try another coin or check the spelling.",
            });
            return;
          }

          if (
            userMessage.includes("price of") ||
            userMessage.includes("price") ||
            userMessage.includes("how much is")
          ) {
            try {
              console.log("Fetching price for:", coinSymbol);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Fetching the price of ${coinName}, please wait...`,
              });
              const response = await fetch(`/api/get-price?symbol=${coinSymbol}`);
              if (!response.ok) {
                throw new Error("Failed to fetch price from server");
              }
              const data = await response.json();
              console.log("Price response:", data);
              if (data.error) {
                throw new Error(data.error);
              }
              const price = data.price;
              if (price) {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `The current price of ${coinName} (${coinSymbol}) is $${price.toLocaleString()} USD.`,
                });
              } else {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `Sorry, I couldn’t fetch the price of ${coinName}.`,
                });
              }
            } catch (error) {
              console.error("Price fetch error:", error.message);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Error: ${error.message}. Try again later.`,
              });
            }
          } else if (
            userMessage.includes("market cap of") ||
            userMessage.includes("market cap")
          ) {
            try {
              console.log("Fetching market cap for:", coinSymbol);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Fetching the market cap of ${coinName}, please wait...`,
              });
              const response = await fetch(`/api/get-coin-data?symbol=${coinSymbol}`);
              if (!response.ok) {
                throw new Error("Failed to fetch coin data from server");
              }
              const data = await response.json();
              console.log("Coin data response:", data);
              if (data.error) {
                throw new Error(data.error);
              }
              const marketCap = data.market_data?.market_cap;
              if (marketCap) {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `The market cap of ${coinName} (${coinSymbol}) is $${marketCap.toLocaleString()} USD.`,
                });
              } else {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `Sorry, I couldn’t fetch the market cap of ${coinName}.`,
                });
              }
            } catch (error) {
              console.error("Market cap fetch error:", error.message);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Error: ${error.message}. Try again later.`,
              });
            }
          } else if (
            userMessage.includes("24h change of") ||
            userMessage.includes("24h change") ||
            userMessage.includes("24 hour change")
          ) {
            try {
              console.log("Fetching 24h change for:", coinSymbol);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Fetching the 24h price change of ${coinName}, please wait...`,
              });
              const response = await fetch(`/api/get-coin-data?symbol=${coinSymbol}`);
              if (!response.ok) {
                throw new Error("Failed to fetch coin data from server");
              }
              const data = await response.json();
              console.log("Coin data response:", data);
              if (data.error) {
                throw new Error(data.error);
              }
              const priceChange = data.market_data?.price_change_percentage_24h;
              if (priceChange !== undefined) {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `The 24h price change of ${coinName} (${coinSymbol}) is ${priceChange.toFixed(2)}%.`,
                });
              } else {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `Sorry, I couldn’t fetch the 24h price change of ${coinName}.`,
                });
              }
            } catch (error) {
              console.error("24h change fetch error:", error.message);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Error: ${error.message}. Try again later.`,
              });
            }
          } else if (
            userMessage.includes("24h volume of") ||
            userMessage.includes("24h volume") ||
            userMessage.includes("24 hour volume")
          ) {
            try {
              console.log("Fetching 24h volume for:", coinSymbol);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Fetching the 24h trading volume of ${coinName}, please wait...`,
              });
              const response = await fetch(`/api/get-coin-data?symbol=${coinSymbol}`);
              if (!response.ok) {
                throw new Error("Failed to fetch coin data from server");
              }
              const data = await response.json();
              console.log("Coin data response:", data);
              if (data.error) {
                throw new Error(data.error);
              }
              const volume = data.market_data?.total_volume;
              if (volume) {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `The 24h trading volume of ${coinName} (${coinSymbol}) is $${volume.toLocaleString()} USD.`,
                });
              } else {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `Sorry, I couldn’t fetch the 24h trading volume of ${coinName}.`,
                });
              }
            } catch (error) {
              console.error("24h volume fetch error:", error.message);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Error: ${error.message}. Try again later.`,
              });
            }
          } else if (
            userMessage.includes("circulating supply of") ||
            userMessage.includes("circulating supply")
          ) {
            try {
              console.log("Fetching circulating supply for:", coinSymbol);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Fetching the circulating supply of ${coinName}, please wait...`,
              });
              const response = await fetch(`/api/get-coin-data?symbol=${coinSymbol}`);
              if (!response.ok) {
                throw new Error("Failed to fetch coin data from server");
              }
              const data = await response.json();
              console.log("Coin data response:", data);
              if (data.error) {
                throw new Error(data.error);
              }
              const supply = data.market_data?.circulating_supply;
              if (supply) {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `The circulating supply of ${coinName} (${coinSymbol}) is ${supply.toLocaleString()} tokens.`,
                });
              } else {
                window.Tawk_API.addMessage({
                  type: "msg",
                  text: `Sorry, I couldn’t fetch the circulating supply of ${coinName}.`,
                });
              }
            } catch (error) {
              console.error("Circulating supply fetch error:", error.message);
              window.Tawk_API.addMessage({
                type: "msg",
                text: `Error: ${error.message}. Try again later.`,
              });
            }
          } else {
            window.Tawk_API.addMessage({
              type: "msg",
              text: `I can help with questions about price, market cap, 24h change, 24h volume, or circulating supply for ${coinName}. What would you like to know?`,
            });
          }
        };
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [fetchCoinList, isLoading, coinList]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Crypto Assistant</h1>
      <p>
        Ask me about crypto prices, market cap, 24h change, 24h volume, or circulating supply for any cryptocurrency (e.g., \'Price of Bitcoin\', \'Market cap of Litecoin\', \'24h volume of Namecoin\', \'Circulating supply of Phoenixcoin\')
      </p>
      <p>Use the chat widget in the bottom-right corner to ask questions!</p>
    </div>
  );
}