import { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "./store"  // Adjust the store path as per your project structure

interface Props {
  children: ReactNode
}

export function Providers({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
