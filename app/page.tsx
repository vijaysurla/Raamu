"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  MicOff,
  Brain,
  Calendar,
  MapPin,
  Clock,
  CheckSquare,
  Sparkles,
  MessageCircle,
  Users,
  ArrowRight,
  Play,
  Check,
  X,
  RefreshCw,
  Star,
} from "lucide-react"

// Add this interface at the top of the file, before the component
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
}

interface ExtractedData {
  tasks: Array<{
    task: string
    priority: "low" | "medium" | "high"
    deadline?: string
    context: string
    completed?: boolean
  }>
  appointments: Array<{
    title: string
    date: string
    time?: string
    location?: string
    participants?: string[]
    cancelled?: boolean
  }>
  locations: Array<{
    name: string
    context: string
    actionRequired: boolean
  }>
  deadlines: Array<{
    item: string
    date: string
    urgency: "low" | "medium" | "high"
    resolved?: boolean
  }>
  summary: string
}

const sampleConversation = `Conversation Log - June 20th, 2025

[7:30 AM - Kitchen - Sarah (Mom) and Mark (Dad)]

Sarah: Morning, honey. Did you remember to take out the recycling last night? The truck comes early on Fridays.
Mark: Oh, shoot! No, I totally forgot. I'll do it right now before I jump on my first call. Is the blue bin full too?
Sarah: Yep, both of them. Thanks. And hey, quick reminder: Lily has her swim lesson at the community pool this afternoon, 3:30 sharp. I can't take her because of that dentist appointment.
Mark: Right, the dentist. What time is your appointment again?
Sarah: 1:00 PM at Dr. Chen's office downtown. I need to leave by 12:30 to make it on time with traffic. Can you pick Lily up from school today?
Mark: Yeah, I can do school pick-up. I'll leave the office around 2:45 PM to get there by 3:00 PM. So after school, I'll take her straight to the pool. Do you need anything from the grocery store on your way back from the dentist?
Sarah: Oh, definitely. We're completely out of milk, and grab some more of those granola bars Lily likes, the chocolate chip ones. Also, I need some fresh basil for dinner tonight. And if you see any good ripe avocados, just a couple.
Mark: Got it. Milk, chocolate chip granola bars, basil, and a couple of avocados. Sounds like a plan. I'll try to swing by Safeway.`

export default function RaamuLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }
  const [showDemo, setShowDemo] = useState(false)
  const [conversationText, setConversationText] = useState("")
  const [lastProcessedLength, setLastProcessedLength] = useState(0)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }

          setConversationText((prev) => {
            const lines = prev.split("\n")
            const lastLine = lines[lines.length - 1]

            if (finalTranscript) {
              // Add final transcript to the conversation
              const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              const newLine = `[${timestamp}] ${finalTranscript.trim()}`
              const newText = prev + (prev ? "\n" : "") + newLine

              // Auto-process new speech after a short delay
              setTimeout(() => {
                if (extractedData) {
                  handleExtraction()
                }
              }, 2000) // Process after 2 seconds of new speech

              return newText
            } else if (interimTranscript) {
              // Show interim results
              const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              const interimLine = `[${timestamp}] ${interimTranscript}...`

              if (lastLine.includes("...")) {
                // Replace the last interim line
                lines[lines.length - 1] = interimLine
                return lines.join("\n")
              } else {
                // Add new interim line
                return prev + (prev ? "\n" : "") + interimLine
              }
            }

            return prev
          })
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
        setIsRecognitionSupported(true)
      } else {
        setIsRecognitionSupported(false)
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      // Don't clear data when starting to listen - just continue from where we left off
      // Only clear if this is the very first time (no existing conversation)
      if (!conversationText && !extractedData) {
        setConversationText("")
        setExtractedData(null)
        setLastProcessedLength(0)
      }

      recognition.start()
      setIsListening(true)
    }
  }

  const loadSampleData = () => {
    setConversationText(sampleConversation)
    setLastProcessedLength(0) // Reset to process all sample data
    // Auto-extract after loading sample data
    setTimeout(() => {
      handleExtraction()
    }, 500)
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  const handleTalkToMe = () => {
    setShowDemo(true)
  }

  const handleExtraction = async () => {
    if (!conversationText.trim()) return

    setIsExtracting(true)
    try {
      const newText = conversationText.slice(lastProcessedLength)

      if (newText.trim() && extractedData) {
        // Incremental update
        const response = await fetch("/api/extract-incremental", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newText: newText.trim(),
            existingData: extractedData,
          }),
        })

        const incrementalData = await response.json()

        // Merge the incremental data with existing data
        setExtractedData((prev) => {
          if (!prev) return null

          // Create updated data
          const updatedData = { ...prev }

          // Add new items
          updatedData.tasks = [...prev.tasks, ...incrementalData.newTasks]
          updatedData.appointments = [...prev.appointments, ...incrementalData.newAppointments]
          updatedData.locations = [...prev.locations, ...incrementalData.newLocations]
          updatedData.deadlines = [...prev.deadlines, ...incrementalData.newDeadlines]

          // Mark completed items
          updatedData.tasks = updatedData.tasks.map((task) => ({
            ...task,
            completed:
              task.completed ||
              incrementalData.completedTasks.some((completed: string) =>
                task.task.toLowerCase().includes(completed.toLowerCase()),
              ) ||
              incrementalData.purchasedItems.some((purchased: string) =>
                task.task.toLowerCase().includes(purchased.toLowerCase()),
              ),
          }))

          // Mark cancelled appointments
          updatedData.appointments = updatedData.appointments.map((appointment) => ({
            ...appointment,
            cancelled:
              appointment.cancelled ||
              incrementalData.cancelledAppointments.some((cancelled: string) =>
                appointment.title.toLowerCase().includes(cancelled.toLowerCase()),
              ),
          }))

          // Mark resolved deadlines
          updatedData.deadlines = updatedData.deadlines.map((deadline) => ({
            ...deadline,
            resolved:
              deadline.resolved ||
              incrementalData.resolvedDeadlines.some((resolved: string) =>
                deadline.item.toLowerCase().includes(resolved.toLowerCase()),
              ),
          }))

          // Apply updates
          incrementalData.updates.forEach((update: any) => {
            if (update.type === "task") {
              const taskIndex = updatedData.tasks.findIndex((task) =>
                task.task.toLowerCase().includes(update.originalItem.toLowerCase()),
              )
              if (taskIndex !== -1) {
                updatedData.tasks[taskIndex] = {
                  ...updatedData.tasks[taskIndex],
                  task: update.updatedItem,
                }
              }
            }
            // Add similar logic for other types...
          })

          // Update summary
          updatedData.summary = incrementalData.summary || prev.summary

          return updatedData
        })
      } else {
        // Full extraction (first time or no existing data)
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationText }),
        })

        const data = await response.json()
        setExtractedData(data)
      }

      // Update the last processed length
      setLastProcessedLength(conversationText.length)
    } catch (error) {
      console.error("Extraction failed:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (showDemo) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        {/* Header */}
        <div
          className={`border-b sticky top-0 z-10 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-900/80 backdrop-blur-sm border-gray-700"
              : "bg-white/80 backdrop-blur-sm border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1
                  className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
                >
                  Raamu
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className={`transition-colors duration-300 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </Button>
                <Badge
                  variant="outline"
                  className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
                  }`}
                >
                  {lastProcessedLength < conversationText.length ? "New content to process" : "Up to date"}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => setShowDemo(false)}
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ← Back to Landing
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Input Section */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-4">
                  <CardTitle
                    className={`flex items-center gap-2 text-lg transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                    Just Talk. Raamu Remembers.
                    {lastProcessedLength < conversationText.length && (
                      <Badge
                        variant="secondary"
                        className={`ml-2 text-xs transition-colors duration-300 ${
                          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Updates available
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "default"}
                      className={`flex items-center gap-2 px-6 py-3 text-base font-medium transition-all duration-200 ${
                        isListening
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      }`}
                      size="lg"
                      disabled={!isRecognitionSupported}
                    >
                      {isListening ? (
                        <MicOff className="h-5 w-5" />
                      ) : conversationText ? (
                        "🎤 Continue Recording"
                      ) : (
                        "🎤 Start Your Conversation"
                      )}
                    </Button>

                    <Button
                      onClick={loadSampleData}
                      variant="outline"
                      className={`flex items-center gap-2 px-6 py-3 text-base font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      size="lg"
                    >
                      <Play className="h-5 w-5" />
                      Try Sample
                    </Button>

                    <Button
                      onClick={() => {
                        setConversationText("")
                        setExtractedData(null)
                        setLastProcessedLength(0)
                      }}
                      variant="outline"
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      size="lg"
                      disabled={!conversationText && !extractedData}
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </Button>

                    <Badge
                      variant={isListening ? "destructive" : "secondary"}
                      className={`px-3 py-1 transition-colors duration-300 ${
                        isDarkMode && !isListening ? "bg-gray-700 text-gray-300" : ""
                      }`}
                    >
                      {isListening
                        ? "🔴 Listening..."
                        : isRecognitionSupported
                          ? "Ready to listen"
                          : "Speech not supported"}
                    </Badge>
                  </div>

                  {!isRecognitionSupported && (
                    <div
                      className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                        isDarkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-yellow-300" : "text-yellow-800"
                        }`}
                      >
                        <strong>Speech recognition not supported</strong> - Please use Chrome, Edge, or Safari for voice
                        input, or use the "Try Sample" button to see how Raamu works.
                      </p>
                    </div>
                  )}

                  {conversationText === sampleConversation && !isListening && (
                    <div
                      className={`border rounded-lg p-3 transition-colors duration-300 ${
                        isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200"
                      }`}
                    >
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-green-300" : "text-green-800"
                        }`}
                      >
                        📝 <strong>Sample data loaded!</strong> Click "Continue Recording" to add your own conversation
                        to this, or click "Let Raamu Remember" to analyze the sample.
                      </p>
                    </div>
                  )}

                  {conversationText && conversationText !== sampleConversation && !isListening && extractedData && (
                    <div
                      className={`border rounded-lg p-3 transition-colors duration-300 ${
                        isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-blue-300" : "text-blue-800"
                        }`}
                      >
                        🎤 <strong>Ready to continue!</strong> Click "Continue Recording" to add more conversation, or
                        "Process Updates" to analyze new content.
                      </p>
                    </div>
                  )}

                  <Textarea
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    placeholder="Your conversation will appear here as you speak, or paste it directly..."
                    className={`min-h-[200px] text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                    }`}
                    readOnly={isListening}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleExtraction}
                      disabled={isExtracting || !conversationText.trim()}
                      className="flex-1 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                    >
                      {isExtracting ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                          {extractedData ? "🤖 Processing updates..." : "🤖 Raamu is thinking..."}
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-2" />
                          {extractedData && lastProcessedLength < conversationText.length
                            ? "🤖 Process Updates"
                            : "🤖 Let Raamu Remember"}
                        </>
                      )}
                    </Button>
                  </div>

                  {extractedData && lastProcessedLength < conversationText.length && (
                    <div
                      className={`border rounded-lg p-3 transition-colors duration-300 ${
                        isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-blue-300" : "text-blue-800"
                        }`}
                      >
                        💡 <strong>Smart processing:</strong> Raamu will only analyze the new conversation text to save
                        time and stay efficient!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-lg transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Chat with Raamu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto mb-4 space-y-3">
                    {messages.length === 0 && (
                      <div
                        className={`text-center py-8 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <MessageCircle
                          className={`h-12 w-12 mx-auto mb-3 transition-colors duration-300 ${
                            isDarkMode ? "text-gray-600" : "text-gray-300"
                          }`}
                        />
                        <p>Start a conversation with Raamu about your extracted information</p>
                        <p className="text-sm mt-2">
                          Try: "What tasks do I have?" or "I bought the milk, remove it from my list"
                        </p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-xl max-w-[85%] ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto"
                            : isDarkMode
                              ? "bg-gray-700 text-gray-100 mr-auto"
                              : "bg-gray-100 text-gray-900 mr-auto"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{message.role === "user" ? "You" : "Raamu"}</div>
                        {message.content}
                      </div>
                    ))}
                    {isLoading && (
                      <div
                        className={`mr-auto max-w-[85%] p-4 rounded-xl transition-colors duration-300 ${
                          isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">Raamu</div>
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">Thinking...</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask Raamu about your notes or say what you've completed..."
                      className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                      }`}
                    />
                    <Button
                      type="submit"
                      className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Extracted Information Sidebar */}
            <div className="space-y-4">
              {extractedData && (
                <>
                  {/* Summary */}
                  <Card
                    className={`border-0 shadow-lg transition-colors duration-300 ${
                      isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle
                        className={`text-lg flex items-center gap-2 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        <Sparkles className="h-5 w-5 text-purple-400" />🧠 What Raamu Remembers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-sm leading-relaxed transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {extractedData.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card
                      className={`border-0 shadow-lg transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-red-900/40 to-red-800/40"
                          : "bg-gradient-to-br from-red-50 to-red-100"
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <CheckSquare
                          className={`h-6 w-6 mx-auto mb-2 transition-colors duration-300 ${
                            isDarkMode ? "text-red-400" : "text-red-600"
                          }`}
                        />
                        <div
                          className={`text-2xl font-bold transition-colors duration-300 ${
                            isDarkMode ? "text-red-300" : "text-red-700"
                          }`}
                        >
                          {extractedData?.tasks?.filter((t) => !t.completed).length || 0}
                        </div>
                        <div
                          className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-red-400" : "text-red-600"
                          }`}
                        >
                          Active Tasks
                        </div>
                        {(extractedData?.tasks?.filter((t) => t.completed).length || 0) > 0 && (
                          <div
                            className={`text-xs mt-1 transition-colors duration-300 ${
                              isDarkMode ? "text-red-500" : "text-red-500"
                            }`}
                          >
                            {extractedData?.tasks?.filter((t) => t.completed).length || 0} completed
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card
                      className={`border-0 shadow-lg transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-blue-900/40 to-blue-800/40"
                          : "bg-gradient-to-br from-blue-50 to-blue-100"
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <Calendar
                          className={`h-6 w-6 mx-auto mb-2 transition-colors duration-300 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <div
                          className={`text-2xl font-bold transition-colors duration-300 ${
                            isDarkMode ? "text-blue-300" : "text-blue-700"
                          }`}
                        >
                          {extractedData?.appointments?.filter((a) => !a.cancelled).length || 0}
                        </div>
                        <div
                          className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          Active Events
                        </div>
                        {(extractedData?.appointments?.filter((a) => a.cancelled).length || 0) > 0 && (
                          <div
                            className={`text-xs mt-1 transition-colors duration-300 ${
                              isDarkMode ? "text-blue-500" : "text-blue-500"
                            }`}
                          >
                            {extractedData?.appointments?.filter((a) => a.cancelled).length || 0} cancelled
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Extracted Information Display */}
          {extractedData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tasks */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`flex items-center gap-2 text-base transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <CheckSquare className="h-4 w-4 text-red-400" />
                    Tasks ({extractedData?.tasks?.filter((t) => !t.completed).length || 0} active)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(extractedData?.tasks || []).map((task, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg transition-all duration-300 ${
                        task.completed
                          ? isDarkMode
                            ? "bg-gray-700/50 opacity-60 border-gray-600"
                            : "bg-gray-50 opacity-60 border-gray-200"
                          : isDarkMode
                            ? "bg-gray-700/50 hover:bg-gray-700/80 border-gray-600"
                            : "bg-white/50 hover:bg-white/80 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                            task.completed
                              ? isDarkMode
                                ? "line-through text-gray-500"
                                : "line-through text-gray-500"
                              : isDarkMode
                                ? "text-gray-100"
                                : "text-gray-900"
                          }`}
                        >
                          {task.task}
                        </h4>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {task.completed && <Check className="h-3 w-3 text-green-400" />}
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
                        </div>
                      </div>
                      <p
                        className={`text-xs mb-1 transition-colors duration-300 ${
                          task.completed
                            ? isDarkMode
                              ? "text-gray-500"
                              : "text-gray-400"
                            : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                        }`}
                      >
                        {task.context}
                      </p>
                      {task.deadline && (
                        <p
                          className={`text-xs font-medium transition-colors duration-300 ${
                            task.completed
                              ? isDarkMode
                                ? "text-gray-500"
                                : "text-gray-400"
                              : isDarkMode
                                ? "text-red-400"
                                : "text-red-600"
                          }`}
                        >
                          Due: {task.deadline}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Appointments */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`flex items-center gap-2 text-base transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Events ({extractedData?.appointments?.filter((a) => !a.cancelled).length || 0} active)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(extractedData?.appointments || []).map((appointment, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg transition-all duration-300 ${
                        appointment.cancelled
                          ? isDarkMode
                            ? "bg-gray-700/50 opacity-60 border-gray-600"
                            : "bg-gray-50 opacity-60 border-gray-200"
                          : isDarkMode
                            ? "bg-gray-700/50 hover:bg-gray-700/80 border-gray-600"
                            : "bg-white/50 hover:bg-white/80 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4
                          className={`font-medium text-sm transition-colors duration-300 ${
                            appointment.cancelled
                              ? isDarkMode
                                ? "line-through text-gray-500"
                                : "line-through text-gray-500"
                              : isDarkMode
                                ? "text-gray-100"
                                : "text-gray-900"
                          }`}
                        >
                          {appointment.title}
                        </h4>
                        {appointment.cancelled && <X className="h-3 w-3 text-red-400 ml-2 flex-shrink-0" />}
                      </div>
                      <p
                        className={`text-xs mb-1 transition-colors duration-300 ${
                          appointment.cancelled
                            ? isDarkMode
                              ? "text-gray-500"
                              : "text-gray-400"
                            : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                        }`}
                      >
                        📅 {appointment.date} {appointment.time && `at ${appointment.time}`}
                      </p>
                      {appointment.location && (
                        <p
                          className={`text-xs mb-1 transition-colors duration-300 ${
                            appointment.cancelled
                              ? isDarkMode
                                ? "text-gray-500"
                                : "text-gray-400"
                              : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                          }`}
                        >
                          📍 {appointment.location}
                        </p>
                      )}
                      {appointment.participants && (
                        <p
                          className={`text-xs transition-colors duration-300 ${
                            appointment.cancelled
                              ? isDarkMode
                                ? "text-gray-500"
                                : "text-gray-400"
                              : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                          }`}
                        >
                          👥 {appointment.participants.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Locations */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`flex items-center gap-2 text-base transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-green-400" />
                    Places ({extractedData?.locations?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(extractedData?.locations || []).map((location, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-700/50 hover:bg-gray-700/80 border-gray-600"
                          : "bg-white/50 hover:bg-white/80 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4
                          className={`font-medium text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {location.name}
                        </h4>
                        {location.actionRequired && (
                          <Badge variant="destructive" className="text-xs ml-2 flex-shrink-0">
                            Action
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {location.context}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Deadlines */}
              <Card
                className={`border-0 shadow-lg transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`flex items-center gap-2 text-base transition-colors duration-300 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <Clock className="h-4 w-4 text-orange-400" />
                    Deadlines ({extractedData?.deadlines?.filter((d) => !d.resolved).length || 0} active)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(extractedData?.deadlines || []).map((deadline, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg transition-all duration-300 ${
                        deadline.resolved
                          ? isDarkMode
                            ? "bg-gray-700/50 opacity-60 border-gray-600"
                            : "bg-gray-50 opacity-60 border-gray-200"
                          : isDarkMode
                            ? "bg-gray-700/50 hover:bg-gray-700/80 border-gray-600"
                            : "bg-white/50 hover:bg-white/80 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4
                          className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                            deadline.resolved
                              ? isDarkMode
                                ? "line-through text-gray-500"
                                : "line-through text-gray-500"
                              : isDarkMode
                                ? "text-gray-100"
                                : "text-gray-900"
                          }`}
                        >
                          {deadline.item}
                        </h4>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {deadline.resolved && <Check className="h-3 w-3 text-green-400" />}
                          <Badge className={`${getPriorityColor(deadline.urgency)} text-xs`}>{deadline.urgency}</Badge>
                        </div>
                      </div>
                      <p
                        className={`text-xs font-medium transition-colors duration-300 ${
                          deadline.resolved
                            ? isDarkMode
                              ? "text-gray-500"
                              : "text-gray-400"
                            : isDarkMode
                              ? "text-orange-400"
                              : "text-red-600"
                        }`}
                      >
                        ⏰ Due: {deadline.date}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-900/80 backdrop-blur-sm border-gray-700"
            : "bg-white/80 backdrop-blur-sm border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Raamu
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                className={`transition-colors duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </Button>
              <Button
                variant="ghost"
                className={`transition-colors duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className={`transition-colors duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Pricing
              </Button>
              <Button
                variant="outline"
                className={`transition-colors duration-300 ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className={`text-5xl sm:text-7xl font-bold tracking-tight mb-8 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Just Talk.
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Raamu Remembers.
              </span>
            </h1>
            <p
              className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Raamu is your AI-powered memory assistant that listens in the background, automatically extracting tasks,
              appointments, and important info from your conversations.
            </p>

            {/* Feature Checkmarks */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 text-lg">
              <div
                className={`flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span>Effortless conversations</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span>Automatic task & calendar capture</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span>Never forget important details again</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={handleTalkToMe}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              >
                <Mic className="h-6 w-6 mr-3" />
                Get Early Access
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-4 text-lg font-semibold border-2 transition-colors duration-300 ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <Play className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
            </div>

            {/* Demo Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
              <Card
                className={`relative border-0 shadow-2xl overflow-hidden transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"
                }`}
              >
                <div
                  className={`px-6 py-4 border-b transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600"
                      : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span
                      className={`ml-4 text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Raamu - Smart Updates
                    </span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        🔊 Step 1: Just Talk
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Have your normal conversations. Whether it's a meeting, a phone call, or chatting with
                        friends—Raamu listens passively in the background.
                      </p>
                      <div
                        className={`mt-3 p-3 rounded-lg text-xs italic transition-colors duration-300 ${
                          isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        "Let's meet next Thursday at 2 PM to finalize the report."
                        <br />
                        <span className="text-green-600 font-medium">☑️ Raamu remembers it for you.</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        🤖 Step 2: AI Extracts
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Raamu uses cutting-edge language intelligence to pull out what matters: Tasks, Appointments,
                        Deadlines, Follow-ups.
                      </p>
                      <div
                        className={`mt-3 p-2 rounded-lg text-xs font-medium transition-colors duration-300 ${
                          isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        You talk. Raamu thinks.
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        🧠 Step 3: Stay Organized
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Get clean summaries, daily digests, and smart reminders—delivered exactly when you need them.
                      </p>
                      <div
                        className={`mt-3 p-2 rounded-lg text-xs transition-colors duration-300 ${
                          isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        📌 What you said → ✍️ What you need to do
                        <br />📅 Your week, clear and calm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-colors duration-300 ${isDarkMode ? "bg-gray-800/30" : "bg-white/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Why Raamu?
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Raamu is your second brain—one that never forgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
              }`}
            >
              <CardContent className="text-center p-0">
                <div className="text-4xl mb-4">🕒</div>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  No manual entry
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Zero effort needed. Just talk naturally.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
              }`}
            >
              <CardContent className="text-center p-0">
                <div className="text-4xl mb-4">📱</div>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Cross-platform
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Works across devices and apps seamlessly.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
              }`}
            >
              <CardContent className="text-center p-0">
                <div className="text-4xl mb-4">🔒</div>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Privacy-first
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  You control what's saved and processed.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
              }`}
            >
              <CardContent className="text-center p-0">
                <div className="text-4xl mb-4">🧠</div>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Smarter over time
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Learns your habits and preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              What People Are Saying
            </h2>
            <div
              className={`flex justify-center items-center gap-8 mb-12 transition-colors duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>10,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <span>50,000+ tasks captured</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>25,000+ events organized</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card
              className={`p-8 rounded-2xl shadow-lg transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800/80" : "bg-white"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote
                  className={`mb-4 leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  "Raamu changed how I work. I stopped missing follow-ups and started feeling truly organized."
                </blockquote>
                <footer
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  — Priya V., Product Manager
                </footer>
              </CardContent>
            </Card>
            <Card
              className={`p-8 rounded-2xl shadow-lg transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800/80" : "bg-white"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote
                  className={`mb-4 leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  "I talk. Raamu does the rest. It's like having a personal assistant who never sleeps."
                </blockquote>
                <footer
                  className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  — Jay M., Founder
                </footer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Remember Everything?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with Raamu and never lose track of what matters again.
          </p>
          <Button
            onClick={handleTalkToMe}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Mic className="h-6 w-6 mr-3" />🔊 Try Raamu Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-900"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Raamu</span>
            </div>
            <p className="text-gray-400 mb-4">Privacy-first AI Memory Assistant</p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="underline hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="underline hover:text-white transition-colors duration-200">
                Terms of Use
              </a>
              <a href="#" className="underline hover:text-white transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
