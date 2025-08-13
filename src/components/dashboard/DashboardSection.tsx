import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  buttonText?: string;
}

export const DashboardSection = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  buttonText = "Open" 
}: DashboardSectionProps) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        <Button variant="secondary" size="sm" className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};