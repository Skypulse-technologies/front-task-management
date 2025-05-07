// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const goToSignUp = () => { 
    router.push('/signup')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please insert all information");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          localStorage.setItem("token", data.token); // <--- salva o token
          router.push("/dashboard");
        } else {
          // Lidar com erro
        }
      } else {
        const error = await response.json();
        alert(error.message || "Error creating user");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error");
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-[#e7e0fb] p-12 rounded-lg flex justify-center items-center">
        <div className="bg-white p-10 rounded-md shadow-lg w-full max-w-sm text-center">
          <h2 className="mb-5 text-2xl font-bold">Sign in to your account</h2>
          <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label htmlFor="email" className="text-sm mb-1 text-gray-800">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7f56d9]"
              />
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="password" className="text-sm mb-1 text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7f56d9]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#7f00ff] text-white py-3 text-base font-bold rounded hover:bg-[#5a00b7] transition-colors"
            >
              Continue
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a onClick={() => goToSignUp()} className="text-[#7f00ff] font-bold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
