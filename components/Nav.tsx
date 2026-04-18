import Link from "next/link";
import { JourneyBadge } from "./JourneyBadge";

export function Nav() {
  return (
    <header className="w-full border-b-2 border-ink/10 bg-parchment/85 backdrop-blur-[2px] sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          aria-label="The Atlas — home"
          className="flex items-baseline gap-2 group"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            The Atlas
          </span>
          <span className="font-hand text-ochre text-lg -ml-1 opacity-90 group-hover:translate-y-[1px] transition-transform">
            &mdash; a journal for graphs
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <NavLink href="/learn">Atlas</NavLink>
          <NavLink href="/playground">Playground</NavLink>
          <NavLink href="/journey">Journey</NavLink>
          <div className="ml-2 pl-3 border-l border-parchment-edge">
            <JourneyBadge />
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-sm text-ink-soft hover:text-ink hover:bg-parchment-deep/60 transition-colors"
    >
      {children}
    </Link>
  );
}
