"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Shield, Eye, Database, UserCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Account information (email, name) for authentication",
        "Encrypted vault data that only you can decrypt",
        "Usage data to improve our services",
        "Device and browser information for security",
      ],
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our password management service",
        "To authenticate and secure your account",
        "To detect and prevent security threats",
        "To improve our features and user experience",
      ],
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      content: [
        "Your master password is never transmitted to our servers",
        "All vault data is encrypted on your device before sync",
        "We cannot access or recover your encrypted data",
        "Only you have the keys to decrypt your information",
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and download your data at any time",
        "Request deletion of your account and data",
        "Opt-out of optional data collection",
        "Export your vault to another service",
      ],
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
              Privacy <span className="text-emerald-500">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your privacy is our priority. Here&apos;s how we protect your data.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: February 14, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card"
          >
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-leading security measures to protect your data:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>AES-256 bit encryption for all vault data</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>TLS 1.3 for data transmission</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>Regular security audits and penetration testing</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>GDPR and CCPA compliant data handling</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-navy-700 via-navy-600 to-charcoal-700 p-12 text-white shadow-2xl border border-cyan-500/30"
          >
            <h2 className="text-4xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our privacy team for any concerns or questions
            </p>
            <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
              Contact Privacy Team
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
