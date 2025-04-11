import type { TrainingPlanListDTO } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";

interface TrainingPlanCardProps {
  plan: TrainingPlanListDTO;
  onClick: () => void;
}

export function TrainingPlanCard({ plan, onClick }: TrainingPlanCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
            <CardDescription>{plan.description || "No description provided"}</CardDescription>
          </div>
          {!plan.is_active && <Badge variant="secondary">Inactive</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">Created {formatDate(plan.created_at)}</div>
      </CardContent>
    </Card>
  );
}
