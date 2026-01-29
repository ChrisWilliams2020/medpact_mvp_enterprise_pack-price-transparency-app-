import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'MedPact Platinum - Enterprise Healthcare Revenue Optimization',
  description: 'Enterprise-grade healthcare revenue optimization platform with AI-powered analytics, workflow automation, and integrated consultant marketplace',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MedPact Platinum',
  },
  applicationName: 'MedPact Platinum',
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#7C3AED',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MedPact" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#7C3AED" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to APIs */}
        <link rel="preconnect" href="https://api.elevenlabs.io" />
        <link rel="preconnect" href="https://api.deepgram.com" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered:', registration))
                    .catch(error => console.log('SW registration failed:', error));
                });
              }
            `,
          }}
        />
        
        {/* Install PWA Prompt */}
        <Script
          id="pwa-install"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show install button if needed
                const installBtn = document.getElementById('pwa-install-btn');
                if (installBtn) {
                  installBtn.style.display = 'block';
                  installBtn.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                      deferredPrompt = null;
                    });
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
