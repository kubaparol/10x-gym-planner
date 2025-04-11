import type { TrainingDayDTO, TrainingDayExerciseDTO } from "@/types";
import { TrainingDayItem } from "./TrainingDayItem";

interface TrainingDayListProps {
  trainingDays: (TrainingDayDTO & { exercises: TrainingDayExerciseDTO[] })[];
}

export function TrainingDayList({ trainingDays }: TrainingDayListProps) {
  if (trainingDays.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Ten plan nie zawiera jeszcze żadnych dni treningowych.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {trainingDays
        .sort((a, b) => a.weekday - b.weekday)
        .map((day) => (
          <TrainingDayItem key={day.id} day={day} />
        ))}
    </div>
  );
}
