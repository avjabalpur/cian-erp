"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useSalesOrderStages, useApproveStage, useRejectStage } from "@/hooks/sales-order/use-sales-order-stages";
import { SalesOrderStage } from "@/types/sales-order-extended";

interface SalesOrderApprovalStagesProps {
  salesOrderId: number;
}

const APPROVAL_STAGES = [
  "Costing Approval",
  "QA Approval", 
  "Designer Approval",
  "Final Authorization",
  "Final QA Approval",
  "PM Approval"
];

export function SalesOrderApprovalStages({ salesOrderId }: SalesOrderApprovalStagesProps) {
  const { data: stages = [], isLoading, refetch } = useSalesOrderStages(salesOrderId);
  const approveStageMutation = useApproveStage();
  const rejectStageMutation = useRejectStage();

  const getStageStatus = (stageName: string) => {
    const stage = stages.find(s => s.stageName === stageName);
    if (!stage) return "pending";
    return stage.isApproved ? "approved" : "rejected";
  };

  const getStageData = (stageName: string): SalesOrderStage | null => {
    return stages.find(s => s.stageName === stageName) || null;
  };

  const handleApprove = async (stageName: string) => {
    try {
      await approveStageMutation.mutateAsync({ salesOrderId, stageName });
      refetch();
    } catch (error) {
      console.error("Failed to approve stage:", error);
    }
  };

  const handleReject = async (stageName: string) => {
    try {
      await rejectStageMutation.mutateAsync({ salesOrderId, stageName });
      refetch();
    } catch (error) {
      console.error("Failed to reject stage:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {APPROVAL_STAGES.map((stageName, index) => {
        const status = getStageStatus(stageName);
        const stageData = getStageData(stageName);

        return (
          <div key={`${stageName}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status)}
              <div>
                <h4 className="font-medium text-sm">{stageName}</h4>
                {stageData && (
                  <div className="text-xs text-muted-foreground">
                    {stageData.createdByName && (
                      <span>By: {stageData.createdByName} • </span>
                    )}
                    <span>{new Date(stageData.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(status)}
              
              {status === "pending" && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(stageName)}
                    disabled={approveStageMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 h-7 px-2"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(stageName)}
                    disabled={rejectStageMutation.isPending}
                    className="border-red-600 text-red-600 hover:bg-red-50 h-7 px-2"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 