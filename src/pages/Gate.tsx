import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-inventor.jpg';

const Gate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnter = async () => {
    setIsLoading(true);
    try {
      // Record the page view
      await supabase.from('page_views').insert({});
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
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
          Copyright 2026 Lightmile Media LLC.
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

        <Button
          variant="eos"
          size="lg"
          className="w-full"
          disabled={isLoading}
          onClick={handleEnter}
        >
          {isLoading ? 'please wait...' : 'enter the playbook'}
        </Button>

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
