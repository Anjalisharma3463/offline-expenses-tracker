import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Expense } from "../../types"

interface ExpensesState {
  expenses: Expense[]
}

const initialState: ExpensesState = {
  expenses: [],
}

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
    },
    addExpense: (state, action: PayloadAction<{ expense: Expense; offline: boolean }>) => {
      const { expense, offline } = action.payload
      if (!offline) {
        state.expenses.push(expense)
        const userEmail = JSON.parse(localStorage.getItem("session") || "{}")?.user?.email
        if (userEmail) {
          localStorage.setItem(`expenses_${userEmail}`, JSON.stringify(state.expenses))
        }
      }
    },
    editExpense: (state, action: PayloadAction<{ expense: Expense; offline: boolean }>) => {
      const { expense, offline } = action.payload
      if (!offline) {
        const index = state.expenses.findIndex((e) => e.id === expense.id)
        if (index !== -1) {
          state.expenses[index] = expense
          const userEmail = JSON.parse(localStorage.getItem("session") || "{}")?.user?.email
          if (userEmail) {
            localStorage.setItem(`expenses_${userEmail}`, JSON.stringify(state.expenses))
          }
        }
      }
    },
    deleteExpense: (state, action: PayloadAction<{ id: string; offline: boolean }>) => {
      const { id, offline } = action.payload
      if (!offline) {
        state.expenses = state.expenses.filter((e) => e.id !== id)
        const userEmail = JSON.parse(localStorage.getItem("session") || "{}")?.user?.email
        if (userEmail) {
          localStorage.setItem(`expenses_${userEmail}`, JSON.stringify(state.expenses))
        }
      }
    },
  }
})

export const { setExpenses, addExpense, editExpense, deleteExpense } = expensesSlice.actions
export default expensesSlice.reducer
