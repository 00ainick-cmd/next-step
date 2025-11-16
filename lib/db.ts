// Simple in-memory database for demonstration
// In production, replace with actual database (Prisma, MongoDB, etc.)

import { Task, Project, Context } from '@/types';

// In-memory storage
let tasks: Task[] = [];
let projects: Project[] = [];
let contexts: Context[] = [
  {
    id: 'ctx-1',
    name: '@Home',
    icon: '🏠',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ctx-2',
    name: '@Office',
    icon: '🏢',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ctx-3',
    name: '@Computer',
    icon: '💻',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ctx-4',
    name: '@Phone',
    icon: '📱',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ctx-5',
    name: '@Errands',
    icon: '🚗',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ctx-6',
    name: '@Anywhere',
    icon: '🌍',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to generate IDs
let taskIdCounter = 1;
let projectIdCounter = 1;
let contextIdCounter = 7;

export const db = {
  tasks: {
    findAll: () => tasks,
    findById: (id: string) => tasks.find(t => t.id === id),
    create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const task: Task = {
        ...data,
        id: `task-${taskIdCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(task);
      return task;
    },
    update: (id: string, data: Partial<Task>) => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) return null;
      tasks[index] = {
        ...tasks[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return tasks[index];
    },
    delete: (id: string) => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    },
  },
  projects: {
    findAll: () => projects,
    findById: (id: string) => projects.find(p => p.id === id),
    create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      const project: Project = {
        ...data,
        id: `project-${projectIdCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects.push(project);
      return project;
    },
    update: (id: string, data: Partial<Project>) => {
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) return null;
      projects[index] = {
        ...projects[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return projects[index];
    },
    delete: (id: string) => {
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) return false;
      projects.splice(index, 1);
      return true;
    },
  },
  contexts: {
    findAll: () => contexts,
    findById: (id: string) => contexts.find(c => c.id === id),
    create: (data: Omit<Context, 'id' | 'createdAt' | 'updatedAt'>) => {
      const context: Context = {
        ...data,
        id: `ctx-${contextIdCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      contexts.push(context);
      return context;
    },
    update: (id: string, data: Partial<Context>) => {
      const index = contexts.findIndex(c => c.id === id);
      if (index === -1) return null;
      contexts[index] = {
        ...contexts[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return contexts[index];
    },
    delete: (id: string) => {
      const index = contexts.findIndex(c => c.id === id);
      if (index === -1) return false;
      contexts.splice(index, 1);
      return true;
    },
  },
};
