import React, { useState } from "react";
import { useRouter } from "next/router";
import { UserProfile } from "../types";
import { FaUser, FaProjectDiagram, FaPlane, FaCogs, FaSignOutAlt, FaBars, FaSearch } from "react-icons/fa";

interface SidebarProps {
  userProfile?: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userProfile, onLogout }) => {
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    alert(`Buscando por: ${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <aside
      className={`bg-blue-600 text-white p-4 flex flex-col justify-between h-screen transition-width duration-300 ${
        isMinimized ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section - Profile and Navigation */}
      <div>
        {/* Toggle Minimize/Expand Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="flex items-center justify-center mb-4 text-xl hover:text-blue-300"
        >
          <FaBars />
        </button>

        {!isMinimized && (
          <div className="flex flex-col items-center mb-8">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Foto de Perfil"
                className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
            )}
            <span className="text-lg font-bold">{userProfile?.displayName || "Usuário"}</span>
            <button
              onClick={() => router.push("/profile")}
              className="text-blue-300 hover:text-white mt-2"
            >
              Editar Perfil
            </button>
          </div>
        )}

        <nav className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 w-full text-left hover:bg-blue-500 p-2 rounded"
          >
            <FaUser />
            {!isMinimized && "Dashboard"}
          </button>
          <button
            onClick={() => router.push("/manage-projects")}
            className="flex items-center gap-2 w-full text-left hover:bg-blue-500 p-2 rounded"
          >
            <FaProjectDiagram />
            {!isMinimized && "Projetos"}
          </button>
          <button
            onClick={() => router.push("/manage-travels")}
            className="flex items-center gap-2 w-full text-left hover:bg-blue-500 p-2 rounded"
          >
            <FaPlane />
            {!isMinimized && "Viagens"}
          </button>
        </nav>
      </div>

      {/* Bottom Section - Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 w-full text-left hover:bg-red-700 bg-red-600 p-2 rounded"
      >
        <FaSignOutAlt />
        {!isMinimized && "Logout"}
      </button>
    </aside>
  );
};

export default Sidebar;
