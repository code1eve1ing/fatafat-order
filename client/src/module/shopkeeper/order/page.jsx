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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Edit,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "../_common/Sidebar";
import shopkeeperService from "@/services/shopkeeperService";
import useShopStore from "@/store/shop";
import { OrderModal } from "./_common/OrderModal";
import moment from "moment";

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setProducts, setMenuSections, setOrders, getOrders, updateOrder } = useShopStore()
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const handleStatusChange = async (order, newStatus) => {
    order.status = newStatus
    shopkeeperService.updateOrder(order, (updatedOrder) => {
      updateOrder(updatedOrder)
    })
  };

  // Order status options
  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  // Sort options
  const sortOptions = [
    { id: "date_desc", label: "Newest First" },
    { id: "date_asc", label: "Oldest First" },
    { id: "amount_desc", label: "Amount: High to Low" },
    { id: "amount_asc", label: "Amount: Low to High" }
  ];

  // Get filtered and sorted orders
  const orders = getOrders(
    searchQuery,
    selectedStatus === "all" ? null : selectedStatus,
    sortBy
  )

  // const orders = orders.filter(
  //   (order) =>
  //     order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.id.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed <ChevronDown className="h-3 w-3 opacity-50" /></Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing <ChevronDown className="h-3 w-3 opacity-50" /></Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending <ChevronDown className="h-3 w-3 opacity-50" /></Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled <ChevronDown className="h-3 w-3 opacity-50" /></Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Processing <ChevronDown className="h-3 w-3 opacity-50" /></Badge>;
    }
  };

  useEffect(() => {
    const products = shopkeeperService.getProducts()
    setProducts(products)
    const sections = shopkeeperService.getSections()
    setMenuSections(sections)
    const orders = shopkeeperService.getOrders()
    setOrders(orders)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold ml-13">Orders</h1>
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
              <OrderModal />
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                {orders.length} orders found
              </CardDescription>
            </CardHeader>
            {
              orders.length > 0 ? (
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Items</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Order ID</TableHead>
                          {/* <TableHead>Date</TableHead> */}
                          {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell><p className="max-w-20 truncate" onClick={() => { alert(order.items.map(i => i.name).join(', \n').concat("\n\n", 'Notes: \n', order.notes)) }} dangerouslySetInnerHTML={{ __html: order.items.map(i => i.name).join(', <br/>') }}></p></TableCell>
                            <TableCell>₹ {order.totalAmount}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-6 p-0 hover:bg-transparent">
                                    {getStatusBadge(order.status)}

                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-40">
                                  {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      className="flex items-center justify-between"
                                      onClick={() => handleStatusChange(order, status)}
                                    >
                                      <span className="capitalize">{status}</span>
                                      {order.status === status && <Check className="h-4 w-4" />}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>{moment(order.time, "HH-mm").format("hh:mm A")}</TableCell>
                            <TableCell>{order._id}</TableCell>
                            {/* <TableCell>{moment(order.date, "DD-MM-YYYY").format("DD/MM/YYYY")}</TableCell> */}
                            {/* <TableCell className="text-right">
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
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex items-center justify-between">
                  {searchQuery ? <span className="underline" onClick={() => setSearchQuery("")}> Clear Search</span>
                    : selectedStatus !== 'all' ? <span className="text-gray-600">Status: <span className="capitalize">{selectedStatus}</span></span> :
                      <OrderModal variant="link" linkText="Create a New Order" />
                  }
                </CardContent>
              )}
            {/* <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {orders.length} of {orders.length}{" "}
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
            </CardFooter> */}
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
                <div className="text-2xl font-bold">{getOrders().length}</div>
                {/* <p className="text-xs text-muted-foreground">
                  +1 from yesterday
                </p> */}
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
                <div className="text-2xl font-bold">{getOrders().filter(o => o.status === "pending").length}</div>
                {/* <p className="text-xs text-muted-foreground">
                  -2 from yesterday
                </p> */}
              </CardContent>
            </Card>

            {/* <Card>
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
            </Card> */}
          </div>
        </main>
      </div>
    </div>
  );
}
