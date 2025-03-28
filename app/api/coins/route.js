export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || 1, 10);
  
    try {
      const mockData = [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          image: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
          current_price: 60000,
          market_cap: 1200000000000,
          price_change_percentage_24h: 2.5,
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          image: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
          current_price: 4000,
          market_cap: 480000000000,
          price_change_percentage_24h: -1.2,
        },
        {
          id: "binancecoin",
          symbol: "bnb",
          name: "BNB",
          image: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png",
          current_price: 500,
          market_cap: 75000000000,
          price_change_percentage_24h: 0.8,
        },
      ];
      return new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in /api/coins:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }