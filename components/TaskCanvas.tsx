'use client';

import dynamic from 'next/dynamic';
import { useQuery, useMutation } from "convex/react";
import { Rect, Text } from "react-konva";
import { useState, useEffect } from "react";
import { api } from "../convex/_generated/api";
import { KonvaEventObject } from 'konva/lib/Node';
import { Id } from "../convex/_generated/dataModel";

const Stage = dynamic(() => import('react-konva').then((mod) => mod.Stage), {
  ssr: false
});
const Layer = dynamic(() => import('react-konva').then((mod) => mod.Layer), {
  ssr: false
});

interface TaskCanvasProps {
  boardId: string;
}

export default function TaskCanvas({ boardId }: TaskCanvasProps) {
  const tasks = useQuery(api.tasks.getTasks, { boardId })
  const updateTaskPosition = useMutation(api.tasks.updateTaskPosition)
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, taskId: Id<"tasks">) => {
    updateTaskPosition({
      id: taskId,
      position: { x: e.target.x(), y: e.target.y() },
    })
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = e.target.getStage()
    
    if (!stage) return
    
    const oldScale = stage.scaleX()
    const pointerPos = stage.getPointerPosition()
    
    if (!pointerPos) return
    
    const mousePointTo = {
      x: pointerPos.x / oldScale - stage.x() / oldScale,
      y: pointerPos.y / oldScale - stage.y() / oldScale,
    }
    
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    setStageScale(newScale)
    setStagePosition({
      x: -(mousePointTo.x - pointerPos.x / newScale) * newScale,
      y: -(mousePointTo.y - pointerPos.y / newScale) * newScale,
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

