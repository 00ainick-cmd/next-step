export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">NextStep GTD</h1>
        <p className="text-lg mb-4">
          A Getting Things Done (GTD) application built with Next.js and Prisma.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>POST /api/tasks - Create a new task</li>
            <li>GET /api/tasks - List tasks (filterable by status, contextId)</li>
            <li>PATCH /api/tasks/[id] - Update a task</li>
            <li>GET /api/contexts - List all contexts</li>
            <li>GET /api/projects - List all projects</li>
            <li>POST /api/projects - Create a new project</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
