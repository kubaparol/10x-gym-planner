import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface PlanModeSelectorProps {
  currentMode: "manual" | "pdf";
  onModeChange: (mode: "manual" | "pdf") => void;
}

export function PlanModeSelector({ currentMode, onModeChange }: PlanModeSelectorProps) {
  return (
    <Tabs value={currentMode} onValueChange={(value) => onModeChange(value as "manual" | "pdf")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="pdf">Import from PDF</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
