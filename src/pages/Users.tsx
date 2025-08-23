import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserDetailsModal } from "@/components/modals/UserDetailsModal";
import { EditUserModal } from "@/components/modals/EditUserModal";
import { useToast } from "@/hooks/use-toast";
import { 
  useUsers, 
  useUserStats, 
  useUserActions,
  useSearchAndFilter,
  usePagination
} from "@/hooks/useDatabase";
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
  UserPlus,
  RefreshCw,
  Loader2
} from "lucide-react";

export default function Users() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Search and filter state
  const { search, setSearch, debouncedSearch, filters, updateFilter } = useSearchAndFilter();
  const { page, limit, offset, nextPage, prevPage, setLimit } = usePagination();
  
  // Data fetching
  const { data: users, loading: usersLoading, refetch: refetchUsers } = useUsers({
    search: debouncedSearch,
    status: filters.status,
    limit,
    offset
  });
  
  const { data: userStats, loading: statsLoading } = useUserStats();
  const { updateKycStatus, updateUserProfile, loading: actionLoading } = useUserActions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleApproveKYC = async (userId: string) => {
    const success = await updateKycStatus(userId, 'approved');
    if (success) {
      refetchUsers();
    }
  };

  const handleRejectKYC = async (userId: string) => {
    const success = await updateKycStatus(userId, 'rejected', 'Manual rejection by admin');
    if (success) {
      refetchUsers();
    }
  };

  const handleSaveUser = async (userData: any) => {
    if (selectedUser) {
      const success = await updateUserProfile(selectedUser.id, userData);
      if (success) {
        setIsEditModalOpen(false);
        refetchUsers();
      }
    }
  };

  const handleRefresh = () => {
    refetchUsers();
  };

  const handleExportUsers = () => {
    toast({
      title: "Export Started",
      description: "User data export will be available shortly.",
    });
  };

  // Loading state
  if (usersLoading && !users) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage user accounts, KYC approvals, and wallet balances</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={usersLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button onClick={handleExportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (userStats?.totalUsers || 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : userStats?.pendingKyc || 0}
              </div>
              <p className="text-sm text-muted-foreground">Pending KYC</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (userStats?.approvedKyc || 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Approved KYC</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : userStats?.rejectedKyc || 0}
              </div>
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
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
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading users...</p>
                      </TableCell>
                    </TableRow>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
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
                        <TableCell>₹{typeof user.walletBalance === 'number' ? user.walletBalance.toFixed(2) : '0.00'}</TableCell>
                        <TableCell>{user.totalPlaytime}</TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewUser(user)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.kycStatus === "pending" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-success hover:bg-success/10"
                                  onClick={() => handleApproveKYC(user.id)}
                                  title="Approve KYC"
                                  disabled={actionLoading}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRejectKYC(user.id)}
                                  title="Reject KYC"
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="More Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {users?.length || 0} users {search && `matching "${search}"`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={nextPage} disabled={!users || users.length < limit}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UserDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            user={selectedUser}
          />
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={selectedUser}
            onSave={handleSaveUser}
          />
        </>
      )}
    </AdminLayout>
  );
}