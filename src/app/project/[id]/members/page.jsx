"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function AddMemberPage() {
  const { getUserInfo, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([
    { name: "James Coope", email: "example@email.com", role: "Owner" },
    { name: "James Coope", email: "example@email.com", role: "Member" },
    { name: "James Coope", email: "example@email.com", role: "Member" },
  ]);

  const handleAdd = () => {
    if (email.trim() === "") return;
    setMembers([...members, { name: "New Member", email, role: "Member" }]);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="bg-white w-full max-w-xl p-10 rounded-lg shadow-md">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>Welcome User Email</span>
          <span onClick={logout} className="text-purple-700 font-bold cursor-pointer">Logout 🔐</span>
        </div>

        <h2 className="text-2xl font-bold text-purple-700 mt-6">Add New Member</h2>

        <div className="flex mt-6 gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleAdd}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
          >
            Add Member
          </button>
        </div>

        <div className="mt-10 space-y-5">
          {members.map((member, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>
              </div>
              <button className="border border-black rounded px-3 py-1 text-sm font-bold">
                {member.role}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
