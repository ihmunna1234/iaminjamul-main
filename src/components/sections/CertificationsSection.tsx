import { useState } from 'react';
import { Award, ExternalLink, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
  credentialId?: string;
  validUntil?: string;
}

const certificates: Certificate[] = [
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'January 2024',
    credentialUrl: '#',
    description: 'Demonstrated expertise in designing and deploying scalable, highly available, and fault-tolerant systems on AWS. This certification validates advanced technical skills in designing distributed applications and systems on the AWS platform.',
    skills: ['Cloud Architecture', 'AWS Services', 'Security', 'Cost Optimization', 'High Availability'],
    credentialId: 'AWS-SA-2024-12345',
    validUntil: 'January 2027',
  },
  {
    title: 'React Developer Certification',
    issuer: 'Meta',
    date: 'June 2023',
    credentialUrl: '#',
    description: 'Comprehensive certification covering advanced React concepts, hooks, state management, and modern web development practices. Demonstrates proficiency in building complex, performant React applications.',
    skills: ['React.js', 'Hooks', 'State Management', 'Component Architecture', 'Performance Optimization'],
    credentialId: 'META-REACT-2023-67890',
    validUntil: 'Lifetime',
  },
  {
    title: 'Full Stack Web Development',
    issuer: 'freeCodeCamp',
    date: 'March 2023',
    credentialUrl: '#',
    description: 'Comprehensive full-stack development certification covering front-end and back-end technologies, databases, APIs, and deployment. Completed 1,800+ hours of coursework and built multiple real-world projects.',
    skills: ['HTML/CSS', 'JavaScript', 'Node.js', 'MongoDB', 'React', 'REST APIs'],
    credentialId: 'FCC-FULLSTACK-2023-11223',
    validUntil: 'Lifetime',
  },
  {
    title: 'Professional Scrum Master',
    issuer: 'Scrum.org',
    date: 'September 2022',
    credentialUrl: '#',
    description: 'Demonstrated understanding of Scrum framework, practices, and application. This certification validates the ability to support teams and organizations in their Scrum adoption and improve effectiveness.',
    skills: ['Agile Methodology', 'Scrum Framework', 'Team Facilitation', 'Sprint Planning', 'Product Backlog'],
    credentialId: 'SCRUM-PSM-2022-44556',
    validUntil: 'Lifetime',
  },
];

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCertClick = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsDialogOpen(true);
  };

  return (
    <section id="certifications" className="py-24 bg-[#f7f7f7] text-black border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#A31414]/20 text-[#A31414] bg-[#A31414]/5 mb-4">
            Certifications
          </span>
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
            <span className="font-serif font-medium text-black italic">Professional</span>
            <span className="font-sans font-black uppercase tracking-tight text-[#A31414]">Certifications</span>
          </h2>
          <p className="text-black/60 text-sm md:text-base max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {certificates.map((cert, index) => (
            <div
              key={index}
              onClick={() => handleCertClick(cert)}
              className="group bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:border-[#A31414]/30 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Certificate Icon/Image Placeholder */}
                <div className="w-full aspect-video bg-[#A31414]/5 border border-[#A31414]/10 rounded-xl mb-4 flex items-center justify-center">
                  {cert.image ? (
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Award className="w-10 h-10 text-[#A31414]" />
                  )}
                </div>

                {/* Certificate Details */}
                <h3 className="font-bold text-base text-black group-hover:text-[#A31414] transition-colors mb-2 line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-xs text-black/50 mb-1 font-medium">
                  {cert.issuer}
                </p>
                <p className="text-[10px] text-black/40 font-mono">
                  {cert.date}
                </p>
              </div>

              {/* Click hint */}
              <div className="text-xs text-[#A31414] font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Details →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-black border border-black/10 rounded-2xl">
          {selectedCert && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tight text-black pr-8 font-sans">
                  {selectedCert.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Certificate details for {selectedCert.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Certificate Image/Icon */}
                <div className="w-full aspect-video bg-[#A31414]/5 border border-[#A31414]/10 rounded-xl flex items-center justify-center">
                  {selectedCert.image ? (
                    <img 
                      src={selectedCert.image} 
                      alt={selectedCert.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Award className="w-20 h-20 text-[#A31414]" />
                  )}
                </div>

                {/* Issuer and Date Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#f7f7f7] border border-black/5 rounded-xl">
                    <Building2 className="w-5 h-5 text-[#A31414]" />
                    <div>
                      <p className="text-[10px] text-black/40 uppercase font-medium">Issued By</p>
                      <p className="font-bold text-sm text-black">{selectedCert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#f7f7f7] border border-black/5 rounded-xl">
                    <Calendar className="w-5 h-5 text-[#A31414]" />
                    <div>
                      <p className="text-[10px] text-black/40 uppercase font-medium">Issue Date</p>
                      <p className="font-bold text-sm text-black">{selectedCert.date}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedCert.description && (
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide text-black/40 mb-2 font-sans">About This Certification</h3>
                    <p className="text-black/70 text-sm leading-relaxed font-sans">
                      {selectedCert.description}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedCert.skills && selectedCert.skills.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide text-black/40 mb-3 flex items-center gap-2 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#A31414]" />
                      Skills Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#A31414]/5 text-[#A31414] border border-[#A31414]/15 rounded-full text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credential Details */}
                <div className="border-t border-black/5 pt-6 space-y-3">
                  {selectedCert.credentialId && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-black/40 uppercase font-medium">Credential ID</span>
                      <span className="font-mono font-bold text-black">{selectedCert.credentialId}</span>
                    </div>
                  )}
                  {selectedCert.validUntil && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-black/40 uppercase font-medium">Valid Until</span>
                      <span className="font-bold text-black">{selectedCert.validUntil}</span>
                    </div>
                  )}
                </div>

                {/* View Credential Button */}
                {selectedCert.credentialUrl && (
                  <button
                    className="w-full py-3 px-4 rounded-xl bg-[#A31414] hover:bg-[#8e1111] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                    onClick={() => window.open(selectedCert.credentialUrl, '_blank')}
                  >
                    View Credential
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
