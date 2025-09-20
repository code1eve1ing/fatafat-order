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
  Search,
  Trash2,
  Edit,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "../_common/Sidebar";
import { AddProductModal } from "../_common/AddProduct";
import useShopkeeper from "@/hooks/useShopkeeper";
import useShopStore from "@/store/shop";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function ProductsPage() {

  // Local variables
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Use shopkeeper hook
  const { deleteProduct } = useShopkeeper();
  const { getProducts, getMenuSections } = useShopStore();
  const products = getProducts(searchQuery, selectedSectionId);
  const sections = getMenuSections();


  // Modal handlers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const _ = {
    TITLE: "Menu Items",
    DESCRIPTION: "Your Menu Items",
    SUB_DESCRIPTION: "items found",
    SEARCH_PLACEHOLDER: "Search Items...",
  }


  const handleSelect = (value) => {
    setSelectedSectionId(value === "all" ? null : value)
  }

  const handleEdit = (product) => {
    setIsEditModalOpen(true)
    setEditData(product)
  }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product._id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold ml-14 md:ml-0">{_.TITLE}</h1>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={_.SEARCH_PLACEHOLDER}
                  className="pl-10 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <AddProductModal />
            </div>
          </div>
          {/* Mobile Search - Only visible on small screens */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={_.SEARCH_PLACEHOLDER}
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
          {
            products.length > 0 || selectedSectionId !== null ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white">
                  {/* <Button variant="outline" className="w-full justify-between" onClick={() => setIsOpen(true)}>
                    All Categories <ChevronDown className="ml-2 h-4 w-4" />
                  </Button> */}
                  <Select onValueChange={handleSelect} defaultValue="all">
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder="Select a menu section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Menu Sections</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section._id} value={String(section._id)}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                All Stock Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div> */}
                {/* <div className="flex-1">
              <Button variant="outline" className="w-full justify-between">
                Sort By <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div> */}
              </div>
            ) : (
              null
            )
          }
          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>{_.DESCRIPTION}</CardTitle>
              <CardDescription>
                {products.length} {_.SUB_DESCRIPTION}
              </CardDescription>
            </CardHeader>
            {
              products.length > 0 ? (
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Menu Section</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product.name}
                            </TableCell>
                            <TableCell>{product.price}</TableCell>
                            {/* TODO: improve below */}
                            <TableCell>{product.section || product.menu_section_id.name}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2" onClick={() => handleEdit(product)}>
                                    <Edit className="h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 text-red-600" onClick={() => { handleDelete(product) }}>
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
              ) : (
                <CardContent className="flex items-center justify-between">
                  {searchQuery ? <span className="underline" onClick={() => setSearchQuery("")}> Clear Search</span>
                    :
                    <AddProductModal variant="link" linkText="Create a New Item" />
                  }
                </CardContent>
              )}
            {/* <CardFooter className="flex justify-between">
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
            </CardFooter> */}
          </Card>
        </main>
        {
          isEditModalOpen && <AddProductModal isEdit variant="hidden" linkText="Edit Item" data={editData} handler={{
            isOpen: isEditModalOpen, onClose: () => {
              setIsEditModalOpen(false)
              setEditData(null)
            }
          }} />
        }
      </div>
    </div >
  );
}
