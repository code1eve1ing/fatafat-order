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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, ChevronRight, User, HelpCircle, ArrowLeft, CreditCard, QrCode, Wallet, Store, Loader2, CheckCircle } from "lucide-react";
import { LoginRegisterPopup } from "../_common/LoginRegisterPopup";
import { FloatingChat } from "../_common/FloatingChat";
import { OTPVerification } from "../../../components/common/OTPVerification";
import { useState, useEffect } from "react";
import useAuthStore from "../../../store/auth";
import useCustomerStore from "../../../store/customer";
import orderService from "../../../services/orderService";
import toast from "react-hot-toast";

export function CheckoutPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [deliveryOption, setDeliveryOption] = useState("pickup");
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [verifiedContact, setVerifiedContact] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Store hooks
    const { user } = useAuthStore();
    const { cart, cartTotal, shop, clearCart } = useCustomerStore();

    // Calculate totals
    const deliveryFee = deliveryOption === 'delivery' ? 2.99 : 0;
    const tax = cartTotal * 0.05; // 5% tax
    const orderTotal = cartTotal + deliveryFee + tax;

    // Check if user has verified contact info
    useEffect(() => {
        if (user?.email) {
            setVerifiedContact({
                type: 'email',
                identifier: user.email,
                verified: true
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if cart is empty
        if (!cart || cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Check if contact is verified
        if (!verifiedContact?.verified) {
            setShowOTPVerification(true);
            return;
        }

        await placeOrder();
    };

    const placeOrder = async () => {
        setIsPlacingOrder(true);

        try {
            // Prepare order data
            const orderData = {
                shop_id: shopId,
                customer_name: customerName.trim() || undefined,
                items: cart.map(item => ({
                    product_id: item._id,
                    product_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                subtotal: cartTotal,
                tax_amount: tax,
                total_amount: orderTotal,
                notes: orderNotes.trim() || undefined
            };

            // Add verified contact info
            if (verifiedContact.type === 'email') {
                orderData.customer_email = verifiedContact.identifier;
            } else {
                orderData.customer_mobile = verifiedContact.identifier;
            }

            const result = await orderService.createOrder(orderData);

            if (result.success) {
                toast.success('Order placed successfully!');
                clearCart();
                navigate(`/customer/shop/${shopId}/order-confirmation`, {
                    state: { orderData: result.data }
                });
            } else {
                toast.error(result.data?.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleOTPVerificationComplete = (contactInfo) => {
        setVerifiedContact(contactInfo);
        setShowOTPVerification(false);
        // Automatically place order after verification
        setTimeout(() => placeOrder(), 500);
    };

    const handleOTPVerificationCancel = () => {
        setShowOTPVerification(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/shop/${shopId}/cart`)}
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
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                            {/* Delivery Options */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Delivery Options</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={deliveryOption}
                                        onValueChange={setDeliveryOption}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                                            <Label
                                                htmlFor="delivery"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="h-5 w-5" />
                                                    <span>Delivery</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground mt-2">
                                                    ₹{deliveryFee.toFixed(2)} fee, arrives in 30-45 mins
                                                </span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                                            <Label
                                                htmlFor="pickup"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-5 w-5" />
                                                    <span>Pickup</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground mt-2">
                                                    Free, ready in 15-20 mins
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Customer Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="customerName">Name (Optional)</Label>
                                        <Input 
                                            id="customerName" 
                                            placeholder="Your name" 
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                    
                                    {verifiedContact ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="font-medium">Contact Verified</span>
                                            </div>
                                            <p className="text-sm text-green-600 mt-1">
                                                {verifiedContact.type === 'email' ? 'Email: ' : 'Mobile: '}
                                                {verifiedContact.identifier}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="text-sm text-yellow-700">
                                                You'll need to verify your email or mobile number before placing the order.
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                                        <Input 
                                            id="orderNotes" 
                                            placeholder="Special instructions, preferences, etc." 
                                            value={orderNotes}
                                            onChange={(e) => setOrderNotes(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onValueChange={setPaymentMethod}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                            <Label
                                                htmlFor="card"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <CreditCard className="h-5 w-5" />
                                                <span>Card</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="qr" id="qr" className="peer sr-only" />
                                            <Label
                                                htmlFor="qr"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <QrCode className="h-5 w-5" />
                                                <span>QR Code</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                            <Label
                                                htmlFor="cash"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <Wallet className="h-5 w-5" />
                                                <span>Cash</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {paymentMethod === "card" && (
                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input id="expiry" placeholder="MM/YY" required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" placeholder="123" required />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="cardName">Name on Card</Label>
                                                <Input id="cardName" placeholder="John Doe" required />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "qr" && (
                                        <div className="mt-6 text-center">
                                            <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center aspect-square max-w-xs mx-auto">
                                                <QrCode className="h-16 w-16 text-gray-400 mb-4" />
                                                <p className="text-muted-foreground">
                                                    Scan this QR code to complete payment
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "cash" && (
                                        <div className="mt-6 text-center">
                                            <p className="text-muted-foreground">
                                                Pay with cash when your order arrives
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {cart && cart.length > 0 ? cart.map(item => (
                                            <div key={item._id} className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        )) : (
                                            <div className="text-center text-muted-foreground py-4">
                                                Your cart is empty
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        {deliveryFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Delivery Fee</span>
                                                <span>₹{deliveryFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tax (5%)</span>
                                            <span>₹{tax.toFixed(2)}</span>
                                        </div>
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
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isPlacingOrder || !cart || cart.length === 0}
                                    >
                                        {isPlacingOrder ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                Place Order <ChevronRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>

            {/* Floating Chat (would be conditionally rendered based on device detection) */}
            <FloatingChat shopId={shopId} />

            {/* Login/Register Popup */}
            <LoginRegisterPopup
                open={showLoginPopup}
                onOpenChange={setShowLoginPopup}
                onSuccess={() => setIsLoggedIn(true)}
            />
            
            {/* OTP Verification Modal */}
            {showOTPVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <OTPVerification
                        onVerificationComplete={handleOTPVerificationComplete}
                        onCancel={handleOTPVerificationCancel}
                    />
                </div>
            )}
        </div>
    );
}