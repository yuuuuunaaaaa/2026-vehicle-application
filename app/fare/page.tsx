import type { Metadata } from "next";
import { FareContainer } from "@/components/containers/FareContainer";

export const metadata: Metadata = { title: "차비 현황" };

export default function FarePage() {
  return <FareContainer />;
}
