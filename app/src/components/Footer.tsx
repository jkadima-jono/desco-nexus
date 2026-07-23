import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wgray">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/desco-coin.png" alt="" className="w-5 h-5 rounded-full" />
          <span>© {new Date().getFullYear()} Desco Global. DESCO Nexus is a demonstration environment.</span>
        </div>
        <nav aria-label="Footer" className="flex gap-5 font-semibold">
          <Link href="/legal" className="hover:text-charcoal">Privacy</Link>
          <Link href="/legal" className="hover:text-charcoal">Terms</Link>
          <Link href="/legal" className="hover:text-charcoal">Security</Link>
          <Link href="/contact" className="hover:text-charcoal">Contact</Link>
          <Link href="/pillars" className="hover:text-charcoal">Our Pillars</Link>
        </nav>
      </div>
    </footer>
  );
}
