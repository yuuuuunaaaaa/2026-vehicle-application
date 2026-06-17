import type { Metadata } from "next";
import { ZoneApplicationContainer } from "@/components/containers/ZoneApplicationContainer";
import type { Zone } from "@/types/member";
import { ZONES } from "@/types/member";

interface PageProps {
  params: Promise<{ zone: string }>;
}

function decodeZoneParam(value: string): string {
  let decoded = value;
  try {
    let next = decodeURIComponent(decoded);
    while (next !== decoded) {
      decoded = next;
      next = decodeURIComponent(decoded);
    }
  } catch {
    return value;
  }
  return decoded;
}

export function generateStaticParams() {
  return ZONES.map((zone) => ({ zone }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zone } = await params;
  return { title: `${decodeZoneParam(zone)} 차량 신청` };
}

export default async function ZonePage({ params }: PageProps) {
  const { zone } = await params;
  const decoded = decodeZoneParam(zone) as Zone;

  return <ZoneApplicationContainer key={decoded} zone={decoded} />;
}
