"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskItem({ task, onEdit, onDelete, onToggle }: TaskItemProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1.5 transition-all"
        aria-label="Mark task as complete"
      />

      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-foreground transition-all ${task.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
      </div>

      <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          aria-label="Edit task"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
