"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border bg-card/80 p-8 text-center shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard error</p>
        <h1 className="mt-3 text-2xl font-semibold">We could not load this section</h1>
        <p className="mt-2 text-muted-foreground">
          Please try again. If it keeps happening, refresh the page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
