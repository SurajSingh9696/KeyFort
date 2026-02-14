"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, FileText, CheckCircle, AlertCircle, Scale, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: [
        "By accessing KeyFort, you agree to be bound by these Terms of Service",
        "You must be at least 18 years old to use this service",
        "You are responsible for maintaining the confidentiality of your account",
        "You agree to notify us immediately of any unauthorized access",
      ],
    },
    {
      icon: FileText,
      title: "Service Description",
      content: [
        "KeyFort provides secure password management and storage",
        "We reserve the right to modify or discontinue features with notice",
        "Service availability is not guaranteed and may have scheduled maintenance",
        "Free tier has feature limitations compared to premium plans",
      ],
    },
    {
      icon: Scale,
      title: "User Responsibilities",
      content: [
        "You are responsible for all content stored in your vault",
        "You must not use the service for illegal activities",
        "You must maintain a strong master password",
        "You agree not to share your account with others",
      ],
    },
    {
      icon: AlertCircle,
      title: "Limitations of Liability",
      content: [
        "The service is provided 'as is' without warranties",
        "We are not liable for data loss due to forgotten master passwords",
        "We are not responsible for unauthorized access due to user negligence",
        "Maximum liability is limited to fees paid in the last 12 months",
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
              Terms of <span className="text-emerald-500">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Please read these terms carefully before using KeyFort
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

      {/* Additional Terms */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card"
          >
            <h2 className="text-2xl font-bold mb-4">Account Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to terminate accounts that violate these terms. You may also delete your account at any time from the settings page.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card"
          >
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may update these terms from time to time. We will notify you of any material changes via email or through the service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card"
          >
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms are governed by the laws of the jurisdiction in which KeyFort operates. Any disputes will be resolved through binding arbitration.
            </p>
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
            <h2 className="text-4xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our legal team for clarification
            </p>
            <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
              Contact Legal Team
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
