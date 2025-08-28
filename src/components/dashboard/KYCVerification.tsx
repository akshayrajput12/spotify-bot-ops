import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KYCVerificationProps {
  kycDocuments: any[];
  fetchKycDocuments: () => Promise<void>;
  user: any;
}

export function KYCVerification({ kycDocuments, fetchKycDocuments, user }: KYCVerificationProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Insert document record into database
      const { error: insertError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          document_url: fileName,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      // Reset form and refresh documents
      setSelectedFile(null);
      setDocumentType("");
      await fetchKycDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .createSignedUrl(document.document_url, 60); // URL valid for 60 seconds

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open document",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">Submit your documents for verification</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-input"
              >
                <option value="">Select document type</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Document File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="file:text-foreground"
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={uploading || !selectedFile || !documentType}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Document Guidelines */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Required Documents</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Aadhaar Card (Front and Back)</li>
                <li>• PAN Card</li>
                <li>• Passport Size Photo</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Document Requirements</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Clear, readable images</li>
                <li>• No glare or shadows</li>
                <li>• All corners visible</li>
                <li>• File size under 5MB</li>
                <li>• JPG, PNG, or PDF format</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <p className="text-sm">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Your documents are securely stored and only used for verification purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submitted Documents */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submitted Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kycDocuments.length > 0 ? (
            <div className="space-y-4">
              {kycDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDocument(doc)}
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Documents Submitted</h3>
              <p className="text-muted-foreground mb-4">
                Upload your documents to begin the verification process
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}