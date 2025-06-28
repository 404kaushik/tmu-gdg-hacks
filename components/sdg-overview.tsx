"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const sdgGoals = [
  { id: 1, title: "No Poverty", progress: 65, color: "bg-red-500" },
  { id: 2, title: "Zero Hunger", progress: 58, color: "bg-yellow-500" },
  { id: 3, title: "Good Health", progress: 72, color: "bg-green-500" },
  { id: 4, title: "Quality Education", progress: 68, color: "bg-red-600" },
  { id: 5, title: "Gender Equality", progress: 61, color: "bg-orange-500" },
  { id: 6, title: "Clean Water", progress: 55, color: "bg-blue-400" },
  { id: 7, title: "Clean Energy", progress: 78, color: "bg-yellow-400" },
  { id: 8, title: "Economic Growth", progress: 63, color: "bg-red-700" },
]

export function SDGOverview() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Progress Overview</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track real-time progress on the Sustainable Development Goals worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sdgGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-8 h-8 ${goal.color} rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3`}
                    >
                      {goal.id}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{goal.title}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
