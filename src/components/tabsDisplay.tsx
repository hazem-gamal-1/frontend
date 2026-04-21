import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tab = {
  icon?: ReactNode;
  value: string;
  tabContent: ReactNode;
};

export function TabsDisplay({
  tabs,
  tabListStyle,
  containerStyle,
  activeTab,
  onTabChange,
}: {
  tabListStyle?: string;
  containerStyle?: string;
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (val: string) => void;
}) {
  return (
    <Tabs defaultValue={tabs[0].value} value={activeTab} onValueChange={onTabChange} className={cn("h-full", containerStyle)}>
      <TabsList className={tabListStyle}>
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="capitalize">
            {t.icon}
            {t.value}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="h-full ">
          {t.tabContent}
        </TabsContent>
      ))}
    </Tabs>
  );
}
