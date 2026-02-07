import Link from "next/link";

interface NewsCardProps {
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  index?: number;
}

const ACCENT_COLORS = [
  { gradient: "from-mccain-green to-emerald-500", bg: "bg-mccain-green/10", text: "text-mccain-green", border: "border-mccain-green/20", dot: "bg-mccain-green" },
  { gradient: "from-mccain-yellow to-amber-400", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
  { gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", dot: "bg-blue-500" },
];

export default function NewsCard({ date, title, excerpt, slug, index = 0 }: NewsCardProps) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <Link
      href={`/information-centre/news#${slug}`}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/70 transition-all duration-500 hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* Accent bar -- left on mobile, top on desktop */}
      <div className={`hidden sm:block h-1 w-full bg-gradient-to-r ${accent.gradient}`} />

      <div className="flex flex-col flex-1 p-4 sm:p-6 relative">
        {/* Mobile left accent bar */}
        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b ${accent.gradient} sm:hidden`} />

        {/* Date */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3.5 pl-2.5 sm:pl-0">
          <div className={`w-1.5 h-1.5 rounded-full ${accent.dot} sm:hidden`} />
          <div className={`sm:inline-flex items-center gap-1.5 ${accent.bg} rounded-full sm:px-3 sm:py-1 ${accent.border} sm:border hidden`}>
            <svg className={`w-3 h-3 ${accent.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className={`text-[11px] font-semibold ${accent.text} uppercase tracking-wide`}>{date}</span>
          </div>
          <span className={`text-[10px] font-semibold ${accent.text} uppercase tracking-wide sm:hidden`}>{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-[13px] sm:text-lg font-bold text-gray-900 group-hover:text-mccain-green transition-colors leading-snug tracking-tight line-clamp-2 sm:line-clamp-3 pl-2.5 sm:pl-0">
          {title}
        </h3>

        {/* Excerpt -- desktop only */}
        <p className="hidden sm:block text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3 flex-1">{excerpt}</p>

        {/* Read more */}
        <div className="mt-2.5 sm:mt-5 pt-2.5 sm:pt-4 border-t border-gray-50 sm:border-gray-100 flex items-center justify-between pl-2.5 sm:pl-0">
          <span className="text-[11px] sm:text-sm font-bold text-mccain-green group-hover:text-mccain-green-dark transition-colors">
            Read article
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-mccain-green/10 group-hover:bg-mccain-green flex items-center justify-center transition-all duration-300">
            <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-mccain-green group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover shimmer -- desktop */}
      <div className="absolute inset-0 bg-gradient-to-br from-mccain-green/[0.02] via-transparent to-mccain-yellow/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden sm:block" />
    </Link>
  );
}
