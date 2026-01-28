import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        {/* Hero Section - The Film */}
        <section className="mb-12 animate-fade-in">
          <div className="vimeo-container shadow-elevated">
            <iframe
              src="https://player.vimeo.com/video/683068367?h=&title=0&byline=0&portrait=0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="The Inventor"
            />
          </div>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto heading-lowercase text-lg">
            garrett morgan self-funded the future. watch his story, then apply his mindset below.
          </p>
        </section>

        {/* Curriculum Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="heading-lowercase text-2xl mb-6 text-center">the curriculum</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ExerciseCard
              exercise="friction"
              exerciseNumber={1}
              status={getExerciseStatus('friction')}
              onClick={() => handleExerciseClick('friction')}
            />
            <ExerciseCard
              exercise="makeover"
              exerciseNumber={2}
              status={getExerciseStatus('makeover')}
              onClick={() => handleExerciseClick('makeover')}
            />
            <ExerciseCard
              exercise="visibility"
              exerciseNumber={3}
              status={getExerciseStatus('visibility')}
              onClick={() => handleExerciseClick('visibility')}
            />
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