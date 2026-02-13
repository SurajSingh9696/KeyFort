"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { fetchJson } from "@/lib/api";

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  ipAddress: string | null;
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const data = await fetchJson<ActivityLog[]>("/api/activity");
      setLogs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <LogIn className="w-4 h-4" />;
      case "LOGOUT":
        return <LogOut className="w-4 h-4" />;
      case "CREATE_ITEM":
        return <Plus className="w-4 h-4" />;
      case "UPDATE_ITEM":
        return <Edit className="w-4 h-4" />;
      case "DELETE_ITEM":
        return <Trash2 className="w-4 h-4" />;
      case "ACCESS_ITEM":
        return <Eye className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-green-500/10 text-green-500";
      case "LOGOUT":
        return "bg-gray-500/10 text-gray-500";
      case "CREATE_ITEM":
        return "bg-blue-500/10 text-blue-500";
      case "UPDATE_ITEM":
        return "bg-yellow-500/10 text-yellow-500";
      case "DELETE_ITEM":
        return "bg-red-500/10 text-red-500";
      case "ACCESS_ITEM":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Activity Log</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track all actions in your vault</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your vault activity history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No activity yet</div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(log.createdAt)}
                        </div>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
