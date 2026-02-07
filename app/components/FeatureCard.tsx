import Image from "next/image";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
}

export default function FeatureCard({
  title,
  subtitle,
  description,
  image,
  href,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block relative overflow-hidden rounded-3xl h-[280px] sm:h-[320px] md:h-[380px] active:scale-[0.98] transition-all duration-500 ring-1 ring-black/5"
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      {/* Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-mccain-green/20 via-transparent to-mccain-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Top badge */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-400">
          <span className="w-1.5 h-1.5 bg-mccain-yellow rounded-full" />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">{subtitle}</span>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        {/* Animated accent line */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="h-0.5 w-8 bg-mccain-yellow rounded-full transition-all duration-500 group-hover:w-14" />
          <div className="h-0.5 w-2 bg-mccain-yellow/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
          {title}
          <span className="text-mccain-yellow">.</span>
        </h3>

        <p className="text-xs sm:text-sm text-white/50 mt-2 sm:mt-2.5 leading-relaxed max-w-xs group-hover:text-white/70 transition-colors duration-500">
          {description}
        </p>

        {/* CTA row */}
        <div className="mt-4 sm:mt-5 flex items-center gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-100">
          <span className="text-xs font-bold text-mccain-yellow uppercase tracking-wider">Explore</span>
          <div className="h-px flex-1 bg-white/10" />
          <div className="w-7 h-7 rounded-full bg-mccain-yellow/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-mccain-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
