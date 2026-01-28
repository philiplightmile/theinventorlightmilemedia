import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Users, CheckCircle, AlertTriangle, ArrowLeft, ShieldX, Download, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FrictionLog {
  id: string;
  struggle_1: string;
  struggle_2: string;
  struggle_3: string;
  created_at: string;
}

interface SeatInventory {
  total_seats: number;
  claimed_seats: number;
}

interface AccessCode {
  id: string;
  code: string;
  is_claimed: boolean;
  claimed_at: string | null;
}

interface SurveyAverage {
  type: string;
  avg_q1: number;
  avg_q2: number;
  avg_q3: number;
  avg_q4: number;
}

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [frictionLogs, setFrictionLogs] = useState<FrictionLog[]>([]);
  const [seatInventory, setSeatInventory] = useState<SeatInventory | null>(null);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [completionCount, setCompletionCount] = useState(0);
  const [surveyAverages, setSurveyAverages] = useState<{ pre: SurveyAverage | null; post: SurveyAverage | null }>({ pre: null, post: null });
  const [loading, setLoading] = useState(true);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check admin role via server-side RLS
  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    return data !== null;
  };

  const fetchData = async () => {
    // Fetch seat inventory (public read access)
    const { data: seats } = await supabase
      .from('seat_inventory')
      .select('*')
      .maybeSingle();
    
    if (seats) {
      setSeatInventory(seats);
    }

    // Fetch access codes - RLS will only return data if user is admin
    const { data: codes } = await supabase
      .from('access_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (codes) {
      setAccessCodes(codes);
    }

    // Fetch friction logs - RLS will only return data if user is admin
    const { data: logs, error: logsError } = await supabase
      .from('friction_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (logsError) {
      console.error('Error fetching friction logs:', logsError);
    } else if (logs) {
      setFrictionLogs(logs);
    }

    // Get completion count from profiles - RLS will protect this
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'modules_complete');
    
    if (countError) {
      console.error('Error fetching completion count:', countError);
    } else {
      setCompletionCount(count || 0);
    }

    // Fetch survey averages
    const { data: preSurveys } = await supabase
      .from('pulse_surveys')
      .select('q1_score, q2_score, q3_score, q4_score')
      .eq('type', 'pre');

    const { data: postSurveys } = await supabase
      .from('pulse_surveys')
      .select('q1_score, q2_score, q3_score, q4_score')
      .eq('type', 'post');

    if (preSurveys && preSurveys.length > 0) {
      const avg = {
        type: 'pre',
        avg_q1: preSurveys.reduce((sum, s) => sum + (s.q1_score || 0), 0) / preSurveys.length,
        avg_q2: preSurveys.reduce((sum, s) => sum + (s.q2_score || 0), 0) / preSurveys.length,
        avg_q3: preSurveys.reduce((sum, s) => sum + (s.q3_score || 0), 0) / preSurveys.length,
        avg_q4: preSurveys.reduce((sum, s) => sum + (s.q4_score || 0), 0) / preSurveys.length,
      };
      setSurveyAverages(prev => ({ ...prev, pre: avg }));
    }

    if (postSurveys && postSurveys.length > 0) {
      const avg = {
        type: 'post',
        avg_q1: postSurveys.reduce((sum, s) => sum + (s.q1_score || 0), 0) / postSurveys.length,
        avg_q2: postSurveys.reduce((sum, s) => sum + (s.q2_score || 0), 0) / postSurveys.length,
        avg_q3: postSurveys.reduce((sum, s) => sum + (s.q3_score || 0), 0) / postSurveys.length,
        avg_q4: postSurveys.reduce((sum, s) => sum + (s.q4_score || 0), 0) / postSurveys.length,
      };
      setSurveyAverages(prev => ({ ...prev, post: avg }));
    }
  };

  const handleGenerateCodes = async () => {
    setGeneratingCodes(true);
    try {
      const { data, error } = await supabase.rpc('generate_access_codes', { num_codes: 500 });
      
      if (error) throw error;
      
      toast({
        title: "codes generated!",
        description: `successfully generated ${data} new access codes.`,
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Error generating codes:', error);
      toast({
        title: "error",
        description: error.message || "failed to generate codes.",
        variant: "destructive",
      });
    } finally {
      setGeneratingCodes(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Code,Status,Claimed At\n"
      + accessCodes.map(c => `${c.code},${c.is_claimed ? 'Claimed' : 'Available'},${c.claimed_at || ''}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eos_access_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const initializeAdmin = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const hasAdminRole = await checkAdminRole(user.id);
      setIsAdmin(hasAdminRole);
      
      if (hasAdminRole) {
        await fetchData();
      }
      
      setLoading(false);
    };

    initializeAdmin();
  }, [user, authLoading]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="glass-card w-full max-w-md mx-4 p-8 text-center bg-white">
          <div className="w-16 h-16 rounded-2xl bg-eos-magenta/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-eos-magenta" />
          </div>
          <p className="text-muted-foreground">verifying access...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="glass-card w-full max-w-md mx-4 p-8 bg-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-eos-magenta/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-eos-magenta" />
            </div>
            <h1 className="heading-lowercase text-2xl">admin access required</h1>
            <p className="text-muted-foreground">please sign in with an admin account to access this dashboard.</p>
          </div>
          <Button variant="eos" size="lg" className="w-full" onClick={() => navigate('/')}>
            go to login
          </Button>
        </div>
      </div>
    );
  }

  // Show access denied if user is not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="glass-card w-full max-w-md mx-4 p-8 bg-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="heading-lowercase text-2xl">access denied</h1>
            <p className="text-muted-foreground">you don't have permission to access the admin dashboard.</p>
          </div>
          <Button variant="eos" size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
            return to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completionRate = seatInventory 
    ? Math.round((completionCount / seatInventory.claimed_seats) * 100) || 0
    : 0;

  const preAvg = surveyAverages.pre ? (surveyAverages.pre.avg_q1 + surveyAverages.pre.avg_q2 + surveyAverages.pre.avg_q3 + surveyAverages.pre.avg_q4) / 4 : 0;
  const postAvg = surveyAverages.post ? (surveyAverages.post.avg_q1 + surveyAverages.post.avg_q2 + surveyAverages.post.avg_q3 + surveyAverages.post.avg_q4) / 4 : 0;
  const delta = postAvg - preAvg;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            back to site
          </Button>
          <h1 className="heading-lowercase text-xl">admin dashboard</h1>
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Code Generation Section */}
        <section className="mb-12">
          <h2 className="heading-lowercase text-2xl mb-6">access code management</h2>
          <div className="glass-card p-6 flex flex-wrap items-center gap-4">
            <Button 
              variant="eos" 
              onClick={handleGenerateCodes}
              disabled={generatingCodes}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${generatingCodes ? 'animate-spin' : ''}`} />
              {generatingCodes ? 'generating...' : 'generate 500 codes'}
            </Button>
            <Button 
              variant="eos-outline" 
              onClick={handleExportCSV}
              disabled={accessCodes.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              export csv
            </Button>
            <span className="text-sm text-muted-foreground">
              {accessCodes.filter(c => !c.is_claimed).length} codes available / {accessCodes.length} total
            </span>
          </div>
        </section>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-eos-magenta/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-eos-magenta" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">seats claimed</p>
                <p className="font-display text-3xl">
                  {seatInventory?.claimed_seats || 0} / {seatInventory?.total_seats || 500}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-eos-mint/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-eos-mint" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">completion rate</p>
                <p className="font-display text-3xl">{completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-eos-lime flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">pulse delta</p>
                <p className="font-display text-3xl">
                  {delta > 0 ? '+' : ''}{delta.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delta Report */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-eos-lime flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="heading-lowercase text-2xl">pulse survey delta report</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-medium mb-4">pre-survey averages</h3>
              {surveyAverages.pre ? (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Q1:</span><span>{surveyAverages.pre.avg_q1.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q2:</span><span>{surveyAverages.pre.avg_q2.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q3:</span><span>{surveyAverages.pre.avg_q3.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q4:</span><span>{surveyAverages.pre.avg_q4.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
                    <span>overall:</span><span>{preAvg.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">no data yet</p>
              )}
            </div>

            <div className="glass-card p-6">
              <h3 className="font-medium mb-4">post-survey averages</h3>
              {surveyAverages.post ? (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Q1:</span><span>{surveyAverages.post.avg_q1.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q2:</span><span>{surveyAverages.post.avg_q2.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q3:</span><span>{surveyAverages.post.avg_q3.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Q4:</span><span>{surveyAverages.post.avg_q4.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
                    <span>overall:</span><span>{postAvg.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">no data yet</p>
              )}
            </div>
          </div>
        </section>

        {/* Friction Heatmap */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-eos-orange/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-eos-orange" />
            </div>
            <h2 className="heading-lowercase text-2xl">friction audit heatmap</h2>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">date</th>
                    <th className="text-left p-4 font-medium">friction point #1</th>
                    <th className="text-left p-4 font-medium">friction point #2</th>
                    <th className="text-left p-4 font-medium">friction point #3</th>
                  </tr>
                </thead>
                <tbody>
                  {frictionLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm">{log.struggle_1}</td>
                      <td className="p-4 text-sm">{log.struggle_2}</td>
                      <td className="p-4 text-sm">{log.struggle_3}</td>
                    </tr>
                  ))}
                  {frictionLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        no friction logs yet. data will appear as users complete exercise 1.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;