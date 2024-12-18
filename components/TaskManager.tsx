import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Task } from "../types";

type TaskManagerProps = {
  projectId: string;
};

const TaskManager: React.FC<TaskManagerProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, `projects/${projectId}/tasks`);
        const querySnapshot = await getDocs(tasksRef);

        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Define o `id` explicitamente
          ...(doc.data() as Omit<Task, "id">),
        }));

        setTasks(tasksData);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!newTaskName) return;

    try {
      const taskRef = collection(db, `projects/${projectId}/tasks`);
      const newTask: Omit<Task, "id"> = {
        name: newTaskName,
        completed: false,
      };

      const docRef = await addDoc(taskRef, newTask);
      setTasks((prev) => [
        ...prev,
        { id: docRef.id, ...newTask }, // Adiciona o `id` do documento criado
      ]);

      setNewTaskName("");
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, `projects/${projectId}/tasks`, taskId);
      await deleteDoc(taskRef);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Gerenciar Tarefas</h3>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Nova tarefa"
          className="border p-2 rounded flex-1"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          Adicionar
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center mb-2 border-b pb-2"
          >
            <span>{task.name}</span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500 text-sm"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
