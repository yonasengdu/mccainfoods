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
    <Link href={href} className="group block relative overflow-hidden rounded-lg shadow-lg h-[320px]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold">
          {title}
          <span className="text-mccain-yellow">.</span>
        </h3>
        <p className="text-sm font-medium text-mccain-yellow mt-1">{subtitle}</p>
        <p className="text-sm text-white/80 mt-1">{description}</p>
      </div>
    </Link>
  );
}
