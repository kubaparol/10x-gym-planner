import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface StartTrainingButtonProps {
  disabled: boolean;
  onStart: () => void;
}

export function StartTrainingButton({ disabled, onStart }: StartTrainingButtonProps) {
  return (
    <div className="flex justify-center">
      <Button size="lg" disabled={disabled} onClick={onStart} className="gap-2">
        <Play className="h-5 w-5" />
        Rozpocznij trening
      </Button>
    </div>
  );
}
