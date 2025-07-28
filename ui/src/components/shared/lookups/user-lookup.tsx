"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, X } from "lucide-react";
import { useUsers } from "@/hooks/use-users";

interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
}

interface UserLookupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (userId: number) => void;
  title?: string;
}

export function UserLookup({
  isOpen,
  onClose,
  onSelect,
  title = "Select User"
}: UserLookupProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users with search
  const { data: usersData, isLoading } = useUsers({
    search: searchTerm,
    pageNumber: 1,
    pageSize: 50 // Show more users for better selection
  });

  const users = usersData?.items || [];

  const handleUserSelect = (userId: number) => {
    onSelect(userId);
    onClose();
    setSearchTerm("");
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users Table */}
          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No users found" : "No users available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="p-2">
                          {user.id}
                      </TableCell>
                      <TableCell className="font-medium p-2">{user.firstName} {user.lastName}</TableCell>
                      <TableCell className="text-muted-foreground p-0">
                        {user.username || "-"}
                      </TableCell>
                      <TableCell className="p-0">
                        <Button
                          size="sm"
                          onClick={() => handleUserSelect(user.id)}
                          className="h-6"
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {users.length} user{users.length !== 1 ? 's' : ''} found
            </div>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 