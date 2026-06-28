import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStartup',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'Thanks to Injamul for their professional work. The website they created for my business exceeded my expectations, and my clients have given positive feedback about its design and user-friendliness.',
    platform: 'Upwork',
    totalReviews: 50,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'Excellent SEO work! Our website traffic increased by 200% within three months. Injamul is a true professional who delivers results.',
    platform: 'Fiverr',
    totalReviews: 85,
  },
  {
    name: 'Emily Davis',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'As an education consultant, Injamul helped me reach more students than ever before. His expertise in sales and marketing is outstanding.',
    platform: 'LinkedIn',
    totalReviews: 120,
  },
  {
    name: 'David Rodriguez',
    role: 'E-commerce Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'Working with Injamul transformed our online presence. His web development skills are top-notch, and the attention to detail is remarkable. Highly recommended!',
    platform: 'Upwork',
    totalReviews: 95,
  },
  {
    name: 'Jessica Martinez',
    role: 'Startup Founder',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'Injamul\'s expertise in sales and education consulting helped us scale our business rapidly. His strategic approach and dedication are unmatched. A true professional!',
    platform: 'LinkedIn',
    totalReviews: 78,
  },
];

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="testimonials" className="py-24 bg-[#f7f7f7] text-black border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#A31414]/20 text-[#A31414] bg-[#A31414]/5 mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col gap-1">
              <span className="font-serif font-medium text-black italic">Client</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#A31414]">Testimonials</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-[#A31414] w-8' : 'bg-black/10'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="max-w-4xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm hover:border-[#A31414]/30 hover:shadow-md transition-all duration-300 relative">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#A31414]/10 ring-offset-4 ring-offset-white mx-auto md:mx-0">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                          <span className="text-xs text-black/40 uppercase font-medium">Reviews On</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#A31414]">{testimonial.platform}</span>
                            <span className="text-xs text-black/40">
                              4.9 / {testimonial.totalReviews} Reviews
                            </span>
                          </div>
                          <div className="flex gap-0.5 ml-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#A31414] text-[#A31414]" />
                            ))}
                          </div>
                        </div>

                        <Quote className="w-10 h-10 text-[#A31414]/10 mb-2 mx-auto md:mx-0" />

                        <p className="text-black/80 text-sm md:text-base leading-relaxed mb-6 font-sans italic text-center md:text-left">
                          "{testimonial.review}"
                        </p>

                        <div className="flex items-center justify-between border-t border-black/5 pt-4">
                          <div className="text-left">
                            <h4 className="font-bold text-black text-base">{testimonial.name}</h4>
                            <p className="text-xs text-black/40 font-medium">{testimonial.role}</p>
                          </div>
                          <span className="text-3xl font-black text-black/5 select-none font-sans">
                            0{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-12 border border-black/10 hover:bg-black/5 text-black hover:text-black hidden md:flex" />
            <CarouselNext className="right-0 lg:-right-12 border border-black/10 hover:bg-black/5 text-black hover:text-black hidden md:flex" />
          </Carousel>
        </div>

      </div>
    </section>
  );
}
