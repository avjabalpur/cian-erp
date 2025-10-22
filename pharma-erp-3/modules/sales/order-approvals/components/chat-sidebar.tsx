"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Settings, Eye } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onLastRead: () => void;
  onSettings: () => void;
  disabled?: boolean;
}

export function ChatSidebar({ messages, onSendMessage, onLastRead, onSettings, disabled }: ChatSidebarProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-80 border-l bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Team Chat</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onLastRead}
              className="h-7 w-7 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSettings}
              className="h-7 w-7 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-600">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      {!disabled && (
        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

