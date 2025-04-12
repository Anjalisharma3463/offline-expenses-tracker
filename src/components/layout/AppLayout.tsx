import { ReactNode } from "react"
import { Providers } from "../../lib/providers" 
import { Toast } from "../../components/ui/toaster" // Updated the import path to match the correct relative path
   // This replaces the Toaster import from the original code
   
import "../../index.css"   
import "../../App.css"
interface Props {
  children: ReactNode 
}

export default function AppLayout({ children }: Props) {
  return (
   
      <Providers>
        {children}
        <Toast />
      </Providers>
     
  )
}
