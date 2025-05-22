"use client";

import { useState } from "react";
import { FaGoogle, FaApple, FaMicrosoft } from "react-icons/fa";
import Image from "next/image";
import oracledb from "oracledb";

export async function getOracleConnection() {
  return await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING, // e.g. "localhost/XE"
  });
}

export default function Login() {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login\nEmail: ${email}\nPassword: ${password}`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      alert("Passwords do not match!");
      return;
    }
    alert(
      `Register\nName: ${regName}\nEmail: ${regEmail}\nCountry: ${regCountry}\nPhone: ${regPhone}\nPassword: ${regPassword}`
    );
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
                className="bg-blue-600 text-white py-2 rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Login with Google")}
                >
                  <FaGoogle className="text-red-500" /> Login with Google
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Login with Apple")}
                >
                  <FaApple className="text-gray-800" /> Login with Apple
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Login with Microsoft")}
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
                className="bg-blue-600 text-white py-2 rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition"
              >
                Register
              </button>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Register with Google")}
                >
                  <FaGoogle className="text-red-500" /> Register with Google
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Register with Apple")}
                >
                  <FaApple className="text-gray-800" /> Register with Apple
                </button>
                <button
                  type="button"
                  className={`${socialBtn} bg-white border border-blue-100 text-gray-700 hover:bg-blue-50`}
                  onClick={() => alert("Register with Microsoft")}
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

