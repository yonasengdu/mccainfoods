import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-mccain-green text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <Image
              src="https://www.mccain.com/images/logo-mccain.png"
              alt="McCain Logo"
              width={120}
              height={35}
              className="brightness-0 invert h-8 w-auto"
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="#" className="hover:text-mccain-yellow transition-colors">
              Global Privacy Policy
            </Link>
            <Link href="#" className="hover:text-mccain-yellow transition-colors">
              Legal Information
            </Link>
            <Link href="#" className="hover:text-mccain-yellow transition-colors">
              Cookies
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-white/70">
          &copy; {new Date().getFullYear()} McCain Foods Limited
        </div>
      </div>
    </footer>
  );
}
