import { useEffect, useState } from "react";
import type { TrainingPlanDetailsDTO, TrainingDayDTO, TrainingDayExerciseDTO } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Header } from "./Header";
import { TrainingDayList } from "./TrainingDayList";
import { StartTrainingButton } from "./StartTrainingButton";

interface TrainingPlanDetailsProps {
  planId: string;
}

interface ErrorType {
  message: string;
  code?: number;
}

type EnhancedTrainingDayDTO = TrainingDayDTO & { exercises: TrainingDayExerciseDTO[] };

type EnhancedTrainingPlanDetailsDTO = Omit<TrainingPlanDetailsDTO, "training_days"> & {
  training_days: EnhancedTrainingDayDTO[];
};

export function TrainingPlanDetails({ planId }: TrainingPlanDetailsProps) {
  const [plan, setPlan] = useState<EnhancedTrainingPlanDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/training-plans/${planId}`);

        if (!response.ok) {
          let errorMessage = "Wystąpił błąd podczas pobierania planu treningowego.";

          switch (response.status) {
            case 404:
              errorMessage = "Plan treningowy nie został znaleziony.";
              break;
            case 401:
              errorMessage = "Brak uprawnień do wyświetlenia planu treningowego.";
              break;
            case 403:
              errorMessage = "Dostęp zabroniony.";
              break;
            case 500:
              errorMessage = "Wystąpił błąd serwera. Spróbuj ponownie później.";
              break;
          }

          throw new Error(errorMessage, { cause: { code: response.status } });
        }

        const data = await response.json();
        setPlan(data);
      } catch (err) {
        const error = err as Error & { cause?: { code?: number } };
        setError({
          message: error.message || "Wystąpił nieoczekiwany błąd.",
          code: error.cause?.code,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, [planId]);

  const handleStartTraining = () => {
    if (plan) {
      window.location.href = `/workout/${plan.id}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message}
          {error.code === 500 && (
            <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
              Odśwież stronę
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!plan) {
    return (
      <Alert>
        <AlertDescription>Plan treningowy nie został znaleziony.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Header name={plan.name} description={plan.description || ""} />
      <TrainingDayList trainingDays={plan.training_days} />
      <StartTrainingButton disabled={plan.training_days.length === 0} onStart={handleStartTraining} />
    </div>
  );
}
