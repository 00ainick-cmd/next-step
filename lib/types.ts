// TypeScript types for NextStep GTD application

export interface Context {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

export interface TaskContext {
  id: string;
  taskId: string;
  contextId: string;
  context: Context;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  dueDate?: Date | string | null;
  scheduledStart?: Date | string | null;
  scheduledEnd?: Date | string | null;
  energyLevel?: string | null;
  timeNeededMinutes?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  projectId?: string | null;
  project?: Project | null;
  contexts?: TaskContext[];
}

export type TaskStatus =
  | 'inbox'
  | 'next_action'
  | 'waiting_for'
  | 'someday'
  | 'reference'
  | 'completed';

export const DEFAULT_CONTEXTS = [
  '@Home',
  '@Office',
  '@Computer',
  '@Phone',
  '@Errands',
  '@Anywhere'
] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  inbox: 'Inbox',
  next_action: 'Next Action',
  waiting_for: 'Waiting For',
  someday: 'Someday/Maybe',
  reference: 'Reference',
  completed: 'Completed'
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  inbox: 'bg-gray-100 text-gray-800',
  next_action: 'bg-green-100 text-green-800',
  waiting_for: 'bg-blue-100 text-blue-800',
  someday: 'bg-purple-100 text-purple-800',
  reference: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-emerald-100 text-emerald-800'
};
