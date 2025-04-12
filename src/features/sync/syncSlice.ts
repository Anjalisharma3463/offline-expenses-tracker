import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Expense } from "../../types"

type SyncAction = {
  type: "add" | "edit" | "delete"
  id: string
  data?: Expense
}

interface SyncState {
  isOffline: boolean
  syncStatus: "idle" | "syncing" | "synced" | "error"
  pendingQueue: SyncAction[]
}

const initialState: SyncState = {
  isOffline: false,
  syncStatus: "idle",
  pendingQueue: [],
}

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    toggleOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload
      if (!action.payload && state.pendingQueue.length > 0) {
        state.syncStatus = "idle"
      } else if (!action.payload) {
        state.syncStatus = "synced"
      }
    },
    addToSyncQueue: (state, action: PayloadAction<SyncAction>) => {
      state.pendingQueue.push(action.payload)
      const userEmail = JSON.parse(localStorage.getItem("session") || "{}")?.user?.email
      if (userEmail) {
        localStorage.setItem(`syncQueue_${userEmail}`, JSON.stringify(state.pendingQueue))
      }
    },
    setSyncStatus: (state, action: PayloadAction<"idle" | "syncing" | "synced" | "error">) => {
      state.syncStatus = action.payload
    },
    clearSyncQueue: (state) => {
      state.pendingQueue = []
      const userEmail = JSON.parse(localStorage.getItem("session") || "{}")?.user?.email
      if (userEmail) {
        localStorage.removeItem(`syncQueue_${userEmail}`)
      }
    },
    syncExpenses: (state) => {
      state.syncStatus = "syncing"
    },
    loadSyncQueue: (state, action: PayloadAction<SyncAction[]>) => {
      state.pendingQueue = action.payload
    },
  },
})

export const { toggleOfflineMode, addToSyncQueue, setSyncStatus, clearSyncQueue, syncExpenses, loadSyncQueue } =
  syncSlice.actions

export default syncSlice.reducer
