import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Wallet, 
  Clock, 
  MapPin, 
  Phone,
  CreditCard,
  Shield,
  Activity,
  FileText,
  Download,
  Trophy,
  AlertCircle,
  Eye
} from "lucide-react";
import { useUserById } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const { data: user, loading } = useUserById(userId);
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentLoading, setDocumentLoading] = useState(false);

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserDocuments(userId);
    }
  }, [userId, isOpen]);

  const fetchUserDocuments = async (userId: string) => {
    try {
      setDocumentLoading(true);
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user documents",
        variant: "destructive"
      });
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleViewDocument = async (document: any) => {
    try {
      // Create a signed URL for the document
      const { data, error } = await supabase
        .storage
        .from('kyc-documents')
        .createSignedUrl(document.document_url, 60); // URL valid for 60 seconds
        
      if (error) throw error;
      
      // Open the document in a new tab
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      });
    }
  };

  const handleDownloadAll = async () => {
    if (documents.length === 0) {
      toast({
        title: "No Documents Found",
        description: "No documents available for this user",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // For each document, create a signed URL and trigger download
      for (const document of documents) {
        const { data, error } = await supabase
          .storage
          .from('kyc-documents')
          .createSignedUrl(document.document_url, 60);
          
        if (error) throw error;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = document.file_name || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Download Started",
        description: "Documents are being downloaded"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download documents",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "under_review":
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-sm text-muted-foreground">{user.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status & Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status & Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">KYC Status</span>
                {getStatusBadge(user.kycStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Spotify Connected</span>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  {user.spotifyConnected ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Type</span>
                <Badge variant="outline">{user.accountType}</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">KYC Documents</h4>
                {documentLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {documents.map((document) => (
                        <Button 
                          key={document.id} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDocument(document)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View {document.document_type?.replace('_', ' ') || 'Document'}
                        </Button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadAll}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground py-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">No documents uploaded yet</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet & Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Current Balance</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">{user.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">{user.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity & Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Playtime</p>
                  <p className="text-sm text-muted-foreground">{user.totalPlaytime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Average Session</p>
                  <p className="text-sm text-muted-foreground">{user.averageSession}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account Age</p>
                  <p className="text-sm text-muted-foreground">{user.accountAge}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Removed as per request */}
          <div className="flex gap-3 pt-4 flex-wrap">
            <Button onClick={onClose} className="flex-1 min-w-[120px]">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}