import { getAllMembers } from "@/services/memberService";
import { getApplicantCounts } from "@/services/applicationService";
import type { Zone } from "@/types/member";
import type { FareSummary, MemberFare, ZoneFareSummary } from "@/types/fare";

const FARE_PER_ADULT = parseInt(process.env.FARE_PER_ADULT ?? "10000", 10);

export async function getFareSummary(): Promise<FareSummary> {
  const [allMembers, applicantCounts] = await Promise.all([
    getAllMembers(),
    getApplicantCounts(),
  ]);

  const memberMap = new Map(allMembers.map((m) => [`${m.zone}:${m.name}`, m]));

  const zoneGroups = new Map<Zone, MemberFare[]>();
  for (const { zone, name, count } of applicantCounts) {
    const member = memberMap.get(`${zone}:${name}`);
    if (!member) continue;
    // 미성년자는 무료, 성인은 신청 날짜 수 × 차비
    const fare = member.isMinor ? 0 : count * FARE_PER_ADULT;
    const entry: MemberFare = {
      zone,
      name,
      isMinor: member.isMinor,
      paid: member.paid,
      applicationCount: count,
      fare,
    };
    const list = zoneGroups.get(zone) ?? [];
    list.push(entry);
    zoneGroups.set(zone, list);
  }

  const zones: ZoneFareSummary[] = Array.from(zoneGroups.entries()).map(
    ([zone, members]) => {
      const total = members.reduce((s, m) => s + m.fare, 0);
      const paid = members
        .filter((m) => !m.isMinor && m.paid)
        .reduce((s, m) => s + m.fare, 0);
      const unpaid = total - paid;
      return { zone, total, paid, unpaid, members };
    }
  );

  const totalFare = zones.reduce((s, z) => s + z.total, 0);
  const totalPaid = zones.reduce((s, z) => s + z.paid, 0);
  const totalUnpaid = zones.reduce((s, z) => s + z.unpaid, 0);

  return { farePerAdult: FARE_PER_ADULT, totalFare, totalPaid, totalUnpaid, zones };
}
