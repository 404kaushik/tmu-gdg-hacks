"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Share2, Wand2, Loader2 } from "lucide-react"

const sdgOptions = [
  { value: "1", label: "No Poverty" },
  { value: "2", label: "Zero Hunger" },
  { value: "3", label: "Good Health and Well-being" },
  { value: "4", label: "Quality Education" },
  { value: "5", label: "Gender Equality" },
  { value: "6", label: "Clean Water and Sanitation" },
  { value: "7", label: "Affordable and Clean Energy" },
  { value: "8", label: "Decent Work and Economic Growth" },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [selectedSDG, setSelectedSDG] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt || !selectedSDG) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent({
        script: `Here's an engaging script about ${sdgOptions.find((s) => s.value === selectedSDG)?.label}:\n\n${prompt}\n\nThis connects to sustainable development by addressing key challenges and solutions that impact our global community. Through collective action and awareness, we can make meaningful progress toward achieving this goal by 2030.`,
        videoUrl: "/placeholder.svg?height=400&width=600",
        duration: "0:45",
        style: "TikTok Vertical",
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Video Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create engaging TikTok-style videos about the Sustainable Development Goals with AI-powered content
            generation and narration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-blue-600" />
                  Create Your Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select SDG Topic</label>
                  <Select value={selectedSDG} onValueChange={setSelectedSDG}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Sustainable Development Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sdgOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          SDG {option.value}: {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Content Idea</label>
                  <Textarea
                    placeholder="Describe what you want your video to be about. For example: 'Explain how renewable energy can help communities in developing countries access clean electricity while reducing carbon emissions.'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt || !selectedSDG || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Preview & Export</CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600">Creating your video...</p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="space-y-6">
                    {/* Video Preview */}
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <img
                        src={generatedContent.videoUrl || "/placeholder.svg"}
                        alt="Generated video preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                          <Play className="h-6 w-6 text-white" />
                        </Button>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{generatedContent.duration}</Badge>
                        <Badge variant="secondary">{generatedContent.style}</Badge>
                      </div>
                    </div>

                    {/* Generated Script */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI-Generated Script</h4>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
                        {generatedContent.script}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Your generated video will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
