"use client"

import { useState } from "react"
import TaskCanvas from "../components/TaskCanvas"
import NewTaskForm from "../components/NewTaskForm"

export default function Home() {
  const [boardId] = useState("main-board")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Canvas Task Management</h1>
      <div className="w-full max-w-md mb-8">
        <NewTaskForm boardId={boardId} />
      </div>
      <TaskCanvas boardId={boardId} />
    </main>
  )
}

