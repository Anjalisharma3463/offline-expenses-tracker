import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import expensesReducer from "../features/expenses/expensesSlice"
import syncReducer from "../features/sync/syncSlice"
import {
  type TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
