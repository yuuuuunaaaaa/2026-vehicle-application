import type { Metadata } from "next";
import { DateDetailContainer } from "@/components/containers/DateDetailContainer";
import { EVENT_DATES, DATE_LABELS } from "@/types/application";
import type { EventDate } from "@/types/application";

interface PageProps {
  params: Promise<{ date: string }>;
}

export function generateStaticParams() {
  return EVENT_DATES.map((date) => ({ date }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const label = DATE_LABELS[date as EventDate] ?? date;
  return { title: `${label} 날짜 상세` };
}

export default async function DateDetailPage({ params }: PageProps) {
  const { date } = await params;
  return <DateDetailContainer date={date} />;
}
