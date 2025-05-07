"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDashboard() {
  const { getUserInfo } = useAuth();
  const user = getUserInfo();
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8000/projects/${id}`);
        const data = await res.json();
        setProject(data);
        setStatus(data.status);
      } catch (err) {
        console.error("Erro ao buscar projeto:", err);
      }
    };

    fetchProject();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await fetch(`http://localhost:8000/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          status: newStatus,
          pmId: project.pmId,
        }),
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  if (!project) return <div className="p-10">Carregando...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 font-sans">
      <div className="bg-white max-w-3xl mx-auto p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>{ `Wellcome ${user.user.name}` }</div>
          <button className="text-purple-700 font-bold hover:underline">
            Logout 🔐
          </button>
        </div>

        <h1 className="text-2xl font-bold text-purple-700 mb-4">
          {project.name}
        </h1>
        <p className="text-gray-600 mb-6">{project.description}</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Status
          </label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="text-sm text-gray-700 font-semibold mb-2">
          Tasks
        </div>

        {project.tasks.length > 0 ? (
          project.tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#eee6ff] p-5 mb-4 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 bg-purple-700 rounded-full"></div>
                <div>
                  <strong>{task.title}</strong>
                  <p className="text-xs text-gray-600">{task.status}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Due date: {new Date(task.deadline).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 mb-4">No tasks yet.</p>
        )}

        <button
          onClick={() => router.push(`/project/${id}/task/create`)}
          className="w-full mt-6 border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-xl font-semibold shadow-md flex justify-center items-center gap-2"
        >
          <span className="text-lg">＋</span> New Task
        </button>
      </div>
    </div>
  );
}
