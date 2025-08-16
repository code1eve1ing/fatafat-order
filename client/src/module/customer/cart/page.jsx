import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, ArrowLeft, Trash2, ChevronDown } from "lucide-react";
// import { Link } from "react-router-dom";

export function CartPage() {
  // Sample cart data
  const cartItems = [
    { id: 1, name: "Haircut", price: 300, quantity: 1 },
    { id: 2, name: "Shampoo", price: 120, quantity: 2 },
    { id: 3, name: "Beard Trim", price: 150, quantity: 1 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/catalog">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>
      </header>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">
                  ₹{item.price} × {item.quantity}
                </div>
              </div>
              <div className="font-bold">₹{item.price * item.quantity}</div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Delivery Options */}
        <Card>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Delivery Option</div>
              <Button variant="ghost" className="gap-2">
                Store Pickup <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="p-4 border-b">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Button */}
      <div className="p-4 sticky bottom-0 bg-white border-t">
        <Button className="w-full h-14 text-lg">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
