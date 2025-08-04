"use client";

import { useState } from "react";
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
import { Search, Building2, X } from "lucide-react";
import { useDivisions } from "@/hooks/use-divisions";

interface Division {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  departmentName?: string;
  isActive: boolean;
}

interface DivisionLookupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (divisionId: number) => void;
  title?: string;
}

export function DivisionLookup({
  isOpen,
  onClose,
  onSelect,
  title = "Select Division"
}: DivisionLookupProps) {
  const [search, setSearch] = useState("");

  // Fetch divisions with search
  const { data: divisionsData, isLoading } = useDivisions({
    search: search,
    pageNumber: 1,
    pageSize: 50 // Show more divisions for better selection
  });

  const divisions = divisionsData?.items || [];

  const handleDivisionSelect = (divisionId: number) => {
    onSelect(divisionId);
    onClose();
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSearch("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code, name, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Divisions Table */}
          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading divisions...
                    </TableCell>
                  </TableRow>
                ) : divisions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {search ? "No divisions found" : "No divisions available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  divisions.map((division) => (
                    <TableRow key={division.id} className="hover:bg-muted/50">
                      <TableCell className="p-2">
                        {division.id}
                      </TableCell>
                      <TableCell className="font-medium p-2">{division.code}</TableCell>
                      <TableCell className="p-2">{division.name}</TableCell>
                      <TableCell className="text-muted-foreground p-2">
                        {division.departmentName || "-"}
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge variant={division.isActive ? "default" : "secondary"}>
                          {division.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-0">
                        <Button
                          size="sm"
                          onClick={() => handleDivisionSelect(division.id)}
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
              {divisions.length} division{divisions.length !== 1 ? 's' : ''} found
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