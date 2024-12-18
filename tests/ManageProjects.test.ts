import { describe, it, expect } from "@jest/globals";

function addTask(tasks: any[], newTask: any): any[] {
  return [...tasks, newTask];
}

function updateTask(tasks: any[], taskId: string, updatedName: string) {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, name: updatedName } : task
  );
}

describe("Função addTask", () => {
  it("deve adicionar uma nova tarefa à lista", () => {
    const tasks = [{ id: "1", name: "Tarefa 1" }];
    const newTask = { id: "2", name: "Tarefa 2" };

    const result = addTask(tasks, newTask);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(newTask);
  });

  it("deve lidar com lista vazia", () => {
    const tasks: any[] = [];
    const newTask = { id: "1", name: "Nova Tarefa" };

    const result = addTask(tasks, newTask);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Nova Tarefa");
  });
});

describe("Função updateTask", () => {
  it("deve atualizar o nome da tarefa", () => {
    const tasks = [{ id: "1", name: "Tarefa 1" }];
    const updatedTasks = updateTask(tasks, "1", "Tarefa Atualizada");

    expect(updatedTasks[0].name).toBe("Tarefa Atualizada");
  });

  it("não deve alterar nenhuma tarefa se o ID não existir", () => {
    const tasks = [{ id: "1", name: "Tarefa 1" }];
    const updatedTasks = updateTask(tasks, "2", "Tarefa Inexistente");

    expect(updatedTasks).toEqual(tasks);
  });

  it("deve lidar com lista vazia", () => {
    const tasks: any[] = [];
    const updatedTasks = updateTask(tasks, "1", "Nova Tarefa");

    expect(updatedTasks).toHaveLength(0);
  });
});
