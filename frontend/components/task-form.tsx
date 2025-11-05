"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void
  isEditing?: boolean
  initialTitle?: string
  initialDescription?: string
}

export function TaskForm({ onSubmit, isEditing = false, initialTitle = "", initialDescription = "" }: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    onSubmit(title.trim(), description.trim())
    setTitle("")
    setDescription("")
    setError("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
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
          className={`transition-colors ${error ? "border-destructive focus:border-destructive" : ""}`}
        />
        {error && <p className="text-xs text-destructive mt-2 font-medium">{error}</p>}
      </div>

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

      <Button type="submit" className="w-full h-10 font-semibold gap-2">
        <Plus className="h-4 w-4" />
        {isEditing ? "Update Task" : "Add Task"}
      </Button>
    </form>
  )
}
