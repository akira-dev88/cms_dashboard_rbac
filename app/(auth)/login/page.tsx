import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import ClientOnly from '@/components/providers/client-only';

export default function LoginPage() {
  return (
    <ClientOnly>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </ClientOnly>
  );
}