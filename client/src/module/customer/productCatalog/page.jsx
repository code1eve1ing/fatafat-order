import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, ChevronDown, Plus, Minus } from "lucide-react";
import { useState } from "react";

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Haircut",
      price: 300,
      category: "Services",
      description: "Professional haircut with styling",
    },
    {
      id: 2,
      name: "Shampoo",
      price: 120,
      category: "Products",
      description: "300ml bottle, for all hair types",
    },
    {
      id: 3,
      name: "Beard Trim",
      price: 150,
      category: "Services",
      description: "Precision beard trimming",
    },
    {
      id: 4,
      name: "Hair Color",
      price: 500,
      category: "Services",
      description: "Premium hair coloring service",
    },
    {
      id: 5,
      name: "Hair Oil",
      price: 180,
      category: "Products",
      description: "Natural hair growth oil",
    },
  ];

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing?.quantity === 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Style Salon</h1>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            Filter <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Categories */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">₹{product.price}</div>
              </CardContent>
              <CardFooter>
                {cartItem ? (
                  <div className="flex items-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      {cartItem.quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addToCart(product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={() => addToCart(product.id)}
                  >
                    <Plus className="h-4 w-4" /> Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Cart Floating Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button className="gap-2 shadow-lg h-14 px-6 rounded-full">
            <ShoppingCart className="h-5 w-5" />
            View Cart ({cartCount})
            <span className="ml-2 bg-white text-primary rounded-full px-2 py-1 text-sm">
              ₹
              {cart.reduce((sum, item) => {
                const product = products.find((p) => p.id === item.id);
                return sum + (product?.price || 0) * item.quantity;
              }, 0)}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
