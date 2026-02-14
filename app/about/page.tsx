"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Users, Target, Award, Heart, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const team = [
    {
      name: "Security Team",
      role: "Keeping Your Data Safe",
      icon: Shield,
    },
    {
      name: "Development Team",
      role: "Building the Future",
      icon: Users,
    },
    {
      name: "Support Team",
      role: "Always Here for You",
      icon: Heart,
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We never compromise on security. Your data protection is our top priority.",
    },
    {
      icon: Heart,
      title: "User Focused",
      description: "Every feature is designed with your needs and experience in mind.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously improve and adopt the latest security standards.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest quality in everything we build.",
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
              About <span className="text-emerald-500">KeyFort</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're on a mission to make password security simple, accessible, and trustworthy for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                In today's digital world, managing passwords has become increasingly complex. 
                We believe everyone deserves access to bank-level security without the complexity.
              </p>
              <p className="text-lg text-muted-foreground">
                KeyFort was built to provide enterprise-grade password management that's simple 
                enough for everyone to use, yet powerful enough for the most demanding users.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-navy-600/20 backdrop-blur-sm border border-cyan-500/30 p-12 flex items-center justify-center">
                <Lock className="w-48 h-48 text-emerald-500/40" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Dedicated professionals working to keep you secure
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <member.icon className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-navy-700 via-navy-600 to-charcoal-700 p-12 text-white shadow-2xl border border-cyan-500/30"
          >
            <h2 className="text-4xl font-bold mb-4">Join Us on Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the future of password security today
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
