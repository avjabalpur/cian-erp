"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Mail,
  Database,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SalesOrder } from "@/types/sales-order";
import { ApprovalCard, ApprovalCardProps } from "./approval-cards";
import { ApprovalTools } from "./approval-tools";
import { SalesOrderOptionsMaster, getStatusColor } from "@/lib/constants/sales-order-options";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useCommentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-comments";

interface ApprovalWorkflowProps {
  salesOrderId: number;
  salesOrder?: SalesOrder;
  userRoles?: string[];
  onSalesOrderUpdate?: (updatedSalesOrder: SalesOrder) => void;
}

interface ApprovalStage {
  key: string;
  title: string;
  description: string;
  approvalKey: keyof SalesOrder;
  requiredRoles: string[];
  order: number;
  isCompleted: boolean;
  isApproved?: boolean;
  comments?: Array<{
    id: number;
    comment: string;
    createdAt: string;
    createdByName: string;
    status: string;
  }>;
}

export function ApprovalWorkflow({
  salesOrderId,
  salesOrder,
  userRoles = [],
  onSalesOrderUpdate
}: ApprovalWorkflowProps) {
  const { toast } = useToast();
  const updateSalesOrderMutation = useUpdateSalesOrder();
  
  // Fetch comments for all approval types
  const { data: comments = [] } = useCommentsBySalesOrder(salesOrderId);

  // Define approval stages in order
  const approvalStages: ApprovalStage[] = [
    {
      key: "costing",
      title: "Costing Approval",
      description: "Approve product costing and pricing",
      approvalKey: "costingApproved" as keyof SalesOrder,
      requiredRoles: ["costing_manager", "finance_manager"],
      order: 1,
      isCompleted: false,
      isApproved: salesOrder?.costingApproved,
      comments: comments.filter(c => c.type === "costing")
    },
    {
      key: "qa",
      title: "QA Approval",
      description: "Quality assurance approval",
      approvalKey: "qaApproved" as keyof SalesOrder,
      requiredRoles: ["qa_manager", "quality_analyst"],
      order: 2,
      isCompleted: false,
      isApproved: salesOrder?.qaApproved,
      comments: comments.filter(c => c.type === "qa")
    },
    {
      key: "designer",
      title: "Designer Approval",
      description: "Design and artwork approval",
      approvalKey: "designerApproved" as keyof SalesOrder,
      requiredRoles: ["designer", "artwork_manager"],
      order: 3,
      isCompleted: false,
      isApproved: salesOrder?.designerApproved,
      comments: comments.filter(c => c.type === "designer")
    },
    {
      key: "final_qa",
      title: "Final QA Approval",
      description: "Final quality check approval",
      approvalKey: "finalQaApproved" as keyof SalesOrder,
      requiredRoles: ["senior_qa", "qa_manager"],
      order: 4,
      isCompleted: false,
      isApproved: salesOrder?.finalQaApproved,
      comments: comments.filter(c => c.type === "final_qa")
    },
    {
      key: "pm",
      title: "PM Approval",
      description: "Project manager approval",
      approvalKey: "pmApproved" as keyof SalesOrder,
      requiredRoles: ["project_manager", "senior_manager"],
      order: 5,
      isCompleted: false,
      isApproved: salesOrder?.pmApproved,
      comments: comments.filter(c => c.type === "pm")
    },
    {
      key: "final_authorization",
      title: "Final Authorization",
      description: "Final authorization for production",
      approvalKey: "finalAuthorized" as keyof SalesOrder,
      requiredRoles: ["director", "ceo", "senior_director"],
      order: 6,
      isCompleted: false,
      isApproved: salesOrder?.finalAuthorized,
      comments: comments.filter(c => c.type === "final_authorization")
    }
  ];

  // Calculate completion status
  const [stages, setStages] = useState<ApprovalStage[]>(approvalStages);

  useEffect(() => {
    const updatedStages = approvalStages.map((stage, index) => {
      const isCompleted = stage.isApproved === true;
      const isBlocked = index > 0 && !approvalStages[index - 1].isApproved;
      
      return {
        ...stage,
        isCompleted,
        isBlocked
      };
    });
    setStages(updatedStages);
  }, [salesOrder, comments]);

  // Calculate progress
  const completedStages = stages.filter(stage => stage.isCompleted).length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  // Get current status
  const getCurrentStatus = () => {
    if (salesOrder?.currentStatus) {
      const statusOption = SalesOrderOptionsMaster.currentStatus.find(
        s => s.value === salesOrder.currentStatus
      );
      return statusOption || { label: salesOrder.currentStatus, color: "gray" };
    }
    return { label: "PENDING", color: "gray" };
  };

  const handleApprovalChange = async (type: string, approved: boolean, comments: string) => {
    try {
      const updateData: Partial<SalesOrder> = { id: salesOrderId };
      
      // Update the specific approval field
      const stage = stages.find(s => s.key === type);
      if (stage) {
        (updateData as any)[stage.approvalKey] = approved;
      }

      // Update current status based on approval
      let newStatus = "IN-PROGRESS";
      if (approved) {
        // Check if all stages are approved
        const allApproved = stages.every(s => s.isApproved || s.key === type);
        if (allApproved) {
          newStatus = "SO-CONFIRMED";
        }
      } else {
        newStatus = "REQUEST-CHANGES";
      }

      updateData.currentStatus = newStatus;

      const updatedSalesOrder = await updateSalesOrderMutation.mutateAsync(updateData);
      
      if (onSalesOrderUpdate) {
        onSalesOrderUpdate(updatedSalesOrder);
      }

      toast({
        title: "Success",
        description: `Approval ${approved ? 'granted' : 'rejected'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update approval status.",
        variant: "destructive",
      });
    }
  };

  const handleSendToProgen = async () => {
    try {
      const updateData: Partial<SalesOrder> = {
        id: salesOrderId,
        currentStatus: "ADDED-TO-PROGEN"
      };

      const updatedSalesOrder = await updateSalesOrderMutation.mutateAsync(updateData);
      
      if (onSalesOrderUpdate) {
        onSalesOrderUpdate(updatedSalesOrder);
      }

      toast({
        title: "Success",
        description: "Sales order sent to production system successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send to production system.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    // This would integrate with your email system
    toast({
      title: "Info",
      description: "Email notification feature will be implemented based on your email system integration.",
    });
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Approval Workflow</CardTitle>
              <p className="text-sm text-gray-600">
                {completedStages} of {totalStages} stages completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${getStatusColor(currentStatus.label).bg} ${getStatusColor(currentStatus.label).text} ${getStatusColor(currentStatus.label).border}`}
              >
                {currentStatus.label}
              </Badge>
              <ApprovalTools 
                salesOrderId={salesOrderId}
                currentSalesOrder={salesOrder}
                onSalesOrderUpdate={onSalesOrderUpdate}
              />
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Approval Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage, index) => (
          <div key={stage.key} className="relative">
            {/* Connection Line */}
            {index < stages.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-4 w-4 text-gray-300" />
              </div>
            )}
            
            <ApprovalCard
              salesOrderId={salesOrderId}
              title={stage.title}
              approvalType={stage.key as ApprovalCardProps["approvalType"]}
              approvalKey={stage.approvalKey}
              isApproved={stage.isApproved}
              requiredRoles={stage.requiredRoles}
              userRoles={userRoles}
              salesOrder={salesOrder}
              onApprovalChange={handleApprovalChange}
              previousComments={stage.comments}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {completedStages === totalStages && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">All Approvals Complete</h3>
                <p className="text-sm text-gray-600">
                  This sales order has been approved by all required stakeholders.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSendEmail}
                  disabled={salesOrder?.currentStatus === "ADDED-TO-PROGEN"}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  onClick={handleSendToProgen}
                  disabled={salesOrder?.currentStatus === "ADDED-TO-PROGEN"}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Send to Production
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approval Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <div key={stage.key} className="flex items-center gap-2">
                {stage.isApproved === true ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : stage.isApproved === false ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium">{stage.title}</span>
                {stage.comments && stage.comments.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stage.comments.length} comments
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
