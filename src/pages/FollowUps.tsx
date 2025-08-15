import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Calendar, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface FollowUp {
  id: string;
  reminder_date: string;
  feedback: string;
  progress_notes: string;
  created_at: string;
}

const FollowUps = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    reminder_date: '',
    feedback: '',
    progress_notes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFollowUps();
  }, [user]);

  const fetchFollowUps = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('follow_ups')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_date', { ascending: false });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      toast({
        title: "Error",
        description: "Failed to load follow-ups.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('follow_ups')
        .insert({
          user_id: user.id,
          reminder_date: newFollowUp.reminder_date,
          feedback: newFollowUp.feedback,
          progress_notes: newFollowUp.progress_notes
        });

      if (error) throw error;

      toast({
        title: "Follow-up Added",
        description: "Your follow-up has been saved successfully.",
      });

      setNewFollowUp({ reminder_date: '', feedback: '', progress_notes: '' });
      setShowForm(false);
      fetchFollowUps();
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to save follow-up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('follow_ups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Follow-up Deleted",
        description: "Follow-up has been removed successfully.",
      });

      fetchFollowUps();
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to delete follow-up.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Follow-ups — AyurWell" description="Track your Ayurveda journey with personalized follow-ups and progress notes." canonical="/follow-ups" />
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="section-title">Follow-ups & Progress</h1>
          <p className="text-muted-foreground">Track your wellness journey and set reminders</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reminder_date">Reminder Date</Label>
                <Input
                  id="reminder_date"
                  type="date"
                  value={newFollowUp.reminder_date}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, reminder_date: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="feedback">Feedback & Observations</Label>
                <Textarea
                  id="feedback"
                  value={newFollowUp.feedback}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="How are you feeling? Any changes in energy, sleep, digestion, etc.?"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="progress_notes">Progress Notes</Label>
                <Textarea
                  id="progress_notes"
                  value={newFollowUp.progress_notes}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, progress_notes: e.target.value }))}
                  placeholder="What practices are you following? Any challenges or successes?"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Follow-up'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {followUps.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Follow-ups Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start tracking your wellness journey by adding your first follow-up. 
                Record your observations, progress, and set reminders for future check-ins.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Follow-up
              </Button>
            </CardContent>
          </Card>
        ) : (
          followUps.map((followUp) => (
            <Card key={followUp.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {followUp.reminder_date ? format(new Date(followUp.reminder_date), 'PPP') : 'No date set'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(followUp.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Added on {format(new Date(followUp.created_at), 'PPP')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {followUp.feedback && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      Feedback & Observations
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {followUp.feedback}
                    </p>
                  </div>
                )}
                
                {followUp.progress_notes && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      Progress Notes
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {followUp.progress_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowUps;