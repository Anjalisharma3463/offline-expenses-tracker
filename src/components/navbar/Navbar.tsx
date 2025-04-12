import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import type { RootState } from "../../lib/store"
import { Button } from "../../components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { LogOut } from "lucide-react"
import { Link } from "react-router-dom"

export function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ExpenseTracker</span>
          </Link>
        </div>  
        <div className="flex flex-1 items-center justify-end">
          {isAuthenticated && (
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
