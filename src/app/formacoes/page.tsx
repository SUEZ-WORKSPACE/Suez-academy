import type { Metadata } from "next";
import { TracksView } from "@/components/pages/TracksView";

export const metadata: Metadata = {
  title: "Formações",
  description: "Seis trilhas práticas: software, DevOps e cloud, redes, cibersegurança, produto e carreira.",
};

export default function Page() {
  return <TracksView />;
}
