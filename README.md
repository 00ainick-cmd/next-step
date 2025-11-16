# NextStep - GTD Task Manager

A task management application based on David Allen's "Getting Things Done" (GTD) methodology, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Quick Capture
- Rapidly capture tasks to your inbox without overthinking
- Simple input interface to get items out of your head

### Clarify Modal - Guided Wizard
The Clarify Modal guides you through David Allen's clarification process with 5 steps:

1. **Is it actionable?**
   - Determine if the item requires action or is reference/someday material
   - Non-actionable items are moved to Reference or Someday/Maybe

2. **What is the next physical action?**
   - Define a concrete, actionable next step
   - Encourages use of action verbs (call, email, draft, review, etc.)

3. **Single action or project?**
   - Identify whether this is a standalone action or part of a larger project
   - Create or select projects for multi-step outcomes

4. **Which contexts?**
   - Tag actions with contexts (@Home, @Office, @Computer, @Phone, @Errands, @Anywhere)
   - Create custom contexts as needed
   - Helps you see what you can do based on your current situation

5. **Calendar scheduling**
   - Set hard due dates for deadline-driven tasks
   - Schedule time blocks for important work
   - Or keep on Next Actions list for as-soon-as-possible completion

### Task Organization
- **Inbox**: Unclarified items waiting for processing
- **Next Actions**: Clarified, actionable tasks ready to work on
- **Reference**: Information to keep for later
- **Someday/Maybe**: Ideas and possibilities for the future

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

### Build

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **In-memory storage** - Simple demonstration (replace with database in production)

## Project Structure

```
next-step/
├── app/
│   ├── api/              # API routes
│   │   ├── tasks/        # Task CRUD operations
│   │   ├── projects/     # Project management
│   │   └── contexts/     # Context management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/
│   └── ClarifyModal.tsx  # 5-step clarification wizard
├── lib/
│   └── db.ts             # In-memory database (demo)
├── types/
│   └── index.ts          # TypeScript type definitions
└── public/               # Static assets
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project

### Contexts
- `GET /api/contexts` - Get all contexts
- `POST /api/contexts` - Create a new context

## Future Enhancements

- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Project views and management
- [ ] Context-filtered views
- [ ] Calendar integration
- [ ] Search and filtering
- [ ] Task priority and energy levels
- [ ] Weekly review workflow
- [ ] Mobile responsive design improvements
- [ ] Dark mode

## License

MIT
