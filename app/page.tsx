'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import ClarifyModal from '@/components/ClarifyModal';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          status: 'inbox',
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClarifyTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const inboxTasks = tasks.filter(t => t.status === 'inbox');
  const nextActionTasks = tasks.filter(t => t.status === 'next_action');
  const referenceTasks = tasks.filter(t => t.status === 'reference');
  const somedayTasks = tasks.filter(t => t.status === 'someday');

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NextStep</h1>
          <p className="text-gray-600">
            GTD-based task management - Capture, Clarify, Organize
          </p>
        </div>

        {/* Quick Capture */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Capture
          </h2>
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What's on your mind? (press Enter to capture)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newTaskTitle.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Adding...' : 'Capture'}
            </button>
          </form>
          <p className="mt-2 text-sm text-gray-500">
            Capture anything that has your attention. You'll clarify it later.
          </p>
        </div>

        {/* Task Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inbox */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Inbox
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({inboxTasks.length})
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {inboxTasks.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Your inbox is clear! Nice work.
                </p>
              ) : (
                inboxTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Added {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleClarifyTask(task)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Clarify
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Next Actions
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({nextActionTasks.length})
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {nextActionTasks.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No next actions yet. Clarify your inbox items!
                </p>
              ) : (
                nextActionTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-orange-600 mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {task.scheduledStart && (
                          <p className="text-xs text-blue-600 mt-1">
                            Scheduled:{' '}
                            {new Date(task.scheduledStart).toLocaleString()}
                          </p>
                        )}
                        {task.contextIds && task.contextIds.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {task.contextIds.map((ctxId) => (
                              <span
                                key={ctxId}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {ctxId}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reference */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Reference
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({referenceTasks.length})
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {referenceTasks.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No reference items.
                </p>
              ) : (
                referenceTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-gray-700">{task.title}</p>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Someday/Maybe */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Someday/Maybe
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({somedayTasks.length})
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {somedayTasks.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No someday/maybe items.
                </p>
              ) : (
                somedayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-gray-700">{task.title}</p>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clarify Modal */}
      <ClarifyModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdated={handleTaskUpdated}
      />
    </main>
  );
}
