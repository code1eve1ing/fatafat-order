import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  Smartphone,
  ChevronRight,
  Store,
  Scissors,
  ShoppingBasket,
} from "lucide-react";

export function ShopAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Access Shop
          </CardTitle>
          <CardDescription>
            Enter shop code or scan QR code to browse products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shop Code Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-xs">
                1
              </span>
              Enter Shop Code
            </div>
            <div className="flex gap-2">
              <Input placeholder="e.g. SHOP-1234" />
              <Button>Go</Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* QR Code Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-xs">
                2
              </span>
              Scan QR Code
            </div>
            <Button variant="outline" className="w-full gap-2">
              <QrCode className="h-4 w-4" />
              Open QR Scanner
            </Button>
          </div>
        </CardContent>
        <CardContent className="border-t pt-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            Nearby Shops
          </h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Scissors className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div>Style Salon</div>
                <div className="text-xs text-muted-foreground">
                  Haircuts & Beauty
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <ShoppingBasket className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div>Daily Needs</div>
                <div className="text-xs text-muted-foreground">
                  Groceries & Essentials
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div>Rahul Furniture</div>
                <div className="text-xs text-muted-foreground">
                  Home Furniture
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
