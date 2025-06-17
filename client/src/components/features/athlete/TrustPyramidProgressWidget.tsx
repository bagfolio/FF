import TrustPyramidProgress from "@/components/ui/trust-pyramid-progress";

interface TrustPyramidProgressWidgetProps {
  currentLevel: "bronze" | "silver" | "gold" | "platinum";
}

export function TrustPyramidProgressWidget({ currentLevel }: TrustPyramidProgressWidgetProps) {
  return <TrustPyramidProgress currentLevel={currentLevel} />;
}