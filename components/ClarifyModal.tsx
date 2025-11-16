'use client';

import { useState, useEffect } from 'react';
import { Task, Project, Context } from '@/types';

interface ClarifyModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (task: Task) => void;
}

type ActionableChoice = 'actionable' | 'non-actionable' | null;
type NonActionableChoice = 'reference' | 'someday' | null;
type ProjectChoice = 'single' | 'project' | null;
type CalendarChoice = 'none' | 'due-date' | 'schedule' | null;

export default function ClarifyModal({
  task,
  isOpen,
  onClose,
  onUpdated,
}: ClarifyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [actionableChoice, setActionableChoice] = useState<ActionableChoice>(null);
  const [nonActionableChoice, setNonActionableChoice] = useState<NonActionableChoice>(null);

  // Step 2
  const [editedTitle, setEditedTitle] = useState('');

  // Step 3
  const [projectChoice, setProjectChoice] = useState<ProjectChoice>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);

  // Step 4
  const [contexts, setContexts] = useState<Context[]>([]);
  const [selectedContextIds, setSelectedContextIds] = useState<string[]>([]);
  const [newContextName, setNewContextName] = useState('');
  const [showNewContextInput, setShowNewContextInput] = useState(false);

  // Step 5
  const [calendarChoice, setCalendarChoice] = useState<CalendarChoice>(null);
  const [dueDate, setDueDate] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState('60');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && task) {
      setStep(1);
      setActionableChoice(null);
      setNonActionableChoice(null);
      setEditedTitle(task.title);
      setProjectChoice(null);
      setSelectedProjectId(undefined);
      setNewProjectName('');
      setShowNewProjectInput(false);
      setSelectedContextIds([]);
      setNewContextName('');
      setShowNewContextInput(false);
      setCalendarChoice(null);
      setDueDate('');
      setScheduleDate('');
      setScheduleTime('');
      setScheduleDuration('60');
      loadProjects();
      loadContexts();
    }
  }, [isOpen, task]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadContexts = async () => {
    try {
      const response = await fetch('/api/contexts');
      const data = await response.json();
      setContexts(data);
    } catch (error) {
      console.error('Failed to load contexts:', error);
    }
  };

  const handleNonActionableSave = async () => {
    if (!task || !nonActionableChoice) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nonActionableChoice }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdated(updatedTask);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = async () => {
    if (!task) return;

    setLoading(true);
    try {
      // Create new project if needed
      let finalProjectId = selectedProjectId;
      if (projectChoice === 'project' && showNewProjectInput && newProjectName) {
        const projectResponse = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newProjectName }),
        });
        if (projectResponse.ok) {
          const newProject = await projectResponse.json();
          finalProjectId = newProject.id;
        }
      }

      // Calculate scheduled times if needed
      let scheduledStart: string | undefined;
      let scheduledEnd: string | undefined;
      if (calendarChoice === 'schedule' && scheduleDate && scheduleTime) {
        scheduledStart = `${scheduleDate}T${scheduleTime}:00`;
        const startTime = new Date(scheduledStart);
        const endTime = new Date(startTime.getTime() + parseInt(scheduleDuration) * 60000);
        scheduledEnd = endTime.toISOString();
      }

      // Update task
      const updateData: any = {
        title: editedTitle,
        status: 'next_action',
        contextIds: selectedContextIds.length > 0 ? selectedContextIds : undefined,
      };

      if (projectChoice === 'project' && finalProjectId) {
        updateData.projectId = finalProjectId;
      }

      if (calendarChoice === 'due-date' && dueDate) {
        updateData.dueDate = dueDate;
      }

      if (calendarChoice === 'schedule' && scheduledStart && scheduledEnd) {
        updateData.scheduledStart = scheduledStart;
        updateData.scheduledEnd = scheduledEnd;
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdated(updatedTask);
        onClose();
      }
    } catch (error) {
      console.error('Failed to save task:', error);
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

  const handleAddContext = async () => {
    if (!newContextName.trim()) return;

    try {
      const response = await fetch('/api/contexts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newContextName }),
      });

      if (response.ok) {
        const newContext = await response.json();
        setContexts([...contexts, newContext]);
        setSelectedContextIds([...selectedContextIds, newContext.id]);
        setNewContextName('');
        setShowNewContextInput(false);
      }
    } catch (error) {
      console.error('Failed to create context:', error);
    }
  };

  const canProceedStep1 = actionableChoice === 'actionable' || nonActionableChoice !== null;
  const canProceedStep2 = editedTitle.trim().length > 0;
  const canProceedStep3 = projectChoice !== null && (
    projectChoice === 'single' ||
    selectedProjectId !== undefined ||
    (showNewProjectInput && newProjectName.trim().length > 0)
  );
  const canProceedStep4 = true; // Contexts are optional
  const canProceedStep5 = calendarChoice !== null && (
    calendarChoice === 'none' ||
    (calendarChoice === 'due-date' && dueDate !== '') ||
    (calendarChoice === 'schedule' && scheduleDate !== '' && scheduleTime !== '')
  );

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Clarify Task
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {step} of 5
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Step 1: Actionable? */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Is this something you can actually do, or just information?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActionableChoice('actionable');
                    setNonActionableChoice(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    actionableChoice === 'actionable'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">This is actionable</div>
                  <div className="text-sm text-gray-600">
                    I can take action on this
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActionableChoice('non-actionable');
                    if (!nonActionableChoice) setNonActionableChoice('reference');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    actionableChoice === 'non-actionable'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">This is reference / Someday</div>
                  <div className="text-sm text-gray-600">
                    Not actionable right now
                  </div>
                </button>
              </div>

              {actionableChoice === 'non-actionable' && (
                <div className="mt-4 space-y-3 pl-4 border-l-4 border-blue-600">
                  <p className="text-sm font-medium text-gray-700">Where should this go?</p>
                  <button
                    onClick={() => setNonActionableChoice('reference')}
                    className={`w-full text-left px-4 py-2 rounded-lg border ${
                      nonActionableChoice === 'reference'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Move to Reference
                  </button>
                  <button
                    onClick={() => setNonActionableChoice('someday')}
                    className={`w-full text-left px-4 py-2 rounded-lg border ${
                      nonActionableChoice === 'someday'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Move to Someday/Maybe
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Next physical action */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                What is the very next physical, visible action you can take?
              </h3>
              <p className="text-sm text-gray-600">
                Use verbs like call, email, draft, review, schedule...
              </p>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                placeholder="e.g., Call John about project proposal"
                autoFocus
              />
              <div className="text-xs text-gray-500">
                Make it specific and action-oriented
              </div>
            </div>
          )}

          {/* Step 3: Single action or project? */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Is this a one-step action or part of a bigger outcome (project)?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setProjectChoice('single');
                    setSelectedProjectId(undefined);
                    setShowNewProjectInput(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    projectChoice === 'single'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Single-step action</div>
                  <div className="text-sm text-gray-600">
                    This completes in one action
                  </div>
                </button>
                <button
                  onClick={() => setProjectChoice('project')}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    projectChoice === 'project'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Part of a project</div>
                  <div className="text-sm text-gray-600">
                    This is one step toward a bigger outcome
                  </div>
                </button>
              </div>

              {projectChoice === 'project' && (
                <div className="mt-4 space-y-3 pl-4 border-l-4 border-blue-600">
                  <p className="text-sm font-medium text-gray-700">Select or create a project:</p>
                  {projects.length > 0 && (
                    <select
                      value={selectedProjectId || ''}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value || undefined);
                        setShowNewProjectInput(false);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">Select existing project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => {
                      setShowNewProjectInput(!showNewProjectInput);
                      if (!showNewProjectInput) setSelectedProjectId(undefined);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Create new project
                  </button>
                  {showNewProjectInput && (
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="Enter project name..."
                      autoFocus
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Contexts */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Where or with what tools can you do this?
              </h3>
              <p className="text-sm text-gray-600">
                Select all that apply (contexts help you see what you can do based on your current situation)
              </p>
              <div className="flex flex-wrap gap-2">
                {contexts.map((context) => (
                  <button
                    key={context.id}
                    onClick={() => toggleContext(context.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${
                      selectedContextIds.includes(context.id)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {context.icon && <span className="mr-1">{context.icon}</span>}
                    {context.name}
                  </button>
                ))}
              </div>
              {!showNewContextInput && (
                <button
                  onClick={() => setShowNewContextInput(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add custom context
                </button>
              )}
              {showNewContextInput && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newContextName}
                    onChange={(e) => setNewContextName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="e.g., @Gym, @Store, etc."
                    autoFocus
                  />
                  <button
                    onClick={handleAddContext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowNewContextInput(false);
                      setNewContextName('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Calendar */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Does this need to happen on a specific day or time?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCalendarChoice('none');
                    setDueDate('');
                    setScheduleDate('');
                    setScheduleTime('');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    calendarChoice === 'none'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">No, just keep it on my Next Actions list</div>
                  <div className="text-sm text-gray-600">
                    I'll do this as soon as possible
                  </div>
                </button>
                <button
                  onClick={() => setCalendarChoice('due-date')}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    calendarChoice === 'due-date'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Yes, it has a hard due date</div>
                  <div className="text-sm text-gray-600">
                    This must be done by a specific date
                  </div>
                </button>
                <button
                  onClick={() => setCalendarChoice('schedule')}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    calendarChoice === 'schedule'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Yes, I want to schedule time for it</div>
                  <div className="text-sm text-gray-600">
                    Block time on my calendar
                  </div>
                </button>
              </div>

              {calendarChoice === 'due-date' && (
                <div className="mt-4 pl-4 border-l-4 border-blue-600">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due date:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}

              {calendarChoice === 'schedule' && (
                <div className="mt-4 pl-4 border-l-4 border-blue-600 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date:
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time:
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes):
                    </label>
                    <input
                      type="number"
                      value={scheduleDuration}
                      onChange={(e) => setScheduleDuration(e.target.value)}
                      min="15"
                      step="15"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-between">
          <div>
            {step > 1 && actionableChoice === 'actionable' && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={loading}
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {actionableChoice === 'non-actionable' && step === 1 && (
              <button
                onClick={handleNonActionableSave}
                disabled={!canProceedStep1 || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            )}
            {actionableChoice === 'actionable' && step < 5 && (
              <button
                onClick={() => {
                  if (step === 1 && canProceedStep1) setStep(2);
                  else if (step === 2 && canProceedStep2) setStep(3);
                  else if (step === 3 && canProceedStep3) setStep(4);
                  else if (step === 4 && canProceedStep4) setStep(5);
                }}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3) ||
                  (step === 4 && !canProceedStep4)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Next →
              </button>
            )}
            {actionableChoice === 'actionable' && step === 5 && (
              <button
                onClick={handleFinalSave}
                disabled={!canProceedStep5 || loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Saving...' : 'Complete Clarification'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
