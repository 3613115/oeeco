import { absoluteUrl } from "@/lib/site";

const reportEmail = process.env.NEXT_PUBLIC_REPORT_EMAIL || "xzliyang778@gmail.com";

type ReportContext = "work" | "play";

type ReportWork = {
  id: string;
  title: string;
};

export function buildWorkReportHref(work: ReportWork, context: ReportContext) {
  const subject = `[oeeco report] ${work.title}`;
  const body = [
    "What happened?",
    "",
    "",
    "Report type:",
    context === "play" ? "TRY / Play issue" : "Work detail issue",
    "",
    "Work:",
    work.title,
    "",
    "Work URL:",
    absoluteUrl(`/works/${work.id}`),
    "",
    "TRY URL:",
    absoluteUrl(`/play/${work.id}`),
  ].join("\n");

  return `mailto:${reportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
