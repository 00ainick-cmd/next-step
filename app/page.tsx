export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to NextStep
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your GTD-inspired task management system
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 mb-4">
              NextStep is built with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Next.js 15 with App Router</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for styling</li>
              <li>Prisma ORM with SQLite</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
