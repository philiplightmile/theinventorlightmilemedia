import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Users, CheckCircle, AlertTriangle, ArrowLeft, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [frictionLogs, setFrictionLogs] = useState<FrictionLog[]>([]);
  const [seatInventory, setSeatInventory] = useState<SeatInventory | null>(null);
  const [completionCount, setCompletionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div className="glass-card w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-eos-blue/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-eos-blue" />
          </div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="glass-card w-full max-w-md mx-4 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-eos-blue/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-eos-blue" />
            </div>
            <h1 className="font-display text-2xl">Admin Access Required</h1>
            <p className="text-muted-foreground">Please sign in with an admin account to access this dashboard.</p>
          </div>
          <Button variant="eos" size="lg" className="w-full" onClick={() => navigate('/')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Show access denied if user is not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="glass-card w-full max-w-md mx-4 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
          </div>
          <Button variant="eos" size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completionRate = seatInventory 
    ? Math.round((completionCount / seatInventory.claimed_seats) * 100) || 0
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Button>
          <h1 className="font-display text-xl">Admin Dashboard</h1>
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-eos-blue/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-eos-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seats Claimed</p>
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
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="font-display text-3xl">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Friction Heatmap */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-eos-orange/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-eos-orange" />
            </div>
            <h2 className="font-display text-2xl">Friction Audit Heatmap</h2>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Friction Point #1</th>
                    <th className="text-left p-4 font-medium">Friction Point #2</th>
                    <th className="text-left p-4 font-medium">Friction Point #3</th>
                  </tr>
                </thead>
                <tbody>
                  {frictionLogs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
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
                        No friction logs yet. Data will appear as users complete Module 1.
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
