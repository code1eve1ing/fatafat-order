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
import { Search, ShoppingCart, ChevronRight, User, HelpCircle, Star, MapPin, Clock, Store, Plus, Trash2 } from "lucide-react";
import { LoginRegisterPopup } from "../_common/LoginRegisterPopup";
import { FloatingChat } from "../_common/FloatingChat";
import useCustomerStore from "@/store/customer";

export function ShopPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("products");
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        getShop,
        getProducts,
        getMenuSections,
        addToCart: addToStoreCart
    } = useCustomerStore();

    const shop = getShop();
    const products = getProducts(searchQuery, selectedSectionId);
    const menuSections = getMenuSections();

    useEffect(() => {
        // Simulate API calls to fetch shop and products
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch shop details
                await new Promise(resolve => setTimeout(resolve, 500));
                // Shop data is now loaded via ShopDataWrapper
                // No need to set mock data here
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [shopId]);

    // Products are already filtered by the store's getProducts function

    const addToCart = (product) => {
        addToStoreCart(product, 1);
        // Also update local cart for immediate UI feedback
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const handleSectionFilter = (sectionId) => {
        setSelectedSectionId(sectionId === selectedSectionId ? null : sectionId);
    };

    const resetFilters = () => {
        setSelectedSectionId(null);
        setSearchQuery("");
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
                                    {/* Menu Sections Filter */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Button
                                            variant={selectedSectionId === null ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedSectionId(null)}
                                        >
                                            All Items
                                        </Button>
                                        {menuSections.map(section => (
                                            <Button
                                                key={section._id}
                                                variant={selectedSectionId === section._id ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleSectionFilter(section._id)}
                                            >
                                                {section.name}
                                            </Button>
                                        ))}
                                        {(selectedSectionId || searchQuery) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={resetFilters}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Reset Filters
                                            </Button>
                                        )}
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

                        {/* Products List */}
                        <div className="divide-y divide-gray-100">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product._id} className="py-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden mr-4">
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <ShoppingCart className="h-8 w-8 text-gray-400" />

                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base font-medium mb-1 truncate">{product.name}</CardTitle>
                                                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                                                {!selectedSectionId && product.menu_section_id && (
                                                    <div className="mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {typeof product.menu_section_id === 'object'
                                                                ? product.menu_section_id.name
                                                                : menuSections.find(s => s._id === product.menu_section_id)?.name || 'Unknown Section'
                                                            }
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price and Add to Cart */}
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-base mb-2">₹{product.price?.toFixed(2) || '0.00'}</span>
                                                <div className="flex items-center">
                                                    {cart.some(item => item._id === product._id) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 text-red-500 hover:bg-red-50 mr-1"
                                                            onClick={() => removeFromCart(product._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <div className="relative">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-lg"
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                        {cart.some(item => item._id === product._id) && (
                                                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                                {cart.find(item => item._id === product._id)?.quantity || 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-500">
                                        {searchQuery || selectedSectionId
                                            ? 'Try adjusting your filters or search terms.'
                                            : 'No products available at the moment.'
                                        }
                                    </p>
                                    {(searchQuery || selectedSectionId) && (
                                        <Button
                                            variant="outline"
                                            onClick={resetFilters}
                                            className="mt-4"
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
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
                onSuccess={() => console.log('Login successful')}
            />
        </div>
    );
}