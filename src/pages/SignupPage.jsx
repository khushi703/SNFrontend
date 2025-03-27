import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAppContext()

  const signup = async (email, username, password) => {
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      })
  
      // ✅ Check if the response is JSON
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem("token", data.token)
        navigate("/login")
      } else {
        // If not JSON, handle plain text
        const text = await res.text()
        console.log("Response:", text)
        if (res.ok) {
          alert(text) // Show success message as alert
          navigate("/login")
        } else {
          setError(text || "Signup failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error during signup:", error)
      setError("An error occurred. Please try again later.")
    }
  }
  
  // ✅ Correctly defined handleSignup before return
  const handleSignup = async (e) => {
    e.preventDefault() // Prevent page refresh
    await signup(email, username, password) // Call signup
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="auth-card w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img
            src="/Logo.png?height=64&width=64"
            alt="SafeNotes Logo"
            width={64}
            height={64}
            className="rounded"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Sign up</h1>

        {/* ✅ Make sure onSubmit calls handleSignup correctly */}
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Enter Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button type="submit" className="auth-button">
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          By creating an account you agree to our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          .
        </p>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
