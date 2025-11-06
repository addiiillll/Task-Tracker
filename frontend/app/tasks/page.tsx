"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { EditTaskModal } from "@/components/edit-task-modal"
import { Sparkles } from "lucide-react"
import { tasksApi, type Task as ApiTask } from "@/lib/api/tasks"
import { authApi } from "@/lib/api/auth"
import { AuthModal } from "@/components/auth-modal"

interface Task extends Omit<ApiTask, 'createdAt'> {
  createdAt: Date
}

type FilterStatus = "all" | "pending" | "completed"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const fetchTasks = useCallback(async (status?: FilterStatus) => {
    setLoading(true)
    try {
      const data = await tasksApi.list(status)
      setTasks(
        data.map((t) => ({
          ...t,
          description: t.description || "",
          createdAt: new Date(t.createdAt),
        }))
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks(filter)
  }, [fetchTasks, filter])

  useEffect(() => {
    // try to validate session on load
    authApi
      .validate()
      .then((r) => setUserEmail(r.user.email))
      .catch(() => setUserEmail(null))
  }, [])

  const addTask = useCallback(async (title: string, description: string) => {
    try {
      const created = await tasksApi.create({ title, description })
      setTasks((prev) => [
        { ...created, description: created.description || "", createdAt: new Date(created.createdAt) },
        ...prev,
      ])
    } catch (e) {
      console.error(e)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      await tasksApi.remove(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const toggleTask = useCallback(async (id: string) => {
    try {
      const updated = await tasksApi.toggle(id)
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: updated.completed } : task)))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const updateTask = useCallback(async (id: string, title: string, description: string) => {
    try {
      const updated = await tasksApi.update(id, { title, description })
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title: updated.title, description: updated.description || "" } : task)))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks
    if (filter === "pending") return tasks.filter((t) => !t.completed)
    return tasks.filter((t) => t.completed)
  }, [tasks, filter])

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks])

  return (
    <main className="min-h-screen">
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
              empty={!loading && filteredTasks.length === 0}
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
    <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={async () => {
          // show email after login/register
          try {
            const r = await authApi.validate()
            setUserEmail(r.user.email)
            await fetchTasks(filter)
          } catch {}
        }}
      />
    </main>
  )
}
