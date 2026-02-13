"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    const form = e.target;
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("✅ Login uğurla tamamlandı!");
      setTimeout(() => {
        location.href = "/admin/dashboard";
      }, 800); // kiçik delay animation üçün
    } else {
      toast.error(data.error || "❌ Login uğursuz oldu!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500">
      <Toaster position="top-left" reverseOrder={false} />

      <form
        onSubmit={login}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm transform transition duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Panel
        </h2>

        {/* Username */}
        <div className="relative  mb-4">
          <input
            name="username"
            placeholder="Username"
            className="input w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:scale-105 transition transform flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
