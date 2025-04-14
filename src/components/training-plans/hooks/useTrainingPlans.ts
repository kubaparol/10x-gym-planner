import { useState, useEffect } from "react";
import type { TrainingPlanListDTO, PaginationDTO, DeleteResponseDTO } from "@/types";

interface UseTrainingPlansReturn {
  plans: TrainingPlanListDTO[];
  isLoading: boolean;
  error: Error | null;
  pagination: PaginationDTO | null;
  setPage: (page: number) => void;
  deletePlan: (planId: string) => Promise<DeleteResponseDTO>;
  isDeletingPlan: boolean;
}

export function useTrainingPlans(): UseTrainingPlansReturn {
  const [plans, setPlans] = useState<TrainingPlanListDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationDTO | null>(null);
  const [page, setPage] = useState(1);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const limit = 10; // Default page size

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/training-plans?page=${page}&limit=${limit}`);

        if (!response.ok) {
          throw new Error("Failed to fetch training plans");
        }

        const data = await response.json();
        setPlans(data.plans);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [page]);

  const deletePlan = async (planId: string): Promise<DeleteResponseDTO> => {
    try {
      setIsDeletingPlan(true);

      const response = await fetch(`/api/training-plans/${planId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete training plan";

        switch (response.status) {
          case 401:
            errorMessage = "You are not authorized to delete this plan";
            break;
          case 404:
            errorMessage = "Training plan not found";
            break;
          case 500:
            errorMessage = "Server error occurred while deleting the plan";
            break;
        }

        throw new Error(errorMessage);
      }

      const data = (await response.json()) as DeleteResponseDTO;

      // Update local state by removing the deleted plan
      setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== planId));

      // If after deletion we have no items on current page and it's not the first page,
      // go to previous page
      if (pagination && plans.length === 1 && page > 1) {
        setPage(page - 1);
      }

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error("An error occurred while deleting the plan");
    } finally {
      setIsDeletingPlan(false);
    }
  };

  return {
    plans,
    isLoading,
    error,
    pagination,
    setPage,
    deletePlan,
    isDeletingPlan,
  };
}
