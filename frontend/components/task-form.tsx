"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskFormProps {
  onSubmit: (title: string, description: string, dueDate?: string) => void
  isEditing?: boolean
  initialTitle?: string
  initialDescription?: string
  initialDueDate?: Date | null
}

export function TaskForm({
  onSubmit,
  isEditing = false,
  initialTitle = "",
  initialDescription = "",
  initialDueDate = null,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDueDate ?? undefined)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    onSubmit(title.trim(), description.trim(), dueDate ? dueDate.toISOString() : undefined)
    setTitle("")
    setDescription("")
    setDueDate(undefined)
    setError("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-semibold text-foreground mb-2">
          Task Title
        </label>
        <Input
          id="task-title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError("")
          }}
          className={cn("transition-colors", error && "border-destructive focus:border-destructive")}
        />
        {error && <p className="text-xs text-destructive mt-2 font-medium">{error}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-description" className="block text-sm font-semibold text-foreground mb-2">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="task-description"
          placeholder="Add more details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* 📅 Due Date */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate || undefined}
              onSelect={setDueDate}
              required={false} // ✅ fixes TS error
              initialFocus
            />

          </PopoverContent>
        </Popover>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full h-10 font-semibold gap-2">
        <Plus className="h-4 w-4" />
        {isEditing ? "Update Task" : "Add Task"}
      </Button>
    </form>
  )
}
