"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [scrolled, setScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      setShowStickyCTA(scrollY > 400); // Show after scrolling past hero
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled 
            ? "border-black/10 bg-white/95 backdrop-blur-lg shadow-sm" 
            : "border-black/10 bg-white/80 backdrop-blur"
        }`}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/medpact-logo.svg" 
              alt="MedPACT - Data Intelligence, Payer Transparency and Profitability" 
              width={220} 
              height={60} 
              className="h-14 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {/* Render PlatformLauncher for the platform item */}
            {links.map((l) =>
              l.href === "/platform" ? (
                <PlatformLauncher key={l.href} />
              ) : (
                <Link key={l.href} href={l.href} className="text-sm font-medium text-black/75 hover:text-black transition-colors">
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

      {/* Sticky CTA Bar - appears on scroll */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 transform transition-transform duration-300 ${
          showStickyCTA ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Container className="flex items-center justify-between">
          <div className="hidden sm:block">
            <span className="text-sm font-medium">Ready to transform your practice?</span>
            <span className="text-sm text-white/70 ml-2">Join the Healthcare Intelligence movement.</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Link href="/demo">
              <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                See Demo
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-5 py-2 bg-medpact-green text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors">
                Get Started →
              </button>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
