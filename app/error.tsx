"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border bg-card/80 p-8 text-center shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold">We hit a snag loading this page</h1>
        <p className="mt-2 text-muted-foreground">
          Try again in a moment. If the issue persists, check your connection or reload the page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
