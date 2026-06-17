"use client";

import { useState } from "react";
import type { Zone } from "@/types/member";
import type { EventDate } from "@/types/application";
import { EVENT_DATES } from "@/types/application";
import { useMembers } from "@/hooks/useMembers";
import { useApplications } from "@/hooks/useApplications";
import { DateSelector } from "@/components/presentational/DateSelector";
import { MemberList } from "@/components/presentational/MemberList";

interface ZoneApplicationContainerProps {
  zone: Zone;
}

export function ZoneApplicationContainer({
  zone,
}: ZoneApplicationContainerProps) {
  const [selectedDate, setSelectedDate] = useState<EventDate>(EVENT_DATES[0]);
  const { members, isLoading: membersLoading, error: membersError } = useMembers(zone);
  const {
    isLoading: appsLoading,
    error: appsError,
    isApplied,
    toggle,
    isToggling,
  } = useApplications(zone);

  if (membersError || appsError) {
    return <p role="alert">오류가 발생했습니다: {membersError ?? appsError}</p>;
  }

  if (membersLoading || appsLoading) {
    return <p aria-live="polite">불러오는 중...</p>;
  }

  return (
    <div>
      <h1>{zone} 차량 신청</h1>
      <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
      <MemberList
        members={members}
        selectedDate={selectedDate}
        isApplied={isApplied}
        onToggle={toggle}
        isToggling={isToggling}
      />
    </div>
  );
}
