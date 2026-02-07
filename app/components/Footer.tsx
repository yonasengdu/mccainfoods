import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-mccain-green to-mccain-green-dark text-white overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/[0.03]" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-mccain-yellow/[0.05]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Top section */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-6">
          <Link href="/" className="group">
            <Image
              src="https://www.mccain.com/images/logo-mccain.png"
              alt="McCain Logo"
              width={110}
              height={32}
              className="brightness-0 invert h-6 sm:h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Links */}
          <div className="flex items-center gap-3 sm:gap-6">
            {["Privacy Policy", "Legal", "Cookies"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-[11px] sm:text-sm text-white/50 hover:text-mccain-yellow transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 border-t border-white/10" />

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-[10px] sm:text-xs text-white/40 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} McCain Foods Limited. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/company/mccainfoods/", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
              { label: "Instagram", href: "https://www.instagram.com/mccainglobal/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-mccain-yellow/20 hover:text-mccain-yellow flex items-center justify-center transition-all"
                aria-label={social.label}
              >
                <svg className="w-3.5 h-3.5 text-white/60 hover:text-mccain-yellow transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
