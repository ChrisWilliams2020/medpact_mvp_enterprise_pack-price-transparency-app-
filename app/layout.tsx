import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import type { Metadata } from "next";
import Script from "next/script";

// Google Analytics Measurement ID - set in Vercel env vars
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
// LinkedIn Insight Tag Partner ID - set in Vercel env vars
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

export const metadata: Metadata = {
  title: "MedPACT — Healthcare Intelligence Infrastructure™",
  description: "Real-time payer intelligence, price transparency, and AI automation for a fragmented healthcare system. Empowering physicians with actionable data leverage.",
  keywords: ["healthcare intelligence", "price transparency", "payer analytics", "ophthalmology", "medical practice management", "reimbursement analytics", "AI healthcare"],
  authors: [{ name: "MedPACT" }],
  creator: "MedPACT",
  publisher: "MedPACT",
  metadataBase: new URL("https://medpact-site-vscode-packet-v3.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medpact-site-vscode-packet-v3.vercel.app",
    siteName: "MedPACT",
    title: "MedPACT — Healthcare Intelligence Infrastructure™",
    description: "Real-time payer intelligence, price transparency, and AI automation. Empowering physicians with actionable data leverage.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MedPACT - Healthcare Intelligence Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedPACT — Healthcare Intelligence Infrastructure™",
    description: "Real-time payer intelligence, price transparency, and AI automation for healthcare.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* LinkedIn Insight Tag */}
        {LINKEDIN_PARTNER_ID && (
          <>
            <Script id="linkedin-insight" strategy="afterInteractive">
              {`
                _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              `}
            </Script>
            <Script id="linkedin-tracking" strategy="afterInteractive">
              {`
                (function(l) {
                  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[]}
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript";b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);})(window.lintrk);
              `}
            </Script>
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`} />
            </noscript>
          </>
        )}
      </head>
      <body>
        <ScrollAnimations />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
