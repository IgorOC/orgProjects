import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface TasksProps {
  projectId: string;
}

export default function Tasks({ projectId }: TasksProps) {
  const [tasks, setTasks] = useState<DocumentData[]>([]);
  const [newTask, setNewTask] = useState("");

  // Buscar tarefas
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, `projects/${projectId}/tasks`));
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, [projectId]);

  // Criar uma nova tarefa
  const handleCreateTask = async () => {
    if (!newTask) return alert("A tarefa não pode estar vazia!");
    try {
      const docRef = await addDoc(collection(db, `projects/${projectId}/tasks`), {
        name: newTask,
      });
      setTasks((prev) => [...prev, { id: docRef.id, name: newTask }]);
      setNewTask(""); // Limpar o campo
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  // Excluir tarefa
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, `projects/${projectId}/tasks`, taskId));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="my-4">
      <h3 className="text-xl font-bold mb-2">Tarefas</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-grow"
          placeholder="Nome da tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Adicionar
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-2 bg-gray-200 mb-2 rounded flex justify-between items-center"
          >
            {task.name}
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
