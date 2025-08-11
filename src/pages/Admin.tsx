import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const connectNotice = () => navigate("/auth");

  return (
    <div className="container mx-auto px-6 py-10">
      <SEO title="Admin Panel — AyurWell" description="Secure admin panel to manage users, follow-ups, and stats." canonical="/admin" />
      <h1 className="section-title mb-6">Admin Panel</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sign in as admin to view, edit, or delete user data and manage follow-ups.
            </p>
            <Button variant="hero" onClick={connectNotice}>Sign in as Admin</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>User count</li>
              <li>Recent follow-ups</li>
              <li>Prakriti distribution</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
