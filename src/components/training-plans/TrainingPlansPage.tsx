import { useState } from "react";
import { useTrainingPlans } from "./hooks/useTrainingPlans";
import { Pagination } from "@/components/ui/pagination";
import { TrainingPlansList } from "./TrainingPlansList";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export function TrainingPlansPage() {
  const { plans, isLoading, error, pagination, setPage, deletePlan, isDeletingPlan } = useTrainingPlans();
  const [planToDelete, setPlanToDelete] = useState<{ id: string; name: string } | null>(null);

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
    window.location.href = `/training-plans/${planId}`;
  };

  const handleDeleteClick = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setPlanToDelete({ id: plan.id, name: plan.name });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      const response = await deletePlan(planToDelete.id);
      toast.success(response.message || "Training plan deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete training plan");
    } finally {
      setPlanToDelete(null);
    }
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  return (
    <div className="space-y-8">
      <TrainingPlansList
        plans={plans}
        onSelect={handlePlanSelect}
        onDelete={handleDeleteClick}
        isDeletingPlan={isDeletingPlan}
      />
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <AlertDialog open={!!planToDelete} onOpenChange={(isOpen: boolean) => !isOpen && setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{planToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeletingPlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
