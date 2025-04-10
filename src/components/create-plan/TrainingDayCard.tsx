import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2 } from "lucide-react";
import type { TrainingPlanFormViewModel } from "../views/CreateTrainingPlanView";
import { ExercisesList } from "./ExercisesList";

interface TrainingDayCardProps {
  form: UseFormReturn<TrainingPlanFormViewModel>;
  index: number;
  onRemove: () => void;
}

const WEEKDAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
] as const;

export function TrainingDayCard({ form, index, onRemove }: TrainingDayCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <FormField
          control={form.control}
          name={`training_days.${index}.weekday`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Training Day</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                value={field.value?.toString() ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {WEEKDAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-8" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove training day</span>
        </Button>
      </CardHeader>

      <CardContent>
        <ExercisesList form={form} dayIndex={index} />
      </CardContent>
    </Card>
  );
}
