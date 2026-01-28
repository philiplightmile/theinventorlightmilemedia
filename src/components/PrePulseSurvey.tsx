import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PrePulseSurveyProps {
  onComplete: () => void;
}

const questions = [
  "I feel empowered to fix broken or 'clunky' processes in my daily work.",
  "I feel that my behind-the-scenes contributions are seen and valued by the company.",
  "I actively look for ways to make our internal tools 'smoother' and better designed.",
  "I believe I can innovate and solve problems even when resources are limited.",
];

export const PrePulseSurvey: React.FC<PrePulseSurveyProps> = ({ onComplete }) => {
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const handleScoreChange = (questionIndex: number, score: number) => {
    const newScores = [...scores];
    newScores[questionIndex] = score;
    setScores(newScores);
  };

  const handleSubmit = async () => {
    if (scores.some(s => s === 0)) {
      toast({
        title: "please rate all questions",
        description: "we need your feedback on all questions to continue.",
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
          q1_score: scores[0],
          q2_score: scores[1],
          q3_score: scores[2],
          q4_score: scores[3],
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
        title: "error",
        description: "failed to submit survey. please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-dark/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg mx-4 p-8 animate-scale-in bg-white max-h-[90vh] overflow-y-auto">
        <h2 className="heading-lowercase text-2xl mb-2">first, a quick pulse check.</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          before we begin, help us understand your current experience at work. 
          this data is anonymous and helps us measure our culture.
        </p>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={index}>
              <p className="font-medium mb-4 text-sm">
                "{question}"
              </p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleScoreChange(index, score)}
                    className={`w-10 h-10 rounded-full border transition-all duration-200 text-sm font-medium
                      ${scores[index] === score 
                        ? 'bg-eos-lime border-border text-foreground scale-110' 
                        : 'bg-card border-border text-muted-foreground hover:border-eos-magenta'
                      }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                <span>strongly disagree</span>
                <span>strongly agree</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="eos"
          size="lg"
          className="w-full mt-8"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'submitting...' : 'unlock the experience'}
        </Button>
      </div>
    </div>
  );
};