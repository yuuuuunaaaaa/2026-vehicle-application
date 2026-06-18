import type { Metadata } from "next";
import { ZoneMemberContainer } from "@/components/containers/ZoneMemberContainer";
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
  return { title: `${decodeURIComponent(zone)} 구성원 관리` };
}

export default async function ZoneMembersPage({ params }: PageProps) {
  const { zone } = await params;
  return <ZoneMemberContainer zone={decodeURIComponent(zone) as Zone} />;
}
