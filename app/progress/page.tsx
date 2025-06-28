"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Calendar, Globe } from "lucide-react"

const sdgData = [
  {
    id: 1,
    title: "No Poverty",
    progress: 65,
    trend: "up",
    trendValue: "+3.2%",
    color: "bg-red-500",
    description: "End poverty in all its forms everywhere",
    milestones: [
      { year: 2015, value: 45, achieved: true },
      { year: 2020, value: 58, achieved: true },
      { year: 2025, value: 75, achieved: false },
      { year: 2030, value: 95, achieved: false },
    ],
  },
  {
    id: 2,
    title: "Zero Hunger",
    progress: 58,
    trend: "down",
    trendValue: "-1.8%",
    color: "bg-yellow-500",
    description: "End hunger, achieve food security and improved nutrition",
    milestones: [
      { year: 2015, value: 42, achieved: true },
      { year: 2020, value: 62, achieved: true },
      { year: 2025, value: 70, achieved: false },
      { year: 2030, value: 90, achieved: false },
    ],
  },
  {
    id: 3,
    title: "Good Health and Well-being",
    progress: 72,
    trend: "up",
    trendValue: "+2.1%",
    color: "bg-green-500",
    description: "Ensure healthy lives and promote well-being for all",
    milestones: [
      { year: 2015, value: 55, achieved: true },
      { year: 2020, value: 68, achieved: true },
      { year: 2025, value: 80, achieved: false },
      { year: 2030, value: 95, achieved: false },
    ],
  },
  {
    id: 4,
    title: "Quality Education",
    progress: 68,
    trend: "stable",
    trendValue: "0.0%",
    color: "bg-red-600",
    description: "Ensure inclusive and equitable quality education",
    milestones: [
      { year: 2015, value: 52, achieved: true },
      { year: 2020, value: 65, achieved: true },
      { year: 2025, value: 78, achieved: false },
      { year: 2030, value: 92, achieved: false },
    ],
  },
]

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SDG Progress Tracker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor real-time progress on the Sustainable Development Goals with interactive timelines and global
            statistics.
          </p>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">193</div>
              <div className="text-gray-600">Countries Participating</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-gray-600">Years Remaining</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">66%</div>
              <div className="text-gray-600">Average Progress</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SDG Progress Cards */}
        <div className="space-y-8">
          {sdgData.map((sdg, index) => (
            <motion.div
              key={sdg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${sdg.color} rounded-xl flex items-center justify-center text-white font-bold`}
                      >
                        {sdg.id}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{sdg.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{sdg.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sdg.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {sdg.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                      {sdg.trend === "stable" && <Minus className="h-4 w-4 text-gray-600" />}
                      <Badge
                        variant={sdg.trend === "up" ? "default" : sdg.trend === "down" ? "destructive" : "secondary"}
                      >
                        {sdg.trendValue}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Current Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-bold text-gray-900">{sdg.progress}%</span>
                      </div>
                      <Progress value={sdg.progress} className="h-3" />
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Milestone Timeline</h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-4">
                          {sdg.milestones.map((milestone, idx) => (
                            <div key={milestone.year} className="relative flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium z-10 ${
                                  milestone.achieved
                                    ? "bg-green-500 border-green-500 text-white"
                                    : milestone.year <= 2024
                                      ? "bg-yellow-500 border-yellow-500 text-white"
                                      : "bg-white border-gray-300 text-gray-600"
                                }`}
                              >
                                {milestone.year === 2024 ? "•" : milestone.achieved ? "✓" : milestone.year}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-900">{milestone.year}</span>
                                  <span className="text-sm text-gray-600">{milestone.value}% target</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
