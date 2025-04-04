import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export default defineSchema({
  portfolios: defineTable({
    username: v.string(),
    symbol: v.string(),
    amount: v.number(),
  }).index("by_username", ["username"]),
});

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolios")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .collect();
  },
});

export const addAsset = mutation({
  args: { username: v.string(), symbol: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("portfolios", {
      username: args.username,
      symbol: args.symbol,
      amount: args.amount,
    });
  },
});