import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold text-primary">ShopEasy</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">About</Button>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Login</Button>
          <Button>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simple shop management for{" "}
              <span className="text-primary">everyone</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're a salon owner, general store, or tile seller -
              manage your business effortlessly with our intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your Shop
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Enter Shop Code
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-primary/10 p-8 rounded-xl border border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Salon Owner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Manage appointments and products
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">General Store</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Track inventory and sales
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Tile Seller</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Showcase your catalog
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">More Businesses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Custom solutions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ShopEasy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed for small business owners who need simplicity without
              sacrificing power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">🚀</span>
                </div>
                <CardTitle>No Login Required</CardTitle>
                <CardDescription>
                  Start immediately without lengthy signup processes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">📱</span>
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Works perfectly on any device, optimized for mobile shop
                  owners
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">📊</span>
                </div>
                <CardTitle>Simple Analytics</CardTitle>
                <CardDescription>
                  Understand your business with clear, actionable insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-4">
                Ready to simplify your shop management?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Join thousands of small business owners who trust ShopEasy
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Create Your Shop
              </Button>
              <Button variant="outline" className="bg-transparent" size="lg">
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
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
                  S
                </div>
                <span className="text-xl font-bold text-primary">ShopEasy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple shop management for everyone
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
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
                    Updates
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    About
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Careers
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    Privacy
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
            © {new Date().getFullYear()} ShopEasy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
