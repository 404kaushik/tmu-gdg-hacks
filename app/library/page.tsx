"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Clock, Eye, Search, Filter } from "lucide-react"

const videoLibrary = [
  {
    id: 1,
    title: "Understanding Poverty: A Global Challenge",
    sdg: "SDG 1",
    duration: "2:15",
    views: "12.5K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Explore the root causes of poverty and learn about innovative solutions being implemented worldwide.",
    tags: ["Poverty", "Economics", "Social Justice"],
  },
  {
    id: 2,
    title: "Clean Energy Revolution",
    sdg: "SDG 7",
    duration: "1:45",
    views: "8.9K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Discover how renewable energy is transforming communities and creating sustainable futures.",
    tags: ["Energy", "Environment", "Technology"],
  },
  {
    id: 3,
    title: "Education for All: Breaking Barriers",
    sdg: "SDG 4",
    duration: "3:20",
    views: "15.2K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "See how quality education is changing lives and building stronger communities globally.",
    tags: ["Education", "Children", "Development"],
  },
  {
    id: 4,
    title: "Gender Equality in Action",
    sdg: "SDG 5",
    duration: "2:30",
    views: "9.7K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Learn about initiatives promoting gender equality and women's empowerment worldwide.",
    tags: ["Gender", "Equality", "Empowerment"],
  },
  {
    id: 5,
    title: "Climate Action Now",
    sdg: "SDG 13",
    duration: "2:45",
    views: "18.3K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Understand the urgency of climate action and discover solutions for a sustainable planet.",
    tags: ["Climate", "Environment", "Sustainability"],
  },
  {
    id: 6,
    title: "Clean Water Solutions",
    sdg: "SDG 6",
    duration: "1:55",
    views: "11.1K",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Explore innovative approaches to providing clean water and sanitation for all.",
    tags: ["Water", "Health", "Innovation"],
  },
]

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSDG, setSelectedSDG] = useState("all")
  const [filteredVideos, setFilteredVideos] = useState(videoLibrary)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterVideos(term, selectedSDG)
  }

  const handleSDGFilter = (sdg: string) => {
    setSelectedSDG(sdg)
    filterVideos(searchTerm, sdg)
  }

  const filterVideos = (search: string, sdg: string) => {
    let filtered = videoLibrary

    if (search) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase()) ||
          video.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (sdg !== "all") {
      filtered = filtered.filter((video) => video.sdg === sdg)
    }

    setFilteredVideos(filtered)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of engaging videos about the Sustainable Development Goals, created to educate and
            inspire action.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedSDG} onValueChange={handleSDGFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by SDG" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SDGs</SelectItem>
              <SelectItem value="SDG 1">SDG 1: No Poverty</SelectItem>
              <SelectItem value="SDG 4">SDG 4: Quality Education</SelectItem>
              <SelectItem value="SDG 5">SDG 5: Gender Equality</SelectItem>
              <SelectItem value="SDG 6">SDG 6: Clean Water</SelectItem>
              <SelectItem value="SDG 7">SDG 7: Clean Energy</SelectItem>
              <SelectItem value="SDG 13">SDG 13: Climate Action</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{video.sdg}</Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {video.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.views}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
