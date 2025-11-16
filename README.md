# NextStep

A GTD (Getting Things Done) style task management application built with Next.js, focusing on Next Actions organized by context.

## Features

### Current Implementation

- **Quick Capture**: Capture tasks quickly with a single input field
- **Inbox Processing**: Review and clarify tasks from your inbox
- **Next Actions**: View actionable tasks filtered by status
- **Projects**: Organize tasks into projects with next action counts
- **Context Tagging**: Tag tasks with contexts (Home, Work, Computer, Phone, etc.)
- **Clarify Modal**: Process inbox items by setting status, project, contexts, and notes

### Views

1. **Inbox**: All captured tasks waiting to be processed
2. **Next Actions**: Tasks marked as actionable, ready to be done
3. **Projects**: Project overview with next action counts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: In-memory (demo purposes - replace with database in production)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
next-step/
├── app/
│   ├── api/
│   │   ├── tasks/          # Task API routes
│   │   ├── projects/       # Project API routes
│   │   └── contexts/       # Context API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard
├── components/
│   ├── TaskList.tsx        # Task list component
│   └── ClarifyModal.tsx    # Task clarification modal
├── lib/
│   └── db.ts               # In-memory data storage
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (optional query: `?status=inbox`)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Projects

- `GET /api/projects` - Get all projects with next action counts
- `POST /api/projects` - Create a new project

### Contexts

- `GET /api/contexts` - Get all available contexts

## Usage

### Capturing Tasks

1. Type your task in the capture input box at the top
2. Press Enter to create the task
3. The Clarify modal will open automatically

### Clarifying Tasks

In the Clarify modal, you can:
- Set the task status (Inbox, Next Action, Waiting, Someday, Done)
- Assign to a project (optional)
- Add context tags (Home, Work, Computer, Phone)
- Add notes

### Viewing Tasks

- **Inbox**: Click to view all unclarified tasks
- **Next Actions**: View all actionable tasks (context filter coming soon)
- **Projects**: View projects with their next action counts

## Future Enhancements

- Context filtering in Next Actions view
- Database integration (PostgreSQL, MongoDB, etc.)
- User authentication
- Task dependencies
- Due dates and reminders
- Recurring tasks
- Archive and search functionality
- Mobile app

## Contributing

This is a demo project. Feel free to fork and customize for your needs.

## License

MIT
