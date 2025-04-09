import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import type { TrainingPlanFormViewModel } from "../views/CreateTrainingPlanView";

interface ExerciseFormProps {
  form: UseFormReturn<TrainingPlanFormViewModel>;
  dayIndex: number;
  exerciseIndex: number;
  onRemove: () => void;
}

export function ExerciseForm({ form, dayIndex, exerciseIndex, onRemove }: ExerciseFormProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div className="flex-1 space-y-4">
        <FormField
          control={form.control}
          name={`training_days.${dayIndex}.exercises.${exerciseIndex}.exercise_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter exercise name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`training_days.${dayIndex}.exercises.${exerciseIndex}.sets`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`training_days.${dayIndex}.exercises.${exerciseIndex}.repetitions`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reps</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`training_days.${dayIndex}.exercises.${exerciseIndex}.rest_time_seconds`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rest (sec)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-8" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove exercise</span>
      </Button>
    </div>
  );
}
