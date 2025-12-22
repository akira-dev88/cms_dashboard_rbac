import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            <span className="text-xl font-bold">CMS Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Powerful Content Management
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            A modern, intuitive dashboard for managing all your content needs.
            Built with Next.js 14 and the latest web technologies.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-lg bg-blue-100 p-2">
                <svg className="h-full w-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Easy Content Creation</h3>
              <p className="mt-2 text-gray-600">Create and manage content with our intuitive editor.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-lg bg-green-100 p-2">
                <svg className="h-full w-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Role-Based Access</h3>
              <p className="mt-2 text-gray-600">Control permissions with detailed role management.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-lg bg-purple-100 p-2">
                <svg className="h-full w-full text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              <p className="mt-2 text-gray-600">Track performance with comprehensive analytics.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}