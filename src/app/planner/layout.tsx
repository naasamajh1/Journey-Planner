
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Planner | Journey Journal",
  description: "Manage your trip details and daily plans.",
};

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
