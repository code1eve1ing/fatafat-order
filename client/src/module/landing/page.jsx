import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Store,
  ShoppingCart,
  Package,
  BarChart,
  Smartphone,
  QrCode,
  User,
  ChevronRight,
} from "lucide-react";
import { ShopkeeperAuth } from "./components/ShopkeeperAuth";
import { ShopAccessModal } from "./components/ShopAccessModal";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            FO
          </div>
          <span className="text-xl font-bold text-primary">Fatafat Order</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">How It Works</Button>
          <Button variant="ghost">Testimonials</Button>
        </div>
        <div className="flex space-x-4">
          {/* <ShopkeeperAuth /> */}
          <Button>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-primary">Sell</span> and{" "}
            <span className="text-primary">Shop</span> Made Simple
          </h1>
          <p className="text-lg text-muted-foreground mt-6">
            Whether you're a business owner or customer, FatafatOrder provides
            the simplest way to manage your shop or discover local stores.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <ShopkeeperAuth />
            <ShopAccessModal />
          </div>
        </div>
      </section>

      {/* How It Works - Tabs */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <Tabs defaultValue="shopkeeper" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shopkeeper" className="gap-2">
                <Store className="h-4 w-4" /> Shopkeeper
              </TabsTrigger>
              <TabsTrigger value="customer" className="gap-2">
                <User className="h-4 w-4" /> Customer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shopkeeper">
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Package className="text-primary" />
                    </div>
                    <CardTitle>Add Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Create your product catalog in minutes, no technical
                      skills needed.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <ShoppingCart className="text-primary" />
                    </div>
                    <CardTitle>Accept Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Customers can order without accounts using simple device
                      identification.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <BarChart className="text-primary" />
                    </div>
                    <CardTitle>View Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Basic sales analytics to understand your business
                      performance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customer">
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Smartphone className="text-primary" />
                    </div>
                    <CardTitle>Find Shops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Browse nearby shops or enter a shop code to view products.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <ShoppingCart className="text-primary" />
                    </div>
                    <CardTitle>Shop Without Login</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Add items to cart and checkout without creating an
                      account.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <QrCode className="text-primary" />
                    </div>
                    <CardTitle>Easy Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Multiple payment options including QR code payments at
                      physical stores.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Unified CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-4">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Join thousands of shopkeepers and customers using FatafatOrder
                daily
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="gap-2">
                <Store className="h-4 w-4" /> Create Your Shop
              </Button>
              <Button
                variant="outline"
                className="bg-transparent gap-2"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4" /> Browse Shops{" "}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                  FO
                </div>
                <span className="text-xl font-bold text-primary">
                  Fatafat Order
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple solutions for shopkeepers and customers
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Shopkeepers</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Features
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Pricing
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Getting Started
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Find Shops
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    How to Order
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    FAQs
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <div className="flex space-x-2">
                <Input placeholder="Your email" />
                <Button variant="outline">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FatafatOrder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
