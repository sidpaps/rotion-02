import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.string(),
    assignee: v.string(),
    tags: v.array(v.string()),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    boardId: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", args)
    return taskId
  },
})

export const updateTaskPosition = mutation({
  args: {
    id: v.id("tasks"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { position: args.position })
  },
})

export const getTasks = query({
  args: { boardId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("boardId"), args.boardId))
      .collect()
  },
})

