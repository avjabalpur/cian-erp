"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  messages?: ChatMessage[];
  onSendMessage: (message: string) => void;
  onLastRead: () => void;
  onSettings: () => void;
  disabled?: boolean;
}

export function ChatSidebar({ 
  messages = [], 
  onSendMessage, 
  onLastRead, 
  onSettings, 
  disabled 
}: ChatSidebarProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && !disabled) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 border-l flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Chat Comments</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            disabled={disabled}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Last Read Button */}
      <div className="p-4">
        <Button
          variant="default"
          onClick={onLastRead}
          disabled={disabled}
          className="w-full"
        >
          Last Read
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your comment here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={disabled || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 