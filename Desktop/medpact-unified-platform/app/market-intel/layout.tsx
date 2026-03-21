import { MainNav } from '@/components/layout/MainNav';

export default function MarketIntelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <main>{children}</main>
    </div>
  );
}
