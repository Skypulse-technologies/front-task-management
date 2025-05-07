"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    if (!memberEmail.trim()) return;
    setMembers([...members, { email: memberEmail }]);
    setMemberEmail("");
  };

  const handleSubmit = async () => {
    if (!name || !description) return;

    try {
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          members, // Você pode ajustar no backend para aceitar essa estrutura
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar projeto");
      }

      const data = await response.json();
      router.push(`/dashboard/project/${data.id}`);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="bg-white w-full max-w-xl p-10 rounded-lg shadow-md">
        <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
          <span>Create New Project</span>
          <span className="text-purple-700 font-bold cursor-pointer">Logout 🔐</span>
        </div>

        <h2 className="text-2xl font-bold text-purple-700">New Project</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Task Management App"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-2">Add Members</h3>
        <div className="flex gap-3 mb-4">
          <input
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Member email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleAddMember}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{member.email}</span>
              <span className="bg-gray-200 px-3 py-1 rounded-md text-xs">Member</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-purple-800 transition"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
