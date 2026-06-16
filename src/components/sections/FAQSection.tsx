import { MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import FaqPhoto from '@/assets/faq-photo.jpg';

const faqs = [
  {
    question: 'May I see your work samples?',
    answer:
      'Yes, absolutely! You can view my portfolio in the Experience section above, or I can provide direct links to live projects upon request. I have worked on various web development, SEO, and digital marketing projects.',
  },
  {
    question: 'What are your rates?',
    answer:
      'My rates vary depending on the project scope and complexity. For web development, I offer packages starting from $28 for static sites and $48 for WordPress development. For ongoing SEO or consulting work, I offer hourly and monthly retainer options.',
  },
  {
    question: 'How do you prefer to communicate?',
    answer:
      'I am flexible with communication. I typically use WhatsApp for quick updates, email for detailed discussions, and video calls for project kickoffs and reviews. I adapt to whatever works best for you.',
  },
  {
    question: 'What is your typical project timeline?',
    answer:
      'Project timelines depend on complexity. A simple landing page takes 3-5 days, while a full website can take 2-4 weeks. I always provide a clear timeline estimate before starting any project.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      'Yes! I offer post-project support packages including website maintenance, SEO monitoring, and content updates. We can discuss a support plan that fits your needs after project completion.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Image with chat prompt */}
          <div className="relative">
            <div className="bg-muted/50 rounded-3xl p-4 md:p-8 relative overflow-hidden">
              <div className="aspect-square max-w-md mx-auto relative">
                <img
                  src={FaqPhoto}
                  alt="Consultant"
                  className="w-full h-full object-cover rounded-2xl"
                />
                {/* Chat bubble - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block absolute top-4 right-0 md:translate-x-1/4 max-w-[200px] md:max-w-xs">
                  <div className="bg-card rounded-xl p-3 md:p-4 shadow-lg">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                      Can't find what you are looking for?
                    </p>
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      I would like to chat with you
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a
                      href="https://wa.me/966582822130"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - FAQ */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
