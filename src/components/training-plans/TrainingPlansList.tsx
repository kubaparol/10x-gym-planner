import type { TrainingPlanListDTO } from "@/types";
import { TrainingPlanCard } from "./TrainingPlanCard";

interface TrainingPlansListProps {
  plans: TrainingPlanListDTO[];
  onSelect: (planId: string) => void;
  onDelete: (planId: string) => void;
  isDeletingPlan?: boolean;
}

export function TrainingPlansList({ plans, onSelect, onDelete, isDeletingPlan = false }: TrainingPlansListProps) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
        <p>No training plans found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <TrainingPlanCard
          key={plan.id}
          plan={plan}
          onClick={() => onSelect(plan.id)}
          onDelete={() => onDelete(plan.id)}
          isDeleting={isDeletingPlan}
        />
      ))}
    </div>
  );
}
