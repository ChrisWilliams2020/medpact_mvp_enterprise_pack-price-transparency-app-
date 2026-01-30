'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface PageNavigationProps {
  previousPage?: {
    title: string;
    path: string;
  };
  nextPage?: {
    title: string;
    path: string;
  };
  showHome?: boolean;
}

export function PageNavigation({ previousPage, nextPage, showHome = true }: PageNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex-1">
        {previousPage && (
          <Button
            variant="ghost"
            onClick={() => router.push(previousPage.path)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{previousPage.title}</span>
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-center">
        {showHome && pathname !== '/' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextPage && (
          <Button
            variant="ghost"
            onClick={() => router.push(nextPage.path)}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">{nextPage.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
