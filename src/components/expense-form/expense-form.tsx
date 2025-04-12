import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "../../components/ui/popover"
import { Calendar } from "../../components/ui/calendar"
import { cn } from "../../lib/utils"
import type { Expense } from "../../types/index"


interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void
  onCancel: () => void
  initialData?: Expense | null
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Housing",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Travel",
  "Education",
  "Other"
]

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [amount, setAmount] = useState(initialData?.amount.toString() || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [date, setDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!amount) newErrors.amount = "Amount is required"
    else if (isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Amount must be a positive number"
    if (!category) newErrors.category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    setTimeout(() => {
      const expenseData: Expense = {
        id: initialData?.id || uuidv4(),
        title,
        amount: Number.parseFloat(amount),
        category,
        date: date.toISOString(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onSubmit(expenseData)
      setIsLoading(false)
    }, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Expense" : "Add New Expense"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Expense title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category"
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Saving..."}
                </>
              ) : initialData ? (
                "Update Expense"
              ) : (
                "Add Expense"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
