"use client";

import { useEffect } from "react";
import { Container, Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[App Error]", error);
  }, [error]);

  return (
    <main>
      <Container className="py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-4 text-black/70">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="secondary" onClick={() => window.location.href = "/"}>
              Return Home
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 rounded-xl bg-red-50 border border-red-200 text-left">
              <div className="text-xs font-mono text-red-700 break-all">
                {error.message}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
