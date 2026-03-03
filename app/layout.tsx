import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "MedPACT — Healthcare Intelligence Infrastructure™",
  description: "Real-time payer intelligence, price transparency, and AI automation for a fragmented healthcare system.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
