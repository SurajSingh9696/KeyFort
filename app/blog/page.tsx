"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BlogPage() {
  const posts = [
    {
      title: "10 Best Practices for Password Security in 2026",
      excerpt: "Learn the essential tips to keep your passwords secure and protect your digital identity.",
      date: "Feb 14, 2026",
      readTime: "5 min read",
      category: "Security",
    },
    {
      title: "How Zero-Knowledge Architecture Protects Your Data",
      excerpt: "Understanding the technology that ensures even we can't access your sensitive information.",
      date: "Feb 10, 2026",
      readTime: "7 min read",
      category: "Technology",
    },
    {
      title: "The Rising Importance of Password Managers",
      excerpt: "Why using a password manager is no longer optional in today's digital landscape.",
      date: "Feb 5, 2026",
      readTime: "4 min read",
      category: "Industry",
    },
    {
      title: "AES-256 Encryption Explained",
      excerpt: "A deep dive into the military-grade encryption that protects your passwords.",
      date: "Jan 28, 2026",
      readTime: "8 min read",
      category: "Technology",
    },
    {
      title: "Multi-Factor Authentication: Why It Matters",
      excerpt: "How 2FA adds an extra layer of security to your password vault.",
      date: "Jan 20, 2026",
      readTime: "6 min read",
      category: "Security",
    },
    {
      title: "Creating Strong Passwords: A Complete Guide",
      excerpt: "Master the art of creating unbreakable passwords with our comprehensive guide.",
      date: "Jan 15, 2026",
      readTime: "5 min read",
      category: "Tips",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-500/5">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">KeyFort</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              KeyFort <span className="text-emerald-500">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Security insights, tips, and updates from our team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg cursor-pointer group">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-emerald-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-emerald-500" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-navy-700 via-navy-600 to-charcoal-700 p-12 text-center text-white shadow-2xl border border-cyan-500/30"
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest security tips and updates delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
