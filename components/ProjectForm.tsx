import { useState } from "react";
import { Project } from "../types";
import { auth } from "../lib/firebase";

type Props = {
  onSave: (projectData: Omit<Project, "id">, projectId?: string) => Promise<void>;
  initialData?: Partial<Project>;
  onCancel: () => void;
};

export default function ProjectForm({
  onSave,
  initialData = {},
  onCancel,
}: Props) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [date, setDate] = useState(initialData.date || "");
  const [progress, setProgress] = useState(initialData.progress || 0);

  const handleSubmit = async () => {
    if (!name || !date) {
      alert("Nome e data do projeto são obrigatórios!");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    const uid = currentUser.uid; // Obtenha o UID do usuário autenticado

    await onSave({
      name,
      description,
      date,
      progress,
      uid, // Inclua o UID do usuário
      tasks: [], // Inicialize como um array vazio ou outro valor necessário
    });

    // Limpe os campos após salvar
    setName("");
    setDescription("");
    setDate("");
    setProgress(0);
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">Novo Projeto</h2>
      <input
        type="text"
        placeholder="Nome do Projeto"
        className="border p-2 rounded w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        className="border p-2 rounded w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 rounded w-full mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Progresso (%)"
        className="border p-2 rounded w-full mb-2"
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
