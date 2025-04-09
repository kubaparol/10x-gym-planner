import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import type { TrainingPlanFormViewModel } from "../views/CreateTrainingPlanView";
import { v4 as uuidv4 } from "uuid";
import { ExerciseForm } from "./ExerciseForm";

interface ExercisesListProps {
  form: UseFormReturn<TrainingPlanFormViewModel>;
  dayIndex: number;
}

export function ExercisesList({ form, dayIndex }: ExercisesListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `training_days.${dayIndex}.exercises`,
  });

  const handleAddExercise = () => {
    append({
      id: uuidv4(),
      exercise_name: "",
      order_index: fields.length,
      sets: "",
      repetitions: "",
      rest_time_seconds: "",
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <ExerciseForm
          key={field.id}
          form={form}
          dayIndex={dayIndex}
          exerciseIndex={index}
          onRemove={() => remove(index)}
        />
      ))}

      <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleAddExercise}>
        <Plus className="mr-2 h-4 w-4" />
        Add Exercise
      </Button>
    </div>
  );
}
