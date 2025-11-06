"use client"

import { TaskItem } from "@/components/task-item" // if you have it separately
import { Card } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: Date
  dueDate?: string | null
  owner?: {
    name: string
    email: string
  }
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  empty?: boolean
}

export function TaskList({ tasks, onEdit, onDelete, onToggle, empty }: TaskListProps) {
  if (empty) {
    return (
      <p className="text-center text-muted-foreground py-6">
        No tasks found.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
