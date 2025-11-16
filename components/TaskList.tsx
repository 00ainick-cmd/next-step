import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No tasks to display</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inbox':
        return 'bg-gray-100 text-gray-800';
      case 'next_action':
        return 'bg-blue-100 text-blue-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'someday':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick(task)}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-slate-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">{task.title}</h3>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {formatStatus(task.status)}
                </span>

                {task.projectName && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    📁 {task.projectName}
                  </span>
                )}
              </div>

              {task.contexts.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {task.contexts.map((context) => (
                    <span
                      key={context.id}
                      className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                      style={context.color ? { borderColor: context.color, color: context.color } : {}}
                    >
                      {context.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
