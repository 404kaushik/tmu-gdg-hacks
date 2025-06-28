"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Target, TrendingUp, MessageCircle, Video, BookOpen } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { SDGOverview } from "@/components/sdg-overview"

const features = [
  {
    icon: Video,
    title: "AI Video Generation",
    description: "Create TikTok-style videos about SDGs with AI-powered content generation",
    href: "/generate",
  },
  {
    icon: Play,
    title: "Video Library",
    description: "Access pre-generated videos answering common questions about each SDG",
    href: "/library",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Interactive timeline charts showing progress for each sustainable goal",
    href: "/progress",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Chat with our AI to get instant answers about sustainable development",
    href: "/chat",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Curated links and materials for deeper understanding of SDGs",
    href: "/resources",
  },
  {
    icon: Target,
    title: "Goal Tracker",
    description: "Personal dashboard to track your contribution to the 2030 agenda",
    href: "/tracker",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to understand the SDGs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover, learn, and track progress on the UN's 2030 Sustainable Development Goals through interactive
            content and AI-powered insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* SDG Overview */}
      <SDGOverview />

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Start your SDG journey today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners making a difference through education and action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/generate">Create Your First Video</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/library">Explore Library</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
