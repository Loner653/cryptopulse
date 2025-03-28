export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol")?.toUpperCase(); // Convert to uppercase
  
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    // Convert symbol to CoinPaprika ID
    const coinId = coinSymbolToId[symbol];
  
    if (!coinId) {
      return new Response(JSON.stringify({ error: "Symbol not found in CoinPaprika" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      console.log(`Fetching data for: ${symbol} -> ${coinId}`);
  
      const response = await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`);
  
      if (!response.ok) {
        throw new Error(`CoinPaprika API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const formattedData = {
        name: data.name,
        symbol: data.symbol,
        price: data.quotes.USD.price,
        market_cap: data.quotes.USD.market_cap,
        volume_24h: data.quotes.USD.volume_24h,
        percent_change_24h: data.quotes.USD.percent_change_24h,
        circulating_supply: data.circulating_supply,
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
  