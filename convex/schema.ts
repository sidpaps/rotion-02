import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tasks: defineTable({
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
  }),
  boards: defineTable({
    name: v.string(),
    description: v.string(),
  }),
  comments: defineTable({
    taskId: v.string(),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }),
})

