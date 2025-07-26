"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import type { SalesOrderChat, CreateSalesOrderChatData } from "@/types/sales-order-extended"
import { salesOrderChatApi } from "@/lib/api/sales-order-extended"
import { formatDate } from "@/lib/date-utils"

interface SalesOrderChatProps {
  salesOrderId: number
  isOpen: boolean
  onClose: () => void
}

export default function SalesOrderChat({ salesOrderId, isOpen, onClose }: SalesOrderChatProps) {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState("")

  // Fetch chat messages
  const {
    data: chatMessages = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["salesOrderChat", salesOrderId],
    queryFn: () => salesOrderChatApi.getBySalesOrder(salesOrderId),
    enabled: isOpen,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateSalesOrderChatData) => salesOrderChatApi.create(data),
    onSuccess: () => {
      toast.success("Message sent successfully")
      setMessage("")
      queryClient.invalidateQueries({ queryKey: ["salesOrderChat", salesOrderId] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message")
    },
  })

  const handleSendMessage = () => {
    if (!message.trim()) return

    sendMessageMutation.mutate({
      salesOrderId,
      comment: message.trim(),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Sales Order Chat</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((chatMessage) => (
                  <div key={chatMessage.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {chatMessage.createdByName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {chatMessage.createdByName || "Unknown User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(chatMessage.createdAt)}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm">{chatMessage.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 