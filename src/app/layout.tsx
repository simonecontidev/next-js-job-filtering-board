import type { Metadata } from "next";
import ThemeProviderSC from "@/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Next.js Job Filtering Board",
  description: "Filters with URL/localStorage + favorites + theme",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderSC>{children}</ThemeProviderSC>
      </body>
    </html>
  );
}