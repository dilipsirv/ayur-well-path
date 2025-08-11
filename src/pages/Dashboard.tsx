import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ClipboardList, Dumbbell, History, Salad, UserRound } from "lucide-react";

const sections = [
  { title: "Your Profile", desc: "Name, age, gender, contact, and health history.", icon: UserRound },
  { title: "Prakriti Analysis", desc: "Answer a quick questionnaire to learn your type.", icon: ClipboardList },
  { title: "Diet Chart", desc: "See recommendations tailored to your Prakriti.", icon: Salad },
  { title: "Daily Schedule", desc: "A routine with wake-up, exercise, meditation, meals.", icon: Dumbbell },
  { title: "Follow-ups", desc: "Set reminders and track progress over time.", icon: CalendarCheck },
  { title: "History", desc: "View previous analyses and improvements.", icon: History },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const connectNotice = () => navigate("/auth");

  return (
    <div className="container mx-auto px-6 py-10">
      <SEO title="Dashboard — AyurWell" description="Your Ayurveda dashboard: profile, Prakriti, diet, schedule, and follow-ups." canonical="/dashboard" />
      <h1 className="section-title mb-8">Your Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ title, desc, icon: Icon }) => (
          <Card key={title} className="group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                  <Icon className="text-primary" />
                </span>
                <CardTitle>{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{desc}</p>
              <Button variant="hero" onClick={connectNotice}>Sign in to continue</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
