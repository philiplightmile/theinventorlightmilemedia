import React from 'react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';

interface CompletionCertificateProps {
  userEmail: string;
}

export const CompletionCertificate: React.FC<CompletionCertificateProps> = ({ userEmail }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(216, 70, 147); // eos Magenta
    doc.setLineWidth(3);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

    // Inner border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin + 5, margin + 5, pageWidth - margin * 2 - 10, pageHeight - margin * 2 - 10);

    // Title
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(150, 150, 150);
    doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 50, { align: 'center' });

    // Main heading
    doc.setFont('times', 'italic');
    doc.setFontSize(36);
    doc.setTextColor(0, 0, 0);
    doc.text("the inventor's playbook", pageWidth / 2, 70, { align: 'center' });

    // Divider line
    doc.setDrawColor(216, 70, 147);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, 80, pageWidth / 2 + 60, 80);

    // "This certifies that"
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('This certifies that', pageWidth / 2, 95, { align: 'center' });

    // User name/email
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(userEmail, pageWidth / 2, 110, { align: 'center' });

    // Description
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully completed all exercises in', pageWidth / 2, 125, { align: 'center' });

    // Program name
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(216, 70, 147);
    doc.text("The Inventor's Playbook: A Cinematic Activation", pageWidth / 2, 138, { align: 'center' });

    // Date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(today, pageWidth / 2, 155, { align: 'center' });

    // Footer branding
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('lightmile media', pageWidth / 2 - 30, pageHeight - 35, { align: 'center' });
    doc.text('|', pageWidth / 2, pageHeight - 35, { align: 'center' });
    
    doc.setTextColor(216, 70, 147);
    doc.setFont('helvetica', 'bold');
    doc.text('eos Products', pageWidth / 2 + 30, pageHeight - 35, { align: 'center' });

    // Save
    doc.save('inventors-playbook-certificate.pdf');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-dark/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg mx-4 p-8 animate-scale-in bg-white text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-eos-lime mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h2 className="heading-lowercase text-3xl mb-2">certificate of completion</h2>
          <p className="text-muted-foreground">
            you have completed the inventor's playbook
          </p>
        </div>

        <div className="border border-border rounded-2xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-2">this certifies that</p>
          <p className="font-display text-xl mb-2">{userEmail}</p>
          <p className="text-sm text-muted-foreground mb-4">
            has successfully completed all exercises in
          </p>
          <p className="heading-lowercase text-lg text-eos-magenta">
            the inventor's playbook
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            a cinematic activation by lightmile media for eos Products
          </p>
        </div>

        <Button
          variant="eos"
          size="lg"
          onClick={handleDownloadPDF}
        >
          download certificate
        </Button>
      </div>
    </div>
  );
};
