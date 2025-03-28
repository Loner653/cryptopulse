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
    console.log(`Fetching price for symbol: ${symbol}`);
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
      console.error(`CoinMarketCap price fetch failed: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch price from CoinMarketCap");
    }

    const data = await response.json();
    console.log(`Price data for ${symbol}:`, data);
    const price = data.data[symbol]?.quote?.USD?.price;
    if (price) {
      return new Response(JSON.stringify({ price }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Price not found");
    }
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}