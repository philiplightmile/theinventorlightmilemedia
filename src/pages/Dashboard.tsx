import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from '@/components/ExerciseCard';
import { PrePulseSurvey } from '@/components/PrePulseSurvey';
import { PostPulseSurvey } from '@/components/PostPulseSurvey';
import { Header } from '@/components/Header';
import { PrivacyFooter } from '@/components/PrivacyFooter';
import { useAuth } from '@/contexts/AuthContext';

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

  const getExerciseStatus = (exerciseKey: string): 'locked' | 'available' | 'completed' => {
    if (modulesCompleted.includes(exerciseKey)) return 'completed';
    
    // Exercise 2 requires Exercise 1
    if (exerciseKey === 'makeover' && !modulesCompleted.includes('friction')) {
      return 'locked';
    }
    
    return 'available';
  };

  const handleExerciseClick = (exercise: string) => {
    navigate(`/exercise/${exercise}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-eos-magenta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">loading...</p>
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
      <Header variant="light" showUserControls showAdminLink />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Context Block */}
        <section className="mb-12 animate-fade-in max-w-5xl mx-auto text-center">
          <h2 className="heading-lowercase text-3xl mb-6">the architecture of beauty & innovation</h2>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
            <p>
              Before he invented the modern traffic signal, Garrett Morgan was a pioneer in the beauty industry. In the early 1900s, he invented and patented a chemical hair-straightening formula and a specialized pressing comb, building a self-funded safety empire from the ground up.
            </p>
            <p>
              Beyond his work in beauty, Garrett invented a life-saving safety hood in the 1910s. But when he tried to sell it, buyers refused to believe it worked based on his racial identity. He had to persevere against immense prejudice to see his product put into the world. This short film explores the obstacles this great American innovator had to overcome in order to become successful.
            </p>
            <p className="font-medium text-foreground">
              This Black History Month, we are looking at history through the lens of our own industry. Watch the story of a fellow beauty innovator.
            </p>
          </div>
        </section>

        {/* The Film */}
        <section className="mb-12 animate-fade-in">
          <div className="vimeo-container shadow-elevated">
            <iframe
              src="https://player.vimeo.com/video/683068367?h=&title=0&byline=0&portrait=0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="The Inventor"
            />
          </div>
          <p className="text-center text-muted-foreground mt-6 mx-auto text-lg">
            Now that you've watched the film, take a moment to send a thank-you note to a colleague whose hard work might be going unrecognized.
          </p>
        </section>

        {/* Single Action Card */}
        <section className="animate-slide-up max-w-5xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <div
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
            style={{ boxShadow: 'var(--shadow-soft)' }}
            onClick={() => handleExerciseClick('visibility')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-eos-mint/10">
                <Wifi className="w-6 h-6 text-eos-mint" />
              </div>
              <h3 className="heading-lowercase text-lg font-medium">recognize one of your colleagues</h3>
            </div>
            <Button variant="eos" className="shrink-0">
              send a note
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center pb-12">
          <p className="text-sm text-muted-foreground">
            © 2026 lightmile media. prepared for eos Products.
          </p>
        </footer>
      </main>

      {/* Privacy Footer */}
      <PrivacyFooter />
    </div>
  );
};

export default Dashboard;