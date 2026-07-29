import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — DESCO Compass",
  description: "Describe an investment mandate in plain language and Compass parses sector, ticket size, and geography criteria to rank live opportunities.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
