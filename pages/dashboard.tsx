import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

type UserProfile = {
  displayName: string;
  photoURL?: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
  date: string;
  progress: number;
  uid: string;
};

type Travel = {
  id: string;
  destination: string;
  description?: string;
  date?: string;
};

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setUserProfile({
      displayName: user.displayName || "Usuário",
      photoURL: user.photoURL || "",
      email: user.email || "",
    });
  };

  const fetchProjects = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "projects"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">),
      }));

      setProjects(projectsData);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTravels = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "travels"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const travelsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Travel, "id">),
      }));

      setTravels(travelsData);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserProfile();
      await fetchProjects();
      await fetchTravels();
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userProfile={userProfile} onLogout={handleLogout} />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
          {userProfile && (
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-600">
                Bem-vindo, {userProfile.displayName}
              </span>
              {userProfile.photoURL && (
                <img
                  src={userProfile.photoURL}
                  alt="Foto do Perfil"
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
              )}
            </div>
          )}
        </header>

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Meus Projetos</h2>
              {projects.length === 0 ? (
                <p className="text-gray-500">Nenhum projeto encontrado.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md mb-4"
                  >
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    <p className="text-gray-600">
                      {project.description || "Sem descrição"}
                    </p>
                    <p className="text-sm text-gray-500">{project.date}</p>
                    <div className="relative h-2 bg-gray-300 rounded mt-4">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-right">
                      {project.progress}% completo
                    </p>
                  </div>
                ))
              )}
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Minhas Viagens</h2>
              {travels.length === 0 ? (
                <p className="text-gray-500">Nenhuma viagem encontrada.</p>
              ) : (
                travels.map((travel) => (
                  <div
                    key={travel.id}
                    className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md mb-4"
                  >
                    <h3 className="font-bold text-gray-800">{travel.destination}</h3>
                    <p className="text-gray-600">
                      {travel.description || "Sem descrição"}
                    </p>
                    <p className="text-sm text-gray-500">{travel.date}</p>
                  </div>
                ))
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
