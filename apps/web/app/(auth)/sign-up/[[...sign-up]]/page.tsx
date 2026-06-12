import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create a free StarForm account and start building gorgeous, high-converting interactive forms in minutes.',
  openGraph: {
    title: 'Sign Up | StarForm',
    description:
      'Create a free StarForm account and start building gorgeous, high-converting interactive forms in minutes.',
    url: 'https://starform.atharvdangedev.in/sign-up',
  },
};

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { plan } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        unsafeMetadata={plan ? { plan } : undefined}
        fallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
