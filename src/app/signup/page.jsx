"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    const roleMapped = role === "cliente" ? "Client" : "User";

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: roleMapped,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
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
          <h2 className="mb-5 text-2xl font-bold">Create your account</h2>
          <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label htmlFor="name" className="text-sm mb-1 text-gray-800">
                Full name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7f56d9]"
              />
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="email" className="text-sm mb-1 text-gray-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7f56d9]"
              />
            </div>

            <div className="flex justify-between gap-4 mb-2">
              <button
                type="button"
                onClick={() => setRole("cliente")}
                className={`w-full py-2 font-semibold rounded border ${
                  role === "cliente"
                    ? "bg-[#7f00ff] text-white"
                    : "bg-white text-gray-800 border-gray-300"
                } hover:border-[#7f00ff] transition`}
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setRole("membro")}
                className={`w-full py-2 font-semibold rounded border ${
                  role === "membro"
                    ? "bg-[#7f00ff] text-white"
                    : "bg-white text-gray-800 border-gray-300"
                } hover:border-[#7f00ff] transition`}
              >
                Membro
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#7f00ff] text-white py-3 text-base font-bold rounded hover:bg-[#5a00b7] transition-colors"
            >
              Sign up
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#7f00ff] font-bold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
