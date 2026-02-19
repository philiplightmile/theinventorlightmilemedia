import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-inventor.jpg';

const ALLOWED_EMAILS = ['philip@lightmilemedia.com'];
const ALLOWED_DOMAINS = ['evolutionofsmooth.com'];

const isEmailAllowed = (email: string): boolean => {
  const lower = email.toLowerCase().trim();
  if (ALLOWED_EMAILS.includes(lower)) return true;
  const domain = lower.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
};

const Gate: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "name required",
        description: "please enter your first and last name",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailAllowed(email)) {
      toast({
        title: "access restricted",
        description: "this experience is limited to authorized email addresses",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signInWithMagicLink(email, firstName.trim(), lastName.trim());
      if (error) {
        toast({
          title: "something went wrong",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 cinema-overlay" />

      {/* Logos */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <span className="text-white text-sm font-medium tracking-wider">lightmile media</span>
        <span className="text-white/40">|</span>
        <span className="text-eos-magenta text-sm font-bold tracking-wider drop-shadow-lg">eos Products</span>
      </div>

      {/* Privacy Footer */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <p className="text-center text-xs text-white/50">
          All responses are anonymized to ensure open, honest feedback.
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-card w-full max-w-md mx-4 p-8 z-10 animate-scale-in bg-white">
        <div className="text-center mb-8">
          <h1 className="heading-lowercase text-3xl mb-2">the beauty of innovation</h1>
          <p className="text-muted-foreground">
            a cinematic activation for eos Products
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">first name</label>
                <Input
                  type="text"
                  placeholder="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-12 rounded-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">last name</label>
                <Input
                  type="text"
                  placeholder="last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="h-12 rounded-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-full"
              />
            </div>

            <Button
              type="submit"
              variant="eos"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'please wait...' : 'enter the playbook'}
            </Button>
          </form>

        <div className="mt-8 pt-6 border-t border-border text-center space-y-2">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-eos-magenta transition-colors"
            onClick={() => navigate('/admin-dashboard')}
          >
            admin access →
          </button>
          <p className="text-xs text-muted-foreground">
            © 2026 lightmile media. prepared for eos Products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gate;
