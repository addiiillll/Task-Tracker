"use client"

import { TaskItem } from "./task-item"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  empty?: boolean
}

export function TaskList({ tasks, onEdit, onDelete, onToggle, empty = false }: TaskListProps) {
  if (empty || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20">
        <div className="text-center">
          <p className="text-muted-foreground text-lg font-semibold">No tasks yet</p>
          <p className="text-muted-foreground text-sm mt-2">Create your first task to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  )
}
