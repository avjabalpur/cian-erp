"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Send, MessageCircle } from "lucide-react";

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
    <div className="w-80 border-l bg-gradient-to-b from-slate-50 to-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Chat Comments</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            disabled={disabled}
            className="hover:bg-blue-100 text-blue-600"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Last Read Button */}
      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <Button
          variant="default"
          onClick={onLastRead}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm"
        >
          Last Read
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
        <ScrollArea className="h-full px-3">
          <div className="space-y-3 py-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Start a conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-700 leading-relaxed">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-3 shadow-lg">
        <div className="flex gap-2">
          <Input
            placeholder="Type your comment here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={disabled || !newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 