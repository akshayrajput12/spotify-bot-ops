import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Clock, Target, Download, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  usePlaytimeData,
  useTopSongs,
  useUserSegmentData,
  usePointsEarnedData,
  useAnalyticsKPIs
} from "@/hooks/useDatabase";



export default function Analytics() {
  const [dateRange, setDateRange] = useState("7d");
  const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
  const days = daysMap[dateRange as keyof typeof daysMap] || 7;
  
  // Fetch data using custom hooks
  const { data: kpis, loading: kpisLoading } = useAnalyticsKPIs();
  const { data: playtimeData, loading: playtimeLoading } = usePlaytimeData(days);
  const { data: topSongsData, loading: songsLoading } = useTopSongs(5);
  const { data: userSegmentData, loading: segmentLoading } = useUserSegmentData();
  const { data: pointsEarnedData, loading: pointsLoading } = usePointsEarnedData(days);
  
  const isLoading = kpisLoading || playtimeLoading || songsLoading || segmentLoading || pointsLoading;
  
  const handleExportReport = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics report...');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into platform performance and user behavior</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpisLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kpis?.avgSessionTime || '0 min'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Retention</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpisLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kpis?.userRetention || '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+5.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bot Efficiency</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpisLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kpis?.botEfficiency || '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+2.3%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpisLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : kpis?.growthRate || '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+8.1%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Minutes Played</CardTitle>
              <CardDescription>Daily playtime trends over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {playtimeLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={playtimeData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Premium vs Free users breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {segmentLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userSegmentData || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {(userSegmentData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Songs Played</CardTitle>
              <CardDescription>Most popular tracks on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {songsLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSongsData || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="song" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="plays" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Points Earned</CardTitle>
              <CardDescription>Total points distributed to users</CardDescription>
            </CardHeader>
            <CardContent>
              {pointsLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pointsEarnedData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Active notifications and threshold alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">High Priority</Badge>
                  <span>Unusual playtime spike detected for user ID: 12345</span>
                </div>
                <Button variant="ghost" size="sm">Investigate</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>
                  <span>Bot efficiency dropped below 90% threshold</span>
                </div>
                <Button variant="ghost" size="sm">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}