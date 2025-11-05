"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

interface EditTaskModalProps {
  open: boolean
  task: Task | null
  onClose: () => void
  onSave: (id: string, title: string, description: string) => void
}

export function EditTaskModal({ open, task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setError("")
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (task) {
      onSave(task.id, title.trim(), description.trim())
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Task</DialogTitle>
          <DialogDescription>Update your task details and save your changes</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-semibold text-foreground mb-2">
              Title
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError("")
              }}
              className={`transition-colors ${error ? "border-destructive focus:border-destructive" : ""}`}
              placeholder="Task title"
            />
            {error && <p className="text-xs text-destructive mt-2 font-medium">{error}</p>}
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
              placeholder="Task description"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="font-semibold bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="font-semibold gap-2">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
