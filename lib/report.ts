import { absoluteUrl } from "@/lib/site";

const reportEmail = process.env.NEXT_PUBLIC_REPORT_EMAIL || "xzliyang778@gmail.com";

type ReportContext = "work" | "play";

type ReportWork = {
  id: string;
  title: string;
};

type WorkReportOptions = {
  category?: string;
  details?: string;
};

export const reportReasons = [
  "Broken demo or loading problem",
  "Unsafe or suspicious link",
  "Misleading title or description",
  "Privacy, rights, or ownership concern",
  "Other issue",
] as const;

export function buildWorkReportHref(work: ReportWork, context: ReportContext, options: WorkReportOptions = {}) {
  const subject = `[oeeco report] ${work.title}`;
  const body = [
    "What happened?",
    "",
    options.details || "",
    "Report type:",
    context === "play" ? "TRY / Play issue" : "Work detail issue",
    "",
    "Issue category:",
    options.category || "Not selected",
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
