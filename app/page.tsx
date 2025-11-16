'use client';

import { useState, useEffect } from 'react';
import { Task, Context, TaskStatus } from '@/lib/types';
import TaskList from '@/components/TaskList';
import ContextFilterBar from '@/components/ContextFilterBar';

type ViewType = 'inbox' | 'next_actions' | 'waiting_for' | 'someday' | 'reference';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('next_actions');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map view types to task statuses
  const viewToStatus: Record<ViewType, TaskStatus> = {
    inbox: 'inbox',
    next_actions: 'next_action',
    waiting_for: 'waiting_for',
    someday: 'someday',
    reference: 'reference'
  };

  // Fetch contexts on mount
  useEffect(() => {
    fetchContexts();
  }, []);

  // Fetch tasks when view or context filter changes
  useEffect(() => {
    fetchTasks();
  }, [activeView, selectedContextId]);

  const fetchContexts = async () => {
    try {
      const response = await fetch('/api/contexts');
      if (!response.ok) throw new Error('Failed to fetch contexts');
      const data = await response.json();
      setContexts(data);
    } catch (err) {
      console.error('Error fetching contexts:', err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const status = viewToStatus[activeView];
      const params = new URLSearchParams({ status });

      if (selectedContextId) {
        params.append('contextId', selectedContextId);
      }

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Refresh tasks after update
      await fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const viewTabs: { id: ViewType; label: string; icon: string }[] = [
    { id: 'inbox', label: 'Inbox', icon: '📥' },
    { id: 'next_actions', label: 'Next Actions', icon: '⚡' },
    { id: 'waiting_for', label: 'Waiting For', icon: '⏳' },
    { id: 'someday', label: 'Someday/Maybe', icon: '💭' },
    { id: 'reference', label: 'Reference', icon: '📚' }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">NextStep GTD</h1>
          <p className="mt-2 text-sm text-gray-600">
            Getting Things Done - Organize, prioritize, and execute
          </p>
        </div>
      </header>

      {/* View Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {viewTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id);
                  setSelectedContextId(null); // Reset context filter when switching views
                }}
                className={`
                  px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                  ${activeView === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Context Filter - Only show for Next Actions view */}
        {activeView === 'next_actions' && (
          <ContextFilterBar
            contexts={contexts}
            selectedContextId={selectedContextId}
            onSelectContext={setSelectedContextId}
          />
        )}

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {viewTabs.find(t => t.id === activeView)?.label}
            </h2>
            <div className="text-sm text-gray-500">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">Error: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Active Contexts</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{contexts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Current View</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">
              {selectedContextId ? 'Filtered' : 'All Tasks'}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {selectedContextId
                ? contexts.find(c => c.id === selectedContextId)?.name || 'Unknown'
                : 'No Filter'}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
