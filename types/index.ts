export type TaskStatus =
  | 'inbox'
  | 'next_action'
  | 'waiting'
  | 'someday'
  | 'reference'
  | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  projectId?: string;
  contextIds?: string[];
  dueDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Context {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  status?: TaskStatus;
  projectId?: string;
  contextIds?: string[];
  dueDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  status?: TaskStatus;
  projectId?: string;
  contextIds?: string[];
  dueDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface CreateContextDTO {
  name: string;
  icon?: string;
}
