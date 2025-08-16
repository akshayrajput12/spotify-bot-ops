import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Clock, Target, Download, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";

const playtimeData = [
  { date: "2024-08-10", minutes: 45000 },
  { date: "2024-08-11", minutes: 52000 },
  { date: "2024-08-12", minutes: 48000 },
  { date: "2024-08-13", minutes: 61000 },
  { date: "2024-08-14", minutes: 55000 },
  { date: "2024-08-15", minutes: 68000 },
];

const topSongsData = [
  { song: "Shape of You", plays: 1250 },
  { song: "Blinding Lights", plays: 1180 },
  { song: "Stay", plays: 1050 },
  { song: "Good 4 U", plays: 920 },
  { song: "Levitating", plays: 850 },
];

const userSegmentData = [
  { name: "Premium Users", value: 65, color: "hsl(var(--primary))" },
  { name: "Free Users", value: 35, color: "hsl(var(--secondary))" },
];

const pointsEarnedData = [
  { date: "Aug 10", points: 12500 },
  { date: "Aug 11", points: 15200 },
  { date: "Aug 12", points: 13800 },
  { date: "Aug 13", points: 18100 },
  { date: "Aug 14", points: 16400 },
  { date: "Aug 15", points: 21300 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into platform performance and user behavior</p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avg. Session Time</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">24.5 min</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="text-green-600 font-medium">+12%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">User Retention</CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">87.2%</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="text-green-600 font-medium">+5.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">94.8%</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="text-green-600 font-medium">+2.3%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Growth Rate</CardTitle>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">+15.3%</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="text-green-600 font-medium">+8.1%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Total Minutes Played
              </CardTitle>
              <CardDescription className="text-gray-600">Daily playtime trends over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={playtimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                User Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">Premium vs Free users breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userSegmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {userSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Top Songs Played
              </CardTitle>
              <CardDescription className="text-gray-600">Most popular tracks on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSongsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="song" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="plays" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Points Earned
              </CardTitle>
              <CardDescription className="text-gray-600">Total points distributed to users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsEarnedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="points" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alert Thresholds */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              System Alerts
            </CardTitle>
            <CardDescription className="text-gray-600">Active notifications and threshold alerts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="bg-red-600">High Priority</Badge>
                  <span className="text-gray-900">Unusual playtime spike detected for user ID: 12345</span>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">Investigate</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>
                  <span className="text-gray-900">Bot efficiency dropped below 90% threshold</span>
                </div>
                <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}