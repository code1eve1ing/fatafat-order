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
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Edit,
  Package,
  ChevronDown,
  Menu,
  LineChart,
  ShoppingCart,
  X,
  Users,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Wooden Chair",
      price: "₹1,250",
      stock: 12,
      category: "Furniture",
    },
    {
      id: 2,
      name: "Ceramic Tiles",
      price: "₹450",
      stock: 56,
      category: "Building Materials",
    },
    { id: 3, name: "Shampoo", price: "₹120", stock: 25, category: "Beauty" },
    {
      id: 4,
      name: "Barber Chair",
      price: "₹8,750",
      stock: 2,
      category: "Salon Equipment",
    },
    {
      id: 5,
      name: "Wall Mirror",
      price: "₹850",
      stock: 8,
      category: "Home Decor",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 bg-accent"
          >
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
            <h1 className="text-2xl font-bold">Product Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
          {/* Mobile Search - Only visible on small screens */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Product Content */}
        <main className="p-4 md:p-6">
          {/* Product Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                All Categories <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                All Stock Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                Sort By <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>
                {filteredProducts.length} products found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 5
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
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
                Showing 1 to {filteredProducts.length} of{" "}
                {filteredProducts.length} products
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
        </main>
      </div>
    </div>
  );
}
