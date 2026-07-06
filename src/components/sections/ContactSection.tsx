import { useState } from 'react';
import { Send, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '1ed3c344-c946-4c86-bed5-f1690685ade3';
      
      if (accessKey === '1ed3c344-c946-4c86-bed5-f1690685ade3') {
        console.warn('⚠️ Web3Forms access key not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file.');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Portfolio Contact Form',
          replyto: formData.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again or contact me directly via email.',
        variant: 'destructive',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = '966582822130';
  const whatsappMessage = encodeURIComponent("Hi Injamul! I'd like to discuss a project with you.");

  return (
    <section id="contact" className="py-14 bg-[#F9F9F7] text-[#121212] border-t border-black/5 relative overflow-hidden">
      <div className="container-narrow">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 mb-4">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
            <span className="font-serif font-medium text-[#121212] italic">Let's</span>
            <span className="font-sans font-black uppercase tracking-tight text-[#FF5733]">Work Together</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-fade-in-left flex flex-col justify-between" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-[#121212] mb-4 font-sans">Get In Touch</h3>
              <p className="text-[#666666] text-sm md:text-base leading-relaxed mb-8 font-sans max-w-md">
                Have a project in mind or want to discuss potential opportunities? 
                Feel free to reach out. I'm always open to new ideas and collaborations.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#FF5733]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide">Email</p>
                    <a href="mailto:ihmunna1234@gmail.com" className="font-bold text-sm text-[#121212] hover:text-[#FF5733] transition-colors block">
                      ihmunna1234@gmail.com
                    </a>
                    <a href="mailto:ihmunna212@gmail.com" className="font-bold text-sm text-[#121212] hover:text-[#FF5733] transition-colors block">
                      ihmunna212@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#FF5733]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide">Phone</p>
                    <a href="tel:+966582822130" className="font-bold text-sm text-[#121212] hover:text-[#FF5733] transition-colors">
                      +966 582 822 130
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FF5733]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide">Location</p>
                    <p className="font-bold text-sm text-[#121212]">Makkah, Saudi Arabia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="mt-10 lg:mt-0">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-[#FF5733] hover:bg-[#e04e2b] text-white font-bold uppercase tracking-wider px-6 py-4 items-center justify-center gap-1.5 transition-all text-xs shadow-sm w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="grid gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="h-12 w-full bg-[#F9F9F7] border border-black/5 text-[#121212] placeholder-[#666666]/30 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide mb-2">
                      Your Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="h-12 w-full bg-[#F9F9F7] border border-black/5 text-[#121212] placeholder-[#666666]/30 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    required
                    className="h-12 w-full bg-[#F9F9F7] border border-black/5 text-[#121212] placeholder-[#666666]/30 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className="w-full bg-[#F9F9F7] border border-black/5 text-[#121212] placeholder-[#666666]/30 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#121212] hover:bg-[#FF5733] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
