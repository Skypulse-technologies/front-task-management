"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/app/components/BackButton";

export default function TaskOverviewPage() {
  const { getUserInfo, logout } = useAuth();
  const user = getUserInfo().user;
  const { taskId, id } = useParams();

  const [status, setStatus] = useState("Pending");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`);
      const data = await res.json();

      setTask({
        title: data.title,
        description: data.description,
        deadline: new Date(data.deadline).toLocaleDateString(),
      });
      setStatus(data.status);
      setMembers(
        data.assignees.map((user) => ({
          name: user.name,
          email: user.email,
          role: "Member",
        }))
      );
    };

    const fetchComments = async () => {
      const res = await fetch("http://localhost:8000/comments");
      const data = await res.json();
      const taskComments = data.filter((c) => c.taskId === parseInt(taskId));
      console.log(taskComments)
      setComments(taskComments);
    };

    if (taskId) {
      fetchTask();
      fetchComments();
    }
  }, [taskId]);

  const handleToggleStatus = async () => {
    const nextStatus =
      status === "Pending"
        ? "In Progress"
        : status === "In Progress"
        ? "Completed"
        : "Pending";

    const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, assignedEmails: members.map(m => m.email) }),
    });

    if (res.ok) setStatus(nextStatus);
  };

  const handleAddMember = async () => {
    if (!email.trim()) return;

    const updatedEmails = [...members.map((m) => m.email), email];

    const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        assignedEmails: updatedEmails,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMembers(
        data.assignees.map((user) => ({
          name: user.name,
          email: user.email,
          role: "Member",
        }))
      );
      setEmail("");
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;

    const res = await fetch("http://localhost:8000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentContent,
        taskId: parseInt(taskId),
        projectId: parseInt(id),
        authorId: parseInt(user.id),
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      newComment.author = {...user}

      console.log(newComment)
      setComments((prev) => [newComment, ...prev]);
      setCommentContent("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <BackButton />
      <div className="bg-white w-full max-w-xl p-10 rounded-lg shadow-md">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>Welcome {user.name}</span>
          <span onClick={logout} className="text-purple-700 font-bold cursor-pointer">
            Logout 🔐
          </span>
        </div>

        <h2 className="text-2xl font-bold text-purple-700 mt-6">{task.title}</h2>
        <p className="text-gray-600 mt-2">{task.description}</p>
        <p className="text-sm text-gray-500 mt-1">Deadline: {task.deadline}</p>

        <button
          onClick={handleToggleStatus}
          className={`mt-4 px-4 py-2 rounded-full text-white font-semibold ${
            status === "Pending"
              ? "bg-yellow-500"
              : status === "In Progress"
              ? "bg-blue-500"
              : "bg-green-600"
          }`}
        >
          {status}
        </button>

        {(user.role === "PM" || user.role === "User") && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mt-10 mb-2">Add Members</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          </>
        )}

        <div className="mt-6 space-y-4">
          {members.map((member, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>
              </div>
              <span className="border border-black px-3 py-1 rounded text-sm font-bold">
                {member.role}
              </span>
            </div>
          ))}
        </div>

        {/* Comments Section */}
        <h3 className="text-lg font-semibold text-gray-800 mt-10 mb-2">Comments</h3>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleAddComment}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
          >
            Post
          </button>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm font-semibold">{comment.author?.name || "Anonymous"}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
