// Dashboard.tsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { checkSession } from "../features/auth/authSlice"
import { toggleOfflineMode, syncExpenses, addToSyncQueue } from "../features/sync/syncSlice"
import { addExpense, editExpense, deleteExpense, setExpenses } from "../features/expenses/expensesSlice"
import { useToast } from "../hooks/use-toast"
import { Navbar } from "../components/navbar/Navbar" 
import { ExpenseForm } from "../components/expense-form/expense-form"
import { SyncStatus } from "../components/sync-status/sync-status"
import ExpenseList from "../components/expense-list/expense-list"
import { Button } from "../components/ui/button"
import { PlusCircle } from "lucide-react"
import { useSessionChecker } from "../hooks/use-session-checker"
import { useSyncStatus } from "../hooks/use-sync-status"
import type { Expense } from "../types"
import type { RootState } from "../lib/store"

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { expenses } = useSelector((state: RootState) => state.expenses)
  const { isOffline, syncStatus, pendingQueue } = useSelector((state: RootState) => state.sync)

  // Custom hooks
  useSessionChecker()
  useSyncStatus()

  useEffect(() => {
    const initializeData = () => {
      dispatch(checkSession())

      const sessionData = localStorage.getItem("session")
      if (!sessionData) {
        navigate("/login")
        return
      }

      try {
        const { user } = JSON.parse(sessionData)
        const storedExpenses = localStorage.getItem(`expenses_${user?.email}`)
        if (storedExpenses) {
          dispatch(setExpenses(JSON.parse(storedExpenses)))
        }

        if (navigator.onLine) {
          const pendingQueue = JSON.parse(localStorage.getItem("pendingQueue") || "[]")
          if (pendingQueue.length > 0) {
            pendingQueue.forEach((item: any) => {
              if (item.type === "add") {
                dispatch(addExpense({ expense: item.data, offline: false }))
              } else if (item.type === "edit") {
                dispatch(editExpense({ expense: item.data, offline: false }))
              } else if (item.type === "delete") {
                dispatch(deleteExpense({ id: item.id, offline: false }))
              }
            })
            localStorage.removeItem("pendingQueue")
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing data:", error)
        navigate("/login")
      }
    }

    const timer = setTimeout(() => {
      initializeData()
    }, 0)

    return () => clearTimeout(timer)
  }, [dispatch, navigate])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleAddExpense = (expense: Expense) => {
    if (isOffline) {
      dispatch(addExpense({ expense, offline: true }))
      dispatch(addToSyncQueue({ type: "add", id: expense.id, data: expense }))
      toast({ title: "Expense Saved Offline", description: "This will sync when you go online" })
    } else {
      dispatch(addExpense({ expense, offline: false }))
      toast({ title: "Expense Added", description: "Your expense has been saved" })
    }
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleEditExpense = (id: string) => {
    const expense = expenses.find((exp) => exp.id === id)
    if (expense) {
      setEditingExpense(expense)
      setShowForm(true)
    }
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    if (isOffline) {
      dispatch(editExpense({ expense: updatedExpense, offline: true }))
      dispatch(addToSyncQueue({ type: "edit", id: updatedExpense.id, data: updatedExpense }))
      toast({ title: "Update Saved Offline", description: "Changes will sync when you go online" })
    } else {
      dispatch(editExpense({ expense: updatedExpense, offline: false }))
      toast({ title: "Expense Updated", description: "Your changes have been saved" })
    }
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id: string) => {
    if (isOffline) {
      dispatch(deleteExpense({ id, offline: true }))
      dispatch(addToSyncQueue({ type: "delete", id }))
      toast({ title: "Delete Saved Offline", description: "This will sync when you go online" })
    } else {
      dispatch(deleteExpense({ id, offline: false }))
      toast({ title: "Expense Deleted", description: "The expense has been removed" })
    }
  }

  const handleToggleOffline = () => {
    const newOfflineState = !isOffline
    dispatch(toggleOfflineMode(newOfflineState))

    if (newOfflineState && pendingQueue.length > 0) {
      dispatch(syncExpenses())
      toast({ title: "Syncing Changes", description: `${pendingQueue.length} changes are being synced` })
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? expense.category === filterCategory : true
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0f172b] via-[#1e2939] to-[#030712] flex flex-col">
      <Navbar />
      <main className="flex-1  container max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your expenses with ease</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <SyncStatus
              isOffline={isOffline}
              syncStatus={syncStatus}
              pendingCount={pendingQueue.length}
              onToggle={handleToggleOffline}
            />
            <Button onClick={() => { setEditingExpense(null); setShowForm(true) }} className="ml-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {showForm && (
          <ExpenseForm
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            onCancel={() => { setShowForm(false); setEditingExpense(null) }}
            initialData={editingExpense}
          />
        )}

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
        />
      </main>
    </div>
  )
}
