import type { Metadata } from "next";
import { HomeContent } from "./components/HomeContent";

export const metadata: Metadata = {
  title: "Agendamento Descomplicado",
  description:
    "Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.",
};

export default function Home() {
  return <HomeContent />;
}
