import { Task, Project, Context } from '@/types';

// In-memory database for demo purposes
// In production, replace with actual database

let tasks: Task[] = [];
let projects: Project[] = [
  {
    id: '1',
    name: 'Sample Project',
    description: 'A sample project to get started'
  }
];
let contexts: Context[] = [
  { id: '1', name: 'Home', color: '#3b82f6' },
  { id: '2', name: 'Work', color: '#10b981' },
  { id: '3', name: 'Computer', color: '#f59e0b' },
  { id: '4', name: 'Phone', color: '#ec4899' }
];

let taskIdCounter = 1;
let projectIdCounter = 2;
let contextIdCounter = 5;

export const db = {
  tasks: {
    getAll: (status?: string) => {
      if (status) {
        return tasks.filter(t => t.status === status);
      }
      return tasks;
    },
    getById: (id: string) => {
      return tasks.find(t => t.id === id);
    },
    create: (data: { title: string }) => {
      const newTask: Task = {
        id: String(taskIdCounter++),
        title: data.title,
        status: 'inbox',
        contexts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      tasks.push(newTask);
      return newTask;
    },
    update: (id: string, data: Partial<Task>) => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) return null;

      const updatedTask = {
        ...tasks[index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      // If projectId is provided, fetch project name
      if (data.projectId) {
        const project = projects.find(p => p.id === data.projectId);
        if (project) {
          updatedTask.projectName = project.name;
        }
      } else if (data.projectId === null) {
        updatedTask.projectId = undefined;
        updatedTask.projectName = undefined;
      }

      tasks[index] = updatedTask;
      return updatedTask;
    },
    delete: (id: string) => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    }
  },
  projects: {
    getAll: () => {
      return projects.map(p => ({
        ...p,
        nextActionCount: tasks.filter(t => t.projectId === p.id && t.status === 'next_action').length
      }));
    },
    getById: (id: string) => {
      return projects.find(p => p.id === id);
    },
    create: (data: { name: string; description?: string }) => {
      const newProject: Project = {
        id: String(projectIdCounter++),
        name: data.name,
        description: data.description
      };
      projects.push(newProject);
      return newProject;
    }
  },
  contexts: {
    getAll: () => contexts,
    getById: (id: string) => contexts.find(c => c.id === id),
    getByIds: (ids: string[]) => contexts.filter(c => ids.includes(c.id))
  }
};
