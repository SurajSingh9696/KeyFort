"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Shield, Key, Eye, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  const features = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Military-grade encryption protects your data both at rest and in transit. This is the same standard used by governments and banks worldwide.",
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description: "Your master password never leaves your device. We cannot access your vault data even if we wanted to - only you hold the encryption keys.",
    },
    {
      icon: Key,
      title: "End-to-End Encryption",
      description: "Data is encrypted on your device before being sent to our servers. Only you can decrypt it with your master password.",
    },
    {
      icon: Shield,
      title: "Multi-Factor Authentication",
      description: "Add an extra layer of security with 2FA options including authenticator apps, SMS, and biometric authentication.",
    },
  ];

  const practices = [
    {
      icon: CheckCircle,
      title: "Regular Security Audits",
      description: "Third-party security experts regularly audit our code and infrastructure",
      status: "active",
    },
    {
      icon: CheckCircle,
      title: "Penetration Testing",
      description: "We conduct regular penetration tests to identify and fix vulnerabilities",
      status: "active",
    },
    {
      icon: CheckCircle,
      title: "SOC 2 Compliance",
      description: "We maintain SOC 2 Type II certification for data security",
      status: "active",
    },
    {
      icon: CheckCircle,
      title: "Bug Bounty Program",
      description: "We reward security researchers who help us improve",
      status: "active",
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
              Security <span className="text-emerald-500">First</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your trust is our responsibility. Here's how we protect your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Encryption & Security</h2>
            <p className="text-xl text-muted-foreground">
              Bank-level security for your passwords
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Security Practices</h2>
            <p className="text-xl text-muted-foreground">
              Continuous monitoring and improvement
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {practices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex-shrink-0">
                  <practice.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                  <p className="text-muted-foreground text-sm">{practice.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Incident Response</h2>
                <p className="text-muted-foreground mb-4">
                  In the unlikely event of a security incident, we have a comprehensive response plan:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>Immediate notification to affected users</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>Transparent communication about the incident</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>Swift remediation and security updates</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>Post-incident analysis and improvements</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-navy-700 via-navy-600 to-charcoal-700 p-12 text-white shadow-2xl border border-cyan-500/30"
          >
            <h2 className="text-4xl font-bold mb-4">Found a Security Issue?</h2>
            <p className="text-xl mb-8 opacity-90">
              We welcome responsible security disclosures and offer rewards
            </p>
            <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
              Report Security Issue
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
