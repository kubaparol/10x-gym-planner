import type { TrainingPlanListDTO } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

interface TrainingPlanCardProps {
  plan: TrainingPlanListDTO;
  onClick: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function TrainingPlanCard({ plan, onClick, onDelete, isDeleting = false }: TrainingPlanCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of the card
    onDelete();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <button className="flex-1" onClick={onClick}>
            <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
            <CardDescription>{plan.description || "No description provided"}</CardDescription>
          </button>
          <div className="flex items-start gap-2">
            {!plan.is_active && <Badge variant="secondary">Inactive</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete plan</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={onClick}>
        <div className="text-sm text-muted-foreground">Created {formatDate(plan.created_at)}</div>
      </CardContent>
    </Card>
  );
}
