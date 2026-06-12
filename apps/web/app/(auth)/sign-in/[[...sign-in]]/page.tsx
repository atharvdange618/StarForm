import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Log in to your StarForm account to create new forms, review submissions, and manage settings.',
  openGraph: {
    title: 'Sign In | StarForm',
    description:
      'Log in to your StarForm account to create new forms, review submissions, and manage settings.',
    url: 'https://starform.atharvdangedev.in/sign-in',
  },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" />
    </div>
  );
}
