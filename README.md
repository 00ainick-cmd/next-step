# NextStep GTD

A Getting Things Done (GTD) application built with Next.js 14 (App Router) and Prisma.

## Features

- Task management with GTD workflow (Inbox, Next Actions, Waiting, Someday, Completed)
- Project organization
- Context-based task filtering
- Energy levels and time estimates
- Scheduled tasks with due dates

## Tech Stack

- **Next.js 14** (App Router)
- **Prisma** (ORM)
- **SQLite** (Database - for development)
- **TypeScript**

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Push the Prisma schema to the database
npm run db:push

# Seed the database with a demo user and sample data
npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## API Routes

All routes currently use a demo user. Authentication will be added in future iterations.

### Tasks

#### Create a Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

**Response:**
```json
{
  "id": "clxxx...",
  "title": "Buy groceries",
  "description": null,
  "status": "inbox",
  "userId": "clxxx...",
  "projectId": null,
  "dueDate": null,
  "scheduledStart": null,
  "scheduledEnd": null,
  "energyLevel": null,
  "timeNeededMinutes": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "project": null,
  "contexts": []
}
```

#### List Tasks
```http
GET /api/tasks
GET /api/tasks?status=inbox
GET /api/tasks?contextId=work-context
GET /api/tasks?status=next_action&contextId=work-context
```

**Response:**
```json
[
  {
    "id": "clxxx...",
    "title": "Buy groceries",
    "status": "inbox",
    ...
  }
]
```

#### Update a Task
```http
PATCH /api/tasks/{id}
Content-Type: application/json

{
  "title": "Buy groceries and supplies",
  "description": "Get milk, bread, eggs",
  "status": "next_action",
  "projectId": "sample-project",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "scheduledStart": "2024-01-18T14:00:00.000Z",
  "scheduledEnd": "2024-01-18T15:00:00.000Z",
  "energyLevel": "medium",
  "timeNeededMinutes": 60,
  "contextIds": ["errands-context"]
}
```

All fields are optional. You can update any combination of fields.

**Response:** The updated task object.

### Projects

#### List Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": "sample-project",
    "name": "Sample Project",
    "description": "A sample GTD project",
    "status": "active",
    "userId": "clxxx...",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "_count": {
      "tasks": 5
    }
  }
]
```

#### Create a Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Home Renovation"
}
```

**Response:** The created project object.

### Contexts

#### List Contexts
```http
GET /api/contexts
```

**Response:**
```json
[
  {
    "id": "work-context",
    "name": "Work",
    "description": "Work-related tasks",
    "userId": "clxxx...",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "_count": {
      "tasks": 3
    }
  }
]
```

## Database Schema

### User
- id, email, name, timestamps

### Task
- id, title, description, status
- dueDate, scheduledStart, scheduledEnd
- energyLevel (high/medium/low)
- timeNeededMinutes
- Relations: user, project, contexts (many-to-many)

### Project
- id, name, description, status (active/on_hold/completed)
- Relations: user, tasks

### Context
- id, name, description
- Relations: user, tasks (many-to-many)

## GTD Workflow Statuses

- **inbox** - Newly captured items
- **next_action** - Ready to be worked on
- **waiting** - Waiting for someone/something
- **someday** - Maybe later
- **completed** - Done

## Authentication (TODO)

Currently, all routes use a demo user (`demo@nextstep.com`).

To add authentication:
1. Install NextAuth.js or similar
2. Replace `getDemoUserId()` calls with session-based user retrieval
3. Add middleware to protect API routes
4. Add user registration/login pages

## Development

### Prisma Studio
View and edit your database:
```bash
npm run prisma:studio
```

### Reset Database
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## Project Structure

```
next-step/
├── app/
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET, POST /api/tasks
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH /api/tasks/[id]
│   │   ├── projects/
│   │   │   └── route.ts          # GET, POST /api/projects
│   │   └── contexts/
│   │       └── route.ts          # GET /api/contexts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   └── demo-user.ts              # Demo user helper
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── package.json
├── tsconfig.json
└── next.config.js
```

## License

MIT
