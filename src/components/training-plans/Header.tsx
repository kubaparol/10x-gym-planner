import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  name: string;
  description: string;
}

export function Header({ name, description }: HeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="h-10 w-10">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      </div>

      {description && <p className="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">{description}</p>}
    </div>
  );
}
