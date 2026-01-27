import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PrePulseSurveyProps {
  onComplete: () => void;
}

export const PrePulseSurvey: React.FC<PrePulseSurveyProps> = ({ onComplete }) => {
  const [q1Score, setQ1Score] = useState(0);
  const [q2Score, setQ2Score] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (q1Score === 0 || q2Score === 0) {
      toast({
        title: "Please rate both questions",
        description: "We need your feedback on both questions to continue.",
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
          type: 'pre',
          q1_score: q1Score,
          q2_score: q2Score,
        });

      if (surveyError) throw surveyError;

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'survey_complete' })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      await refreshProfile();
      onComplete();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg mx-4 p-8 animate-scale-in">
        <h2 className="font-display text-2xl mb-2">First, a quick pulse check.</h2>
        <p className="text-muted-foreground mb-8">
          Before we begin, help us understand your current experience at work. 
          This data is anonymous and helps us measure our culture.
        </p>

        {/* Question 1 */}
        <div className="mb-8">
          <p className="font-medium mb-4">
            "I feel empowered to identify and fix broken processes in my daily workflow."
          </p>
          <StarRating value={q1Score} onChange={setQ1Score} size="lg" />
        </div>

        {/* Question 2 */}
        <div className="mb-8">
          <p className="font-medium mb-4">
            "I feel that my behind-the-scenes contributions are visible and valued."
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
          {isSubmitting ? 'Submitting...' : 'Unlock The Experience'}
        </Button>
      </div>
    </div>
  );
};
