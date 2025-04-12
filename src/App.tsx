// src/App.tsx
import AppLayout from "./components/layout/AppLayout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ToastProvider } from "./components/ui/toast"
import { Toast } from "./components/ui/toast"
 
export default function App() {
  return (
    <ToastProvider> 
    <AppLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AppLayout>
    <Toast />
    </ToastProvider>
  )
}
