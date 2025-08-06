"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, MessageSquare } from "lucide-react";
import { useChatMessagesBySalesOrder, useCreateSalesOrderChatMessage } from "@/hooks/sales-order/use-sales-order-chat";
import type { SalesOrderChat, CreateSalesOrderChatData } from "@/types/sales-order-extended";
import { format } from "date-fns";

interface SalesOrderChatProps {
  salesOrderId: number;
}

export function SalesOrderChat({ salesOrderId }: SalesOrderChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const { data: chatMessages = [], isLoading, refetch } = useChatMessagesBySalesOrder(salesOrderId);
  const createChatMessageMutation = useCreateSalesOrderChatMessage();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatData: CreateSalesOrderChatData = {
      salesOrderId,
      comment: newMessage.trim(),
    };

    try {
      await createChatMessageMutation.mutateAsync({ salesOrderId, data: chatData });
      setNewMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-64 border rounded-md p-4">
          {chatMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((message: SalesOrderChat) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.createdByName || "Unknown User"}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(message.createdAt), "MMM dd, yyyy HH:mm")}
                      </Badge>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded-lg">{message.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[80px]"
            disabled={createChatMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || createChatMessageMutation.isPending}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 