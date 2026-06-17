import type { Metadata } from "next";
import { SummaryContainer } from "@/components/containers/SummaryContainer";

export const metadata: Metadata = { title: "전체 집계" };

export default function SummaryPage() {
  return <SummaryContainer />;
}
