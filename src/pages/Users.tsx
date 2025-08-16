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
  MoreHorizontal,
  AlertCircle
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
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Unknown</Badge>;
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
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, KYC approvals, and wallet balances</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-300">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">12,483</div>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <p className="text-sm text-gray-600">Pending KYC</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-yellow-600 font-medium">-8.2%</span>
                <span className="text-gray-500 ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">11,890</div>
                  <p className="text-sm text-gray-600">Approved KYC</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-green-600 font-medium">+15.3%</span>
                <span className="text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">570</div>
                  <p className="text-sm text-gray-600">Rejected KYC</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-red-600 font-medium">+2.1%</span>
                <span className="text-xs text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User List
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
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
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">User</TableHead>
                    <TableHead className="font-semibold text-gray-700">Join Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">KYC Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Wallet Balance</TableHead>
                    <TableHead className="font-semibold text-gray-700">Total Playtime</TableHead>
                    <TableHead className="font-semibold text-gray-700">Last Login</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.id}</div>
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
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{mockUsers.length}</span> users
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}