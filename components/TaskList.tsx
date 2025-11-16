'use client';

import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export default function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [showActionsForTask, setShowActionsForTask] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await onTaskUpdate(taskId, { status: newStatus });
    } finally {
      setUpdatingTaskId(null);
      setShowActionsForTask(null);
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks found</p>
        <p className="text-sm mt-2">Tasks matching your current filters will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div
          key={task.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[task.status as TaskStatus]}`}>
                  {STATUS_LABELS[task.status as TaskStatus]}
                </span>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {task.project && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {task.project.name}
                  </span>
                )}

                {task.contexts && task.contexts.length > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {task.contexts.map(tc => tc.context.name).join(', ')}
                  </span>
                )}

                {task.dueDate && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due {formatDate(task.dueDate)}
                  </span>
                )}

                {task.energyLevel && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {task.energyLevel}
                  </span>
                )}

                {task.timeNeededMinutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {task.timeNeededMinutes} min
                  </span>
                )}
              </div>
            </div>

            <div className="relative ml-4">
              <button
                onClick={() => setShowActionsForTask(showActionsForTask === task.id ? null : task.id)}
                disabled={updatingTaskId === task.id}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Change status"
              >
                {updatingTaskId === task.id ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                )}
              </button>

              {showActionsForTask === task.id && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Change Status
                    </div>

                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Mark as Done
                      </button>
                    )}

                    {task.status !== 'next_action' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'next_action')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Move to Next Actions
                      </button>
                    )}

                    {task.status !== 'waiting_for' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'waiting_for')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Move to Waiting For
                      </button>
                    )}

                    {task.status !== 'someday' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'someday')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Move to Someday/Maybe
                      </button>
                    )}

                    {task.status !== 'reference' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'reference')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Move to Reference
                      </button>
                    )}

                    {task.status !== 'inbox' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'inbox')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        Move to Inbox
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
