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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Plus,
  Search,
  ShoppingCart,
  ChevronDown,
  CalendarDays,
  User,
  X,
  Menu,
  LineChart,
  Package,
  Users,
  Calendar,
  Edit,
} from "lucide-react";
import { useState } from "react";

export function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample order data
  const orders = [
    {
      id: "ORD-1256",
      customer: "Rahul Sharma",
      date: "Today, 11:30 AM",
      amount: "₹2,450",
      status: "completed",
      items: 3,
    },
    {
      id: "ORD-1255",
      customer: "Priya Patel",
      date: "Today, 10:15 AM",
      amount: "₹1,850",
      status: "completed",
      items: 2,
    },
    {
      id: "ORD-1254",
      customer: "Amit Singh",
      date: "Today, 9:45 AM",
      amount: "₹3,200",
      status: "pending",
      items: 5,
    },
    {
      id: "ORD-1253",
      customer: "Neha Gupta",
      date: "Yesterday, 5:30 PM",
      amount: "₹4,950",
      status: "completed",
      items: 4,
    },
    {
      id: "ORD-1252",
      customer: "Sanjay Verma",
      date: "Yesterday, 3:15 PM",
      amount: "₹1,250",
      status: "cancelled",
      items: 1,
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Processing</Badge>;
    }
  };

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
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 bg-accent"
          >
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
            <h1 className="text-2xl font-bold">Order Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Order
              </Button>
            </div>
          </div>
          {/* Mobile Search - Only visible on small screens */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Order Content */}
        <main className="p-4 md:p-6">
          {/* Order Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                All Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                Last 7 Days <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                Sort By <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                {filteredOrders.length} orders found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items} items</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <ShoppingCart className="h-4 w-4" /> View
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              {order.status === "pending" && (
                                <DropdownMenuItem className="gap-2 text-red-600">
                                  <X className="h-4 w-4" /> Cancel
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {filteredOrders.length} of {filteredOrders.length}{" "}
                orders
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +1 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  -2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  New Customers
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  +1 from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
