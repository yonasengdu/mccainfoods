import Link from "next/link";

interface NewsCardProps {
  date: string;
  title: string;
  excerpt: string;
  slug: string;
}

export default function NewsCard({ date, title, excerpt, slug }: NewsCardProps) {
  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      <p className="text-sm text-mccain-gray-dark mb-2">{date}</p>
      <Link
        href={`/information-centre/news#${slug}`}
        className="text-lg font-bold text-mccain-dark hover:text-mccain-green transition-colors leading-snug block"
      >
        {title}
      </Link>
      <p className="text-sm text-mccain-gray-dark mt-2 leading-relaxed">{excerpt}</p>
      <Link
        href={`/information-centre/news#${slug}`}
        className="inline-block mt-3 text-sm font-semibold text-mccain-green hover:text-mccain-green-dark transition-colors"
      >
        Read more &rarr;
      </Link>
    </div>
  );
}
