import Link from "next/link";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-black/10">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-medpact-green to-medpact-blue" />
            <div className="text-base md:text-lg font-extrabold">MedPACT</div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-black/70">
            <Link href="/platform" className="hover:text-black">Platform</Link>
            <Link href="/category" className="hover:text-black">Category</Link>
            <Link href="/manifesto" className="hover:text-black">Manifesto</Link>
            <Link href="/team" className="hover:text-black">Team</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-xs text-black/50">
          © {new Date().getFullYear()} MedPACT, Inc. All rights reserved. Outcomes vary by organization; nothing on this site constitutes a guarantee of results.
        </div>
      </Container>
    </footer>
  );
}
