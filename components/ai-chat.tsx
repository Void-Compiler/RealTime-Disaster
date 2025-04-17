"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your disaster management assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter((msg) => msg.role !== "system"),
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })

      // Add fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={toggleChat} className="rounded-full h-14 w-14 bg-teal-600 hover:bg-teal-700 shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={`w-80 ${isMinimized ? "h-12" : "h-96"} shadow-xl transition-all duration-300 ease-in-out`}>
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Disaster Management Assistant
            </CardTitle>
            <div className="flex items-center gap-1">
              {isMinimized ? (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={maximizeChat}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={minimizeChat}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={closeChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto h-[calc(100%-96px)]">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-2 ${
                          message.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-2 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim()}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
