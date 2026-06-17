import type { Metadata } from "next";
import { ZoneApplicationContainer } from "@/components/containers/ZoneApplicationContainer";
import type { Zone } from "@/types/member";
import { ZONES } from "@/types/member";

interface PageProps {
  params: Promise<{ zone: string }>;
}

export function generateStaticParams() {
  return ZONES.map((zone) => ({ zone: encodeURIComponent(zone) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zone } = await params;
  return { title: `${decodeURIComponent(zone)} 차량 신청` };
}

export default async function ZonePage({ params }: PageProps) {
  const { zone } = await params;
  const decoded = decodeURIComponent(zone) as Zone;

  return <ZoneApplicationContainer zone={decoded} />;
}
