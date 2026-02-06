import Link from "next/link";

interface SidePanelProps {
  relatedLinks?: { label: string; href: string }[];
  showFaq?: boolean;
}

export default function SidePanel({ relatedLinks, showFaq = true }: SidePanelProps) {
  return (
    <aside className="space-y-8">
      {relatedLinks && relatedLinks.length > 0 && (
        <div className="bg-mccain-gray rounded-lg p-6">
          <h3 className="text-sm font-bold text-mccain-dark uppercase tracking-wide mb-4">Related</h3>
          <div className="space-y-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-semibold text-mccain-green hover:text-mccain-green-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      {showFaq && (
        <div className="bg-mccain-green rounded-lg p-6 text-white">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Questions</h3>
          <p className="text-sm text-white/80 mb-4">
            If you have any questions about McCain Foods, check out our FAQs.
          </p>
          <Link
            href="/information-centre/news"
            className="inline-block bg-white text-mccain-green font-semibold px-5 py-2 rounded text-sm hover:bg-mccain-yellow hover:text-mccain-dark transition-colors"
          >
            FAQs
          </Link>
        </div>
      )}
    </aside>
  );
}
