"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mainNav, socialLinks } from "@/app/data/navigation";
import { useAuth } from "@/app/components/AuthProvider";


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const lastTapRef = useRef<number>(0);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleLogoTap = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastTapRef.current < 500) {
        e.preventDefault();
        router.push("/admin");
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
    },
    [router]
  );

  const profileHref = isLoggedIn ? "/admin" : "/login";

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with double-tap to navigate to admin */}
          <Link href="/" onClick={handleLogoTap} className="flex-shrink-0">
            <Image
              src="https://www.mccain.com/images/logo-mccain.png"
              alt="McCain Logo"
              width={200}
              height={58}
              className="h-14 sm:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-semibold text-mccain-dark hover:text-mccain-green transition-colors"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  {item.label}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg min-w-[240px] py-2 border-t-2 border-mccain-green">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2.5 text-sm text-mccain-dark hover:bg-mccain-gray hover:text-mccain-green transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Profile icon - desktop */}
            <Link
              href={profileHref}
              className="ml-2 p-2 rounded-full hover:bg-mccain-gray transition-colors"
              aria-label="Profile"
            >
              <svg className="w-6 h-6 text-mccain-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {isLoggedIn && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-mccain-green rounded-full border-2 border-white" />
              )}
            </Link>
          </nav>

          {/* Mobile right side: profile icon + menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={profileHref}
              className="p-2 text-mccain-dark relative"
              aria-label="Profile"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {isLoggedIn && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-mccain-green rounded-full border-2 border-white" />
              )}
            </Link>
            <button
              className="p-2 text-mccain-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-gray-100 last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-semibold text-mccain-dark hover:text-mccain-green"
                  onClick={() => setMobileMenuOpen(false)}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm text-mccain-gray-dark hover:text-mccain-green"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
