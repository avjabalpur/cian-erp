"use client";

import { useState } from "react";
import { MoreHorizontal, Settings, List, Database, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ConfigurationMenu() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Configuration</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Configuration
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleNavigate("/config/config-lists")}
          className="cursor-pointer hover:bg-gray-50"
        >
          <List className="mr-2 h-4 w-4 text-blue-600" />
          Config Lists
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleNavigate("/config/config-settings")}
          className="cursor-pointer hover:bg-gray-50"
        >
          <Settings className="mr-2 h-4 w-4 text-blue-600" />
          Config Settings
        </DropdownMenuItem>

        {/*<DropdownMenuSeparator />
         <DropdownMenuItem 
          onClick={() => handleNavigate("/settings")}
          className="cursor-pointer hover:bg-gray-50"
        >
          <Settings className="mr-2 h-4 w-4 text-purple-600" />
          System Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate("/config/advanced")}
          className="cursor-pointer hover:bg-gray-50"
        >
          <Cog className="mr-2 h-4 w-4 text-orange-600" />
          Advanced Config
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 