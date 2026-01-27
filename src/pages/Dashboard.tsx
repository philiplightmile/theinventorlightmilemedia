import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModuleCard } from '@/components/ModuleCard';
import { PrePulseSurvey } from '@/components/PrePulseSurvey';
import { PostPulseSurvey } from '@/components/PostPulseSurvey';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/hero-inventor.jpg';

const Dashboard: React.FC = () => {
  const { user, profile, signOut, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [showPrePulse, setShowPrePulse] = useState(false);
  const [showPostPulse, setShowPostPulse] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Show pre-pulse survey if user just started
    if (profile?.status === 'started') {
      setShowPrePulse(true);
    }
  }, [profile?.status]);

  const handlePrePulseComplete = () => {
    setShowPrePulse(false);
    refreshProfile();
  };

  const modulesCompleted = profile?.modules_completed || [];
  const completedCount = modulesCompleted.length;
  const allModulesComplete = completedCount === 3;

  // Check if we should show post-pulse
  useEffect(() => {
    if (allModulesComplete && profile?.status === 'survey_complete') {
      setShowPostPulse(true);
    }
  }, [allModulesComplete, profile?.status]);

  const getModuleStatus = (moduleKey: string): 'locked' | 'available' | 'completed' => {
    if (modulesCompleted.includes(moduleKey)) return 'completed';
    
    // Module 2 requires Module 1
    if (moduleKey === 'makeover' && !modulesCompleted.includes('friction')) {
      return 'locked';
    }
    
    return 'available';
  };

  const handleModuleClick = (module: string) => {
    navigate(`/module/${module}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-eos-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Pre-Pulse Survey Modal */}
      {showPrePulse && <PrePulseSurvey onComplete={handlePrePulseComplete} />}
      
      {/* Post-Pulse Survey Modal */}
      {showPostPulse && <PostPulseSurvey />}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl">The Inventor's Playbook</h1>
          
          <div className="flex items-center gap-4">
            <div className="progress-pill">
              <span>Progress: {completedCount}/3 Modules</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-eos-blue/20 flex items-center justify-center">
                <User className="w-5 h-5 text-eos-blue" />
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - The Film */}
        <section className="mb-12 animate-fade-in">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-cinema-dark shadow-elevated">
            <img 
              src={heroImage} 
              alt="The Inventor" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-eos-blue/90 flex items-center justify-center mb-6 cursor-pointer hover:scale-110 transition-transform shadow-glow-blue">
                <Play className="w-8 h-8 text-foreground ml-1" />
              </div>
              <h2 className="font-display text-4xl text-white mb-2">THE INVENTOR</h2>
              <p className="text-white/70">Watch the Film (15 Min)</p>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            Garrett Morgan self-funded the future. Watch his story, then apply his mindset below.
          </p>
        </section>

        {/* Curriculum Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-display text-2xl mb-6 text-center">The Curriculum</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ModuleCard
              module="friction"
              status={getModuleStatus('friction')}
              onClick={() => handleModuleClick('friction')}
            />
            <ModuleCard
              module="makeover"
              status={getModuleStatus('makeover')}
              onClick={() => handleModuleClick('makeover')}
            />
            <ModuleCard
              module="visibility"
              status={getModuleStatus('visibility')}
              onClick={() => handleModuleClick('visibility')}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
