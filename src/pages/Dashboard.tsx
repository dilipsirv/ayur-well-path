import { SEO } from "@/components/SEO";
import { CalendarCheck, ClipboardList, Dumbbell, History, Salad, UserRound } from "lucide-react";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { useToast } from "@/hooks/use-toast";

const sections = [
  { title: "Your Profile", desc: "Manage your personal information, health history, and preferences.", icon: UserRound },
  { title: "Prakriti Analysis", desc: "Discover your Ayurvedic constitution through our detailed questionnaire.", icon: ClipboardList },
  { title: "Diet Chart", desc: "Get personalized nutrition recommendations based on your Prakriti.", icon: Salad },
  { title: "Daily Schedule", desc: "Follow a balanced routine for optimal health and wellness.", icon: Dumbbell },
  { title: "Follow-ups", desc: "Track your progress and set health reminders.", icon: CalendarCheck },
  { title: "History", desc: "Review your past analyses and health journey.", icon: History },
];

const Dashboard = () => {
  const { toast } = useToast();

  const handleSectionClick = (title: string) => {
    toast({
      title: "Coming Soon",
      description: `${title} feature is under development and will be available soon!`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Dashboard — AyurWell" description="Your personalized Ayurveda dashboard with profile, Prakriti analysis, diet charts and more." canonical="/dashboard" />
      
      <div className="mb-8">
        <WelcomeCard />
      </div>

      <div className="mb-6">
        <h1 className="section-title">Your Wellness Hub</h1>
        <p className="text-muted-foreground mt-2">Explore your personalized Ayurveda features below</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <DashboardSection 
            key={section.title}
            title={section.title}
            description={section.desc}
            icon={section.icon}
            onClick={() => handleSectionClick(section.title)}
            buttonText="Explore"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
