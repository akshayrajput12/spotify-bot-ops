import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, RefreshCw, CreditCard } from "lucide-react";
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
            <h1 className="text-3xl font-bold text-gray-900">Transactions & Wallets</h1>
            <p className="text-gray-600 mt-1">Monitor payments, wallets, and financial activities</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-gray-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 p-1">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Transactions</TabsTrigger>
            <TabsTrigger value="wallets" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Wallet Balances</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-gray-600">All user transactions and payment activities</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by user email, transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
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

                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Transaction ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">User</TableHead>
                        <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
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
            <Card className="border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  User Wallet Balances
                </CardTitle>
                <CardDescription className="text-gray-600">Overview of user INR and points balances</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">User</TableHead>
                        <TableHead className="font-semibold text-gray-700">INR Balance</TableHead>
                        <TableHead className="font-semibold text-gray-700">Points Balance</TableHead>
                        <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWallets.map((wallet, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
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