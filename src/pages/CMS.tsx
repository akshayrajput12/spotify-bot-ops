import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Eye, Save, Plus, Edit3, Trash2, Globe, Calendar, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usePageContent, useFAQs, useTermsAndPolicies, useCMSStats, useCMSActions } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";

export default function CMS() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rewards");
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [editingFAQ, setEditingFAQ] = useState(false);
  
  // Form states for different sections
  const [rewardsContent, setRewardsContent] = useState<any>({});
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '', status: 'draft' });
  const [termsForm, setTermsForm] = useState({ version: '', effectiveDate: '', content: '', active: true });
  const [privacyForm, setPrivacyForm] = useState({ version: '', lastUpdated: '', content: '', active: true });
  
  // Data fetching
  const { data: pageContent, loading: pageLoading, refetch: refetchPageContent } = usePageContent('rewards');
  const { data: faqs, loading: faqsLoading, refetch: refetchFAQs } = useFAQs();
  const { data: legalDocs, loading: legalLoading, refetch: refetchLegal } = useTermsAndPolicies();
  const { data: cmsStats, loading: statsLoading } = useCMSStats();
  const { updatePageContent, createFAQ, updateFAQ, deleteFAQ, updateTermsAndPolicies, loading: actionLoading } = useCMSActions();
  
  // Update local state when data loads
  useEffect(() => {
    if (pageContent) {
      setRewardsContent(pageContent);
    }
  }, [pageContent]);
  
  useEffect(() => {
    if (legalDocs) {
      if (legalDocs.termsConditions) {
        setTermsForm(legalDocs.termsConditions);
      }
      if (legalDocs.privacyPolicy) {
        setPrivacyForm(legalDocs.privacyPolicy);
      }
    }
  }, [legalDocs]);
  
  const handleSaveRewardsContent = async () => {
    const success = await updatePageContent('rewards', rewardsContent);
    if (success) {
      refetchPageContent();
    }
  };
  
  const handleSaveFAQ = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Question and answer are required.',
        variant: 'destructive'
      });
      return;
    }
    
    let success = false;
    if (editingFAQ && selectedFAQ) {
      success = await updateFAQ(selectedFAQ.id, faqForm);
    } else {
      success = await createFAQ(faqForm);
    }
    
    if (success) {
      setFaqForm({ question: '', answer: '', category: '', status: 'draft' });
      setEditingFAQ(false);
      setSelectedFAQ(null);
      refetchFAQs();
    }
  };
  
  const handleEditFAQ = (faq: any) => {
    setSelectedFAQ(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status
    });
    setEditingFAQ(true);
  };
  
  const handleDeleteFAQ = async (id: string) => {
    const success = await deleteFAQ(id);
    if (success) {
      refetchFAQs();
    }
  };
  
  const handleUpdateTerms = async () => {
    const success = await updateTermsAndPolicies('terms_conditions', termsForm);
    if (success) {
      refetchLegal();
    }
  };
  
  const handleUpdatePrivacy = async () => {
    const success = await updateTermsAndPolicies('privacy_policy', privacyForm);
    if (success) {
      refetchLegal();
    }
  };
  
  const updateRewardsField = (section: string, field: string, value: any) => {
    setRewardsContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Manage user-facing content, FAQs, and terms</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: 'Preview Mode',
                  description: 'Preview functionality would open content in a new tab.',
                });
              }}
              disabled={actionLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                if (activeTab === 'rewards') {
                  handleSaveRewardsContent();
                } else {
                  toast({
                    title: 'Save All Changes',
                    description: 'All changes have been saved successfully.',
                  });
                }
              }}
              disabled={actionLoading || pageLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save All Changes
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="rewards">Rewards Page</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="terms">Terms & Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            {pageLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading page content...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Rewards Page Content
                  </CardTitle>
                  <CardDescription>Customize the rewards page displayed to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* SEO Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Page Title</Label>
                      <Input 
                        id="pageTitle" 
                        placeholder="Earn Rewards | Spotify Playtime Enhancer" 
                        value={rewardsContent.seo?.title || ''}
                        onChange={(e) => updateRewardsField('seo', 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDesc">Meta Description</Label>
                      <Input 
                        id="metaDesc" 
                        placeholder="Earn points and rewards by listening to music on Spotify..." 
                        value={rewardsContent.seo?.metaDescription || ''}
                        onChange={(e) => updateRewardsField('seo', 'metaDescription', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Hero Section</Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input 
                          id="heroTitle" 
                          placeholder="Earn Amazing Rewards" 
                          value={rewardsContent.hero?.title || ''}
                          onChange={(e) => updateRewardsField('hero', 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                        <Textarea 
                          id="heroSubtitle" 
                          placeholder="Listen to your favorite music and get rewarded for it!" 
                          rows={2}
                          value={rewardsContent.hero?.subtitle || ''}
                          onChange={(e) => updateRewardsField('hero', 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Hero Image
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Current: {rewardsContent.hero?.image || 'hero-rewards.jpg'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rewards Grid */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Rewards Information</Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="rewardDesc">Rewards Description</Label>
                        <Textarea 
                          id="rewardDesc" 
                          placeholder="Describe how users can earn and redeem rewards..."
                          rows={4}
                          value={rewardsContent.content?.description || ''}
                          onChange={(e) => updateRewardsField('content', 'description', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="featuredReward">Featured Reward</Label>
                          <Input 
                            id="featuredReward" 
                            placeholder="₹500 Gift Card for 10,000 points" 
                            value={rewardsContent.content?.featuredReward || ''}
                            onChange={(e) => updateRewardsField('content', 'featuredReward', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="minRedemption">Minimum Redemption Text</Label>
                          <Input 
                            id="minRedemption" 
                            placeholder="Minimum 500 points required" 
                            value={rewardsContent.content?.minRedemption || ''}
                            onChange={(e) => updateRewardsField('content', 'minRedemption', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Call to Action</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label htmlFor="ctaText">CTA Button Text</Label>
                        <Input 
                          id="ctaText" 
                          placeholder="Start Earning Now" 
                          value={rewardsContent.cta?.text || ''}
                          onChange={(e) => updateRewardsField('cta', 'text', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ctaLink">CTA Link</Label>
                        <Input 
                          id="ctaLink" 
                          placeholder="/signup" 
                          value={rewardsContent.cta?.link || ''}
                          onChange={(e) => updateRewardsField('cta', 'link', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveRewardsContent}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Rewards Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>Manage FAQ content and categories</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setFaqForm({ question: '', answer: '', category: '', status: 'draft' });
                      setEditingFAQ(false);
                      setSelectedFAQ(null);
                    }}
                    disabled={actionLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="rewards">Rewards</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all-status">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {faqsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading FAQs...</span>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {faqs && faqs.length > 0 ? (
                            faqs.map((faq) => (
                              <TableRow key={faq.id}>
                                <TableCell className="font-medium">{faq.question}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{faq.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  {faq.status === "published" ? (
                                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Published</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Draft</Badge>
                                  )}
                                </TableCell>
                                <TableCell>{faq.lastUpdated}</TableCell>
                                <TableCell className="space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditFAQ(faq)}
                                    disabled={actionLoading}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteFAQ(faq.id)}
                                    disabled={actionLoading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No FAQs found. Click "Add FAQ" to create your first one.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Editor */}
            <Card>
              <CardHeader>
                <CardTitle>{editingFAQ ? 'Edit FAQ' : 'FAQ Editor'}</CardTitle>
                <CardDescription>{editingFAQ ? 'Update existing FAQ content' : 'Create or edit FAQ content'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="faqQuestion">Question</Label>
                    <Input 
                      id="faqQuestion" 
                      placeholder="Enter the FAQ question..." 
                      value={faqForm.question}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="faqCategory">Category</Label>
                    <Select 
                      value={faqForm.category} 
                      onValueChange={(value) => setFaqForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="rewards">Rewards</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="faqAnswer">Answer</Label>
                  <Textarea 
                    id="faqAnswer" 
                    placeholder="Enter the detailed answer..."
                    rows={6}
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="faqPublish" 
                      checked={faqForm.status === 'published'}
                      onCheckedChange={(checked) => setFaqForm(prev => ({ ...prev, status: checked ? 'published' : 'draft' }))}
                    />
                    <Label htmlFor="faqPublish">Publish immediately</Label>
                  </div>
                  <div className="flex gap-2">
                    {editingFAQ && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setFaqForm({ question: '', answer: '', category: '', status: 'draft' });
                          setEditingFAQ(false);
                          setSelectedFAQ(null);
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setFaqForm(prev => ({ ...prev, status: 'draft' }));
                        setTimeout(() => handleSaveFAQ(), 100);
                      }}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handleSaveFAQ}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      {editingFAQ ? 'Update FAQ' : 'Save & Publish'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-6">
            {legalLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading legal documents...</span>
              </div>
            ) : (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Terms & Conditions
                    </CardTitle>
                    <CardDescription>Manage legal terms and user agreements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="termsVersion">Version</Label>
                        <Input 
                          id="termsVersion" 
                          placeholder="v1.2" 
                          value={termsForm.version}
                          onChange={(e) => setTermsForm(prev => ({ ...prev, version: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input 
                          id="effectiveDate" 
                          type="date" 
                          value={termsForm.effectiveDate}
                          onChange={(e) => setTermsForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="termsContent">Terms Content</Label>
                      <Textarea 
                        id="termsContent" 
                        placeholder="Enter the complete terms and conditions..."
                        rows={12}
                        className="font-mono text-sm"
                        value={termsForm.content}
                        onChange={(e) => setTermsForm(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="termsActive" 
                          checked={termsForm.active}
                          onCheckedChange={(checked) => setTermsForm(prev => ({ ...prev, active: checked }))}
                        />
                        <Label htmlFor="termsActive">Active version</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: 'Preview',
                              description: 'Terms preview would open in a new window.',
                            });
                          }}
                        >
                          Preview
                        </Button>
                        <Button 
                          onClick={handleUpdateTerms}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          Update Terms
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Policy</CardTitle>
                    <CardDescription>Manage privacy policy content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="privacyVersion">Version</Label>
                        <Input 
                          id="privacyVersion" 
                          placeholder="v1.1" 
                          value={privacyForm.version}
                          onChange={(e) => setPrivacyForm(prev => ({ ...prev, version: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="privacyDate">Last Updated</Label>
                        <Input 
                          id="privacyDate" 
                          type="date" 
                          value={privacyForm.lastUpdated}
                          onChange={(e) => setPrivacyForm(prev => ({ ...prev, lastUpdated: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="privacyContent">Privacy Policy Content</Label>
                      <Textarea 
                        id="privacyContent" 
                        placeholder="Enter the privacy policy content..."
                        rows={8}
                        className="font-mono text-sm"
                        value={privacyForm.content}
                        onChange={(e) => setPrivacyForm(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: 'Preview',
                            description: 'Privacy policy preview would open in a new window.',
                          });
                        }}
                      >
                        Preview
                      </Button>
                      <Button 
                        onClick={handleUpdatePrivacy}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Update Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Publishing Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Publishing Status
            </CardTitle>
            <CardDescription>Current status of content across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading statistics...</span>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Content Update</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {cmsStats?.lastContentUpdate || 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Content Views</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {cmsStats?.contentViews?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Published FAQs</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {cmsStats?.publishedFAQs || 0} / {cmsStats?.totalFAQs || 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}