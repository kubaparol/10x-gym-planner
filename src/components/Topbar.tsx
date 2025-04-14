import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function Topbar() {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to logout");
      }

      toast.success("Logged out successfully");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="font-semibold">
            10x Gym Planner
          </a>
          <nav className="flex items-center gap-4">
            <a href="/create-training-plan" className="text-sm text-muted-foreground hover:text-foreground">
              Create Plan
            </a>
            <a href="/training-plans" className="text-sm text-muted-foreground hover:text-foreground">
              Training Plans
            </a>
          </nav>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
