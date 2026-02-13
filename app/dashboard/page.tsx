"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Star, FolderOpen, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { fetchJson } from "@/lib/api";
import { calculateSecurityScore } from "@/lib/security";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPasswords: 0,
    favorites: 0,
    categories: 0,
    securityScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vault, categories] = await Promise.all([
          fetchJson<any[]>("/api/vault"),
          fetchJson<any[]>("/api/categories"),
        ]);

        const securityAnalysis = calculateSecurityScore(vault);

        setStats({
          totalPasswords: vault.length,
          favorites: vault.filter((item: any) => item.isFavorite).length,
          categories: categories.length,
          securityScore: securityAnalysis.score,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard stats",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Passwords",
      value: stats.totalPasswords,
      icon: Lock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Favorites",
      value: stats.favorites,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Security Score",
      value: `${stats.securityScore}%`,
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Here&apos;s an overview of your KeyFort dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "--" : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/vault"
              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <Lock className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-medium">Add Password</h3>
              <p className="text-sm text-muted-foreground">Store a new password securely</p>
            </a>
            <a
              href="/dashboard/generator"
              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <TrendingUp className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-medium">Generate Password</h3>
              <p className="text-sm text-muted-foreground">Create a strong password</p>
            </a>
            <a
              href="/dashboard/security"
              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <Shield className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-medium">Security Check</h3>
              <p className="text-sm text-muted-foreground">Review password health</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
