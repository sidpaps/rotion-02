import { useState } from "react"
import { useMutation } from "convex/react"

export default function NewTaskForm({ boardId }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const createTask = useMutation("tasks.createTask")

  const handleSubmit = (e) => {
    e.preventDefault()
    createTask({
      title,
      description,
      status: "To-Do",
      assignee: "",
      tags: [],
      position: { x: 100, y: 100 },
      boardId,
    })
    setTitle("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
    </form>
  )
}

