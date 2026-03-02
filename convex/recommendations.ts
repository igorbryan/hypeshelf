import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Public Recommendations
export const getLatestPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("recommendations")
      .order("desc")
      .take(5);
  },
});

// Auth Recommendations
export const getAll = query({
  args: { genre: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    
    if (args.genre) {
      return await ctx.db
        .query("recommendations")
        .withIndex("by_genre", (q) => q.eq("genre", args.genre!))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("recommendations")
      .order("desc")
      .collect();
  },
});

// Auth Recommendation Create
export const create = mutation({
  args: {
    title: v.string(),
    genre: v.string(),
    link: v.string(),
    blurb: v.string(),
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    await ctx.db.insert("recommendations", {
      ...args,
      authorId: identity.subject,
      isStaffPick: false,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const rec = await ctx.db.get(args.id);
    if (!rec) throw new Error("Rec not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const isAdmin = user?.role === "admin";
    const isOwner = rec.authorId === identity.subject;

    if (!isAdmin && !isOwner) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

export const toggleStaffPick = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user?.role !== "admin") throw new Error("Unauthorized");

    const rec = await ctx.db.get(args.id);
    if (!rec) throw new Error("Rec not found");

    await ctx.db.patch(args.id, { isStaffPick: !rec.isStaffPick });
  },
});

