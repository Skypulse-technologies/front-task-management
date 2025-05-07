"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Função para decodificar o token JWT
function decodeToken(token) {
  try {
    return jwtDecode(token); // <-- usa a lib em vez de atob
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

// Função para verificar validade do token
function isTokenValid(token) {
  const decoded = decodeToken(token);
  console.log(decoded)
  if (!decoded || !decoded.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
}

// Hook principal
export const useAuth = (redirectIfInvalid = true) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !isTokenValid(token)) {
      localStorage.removeItem("token");

      if (redirectIfInvalid) {
        router.push("/login");
      }
    }
  }, [router]);

  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return null;
    return decodeToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token")
    router.push('/login')
  }

  return { getUserInfo, logout };
};
