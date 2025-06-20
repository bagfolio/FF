import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const GlassTabs = TabsPrimitive.Root;

const GlassTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg p-1",
      "glass-morph",
      className
    )}
    {...props}
  />
));
GlassTabsList.displayName = TabsPrimitive.List.displayName;

const GlassTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5",
      "text-sm font-medium text-white/60 ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:backdrop-blur-md",
      "hover:text-white/80 hover:bg-white/5",
      className
    )}
    {...props}
  />
));
GlassTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const GlassTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
GlassTabsContent.displayName = TabsPrimitive.Content.displayName;

export { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent };