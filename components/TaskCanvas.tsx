import { useQuery, useMutation } from "convex/react"
import { Stage, Layer, Rect, Text } from "react-konva"
import { useState, useEffect } from "react"
import { api } from "../convex/_generated/api"

export default function TaskCanvas({ boardId }) {
  const tasks = useQuery(api.tasks.getTasks, { boardId })
  const updateTaskPosition = useMutation(api.tasks.updateTaskPosition)
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })

  const handleDragEnd = (e, taskId) => {
    updateTaskPosition({
      id: taskId,
      position: { x: e.target.x(), y: e.target.y() },
    })
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    }
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    setStageScale(newScale)
    setStagePosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    })
  }

  if (tasks === undefined) {
    return <div>Loading...</div>
  }

  if (tasks === null) {
    return <div>Error loading tasks</div>
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleWheel}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stagePosition.x}
      y={stagePosition.y}
      draggable
    >
      <Layer>
        {tasks.map((task) => (
          <Rect
            key={task._id}
            x={task.position.x}
            y={task.position.y}
            width={200}
            height={100}
            fill="white"
            stroke="black"
            strokeWidth={1}
            draggable
            onDragEnd={(e) => handleDragEnd(e, task._id)}
          />
        ))}
        {tasks.map((task) => (
          <Text
            key={`text-${task._id}`}
            x={task.position.x + 10}
            y={task.position.y + 10}
            text={task.title}
            fontSize={16}
          />
        ))}
      </Layer>
    </Stage>
  )
}

