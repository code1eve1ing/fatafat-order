import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Store, MapPin, ChevronRight, User, HelpCircle } from "lucide-react";
import { LoginRegisterPopup } from "../_common/LoginRegisterPopup";
import { FloatingChat } from "../_common/FloatingChat";

export function NearbyShopsPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [nearbyShops, setNearbyShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch nearby shops
        const fetchShops = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be an actual API call with location data
                await new Promise(resolve => setTimeout(resolve, 800));
                setNearbyShops([
                    {
                        id: "shop-123",
                        name: "QuickMart Grocery",
                        distance: "0.5 km",
                        categories: ["Groceries", "Daily Needs"],
                        rating: 4.5,
                        open: true,
                        image: "/shop1.jpg"
                    },
                    {
                        id: "shop-456",
                        name: "FreshBites Cafe",
                        distance: "1.2 km",
                        categories: ["Cafe", "Bakery"],
                        rating: 4.2,
                        open: true,
                        image: "/shop2.jpg"
                    },
                    {
                        id: "shop-789",
                        name: "MediCare Pharmacy",
                        distance: "0.8 km",
                        categories: ["Pharmacy", "Health"],
                        rating: 4.7,
                        open: false,
                        image: "/shop3.jpg"
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShops();
    }, []);

    const filteredShops = nearbyShops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                            FO
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isLoggedIn && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowLoginPopup(true)}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowLoginPopup(true)}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                        {isLoggedIn && (
                            <Button variant="ghost" size="sm">
                                <User className="h-4 w-4 mr-2" />
                                Account
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Nearby Shops</h1>
                    <p className="text-muted-foreground">
                        Browse shops near your current location
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search shops or categories..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Shops List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredShops.length > 0 ? (
                        filteredShops.map((shop) => (
                            <Card key={shop.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="p-0">
                                    <div className="h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                                        {/* Shop image would go here */}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <Store className="h-12 w-12 text-gray-400" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex justify-between items-start">
                                        <CardTitle>{shop.name}</CardTitle>
                                        {shop.open ? (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Open
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {shop.distance} away
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {shop.categories.map((category) => (
                                            <span
                                                key={category}
                                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end">
                                    <Button
                                        size="sm"
                                        onClick={() => navigate(`/shop/${shop.id}`)}
                                    >
                                        View Shop <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="mx-auto max-w-md">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No shops found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filter to find what you're looking for.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Chat (would be conditionally rendered based on device detection) */}
            <FloatingChat shopId={null} />

            {/* Login/Register Popup */}
            <LoginRegisterPopup
                open={showLoginPopup}
                onOpenChange={setShowLoginPopup}
                onSuccess={() => setIsLoggedIn(true)}
            />
        </div>
    );
}