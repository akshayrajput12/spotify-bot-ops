import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  FileText,
  Calendar,
  Clock,
  User,
  RefreshCw,
  AlertTriangle,
  ImageIcon,
  ExternalLink,
  Loader2
} from "lucide-react";
import {
  useKYCDocuments,
  useKYCStats,
  useKYCActions,
  useSearchAndFilter,
  usePagination
} from "@/hooks/useDatabase";

export default function KYC() {
  const { toast } = useToast();
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Search and filter state
  const { search, setSearch, debouncedSearch, filters, updateFilter } = useSearchAndFilter();
  const { page, limit, offset, nextPage, prevPage } = usePagination();
  
  // Data fetching
  const { data: kycDocuments, loading: kycLoading, refetch: refetchKYC } = useKYCDocuments({
    search: debouncedSearch,
    status: filters.status,
    limit,
    offset
  });
  
  const { data: kycStats, loading: statsLoading } = useKYCStats();
  const { updateKYCStatus, approveKYC, rejectKYC, loading: actionLoading } = useKYCActions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-success/10 text-success">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending Review</Badge>;
      case "under_review":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Under Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewKYC = (kyc: any) => {
    setSelectedKYC(kyc);
    setIsDetailsModalOpen(true);
  };

  const handleApproveKYC = async (kycId: string) => {
    const success = await approveKYC(kycId);
    if (success) {
      refetchKYC();
    }
  };

  const handleRejectKYC = async (kycId: string) => {
    const success = await rejectKYC(kycId, rejectionReason);
    if (success) {
      setRejectionReason("");
      refetchKYC();
    }
  };

  const handleImageView = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleRefresh = () => {
    refetchKYC();
  };

  const handleExportKYC = () => {
    toast({
      title: "Export Started",
      description: "KYC data export will be available shortly.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">KYC Management</h1>
            <p className="text-muted-foreground">Review and manage user KYC verification documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={kycLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${kycLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExportKYC}>
              <Download className="mr-2 h-4 w-4" />
              Export KYC Data
            </Button>
          </div>
        </div>

        {/* KYC Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kycStats?.pendingCount || 0}
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kycStats?.underReviewCount || 0}
              </div>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kycStats?.approvedCount || 0}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kycStats?.rejectedCount || 0}
              </div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* KYC List */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, KYC ID, or document number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KYC Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Details</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading KYC documents...</p>
                      </TableCell>
                    </TableRow>
                  ) : kycDocuments && kycDocuments.length > 0 ? (
                    kycDocuments.map((kyc) => (
                      <TableRow key={kyc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>{kyc.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{kyc.userName}</div>
                              <div className="text-sm text-muted-foreground">{kyc.userEmail}</div>
                              <div className="text-xs text-muted-foreground">{kyc.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {kyc.documentType}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{kyc.documentNumber}</TableCell>
                        <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {kyc.submittedDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {kyc.reviewedBy ? (
                            <div className="text-sm">
                              <div>{kyc.reviewedBy}</div>
                              <div className="text-muted-foreground text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {kyc.reviewedDate}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not reviewed</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewKYC(kyc)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(kyc.status === "pending" || kyc.status === "under_review") && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-success hover:bg-success/10"
                                  onClick={() => handleApproveKYC(kyc.id)}
                                  title="Approve KYC"
                                  disabled={actionLoading}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRejectKYC(kyc.id)}
                                  title="Reject KYC"
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No KYC submissions found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {kycDocuments?.length || 0} KYC submissions {search && `matching "${search}"`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={nextPage} disabled={!kycDocuments || kycDocuments.length < limit}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Details Modal */}
      {selectedKYC && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Details - {selectedKYC.userName}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm">{selectedKYC.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedKYC.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{selectedKYC.userDetails.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm">{selectedKYC.userDetails.dateOfBirth}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">{selectedKYC.userDetails.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Document Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                    <p className="text-sm">{selectedKYC.documentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document Number</label>
                    <p className="text-sm font-mono">{selectedKYC.documentNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedKYC.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                    <p className="text-sm">{selectedKYC.submittedDate}</p>
                  </div>
                  {selectedKYC.reviewedBy && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reviewed By</label>
                        <p className="text-sm">{selectedKYC.reviewedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reviewed Date</label>
                        <p className="text-sm">{selectedKYC.reviewedDate}</p>
                      </div>
                    </>
                  )}
                  {selectedKYC.rejectionReason && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                      <div className="mt-1 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <p className="text-sm text-destructive">{selectedKYC.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Document Front</label>
                      <div 
                        className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleImageView(selectedKYC.documents.front)}
                      >
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to view</p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground mx-auto mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Document Back</label>
                      <div 
                        className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleImageView(selectedKYC.documents.back)}
                      >
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to view</p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground mx-auto mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Selfie Photo</label>
                      <div 
                        className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleImageView(selectedKYC.documents.selfie)}
                      >
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to view</p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground mx-auto mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {(selectedKYC.status === "pending" || selectedKYC.status === "under_review") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          handleApproveKYC(selectedKYC.id);
                          setIsDetailsModalOpen(false);
                        }}
                        disabled={actionLoading}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve KYC
                      </Button>
                      <Button 
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          handleRejectKYC(selectedKYC.id);
                          setIsDetailsModalOpen(false);
                        }}
                        disabled={actionLoading || !rejectionReason.trim()}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject KYC
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rejection Reason (if rejecting)</label>
                      <Textarea
                        placeholder="Please provide a clear reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={selectedImage} 
              alt="Document" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg border"
            />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}