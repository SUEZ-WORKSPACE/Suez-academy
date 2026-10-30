import type { Metadata } from "next";
import { LearnView } from "@/components/pages/LearnView";

export const metadata: Metadata = {
  title: "O que vais aprender",
  description: "Atravessa o túnel: 14 paragens, do primeiro commit ao portfólio.",
};

export default function Page() {
  return <LearnView />;
}
