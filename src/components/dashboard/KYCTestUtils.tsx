import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useKYCDocuments,
  useKYCStats,
  useKYCActions,
} from "@/hooks/useDatabase";

export function KYCApprovalTestComponent() {
  const { toast } = useToast();
  const { data: kycDocuments } = useKYCDocuments();
  const { approveKYC, rejectKYC, loading: actionLoading } = useKYCActions();
  
  const handleApproveKYC = async (kycId: string) => {
    const success = await approveKYC(kycId);
    if (success) {
      toast({
        title: 'Success',
        description: 'KYC status updated to approved',
      });
    }
    return success;
  };

  const handleRejectKYC = async (kycId: string) => {
    const success = await rejectKYC(kycId, "Test rejection reason");
    if (success) {
      toast({
        title: 'Success',
        description: 'KYC status updated to rejected',
      });
    }
    return success;
  };

  if (!kycDocuments || kycDocuments.length === 0) {
    return <div>No KYC documents found</div>;
  }

  const kyc = kycDocuments[0];

  return (
    <div>
      <h1>KYC Approval Test Component</h1>
      <div>
        <p>User: {kyc.userName}</p>
        <p>Status: {kyc.status}</p>
        <Button 
          className="text-success"
          onClick={() => handleApproveKYC(kyc.id)}
          disabled={actionLoading}
          title="Approve KYC"
        >
          Approve
        </Button>
        <Button 
          className="text-destructive"
          onClick={() => handleRejectKYC(kyc.id)}
          disabled={actionLoading}
          title="Reject KYC"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}