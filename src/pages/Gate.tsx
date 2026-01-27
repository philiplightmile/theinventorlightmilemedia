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
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!validateAccessCode(accessCode)) {
          toast({
            title: "Invalid Access Code",
            description: "Please enter a valid access code (e.g., EOS-INNOVATE-2026)",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, accessCode);
        if (error) {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome to The Playbook",
            description: "Your seat has been claimed. Let's begin!",
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

      {/* Logos */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <span className="text-white/80 text-sm font-medium tracking-wider">LIGHTMILE MEDIA</span>
        <span className="text-white/40">|</span>
        <span className="text-eos-blue text-sm font-bold tracking-wider">EOS</span>
      </div>

      {/* Login Card */}
      <div className="glass-card w-full max-w-md mx-4 p-8 z-10 animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-2">THE EVOLUTION OF INNOVATION</h1>
          <p className="text-muted-foreground">
            A Cinematic Activation for Black History Month.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium mb-2">Access Code</label>
              <Input
                type="text"
                placeholder="ex: EOS-INNOVATE-2026"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 rounded-xl uppercase"
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
            {isLoading ? 'Please wait...' : isLogin ? 'Enter The Playbook' : 'Claim Your Seat'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have access? Register here" : "Already registered? Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Lightmile Media. Prepared for EOS Products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gate;
