import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'light' | 'dark';
  showUserControls?: boolean;
  showAdminLink?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  variant = 'light',
  showUserControls = false,
  showAdminLink = false,
}) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isDark = variant === 'dark';
  const completedCount = profile?.modules_completed?.length || 0;

  return (
    <header className={cn(
      "sticky top-0 z-40 border-b backdrop-blur-lg",
      isDark 
        ? "border-white/10 bg-transparent" 
        : "border-border bg-background/80"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Lockup - Clickable */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <h1 className={cn(
            "heading-lowercase text-xl",
            isDark ? "text-white" : "text-foreground"
          )}>
            the inventor's playbook
          </h1>
          <span className={cn(
            "text-sm",
            isDark ? "text-white/40" : "text-muted-foreground"
          )}>|</span>
          <span className={cn(
            "text-sm font-bold tracking-wider",
            isDark ? "text-eos-magenta" : "text-eos-magenta"
          )}>
            eos Products
          </span>
        </Link>

        {/* Right Side Controls */}
        {showUserControls && (
          <div className="flex items-center gap-4">
            <div className="progress-pill">
              <span>progress: {completedCount}/3 exercises</span>
            </div>
            
            <div className="flex items-center gap-2">
              {showAdminLink && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/admin-dashboard')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              )}
              <div className="w-10 h-10 rounded-full bg-eos-magenta/20 flex items-center justify-center">
                <User className="w-5 h-5 text-eos-magenta" />
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
