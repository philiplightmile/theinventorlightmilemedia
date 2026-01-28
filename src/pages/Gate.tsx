import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-inventor.jpg';

const Gate: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateAccessCode = (code: string): boolean => {
    // Simple validation - starts with EOS-
    return code.toUpperCase().startsWith('EOS-') && code.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!validateAccessCode(accessCode)) {
          toast({
            title: "invalid access code",
            description: "please enter a valid access code (e.g., EOS-XXXX)",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, accessCode);
        if (error) {
          toast({
            title: "registration failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "welcome to the playbook",
            description: "your seat has been claimed. let's begin!",
          });
          navigate('/dashboard');
        }
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

      {/* Logos - High contrast on dark background */}
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

          <div>
            <label className="block text-sm font-medium mb-2">password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-full"
            />
          </div>

          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium mb-2">access code</label>
              <Input
                type="text"
                placeholder="ex: EOS-XXXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 rounded-full uppercase"
              />
            </div>
          )}

          <Button
            type="submit"
            variant="eos"
            size="lg"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'please wait...' : isLogin ? 'enter the playbook' : 'claim your seat'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "don't have access? register here" : "already registered? sign in"}
          </button>
        </div>

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