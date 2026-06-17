import Link from "next/link";
import { ZoneList } from "@/components/presentational/ZoneList";

export default function HomePage() {
  return (
    <main>
      <h1>교회 행사 차량 신청</h1>
      <section aria-label="구역 선택">
        <ZoneList />
      </section>
      <nav aria-label="전체 집계">
        <Link href="/summary">전체 집계 보기</Link>
      </nav>
    </main>
  );
}
