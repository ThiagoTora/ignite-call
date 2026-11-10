import type { Metadata } from "next";
import TimeIntervals from "./TimeIntervalsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selecione sua disponibilidade",
};

export default function ConnectCalendar() {
  return <TimeIntervals />;
}
