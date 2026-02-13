"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Home,
  Star,
  FolderOpen,
  KeyRound,
  Shield,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Lock, label: "Vault", href: "/dashboard/vault" },
  { icon: Star, label: "Favorites", href: "/dashboard/favorites" },
  { icon: FolderOpen, label: "Categories", href: "/dashboard/categories" },
  { icon: KeyRound, label: "Generator", href: "/dashboard/generator" },
  { icon: Shield, label: "Security", href: "/dashboard/security" },
  { icon: Activity, label: "Activity", href: "/dashboard/activity" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, isDesktop, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isDesktop ? (isOpen ? 256 : 80) : 280 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-transform duration-300 ${
        isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">KeyFort</span>
            </motion.div>
          )}
          {!isOpen && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={isDesktop ? undefined : onClose}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button - Only show on desktop */}
        {isDesktop && (
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-full"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
