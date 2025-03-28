export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
  
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}`,
        { cache: "no-store" }
      );
  
      if (!response.ok) {
        const errorText = await response.text(); // Get raw response body
        console.error(`CoinGecko fetch failed: Status ${response.status}, Body: ${errorText}`);
        throw new Error(`Failed to fetch from CoinGecko: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
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