"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateLayout = () => {
      setIsDesktop(mediaQuery.matches);
      setSidebarOpen(mediaQuery.matches);
    };

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        isDesktop={isDesktop}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />
      {!isDesktop && sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`transition-all duration-300 ${
          isDesktop ? (sidebarOpen ? "lg:ml-64" : "lg:ml-20") : "ml-0"
        }`}
      >
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
