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
import { ShoppingCart, ChevronRight, User, HelpCircle, X, ArrowLeft } from "lucide-react";
import { FloatingChat } from "../_common/FloatingChat";
import { LoginRegisterPopup } from "../_common/LoginRegisterPopup";
import { useState } from "react";
import useCustomerStore from "../../../store/customer";

export function CartPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    
    // Use customer store for cart data
    const { 
        getCart, 
        getCartTotal, 
        getCartItemCount, 
        removeFromCart, 
        updateCartQuantity 
    } = useCustomerStore();
    
    const cart = getCart();
    const cartTotal = getCartTotal();
    const deliveryFee = 29; // ₹29 delivery fee
    const tax = cartTotal * 0.05; // 5% GST
    const orderTotal = cartTotal + deliveryFee + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/customer/shop/${shopId}`)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                    </Button>

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            <h1 className="text-2xl font-bold">Your Cart</h1>
                            <Badge variant="secondary" className="ml-2">
                                {getCartItemCount()} items
                            </Badge>
                        </div>

                        {cart.length > 0 ? (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <Card key={item._id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                                                    {/* Product image would go here */}
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <CardTitle className="text-lg">{item.name}</CardTitle>
                                                        <button
                                                            onClick={() => removeFromCart(item._id)}
                                                            className="text-muted-foreground hover:text-destructive"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                                                    {item.menu_section_id && (
                                                        <Badge variant="outline">
                                                            {typeof item.menu_section_id === 'object' ? item.menu_section_id.name : 'Menu Item'}
                                                        </Badge>
                                                    )}
                                                    <div className="flex justify-between items-center mt-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                        <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                                <p className="text-muted-foreground mb-4">
                                    Browse the shop and add some items to get started
                                </p>
                                <Button onClick={() => navigate(`/customer/shop/${shopId}`)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-4 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={cart.length === 0}
                                    onClick={() => navigate(`/customer/shop/${shopId}/checkout`)}
                                >
                                    Proceed to Checkout <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
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