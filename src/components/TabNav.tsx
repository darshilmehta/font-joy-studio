import { cn } from "@/lib/utils";

type TabType = "pairing" | "popular" | "foundry";

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "pairing", label: "Font Pairing" },
    { id: "popular", label: "Popular" },
    { id: "foundry", label: "Same Foundry" },
  ];

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
            activeTab === tab.id
              ? "bg-tab-active text-foreground shadow-sm"
              : "bg-tab-inactive text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
