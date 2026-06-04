import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, getCreator, works } from "@/lib/data";

export default function RankPage() {
  const topWorks = [...works].sort((a, b) => b.likes - a.likes).slice(0, 8);

  return (
    <section className="leaderboard surface">
      <div>
        <span className="section-kicker">Leaderboard</span>
        <h1 className="page-title">Most-liked works this week</h1>
      </div>
      {topWorks.map((work, index) => {
        const creator = getCreator(work.creatorId);
        return (
          <div className="leader-row" key={work.id}>
            <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>
            <Image src={creator.avatar} width={40} height={40} alt="" />
            <div>
              <strong>{work.title}</strong>
              <span>
                {creator.handle} · {formatNumber(work.likes)} likes · {work.type}
              </span>
            </div>
            <Link className="play-link" href={`/play/${work.id}`}>
              <Play size={14} aria-hidden="true" />
              Try
            </Link>
          </div>
        );
      })}
    </section>
  );
}
