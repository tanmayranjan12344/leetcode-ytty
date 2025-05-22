import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white bg-opacity-90 shadow-md border-b border-blue-100 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <img
          src="/syntaxbuddy.png"
          alt="Syntax Buddy Logo"
          width={36}
          height={36}
          className="rounded-lg border border-blue-100"
        />
        <span className="text-xl font-bold text-blue-700 tracking-tight">Syntax Buddy</span>
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <Link href="/" className="text-blue-700 font-semibold hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-blue-700 font-semibold hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-blue-700 font-semibold hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            href="/login?tab=register"
            className="px-4 py-2 bg-white text-blue-700 border border-blue-600 rounded-full font-bold shadow hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}