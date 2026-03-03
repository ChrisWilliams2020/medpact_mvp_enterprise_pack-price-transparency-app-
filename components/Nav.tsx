import Link from "next/link";
import { Container, Button } from "@/components/ui";
import PlatformLauncher from "@/components/PlatformLauncher";

  const links = [
    // Platform will be rendered as a launcher button (video modal)
    { href: "/platform", label: "Platform" },
  { href: "/category", label: "Healthcare Intelligence Infrastructure™" },
  { href: "/manifesto", label: "Post‑PE Era" },
  { href: "/team", label: "Team" },
  { href: "/resources", label: "Resources" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-gradient-to-br from-medpact-green to-medpact-blue" />
          <span className="text-lg md:text-2xl font-extrabold tracking-tight">MedPACT</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {/* Render PlatformLauncher for the platform item */}
          {links.map((l) =>
            l.href === "/platform" ? (
              <PlatformLauncher key={l.href} />
            ) : (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-black/75 hover:text-black">
                {l.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden md:block">
            <Button>Request Executive Briefing</Button>
          </Link>
          <Link href="/contact" className="md:hidden">
            <Button>Briefing</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
