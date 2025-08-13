import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cleanupAuthState } from "@/utils/auth";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect on explicit sign-in to avoid loops from stale sessions
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean up any existing state and attempt a global sign-out
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in! Redirecting...");
        window.location.href = "/dashboard";
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your sign-up.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <SEO
        title="Sign in — AyurWell"
        description="Log in or create your AyurWell account."
        canonical="/auth"
      />
      <h1 className="section-title mb-6">Sign in to AyurWell</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="hero" disabled={loading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create account" : "Have an account? Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
