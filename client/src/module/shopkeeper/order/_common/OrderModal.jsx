import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ShoppingCart,
  Search,
  Trash2,
  ChevronRight,
} from "lucide-react";
import useShopkeeperStore from "@/store/shopkeeper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import shopkeeperService from "@/services/shopkeeperService";

// TODO: optimize to support all kind of shop-types
export function OrderModal({ variant = "default", linkText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Product selection, 2: Order summary
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const { getProducts, getMenuSections, addOrder } = useShopkeeperStore();
  const products = getProducts(searchQuery, selectedSectionId);
  const sections = getMenuSections();

  const _ = {
    BUTTON_TEXT: "Add New Order",
    DIALOG_TITLE: "Create New Order",
    DIALOG_DESCRIPTION: "Select products and create a new order",
  };

  // TODO: truncate text

  const handleProductSelect = (product) => {
    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p._id === product._id);
      if (existingIndex >= 0) {
        // If product already selected, remove it
        return prev.filter((p) => p._id !== product._id);
      } else {
        // Add product with quantity 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleSelect = (value) => {
    setSelectedSectionId(value === "all" ? null : value);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setSelectedProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  const removeProduct = (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this product?"
    );
    if (!confirm) return;
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handleCreateOrder = () => {
    // Here you would typically save the order to your store/service
    const now = moment();
    const orderDetails = {
      items: selectedProducts.map((p) => ({
        ...p,
        sectionName: sections.find((s) => s._id === p.section)?.name,
      })),
      status: orderStatus,
      totalAmount: calculateTotal(),
      notes,
      date: now.format("DD-MM-YYYY"),
      time: now.format("HH-mm"),
    };
    shopkeeperService.saveOrder(orderDetails, (order) => {
      addOrder(order);
      console.log("Order saved:", order);
    });

    // Reset and close
    setSelectedProducts([]);
    setOrderStatus("pending");
    setNotes("");
    setCurrentStep(1);
    setIsOpen(false);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when modal closes
      setCurrentStep(1);
      setSelectedProducts([]);
      setOrderStatus("pending");
      setNotes("");
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "link" ? (
          <span className="underline">{linkText || _.BUTTON_TEXT}</span>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />{" "}
            <span className="hidden md:inline">{_.BUTTON_TEXT}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="hidden">
          <DialogTitle className="text-xl"></DialogTitle>
          <DialogDescription>{_.DIALOG_DESCRIPTION}</DialogDescription>
        </DialogHeader>

        {currentStep === 1 ? (
          // Product Selection Step
          <div className="space-y-4 p-4 flex flex-col h-[90vh] overflow-hidden">
            {/* Search and Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex-1 bg-white ">
                {/* <Button variant="outline" className="w-full justify-between" onClick={() => setIsOpen(true)}>
                    All Categories <ChevronDown className="ml-2 h-4 w-4" />
                  </Button> */}
                <Select onValueChange={handleSelect} defaultValue="all">
                  <SelectTrigger className="w-2/3 rounded-lg">
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="border-b pb-2 pt-0.5 text-sm text-gray-500">
                {_.DIALOG_DESCRIPTION}
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 overflow-y-auto overflow-x-hidden">
              {products.map((product) => {
                const isSelected = selectedProducts.some(
                  (p) => p._id === product._id
                );
                const selectedProduct = isSelected
                  ? selectedProducts.find((p) => p._id === product._id)
                  : null;

                return (
                  <div
                    key={product._id}
                    className={`border rounded-lg py-2 px-3 h-fit cursor-pointer transition-all duration-200 flex justify-between ${isSelected
                        ? "border-1 border-green-300 bg-green-50/50"
                        : "border-gray-200"
                      }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-700 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ₹{product.price}
                        {selectedProduct?.quantity > 1 ? (
                          <>
                            {" "}
                            x {selectedProduct.quantity} = ₹
                            {product.price * selectedProduct.quantity}
                          </>
                        ) : null}
                        {/* {(product.price * selectedProduct?.quantity).toFixed(2)} */}
                      </p>
                    </div>

                    {/* {isSelected ? (
                         
                        ) : (
                          null
                        )} */}
                    {isSelected && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            updateQuantity(
                              product._id,
                              selectedProduct.quantity - 1
                            );
                            if (selectedProduct.quantity > 1) {
                              e.stopPropagation();
                            }
                          }}
                        >
                          -
                        </Button>
                        <span
                          className="w-8 text-center text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectedProduct.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            updateQuantity(
                              product._id,
                              selectedProduct.quantity + 1
                            );
                            e.stopPropagation();
                          }}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {products.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "No products found" : "No products available"}
                </h3>
                <p className="text-sm text-gray-600">
                  {searchQuery
                    ? "Try a different search term"
                    : "You need to create products before you can make orders."}
                </p>
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} product
                    {selectedProducts.length !== 1 ? "s" : ""} selected
                  </span>
                  <Button onClick={() => setCurrentStep(2)}>
                    Next <ChevronRight className=" h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Order Summary Step
          <div className="space-y-6 p-4 flex flex-col h-[90vh] max-h-[90vh] items-start overflow-y-scroll">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(1)}
              className="gap-2 mb-4 -ml-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back to products
            </Button>

            <div className="space-y-4 w-full">
              <Textarea
                id="notes"
                placeholder="Notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="border rounded-lg w-full flex flex-col max-h-[calc(100%-260px)] ">
              <div className="p-3 border-b">
                <h3 className="font-medium">Summary</h3>
              </div>
              <div className="p-3 space-y-3 flex-1 overflow-y-scroll overflow-x-hidden">
                {selectedProducts.map((product) => (
                  <div key={product._id} className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-700 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ₹{product.price}
                        {product.quantity > 1 ? (
                          <>
                            {" "}
                            x {product.quantity} ={" "}
                            <span className="font-medium text-gray-600">
                              ₹{product.price * product.quantity}
                            </span>
                          </>
                        ) : null}
                        {/* {(product.price * selectedProduct?.quantity).toFixed(2)} */}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() =>
                          updateQuantity(product._id, product.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="w-4 text-center text-sm font-medium">
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() =>
                          updateQuantity(product._id, product.quantity + 1)
                        }
                      >
                        +
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2"></div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-end w-full font-medium px-4">
              Total&nbsp;&nbsp;
              <span className="text-lg">₹{calculateTotal().toFixed(2)}</span>
            </p>

            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={selectedProducts.length === 0}
              >
                Create Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
