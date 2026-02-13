"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchJson } from "@/lib/api";
import { calculateSecurityScore, getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/security";

export default function SecurityPage() {
  const [securityScore, setSecurityScore] = useState(0);
  const [weakPasswords, setWeakPasswords] = useState<any[]>([]);
  const [reusedPasswords, setReusedPasswords] = useState<any[]>([]);
  const [oldPasswords, setOldPasswords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const items = await fetchJson<any[]>("/api/vault");
      const analysis = calculateSecurityScore(items);

      setWeakPasswords(analysis.weakPasswords);
      setOldPasswords(analysis.oldPasswords);
      setReusedPasswords(analysis.reusedPasswords);
      setSecurityScore(analysis.score);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load security data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Security Health</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor your KeyFort security</p>
      </div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Overall Security Score</CardTitle>
            <CardDescription>Based on password strength and vault health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(securityScore)}`}>
                {isLoading ? "--" : `${securityScore}%`}
              </div>
              <div className="max-w-md mx-auto">
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getScoreBgColor(securityScore)}`}
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </div>
              <p className="text-muted-foreground">
                {securityScore >= 80
                  ? "Excellent! Your vault is secure."
                  : securityScore >= 60
                  ? "Good, but there's room for improvement."
                  : "Action needed! Please address the issues below."}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Issues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weak Passwords</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "--" : weakPasswords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : weakPasswords.length === 0 ? "All strong" : "Need attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reused Passwords</CardTitle>
            <Shield className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "--" : reusedPasswords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : reusedPasswords.length === 0 ? "All unique" : "Should be unique"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Old Passwords</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "--" : oldPasswords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : oldPasswords.length === 0 ? "All recent" : "Over 90 days old"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakPasswords.length > 0 && (
              <div className="flex items-start gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Update Weak Passwords</h4>
                  <p className="text-sm text-muted-foreground">
                    {weakPasswords.length} password(s) are weak. Use the password generator to
                    create stronger ones.
                  </p>
                </div>
              </div>
            )}

            {oldPasswords.length > 0 && (
              <div className="flex items-start gap-3 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Update Old Passwords</h4>
                  <p className="text-sm text-muted-foreground">
                    {oldPasswords.length} password(s) haven&apos;t been changed in over 90 days.
                    Consider updating them.
                  </p>
                </div>
              </div>
            )}

            {reusedPasswords.length > 0 && (
              <div className="flex items-start gap-3 p-4 border border-orange-500/20 bg-orange-500/5 rounded-lg">
                <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Avoid Reused Passwords</h4>
                  <p className="text-sm text-muted-foreground">
                    {reusedPasswords.length} password(s) appear more than once. Use unique
                    passwords to reduce risk.
                  </p>
                </div>
              </div>
            )}

            {weakPasswords.length === 0 && oldPasswords.length === 0 && reusedPasswords.length === 0 && (
              <div className="flex items-start gap-3 p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Great Job!</h4>
                  <p className="text-sm text-muted-foreground">
                    Your KeyFort is secure with no major issues detected.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
