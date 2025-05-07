"use client";

import { useParams } from "next/navigation";

export default function ProjectDashboard() {
  const { id } = useParams();

  const stages = [
    { name: "First stage Name", dueDate: "01/01/2025" },
    { name: "Second stage Name", dueDate: "01/01/2025" },
    { name: "Third stage Name", dueDate: "01/01/2025" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 font-sans">
      <div className="bg-white max-w-3xl mx-auto p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>Welcome User Email</div>
          <button className="text-purple-700 font-bold hover:underline">
            Logout ⬜
          </button>
        </div>

        <h1 className="text-2xl font-bold text-purple-700 mb-8">
          Project ID: {id}
        </h1>

        {stages.map((stage, index) => (
          <div
            key={index}
            className="bg-[#eee6ff] p-5 mb-4 rounded-xl flex justify-between items-center"
          >
            <div className="flex items-center gap-5">
              <div className="w-7 h-7 bg-purple-700 rounded-full"></div>
              <div>
                <strong>{stage.name}</strong>
                <br />
                <select className="mt-1 px-2 py-1 rounded border border-gray-300">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              Due date: {stage.dueDate} 📅
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
