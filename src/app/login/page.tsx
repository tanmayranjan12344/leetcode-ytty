"use client";

import { useState, useEffect } from "react";
import { FaGoogle, FaApple, FaMicrosoft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCountry, setRegCountry] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/profile');
        if (response.ok) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        // Not logged in, stay on login page
        console.error("Auth check error:", error);
      }
    }
    
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success - show message then redirect
      setSuccess("Login successful! Redirecting to dashboard...");
      
      // Short delay before redirect for better UX
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regPassword !== regConfirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          country: regCountry,
          phone: regPhone,
          password: regPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success - switch to login tab and show success message
      setTab('login');
      setSuccess('Registration successful! Please log in with your new account.');
      
      // Clear register form
      setRegName("");
      setRegEmail("");
      setRegCountry("");
      setRegPhone("");
      setRegPassword("");
      setRegConfirm("");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setError(`Social login with ${provider} is not configured yet.`);
    // Implementation would depend on your authentication strategy with Oracle DB
  };

  const socialBtn =
    "flex items-center justify-center gap-2 py-2 rounded-full font-bold shadow transition hover:scale-105";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/syntaxbuddy.png"
          alt="Syntax Buddy Logo"
          width={70}
          height={70}
          className="mb-2"
          style={{
            borderRadius: "16px",
            border: "2px solid #e3e7ee",
            background: "#fff",
          }}
          priority
        />
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
          Syntax Buddy
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          DSA Problems & Video Solutions
        </p>
      </div>
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-blue-100 p-0 backdrop-blur-md">
        <div className="flex">
          <button
            className={`flex-1 py-3 rounded-tl-3xl font-semibold text-lg tracking-wide border-b-2 ${
              tab === "login"
                ? "bg-white text-blue-600 border-blue-500"
                : "bg-blue-50 text-gray-500 border-transparent"
            } transition`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 rounded-tr-3xl font-semibold text-lg tracking-wide border-b-2 ${
              tab === "register"
                ? "bg-white text-blue-600 border-blue-500"
                : "bg-blue-50 text-gray-500 border-transparent"
            } transition`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <label className="font-semibold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="text-right mb-2">
                <a
                  href="/reset-password"
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FaGoogle className="text-red-500" /> Login with Google
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Apple')}
                >
                  <FaApple className="text-gray-800" /> Login with Apple
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Microsoft')}
                >
                  <FaMicrosoft className="text-blue-700" /> Login with Microsoft
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <label className="font-semibold text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Country</label>
              <input
                type="text"
                placeholder="Enter your country"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regCountry}
                onChange={e => setRegCountry(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
              <label className="font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="border border-blue-200 p-3 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FaGoogle className="text-red-500" /> Register with Google
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Apple')}
                >
                  <FaApple className="text-gray-800" /> Register with Apple
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => handleSocialLogin('Microsoft')}
                >
                  <FaMicrosoft className="text-blue-700" /> Register with Microsoft
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}