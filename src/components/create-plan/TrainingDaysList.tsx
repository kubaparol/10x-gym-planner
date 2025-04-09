import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { TrainingDayCard } from "./TrainingDayCard";
import type { TrainingPlanFormViewModel } from "../views/CreateTrainingPlanView";
import { v4 as uuidv4 } from "uuid";

interface TrainingDaysListProps {
  form: UseFormReturn<TrainingPlanFormViewModel>;
}

export function TrainingDaysList({ form }: TrainingDaysListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "training_days",
  });

  const handleAddDay = () => {
    append({
      id: uuidv4(),
      weekday: null,
      exercises: [],
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <TrainingDayCard key={field.id} form={form} index={index} onRemove={() => remove(index)} />
      ))}

      <Button type="button" variant="outline" className="w-full" onClick={handleAddDay}>
        <Plus className="mr-2 h-4 w-4" />
        Add Training Day
      </Button>
    </div>
  );
}
