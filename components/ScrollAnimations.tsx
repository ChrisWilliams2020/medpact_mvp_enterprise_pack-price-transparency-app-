"use client";

import { useEffect } from "react";

/**
 * ScrollAnimations Component
 * 
 * Add this component once in your layout or page to enable
 * scroll-triggered animations throughout the site.
 * 
 * Usage: Add these classes to elements you want to animate:
 * - scroll-animate: Fade up on scroll
 * - scroll-slide-left: Slide in from left
 * - scroll-slide-right: Slide in from right
 * - scroll-scale: Scale up on scroll
 * 
 * Add delay classes for staggered effects:
 * - scroll-delay-1 through scroll-delay-5
 */
export function ScrollAnimations() {
  useEffect(() => {
    // Check for IntersectionObserver support
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: just show everything
      document.querySelectorAll(".scroll-animate, .scroll-slide-left, .scroll-slide-right, .scroll-scale").forEach(el => {
        el.classList.add("in-view");
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is fully visible
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Optionally unobserve after animation (better performance)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      ".scroll-animate, .scroll-slide-left, .scroll-slide-right, .scroll-scale"
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * AnimatedSection Component
 * 
 * A wrapper component for sections that should animate on scroll.
 * Easier to use than adding classes manually.
 */
interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: "fade-up" | "slide-left" | "slide-right" | "scale";
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function AnimatedSection({ 
  children, 
  animation = "fade-up", 
  delay,
  className = "" 
}: AnimatedSectionProps) {
  const animationClass = {
    "fade-up": "scroll-animate",
    "slide-left": "scroll-slide-left",
    "slide-right": "scroll-slide-right",
    "scale": "scroll-scale",
  }[animation];

  const delayClass = delay ? `scroll-delay-${delay}` : "";

  return (
    <div className={`${animationClass} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}
