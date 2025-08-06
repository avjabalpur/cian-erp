"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface ApprovalButtonProps {
  label: string;
  status: "approved" | "rejected" | "pending" | null;
  onClick: () => void;
  disabled?: boolean;
}

const ApprovalButton = ({ label, status, onClick, disabled }: ApprovalButtonProps) => {
  const getButtonVariant = () => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant={getButtonVariant()}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 text-sm font-medium"
    >
      {getIcon()}
      <span className="ml-2">{label}</span>
    </Button>
  );
};

interface ApprovalButtonsProps {
  approvals: {
    costing: "approved" | "rejected" | "pending" | null;
    qa: "approved" | "rejected" | "pending" | null;
    finalAuthorization: "approved" | "rejected" | "pending" | null;
    designer: "approved" | "rejected" | "pending" | null;
    finalQa: "approved" | "rejected" | "pending" | null;
    pm: "approved" | "rejected" | "pending" | null;
  };
  onApprovalClick: (type: string) => void;
  disabled?: boolean;
}

export function ApprovalButtons({ approvals, onApprovalClick, disabled }: ApprovalButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ApprovalButton
        label="Costing Approval"
        status={approvals.costing}
        onClick={() => onApprovalClick("costing")}
        disabled={disabled}
      />
      <ApprovalButton
        label="QA Approval"
        status={approvals.qa}
        onClick={() => onApprovalClick("qa")}
        disabled={disabled}
      />
      <ApprovalButton
        label="Final Authorization"
        status={approvals.finalAuthorization}
        onClick={() => onApprovalClick("finalAuthorization")}
        disabled={disabled}
      />
      <ApprovalButton
        label="Designer Approval"
        status={approvals.designer}
        onClick={() => onApprovalClick("designer")}
        disabled={disabled}
      />
      <ApprovalButton
        label="Final QA Approval"
        status={approvals.finalQa}
        onClick={() => onApprovalClick("finalQa")}
        disabled={disabled}
      />
      <ApprovalButton
        label="PM Approval"
        status={approvals.pm}
        onClick={() => onApprovalClick("pm")}
        disabled={disabled}
      />
    </div>
  );
} 