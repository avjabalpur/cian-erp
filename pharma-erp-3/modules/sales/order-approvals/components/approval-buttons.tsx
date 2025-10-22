"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, Clock, User, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useApproveStage, useRejectStage } from "../hooks/use-sales-order-stages";
import { useCreateSalesOrderComment } from "../hooks/use-sales-order-comments";
import { SalesOrderStage } from "../types/sales-order-extended.types";

interface ApprovalStage {
  key: string;
  name: string;
  title: string;
  description: string;
  order: number;
  isApproved: boolean | null;
  isRejected: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  comments?: string;
}

interface ApprovalButtonsProps {
  salesOrderId: number;
  stages: SalesOrderStage[];
  onStageUpdate: () => void;
  disabled?: boolean;
  userRole?: string;
}

// Define all approval stages (6 stages)
const ALL_APPROVAL_STAGES = [
  {
    key: "costing",
    name: "Costing Approval",
    title: "Costing Approval",
    description: "Approve product costing and pricing",
    order: 1,
  },
  {
    key: "qa",
    name: "QA Approval",
    title: "QA Approval", 
    description: "Quality assurance approval",
    order: 2,
  },
  {
    key: "designer",
    name: "Designer Approval",
    title: "Designer Approval",
    description: "Design and artwork approval",
    order: 3,
  },
  {
    key: "final_qa",
    name: "Final QA Approval",
    title: "Final QA Approval",
    description: "Final quality check approval",
    order: 4,
  },
  {
    key: "pm",
    name: "PM Approval",
    title: "PM Approval",
    description: "Project manager approval",
    order: 5,
  },
  {
    key: "final_authorization",
    name: "Final Authorization",
    title: "Final Authorization",
    description: "Final authorization for production",
    order: 6,
  }
];

export function ApprovalButtons({ 
  salesOrderId, 
  stages, 
  onStageUpdate, 
  disabled = false,
  userRole 
}: ApprovalButtonsProps) {
  const [selectedStage, setSelectedStage] = useState<ApprovalStage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");

  const approveStageMutation = useApproveStage();
  const rejectStageMutation = useRejectStage();
  const createCommentMutation = useCreateSalesOrderComment();

  // Map database stages to default stages
  const approvalStages: ApprovalStage[] = ALL_APPROVAL_STAGES.map(defaultStage => {
    const dbStage = stages.find(stage => 
      stage.stageName.toLowerCase().includes(defaultStage.key.toLowerCase()) ||
      defaultStage.name.toLowerCase().includes(stage.stageName.toLowerCase())
    );
    
    if (dbStage) {
      return {
        ...defaultStage,
        isApproved: dbStage.isApproved,
        isRejected: dbStage.isApproved === false,
        approvedBy: dbStage.updatedByName,
        approvedAt: dbStage.updatedAt,
        rejectedBy: dbStage.updatedByName,
        rejectedAt: dbStage.updatedAt,
      };
    }
    
    return {
      ...defaultStage,
      isApproved: null,
      isRejected: false,
      approvedBy: undefined,
      approvedAt: undefined,
      rejectedBy: undefined,
      rejectedAt: undefined,
    };
  });

  // Calculate progress
  const completedStages = approvalStages.filter(stage => stage.isApproved === true).length;
  const totalStages = approvalStages.length;
  const progressPercentage = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

  const handleStageAction = (stage: ApprovalStage, action: "approve" | "reject") => {
    setSelectedStage(stage);
    setActionType(action);
    setComment("");
    setIsDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedStage || !actionType) return;

    try {
      if (actionType === "approve") {
        await approveStageMutation.mutateAsync({
          salesOrderId,
          stageName: selectedStage.name
        });
      } else {
        await rejectStageMutation.mutateAsync({
          salesOrderId,
          stageName: selectedStage.name
        });
      }

      // Add comment if provided
      if (comment.trim()) {
        await createCommentMutation.mutateAsync({
          salesOrderId,
          data: {
            salesOrderId,
            comments: comment,
            type: `${selectedStage.key}_${actionType}`,
            status: actionType === "approve" ? "approved" : "rejected",
            isDeleted: false,
          }
        });
      }

      toast.success(`Stage ${actionType === "approve" ? "approved" : "rejected"} successfully`);

      setIsDialogOpen(false);
      onStageUpdate();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${actionType} stage`);
    }
  };

  const getStageStatus = (stage: ApprovalStage) => {
    if (stage.isApproved === true) return "approved";
    if (stage.isApproved === false) return "rejected";
    return "pending";
  };

  const getStageIcon = (stage: ApprovalStage) => {
    const status = getStageStatus(stage);
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStageBadgeVariant = (stage: ApprovalStage): "default" | "destructive" | "outline" => {
    const status = getStageStatus(stage);
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStageBadgeText = (stage: ApprovalStage) => {
    const status = getStageStatus(stage);
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const canUserActOnStage = (stage: ApprovalStage) => {
    if (disabled) return false;
    if (stage.isApproved === true || stage.isApproved === false) return false;
    return true;
  };

  const accordionContent = (
    <Accordion type="single" collapsible defaultValue="approval-stages" className="w-full">
      <AccordionItem value="approval-stages" className="border rounded-md">
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Approval Stages</span>
              <Badge variant="outline" className="text-xs h-5">
                {completedStages}/{totalStages}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progressPercentage} className="h-1.5 w-24" />
              <span className="text-xs text-gray-500 w-10">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          {/* Approval Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {approvalStages.map((stage) => (
          <Card 
            key={stage.key} 
            className={`border transition-all duration-200 hover:shadow-sm ${
              stage.isApproved === true
                ? 'border-green-300 bg-green-50' 
                : stage.isApproved === false
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <CardHeader className="p-2 pb-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {getStageIcon(stage)}
                  <CardTitle className="text-xs font-semibold text-gray-800">
                    {stage.title}
                  </CardTitle>
                </div>
                <Badge variant={getStageBadgeVariant(stage)} className="text-xs h-4 px-1.5">
                  {getStageBadgeText(stage)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-2 pt-0 space-y-1.5">
              {/* Stage Info */}
              {stage.approvedBy && stage.isApproved === true && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <User className="h-3 w-3" />
                  <span>{stage.approvedBy}</span>
                </div>
              )}
              {stage.rejectedBy && stage.isApproved === false && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <User className="h-3 w-3" />
                  <span>{stage.rejectedBy}</span>
                </div>
              )}
              {(stage.approvedAt || stage.rejectedAt) && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {stage.approvedAt || stage.rejectedAt 
                      ? new Date(stage.approvedAt || stage.rejectedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : ''
                    }
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {canUserActOnStage(stage) && (
                <div className="flex gap-1.5 pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleStageAction(stage, "approve")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-6 text-xs"
                    disabled={approveStageMutation.isPending || rejectStageMutation.isPending}
                    type="button"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStageAction(stage, "reject")}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 h-6 text-xs"
                    disabled={approveStageMutation.isPending || rejectStageMutation.isPending}
                    type="button"
                    >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      {/* Approval Stages Accordion Section */}
      {accordionContent}

      {/* Approval/Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approve" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {actionType === "approve" ? "Approve" : "Reject"} {selectedStage?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Comment (Optional)
              </Label>
              <Textarea
                id="comment"
                placeholder={`Add a comment for ${actionType === "approve" ? "approval" : "rejection"}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={approveStageMutation.isPending || rejectStageMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAction}
                disabled={approveStageMutation.isPending || rejectStageMutation.isPending}
                className={
                  actionType === "approve" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                {approveStageMutation.isPending || rejectStageMutation.isPending ? (
                  "Processing..."
                ) : (
                  `${actionType === "approve" ? "Approve" : "Reject"} Stage`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

