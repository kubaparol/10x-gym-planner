import { useTrainingPlans } from "./hooks/useTrainingPlans";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { Pagination } from "@/components/ui/pagination";
import { TrainingPlansList } from "./TrainingPlansList";

export function TrainingPlansPage() {
  const navigate = useNavigate();
  const { plans, isLoading, error, pagination, setPage } = useTrainingPlans();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive text-lg">Failed to load training plans</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  const handlePlanSelect = (planId: string) => {
    navigate(`/training-plans/${planId}`);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  return (
    <div className="space-y-8">
      <TrainingPlansList plans={plans} onSelect={handlePlanSelect} />
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
