export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
  
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      console.log(`Fetching coin data for: ${symbol}`);
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": "5d02a207-b568-416f-8978-38f8fe3e7450", // 
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        console.error(`CoinMarketCap coin data fetch failed: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch coin data from CoinMarketCap");
      }
  
      const data = await response.json();
      console.log(`Coin data for ${symbol}:`, data);
  
      const coinData = data.data[symbol];
      if (!coinData) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }
  
      const formattedData = {
        name: coinData.name,
        symbol: coinData.symbol,
        market_data: {
          price: coinData.quote.USD.price,
          market_cap: coinData.quote.USD.market_cap,
          price_change_percentage_24h: coinData.quote.USD.percent_change_24h,
          total_volume: coinData.quote.USD.volume_24h,
          circulating_supply: coinData.circulating_supply,
        },
      };
  
      return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(`Error fetching coin data for ${symbol}:`, error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }