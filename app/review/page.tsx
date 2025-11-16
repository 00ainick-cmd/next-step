'use client';

import { useState, useEffect } from 'react';
import ClarifyModal from '@/components/ClarifyModal';

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
  description: string | null;
  status: string;
  tasks: Task[];
}

export default function WeeklyReviewPage() {
  const [inboxTasks, setInboxTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [waitingTasks, setWaitingTasks] = useState<Task[]>([]);
  const [somedayTasks, setSomedayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Checklist state
  const [checklist, setChecklist] = useState({
    emptyInbox: false,
    reviewProjects: false,
    scanWaiting: false,
    glanceSomeday: false,
  });

  // Modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch inbox tasks
      const inboxRes = await fetch('/api/tasks?status=inbox');
      const inbox = await inboxRes.json();
      setInboxTasks(inbox);

      // Fetch all projects with their tasks
      const projectsRes = await fetch('/api/projects');
      const allProjects = await projectsRes.json();
      setProjects(allProjects.filter((p: Project) => p.status === 'active'));

      // Fetch waiting tasks
      const waitingRes = await fetch('/api/tasks?status=waiting_for');
      const waiting = await waitingRes.json();
      setWaitingTasks(waiting);

      // Fetch someday tasks
      const somedayRes = await fetch('/api/tasks?status=someday');
      const someday = await somedayRes.json();
      setSomedayTasks(someday);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalSave = () => {
    loadData(); // Reload all data after saving
  };

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Weekly Review</h1>

      {/* Checklist Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Review Checklist</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.emptyInbox}
              onChange={() => toggleChecklistItem('emptyInbox')}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-lg ${checklist.emptyInbox ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              Empty Inbox
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.reviewProjects}
              onChange={() => toggleChecklistItem('reviewProjects')}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-lg ${checklist.reviewProjects ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              Review all projects
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.scanWaiting}
              onChange={() => toggleChecklistItem('scanWaiting')}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-lg ${checklist.scanWaiting ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              Scan Waiting For
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.glanceSomeday}
              onChange={() => toggleChecklistItem('glanceSomeday')}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-lg ${checklist.glanceSomeday ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              Glance at Someday/Maybe
            </span>
          </label>
        </div>
      </div>

      {/* Inbox Zero Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Inbox Zero</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            inboxTasks.length === 0
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {inboxTasks.length} {inboxTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {inboxTasks.length === 0 ? (
          <p className="text-gray-600 italic">Inbox is empty! Well done!</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600 mb-3">
              Click each task to clarify and process it.
            </p>
            {inboxTasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
              >
                <div className="font-medium text-gray-900">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Review Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Projects Review</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {projects.length} active {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-600 italic">No active projects.</p>
        ) : (
          <div className="space-y-4">
            {projects.map(project => {
              const nextActions = project.tasks.filter(t => t.status === 'next_action');
              const hasNoNextAction = nextActions.length === 0;

              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-md border ${
                    hasNoNextAction
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      {hasNoNextAction ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-200 text-red-900">
                          No next action
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {nextActions.length} next {nextActions.length === 1 ? 'action' : 'actions'}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasNoNextAction && (
                    <div className="mt-2 text-sm text-red-700">
                      ⚠️ This project needs a next action defined!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Waiting For Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Waiting For</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {waitingTasks.length} {waitingTasks.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {waitingTasks.length === 0 ? (
          <p className="text-gray-600 italic">No items waiting.</p>
        ) : (
          <div className="space-y-2">
            {waitingTasks.map(task => (
              <div
                key={task.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="font-medium text-gray-900">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Someday/Maybe Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Someday/Maybe</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
            {somedayTasks.length} {somedayTasks.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {somedayTasks.length === 0 ? (
          <p className="text-gray-600 italic">No someday/maybe items.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600 mb-3">
              Showing {Math.min(somedayTasks.length, 5)} of {somedayTasks.length} someday/maybe items:
            </p>
            {somedayTasks.slice(0, 5).map(task => (
              <div
                key={task.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="font-medium text-gray-900">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                )}
              </div>
            ))}
            {somedayTasks.length > 5 && (
              <p className="text-sm text-gray-500 italic mt-2">
                ... and {somedayTasks.length - 5} more
              </p>
            )}
          </div>
        )}
      </div>

      {/* ClarifyModal */}
      {selectedTask && (
        <ClarifyModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
