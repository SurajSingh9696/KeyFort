"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/test")
      .then((res) => res.json())
      .then((data) => setApiData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="p-8 max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-bold">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded">
            <h2 className="font-semibold mb-2">Client Session Status</h2>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Authenticated:</strong> {status === "authenticated" ? "Yes" : "No"}</p>
            {session && (
              <div className="mt-2 p-2 bg-background rounded text-xs">
                <pre>{JSON.stringify(session, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="p-4 bg-secondary rounded">
            <h2 className="font-semibold mb-2">Server Session Check</h2>
            {apiData ? (
              <div>
                <p><strong>Server Authenticated:</strong> {apiData.authenticated ? "Yes" : "No"}</p>
                <div className="mt-2 p-2 bg-background rounded text-xs">
                  <pre>{JSON.stringify(apiData, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/")}>
              Go to Home
            </Button>
            <Button onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
