"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface CalendlyButtonProps {
  url?: string;
  text?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
}

/**
 * Calendly Integration Button
 * 
 * Set NEXT_PUBLIC_CALENDLY_URL in env vars to your Calendly scheduling link
 * Example: https://calendly.com/medpact/executive-briefing
 */
export function CalendlyButton({ 
  url, 
  text = "Schedule a Meeting", 
  className = "",
  prefill
}: CalendlyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL;
  
  if (!calendlyUrl) {
    return null; // Don't render if no Calendly URL configured
  }

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: calendlyUrl,
        prefill: prefill || {},
      });
    }
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => setIsLoaded(true)}
      />
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <button
        onClick={openCalendly}
        disabled={!isLoaded}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {text}
      </button>
    </>
  );
}

/**
 * Inline Calendly Embed
 * Embeds Calendly directly in the page
 */
export function CalendlyInline({ 
  url,
  height = "700px",
  className = ""
}: { 
  url?: string;
  height?: string;
  className?: string;
}) {
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL;
  
  if (!calendlyUrl) {
    return null;
  }

  return (
    <div 
      className={`calendly-inline-widget ${className}`}
      data-url={calendlyUrl}
      style={{ minWidth: '320px', height }}
    >
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
