import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import Atmosphere from '@/components/atmosphere';

export const metadata: Metadata = {
  title: 'Terms of Service | StarForm',
  description:
    'Read the terms of service for StarForm, including creator responsibilities, acceptable form creation policies, and usage tier limits.',
};

export default function TermsPage() {
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
                Agreement
              </span>
              <h1
                className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal tracking-[-0.01em] text-foreground leading-[1.1] mb-4"
                style={{ textWrap: 'balance' }}
              >
                Terms of Service
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
                Welcome to StarForm. These Terms of Service govern your access to and use of the
                StarForm application and its services. By utilizing our platform to build forms or
                submit responses, you agree to these Terms in full.
              </p>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  1. Creator Accounts & Security
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  To create and distribute forms, you must register for an account authenticated via
                  Clerk. You are solely responsible for all activity occurring under your creator
                  profile, maintaining confidential credentials, and notifying support immediately
                  of any security breaches or unauthorized access.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  2. Acceptable Use Policy
                </h2>
                <div className="space-y-4 font-body text-base leading-[1.75] text-muted-foreground">
                  <p>
                    Creators are prohibited from building forms that collect sensitive personal data
                    designed to deceive or exploit respondents. Forms must not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Collect passwords, raw access tokens, or login credentials.</li>
                    <li>
                      Collect payment card information or bank routing details in plain text fields.
                    </li>
                    <li>Be used for phishing, distributing malware, or sending spam.</li>
                  </ul>
                  <p>
                    Violations of this Acceptable Use Policy will result in immediate termination of
                    the offending forms and suspension of the associated Creator account.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  3. Subscription Tiers & Enforced Limits
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  StarForm offers Free, Pro, and Enterprise subscription plans. Plan limitations
                  (such as published form quotas and monthly submission ceilings) are strictly
                  enforced at the database level. Attempts to bypass these quotas using multiple
                  accounts or API manipulation may result in service suspension.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  4. Intellectual Property
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  Creators retain all intellectual property rights to the questions, structures,
                  configurations, and response submissions collected through their forms. StarForm
                  owns all rights, titles, and interests in the core platform code, pre-built
                  animated themes, branding, and assets.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-normal text-foreground mt-8 mb-4 border-b border-border/40 pb-2">
                  5. Disclaimer of Warranties & Liability
                </h2>
                <p className="font-body text-base leading-[1.75] text-muted-foreground">
                  StarForm is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis.
                  We make no warranties regarding uptime, delivery of webhook alerts, or data
                  permanence. StarForm shall not be liable for direct, indirect, or incidental
                  damages arising from data losses or system downtime.
                </p>
              </div>

              <div className="pt-6 border-t border-border/30">
                <p className="font-body text-sm text-muted-foreground italic">
                  Questions regarding these terms? Feel free to contact our support desk at{' '}
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
