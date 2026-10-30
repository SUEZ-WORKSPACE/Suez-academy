import type { Metadata } from "next";
import { TemplatesView } from "@/components/pages/TemplatesView";

export const metadata: Metadata = {
  title: "Templates",
  description: "Projectos de partida usados nas aulas: landing pages, dashboards, APIs, pipelines, laboratórios de rede e mais.",
};

export default function Page() {
  return <TemplatesView />;
}
