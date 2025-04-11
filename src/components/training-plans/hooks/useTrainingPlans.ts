import { useState, useEffect } from "react";
import type { TrainingPlanListDTO, PaginationDTO } from "@/types";

interface UseTrainingPlansReturn {
  plans: TrainingPlanListDTO[];
  isLoading: boolean;
  error: Error | null;
  pagination: PaginationDTO | null;
  setPage: (page: number) => void;
}

export function useTrainingPlans(): UseTrainingPlansReturn {
  const [plans, setPlans] = useState<TrainingPlanListDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationDTO | null>(null);
  const [page, setPage] = useState(1);
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

  return {
    plans,
    isLoading,
    error,
    pagination,
    setPage,
  };
}
