// src/components/OAuthCallback.jsx
"use client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email"); // Get email from URL
    
    if (token) {
        localStorage.setItem("token", token);
        
        // Immediately set basic user info from URL params
        setUser({
            email: email,
            // Temporary basic info while fetching full details
            username: email?.split('@')[0] || 'User',
            profilePhoto: "/loginphoto.avif"
        });
        
        fetchUserDetails(token);
    } else {
        navigate("/login", { state: { error: "Authentication failed" } });
    }
}, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user details");

      const data = await response.json();
      setUser({
        id: data.userId,
        username: data.username,
        email: data.email,
        profilePhoto: data.profilePhoto || "/loginphoto.avif",
      });

      navigate("/home");
    } catch (err) {
      navigate("/login", { state: { error: err.message } });
    }
  };

  return <div>Loading...</div>;
}