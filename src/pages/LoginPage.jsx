"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAppContext()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail:username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token) // Store JWT in localStorage

      setUser({
        id: data.userId,
        username: data.username,
        email: data.email,
        profilePhoto: data.profilePhoto || "/loginphoto.avif?height=40&width=40",
      })

      navigate("/home")
    } catch (error) {
      setError(error.message)
    }
  }

  // 🟢 Google OAuth2 Login
  const handleGoogleLogin = () => {
    // Store current location to redirect back after login
    localStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

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
        <h1 className="text-2xl font-bold text-center mb-6">Log in</h1>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleLogin}>
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
          <button type="submit" className="auth-button">
            Log in with email
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-4 text-gray-400">Or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google Login Button */}
        <button
          className="auth-button flex items-center justify-center"
          onClick={handleGoogleLogin}
        >
          <span>Log in with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
