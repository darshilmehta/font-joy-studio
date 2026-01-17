import { useState } from "react";
import { Lock, LockOpen, GripVertical, Bookmark, BookmarkCheck } from "lucide-react";
import { FontData } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface FontSectionProps {
  font: FontData;
  position: "header" | "body";
  isLocked: boolean;
  onLockToggle: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver?: boolean;
  defaultText: string;
}

export function FontSection({
  font,
  position,
  isLocked,
  onLockToggle,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
  defaultText,
}: FontSectionProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkTooltip, setShowBookmarkTooltip] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(true);
    setShowBookmarkTooltip(true);
    setTimeout(() => setShowBookmarkTooltip(false), 1500);
  };

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        position === "body" && "bg-body-section",
        isDragOver && "ring-2 ring-foreground/20 ring-inset"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="container mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
          {/* Font Card - Non-draggable, just displays info */}
          <div className="flex-shrink-0 w-full md:w-36">
            <div className="text-sm font-medium text-foreground">
              {font.family}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {font.foundry}
            </div>
          </div>

          {/* Text Display - Uncontrolled contentEditable */}
          <div className="flex-1 min-w-0">
            <div
              contentEditable
              suppressContentEditableWarning
              className={cn(
                "outline-none transition-all duration-300 animate-fade-in",
                position === "header" 
                  ? "text-3xl md:text-5xl lg:text-6xl font-normal leading-tight" 
                  : "text-base md:text-lg leading-relaxed text-foreground/90"
              )}
              style={{ fontFamily: `"${font.family}", ${font.category}` }}
            >
              {defaultText}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex md:flex-col items-center gap-4 md:gap-3 flex-shrink-0">
            <button
              onClick={onLockToggle}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-foreground/5",
                isLocked ? "text-icon-active" : "text-icon-default hover:text-icon-hover"
              )}
              title={isLocked ? "Unlock font" : "Lock font"}
            >
              {isLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <LockOpen className="w-5 h-5" />
              )}
            </button>

            {/* Drag Handle Button */}
            <div
              draggable
              onDragStart={onDragStart}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 cursor-grab active:cursor-grabbing",
                "text-icon-default hover:text-icon-hover hover:bg-foreground/5",
                "hover:scale-105 active:scale-95"
              )}
              title="Drag to swap with other font"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="relative">
              <button
                onClick={handleBookmark}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "hover:bg-foreground/5",
                  isBookmarked ? "text-icon-active" : "text-icon-default hover:text-icon-hover"
                )}
                title="Bookmark this font"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
              {showBookmarkTooltip && (
                <div className="absolute right-0 md:right-auto md:left-full md:ml-2 top-0 md:top-1/2 md:-translate-y-1/2 mt-10 md:mt-0 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in">
                  Saved!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
