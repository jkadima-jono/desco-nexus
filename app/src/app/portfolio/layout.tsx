import type { Metadata } from "next";
import { PRIVATE_ROUTE_ROBOTS } from "@/lib/private-metadata";

export const metadata: Metadata = { robots: PRIVATE_ROUTE_ROBOTS };
export default function PortfolioLayout({ children }: { children: React.ReactNode }) { return children; }
