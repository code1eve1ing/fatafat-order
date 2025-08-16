import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  User,
  Mail,
  MapPin,
} from "lucide-react";
// import { Link } from "react-router-dom";

export function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            {/* <Link to="/cart">
              <ArrowLeft className="h-5 w-5" />
            </Link> */}
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      {/* Checkout Form */}
      <div className="p-4 space-y-4">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="Enter your email" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="Enter your phone number" type="tel" />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input placeholder="Enter your address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input placeholder="Enter your city" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pincode</label>
                <Input placeholder="Enter pincode" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-3">
              <CreditCard className="h-5 w-5" />
              Credit/Debit Card
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Smartphone className="h-5 w-5" />
              UPI Payment
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <MapPin className="h-5 w-5" />
              Cash on Delivery
            </Button>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹1,690</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (18%)</span>
              <span>₹304.20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span>₹1,994.20</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-14 text-lg">Complete Payment</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
