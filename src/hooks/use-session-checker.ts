import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { checkSession, logout } from "../features/auth/authSlice"
import { useToast } from "./use-toast"
import type { RootState } from "../lib/store"

const SESSION_TIMEOUT = 10 * 60 * 1000 // 10 minutes
const CHECK_INTERVAL = 30 * 1000 // 30 seconds

export function useSessionChecker() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAuthenticated, sessionStartTime } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return

    dispatch(checkSession())

    const intervalId = setInterval(() => {
      if (!sessionStartTime) return

      const currentTime = Date.now()
      const sessionAge = currentTime - sessionStartTime

      if (sessionAge >= SESSION_TIMEOUT) {
        dispatch(logout())
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        navigate("/login")
      }
    }, CHECK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [dispatch, isAuthenticated, navigate, sessionStartTime, toast])
}
        