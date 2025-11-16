export type TaskStatus = 'inbox' | 'next_action' | 'waiting' | 'someday' | 'done';

export interface Context {
  id: string;
  name: string;
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  nextActionCount?: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  projectId?: string;
  projectName?: string;
  contexts: Context[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  status?: TaskStatus;
  projectId?: string | null;
  contextIds?: string[];
  notes?: string;
}
