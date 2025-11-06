"use client"

import { Button } from "@/components/ui/button"
import { ListTodo, CircleDashed, CheckCircle2 } from "lucide-react"

type FilterStatus = "all" | "pending" | "completed"

interface TaskFiltersProps {
  activeFilter: FilterStatus
  onFilterChange: (filter: FilterStatus) => void
  counts: {
    all: number
    pending: number
    completed: number
  }
}

export function TaskFilters({ activeFilter, onFilterChange, counts }: TaskFiltersProps) {
  const getBadgeClasses = (isActive: boolean) =>
    `ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
      isActive ? "bg-primary text-white" : "bg-primary/20 text-primary"
    }`

  return (
    <div className="flex flex-wrap gap-3">
      {/* All */}
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        className="gap-2 font-semibold"
      >
        <ListTodo className="h-4 w-4" />
        All Tasks
        <span className={getBadgeClasses(activeFilter === "all")}>{counts.all}</span>
      </Button>

      {/* Pending */}
      <Button
        variant={activeFilter === "pending" ? "default" : "outline"}
        onClick={() => onFilterChange("pending")}
        className="gap-2 font-semibold"
      >
        <CircleDashed className="h-4 w-4" />
        Pending
        <span className={getBadgeClasses(activeFilter === "pending")}>{counts.pending}</span>
      </Button>

      {/* Completed */}
      <Button
        variant={activeFilter === "completed" ? "default" : "outline"}
        onClick={() => onFilterChange("completed")}
        className="gap-2 font-semibold"
      >
        <CheckCircle2 className="h-4 w-4" />
        Completed
        <span className={getBadgeClasses(activeFilter === "completed")}>{counts.completed}</span>
      </Button>
    </div>
  )
}
