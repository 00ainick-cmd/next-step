'use client';

import { Task, Project, Context, TaskStatus } from '@/types';
import { useEffect, useState } from 'react';

interface ClarifyModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, updates: {
    status?: TaskStatus;
    projectId?: string | null;
    contextIds?: string[];
    notes?: string;
  }) => Promise<void>;
}

export default function ClarifyModal({ task, isOpen, onClose, onSave }: ClarifyModalProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [projectId, setProjectId] = useState<string>(task.projectId || '');
  const [selectedContextIds, setSelectedContextIds] = useState<string[]>(
    task.contexts.map(c => c.id)
  );
  const [notes, setNotes] = useState(task.notes || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch projects and contexts
      Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/contexts').then(r => r.json())
      ]).then(([projectsData, contextsData]) => {
        setProjects(projectsData);
        setContexts(contextsData);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset form when task changes
    setStatus(task.status);
    setProjectId(task.projectId || '');
    setSelectedContextIds(task.contexts.map(c => c.id));
    setNotes(task.notes || '');
  }, [task]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(task.id, {
        status,
        projectId: projectId || null,
        contextIds: selectedContextIds,
        notes
      });
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleContext = (contextId: string) => {
    setSelectedContextIds(prev =>
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Clarify Task</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Task
              </label>
              <p className="text-lg text-slate-900">{task.title}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="inbox">Inbox</option>
                <option value="next_action">Next Action</option>
                <option value="waiting">Waiting</option>
                <option value="someday">Someday/Maybe</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project (optional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contexts */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contexts
              </label>
              <div className="flex flex-wrap gap-2">
                {contexts.map(context => (
                  <button
                    key={context.id}
                    type="button"
                    onClick={() => toggleContext(context.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedContextIds.includes(context.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    style={
                      selectedContextIds.includes(context.id) && context.color
                        ? { backgroundColor: context.color }
                        : {}
                    }
                  >
                    {context.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
