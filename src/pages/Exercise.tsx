import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Pencil, Wifi, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PrivacyFooter } from '@/components/PrivacyFooter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const exerciseContent = {
  friction: {
    icon: AlertTriangle,
    title: 'the friction audit',
    contextHeadline: 'garrett morgan saw danger where others saw the status quo.',
    contextBody: 'He refused to tolerate the "daily hazards" of his time. Innovation starts with noticing what is broken. What "tolerated struggles" do you deal with every day?',
    instruction: 'log 3 minor inefficiencies or broken processes you encounter this week.',
    iconColor: 'text-eos-orange',
    bgColor: 'bg-eos-orange/10',
  },
  makeover: {
    icon: Pencil,
    title: 'the mundane makeover',
    contextHeadline: 'adoption requires good design.',
    contextBody: 'Morgan understood that safety had to be wearable to be effective. At eos Products, we believe "smooth" applies to our internal tools, not just our lip balm.',
    instruction: 'pick one "ugly" internal asset and describe how you would redesign it using eos brand principles.',
    iconColor: 'text-eos-magenta',
    bgColor: 'bg-eos-magenta/10',
  },
  visibility: {
    icon: Wifi,
    title: 'the visibility signal',
    contextHeadline: 'making the invisible visible.',
    contextBody: 'Garrett Morgan was often erased from his own narrative. Today, we break that cycle by acknowledging the "quiet work" that keeps eos running.',
    instruction: 'identify one colleague in a support role (ops, qa, admin) and send a signal of appreciation.',
    iconColor: 'text-eos-mint',
    bgColor: 'bg-eos-mint/10',
  },
};

const categoryOptions = [
  'Process Complexity',
  'Digital Enablement',
  'Cross-Functional Flow',
  'Knowledge Access',
  'Resource Alignment',
];

const categoryPlaceholders: Record<string, string> = {
  'Process Complexity': 'Where does the workflow feel heavier or slower than it needs to be?',
  'Digital Enablement': 'How is the tool fighting against the task? Describe the friction.',
  'Cross-Functional Flow': 'Where does momentum drop when work moves from one team to another?',
  'Knowledge Access': 'What specific information or data is difficult to locate?',
  'Resource Alignment': 'Where is the volume of work outpacing our capacity to deliver?',
};

const getPlaceholder = (category: string) => {
  return categoryPlaceholders[category] || 'Describe the operational struggle...';
};

const assetOptions = ['Spreadsheet', 'Form', 'Email', 'Meeting'];
const tagOptions = ['simpler', 'smoother', 'more beautiful'];

const Exercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  // Form state for friction
  const [frictionCategory1, setFrictionCategory1] = useState('');
  const [friction1, setFriction1] = useState('');
  const [frictionCategory2, setFrictionCategory2] = useState('');
  const [friction2, setFriction2] = useState('');
  const [frictionCategory3, setFrictionCategory3] = useState('');
  const [friction3, setFriction3] = useState('');
  
  // Form state for makeover
  const [assetType, setAssetType] = useState('');
  const [makeoverText, setMakeoverText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Form state for visibility
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('a signal of appreciation');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = exerciseContent[exerciseId as keyof typeof exerciseContent];
  
  if (!content) {
    navigate('/dashboard');
    return null;
  }

  const Icon = content.icon;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (exerciseId === 'friction') {
        if (!friction1 || !friction2 || !friction3) {
          toast({
            title: "please complete all fields",
            description: "we need all 3 friction points to continue.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('friction_logs')
          .insert({
            user_id: user?.id,
            struggle_1: `[${frictionCategory1}] ${friction1}`,
            struggle_2: `[${frictionCategory2}] ${friction2}`,
            struggle_3: `[${frictionCategory3}] ${friction3}`,
          });

        if (error) throw error;

      } else if (exerciseId === 'makeover') {
        if (!makeoverText.trim() || !assetType) {
          toast({
            title: "please complete all fields",
            description: "we need your asset type and design ideas to continue.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const tagsStr = selectedTags.length > 0 ? ` [Tags: ${selectedTags.join(', ')}]` : '';
        const { error } = await supabase
          .from('mundane_makeover')
          .insert({
            user_id: user?.id,
            redesign_description: `[${assetType}] ${makeoverText}${tagsStr}`,
          });

        if (error) throw error;

      } else if (exerciseId === 'visibility') {
        if (!recipientEmail.trim() || !message.trim()) {
          toast({
            title: "please complete all fields",
            description: "we need the recipient email and your message.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('visibility_signals')
          .insert({
            user_id: user?.id,
            colleague_name: recipientEmail,
            impact_note: `Subject: ${subject}\n\n${message}`,
          });

        if (error) throw error;

        // Mock email send
        console.log('📧 Signal sent!', {
          to: recipientEmail,
          subject: subject,
          message: message,
        });

        toast({
          title: "signal sent! 📡",
          description: `your appreciation for ${recipientEmail} has been recorded.`,
        });
      }

      // Update profile with completed exercise
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('modules_completed')
        .eq('user_id', user?.id)
        .single();

      const currentModules = currentProfile?.modules_completed || [];
      if (!currentModules.includes(exerciseId!)) {
        await supabase
          .from('profiles')
          .update({ 
            modules_completed: [...currentModules, exerciseId] 
          })
          .eq('user_id', user?.id);
      }

      await refreshProfile();
      
      toast({
        title: "exercise complete!",
        description: "great work! your response has been saved.",
      });
      
      navigate('/dashboard');

    } catch (error) {
      console.error('Error submitting exercise:', error);
      toast({
        title: "error",
        description: "failed to submit. please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            back to dashboard
          </Button>
          
          {/* Logo Lockup */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm font-bold tracking-wider text-eos-magenta">
              eos Products
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Exercise Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className={`w-20 h-20 rounded-3xl ${content.bgColor} flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-10 h-10 ${content.iconColor}`} />
          </div>
          <h1 className="heading-lowercase text-3xl">{content.title}</h1>
        </div>

        {/* Two Column Layout (or split for visibility) */}
        <div className={cn(
          "gap-8 animate-slide-up",
          exerciseId === 'visibility' ? 'grid lg:grid-cols-2' : 'grid lg:grid-cols-2'
        )}>
          {/* Context Panel */}
          <div className="glass-card p-8">
            <h2 className="heading-lowercase text-2xl mb-4">{content.contextHeadline}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{content.contextBody}</p>
            <p className="font-medium text-sm border-l-2 border-eos-magenta pl-4">{content.instruction}</p>
          </div>

          {/* Activity Panel */}
          <div className="glass-card p-8">
            {exerciseId === 'friction' && (
              <div className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num}>
                    <label className="block text-sm font-medium mb-2">friction point #{num}</label>
                    <Select 
                      value={num === 1 ? frictionCategory1 : num === 2 ? frictionCategory2 : frictionCategory3}
                      onValueChange={(val) => {
                        if (num === 1) setFrictionCategory1(val);
                        else if (num === 2) setFrictionCategory2(val);
                        else setFrictionCategory3(val);
                      }}
                    >
                      <SelectTrigger className="mb-2 rounded-full">
                        <SelectValue placeholder="select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        {categoryOptions.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder={getPlaceholder(num === 1 ? frictionCategory1 : num === 2 ? frictionCategory2 : frictionCategory3)}
                      value={num === 1 ? friction1 : num === 2 ? friction2 : friction3}
                      onChange={(e) => {
                        if (num === 1) setFriction1(e.target.value);
                        else if (num === 2) setFriction2(e.target.value);
                        else setFriction3(e.target.value);
                      }}
                      className="min-h-[80px] rounded-2xl border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {exerciseId === 'makeover' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">asset type</label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="select asset type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      {assetOptions.map(asset => (
                        <SelectItem key={asset} value={asset}>{asset.toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">the fix</label>
                  <Textarea
                    placeholder="i would redesign this by..."
                    value={makeoverText}
                    onChange={(e) => setMakeoverText(e.target.value)}
                    className="min-h-[150px] rounded-2xl border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">design principles applied</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn('tag-pill', selectedTags.includes(tag) && 'active')}
                      >
                        [{tag}]
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {exerciseId === 'visibility' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">to (email)</label>
                  <Input
                    type="email"
                    placeholder="colleague@eos.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">subject</label>
                  <Input
                    placeholder="a signal of appreciation"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">message</label>
                  <Textarea
                    placeholder="thank you for always handling the..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] rounded-2xl border-border"
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
              {isSubmitting ? 'submitting...' : 
                exerciseId === 'friction' ? 'submit to heatmap' :
                exerciseId === 'makeover' ? 'draft design' :
                'send signal'
              }
            </Button>
          </div>

          {/* Preview Panel for Visibility */}
          {exerciseId === 'visibility' && (
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h3 className="heading-lowercase text-lg mb-4">preview</h3>
                <div className="bg-muted rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-eos-magenta/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-eos-magenta" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{recipientEmail || 'recipient@eos.com'}</p>
                      <p className="text-xs text-muted-foreground">{subject}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm whitespace-pre-wrap">{message || 'your appreciation message will appear here...'}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">sent with</span>
                    <span className="text-xs font-semibold text-eos-magenta">eos Products ✨</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Privacy Footer */}
      <PrivacyFooter />
    </div>
  );
};

export default Exercise;