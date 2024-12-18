import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { Project, Task } from "../types";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";

export default function ManageProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    null
  );

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "projects"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">),
      }));

      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  const handleSaveProject = async (
    projectData: Omit<Project, "id" | "uid">,
    projectId?: string
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (projectId) {
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, { ...projectData, uid: user.uid });
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { id: projectId, ...projectData, uid: user.uid }
              : project
          )
        );
        alert("Projeto atualizado com sucesso!");
      } else {
        const docRef = await addDoc(collection(db, "projects"), {
          ...projectData,
          uid: user.uid,
        });
        setProjects((prev) => [
          ...prev,
          { id: docRef.id, ...projectData, uid: user.uid },
        ]);
        alert("Projeto criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      alert("Projeto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
    }
  };

  const handleTaskAdd = () => {
    setEditingProject((prev) => ({
      ...prev,
      tasks: [...(prev?.tasks || []), { id: Date.now().toString(), name: "", completed: false }],
    }));
  };

  const handleTaskUpdate = (taskId: string, updatedName: string) => {
    setEditingProject((prev) => ({
      ...prev,
      tasks: prev?.tasks?.map((task) =>
        task.id === taskId ? { ...task, name: updatedName } : task
      ),
    }));
  };

  const handleTaskDelete = (taskId: string) => {
    setEditingProject((prev) => ({
      ...prev,
      tasks: prev?.tasks?.filter((task) => task.id !== taskId),
    }));
  };

  const handleTaskToggle = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
            ...project,
            tasks: project.tasks?.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          }
          : project
      )
    );
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleBackToDashboard}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 absolute top-4 right-4"
        >
        Voltar para o Dashboard
      </button>

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Projetos</h1>
        </header>

          {/* Formulário de Edição ou Criação */}
          <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingProject ? "Editar Projeto" : "Novo Projeto"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingProject) {
                  handleSaveProject(
                    {
                      name: editingProject.name || "",
                      description: editingProject.description || "",
                      date: editingProject.date || "",
                      progress: editingProject.progress || 0,
                      tasks: editingProject.tasks || [],
                    },
                    editingProject.id
                  );
                  setEditingProject(null);
                }
              }}
            >
              <div className="mb-4">
                <label className="block font-bold mb-2">Nome</label>
                <input
                  type="text"
                  value={editingProject?.name || ""}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Descrição</label>
                <textarea
                  value={editingProject?.description || ""}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Data</label>
                <input
                  type="date"
                  value={editingProject?.date || ""}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Progresso</label>
                <input
                  type="number"
                  value={editingProject?.progress || 0}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      progress: Number(e.target.value),
                    }))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Tarefas</label>
                {editingProject?.tasks?.map((task) => (
                  <div key={task.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleTaskUpdate(task.id, e.target.value)}
                      className="flex-1 border p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleTaskDelete(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleTaskAdd}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  Adicionar Tarefa
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingProject ? "Atualizar" : "Salvar"}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
          {/* Lista de Projetos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {project.description || "Sem descrição"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Data: {project.date || "Sem data"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Progresso: {project.progress}%
                </p>
                <div className="relative w-full h-2 bg-gray-200 rounded mb-4">
                  <div
                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold">Tarefas:</h4>
                  {project.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(project.id, task.id)}
                        className="cursor-pointer"
                      />
                      <span
                        className={`${task.completed ? "line-through text-gray-500" : ""
                          }`}
                      >
                        {task.name}
                      </span>
                    </div>
                  ))}
                  {!project.tasks?.length && (
                    <p className="text-sm text-gray-500">Nenhuma tarefa.</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
