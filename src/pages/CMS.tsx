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
import { FileText, Upload, Eye, Save, Plus, Edit3, Trash2, Globe, Calendar, Users } from "lucide-react";
import { useState } from "react";

export default function CMS() {
  const [activeTab, setActiveTab] = useState("rewards");

  const mockFAQs = [
    { id: 1, question: "How do I earn points?", category: "Points", status: "Published", lastUpdated: "2024-08-15" },
    { id: 2, question: "When will I receive my rewards?", category: "Rewards", status: "Draft", lastUpdated: "2024-08-14" },
    { id: 3, question: "How to connect Spotify account?", category: "Account", status: "Published", lastUpdated: "2024-08-13" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Manage user-facing content, FAQs, and terms</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
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
                    <Input id="pageTitle" placeholder="Earn Rewards | Spotify Playtime Enhancer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDesc">Meta Description</Label>
                    <Input id="metaDesc" placeholder="Earn points and rewards by listening to music on Spotify..." />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Hero Section</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input id="heroTitle" placeholder="Earn Amazing Rewards" />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Textarea id="heroSubtitle" placeholder="Listen to your favorite music and get rewarded for it!" rows={2} />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Hero Image
                      </Button>
                      <span className="text-sm text-muted-foreground">Current: hero-rewards.jpg</span>
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
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="featuredReward">Featured Reward</Label>
                        <Input id="featuredReward" placeholder="₹500 Gift Card for 10,000 points" />
                      </div>
                      <div>
                        <Label htmlFor="minRedemption">Minimum Redemption Text</Label>
                        <Input id="minRedemption" placeholder="Minimum 500 points required" />
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
                      <Input id="ctaText" placeholder="Start Earning Now" />
                    </div>
                    <div>
                      <Label htmlFor="ctaLink">CTA Link</Label>
                      <Input id="ctaLink" placeholder="/signup" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <Button>
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
                        {mockFAQs.map((faq) => (
                          <TableRow key={faq.id}>
                            <TableCell className="font-medium">{faq.question}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{faq.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {faq.status === "Published" ? (
                                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Published</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Draft</Badge>
                              )}
                            </TableCell>
                            <TableCell>{faq.lastUpdated}</TableCell>
                            <TableCell className="space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Editor */}
            <Card>
              <CardHeader>
                <CardTitle>FAQ Editor</CardTitle>
                <CardDescription>Create or edit FAQ content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="faqQuestion">Question</Label>
                    <Input id="faqQuestion" placeholder="Enter the FAQ question..." />
                  </div>
                  <div>
                    <Label htmlFor="faqCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="rewards">Rewards</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
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
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="faqPublish" />
                    <Label htmlFor="faqPublish">Publish immediately</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Save & Publish</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-6">
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
                      <Input id="termsVersion" placeholder="v1.2" />
                    </div>
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date</Label>
                      <Input id="effectiveDate" type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="termsContent">Terms Content</Label>
                    <Textarea 
                      id="termsContent" 
                      placeholder="Enter the complete terms and conditions..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="termsActive" defaultChecked />
                      <Label htmlFor="termsActive">Active version</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Preview</Button>
                      <Button>Update Terms</Button>
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
                      <Input id="privacyVersion" placeholder="v1.1" />
                    </div>
                    <div>
                      <Label htmlFor="privacyDate">Last Updated</Label>
                      <Input id="privacyDate" type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="privacyContent">Privacy Policy Content</Label>
                    <Textarea 
                      id="privacyContent" 
                      placeholder="Enter the privacy policy content..."
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Preview</Button>
                    <Button>Update Policy</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Content Update</span>
                </div>
                <span className="text-sm text-muted-foreground">Aug 15, 2024</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Content Views</span>
                </div>
                <span className="text-sm text-muted-foreground">12,543</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Published Items</span>
                </div>
                <span className="text-sm text-muted-foreground">27</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}