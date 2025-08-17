import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";

const mockTransactions = [
  { id: "TXN001", user: "john@example.com", amount: "₹500", type: "Add Funds", status: "Completed", date: "2024-08-15" },
  { id: "TXN002", user: "jane@example.com", amount: "100 Points", type: "Spend", status: "Completed", date: "2024-08-15" },
  { id: "TXN003", user: "bob@example.com", amount: "₹250", type: "Conversion", status: "Pending", date: "2024-08-14" },
  { id: "TXN004", user: "alice@example.com", amount: "₹1000", type: "Add Funds", status: "Failed", date: "2024-08-14" },
];

const mockWallets = [
  { user: "john@example.com", inrBalance: "₹1,250", pointsBalance: "850 Points", lastUpdated: "2024-08-15" },
  { user: "jane@example.com", inrBalance: "₹750", pointsBalance: "1,200 Points", lastUpdated: "2024-08-15" },
  { user: "bob@example.com", inrBalance: "₹500", pointsBalance: "300 Points", lastUpdated: "2024-08-14" },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions & Wallets</h1>
            <p className="text-muted-foreground">Monitor payments, wallets, and financial activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="wallets">Wallet Balances</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All user transactions and payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by user email, transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono">{transaction.id}</TableCell>
                          <TableCell>{transaction.user}</TableCell>
                          <TableCell className="font-medium">{transaction.amount}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Wallet Balances</CardTitle>
                <CardDescription>Overview of user INR and points balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>INR Balance</TableHead>
                        <TableHead>Points Balance</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWallets.map((wallet, index) => (
                        <TableRow key={index}>
                          <TableCell>{wallet.user}</TableCell>
                          <TableCell className="font-medium text-success">{wallet.inrBalance}</TableCell>
                          <TableCell className="font-medium text-primary">{wallet.pointsBalance}</TableCell>
                          <TableCell>{wallet.lastUpdated}</TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="ghost" size="sm">Edit Balance</Button>
                            <Button variant="ghost" size="sm">View History</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}