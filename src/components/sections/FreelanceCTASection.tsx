import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FreelanceCTASection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hello 👋 I'm available for
            <br />
            freelance work
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-muted-foreground">For quick response:</span>
            <a
              href="https://wa.me/966582822130"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary/50 rounded-full text-primary hover:bg-primary/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat now
            </a>
          </div>

          <Button variant="hero" size="lg" asChild>
            <a href="#contact">
              Hire Me Now
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
