import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recommendations: defineTable({
    title: v.string(),
    genre: v.string(),
    link: v.string(),
    blurb: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    isStaffPick: v.boolean(),
  })
    .index("by_author", ["authorId"])
    .index("by_genre", ["genre"]),

  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }).index("by_clerk_id", ["clerkId"]),
});
