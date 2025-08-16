import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Plus,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function ShopkeeperDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Navigation Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold">My Shop</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LineChart className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Package className="h-4 w-4" /> Products
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <ShoppingCart className="h-4 w-4" /> Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" /> Customers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Calendar className="h-4 w-4" /> Analytics
          </Button>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-[200px] md:w-[300px]"
                />
              </div>
              <Button variant="outline">Share Shop</Button>
            </div>
          </div>
          {/* Mobile Search - Only visible on small screens */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-full" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Sales
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,450</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Orders
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +5 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  New Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Popular Product
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ceramic Tiles</div>
                <p className="text-xs text-muted-foreground">12 sold today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Last 5 orders from your shop</CardDescription>
              </div>
              <Button size="sm" className="gap-1 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-1256</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>₹2,450</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        Today, 11:30 AM
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-1255</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>₹1,850</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        Today, 10:15 AM
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-1254</TableCell>
                      <TableCell>Amit Singh</TableCell>
                      <TableCell>₹3,200</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        Today, 9:45 AM
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Limited Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Package className="h-6 w-6" />
                  Add Product
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Create Order
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  View Customers
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <LineChart className="h-6 w-6" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️ Guest Mode</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800 mb-4">
                  You're using guest mode with limited features. Sign up to
                  access complete order history, advanced analytics, and more
                  features.
                </p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Sign Up Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
