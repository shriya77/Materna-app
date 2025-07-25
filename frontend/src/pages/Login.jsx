import React from "react";
import { Link } from "react-router-dom";
import base from "../assets/base.svg"

export default function Login() {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#e3ebf4] font-sans">
      {/* Left: Login Form */}
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-3xl p-8 m-6 flex flex-col justify-center">
        <Link
          to="/"
          className="absolute top-4 left-4 text-sm text-[#a48bc3] font-semibold hover:text-[#9771bc]"
        >
          ← Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-[#234451]">Welcome back!</h2>
        <p className="text-sm text-[#234451] mt-2">Log in to continue your journey.</p>

        <button className="mt-6 border border-gray-300 rounded-lg py-2 flex items-center justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-sm">Log in with Google</span>
        </button>

        <div className="text-xs text-center text-gray-500 mt-4">or log in with your email</div>

        <input
          className="mt-4 px-4 py-3 w-full border border-gray-200 rounded-xl placeholder-gray-400"
          placeholder="Email"
        />
        <input
          type="password"
          className="mt-3 px-4 py-3 w-full border border-gray-200 rounded-xl placeholder-gray-400"
          placeholder="Password"
        />

        <button className="mt-6 bg-[#a48bc3] text-white py-3 rounded-xl font-semibold hover:bg-[#9771bc]">
          Log in
        </button>

        <p className="mt-4 text-sm text-center text-[#234451]">
          Don’t have an account? <a href="/signup" className="text-[#a48bc3] font-semibold">Sign up</a>
        </p>
      </div>

      {/* Right: Static Welcome Section */}
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat px-10 py-8 hidden md:flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: base,
        }}
      >
        <div className="bg-white/70 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#234451]">Welcome back, mama!</h2>
          <p className="text-sm text-[#234451] mt-2 max-w-md">
            We’ve missed you. Pick up where you left off.
          </p>
        </div>
      </div>
    </div>
  );
}
