import { Suspense } from "react";
import type { Metadata } from "next";
import { ConnectCalendarContent } from "./ConnectCalendarContent";

export const metadata: Metadata = {
  title: "Conecte sua agenda do Google",
};

export default function ConnectCalendar() {
  return (
    <Suspense>
      <ConnectCalendarContent />
    </Suspense>
  );
}
