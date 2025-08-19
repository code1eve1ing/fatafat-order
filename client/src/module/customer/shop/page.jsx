import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, ChevronRight, User, HelpCircle, Star, MapPin, Clock, Store } from "lucide-react";
import { LoginRegisterPopup } from "../_common/LoginRegisterPopup";
import { FloatingChat } from "../_common/FloatingChat";

export function ShopPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API calls to fetch shop and products
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch shop details
                await new Promise(resolve => setTimeout(resolve, 500));
                setShop({
                    id: shopId,
                    name: "QuickMart Grocery",
                    description: "Your neighborhood grocery store with fresh produce and daily essentials",
                    rating: 4.5,
                    distance: "0.5 km",
                    categories: ["Groceries", "Daily Needs"],
                    open: true,
                    hours: "8:00 AM - 10:00 PM",
                    address: "123 Main Street, Cityville",
                    image: "/shop1.jpg"
                });

                // Fetch products
                await new Promise(resolve => setTimeout(resolve, 500));
                setProducts([
                    {
                        id: "prod-1",
                        name: "Fresh Apples",
                        price: 2.99,
                        description: "Crisp and juicy, 1kg pack",
                        category: "Fruits",
                        image: "/apple.jpg"
                    },
                    {
                        id: "prod-2",
                        name: "Whole Wheat Bread",
                        price: 3.49,
                        description: "Freshly baked, 500g loaf",
                        category: "Bakery",
                        image: "/bread.jpg"
                    },
                    {
                        id: "prod-3",
                        name: "Organic Milk",
                        price: 4.99,
                        description: "1 liter, pasteurized",
                        category: "Dairy",
                        image: "/milk.jpg"
                    },
                    {
                        id: "prod-4",
                        name: "Eggs (Dozen)",
                        price: 3.99,
                        description: "Farm fresh, large eggs",
                        category: "Dairy",
                        image: "/eggs.jpg"
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [shopId]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()))

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </Button>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="relative"
                            onClick={() => navigate(`/shop/${shopId}/cart`)}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardHeader>
                                        <div className="h-40 bg-gray-200 rounded-lg"></div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : shop ? (
                    <>
                        {/* Shop Header */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3 lg:w-1/4">
                                    <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                                        <Store className="h-12 w-12 text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
                                    <div className="flex items-center mb-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                                        <span className="font-medium">{shop.rating}</span>
                                        <span className="text-muted-foreground mx-2">•</span>
                                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                                        <span className="text-muted-foreground">{shop.distance} away</span>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        {shop.open ? (
                                            <>
                                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                                <span>Open now</span>
                                                <span className="text-muted-foreground mx-2">•</span>
                                                <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                                                <span className="text-muted-foreground">{shop.hours}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                                                <span>Closed now</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mb-4">{shop.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {shop.categories.map(category => (
                                            <Badge key={category} variant="secondary">
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Categories */}
                        <div className="mb-8">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="p-0">
                                            <div className="h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                                                {/* Product image would go here */}
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <CardTitle className="mb-1">{product.name}</CardTitle>
                                            <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center">
                                            <span className="font-bold">${product.price.toFixed(2)}</span>
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="mx-auto max-w-md">
                                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No products found</h3>
                                        <p className="text-muted-foreground">
                                            Try adjusting your search to find what you're looking for.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Shop not found</h3>
                        <p className="text-muted-foreground mb-4">
                            The shop you're looking for doesn't exist or may have been removed.
                        </p>
                        <Button onClick={() => navigate('/customer/nearby-shops')}>
                            Browse Nearby Shops
                        </Button>
                    </div>
                )}
            </main>

            {/* Floating Chat (would be conditionally rendered based on device detection) */}
            <FloatingChat shopId={shopId} />

            {/* Login/Register Popup */}
            <LoginRegisterPopup
                open={showLoginPopup}
                onOpenChange={setShowLoginPopup}
                onSuccess={() => setIsLoggedIn(true)}
            />
        </div>
    );
}