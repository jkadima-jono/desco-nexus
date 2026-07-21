import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Search — DESCO Nexus",
  description: "Describe an investment mandate in plain language and Nexus parses sector, ticket size, and geography criteria to rank live opportunities.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
