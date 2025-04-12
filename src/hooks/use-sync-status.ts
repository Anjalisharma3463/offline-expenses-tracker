import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addExpense, editExpense, deleteExpense } from "../features/expenses/expensesSlice"
import { setSyncStatus, clearSyncQueue, loadSyncQueue } from "../features/sync/syncSlice"
import { useToast } from "./use-toast"
import type { RootState } from "../lib/store"

export function useSyncStatus() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { isOffline, syncStatus, pendingQueue } = useSelector((state: RootState) => state.sync)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (typeof window !== "undefined" && user?.email) {
      try {
        const storedQueue = localStorage.getItem(`syncQueue_${user.email}`)
        if (storedQueue) {
          const queue = JSON.parse(storedQueue)
          dispatch(loadSyncQueue(queue))
          if (queue.length > 0 && !isOffline) {
            dispatch(setSyncStatus("syncing"))
          }
        }
      } catch (error) {
        console.error("Error loading sync queue:", error)
      }
    }
  }, [dispatch, isOffline, user])

  useEffect(() => {
    if (syncStatus === "syncing" && pendingQueue.length > 0) {
      const syncTimeout = setTimeout(() => {
        try {
          pendingQueue.forEach((action) => {
            switch (action.type) {
              case "add":
                if (action.data) {
                  dispatch(addExpense({ expense: action.data, offline: false }))
                }
                break
              case "edit":
                if (action.data) {
                  dispatch(editExpense({ expense: action.data, offline: false }))
                }
                break
              case "delete":
                dispatch(deleteExpense({ id: action.id, offline: false }))
                break
            }
          })

          dispatch(clearSyncQueue())
          dispatch(setSyncStatus("synced"))

          toast({
            title: "Sync Complete",
            description: `${pendingQueue.length} changes have been synchronized`,
          })

          setTimeout(() => {
            dispatch(setSyncStatus("idle"))
          }, 3000)
        } catch (error) {
          console.error("Sync error:", error)
          dispatch(setSyncStatus("error"))

          toast({
            title: "Sync Failed",
            description: "There was an error synchronizing your changes",
            variant: "destructive",
          })
        }
      }, 1500)

      return () => clearTimeout(syncTimeout)
    }
  }, [dispatch, pendingQueue, syncStatus, toast])

  return { isOffline, syncStatus, pendingQueue }
}
