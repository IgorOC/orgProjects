import React from "react";
import { Project } from "../types";

interface ProjectListProps {
  projects: Project[];
  onSelect?: (project: Project) => void; // Ajuste: opcional
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect }) => {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id} className="bg-white shadow-md rounded p-4 mb-4">
          <h3 className="text-lg font-bold">{project.name}</h3>
          <p>{project.description || "Sem descrição"}</p>
          <p className="text-sm text-gray-500">Data: {project.date}</p>
          <p className="text-sm text-gray-500">Progresso: {project.progress}%</p>
          {project.tasks && (
            <ul>
              {project.tasks.map((task) => (
                <li key={task.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="mr-2"
                  />
                  {task.name}
                </li>
              ))}
            </ul>
          )}
          {onSelect && (
            <button
              onClick={() => onSelect(project)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Detalhes
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
