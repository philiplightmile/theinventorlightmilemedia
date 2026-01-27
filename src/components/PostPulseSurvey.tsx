import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { Download, Sparkles } from 'lucide-react';

export const PostPulseSurvey: React.FC = () => {
  const [q1Score, setQ1Score] = useState(0);
  const [q2Score, setQ2Score] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7CD0E0', '#F4C7C3', '#6BCB77'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7CD0E0', '#F4C7C3', '#6BCB77'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleSubmit = async () => {
    if (q1Score === 0 || q2Score === 0) {
      toast({
        title: "Please rate both questions",
        description: "We need your feedback on both questions to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save survey
      const { error: surveyError } = await supabase
        .from('pulse_surveys')
        .insert({
          user_id: user?.id,
          type: 'post',
          q1_score: q1Score,
          q2_score: q2Score,
        });

      if (surveyError) throw surveyError;

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'modules_complete' })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      await refreshProfile();
      setIsComplete(true);
      triggerConfetti();
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-dark/90 backdrop-blur-sm">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-eos-blue/20 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-eos-blue" />
          </div>
          <h1 className="font-display text-5xl text-white mb-4">
            YOU ARE AN INVENTOR.
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Thank you for completing the playbook.
          </p>
          <Button variant="eos" size="xl" className="gap-2">
            <Download className="w-5 h-5" />
            Download Your Certificate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg mx-4 p-8 animate-scale-in">
        <h2 className="font-display text-2xl mb-2">One final thing.</h2>
        <p className="text-muted-foreground mb-8">
          Let us know how this experience has impacted you.
        </p>

        {/* Question 1 */}
        <div className="mb-8">
          <p className="font-medium mb-4">
            "After this experience, I feel better equipped to spot innovation opportunities."
          </p>
          <StarRating value={q1Score} onChange={setQ1Score} size="lg" />
        </div>

        {/* Question 2 */}
        <div className="mb-8">
          <p className="font-medium mb-4">
            "I feel a stronger sense of belonging with my team."
          </p>
          <StarRating value={q2Score} onChange={setQ2Score} size="lg" />
        </div>

        <Button
          variant="eos"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Complete The Experience'}
        </Button>
      </div>
    </div>
  );
};
