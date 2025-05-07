"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { getUserInfo, logout } = useAuth();
  const user = getUserInfo();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [chartData, setChartData] = useState(null); // Inicializado como null

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/projects?userId=${user.user.id}&email=${user.user.email}`
        );
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    const fetchStatusSummary = async () => {
      const user = getUserInfo().user;

      const res = await fetch(
        `http://localhost:8000/tasks/status/summary?userId=${user.id}&email=${user.email}`
      );
      const data = await res.json();

      const colors = {
        Pending: "#42A5F5",
        Completed: "#66BB6A",
        Active: "#FFA726",
        Canceled: "#EF5350",
        "On Hold": "#AB47BC",
      };

      const borderColors = {
        Pending: "#1E88E5",
        Completed: "#388E3C",
        Active: "#FB8C00",
        Canceled: "#E53935",
        "On Hold": "#8E24AA",
      };

      const labels = Object.keys(data);

      const datasets = labels.map((status) => ({
        label: status,
        data: [data[status]], // uma barra por dataset
        backgroundColor: colors[status] || "#999",
        borderColor: borderColors[status] || "#666",
        borderWidth: 1,
      }));

      setChartData({
        labels: [""], // um único grupo de barras
        datasets: datasets,
      });
    };

    fetchProjects();
    fetchStatusSummary();
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
            <span
              onClick={logout}
              className="text-purple-700 font-bold cursor-pointer"
            >
              Logout 🔐
            </span>
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

          {user.user.role === "PM" && (
            <div
              onClick={handleCreateProject}
              className="bg-indigo-50 flex justify-center items-center rounded-lg h-[100px] cursor-pointer"
            >
              <div className="text-3xl text-gray-600">+</div>
            </div>
          )}
        </div>

        {/* Gráfico de status das tarefas */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Task Status Summary
          </h3>

          {/* Verificar se o chartData foi carregado */}
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Task Status Summary",
                  },
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                scales: {
                  x: {
                    stacked: false,
                  },
                  y: {
                    beginAtZero: true,
                    stacked: false,
                  },
                },
              }}
            />
          ) : (
            <div>Loading chart...</div>
          )}
        </div>
      </div>
    </div>
  );
}
