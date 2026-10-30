import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactView } from "@/components/pages/ContactView";

export const metadata: Metadata = {
  title: "Contactos e inscrição",
  description: "Inscreve-te numa formação da Suez Academy ou fala connosco por WhatsApp ou email.",
};

export default function Page() {
  return (
    <Suspense>
      <ContactView />
    </Suspense>
  );
}
