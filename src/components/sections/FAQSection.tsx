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
    <section id="faq" className="py-24 bg-[#f7f7f7] text-black border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Image with chat prompt */}
          <div className="relative">
            <div className="bg-white border border-black/5 rounded-3xl p-4 md:p-6 shadow-sm relative overflow-hidden">
              <div className="aspect-square max-w-sm mx-auto relative">
                <img
                  src={FaqPhoto}
                  alt="Consultant"
                  className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Chat bubble - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block absolute top-4 right-0 translate-x-8 max-w-[220px]">
                  <div className="bg-[#111111] text-white border border-white/10 rounded-2xl p-4 shadow-xl">
                    <p className="text-[10px] text-white/50 uppercase font-semibold mb-1">
                      Need help?
                    </p>
                    <p className="text-xs font-bold leading-normal">
                      Let's chat about your project!
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a
                      href="https://wa.me/966582822130"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#A31414] hover:bg-[#8e1111] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - FAQ */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#A31414]/20 text-[#A31414] bg-[#A31414]/5 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col gap-1 mb-8">
              <span className="font-serif font-medium text-black italic">Frequently Asked</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#A31414]">Questions</span>
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-black/5 px-6 data-[state=open]:border-[#A31414]/30 shadow-sm transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-sm md:text-base font-bold hover:no-underline py-4 text-black hover:text-[#A31414] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-black/60 text-xs md:text-sm font-sans leading-relaxed pb-4">
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
