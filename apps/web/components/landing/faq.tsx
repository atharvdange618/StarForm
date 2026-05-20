import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Do respondents need an account to submit a form?',
    a: 'No. Forms can be filled by anyone with the link, regardless of authentication status. Optional respondent identification is available for creators who want it.',
  },
  {
    q: 'Can I change a form after it has been published?',
    a: 'Once published, a form version is locked for data integrity. You can create a new version of the form while keeping responses to the original intact.',
  },
  {
    q: 'What happens if I hit my plan limits?',
    a: 'You will see clear warnings in your dashboard. Forms remain accessible but new submissions will be blocked until you upgrade or the next billing cycle resets your limits.',
  },
  {
    q: 'Can I export my submission data?',
    a: 'Yes. Pro and Enterprise plans include CSV export with all response data. Free plan users can upgrade to access this feature.',
  },
  {
    q: 'What themes are available for my forms?',
    a: 'Five handcrafted themes: Startup (clean blue), Anime (cherry blossoms), Gaming (pixel glow), Space (star parallax), and Retro (CRT scanlines). Pro users get all five.',
  },
  {
    q: 'How does the auto-save feature work?',
    a: 'As respondents type, their progress is saved to localStorage every 500ms. If they close the page or lose connection, their work is restored on return until they submit.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">FAQ</span>
          <h2
            className="text-[clamp(2.25rem,_5vw,_3.5rem)] font-[400] tracking-[-0.01em] text-foreground"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60 py-1">
              <AccordionTrigger className="font-body py-4 text-left text-lg font-medium text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p
                  className="font-body text-lg leading-[1.75] text-muted-foreground max-w-[62ch]"
                  style={{ textWrap: 'pretty' }}
                >
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
