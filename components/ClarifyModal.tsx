'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectId: string | null;
  dueDate: string | null;
  energyLevel: string | null;
  timeNeededMinutes: number | null;
}

interface Project {
  id: string;
  name: string;
}

interface Context {
  id: string;
  name: string;
}

interface ClarifyModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ClarifyModal({ task, isOpen, onClose, onSave }: ClarifyModalProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    projectId: task.projectId || '',
    dueDate: task.dueDate || '',
    energyLevel: task.energyLevel || '',
    timeNeededMinutes: task.timeNeededMinutes || '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch projects and contexts
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data));

      fetch('/api/contexts')
        .then(res => res.json())
        .then(data => setContexts(data));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        projectId: formData.projectId || null,
        dueDate: formData.dueDate || null,
        energyLevel: formData.energyLevel || null,
        timeNeededMinutes: formData.timeNeededMinutes ? Number(formData.timeNeededMinutes) : null,
        contextIds: selectedContexts,
      };

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleContext = (contextId: string) => {
    setSelectedContexts(prev =>
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Clarify Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="inbox">Inbox</option>
                <option value="next_action">Next Action</option>
                <option value="waiting_for">Waiting For</option>
                <option value="someday">Someday/Maybe</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Level
              </label>
              <select
                value={formData.energyLevel}
                onChange={e => setFormData({ ...formData, energyLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Not specified</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Time Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Needed (minutes)
              </label>
              <input
                type="number"
                value={formData.timeNeededMinutes}
                onChange={e => setFormData({ ...formData, timeNeededMinutes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            {/* Contexts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexts
              </label>
              <div className="flex flex-wrap gap-2">
                {contexts.map(context => (
                  <button
                    key={context.id}
                    type="button"
                    onClick={() => toggleContext(context.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedContexts.includes(context.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {context.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
