import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Pencil, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const moduleContent = {
  friction: {
    icon: AlertTriangle,
    title: 'THE FRICTION AUDIT',
    contextHeadline: 'Garrett Morgan saw danger where others saw the status quo.',
    contextBody: 'He refused to tolerate the "daily hazards" of his time. Innovation starts with noticing what is broken. What "tolerated struggles" do you deal with every day?',
    instruction: 'Log 3 minor inefficiencies or broken processes you encounter this week.',
    iconColor: 'text-eos-orange',
    bgColor: 'bg-eos-orange/10',
  },
  makeover: {
    icon: Pencil,
    title: 'THE MUNDANE MAKEOVER',
    contextHeadline: 'Adoption requires good design.',
    contextBody: 'Morgan understood that safety had to be wearable to be effective. At EOS, we believe "Smooth" applies to our internal tools, not just our lip balm.',
    instruction: 'Pick one "ugly" internal asset (a confusing spreadsheet, a messy form) and describe how you would redesign it using EOS Brand Principles.',
    iconColor: 'text-eos-blue',
    bgColor: 'bg-eos-blue/10',
  },
  visibility: {
    icon: Wifi,
    title: 'THE VISIBILITY SIGNAL',
    contextHeadline: 'Making the Invisible Visible.',
    contextBody: 'Garrett Morgan was often erased from his own narrative. Today, we break that cycle by acknowledging the "quiet work" that keeps EOS running.',
    instruction: 'Identify one colleague in a support role (Ops, QA, Admin) and send a signal of appreciation.',
    iconColor: 'text-eos-mint',
    bgColor: 'bg-eos-mint/10',
  },
};

const Module: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  // Form state for each module
  const [friction1, setFriction1] = useState('');
  const [friction2, setFriction2] = useState('');
  const [friction3, setFriction3] = useState('');
  const [makeoverText, setMakeoverText] = useState('');
  const [colleagueName, setColleagueName] = useState('');
  const [impactNote, setImpactNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = moduleContent[moduleId as keyof typeof moduleContent];
  
  if (!content) {
    navigate('/dashboard');
    return null;
  }

  const Icon = content.icon;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (moduleId === 'friction') {
        if (!friction1 || !friction2 || !friction3) {
          toast({
            title: "Please complete all fields",
            description: "We need all 3 friction points to continue.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('friction_logs')
          .insert({
            user_id: user?.id,
            struggle_1: friction1,
            struggle_2: friction2,
            struggle_3: friction3,
          });

        if (error) throw error;

      } else if (moduleId === 'makeover') {
        if (!makeoverText.trim()) {
          toast({
            title: "Please describe your redesign",
            description: "We need your design ideas to continue.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('mundane_makeover')
          .insert({
            user_id: user?.id,
            redesign_description: makeoverText,
          });

        if (error) throw error;

      } else if (moduleId === 'visibility') {
        if (!colleagueName.trim() || !impactNote.trim()) {
          toast({
            title: "Please complete all fields",
            description: "We need both the colleague name and your appreciation note.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('visibility_signals')
          .insert({
            user_id: user?.id,
            colleague_name: colleagueName,
            impact_note: impactNote,
          });

        if (error) throw error;

        toast({
          title: "Signal Sent! 📡",
          description: `Your appreciation for ${colleagueName} has been recorded.`,
        });
      }

      // Update profile with completed module
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('modules_completed')
        .eq('user_id', user?.id)
        .single();

      const currentModules = currentProfile?.modules_completed || [];
      if (!currentModules.includes(moduleId!)) {
        await supabase
          .from('profiles')
          .update({ 
            modules_completed: [...currentModules, moduleId] 
          })
          .eq('user_id', user?.id);
      }

      await refreshProfile();
      
      toast({
        title: "Module Complete!",
        description: "Great work! Your response has been saved.",
      });
      
      navigate('/dashboard');

    } catch (error) {
      console.error('Error submitting module:', error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Module Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className={`w-20 h-20 rounded-3xl ${content.bgColor} flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-10 h-10 ${content.iconColor}`} />
          </div>
          <h1 className="font-display text-3xl">{content.title}</h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
          {/* Context Panel */}
          <div className="glass-card p-8">
            <h2 className="font-display text-2xl mb-4">{content.contextHeadline}</h2>
            <p className="text-muted-foreground leading-relaxed">{content.contextBody}</p>
          </div>

          {/* Activity Panel */}
          <div className="glass-card p-8">
            <p className="font-medium mb-6">{content.instruction}</p>

            {moduleId === 'friction' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Friction Point #1</label>
                  <Textarea
                    placeholder="Describe the first inefficiency..."
                    value={friction1}
                    onChange={(e) => setFriction1(e.target.value)}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Friction Point #2</label>
                  <Textarea
                    placeholder="Describe the second inefficiency..."
                    value={friction2}
                    onChange={(e) => setFriction2(e.target.value)}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Friction Point #3</label>
                  <Textarea
                    placeholder="Describe the third inefficiency..."
                    value={friction3}
                    onChange={(e) => setFriction3(e.target.value)}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>
              </div>
            )}

            {moduleId === 'makeover' && (
              <div>
                <Textarea
                  placeholder="I would redesign the weekly inventory sheet by..."
                  value={makeoverText}
                  onChange={(e) => setMakeoverText(e.target.value)}
                  className="min-h-[200px] rounded-xl"
                />
              </div>
            )}

            {moduleId === 'visibility' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Colleague Name</label>
                  <Input
                    placeholder="Enter their name"
                    value={colleagueName}
                    onChange={(e) => setColleagueName(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Impact Note</label>
                  <Textarea
                    placeholder="Thank you for always handling the..."
                    value={impactNote}
                    onChange={(e) => setImpactNote(e.target.value)}
                    className="min-h-[120px] rounded-xl"
                  />
                </div>
              </div>
            )}

            <Button
              variant="eos"
              size="lg"
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 
                moduleId === 'friction' ? 'Submit to Heatmap' :
                moduleId === 'makeover' ? 'Draft Design' :
                'Send Signal'
              }
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Module;
