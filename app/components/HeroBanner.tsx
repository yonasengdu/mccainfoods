import Image from "next/image";
import Link from "next/link";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage: string;
  overlay?: boolean;
}

export default function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaHref,
  backgroundImage,
  overlay = true,
}: HeroBannerProps) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      )}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
            {title}
            <span className="text-mccain-yellow">.</span>
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-lg">{subtitle}</p>
          )}
          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className="mt-6 inline-block bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wide"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
