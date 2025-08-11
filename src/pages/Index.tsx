import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarCheck, ClipboardList, Dumbbell, Salad, Shield, Sparkles } from "lucide-react";
import heroImage from "@/assets/ayurwell-hero.jpg";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import AmbientGlow from "@/components/AmbientGlow";

const features = [
  { title: "User Profile", desc: "Create and manage your health profile.", icon: Shield },
  { title: "Prakriti Analysis", desc: "Discover your Vata, Pitta, or Kapha.", icon: ClipboardList },
  { title: "Diet Chart", desc: "Personalized diet for your Prakriti.", icon: Salad },
  { title: "Daily Schedule", desc: "Routine for balance and vitality.", icon: Dumbbell },
  { title: "Follow-ups", desc: "Set reminders and track progress.", icon: CalendarCheck },
  { title: "Admin Panel", desc: "Manage users and follow-ups.", icon: Sparkles },
];

const Index = () => {
  return (
    <div>
      <SEO title="AyurWell — Ayurveda Health Guidance" description="Personalized Ayurveda guidance: profile, Prakriti test, diet chart, daily schedule, and follow-ups." canonical="/" />
      <AmbientGlow />
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="section-title mb-4">AyurWell — Ayurveda-based Health Guidance</h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              Understand your Prakriti and receive tailored diet plans and daily routines, grounded in classical Ayurveda.
            </p>
            <div className="flex items-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/dashboard">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admin">Admin Panel</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src={heroImage} alt="Ayurveda herbs and spices representing AyurWell guidance" className="rounded-lg border border-border shadow" loading="eager" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <h2 className="section-title text-center mb-10">Everything you need for balanced wellness</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, desc, icon: Icon }) => (
            <Card key={title} className="group hover:translate-y-[-2px] transition-transform duration-300">
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
                <Button asChild variant="link" className="px-0">
                  <Link to={title === 'Admin Panel' ? '/admin' : '/dashboard'} className="inline-flex items-center gap-1">
                    Learn more <ArrowRight className="inline-block" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
