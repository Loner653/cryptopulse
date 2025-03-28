import coinListData from "../../data/coin-list.json";

export async function GET() {
  try {
    console.log("Fetching coin list from CoinMarketCap");
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`,
      {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": "5d02a207-b568-416f-8978-38f8fe3e7450", // 
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`CoinMarketCap coin list fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch coin list from CoinMarketCap: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Coin list fetched successfully, total coins:", data.data.length);
    return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching coin list, using cached data:", error.message);
    console.log("Cached coin list, total coins:", coinListData.length);
    return new Response(JSON.stringify(coinListData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}