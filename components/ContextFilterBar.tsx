'use client';

import { Context, DEFAULT_CONTEXTS } from '@/lib/types';

interface ContextFilterBarProps {
  contexts: Context[];
  selectedContextId: string | null;
  onSelectContext: (id: string | null) => void;
}

export default function ContextFilterBar({
  contexts,
  selectedContextId,
  onSelectContext
}: ContextFilterBarProps) {
  // Merge default contexts with user-created contexts
  const defaultContextsMap = new Map(
    DEFAULT_CONTEXTS.map(name => [name, null as string | null])
  );

  // Map user contexts by name for easy lookup
  contexts.forEach(context => {
    if (DEFAULT_CONTEXTS.includes(context.name as any)) {
      defaultContextsMap.set(context.name as any, context.id);
    }
  });

  // Get additional user-created contexts not in defaults
  const additionalContexts = contexts.filter(
    context => !DEFAULT_CONTEXTS.includes(context.name as any)
  );

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectContext(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedContextId === null
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Contexts
        </button>

        {DEFAULT_CONTEXTS.map(contextName => {
          const contextId = defaultContextsMap.get(contextName);
          const isSelected = contextId && selectedContextId === contextId;

          return (
            <button
              key={contextName}
              onClick={() => contextId && onSelectContext(contextId)}
              disabled={!contextId}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : contextId
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {contextName}
            </button>
          );
        })}

        {additionalContexts.map(context => (
          <button
            key={context.id}
            onClick={() => onSelectContext(context.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedContextId === context.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {context.name}
          </button>
        ))}
      </div>
    </div>
  );
}
