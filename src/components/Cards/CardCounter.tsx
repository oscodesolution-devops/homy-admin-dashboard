import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardCounterProps {
  title: string;
  content: any;
  icon: React.ComponentType<{ className?: string }>; // Icon component type
}

const CardCounter = ({ title, content, icon: Icon }: CardCounterProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" /> {/* Render the passed icon */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
      </CardContent>
    </Card>
  );
};

export default CardCounter;
