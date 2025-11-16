# NextStep

A GTD-inspired task management system built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma ORM** - Type-safe database ORM
- **SQLite** - Local development database

## Database Schema

The application uses the following data models:

- **User** - User accounts
- **Project** - User projects with status tracking
- **Context** - GTD contexts like @Home, @Office, @Computer, etc.
- **Task** - Individual tasks with scheduling, energy levels, and time estimates
- **TaskContext** - Many-to-many relationship between tasks and contexts
- **CalendarIntegration** - Google Calendar integration
- **CalendarEventLink** - Links between tasks and calendar events

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up the database:**

Generate Prisma client and create the database:

```bash
npx prisma generate
```

3. **Run migrations:**

Create the database schema:

```bash
npx prisma migrate dev --name init
```

This will create a new SQLite database at `prisma/dev.db` with all the required tables.

4. **Seed the database:**

Populate the database with a demo user and default contexts:

```bash
npx prisma db seed
```

This creates:
- A demo user with email: `demo@nextstep.com`
- Default contexts: @Home, @Office, @Computer, @Phone, @Errands, @Anywhere

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Prisma Commands

- `npx prisma studio` - Open Prisma Studio to view/edit data
- `npx prisma migrate dev` - Create a new migration
- `npx prisma db seed` - Run the seed script
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes without migrations (dev only)

## Project Structure

```
nextstep/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── lib/                 # Utility functions
│   └── prisma.ts        # Prisma client singleton
├── prisma/              # Prisma configuration
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
├── public/              # Static assets
└── ...config files
```

## Environment Variables

The default SQLite configuration doesn't require any environment variables. If you need to customize the database location, you can modify the `datasource` url in `prisma/schema.prisma`.

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>` to create a migration
3. The Prisma Client will be automatically regenerated
4. Use the `prisma` client from `lib/prisma.ts` in your application code

## Next Steps

- Add authentication (NextAuth.js recommended)
- Build task management UI
- Implement GTD workflow features
- Add calendar integration
- Create API routes for CRUD operations

## License

MIT
