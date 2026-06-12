import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import Atmosphere from '@/components/atmosphere';

export const metadata: Metadata = {
  title: 'Privacy Policy | StarForm',
  description:
    'Read how StarForm handles user data, protects respondent privacy with IP-hash deduplication, and secures form submission metrics.',
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Atmosphere />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-6 py-24 md:py-36">
          <div
            className="relative rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 md:p-14"
            style={{
              boxShadow: `
                0 1px 2px oklch(0.24 0.055 262 / 0.04),
                0 4px 16px oklch(0.47 0.155 248 / 0.07),
                0 12px 40px oklch(0.78 0.088 308 / 0.06)
              `,
            }}
          >
            <div className="mb-10">
              <span className="eyebrow inline-block mb-3 text-[0.75rem] uppercase tracking-[0.14em] text-muted-foreground font-body">
                Legal Standards
              </span>
              <h1
                className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal tracking-[-0.01em] text-foreground leading-[1.1] mb-4"
                style={{ textWrap: 'balance' }}
              >
                Privacy Policy
              </h1>
              <p className="font-body text-base italic text-muted-foreground">
                Last updated: June 12, 2026
              </p>
            </div>

            <div className="space-y-8">
              <p
                className="font-body text-lg leading-[1.8] text-foreground/80"
                style={{ textWrap: 'pretty' }}
              >
                At StarForm, we are dedicated to protecting your privacy while enabling you to
                create beautiful forms and collect insightful responses. This Privacy Policy details
                how we handle the personal data of both our Creators and Respondents.
              </p>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  1. Information We Collect
                </h2>
                <div className="space-y-4 font-body text-base leading-[1.75] text-muted-foreground">
                  <p>
                    We collect only the essential information needed to offer our services securely
                    and efficiently:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground font-medium">Creator Accounts:</strong>{' '}
                      When you sign up as a Creator, we collect details such as your name and email
                      address via our authentication provider, Clerk.
                    </li>
                    <li>
                      <strong className="text-foreground font-medium">Form Structure:</strong> We
                      store the fields, configurations, options, custom slugs, and theme settings
                      you assign to your forms.
                    </li>
                    <li>
                      <strong className="text-foreground font-medium">
                        Respondent Submissions:
                      </strong>{' '}
                      We record response values submitted to published forms. For duplicate
                      prevention on anonymous submissions, we generate a secure cryptographic hash
                      (SHA-256) of the respondent&apos;s IP address and form ID. The raw IP address
                      is never written to our persistent database.
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  2. How We Use Your Information
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  We use the collected data strictly to run and support your experience on StarForm.
                  This includes enforcing plan quotas, delivering automated email notifications
                  (such as submission confirmations and creator alerts), generating analytics
                  charts, and processing real-time webhooks.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  3. Data Sharing & Third Parties
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  We do not sell, rent, or trade your personal data. We only use third-party
                  services to perform operations essential to StarForm:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-body text-base leading-[1.75] text-muted-foreground">
                  <li>
                    <strong className="text-foreground font-medium">Clerk:</strong> For identity
                    management, authentication, and secure sessions.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">PostgreSQL:</strong> For hosting
                    our persistent Drizzle-managed database structures.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">Resend:</strong> For delivering
                    transactional notification emails.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  4. Data Security
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  We secure your data using industry-standard measures. All client-server traffic is
                  encrypted via TLS. Database transactions are isolated and governed by robust
                  access controls, preventing unauthorized retrieval of form questions and
                  respondent answers.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  5. Your Rights & Control
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  Creators can view, update, export (via CSV), or soft-delete their forms and
                  submissions directly from the dashboard. Respondents who wish to update or remove
                  answers submitted to a form must contact the respective Creator, who holds
                  ultimate administrative control over those submissions.
                </p>
              </div>

              <div className="pt-6 border-t border-border/30">
                <p className="font-body text-sm text-muted-foreground italic">
                  Questions regarding this privacy statement? Feel free to contact our support desk
                  at{' '}
                  <a
                    href="mailto:atharvdange.dev@gmail.com"
                    className="text-primary hover:underline font-medium"
                  >
                    atharvdange.dev@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
