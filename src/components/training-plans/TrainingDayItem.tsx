import type { TrainingDayDTO, TrainingDayExerciseDTO } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const WEEKDAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

interface TrainingDayItemProps {
  day: TrainingDayDTO & { exercises: TrainingDayExerciseDTO[] };
}

export function TrainingDayItem({ day }: TrainingDayItemProps) {
  const weekdayName = WEEKDAYS[day.weekday - 1] || "Nieznany dzień";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{weekdayName}</CardTitle>
        </div>
        <CardDescription>{day.exercises.length} ćwiczeń zaplanowanych</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {day.exercises.map((exercise) => (
            <li key={exercise.id} className="flex items-center justify-between">
              <span className="font-medium">{exercise.exercise.name}</span>
              <span className="text-sm text-muted-foreground">
                {exercise.sets} x {exercise.repetitions} powtórzeń
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
