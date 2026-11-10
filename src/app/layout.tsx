import type { Metadata } from "next";
import { Providers } from "./providers";
import { StitchesRegistry } from "../lib/stitches-registry";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.url.com.br"),
  title: {
    default: "Ignite Call",
    template: "%s | Ignite Call",
  },
  description: "Agendamento descomplicado",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.url.com.br/",
    siteName: "Ignite Call",
    title: "Ignite Call",
    description: "Agendamento descomplicado",
  },
  twitter: {
    card: "summary_large_image",
    site: "@site",
    creator: "@handle",
    title: "Ignite Call",
    description: "Agendamento descomplicado",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <StitchesRegistry>
          <Providers>{children}</Providers>
        </StitchesRegistry>
      </body>
    </html>
  );
}
