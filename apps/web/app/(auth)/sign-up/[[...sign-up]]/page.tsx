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

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
