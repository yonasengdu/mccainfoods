import Image from "next/image";

interface LeaderCardProps {
  name: string;
  title: string;
  image: string;
}

export default function LeaderCard({ name, title, image }: LeaderCardProps) {
  return (
    <div className="text-center group">
      <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-mccain-gray">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="font-bold text-mccain-dark text-sm">{name}</h3>
      <p className="text-xs text-mccain-gray-dark mt-1">{title}</p>
    </div>
  );
}
