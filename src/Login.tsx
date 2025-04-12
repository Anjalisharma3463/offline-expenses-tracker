import  { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login } from "./features/auth/authSlice"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Label } from "./components/ui/label"
import { useToast } from "./hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const isAuthenticated = useSelector((state: { auth: { isAuthenticated: boolean } }) => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e:any) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((user: { email: string }) => user.email === email)

      if (!user || user.password !== password) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setTimeout(() => {
        dispatch(login({ name: user.name, email: user.email }))
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        })
        setIsLoading(false)
        navigate("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}