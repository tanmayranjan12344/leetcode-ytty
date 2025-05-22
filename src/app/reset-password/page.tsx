"use client";

import { useState } from "react";
import Image from "next/image";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would call your API to send the reset email
  };

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
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center p-10 backdrop-blur-md">
        <Image
          src="/syntaxbuddy.png"
          alt="Syntax Buddy Logo"
          width={70}
          height={70}
          className="mb-4"
          style={{
            borderRadius: "16px",
            border: "2px solid #e3e7ee",
            background: "#fff",
          }}
          priority
        />
        <h1 className="text-2xl font-extrabold text-blue-700 mb-2 tracking-tight text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>
        {submitted ? (
          <div className="text-green-600 font-semibold text-center">
            If an account with that email exists, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <label className="font-semibold text-gray-700 text-left">Email Address</label>
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
              className="bg-blue-600 text-white py-2 rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}