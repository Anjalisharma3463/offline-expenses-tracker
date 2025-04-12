import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  name: string
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  sessionStartTime: number | null
}

const SESSION_TIMEOUT = 10 * 60 * 1000 // 10 minutes

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null, sessionStartTime: null }
  }

  try {
    const sessionData = localStorage.getItem("session")
    if (sessionData) {
      const { user, sessionStartTime } = JSON.parse(sessionData)
      const currentTime = Date.now()

      if (currentTime - sessionStartTime > SESSION_TIMEOUT) {
        localStorage.removeItem("session")
        return { isAuthenticated: false, user: null, sessionStartTime: null }
      }

      return { isAuthenticated: true, user, sessionStartTime }
    }
  } catch (error) {
    console.error("Error parsing session:", error)
  }

  return { isAuthenticated: false, user: null, sessionStartTime: null }
}

const initialState: AuthState = getInitialState()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.sessionStartTime = Date.now()

      if (typeof window !== "undefined") {
        localStorage.setItem("session", JSON.stringify({
          user: action.payload,
          sessionStartTime: Date.now(),
        }))
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.sessionStartTime = null

      if (typeof window !== "undefined") {
        localStorage.removeItem("session")
      }
    },
    checkSession: (state) => {
      if (typeof window === "undefined") return

      try {
        const sessionData = localStorage.getItem("session")
        if (!sessionData) {
          state.isAuthenticated = false
          state.user = null
          state.sessionStartTime = null
          return
        }

        const { user, sessionStartTime } = JSON.parse(sessionData)
        const currentTime = Date.now()

        if (currentTime - sessionStartTime > SESSION_TIMEOUT) {
          localStorage.removeItem("session")
          state.isAuthenticated = false
          state.user = null
          state.sessionStartTime = null
        } else {
          state.isAuthenticated = true
          state.user = user
          state.sessionStartTime = sessionStartTime
        }
      } catch (err) {
        console.error("Error checking session:", err)
        state.isAuthenticated = false
        state.user = null
        state.sessionStartTime = null
      }
    },
  }
})

export const { login, logout, checkSession } = authSlice.actions
export default authSlice.reducer
