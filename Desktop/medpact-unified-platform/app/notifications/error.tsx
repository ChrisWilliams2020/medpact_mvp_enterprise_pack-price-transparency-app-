'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => reset()} className="w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
