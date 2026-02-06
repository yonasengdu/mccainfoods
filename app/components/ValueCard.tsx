interface ValueCardProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function ValueCard({ title, subtitle, description }: ValueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-mccain-green hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-mccain-green">{title}</h3>
      <p className="text-sm font-semibold text-mccain-yellow mt-1">{subtitle}</p>
      <p className="text-sm text-mccain-gray-dark mt-3 leading-relaxed">{description}</p>
    </div>
  );
}
