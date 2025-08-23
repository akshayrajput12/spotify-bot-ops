import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { 
  useTransactions, 
  useWalletBalances,
  useSearchAndFilter,
  usePagination
} from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";



export default function Transactions() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transactions");
  
  // Search and filter state
  const { search, setSearch, debouncedSearch, filters, updateFilter } = useSearchAndFilter();
  const { page, limit, offset, nextPage, prevPage } = usePagination();
  
  // Data fetching
  const { data: transactions, loading: transactionsLoading, refetch: refetchTransactions } = useTransactions({
    search: debouncedSearch,
    status: filters.status,
    limit,
    offset
  });
  
  const { data: walletBalances, loading: walletsLoading, refetch: refetchWallets } = useWalletBalances();

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleRefresh = () => {
    if (activeTab === "transactions") {
      refetchTransactions();
    } else {
      refetchWallets();
    }
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Transaction data export will be available shortly.",
    });
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
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={transactionsLoading || walletsLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${(transactionsLoading || walletsLoading) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="transactions" onValueChange={setActiveTab} className="space-y-6">
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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      {transactionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2 text-muted-foreground">Loading transactions...</p>
                          </TableCell>
                        </TableRow>
                      ) : transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-mono">{transaction.id}</TableCell>
                            <TableCell>{transaction.user}</TableCell>
                            <TableCell className="font-medium">{transaction.amount}</TableCell>
                            <TableCell className="capitalize">{transaction.type}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No transactions found</p>
                          </TableCell>
                        </TableRow>
                      )}
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
                      {walletsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2 text-muted-foreground">Loading wallet data...</p>
                          </TableCell>
                        </TableRow>
                      ) : walletBalances && walletBalances.length > 0 ? (
                        walletBalances.map((wallet, index) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">No wallet data found</p>
                          </TableCell>
                        </TableRow>
                      )}
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