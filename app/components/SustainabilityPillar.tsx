import Image from "next/image";
import Link from "next/link";

interface SustainabilityPillarProps {
  icon: string;
  title: string;
  href: string;
}

export default function SustainabilityPillar({ icon, title, href }: SustainabilityPillarProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-mccain-gray transition-colors group"
    >
      <div className="relative w-20 h-20 mb-4">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-sm font-bold text-mccain-green group-hover:text-mccain-green-dark transition-colors leading-snug">
        {title}
      </h3>
    </Link>
  );
}
