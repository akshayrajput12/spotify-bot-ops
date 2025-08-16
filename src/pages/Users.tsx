import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Edit,
  MoreHorizontal 
} from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "2024-01-15",
    kycStatus: "approved" as const,
    walletBalance: 2450.00,
    lastLogin: "2024-08-15 14:30",
    totalPlaytime: "127h 45m"
  },
  {
    id: "USR002", 
    name: "Jane Smith",
    email: "jane.smith@email.com",
    joinDate: "2024-02-20",
    kycStatus: "pending" as const,
    walletBalance: 890.50,
    lastLogin: "2024-08-14 09:15",
    totalPlaytime: "89h 20m"
  },
  {
    id: "USR003",
    name: "Mike Wilson",
    email: "mike.wilson@email.com", 
    joinDate: "2024-03-10",
    kycStatus: "rejected" as const,
    walletBalance: 0.00,
    lastLogin: "2024-08-13 16:45",
    totalPlaytime: "45h 10m"
  },
  {
    id: "USR004",
    name: "Sarah Connor",
    email: "sarah.connor@email.com",
    joinDate: "2024-04-05",
    kycStatus: "approved" as const,
    walletBalance: 1250.75,
    lastLogin: "2024-08-15 11:20",
    totalPlaytime: "203h 15m"
  },
  {
    id: "USR005",
    name: "David Lee",
    email: "david.lee@email.com",
    joinDate: "2024-05-12",
    kycStatus: "pending" as const,
    walletBalance: 675.25,
    lastLogin: "2024-08-15 08:30",
    totalPlaytime: "67h 50m"
  }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-success/10 text-success">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.kycStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage user accounts, KYC approvals, and wallet balances</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">12,483</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">23</div>
              <p className="text-sm text-muted-foreground">Pending KYC</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">11,890</div>
              <p className="text-sm text-muted-foreground">Approved KYC</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">570</div>
              <p className="text-sm text-muted-foreground">Rejected KYC</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Total Playtime</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{getStatusBadge(user.kycStatus)}</TableCell>
                      <TableCell>₹{user.walletBalance.toFixed(2)}</TableCell>
                      <TableCell>{user.totalPlaytime}</TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.kycStatus === "pending" && (
                            <>
                              <Button variant="ghost" size="icon" className="text-success">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {mockUsers.length} users
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}