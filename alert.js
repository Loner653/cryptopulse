import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";

export default defineSchema({
  alerts: defineTable({
    username: v.string(),
    symbol: v.string(),
    targetPrice: v.number(),
    triggered: v.boolean(),
  }).index("by_username", ["username"]),
});

export const getAlerts = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alerts")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .filter((q) => q.eq(q.field("triggered"), false))
      .collect();
  },
});

export const addAlert = mutation({
  args: { username: v.string(), symbol: v.string(), targetPrice: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("alerts", {
      username: args.username,
      symbol: args.symbol,
      targetPrice: args.targetPrice,
      triggered: false,
    });
  },
});

export const checkAlerts = action({
  args: {},
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").filter((q) => q.eq(q.field("triggered"), false)).collect();
    const symbols = [...new Set(alerts.map((a) => a.symbol.toUpperCase()))].join(",");
    if (symbols) {
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_CMC_API_KEY,
          },
        }
      );
      const data = await response.json();

      for (const alert of alerts) {
        const currentPrice = data.data[alert.symbol]?.quote.USD.price || 0;
        if (
          (alert.targetPrice > 0 && currentPrice >= alert.targetPrice) ||
          (alert.targetPrice < 0 && currentPrice <= Math.abs(alert.targetPrice))
        ) {
          await ctx.db.patch(alert._id, { triggered: true });
          // Notification handled client-side
        }
      }
    }
  },
});