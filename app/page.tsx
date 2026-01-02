import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account or create a new one to continue.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login">
            <Button className="w-full" variant="outline">
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="w-full">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
