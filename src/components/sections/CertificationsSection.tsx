import { useState } from 'react';
import { Award, ExternalLink, X, Calendar, Building2, CheckCircle2 } from 'lucide-react';
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
    <section id="certifications" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            CERTIFICATIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Professional Certifications
            <br />
            <span className="gradient-text">& Achievements</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {certificates.map((cert, index) => (
            <div
              key={index}
              onClick={() => handleCertClick(cert)}
              className="group bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border cursor-pointer"
            >
              <div className="flex flex-col h-full">
                {/* Certificate Icon/Image Placeholder */}
                <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                  {cert.image ? (
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Award className="w-12 h-12 text-primary" />
                  )}
                </div>

                {/* Certificate Details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {cert.date}
                  </p>
                </div>

                {/* Click hint */}
                <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Click for details →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCert && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold gradient-text pr-8">
                  {selectedCert.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Certificate details for {selectedCert.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Certificate Image/Icon */}
                <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                  {selectedCert.image ? (
                    <img 
                      src={selectedCert.image} 
                      alt={selectedCert.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Award className="w-24 h-24 text-primary" />
                  )}
                </div>

                {/* Issuer and Date Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Issued By</p>
                      <p className="font-semibold">{selectedCert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Issue Date</p>
                      <p className="font-semibold">{selectedCert.date}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedCert.description && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">About This Certification</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedCert.description}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedCert.skills && selectedCert.skills.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Skills Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credential Details */}
                <div className="border-t border-border pt-6 space-y-3">
                  {selectedCert.credentialId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Credential ID</span>
                      <span className="font-mono text-sm font-semibold">{selectedCert.credentialId}</span>
                    </div>
                  )}
                  {selectedCert.validUntil && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valid Until</span>
                      <span className="text-sm font-semibold">{selectedCert.validUntil}</span>
                    </div>
                  )}
                </div>

                {/* View Credential Button */}
                {selectedCert.credentialUrl && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => window.open(selectedCert.credentialUrl, '_blank')}
                  >
                    View Credential
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
