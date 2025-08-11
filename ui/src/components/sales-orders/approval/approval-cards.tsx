"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, MessageSquare, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SalesOrder } from "@/types/sales-order";
import { useCreateSalesOrderComment } from "@/hooks/sales-order/use-sales-order-comments";
import { formatDate } from "@/lib/date-utils";

export interface ApprovalCardProps {
  salesOrderId: number;
  title: string;
  approvalType: "costing" | "qa" | "designer" | "final_qa" | "pm" | "final_authorization";
  approvalKey: keyof SalesOrder;
  isApproved?: boolean;
  requiredRoles?: string[];
  userRoles?: string[];
  salesOrder?: SalesOrder;
  onApprovalChange?: (type: string, approved: boolean, comments: string) => void;
  previousComments?: Array<{
    id: number;
    comment: string;
    createdAt: string;
    createdByName: string;
    status: string;
  }>;
}

const approvalTypeConfig = {
  costing: {
    title: "Costing Approval",
    description: "Approve product costing and pricing",
    color: "bg-blue-50 border-blue-200",
    icon: "💰",
  },
  qa: {
    title: "QA Approval",
    description: "Quality assurance approval",
    color: "bg-green-50 border-green-200",
    icon: "🔍",
  },
  designer: {
    title: "Designer Approval",
    description: "Design and artwork approval",
    color: "bg-purple-50 border-purple-200",
    icon: "🎨",
  },
  final_qa: {
    title: "Final QA Approval",
    description: "Final quality check approval",
    color: "bg-emerald-50 border-emerald-200",
    icon: "✅",
  },
  pm: {
    title: "PM Approval",
    description: "Project manager approval",
    color: "bg-orange-50 border-orange-200",
    icon: "👨‍💼",
  },
  final_authorization: {
    title: "Final Authorization",
    description: "Final authorization for production",
    color: "bg-red-50 border-red-200",
    icon: "🔐",
  },
};

export function ApprovalCard({
  salesOrderId,
  title,
  approvalType,
  approvalKey,
  isApproved,
  requiredRoles = [],
  userRoles = [],
  salesOrder,
  onApprovalChange,
  previousComments = [],
}: ApprovalCardProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({
    status: "APPROVE",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCommentMutation = useCreateSalesOrderComment();

  const config = approvalTypeConfig[approvalType];
  const hasPermission = requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

  const getStatusIcon = () => {
    if (isApproved === null || isApproved === undefined) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }
    return isApproved ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusBadge = () => {
    if (isApproved === null || isApproved === undefined) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return isApproved ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
    ) : (
      <Badge variant="destructive">Rejected</Badge>
    );
  };

  const handleSubmit = async () => {
    if (!approvalData.comments.trim()) {
      toast({
        title: "Error",
        description: "Please provide comments for the approval decision.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create comment
      await createCommentMutation.mutateAsync({
        salesOrderId,
        comment: approvalData.comments,
        type: approvalType,
        status: approvalData.status,
      });

      // Update approval status
      if (onApprovalChange) {
        onApprovalChange(approvalType, approvalData.status === "APPROVE", approvalData.comments);
      }

      toast({
        title: "Success",
        description: `Approval ${approvalData.status.toLowerCase()}d successfully.`,
      });

      setIsModalOpen(false);
      setApprovalData({ status: "APPROVE", comments: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit approval. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className={`${config.color} hover:shadow-md transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            {getStatusBadge()}
            {hasPermission && (
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                disabled={!hasPermission}
              >
                {isApproved === null || isApproved === undefined ? "Approve/Reject" : "Update"}
              </Button>
            )}
          </div>

          {/* Previous Comments */}
          {previousComments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <History className="h-3 w-3" />
                <span>Previous Comments</span>
              </div>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {previousComments.slice(-2).map((comment) => (
                  <div key={comment.id} className="text-xs bg-white p-2 rounded border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.createdByName}</span>
                      <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={approvalData.status}
                onValueChange={(value) => setApprovalData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVE">Approve</SelectItem>
                  <SelectItem value="REJECT">Request Changes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                placeholder="Provide detailed comments for your decision..."
                value={approvalData.comments}
                onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
