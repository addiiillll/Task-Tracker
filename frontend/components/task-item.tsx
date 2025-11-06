"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Calendar, Mail } from "lucide-react"
import { format } from "date-fns"

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

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskItem({ task, onEdit, onDelete, onToggle }: TaskItemProps) {
  const formattedDate = task.dueDate ? format(new Date(task.dueDate), "PPP") : null

  return (
    <Card className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm border-border">
      <CardContent className="p-0 flex-1">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div>
            <h3 className={`font-semibold text-foreground ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {formattedDate}
                </span>
              )}
              {task.owner && (
                <>
                  <span>{task.owner.name}</span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {task.owner.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(task.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
