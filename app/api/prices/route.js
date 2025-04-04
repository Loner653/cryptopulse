import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    console.error("No symbols provided in request.");
    return new Response(JSON.stringify({ error: "No symbols provided" }), { status: 400 });
  }

  // Clean symbols: trim, uppercase, filter to 2-5 letters, remove duplicates
  const cleanedSymbols = [...new Set(symbols.split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Z]{2,5}$/.test(s)))]
    .join(",");

  console.log("Received symbols:", symbols);
  console.log("Cleaned symbols for CMC:", cleanedSymbols);

  if (!cleanedSymbols) {
    console.error("No valid symbols after cleaning.");
    return new Response(JSON.stringify({ error: "Invalid symbols" }), { status: 400 });
  }

  try {
    const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
      headers: { "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY },
      params: { symbol: cleanedSymbols, convert: "USD" },
    });
    console.log("CMC API response:", response.data.data);
    return new Response(JSON.stringify(response.data.data), { status: 200 });
  } catch (error) {
    console.error("CMC API error:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch prices" }), { status: 500 });
  }
}