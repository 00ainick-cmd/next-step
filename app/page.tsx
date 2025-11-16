'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import TaskList from '@/components/TaskList';
import ClarifyModal from '@/components/ClarifyModal';
import { Task, Project } from '@/types';

type ViewType = 'inbox' | 'next_actions' | 'projects';

export default function Home() {
  const [captureInput, setCaptureInput] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('inbox');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data when view changes
  useEffect(() => {
    fetchData();
  }, [activeView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeView === 'projects') {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } else {
        const status = activeView === 'inbox' ? 'inbox' : 'next_action';
        const response = await fetch(`/api/tasks?status=${status}`);
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (!captureInput.trim()) return;

    try {
      // Create the task
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: captureInput.trim() })
      });

      if (response.ok) {
        const newTask = await response.json();
        setCaptureInput('');

        // Open clarify modal for the new task
        setSelectedTask(newTask);
        setIsModalOpen(true);

        // Refresh tasks if on inbox view
        if (activeView === 'inbox') {
          fetchData();
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCapture();
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (
    taskId: string,
    updates: {
      status?: string;
      projectId?: string | null;
      contextIds?: string[];
      notes?: string;
    }
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Refresh the current view
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">NextStep</h1>
          <p className="text-slate-600">GTD-style Next Actions by context</p>
        </div>

        {/* Capture Input */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <input
              type="text"
              value={captureInput}
              onChange={(e) => setCaptureInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Capture anything on your mind…"
              className="w-full text-lg px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-sm text-slate-500 mt-2">Press Enter to capture</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveView('inbox')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeView === 'inbox'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inbox
            </button>
            <button
              onClick={() => setActiveView('next_actions')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeView === 'next_actions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next Actions
            </button>
            <button
              onClick={() => setActiveView('projects')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeView === 'projects'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* Context Filter (placeholder for Next Actions view) */}
        {activeView === 'next_actions' && (
          <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-600">
              <span className="font-medium">Context Filter:</span> Coming soon...
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-500"></div>
              <p className="mt-4 text-slate-600">Loading...</p>
            </div>
          ) : activeView === 'projects' ? (
            // Projects View
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No projects yet</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {project.nextActionCount || 0} next{' '}
                        {project.nextActionCount === 1 ? 'action' : 'actions'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Tasks View (Inbox or Next Actions)
            <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
          )}
        </div>
      </div>

      {/* Clarify Modal */}
      {selectedTask && (
        <ClarifyModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </main>
  );
}
