"use client";

import { useServerInsertedHTML } from "next/navigation";
import { getCssText } from "@ignite-ui/react";

export function StitchesRegistry({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => (
    <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
  ));

  return <>{children}</>;
}
