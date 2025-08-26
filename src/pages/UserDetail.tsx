import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  ArrowLeft,
  MoreHorizontal,
  FileImage,
  AlertCircle,
  Eye
} from "lucide-react";
import { UsersService } from "@/lib/database";
import { supabase } from "@/integrations/supabase/client";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentLoading, setDocumentLoading] = useState(false);

  useEffect(() => {
    // Check if we're on the specific route for akshayrajput2616
    if (location.pathname === "/user/akshayrajput2616") {
      // Use mock data for akshayrajput2616@gmail.com
      const mockUser = {
        id: "49f4762a-821c-40f6-9275-9908ccaad878",
        name: "Akshay Rajput",
        email: "akshayrajput2616@gmail.com",
        phone: "+91 XXXX-XXXX-XX",
        location: "Mumbai, India",
        joinDate: "23/8/2025",
        kycStatus: "pending",
        walletBalance: 0.00,
        totalTransactions: 47,
        totalPoints: 12450,
        totalPlaytime: "0h 0m",
        averageSession: "45 minutes",
        lastLogin: "Never",
        accountAge: "7 months",
        spotifyConnected: true,
        accountType: "Premium User",
        kycDocuments: []
      };
      setUser(mockUser);
      setLoading(false);
      
      // Mock documents for demonstration
      setDocuments([
        { id: 1, type: "aadhaar", document_url: "/placeholder.svg", file_name: "Aadhaar Card" },
        { id: 2, type: "pan", document_url: "/placeholder.svg", file_name: "PAN Card" }
      ]);
    } else {
      // Use the user ID from params
      const idToFetch = userId || "49f4762a-821c-40f6-9275-9908ccaad878";
      fetchUserDetails(idToFetch);
    }
  }, [userId, location.pathname]);

  const fetchUserDetails = async (id: string) => {
    try {
      setLoading(true);
      const userDetails = await UsersService.getUserById(id);
      setUser(userDetails);
      
      // Fetch actual documents from database
      await fetchUserDocuments(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const checkUserDocuments = async (userId: string) => {
    try {
      setDocumentLoading(true);
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setDocuments(data || []);
      
      // Check if user has both Aadhaar and PAN documents
      const hasAadhaar = data?.some(doc => doc.document_type === 'aadhaar');
      const hasPAN = data?.some(doc => doc.document_type === 'pan');
      
      return { hasAadhaar, hasPAN, documents: data || [] };
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to check user documents",
        variant: "destructive"
      });
      return { hasAadhaar: false, hasPAN: false, documents: [] };
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested user could not be found.</p>
            <Button onClick={() => navigate("/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">User Details</h1>
              <p className="text-muted-foreground">Detailed information for {user.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">User ID: {user.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button>Edit Profile</Button>
                    <Button variant="outline">Send Message</Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                  <p className="text-sm">{user.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">{user.location}</p>
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
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Playtime</p>
                  <p className="text-sm">{user.totalPlaytime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Session</p>
                  <p className="text-sm">{user.averageSession}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                  <p className="text-sm">{user.lastLogin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Age</p>
                  <p className="text-sm">{user.accountAge}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}