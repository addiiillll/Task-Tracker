"use client"

import { useState, useCallback } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { EditTaskModal } from "@/components/edit-task-modal"
import { CheckCircle2, Sparkles } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

type FilterStatus = "all" | "pending" | "completed"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
    }
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }, [])

  const updateTask = useCallback((id: string, title: string, description: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title, description } : task)))
  }, [])

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Task Tracker</h1>
              <p className="text-sm text-muted-foreground">Stay organized and productive</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* Add Task Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>
            </div>
            <TaskForm onSubmit={addTask} />
          </section>

          {/* Filters Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Filter Tasks</h2>
              <TaskFilters activeFilter={filter} onFilterChange={setFilter} counts={counts} />
            </div>
          </section>

          {/* Task List Section */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {filter === "all" && "All Tasks"}
              {filter === "pending" && "Pending Tasks"}
              {filter === "completed" && "Completed Tasks"}
            </h2>
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={deleteTask}
              onToggle={toggleTask}
              empty={filteredTasks.length === 0}
            />
          </section>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTaskModal
        open={showEditModal}
        task={editingTask}
        onClose={() => setShowEditModal(false)}
        onSave={updateTask}
      />
    </main>
  )
}
