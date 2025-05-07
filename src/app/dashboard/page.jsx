"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { getUserInfo, logout } = useAuth();
  const user = getUserInfo();
  const router = useRouter();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:8000/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    router.push("/project/create");
  };

  const handleGoToProject = (id) => {
    router.push(`/project/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-700">Welcome {user.user.name}</div>
          <div className="flex items-center">
          <span onClick={logout} className="text-purple-700 font-bold cursor-pointer">Logout 🔐</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-2xl font-bold text-purple-700 mb-6">PROJECTS</div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleGoToProject(project.id)}
              className="bg-purple-700 text-white p-4 rounded-lg cursor-pointer flex flex-col justify-between h-[100px]"
            >
              <div className="font-bold mb-2">{project.name}</div>
              <div className="text-xs flex items-center">
                click here <span className="ml-1">→</span>
              </div>
            </div>
          ))}

          <div
            onClick={handleCreateProject}
            className="bg-indigo-50 flex justify-center items-center rounded-lg h-[100px] cursor-pointer"
          >
            <div className="text-3xl text-gray-600">+</div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-indigo-50 h-[280px] rounded-lg"></div>
      </div>
    </div>
  );
}
