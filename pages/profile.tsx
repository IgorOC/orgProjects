import { useState, useEffect } from "react";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUser(auth.currentUser); // Reassign user if null
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.name || user.displayName || "");
          setEmail(user.email || userData.email || "");
          setPhotoURL(userData.photoURL || user.photoURL || "");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      alert("Usuário não encontrado.");
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar nome de exibição
      if (displayName) {
        await updateProfile(user, { displayName });
        await updateDoc(doc(db, "users", user.uid), { name: displayName });
      }

      // Atualizar senha
      if (newPassword && currentPassword) {
        try {
          // Reautenticar o usuário
          const credential = EmailAuthProvider.credential(user.email!, currentPassword);
          await reauthenticateWithCredential(user, credential);

          // Atualizar a senha
          await updatePassword(user, newPassword);
          alert("Senha atualizada com sucesso!");
        } catch (error: any) {
          if (error.code === "auth/wrong-password") {
            alert("Senha atual está incorreta. Por favor, tente novamente.");
          } else if (error.code === "auth/user-not-found") {
            alert("Usuário não encontrado. Por favor, faça login novamente.");
          } else if (error.code === "auth/invalid-user-token") {
            alert("Sessão expirada. Faça login novamente.");
          } else if (error.code === "auth/network-request-failed") {
            alert("Erro de conexão. Verifique sua internet e tente novamente.");
          } else {
            console.error("Erro ao reautenticar:", error);
            alert("Erro desconhecido ao atualizar senha. Tente novamente mais tarde.");
          }
        }
      }

      alert("Perfil atualizado com sucesso!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error.message || error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const response = await axios.post("/api/upload-avatar", {
          file: reader.result,
        });

        const imageUrl = response.data.url;
        setPhotoURL(imageUrl);

        if (user) {
          await updateProfile(user, { photoURL: imageUrl });
          await updateDoc(doc(db, "users", user.uid), { photoURL: imageUrl });
        }

        alert("Foto de perfil atualizada!");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao fazer upload:", error.message);
          alert("Erro ao enviar a imagem.");
        } else {
          console.error("Erro desconhecido:", error);
          alert("Erro desconhecido ao enviar a imagem.");
        }
      }
    };

    reader.onerror = () => {
      alert("Erro ao processar o arquivo.");
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start mt-6 ml-6 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Voltar ao Dashboard
      </button>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
          {photoURL && (
            <img
              src={photoURL}
              alt="Foto de Perfil"
              className="w-16 h-16 rounded-full mb-4"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">E-mail</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Senha Atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
