import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-charcoal/10 bg-white">
      <div className="public-container grid gap-8 py-9 text-xs text-wgray lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-12">
        <div className="flex max-w-sm items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/desco-coin.png" alt="" className="mt-0.5 h-6 w-6 rounded-full" />
          <span className="leading-5">© {new Date().getFullYear()} Desco Global. DESCO Nexus is a demonstration environment.</span>
        </div>
        <nav aria-label="Explore" className="grid grid-cols-2 gap-x-8 font-semibold sm:grid-cols-4 lg:grid-cols-2">
          <Link href="/opportunities" className="inline-flex min-h-11 items-center hover:text-charcoal">Opportunities</Link>
          <Link href="/investors" className="inline-flex min-h-11 items-center hover:text-charcoal">For investors</Link>
          <Link href="/sponsors" className="inline-flex min-h-11 items-center hover:text-charcoal">For sponsors</Link>
          <Link href="/diligence" className="inline-flex min-h-11 items-center hover:text-charcoal">Diligence</Link>
          <Link href="/pricing" className="inline-flex min-h-11 items-center hover:text-charcoal">Commercial model</Link>
          <Link href="/partners" className="inline-flex min-h-11 items-center hover:text-charcoal">Partners</Link>
        </nav>
        <nav aria-label="Company and legal" className="grid grid-cols-2 gap-x-8 font-semibold lg:grid-cols-1">
          <Link href="/about" className="inline-flex min-h-11 items-center hover:text-charcoal">About</Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center hover:text-charcoal">Contact</Link>
          <Link href="/legal" className="inline-flex min-h-11 items-center hover:text-charcoal">Legal and security</Link>
        </nav>
      </div>
    </footer>
  );
}
