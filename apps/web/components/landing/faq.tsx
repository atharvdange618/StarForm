'use client';

import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
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

function FAQItem({
  faq,
  index,
  isInView,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: index * 0.08 }}
    >
      <AccordionItem value={`item-${faq.q}`} className="border-border/60 py-1">
        <AccordionTrigger className="font-body py-4 text-left text-lg font-medium text-foreground hover:no-underline [&>svg]:text-muted-foreground">
          <motion.span
            className="text-left"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {faq.q}
          </motion.span>
        </AccordionTrigger>
        <AnimatePresence mode="wait">
          <AccordionContent>
            <motion.p
              className="font-body text-lg leading-[1.75] text-muted-foreground max-w-[62ch]"
              initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{ textWrap: 'pretty' }}
            >
              {faq.a}
            </motion.p>
          </AccordionContent>
        </AnimatePresence>
      </AccordionItem>
    </motion.div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="faq" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-6" ref={ref}>
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.span
            className="eyebrow inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            FAQ
          </motion.span>
          <motion.h2
            className="text-[clamp(2.25rem,5vw,3.5rem)] font-normal tracking-[-0.01em] text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Frequently asked questions
          </motion.h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.q} faq={faq} index={index} isInView={isInView} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
