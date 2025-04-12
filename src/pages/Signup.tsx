import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../hooks/use-toast"; // Keep same hook if compatible

// UI Components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useSelector((state: { auth: { isAuthenticated: boolean } }) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.some((user: { email: string }) => user.email === email)) {
      toast({
        title: "Error",
        description: "Email already in use",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const newUser = { name, email, password };
    const updatedUsers = [...existingUsers, newUser];

    setTimeout(() => {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      toast({
        title: "Account Created",
        description: "You can now log in with your credentials",
      });
      setIsLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172b] via-[#1e2939] to-[#030712] flex items-center justify-center p-4  ">
      <Card className="w-full bg-white/5 backdrop-blur-lg text-white max-w-md mx-auto border border-white/10">
        <CardHeader className="space-y-1 text-white">
          <CardTitle className="text-2xl text-white font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center   ">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 ">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
  id="name"
  placeholder="John Doe"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
 

/>

            </div>
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
            <Label htmlFor="password">Password</Label>
  <Input
     id="password"
    type="password"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
            </div>
            <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
  <Input
    id="confirmPassword"
    type="password"
    placeholder="Confirm your password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
   />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-white">
            <Button type="submit" className="w-full mt-5 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="text-center text-sm text-white">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}