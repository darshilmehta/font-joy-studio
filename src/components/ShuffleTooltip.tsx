import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ShuffleTooltipProps {
  show: boolean;
  onDismiss: () => void;
}

export function ShuffleTooltip({ show, onDismiss }: ShuffleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = () => {
        setIsVisible(false);
        onDismiss();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "bg-foreground text-background px-4 py-2 rounded-lg",
        "text-sm font-medium shadow-lg",
        "animate-slide-up"
      )}
    >
      Hit <kbd className="px-1.5 py-0.5 bg-background/20 rounded mx-1">space</kbd> to shuffle
    </div>
  );
}
