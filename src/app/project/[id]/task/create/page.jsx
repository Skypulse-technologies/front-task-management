"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage({ projectId }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !assignedTo || !deadline) return;

    try {
      const response = await fetch("http://localhost:8000/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          assignedToId: parseInt(assignedTo),
          deadline,
          projectId: parseInt(projectId),
          status: "Pending", // default status
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar tarefa");
      }

      const data = await response.json();
      router.push(`/dashboard/project/${projectId}`);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="bg-white w-full max-w-xl p-10 rounded-lg shadow-md">
        <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
          <span>Create New Task</span>
          <span className="text-purple-700 font-bold cursor-pointer">Logout 🔐</span>
        </div>

        <h2 className="text-2xl font-bold text-purple-700">New Task</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Setup backend auth"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the task..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Assign To (User ID)</label>
            <input
              type="number"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. 3"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-purple-800 transition"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}
